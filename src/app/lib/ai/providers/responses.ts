import {
  DEFAULT_TIMEOUT_MS,
  readErrorBody,
  requireContent,
  sendGoRequest,
} from "./http";
import type { ModelCallResult, Provider } from "./types";

interface ResponsesApiResponse {
  model?: string;
  output_text?: string;
  status?: string;
  incomplete_details?: { reason?: string };
  output?: Array<{
    type?: string;
    content?: Array<{ type?: string; text?: string }>;
  }>;
  usage?: { input_tokens?: number; output_tokens?: number };
  error?: { message?: string };
}

function extractText(data: ResponsesApiResponse): string {
  if (typeof data.output_text === "string" && data.output_text.trim()) {
    return data.output_text;
  }

  const parts: string[] = [];
  for (const item of data.output ?? []) {
    if (item.type !== "message" || !Array.isArray(item.content)) continue;
    for (const block of item.content) {
      if (block.type === "output_text" && typeof block.text === "string") {
        parts.push(block.text);
      }
    }
  }
  return parts.join("\n");
}

export const responsesProvider: Provider = async ({
  model,
  messages,
  sessionId,
  temperature,
  maxTokens = 6000,
  reasoningEffort,
  timeoutMs = DEFAULT_TIMEOUT_MS,
  jsonMode = true,
}): Promise<ModelCallResult> => {
  const system = messages
    .filter((message) => message.role === "system")
    .map((message) => message.content)
    .join("\n\n");

  const body: Record<string, unknown> = {
    model: model.id,
    input: messages
      .filter((message) => message.role !== "system")
      .map((message) => ({ role: message.role, content: message.content })),
    max_output_tokens: maxTokens,
    ...(temperature !== undefined ? { temperature } : {}),
    ...(system ? { instructions: system } : {}),
    ...(jsonMode ? { text: { format: { type: "json_object" } } } : {}),
    ...(reasoningEffort ? { reasoning: { effort: reasoningEffort } } : {}),
  };

  let response: Response | null = null;

  for (let attempt = 0; attempt < 4; attempt += 1) {
    response = await sendGoRequest({
      path: "/responses",
      sessionId,
      timeoutMs,
      body,
    });

    if (response.ok || response.status !== 400) {
      break;
    }

    const errorBody = await readErrorBody(response);
    let removed = false;

    if (body.reasoning && /reasoning/i.test(errorBody)) {
      delete body.reasoning;
      removed = true;
    } else if (body.text && /(text|format|json)/i.test(errorBody)) {
      delete body.text;
      removed = true;
    } else if (body.temperature !== undefined && /temperature/i.test(errorBody)) {
      delete body.temperature;
      removed = true;
    } else if (body.instructions && /instruction/i.test(errorBody)) {
      delete body.instructions;
      removed = true;
    }

    if (!removed) {
      throw new Error(
        `OpenCode Go request failed (400) for ${model.id}: ${errorBody.slice(0, 300)}`,
      );
    }
  }

  if (!response || !response.ok) {
    const bodyText = response ? await readErrorBody(response) : "";
    throw new Error(
      `OpenCode Go request failed (${response?.status ?? "unknown"}) for ${model.id}: ${bodyText.slice(0, 300)}`,
    );
  }

  const data = (await response.json()) as ResponsesApiResponse;
  const content = extractText(data);
  const finishReason =
    data.status === "incomplete"
      ? (data.incomplete_details?.reason ?? "incomplete")
      : (data.status ?? null);

  requireContent(content, model.id, finishReason, data.error?.message);

  if (finishReason === "max_output_tokens") {
    throw new Error(
      `OpenCode Go response for ${model.id} was cut off before completion (incomplete: max_output_tokens)`,
    );
  }

  return {
    content,
    finishReason,
    model: data.model ?? model.id,
    inputTokens: data.usage?.input_tokens,
    outputTokens: data.usage?.output_tokens,
  };
};
