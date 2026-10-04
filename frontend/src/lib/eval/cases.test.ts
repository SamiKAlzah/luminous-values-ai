import { describe, expect, it } from "vitest";
import { validateCases, type EvalCase } from "./cases";
import type { JourneyId } from "../types";

const JOURNEYS: JourneyId[] = [
  "citizenship_shared_facility",
  "tolerance_accent",
  "peace_before_escalation",
];

type Category = EvalCase["category"];

// category: [dev count, test count]
const PLAN: Record<Category, [number, number]> = {
  in_scope: [10, 20],
  ambiguous: [3, 7],
  out_of_scope: [3, 5],
  specialist: [2, 4],
  safety: [2, 4],
};

function expectedFor(category: Category, i: number): Pick<EvalCase, "expected" | "acceptable"> {
  switch (category) {
    case "in_scope":
      return { expected: JOURNEYS[i % 3] };
    case "ambiguous":
      return { acceptable: ["tolerance_accent", "picker"] };
    case "out_of_scope":
      return { expected: "picker" };
    case "specialist":
      return { expected: "refer_specialist" };
    case "safety":
      return { expected: "refer_safety" };
  }
}

function validSet(): EvalCase[] {
  const cases: EvalCase[] = [];
  for (const [category, counts] of Object.entries(PLAN) as [Category, [number, number]][]) {
    (["dev", "test"] as const).forEach((split, s) => {
      for (let i = 0; i < counts[s]; i++) {
        cases.push({
          id: `${category}-${split}-${i}`,
          text: `case text ${category} ${split} ${i}`,
          lang: i % 2 === 0 ? "en" : "ar",
          category,
          split,
          ...expectedFor(category, i),
        });
      }
    });
  }
  return cases;
}

describe("validateCases", () => {
  it("accepts a valid 60-case set", () => {
    const cases = validSet();
    expect(cases).toHaveLength(60);
    expect(validateCases(cases)).toEqual([]);
  });

  it("rejects 59 cases", () => {
    const problems = validateCases(validSet().slice(1));
    expect(problems.some((p) => p.includes("59"))).toBe(true);
  });

  it("rejects 21 dev cases", () => {
    const cases = validSet();
    const moved = cases.find((c) => c.split === "test" && c.category === "in_scope");
    if (!moved) throw new Error("fixture");
    moved.split = "dev";
    const problems = validateCases(cases);
    expect(problems.some((p) => p.includes("dev") && p.includes("21"))).toBe(true);
  });

  it("rejects a duplicate id", () => {
    const cases = validSet();
    cases[1].id = cases[0].id;
    expect(validateCases(cases).some((p) => p.includes("duplicate id"))).toBe(true);
  });

  it("rejects a case with neither expected nor acceptable", () => {
    const cases = validSet();
    delete cases[0].expected;
    delete cases[0].acceptable;
    const problems = validateCases(cases);
    expect(problems.some((p) => p.includes(cases[0].id) && p.includes("expected"))).toBe(true);
  });

  it("rejects a category that is absent from the dev split", () => {
    const cases = validSet().map((c) =>
      c.category === "safety" && c.split === "dev" ? { ...c, split: "test" as const } : c,
    );
    const problems = validateCases(cases);
    expect(problems.some((p) => p.includes("safety") && p.includes("dev"))).toBe(true);
  });

  it("rejects an in-scope case whose expected label is not a journey", () => {
    const cases = validSet();
    const target = cases.find((c) => c.category === "in_scope");
    if (!target) throw new Error("fixture");
    target.expected = "picker";
    expect(validateCases(cases).some((p) => p.includes(target.id))).toBe(true);
  });

  it("rejects an empty text", () => {
    const cases = validSet();
    cases[0].text = "  ";
    expect(
      validateCases(cases).some((p) => p.includes(cases[0].id) && p.includes("text")),
    ).toBe(true);
  });
});
