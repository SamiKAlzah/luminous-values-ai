const ZERO_WIDTH = /[​-‏⁠﻿]/g;
const TATWEEL = /ـ/g;
// Arabic diacritics (harakat) and Quranic annotation marks.
const MARKS = /[ؐ-ًؚ-ٰٟۖ-ۭ]/g;
const ALEF_FORMS = /[أإآٱ]/g;
const NOT_WORD = /[^\p{L}\p{N}\s]/gu;
const WHITESPACE = /\s+/g;

const ARABIC_INDIC_ZERO = 0x0660;

export function normalizeText(input: string): string {
  return input
    .replace(ZERO_WIDTH, "")
    .replace(TATWEEL, "")
    .replace(MARKS, "")
    .replace(ALEF_FORMS, "ا")
    .replace(/ة/g, "ه")
    .replace(/ى/g, "ي")
    .replace(/[٠-٩]/g, (d) =>
      String(d.charCodeAt(0) - ARABIC_INDIC_ZERO),
    )
    .replace(NOT_WORD, " ")
    .replace(WHITESPACE, " ")
    .trim()
    .toLowerCase();
}
