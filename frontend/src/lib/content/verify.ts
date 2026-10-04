import { normalizeText } from "../text/normalize";
import { sha256Hex } from "./hash";
import type { Source, SourceCheck } from "./schema";

const DEFAULT_TIMEOUT_MS = 10_000;

// An honest user agent that names the tool. Sites that only serve browsers (for example
// dorar.net and sunnah.com, which answer 403 to scripted requests) cannot be used as a
// verifying `source.url`; pick a page that serves this request instead.
const REQUEST_HEADERS = {
  "User-Agent": "luminous-values-source-verifier/1.0 (manual content source check)",
  Accept: "text/html,application/xhtml+xml",
  "Accept-Language": "ar,en;q=0.8",
};

const NAMED_ENTITIES: Record<string, string> = {
  nbsp: " ",
  amp: "&",
  quot: '"',
  apos: "'",
  lt: "<",
  gt: ">",
};

function decodeEntities(s: string): string {
  return s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (match, body: string) => {
    if (body[0] === "#") {
      const hex = body[1] === "x" || body[1] === "X";
      const code = parseInt(body.slice(hex ? 2 : 1), hex ? 16 : 10);
      return Number.isFinite(code) && code > 0 && code <= 0x10ffff
        ? String.fromCodePoint(code)
        : match;
    }
    return NAMED_ENTITIES[body.toLowerCase()] ?? match;
  });
}

/**
 * "Visible text" here means the server-rendered HTML as fetched (no JavaScript is run) with
 * <script> and <style> blocks and HTML comments removed, tags replaced by spaces and basic
 * entities decoded. Text that a page only inserts with JavaScript is therefore not visible.
 */
export function visibleText(html: string): string {
  const withoutHidden = html
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<script\b[\s\S]*?<\/script\s*>/gi, " ")
    .replace(/<style\b[\s\S]*?<\/style\s*>/gi, " ");
  return decodeEntities(withoutHidden.replace(/<[^>]*>/g, " "));
}

export interface VerifyOptions {
  timeoutMs?: number;
}

const TIMED_OUT = Symbol("timed out");

/**
 * Fetches `source.url` and checks that the normalised Arabic text appears in the page's visible
 * text. Never throws: any network, HTTP, timeout or parsing problem is reported as `pass: false`.
 */
export async function verifySource(
  source: Source,
  fetchImpl: typeof fetch = fetch,
  options: VerifyOptions = {},
): Promise<SourceCheck> {
  const url = source.url ?? "";
  const arabicText = source.arabicText ?? "";
  const result = (pass: boolean): SourceCheck => ({
    checkedAt: new Date().toISOString(),
    url,
    arabicTextHash: sha256Hex(arabicText),
    pass,
  });

  const needle = normalizeText(arabicText);
  if (needle.length === 0 || url.length === 0) return result(false);

  const controller = new AbortController();
  let timer: ReturnType<typeof setTimeout> | undefined;
  // The race guarantees the timeout even if an injected fetch ignores the abort signal.
  const timeout = new Promise<typeof TIMED_OUT>((resolve) => {
    timer = setTimeout(() => {
      controller.abort();
      resolve(TIMED_OUT);
    }, options.timeoutMs ?? DEFAULT_TIMEOUT_MS);
  });

  const check = async (): Promise<boolean> => {
    const response = await fetchImpl(url, {
      headers: REQUEST_HEADERS,
      redirect: "follow",
      signal: controller.signal,
    });
    if (!response.ok) return false;
    const html = await response.text();
    return normalizeText(visibleText(html)).includes(needle);
  };

  try {
    const outcome = await Promise.race([check(), timeout]);
    return result(outcome === true);
  } catch {
    return result(false);
  } finally {
    clearTimeout(timer);
  }
}
