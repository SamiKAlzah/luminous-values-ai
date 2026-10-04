import { describe, expect, it } from "vitest";
import { checkGate } from "./gate";
import { contentHash, sha256Hex } from "./hash";
import type { ContentFile, JourneyBody } from "./schema";
import { JOURNEY_IDS } from "../types";

const text = {
  title: "t",
  situation: "s",
  firstChoices: [{ text: "c", feedback: "f" }],
  solutionSteps: ["step"],
  newSituation: "n",
  newChoices: [{ text: "c", feedback: "f" }],
  todayStep: "today",
  activityLabel: "label",
};

function approved<B>(id: string, body: B): ContentFile<B> {
  return {
    id,
    approval: {
      status: "approved",
      reviewedBy: "Reviewer",
      reviewedAt: "2026-10-04",
      version: 1,
      contentHash: contentHash(body),
    },
    body,
  };
}

function journey(id: string): ContentFile<JourneyBody> {
  const body: JourneyBody = {
    ar: text,
    en: text,
    source: {
      type: "quran",
      arabicText: "نص عربي",
      reference: "ref",
      grade: "",
      url: "https://example.org/" + id,
      translation: { name: "T", text: "tt" },
      explanation: { ar: "a", en: "e" },
    },
  };
  return {
    ...approved(id, body),
    sourceCheck: {
      checkedAt: "2026-10-04",
      url: body.source.url,
      arabicTextHash: sha256Hex(body.source.arabicText),
      pass: true,
    },
  };
}

function validSet(): ContentFile<unknown>[] {
  return [
    ...JOURNEY_IDS.map(journey),
    approved("messages", { low_confidence: { ar: "a", en: "e" } }),
    approved("safety-floor", { phrases: { ar: ["a"], en: ["e"] } }),
  ];
}

function replaceFile(
  set: ContentFile<unknown>[],
  id: string,
  fn: (f: ContentFile<JourneyBody>) => ContentFile<JourneyBody>,
): ContentFile<unknown>[] {
  return set.map((f) => (f.id === id ? fn(f as ContentFile<JourneyBody>) : f));
}

const FIRST = "citizenship_shared_facility";

describe("checkGate", () => {
  it("accepts a fully approved and verified set", () => {
    expect(checkGate(validSet(), "strict")).toEqual({ ok: true, problems: [] });
  });

  it("fails strict mode on a draft journey and lists the problem in warn mode", () => {
    const set = replaceFile(validSet(), FIRST, (f) => ({
      ...f,
      approval: { ...f.approval, status: "draft" },
    }));
    const strict = checkGate(set, "strict");
    expect(strict.ok).toBe(false);
    expect(strict.problems.some((p) => p.includes(FIRST) && p.includes("draft"))).toBe(true);
    const warn = checkGate(set, "warn");
    expect(warn.ok).toBe(true);
    expect(warn.problems).toEqual(strict.problems);
  });

  it("detects a body edited after approval", () => {
    const set = replaceFile(validSet(), FIRST, (f) => ({
      ...f,
      body: { ...f.body, en: { ...f.body.en, title: "edited" } },
    }));
    const r = checkGate(set, "strict");
    expect(r.ok).toBe(false);
    expect(r.problems.some((p) => p.includes("contentHash mismatch"))).toBe(true);
  });

  it("flags a failing source check", () => {
    const set = replaceFile(validSet(), FIRST, (f) => ({
      ...f,
      sourceCheck: { ...f.sourceCheck!, pass: false },
    }));
    const r = checkGate(set, "strict");
    expect(r.ok).toBe(false);
    expect(r.problems.some((p) => p.includes(FIRST) && p.includes("sourceCheck"))).toBe(true);
  });

  it("flags a missing source check", () => {
    const set = replaceFile(validSet(), FIRST, (f) => {
      const { sourceCheck, ...rest } = f;
      void sourceCheck;
      return rest;
    });
    const r = checkGate(set, "strict");
    expect(r.ok).toBe(false);
    expect(r.problems.some((p) => p.includes(FIRST) && p.includes("sourceCheck"))).toBe(true);
  });

  it("flags a source url changed after the check", () => {
    const set = replaceFile(validSet(), FIRST, (f) => {
      const body = { ...f.body, source: { ...f.body.source, url: "https://example.org/other" } };
      return { ...f, body, approval: { ...f.approval, contentHash: contentHash(body) } };
    });
    const r = checkGate(set, "strict");
    expect(r.ok).toBe(false);
    expect(r.problems.some((p) => p.includes(FIRST) && p.includes("url"))).toBe(true);
  });

  it("flags Arabic source text changed after the check", () => {
    const set = replaceFile(validSet(), FIRST, (f) => {
      const body = { ...f.body, source: { ...f.body.source, arabicText: "نص آخر" } };
      return { ...f, body, approval: { ...f.approval, contentHash: contentHash(body) } };
    });
    const r = checkGate(set, "strict");
    expect(r.ok).toBe(false);
    expect(r.problems.some((p) => p.includes(FIRST) && p.includes("arabicText"))).toBe(true);
  });

  it.each([...JOURNEY_IDS, "messages", "safety-floor"])(
    "names a missing expected file: %s",
    (id) => {
      const set = validSet().filter((f) => f.id !== id);
      const r = checkGate(set, "strict");
      expect(r.ok).toBe(false);
      expect(r.problems.some((p) => p.includes(id) && p.includes("missing"))).toBe(true);
    },
  );

  it("does not crash on an all-empty skeleton set", () => {
    const skeleton = (id: string): ContentFile<unknown> => ({
      id,
      approval: { status: "draft", reviewedBy: "", reviewedAt: "", version: 0, contentHash: "" },
      body: { source: { arabicText: "", url: "" } },
    });
    const set = [...JOURNEY_IDS, "messages", "safety-floor"].map(skeleton);
    const r = checkGate(set, "warn");
    expect(r.ok).toBe(true);
    expect(r.problems.length).toBeGreaterThan(0);
  });
});
