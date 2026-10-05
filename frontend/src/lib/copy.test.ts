import { describe, expect, it } from "vitest";
import { UI_COPY, asLang, fmt } from "./copy";

function shape(x: unknown): unknown {
  if (Array.isArray(x)) return { __array: x.length, items: x.map(shape) };
  if (typeof x === "object" && x !== null) {
    return Object.fromEntries(
      Object.keys(x)
        .sort()
        .map((k) => [k, shape((x as Record<string, unknown>)[k])]),
    );
  }
  return typeof x;
}

function strings(x: unknown, path = ""): [string, string][] {
  if (typeof x === "string") return [[path, x]];
  if (Array.isArray(x)) return x.flatMap((v, i) => strings(v, `${path}[${i}]`));
  if (typeof x === "object" && x !== null) {
    return Object.entries(x).flatMap(([k, v]) => strings(v, path ? `${path}.${k}` : k));
  }
  return [];
}

describe("UI copy", () => {
  it("has the same keys and array lengths in Arabic and English", () => {
    expect(shape(UI_COPY.ar)).toEqual(shape(UI_COPY.en));
  });

  it("has no empty strings", () => {
    for (const lang of ["ar", "en"] as const) {
      for (const [path, value] of strings(UI_COPY[lang])) {
        expect(value.trim().length, `${lang}.${path}`).toBeGreaterThan(0);
      }
    }
  });

  it("makes no absolute accuracy claim", () => {
    for (const lang of ["ar", "en"] as const) {
      for (const [path, value] of strings(UI_COPY[lang])) {
        expect(value, `${lang}.${path}`).not.toMatch(/100\s*%|zero hallucination|صفر هلوسة|localhost/i);
      }
    }
  });
});

describe("asLang and fmt", () => {
  it("maps anything but en to ar", () => {
    expect(asLang("fr")).toBe("ar");
    expect(asLang("ur")).toBe("ar");
    expect(asLang("en")).toBe("en");
  });

  it("fills placeholders and leaves unknown ones", () => {
    expect(fmt("Step {n} of {total}", { n: 2, total: 8 })).toBe("Step 2 of 8");
    expect(fmt("a {x}", {})).toBe("a {x}");
  });
});
