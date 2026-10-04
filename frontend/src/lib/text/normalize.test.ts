import { describe, expect, it } from "vitest";
import { normalizeText } from "./normalize";

describe("normalizeText", () => {
  it.each([
    ["strips diacritics", "أَنْتَحِرُ", "انتحر"],
    ["strips tatweel and folds taa marbuta", "مـــدرسة", "مدرسه"],
    ["folds alef wasla", "ٱلله", "الله"],
    ["lowercases, drops punctuation, collapses spaces", "I   WANT, to... Die!", "i want to die"],
    ["maps Arabic-Indic digits", "١٢٣", "123"],
    ["strips zero-width characters", "a​b", "ab"],
    ["strips Quranic annotation marks", "بِسْمِ ٱللَّهِ", "بسم الله"],
  ])("%s", (_name, input, expected) => {
    expect(normalizeText(input)).toBe(expected);
  });

  it("folds hamza alef forms and alef maqsura", () => {
    expect(normalizeText("أإآ")).toBe("ااا");
    expect(normalizeText("على")).toBe("علي");
  });

  it("returns an empty string for empty or punctuation-only input", () => {
    expect(normalizeText("")).toBe("");
    expect(normalizeText("...!?")).toBe("");
  });
});
