import type { OutcomeLabel } from "../router/baseline";
import { JOURNEY_IDS, type Lang } from "../types";

export type CaseCategory = "in_scope" | "ambiguous" | "out_of_scope" | "specialist" | "safety";

export interface EvalCase {
  id: string;
  text: string;
  lang: Lang;
  category: CaseCategory;
  split: "dev" | "test";
  expected?: OutcomeLabel;
  acceptable?: OutcomeLabel[];
}

export const CATEGORY_COUNTS: Record<CaseCategory, number> = {
  in_scope: 30,
  ambiguous: 10,
  out_of_scope: 8,
  specialist: 6,
  safety: 6,
};
const DEV_COUNT = 20;
const TEST_COUNT = 40;

const CATEGORIES = Object.keys(CATEGORY_COUNTS) as CaseCategory[];
const SPLITS = ["dev", "test"] as const;

/** Returns a list of human-readable problems; an empty list means the set is valid. */
export function validateCases(cases: EvalCase[]): string[] {
  const problems: string[] = [];
  const total = Object.values(CATEGORY_COUNTS).reduce((a, b) => a + b, 0);

  if (cases.length !== total) problems.push(`expected ${total} cases, found ${cases.length}`);

  for (const category of CATEGORIES) {
    const n = cases.filter((c) => c.category === category).length;
    if (n !== CATEGORY_COUNTS[category]) {
      problems.push(`expected ${CATEGORY_COUNTS[category]} ${category} cases, found ${n}`);
    }
    for (const split of SPLITS) {
      if (!cases.some((c) => c.category === category && c.split === split)) {
        problems.push(`category ${category} has no ${split} cases`);
      }
    }
  }

  for (const [split, want] of [["dev", DEV_COUNT], ["test", TEST_COUNT]] as const) {
    const n = cases.filter((c) => c.split === split).length;
    if (n !== want) problems.push(`expected ${want} ${split} cases, found ${n}`);
  }

  const seen = new Set<string>();
  for (const c of cases) {
    if (seen.has(c.id)) problems.push(`duplicate id: ${c.id}`);
    seen.add(c.id);

    if (typeof c.id !== "string" || c.id.length === 0) problems.push("case with an empty id");
    if (typeof c.text !== "string" || c.text.trim().length === 0) {
      problems.push(`case ${c.id}: empty text`);
    }
    if (c.lang !== "ar" && c.lang !== "en") problems.push(`case ${c.id}: invalid lang`);
    if (!CATEGORIES.includes(c.category)) problems.push(`case ${c.id}: invalid category`);
    if (!SPLITS.includes(c.split)) problems.push(`case ${c.id}: invalid split`);

    const hasAcceptable = Array.isArray(c.acceptable) && c.acceptable.length > 0;
    if (c.expected === undefined && !hasAcceptable) {
      problems.push(`case ${c.id}: missing expected and acceptable`);
    }
    if (
      c.category === "in_scope" &&
      !(JOURNEY_IDS as readonly string[]).includes(c.expected ?? "")
    ) {
      problems.push(`case ${c.id}: in_scope expected must be a journey id`);
    }
  }

  return problems;
}
