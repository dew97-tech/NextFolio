import {
  DEFAULT_TIMEOUT_MS,
  ensureNotTruncated,
  readErrorBody,
  requireContent,
  sendGoRequest,
} from "./http";
import type { ModelCallResult, Provider } from "./types";

interface ChatCompletionResponse {
  model?: string;
  cost?: number | string;
  usage?: {
    prompt_tokens?: number;
    completion_tokens?: number;
  };
  choices?: Array<{
    finish_reason?: string | null;
    message?: {
      content?: string | null;
      reasoning_content?: string | null;
    };
  }>;
  error?: { message?: string; param?: string; type?: string };
}

function parseCost(raw: number | string | undefined): number | undefined {
  if (typeof raw === "number") {
    return Number.isFinite(raw) ? raw : undefined;
  }
  if (raw === undefined || raw === null || raw === "") {
    return undefined;
  }
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export const chatProvider: Provider = async ({
  model,
  messages,
  sessionId,
  temperature = 0.7,
  maxTokens = 6000,
  reasoningEffort,
  timeoutMs = DEFAULT_TIMEOUT_MS,
  jsonMode = true,
}): Promise<ModelCallResult> => {
  const baseBody: Record<string, unknown> = {
    model: model.id,
    messages,
    temperature,
    max_tokens: maxTokens,
    stream: false,
    ...(jsonMode ? { response_format: { type: "json_object" } } : {}),
  };

  let response = await sendGoRequest({
    path: "/chat/completions",
    sessionId,
    timeoutMs,
    body: reasoningEffort
      ? { ...baseBody, reasoning_effort: reasoningEffort }
      : baseBody,
  });

  if (!response.ok && response.status === 400 && reasoningEffort) {
    const errorBody = await readErrorBody(response);
    if (/reasoning/i.test(errorBody)) {
      const withoutReasoning = { ...baseBody };
      response = await sendGoRequest({
        path: "/chat/completions",
        sessionId,
        timeoutMs,
        body: withoutReasoning,
      });
    } else {
      throw new Error(
        `OpenCode Go request failed (400) for ${model.id}: ${errorBody.slice(0, 300)}`,
      );
    }
  }

  if (!response.ok && response.status === 400) {
    const errorBody = await readErrorBody(response);
    if (/response_format/i.test(errorBody)) {
      const withoutJsonMode = { ...baseBody };
      delete withoutJsonMode.response_format;
      response = await sendGoRequest({
        path: "/chat/completions",
        sessionId,
        timeoutMs,
        body: withoutJsonMode,
      });
    } else {
      throw new Error(
        `OpenCode Go request failed (400) for ${model.id}: ${errorBody.slice(0, 300)}`,
      );
    }
  }

  if (!response.ok) {
    const body = await readErrorBody(response);
    throw new Error(
      `OpenCode Go request failed (${response.status}) for ${model.id}: ${body.slice(0, 300)}`,
    );
  }

  const data = (await response.json()) as ChatCompletionResponse;
  const choice = data.choices?.[0];
  const content = choice?.message?.content ?? "";
  const finishReason = choice?.finish_reason ?? null;

  requireContent(content, model.id, finishReason, data.error?.message);
  ensureNotTruncated(finishReason, model.id);

  return {
    content,
    finishReason,
    model: data.model ?? model.id,
    inputTokens: data.usage?.prompt_tokens,
    outputTokens: data.usage?.completion_tokens,
    cost: parseCost(data.cost),
  };
};
