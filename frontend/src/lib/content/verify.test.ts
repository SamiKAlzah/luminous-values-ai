import { describe, expect, it } from "vitest";
import { sha256Hex } from "./hash";
import type { Source } from "./schema";
import { verifySource } from "./verify";

const source: Source = {
  type: "quran",
  arabicText: "وَلَا تَسْتَوِي الْحَسَنَةُ وَلَا السَّيِّئَةُ",
  reference: "test reference",
  grade: "",
  url: "https://example.org/ayah",
  translation: { name: "test translation", text: "text" },
  explanation: { ar: "شرح", en: "explanation" },
};

function htmlResponse(html: string, status = 200): typeof fetch {
  return (async () =>
    new Response(html, {
      status,
      headers: { "content-type": "text/html; charset=utf-8" },
    })) as unknown as typeof fetch;
}

describe("verifySource", () => {
  it("passes when the visible page text contains the Arabic text with different diacritics", async () => {
    const page =
      "<html><body><nav>القائمة</nav><h1><span>﴿</span> وَلا تَسْتَوِي الحَسَنَةُ وَلا السَّيِّئَةُ&nbsp;ادْفَعْ</h1></body></html>";
    const check = await verifySource(source, htmlResponse(page));
    expect(check.pass).toBe(true);
    expect(check.url).toBe(source.url);
    expect(check.arabicTextHash).toBe(sha256Hex(source.arabicText));
    expect(Number.isNaN(Date.parse(check.checkedAt))).toBe(false);
  });

  it("decodes numeric entities before comparing", async () => {
    const encoded = [..."ولا تستوي الحسنة ولا السيئة"]
      .map((ch) => `&#${ch.codePointAt(0)};`)
      .join("");
    const check = await verifySource(source, htmlResponse(`<p>${encoded}</p>`));
    expect(check.pass).toBe(true);
  });

  it("fails when the text is absent", async () => {
    const check = await verifySource(source, htmlResponse("<p>نص آخر لا علاقة له</p>"));
    expect(check.pass).toBe(false);
    expect(check.url).toBe(source.url);
    expect(check.arabicTextHash).toBe(sha256Hex(source.arabicText));
  });

  it("fails when the text appears only inside a script block", async () => {
    const page = `<html><body><p>صفحة</p><script>var t = "${source.arabicText}";</script></body></html>`;
    const check = await verifySource(source, htmlResponse(page));
    expect(check.pass).toBe(false);
  });

  it("fails when the text appears only inside a style block", async () => {
    const page = `<html><head><style>/* ${source.arabicText} */</style></head><body><p>صفحة</p></body></html>`;
    const check = await verifySource(source, htmlResponse(page));
    expect(check.pass).toBe(false);
  });

  it("fails without throwing when fetch rejects", async () => {
    const failing = (async () => {
      throw new Error("network down");
    }) as unknown as typeof fetch;
    const check = await verifySource(source, failing);
    expect(check.pass).toBe(false);
    expect(check.url).toBe(source.url);
  });

  it("fails on HTTP 404 even when the body contains the text", async () => {
    const check = await verifySource(
      source,
      htmlResponse(`<p>${source.arabicText}</p>`, 404),
    );
    expect(check.pass).toBe(false);
  });

  it("fails without hanging when fetch never settles (timeout)", async () => {
    const never = (() => new Promise<Response>(() => {})) as unknown as typeof fetch;
    const started = Date.now();
    const check = await verifySource(source, never, { timeoutMs: 20 });
    expect(check.pass).toBe(false);
    expect(check.url).toBe(source.url);
    expect(Date.now() - started).toBeLessThan(2_000);
  });

  it("identifies itself with an honest tool user agent, not a browser", async () => {
    let userAgent = "";
    const capture = (async (_input: unknown, init?: RequestInit) => {
      userAgent = new Headers(init?.headers).get("user-agent") ?? "";
      return new Response(`<p>${source.arabicText}</p>`, { status: 200 });
    }) as unknown as typeof fetch;
    await verifySource(source, capture);
    expect(userAgent).toMatch(/source-verifier/i);
    expect(userAgent).not.toMatch(/Mozilla|Chrome|Safari/);
  });

  it("fails when the source has an empty Arabic text or URL", async () => {
    const page = htmlResponse(`<p>${source.arabicText}</p>`);
    expect((await verifySource({ ...source, arabicText: "" }, page)).pass).toBe(false);
    expect((await verifySource({ ...source, url: "" }, page)).pass).toBe(false);
  });
});
