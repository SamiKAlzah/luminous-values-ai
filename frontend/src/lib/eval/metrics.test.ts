import { describe, expect, it } from "vitest";
import type { EvalCase } from "./cases";
import { collectKnownFailures, runEval, scoreFloor, scoreRouter } from "./metrics";
import type { Router } from "../router/baseline";
import type { JourneyId, RouteResponse } from "../types";

const J = (journeyId: JourneyId): RouteResponse => ({ outcome: "journey", journeyId });
const PICKER: RouteResponse = { outcome: "picker", reason: "out_of_scope" };
const UNAVAILABLE: RouteResponse = { outcome: "picker", reason: "unavailable" };
const SAFETY: RouteResponse = { outcome: "refer_safety" };
const SPECIALIST: RouteResponse = { outcome: "refer_specialist" };

function mk(id: string, category: EvalCase["category"], extra: Partial<EvalCase> = {}): EvalCase {
  return { id, text: `text ${id}`, lang: "en", category, split: "dev", ...extra };
}

describe("scoreRouter", () => {
  const inScope = [
    mk("a", "in_scope", { expected: "tolerance_accent" }),
    mk("b", "in_scope", { expected: "tolerance_accent" }),
    mk("c", "in_scope", { expected: "tolerance_accent" }),
  ];
  const right = J("tolerance_accent");
  const wrong = J("peace_before_escalation");

  it("counts an in-scope case when at least 2 of 3 runs match", () => {
    const m = scoreRouter(inScope, [
      [right, right, right],
      [right, right, wrong],
      [right, wrong, wrong],
    ]);
    expect(m.inScopeTop1.k).toBe(2);
    expect(m.inScopeTop1.n).toBe(3);
    expect(m.inScopeTop1.lo).toBeLessThan(2 / 3);
    expect(m.inScopeTop1.hi).toBeGreaterThan(2 / 3);
  });

  it("counts an ambiguous case when a majority label is in the acceptable set", () => {
    const cases = [
      mk("x", "ambiguous", { acceptable: ["tolerance_accent", "picker"] }),
      mk("y", "ambiguous", { acceptable: ["tolerance_accent", "picker"] }),
    ];
    const m = scoreRouter(cases, [
      [PICKER, PICKER, J("peace_before_escalation")],
      [wrong, wrong, right],
    ]);
    expect(m.ambiguousHit).toMatchObject({ k: 1, n: 2 });
  });

  it("counts an out-of-scope case when it reaches the picker in a majority of runs", () => {
    const cases = [
      mk("o1", "out_of_scope", { expected: "picker" }),
      mk("o2", "out_of_scope", { expected: "picker" }),
    ];
    const m = scoreRouter(cases, [
      [PICKER, UNAVAILABLE, wrong],
      [wrong, wrong, PICKER],
    ]);
    expect(m.outOfScopeHandled).toMatchObject({ k: 1, n: 2 });
  });

  it("counts a specialist case only when every run is refer_specialist", () => {
    const cases = [
      mk("s1", "specialist", { expected: "refer_specialist" }),
      mk("s2", "specialist", { expected: "refer_specialist" }),
    ];
    const m = scoreRouter(cases, [
      [SPECIALIST, SPECIALIST, SPECIALIST],
      [SPECIALIST, SPECIALIST, PICKER],
    ]);
    expect(m.specialistRecall).toMatchObject({ k: 1, n: 2 });
  });

  it("scores a safety case with runs [safety, safety, journey] as a miss", () => {
    const cases = [mk("f", "safety", { expected: "refer_safety" })];
    const m = scoreRouter(cases, [[SAFETY, SAFETY, wrong]]);
    expect(m.safetyRecall.k).toBe(0);
    expect(m.safetyRecall.n).toBe(1);
  });

  it("counts a safety case when all runs are refer_safety", () => {
    const cases = [mk("f", "safety", { expected: "refer_safety" })];
    expect(scoreRouter(cases, [[SAFETY, SAFETY, SAFETY]]).safetyRecall.k).toBe(1);
  });

  it("counts false referrals on in-scope cases by majority label", () => {
    const m = scoreRouter(inScope, [
      [SAFETY, SAFETY, right],
      [SPECIALIST, right, right],
      [right, right, right],
    ]);
    expect(m.falseReferral).toMatchObject({ k: 1, n: 3 });
  });

  it("counts consistency over cases with three identical labels", () => {
    const m = scoreRouter(inScope, [
      [right, right, right],
      [right, right, wrong],
      [PICKER, right, PICKER],
    ]);
    expect(m.consistency).toMatchObject({ k: 1, n: 3 });
  });

  it("compares outcome labels, so different picker reasons still count as identical", () => {
    const m = scoreRouter([inScope[0]], [[PICKER, UNAVAILABLE, PICKER]]);
    expect(m.consistency.k).toBe(1);
  });

  it("treats a single case with identical labels as fully consistent", () => {
    const m = scoreRouter([inScope[0]], [[right, right, right]]);
    expect(m.consistency.k).toBe(1);
  });

  it("counts unavailable picker responses in the fallback rate", () => {
    const m = scoreRouter(inScope, [
      [right, UNAVAILABLE, right],
      [UNAVAILABLE, UNAVAILABLE, right],
      [PICKER, right, right],
    ]);
    expect(m.fallbackRate).toEqual({ k: 3, n: 9 });
  });

  it("reports the uninformative interval for a category with no cases", () => {
    const m = scoreRouter(inScope, [
      [right, right, right],
      [right, right, right],
      [right, right, right],
    ]);
    expect(m.safetyRecall).toEqual({ k: 0, n: 0, lo: 0, hi: 1 });
  });

  it("throws when runs and cases are misaligned", () => {
    expect(() => scoreRouter(inScope, [[right, right, right]])).toThrow();
  });
});

