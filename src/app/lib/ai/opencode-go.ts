const GO_CHAT_COMPLETIONS_URL = "https://opencode.ai/zen/go/v1/chat/completions";

const REQUEST_TIMEOUT_MS = 110_000;

export type ReasoningEffort = "none" | "minimal" | "low" | "medium" | "high";

export const GO_MODELS = [
  {
    id: "glm-5.3-flash",
    label: "GLM-5.3-Flash",
    reasoningEffort: "none",
    maxTokens: 6000,
  },
  {
    id: "deepseek-v4.1-flash",
    label: "DeepSeek V4.1 Flash",
    reasoningEffort: "none",
    maxTokens: 6000,
  },
  {
    id: "mimo-v2.5",
    label: "MiMo-V2.5",
    reasoningEffort: "none",
    maxTokens: 6000,
  },
] as const satisfies ReadonlyArray<{
  id: string;
  label: string;
  reasoningEffort: ReasoningEffort;
  maxTokens: number;
}>;

export type GoModelId = (typeof GO_MODELS)[number]["id"];

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface ChatCompletionParams {
  model: GoModelId;
  messages: ChatMessage[];
  sessionId: string;
  temperature?: number;
  maxTokens?: number;
  reasoningEffort?: ReasoningEffort;
  timeoutMs?: number;
  jsonMode?: boolean;
}

export interface ChatCompletionResult {
  content: string;
  finishReason: string | null;
  model: string;
  inputTokens?: number;
  outputTokens?: number;
  cost?: number;
}

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

async function sendRequest(
  apiKey: string,
  sessionId: string,
  body: Record<string, unknown>,
  timeoutMs: number,
): Promise<Response> {
  return fetch(GO_CHAT_COMPLETIONS_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      "User-Agent": "david-portfolio-blog-bot/1.0",
      "x-opencode-session": sessionId,
    },
    body: JSON.stringify(body),
    cache: "no-store",
    signal: AbortSignal.timeout(timeoutMs),
  });
}

export async function chatCompletion({
  model,
  messages,
  sessionId,
  temperature = 0.7,
  maxTokens = 6000,
  reasoningEffort,
  timeoutMs = REQUEST_TIMEOUT_MS,
  jsonMode = true,
}: ChatCompletionParams): Promise<ChatCompletionResult> {
  const apiKey = process.env.OPENCODE_GO_API_KEY;
  if (!apiKey) {
    throw new Error("OPENCODE_GO_API_KEY is not configured");
  }

  const baseBody: Record<string, unknown> = {
    model,
    messages,
    temperature,
    max_tokens: maxTokens,
    stream: false,
    ...(jsonMode ? { response_format: { type: "json_object" } } : {}),
  };

  let response = await sendRequest(
    apiKey,
    sessionId,
    reasoningEffort ? { ...baseBody, reasoning_effort: reasoningEffort } : baseBody,
    timeoutMs,
  );

  if (!response.ok && response.status === 400 && reasoningEffort) {
    const errorBody = await response.text().catch(() => "");
    if (/reasoning/i.test(errorBody)) {
      const withoutReasoning = { ...baseBody };
      delete withoutReasoning.reasoning_effort;
      response = await sendRequest(apiKey, sessionId, withoutReasoning, timeoutMs);
    } else {
      throw new Error(
        `OpenCode Go request failed (400) for ${model}: ${errorBody.slice(0, 300)}`,
      );
    }
  }

  if (!response.ok && response.status === 400) {
    const errorBody = await response.text().catch(() => "");
    if (/response_format/i.test(errorBody)) {
      const withoutJsonMode = { ...baseBody };
      delete withoutJsonMode.response_format;
      response = await sendRequest(apiKey, sessionId, withoutJsonMode, timeoutMs);
    } else {
      throw new Error(
        `OpenCode Go request failed (400) for ${model}: ${errorBody.slice(0, 300)}`,
      );
    }
  }

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(
      `OpenCode Go request failed (${response.status}) for ${model}: ${body.slice(0, 300)}`,
    );
  }

  const data = (await response.json()) as ChatCompletionResponse;
  const choice = data.choices?.[0];
  const content = choice?.message?.content ?? "";
  const finishReason = choice?.finish_reason ?? null;

  if (!content) {
    const providerError = data.error?.message ?? "empty response";
    throw new Error(
      `OpenCode Go returned no content for ${model}: ${providerError} (finish_reason=${finishReason})`,
    );
  }

  if (finishReason === "length") {
    throw new Error(
      `OpenCode Go response for ${model} was cut off before completion (finish_reason=length)`,
    );
  }

  const parsedCost =
    typeof data.cost === "number"
      ? data.cost
      : data.cost !== undefined && data.cost !== null && data.cost !== ""
        ? Number(data.cost)
        : undefined;

  return {
    content,
    finishReason,
    model: data.model ?? model,
    inputTokens: data.usage?.prompt_tokens,
    outputTokens: data.usage?.completion_tokens,
    cost: Number.isFinite(parsedCost) ? parsedCost : undefined,
  };
}

function repairJson(source: string): string {
  let inString = false;
  let escaped = false;
  let output = "";

  for (const char of source) {
    const code = char.charCodeAt(0);

    if (inString) {
      if (escaped) {
        const validEscape = char === '"' || char === "\\" || char === "/" || char === "b" || char === "f" || char === "n" || char === "r" || char === "t" || char === "u";
        output += validEscape ? char : `\\${char}`;
        escaped = false;
        continue;
      }

      if (char === "\\") {
        output += char;
        escaped = true;
        continue;
      }

      if (char === '"') {
        output += char;
        inString = false;
        continue;
      }

      if (code < 0x20) {
        if (char === "\n") output += "\\n";
        else if (char === "\r") output += "\\r";
        else if (char === "\t") output += "\\t";
        else output += `\\u${code.toString(16).padStart(4, "0")}`;
        continue;
      }

      output += char;
      continue;
    }

    if (char === '"') {
      inString = true;
    }

    output += char;
  }

  return output;
}

export function extractJsonObject(raw: string): unknown {
  const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const source = fenced ? fenced[1] : raw;
  const start = source.indexOf("{");
  const end = source.lastIndexOf("}");

  if (start === -1 || end === -1 || end <= start) {
    throw new Error("Model response did not contain a JSON object");
  }

  const candidate = source.slice(start, end + 1);

  try {
    return JSON.parse(candidate);
  } catch {
    return JSON.parse(repairJson(candidate));
  }
}
