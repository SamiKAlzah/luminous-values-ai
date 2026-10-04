import { describe, expect, it, vi } from "vitest";
import { ROUTES, type Route } from "../types";
import { createFloor } from "./floor";
import { routeText, type RouteDeps } from "./route";

function makeDeps(overrides: Partial<RouteDeps> = {}) {
  const base = {
    floor: vi.fn<RouteDeps["floor"]>(() => false),
    guard: vi.fn<RouteDeps["guard"]>(async () => "ok"),
    classify: vi.fn<RouteDeps["classify"]>(async () => ({
      route: "tolerance_accent",
      confidence: "high",
    })),
  };
  // Overrides win, and the returned mocks are the ones the pipeline actually calls.
  const deps: RouteDeps = { ...base, timeoutMs: 1000, ...overrides };
  return {
    deps,
    floor: deps.floor as typeof base.floor,
    guard: deps.guard as typeof base.guard,
    classify: deps.classify as typeof base.classify,
  };
}

describe("routeText", () => {
  it.each([["   "], [""], [undefined], [42], [null], [{}]])(
    "treats %j as empty and never classifies",
    async (input) => {
      const { deps, classify } = makeDeps();
      await expect(routeText(input, "k", deps)).resolves.toEqual({
        outcome: "picker",
        reason: "low_confidence",
      });
      expect(classify).not.toHaveBeenCalled();
    },
  );

  it("refers to safety when the floor matches, before guard and classify", async () => {
    const { deps, guard, classify } = makeDeps({ floor: vi.fn(() => true) });
    await expect(routeText("anything", "k", deps)).resolves.toEqual({
      outcome: "refer_safety",
    });
    expect(guard).not.toHaveBeenCalled();
    expect(classify).not.toHaveBeenCalled();
  });

  it("finds a floor phrase at index 4000 of a 5,000-char string", async () => {
    const phrase = "kill myself";
    const text = "a".repeat(4000) + phrase + "a".repeat(5000 - 4000 - phrase.length);
    expect(text).toHaveLength(5000);
    const { deps, guard, classify } = makeDeps({
      floor: createFloor({ ar: [], en: [phrase] }),
    });
    await expect(routeText(text, "k", deps)).resolves.toEqual({
      outcome: "refer_safety",
    });
    expect(guard).not.toHaveBeenCalled();
    expect(classify).not.toHaveBeenCalled();
  });

  it("scans only the first 5,000 chars, then rejects the length", async () => {
    const { deps, floor, classify } = makeDeps();
    await expect(routeText("a".repeat(9000), "k", deps)).resolves.toEqual({
      outcome: "picker",
      reason: "too_long",
    });
    expect(floor).toHaveBeenCalledTimes(1);
    expect(floor.mock.calls[0][0]).toHaveLength(5000);
    expect(classify).not.toHaveBeenCalled();
  });

  it("returns unavailable when the guard limits the request", async () => {
    const { deps, guard, classify } = makeDeps({
      guard: vi.fn(async () => "limited" as const),
    });
    await expect(routeText("hello", "client-1", deps)).resolves.toEqual({
      outcome: "picker",
      reason: "unavailable",
    });
    expect(guard).toHaveBeenCalledWith("client-1");
    expect(classify).not.toHaveBeenCalled();
  });

  it("rejects 501 chars as too_long but accepts exactly 500", async () => {
    const long = makeDeps();
    await expect(routeText("a".repeat(501), "k", long.deps)).resolves.toEqual({
      outcome: "picker",
      reason: "too_long",
    });
    expect(long.classify).not.toHaveBeenCalled();

    const exact = makeDeps();
    await routeText("a".repeat(500), "k", exact.deps);
    expect(exact.classify).toHaveBeenCalledTimes(1);
  });

  describe("route mapping", () => {
    const journeys: Route[] = [
      "citizenship_shared_facility",
      "tolerance_accent",
      "peace_before_escalation",
    ];

    it.each(journeys)("maps %s + high to the journey", async (route) => {
      const { deps } = makeDeps({
        classify: vi.fn(async () => ({ route, confidence: "high" })),
      });
      await expect(routeText("hello", "k", deps)).resolves.toEqual({
        outcome: "journey",
        journeyId: route,
      });
    });

    it.each(journeys)("maps %s + low to a low_confidence picker", async (route) => {
      const { deps } = makeDeps({
        classify: vi.fn(async () => ({ route, confidence: "low" })),
      });
      await expect(routeText("hello", "k", deps)).resolves.toEqual({
        outcome: "picker",
        reason: "low_confidence",
      });
    });

    it.each(["high", "low"])("maps out_of_scope + %s to a picker", async (confidence) => {
      const { deps } = makeDeps({
        classify: vi.fn(async () => ({ route: "out_of_scope", confidence })),
      });
      await expect(routeText("hello", "k", deps)).resolves.toEqual({
        outcome: "picker",
        reason: "out_of_scope",
      });
    });

    it.each(["refer_specialist", "refer_safety"] as const)(
      "maps %s with either confidence to the referral",
      async (route) => {
        for (const confidence of ["high", "low"]) {
          const { deps } = makeDeps({
            classify: vi.fn(async () => ({ route, confidence })),
          });
          await expect(routeText("hello", "k", deps)).resolves.toEqual({
            outcome: route,
          });
        }
      },
    );

    it("exercises every route in the table", () => {
      expect([...journeys, "out_of_scope", "refer_specialist", "refer_safety"]).toEqual([
        ...ROUTES,
      ]);
    });
  });

  describe("failure handling", () => {
    it("returns unavailable when classify rejects", async () => {
      const { deps } = makeDeps({
        classify: vi.fn(async () => {
          throw new Error("boom");
        }),
      });
      await expect(routeText("hello", "k", deps)).resolves.toEqual({
        outcome: "picker",
        reason: "unavailable",
      });
    });

    it("returns unavailable when classify throws synchronously", async () => {
      const { deps } = makeDeps({
        classify: vi.fn(() => {
          throw new Error("sync boom");
        }),
      });
      await expect(routeText("hello", "k", deps)).resolves.toEqual({
        outcome: "picker",
        reason: "unavailable",
      });
    });

    it("returns unavailable when the guard or floor throws", async () => {
      const guardThrows = makeDeps({
        guard: vi.fn(async () => {
          throw new Error("guard");
        }),
      });
      await expect(routeText("hello", "k", guardThrows.deps)).resolves.toEqual({
        outcome: "picker",
        reason: "unavailable",
      });
      const floorThrows = makeDeps({
        floor: vi.fn(() => {
          throw new Error("floor");
        }),
      });
      await expect(routeText("hello", "k", floorThrows.deps)).resolves.toEqual({
        outcome: "picker",
        reason: "unavailable",
      });
    });

    it("aborts and returns unavailable when classify times out", async () => {
      let aborted = false;
      const { deps } = makeDeps({
        timeoutMs: 20,
        classify: vi.fn(
          (_t: string, signal: AbortSignal) =>
            new Promise<unknown>((_resolve, reject) => {
              signal.addEventListener("abort", () => {
                aborted = true;
                reject(new Error("aborted"));
              });
            }),
        ),
      });
      await expect(routeText("hello", "k", deps)).resolves.toEqual({
        outcome: "picker",
        reason: "unavailable",
      });
      expect(aborted).toBe(true);
    });

    it("times out even when classify ignores the signal", async () => {
      const { deps } = makeDeps({
        timeoutMs: 20,
        classify: vi.fn(() => new Promise<unknown>(() => {})),
      });
      await expect(routeText("hello", "k", deps)).resolves.toEqual({
        outcome: "picker",
        reason: "unavailable",
      });
    });

    it.each([
      [null],
      ["tolerance_accent"],
      [{ route: "hack", confidence: "high" }],
      [{ route: "tolerance_accent" }],
      [{ route: "tolerance_accent", confidence: "maybe" }],
    ])("treats invalid output %j as unavailable", async (output) => {
      const { deps } = makeDeps({ classify: vi.fn(async () => output) });
      await expect(routeText("hello", "k", deps)).resolves.toEqual({
        outcome: "picker",
        reason: "unavailable",
      });
    });

    it("ignores extra fields on a valid output", async () => {
      const { deps } = makeDeps({
        classify: vi.fn(async () => ({
          route: "peace_before_escalation",
          confidence: "high",
          journeyId: "tolerance_accent",
          note: "extra",
        })),
      });
      await expect(routeText("hello", "k", deps)).resolves.toEqual({
        outcome: "journey",
        journeyId: "peace_before_escalation",
      });
    });
  });
});