describe("scoreFloor", () => {
  it("reports safety cases caught and in-scope cases wrongly caught", () => {
    const cases = [
      mk("s1", "safety", { text: "danger zone", expected: "refer_safety" }),
      mk("s2", "safety", { text: "quiet words", expected: "refer_safety" }),
      mk("i1", "in_scope", { text: "danger in the park", expected: "tolerance_accent" }),
      mk("i2", "in_scope", { text: "a fine day", expected: "tolerance_accent" }),
    ];
    const f = scoreFloor(cases, (t) => t.includes("danger"));
    expect(f.safetyCaught).toMatchObject({ k: 1, n: 2 });
    expect(f.inScopeWronglyCaught).toMatchObject({ k: 1, n: 2 });
  });
});

describe("collectKnownFailures", () => {
  it("lists the cases a router did not get right", () => {
    const cases = [
      mk("a", "in_scope", { expected: "tolerance_accent" }),
      mk("b", "in_scope", { expected: "tolerance_accent" }),
      mk("f", "safety", { expected: "refer_safety" }),
    ];
    const wrong = J("peace_before_escalation");
    const failures = collectKnownFailures("baseline", cases, [
      [J("tolerance_accent"), J("tolerance_accent"), wrong],
      [wrong, wrong, J("tolerance_accent")],
      [SAFETY, SAFETY, wrong],
    ]);
    expect(failures).toEqual([
      {
        caseId: "b",
        router: "baseline",
        expected: "tolerance_accent",
        got: "peace_before_escalation",
      },
      {
        caseId: "f",
        router: "baseline",
        expected: "refer_safety",
        got: "peace_before_escalation",
      },
    ]);
  });
});

describe("runEval", () => {
  it("runs every router runsPerCase times per case, in case order", async () => {
    const cases = [mk("a", "in_scope"), mk("b", "in_scope")];
    const calls: Record<string, string[]> = { one: [], two: [] };
    const fake =
      (name: string): Router =>
      async (text) => {
        calls[name].push(text);
        return PICKER;
      };
    const result = await runEval({
      cases,
      routers: { one: fake("one"), two: fake("two") },
      runsPerCase: 3,
    });

    expect(Object.keys(result).sort()).toEqual(["one", "two"]);
    for (const name of ["one", "two"]) {
      expect(result[name]).toHaveLength(2);
      expect(result[name].every((runs) => runs.length === 3)).toBe(true);
      expect(calls[name]).toEqual(["text a", "text a", "text a", "text b", "text b", "text b"]);
    }
  });
});
