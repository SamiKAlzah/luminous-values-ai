import { normalizeText } from "../text/normalize";
import { JOURNEY_IDS, type JourneyId, type RouteResponse } from "../types";

export type Router = (text: string) => Promise<RouteResponse>;

export interface KeywordsFile {
  journeys: Record<JourneyId, { ar: string[]; en: string[] }>;
  specialist: { ar: string[]; en: string[] };
}

export type OutcomeLabel = JourneyId | "picker" | "refer_specialist" | "refer_safety";

const MIN_TOKEN_CHARS = 3;
const MIN_JOURNEY_SCORE = 2;

export function outcomeLabel(r: RouteResponse): OutcomeLabel {
  return r.outcome === "journey" ? r.journeyId : r.outcome;
}

function tokenSet(text: string): Set<string> {
  return new Set(
    normalizeText(text)
      .split(" ")
      .filter((token) => token.length >= MIN_TOKEN_CHARS),
  );
}

/**
 * Plain keyword baseline: no model. Safety floor first, then specialist keywords
 * (substring match, like the floor), then the journey whose vocabulary overlaps the input most.
 * A journey's vocabulary is the distinct tokens of its text plus its keyword list.
 */
export function createBaselineRouter(
  keywords: KeywordsFile,
  journeyTexts: Record<JourneyId, string>,
  floor: (t: string) => boolean,
): Router {
  const vocabularies = JOURNEY_IDS.map((id) => ({
    id,
    tokens: tokenSet(
      [journeyTexts[id], ...keywords.journeys[id].ar, ...keywords.journeys[id].en].join(" "),
    ),
  }));
  const specialistNeedles = [...keywords.specialist.ar, ...keywords.specialist.en]
    .map(normalizeText)
    .filter((needle) => needle.length > 0);

  return async (text) => {
    if (floor(text)) return { outcome: "refer_safety" };

    const haystack = normalizeText(text);
    if (specialistNeedles.some((needle) => haystack.includes(needle))) {
      return { outcome: "refer_specialist" };
    }

    const input = tokenSet(text);
    const scored = vocabularies
      .map(({ id, tokens }) => {
        let score = 0;
        for (const token of tokens) if (input.has(token)) score += 1;
        return { id, score };
      })
      .sort((a, b) => b.score - a.score);

    const [best, runnerUp] = scored;
    if (best.score === 0) return { outcome: "picker", reason: "out_of_scope" };
    if (best.score >= MIN_JOURNEY_SCORE && best.score > runnerUp.score) {
      return { outcome: "journey", journeyId: best.id };
    }
    return { outcome: "picker", reason: "low_confidence" };
  };
}
