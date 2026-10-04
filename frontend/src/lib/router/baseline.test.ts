import { describe, expect, it } from "vitest";
import { createBaselineRouter, outcomeLabel } from "./baseline";
import type { JourneyId, RouteResponse } from "../types";

const keywords = {
  journeys: {
    citizenship_shared_facility: { ar: [], en: ["stairwell", "recycling"] },
    tolerance_accent: { ar: ["لهجته"], en: ["accent", "mocking"] },
    peace_before_escalation: { ar: [], en: ["insult", "revenge"] },
  },
  specialist: { ar: [], en: ["divorce"] },
};

const journeyTexts: Record<JourneyId, string> = {
  citizenship_shared_facility: "",
  tolerance_accent: "",
  peace_before_escalation: "",
};

const floor = (t: string): boolean => t.includes("hurt myself");

const router = createBaselineRouter(keywords, journeyTexts, floor);

describe("createBaselineRouter", () => {
  it("routes to the journey with two keyword hits", async () => {
    expect(await router("He keeps mocking my accent at work")).toEqual({
      outcome: "journey",
      journeyId: "tolerance_accent",
    });
  });

  it("scores tokens that come from the journey text too", async () => {
    const withText = createBaselineRouter(
      keywords,
      { ...journeyTexts, peace_before_escalation: "neighbour shouting argument" },
      floor,
    );
    expect(await withText("a neighbour started shouting")).toEqual({
      outcome: "journey",
      journeyId: "peace_before_escalation",
    });
  });

  it("ignores tokens shorter than three characters", async () => {
    const short = createBaselineRouter(
      {
        ...keywords,
        journeys: { ...keywords.journeys, tolerance_accent: { ar: [], en: ["ab", "cd"] } },
      },
      journeyTexts,
      floor,
    );
    expect(await short("ab cd")).toEqual({ outcome: "picker", reason: "out_of_scope" });
  });

  it("matches Arabic keywords after normalisation", async () => {
    const r = await router("سخروا من لَهْجَتِه وأنا أشاهد accent");
    expect(r).toEqual({ outcome: "journey", journeyId: "tolerance_accent" });
  });

  it("refers to safety when the floor matches, before anything else", async () => {
    expect(await router("I want to hurt myself, divorce, accent mocking")).toEqual({
      outcome: "refer_safety",
    });
  });

  it("refers to a specialist on any specialist keyword", async () => {
    expect(await router("we are discussing a divorce")).toEqual({
      outcome: "refer_specialist",
    });
  });

  it("returns the out_of_scope picker when nothing matches", async () => {
    expect(await router("what is the weather like")).toEqual({
      outcome: "picker",
      reason: "out_of_scope",
    });
  });

  it("returns the low_confidence picker on a tie", async () => {
    expect(await router("mocking accent insult revenge")).toEqual({
      outcome: "picker",
      reason: "low_confidence",
    });
  });

  it("returns the low_confidence picker when the best score is only 1", async () => {
    expect(await router("an insult")).toEqual({
      outcome: "picker",
      reason: "low_confidence",
    });
  });

  it("counts a repeated token once", async () => {
    expect(await router("accent accent accent")).toEqual({
      outcome: "picker",
      reason: "low_confidence",
    });
  });
});

describe("outcomeLabel", () => {
  it("maps every response shape to a label", () => {
    const cases: [RouteResponse, string][] = [
      [{ outcome: "journey", journeyId: "tolerance_accent" }, "tolerance_accent"],
      [{ outcome: "picker", reason: "unavailable" }, "picker"],
      [{ outcome: "picker", reason: "out_of_scope" }, "picker"],
      [{ outcome: "refer_specialist" }, "refer_specialist"],
      [{ outcome: "refer_safety" }, "refer_safety"],
    ];
    for (const [response, label] of cases) expect(outcomeLabel(response)).toBe(label);
  });
});
