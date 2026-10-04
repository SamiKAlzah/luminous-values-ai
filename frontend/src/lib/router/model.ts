import { ROUTES } from "../types";
import { ROUTER_SYSTEM_PROMPT } from "./prompt";

const API_URL = "https://api.anthropic.com/v1/messages";
const API_VERSION = "2023-06-01";
const MODEL = "claude-haiku-4-5-20251001";
const TOOL_NAME = "choose_route";

const TOOL = {
  name: TOOL_NAME,
  description: "Choose the single route that best fits the situation.",
  input_schema: {
    type: "object",
    properties: {
      route: { type: "string", enum: [...ROUTES] },
      confidence: { type: "string", enum: ["high", "low"] },
    },
    required: ["route", "confidence"],
  },
};

export interface Usage {
  inputTokens: number;
  outputTokens: number;
}

export interface HaikuOptions {
  apiKey: string | undefined;
  fetchImpl?: typeof fetch;
  onUsage?: (u: Usage) => void;
}

// Escape angle brackets so the user text can never close the <user_situation> wrapper.
function wrapSituation(text: string): string {
  const escaped = text.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return `<user_situation>\n${escaped}\n</user_situation>`;
}

function reportUsage(usage: unknown, onUsage: HaikuOptions["onUsage"]): void {
  if (!onUsage || typeof usage !== "object" || usage === null) return;
  const { input_tokens, output_tokens } = usage as Record<string, unknown>;
  if (typeof input_tokens !== "number" || typeof output_tokens !== "number") return;
  try {
    onUsage({ inputTokens: input_tokens, outputTokens: output_tokens });
  } catch {
    // Usage reporting must never affect routing.
  }
}

// Returns the raw tool input; the caller validates it. Error messages never contain user text.
export function makeHaikuClassifier(
  opts: HaikuOptions,
): (text: string, signal: AbortSignal) => Promise<unknown> {
  const fetchImpl = opts.fetchImpl ?? fetch;

  return async (text, signal) => {
    if (!opts.apiKey) throw new Error("missing_api_key");

    const res = await fetchImpl(API_URL, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": opts.apiKey,
        "anthropic-version": API_VERSION,
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 64,
        temperature: 0,
        system: ROUTER_SYSTEM_PROMPT,
        tools: [TOOL],
        tool_choice: { type: "tool", name: TOOL_NAME },
        messages: [{ role: "user", content: wrapSituation(text) }],
      }),
      signal,
    });

    if (!res.ok) throw new Error(`anthropic_http_${res.status}`);

    const data: unknown = await res.json();
    if (typeof data !== "object" || data === null) throw new Error("bad_response");
    const { content, usage } = data as { content?: unknown; usage?: unknown };

    reportUsage(usage, opts.onUsage);

    const blocks = Array.isArray(content)
      ? content.filter(
          (b): b is { type: "tool_use"; input: unknown } =>
            typeof b === "object" && b !== null && (b as { type?: unknown }).type === "tool_use",
        )
      : [];
    if (blocks.length !== 1) throw new Error("expected_one_tool_use");
    return blocks[0].input;
  };
}
