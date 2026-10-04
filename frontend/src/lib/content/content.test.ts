import { describe, expect, it } from "vitest";
import citizenship from "../../../content/journeys/citizenship_shared_facility.json";
import tolerance from "../../../content/journeys/tolerance_accent.json";
import peace from "../../../content/journeys/peace_before_escalation.json";
import messages from "../../../content/messages.json";
import safetyFloor from "../../../content/safety-floor.json";
import { createFloor } from "../router/floor";
import { JOURNEY_IDS, type Lang } from "../types";
import type {
  ContentFile,
  FloorBody,
  JourneyBody,
  JourneyText,
  MessageKey,
  MessagesBody,
} from "./schema";

const JOURNEYS = [citizenship, tolerance, peace] as unknown as ContentFile<JourneyBody>[];
const MESSAGES = messages as unknown as ContentFile<MessagesBody>;
const FLOOR = safetyFloor as unknown as ContentFile<FloorBody>;
const LANGS: Lang[] = ["ar", "en"];
const MESSAGE_KEYS: MessageKey[] = [
  "low_confidence",
  "out_of_scope",
  "unavailable",
  "too_long",
  "refer_specialist",
  "refer_safety",
];

function nonEmpty(s: unknown): boolean {
  return typeof s === "string" && s.trim().length > 0;
}

function visibleStrings(t: JourneyText): string[] {
  return [
    t.title,
    t.situation,
    ...t.firstChoices.flatMap((c) => [c.text, c.feedback]),
    ...t.solutionSteps,
    t.newSituation,
    ...t.newChoices.flatMap((c) => [c.text, c.feedback]),
    t.todayStep,
    t.activityLabel,
  ];
}

describe("journey content files", () => {
  it("has one file per journey id, in order", () => {
    expect(JOURNEYS.map((j) => j.id)).toEqual([...JOURNEY_IDS]);
  });

  describe.each(JOURNEYS.map((j) => [j.id, j] as const))("%s", (_id, journey) => {
    it.each(LANGS)("has complete %s text", (lang) => {
      const t = journey.body[lang];
      expect(nonEmpty(t.title)).toBe(true);
      expect(nonEmpty(t.situation)).toBe(true);
      expect(t.firstChoices).toHaveLength(3);
      expect(t.solutionSteps).toHaveLength(3);
      expect(t.newChoices).toHaveLength(3);
      expect(nonEmpty(t.newSituation)).toBe(true);
      expect(nonEmpty(t.todayStep)).toBe(true);
      expect(nonEmpty(t.activityLabel)).toBe(true);
      for (const s of visibleStrings(t)) expect(nonEmpty(s)).toBe(true);
    });

    it.each(LANGS)("uses no exclamation marks in %s text", (lang) => {
      for (const s of visibleStrings(journey.body[lang])) {
        expect(s).not.toMatch(/[!！]/);
      }
    });

    it("has a typed source with a named translation and a link", () => {
      const { source } = journey.body;
      expect(["quran", "hadith"]).toContain(source.type);
      expect(nonEmpty(source.arabicText)).toBe(true);
      expect(nonEmpty(source.reference)).toBe(true);
      expect(source.url).toMatch(/^https:\/\//);
      expect(nonEmpty(source.translation.name)).toBe(true);
      expect(nonEmpty(source.translation.text)).toBe(true);
      expect(nonEmpty(source.explanation.ar)).toBe(true);
      expect(nonEmpty(source.explanation.en)).toBe(true);
    });
  });
});

describe("messages.json", () => {
  it.each(MESSAGE_KEYS)("has %s in both languages", (key) => {
    for (const lang of LANGS) {
      expect(nonEmpty(MESSAGES.body[key]?.[lang])).toBe(true);
      expect(MESSAGES.body[key][lang]).not.toMatch(/[!！]/);
    }
  });

  it.each(LANGS)("refer_safety in %s lists 911, 1919 and 937", (lang) => {
    const text = MESSAGES.body.refer_safety[lang];
    for (const number of ["911", "999", "1919", "937"]) {
      expect(text).toContain(number);
    }
  });
});

describe("safety-floor.json", () => {
  it.each(LANGS)("has a non-empty %s phrase list", (lang) => {
    const phrases = FLOOR.body.phrases[lang];
    expect(Array.isArray(phrases)).toBe(true);
    expect(phrases.length).toBeGreaterThan(0);
    for (const p of phrases) expect(nonEmpty(p)).toBe(true);
  });

  it("does not fire on any journey's own text", () => {
    const floor = createFloor(FLOOR.body.phrases);
    for (const journey of JOURNEYS) {
      for (const lang of LANGS) {
        for (const s of visibleStrings(journey.body[lang])) expect(floor(s)).toBe(false);
      }
    }
  });
});
