import type { ReasoningEffort } from "../models";
import {
  DEFAULT_TIMEOUT_MS,
  goApiKey,
  readErrorBody,
  requireContent,
  sendGoRequest,
} from "./http";
import type { ModelCallResult, Provider } from "./types";

interface MessagesApiResponse {
  model?: string;
  content?: Array<{ type?: string; text?: string }>;
  stop_reason?: string | null;
  usage?: { input_tokens?: number; output_tokens?: number };
  error?: { message?: string };
}

const THINKING_BUDGETS: Record<Exclude<ReasoningEffort, "none">, number> = {
  minimal: 1024,
  low: 2048,
  medium: 4096,
  high: 8192,
};

export const messagesProvider: Provider = async ({
  model,
  messages,
  sessionId,
  temperature,
  maxTokens = 6000,
  reasoningEffort,
  timeoutMs = DEFAULT_TIMEOUT_MS,
}): Promise<ModelCallResult> => {
  const system = messages
    .filter((message) => message.role === "system")
    .map((message) => message.content)
    .join("\n\n");

  const body: Record<string, unknown> = {
    model: model.id,
    max_tokens: maxTokens,
    messages: messages
      .filter((message) => message.role !== "system")
      .map((message) => ({ role: message.role, content: message.content })),
    ...(system ? { system } : {}),
    ...(temperature !== undefined ? { temperature } : {}),
  };

  if (reasoningEffort && reasoningEffort !== "none") {
    const budget = Math.min(
      THINKING_BUDGETS[reasoningEffort],
      Math.max(1024, Math.floor(maxTokens * 0.4)),
    );
    if (budget < maxTokens) {
      body.thinking = { type: "enabled", budget_tokens: budget };
    }
  }

  const extraHeaders = {
    "x-api-key": goApiKey(),
    "anthropic-version": "2023-06-01",
  };

  let response: Response | null = null;

  for (let attempt = 0; attempt < 4; attempt += 1) {
    response = await sendGoRequest({
      path: "/messages",
      sessionId,
      timeoutMs,
      body,
      extraHeaders,
    });

    if (response.ok || response.status !== 400) {
      break;
    }

    const errorBody = await readErrorBody(response);
    let removed = false;

    if (body.thinking && /thinking|reasoning/i.test(errorBody)) {
      delete body.thinking;
      removed = true;
    } else if (body.temperature !== undefined && /temperature/i.test(errorBody)) {
      delete body.temperature;
      removed = true;
    } else if (body.system && /system/i.test(errorBody)) {
      delete body.system;
      body.messages = [
        { role: "user", content: system },
        ...(body.messages as Array<{ role: string; content: string }>),
      ];
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

  const data = (await response.json()) as MessagesApiResponse;
  const content = (data.content ?? [])
    .filter((block) => block.type === "text" && typeof block.text === "string")
    .map((block) => block.text as string)
    .join("\n");
  const finishReason = data.stop_reason ?? null;

  requireContent(content, model.id, finishReason, data.error?.message);

  if (finishReason === "max_tokens") {
    throw new Error(
      `OpenCode Go response for ${model.id} was cut off before completion (stop_reason=max_tokens)`,
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
