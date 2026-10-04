import { describe, expect, it } from "vitest";
import { createFloor } from "./floor";

const floor = createFloor({ ar: ["أريد أن أنتحر"], en: ["kill myself"] });

describe("createFloor", () => {
  it("matches Arabic with diacritics", () => {
    expect(floor("أُرِيدُ أَنْ أَنْتَحِرَ")).toBe(true);
  });

  it("matches English regardless of case, spacing and punctuation", () => {
    expect(floor("i want to KILL   myself.")).toBe(true);
  });

  it("matches through zero-width characters", () => {
    expect(floor("ok​ kill​ myself")).toBe(true);
  });

  it("matches Arabic with tatweel", () => {
    expect(floor("أريد أن أنـــتحر")).toBe(true);
  });

  it("does not match unrelated text", () => {
    expect(floor("المرفق العام في الحديقة")).toBe(false);
  });

  it("does not match empty text", () => {
    expect(floor("")).toBe(false);
  });

  it("never matches when given no phrases", () => {
    expect(createFloor({ ar: [], en: [] })("kill myself")).toBe(false);
  });
});
