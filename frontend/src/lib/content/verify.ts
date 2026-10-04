import { normalizeText } from "../text/normalize";
import { sha256Hex } from "./hash";
import type { Source, SourceCheck } from "./schema";

const TIMEOUT_MS = 10_000;

// Some source sites (dorar.net) refuse requests without a browser-like user agent.
const REQUEST_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36",
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

/** Text a reader can see: script, style and comments removed, tags stripped, entities decoded. */
export function visibleText(html: string): string {
  const withoutHidden = html
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<script\b[\s\S]*?<\/script\s*>/gi, " ")
    .replace(/<style\b[\s\S]*?<\/style\s*>/gi, " ");
  return decodeEntities(withoutHidden.replace(/<[^>]*>/g, " "));
}

/**
 * Fetches `source.url` and checks that the normalised Arabic text appears in the page's visible
 * text. Never throws: any network, HTTP or parsing problem is reported as `pass: false`.
 */
export async function verifySource(
  source: Source,
  fetchImpl: typeof fetch = fetch,
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
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const response = await fetchImpl(url, {
      headers: REQUEST_HEADERS,
      redirect: "follow",
      signal: controller.signal,
    });
    if (!response.ok) return result(false);
    const html = await response.text();
    return result(normalizeText(visibleText(html)).includes(needle));
  } catch {
    return result(false);
  } finally {
    clearTimeout(timer);
  }
}
