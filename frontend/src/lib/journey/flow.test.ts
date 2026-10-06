import { describe, expect, it } from "vitest";
import { initialFlow, progress, reduceFlow, type FlowAction, type FlowState } from "./flow";

function run(actions: FlowAction[], from: FlowState = initialFlow()): FlowState {
  return actions.reduce(reduceFlow, from);
}

describe("journey flow", () => {
  it("starts at the situation with nothing chosen", () => {
    expect(initialFlow()).toEqual({ step: "situation", firstChoice: null, newChoice: null });
  });

  it("moves from the situation to the first choice, where next is ignored", () => {
    const s = run([{ type: "next" }]);
    expect(s.step).toBe("first_choice");
    expect(run([{ type: "next" }], s).step).toBe("first_choice");
  });

  it("records the first choice and moves to the solution", () => {
    const s = run([{ type: "next" }, { type: "pickFirst", index: 1 }]);
    expect(s).toEqual({ step: "solution", firstChoice: 1, newChoice: null });
  });

  it("ignores an out-of-range or mistimed first choice", () => {
    const atChoice = run([{ type: "next" }]);
    expect(reduceFlow(atChoice, { type: "pickFirst", index: 3 })).toBe(atChoice);
    expect(reduceFlow(atChoice, { type: "pickFirst", index: -1 })).toBe(atChoice);
    const start = initialFlow();
    expect(reduceFlow(start, { type: "pickFirst", index: 0 })).toBe(start);
  });

  it("walks solution, effect, trust, new situation", () => {
    const s = run([
      { type: "next" },
      { type: "pickFirst", index: 0 },
      { type: "next" },
      { type: "next" },
      { type: "next" },
    ]);
    expect(s.step).toBe("new_situation");
  });

  it("records the new choice, then reaches today and stays there", () => {
    const atNew = run([
      { type: "next" },
      { type: "pickFirst", index: 0 },
      { type: "next" },
      { type: "next" },
      { type: "next" },
    ]);
    const feedback = reduceFlow(atNew, { type: "pickNew", index: 2 });
    expect(feedback).toMatchObject({ step: "new_feedback", newChoice: 2 });
    const today = reduceFlow(feedback, { type: "next" });
    expect(today.step).toBe("today");
    expect(reduceFlow(today, { type: "next" })).toBe(today);
  });

  it("cannot skip the new situation with next", () => {
    const atNew: FlowState = { step: "new_situation", firstChoice: 0, newChoice: null };
    expect(reduceFlow(atNew, { type: "next" })).toBe(atNew);
  });

  it("clears a choice when going back past it", () => {
    const atSolution: FlowState = { step: "solution", firstChoice: 1, newChoice: null };
    expect(reduceFlow(atSolution, { type: "back" })).toEqual({
      step: "first_choice",
      firstChoice: null,
      newChoice: null,
    });
    const atFeedback: FlowState = { step: "new_feedback", firstChoice: 1, newChoice: 2 };
    expect(reduceFlow(atFeedback, { type: "back" })).toEqual({
      step: "new_situation",
      firstChoice: 1,
      newChoice: null,
    });
  });

  it("keeps the first choice when going back from the effect", () => {
    const atEffect: FlowState = { step: "effect", firstChoice: 1, newChoice: null };
    expect(reduceFlow(atEffect, { type: "back" })).toEqual({
      step: "solution",
      firstChoice: 1,
      newChoice: null,
    });
  });

  it("does not go back from the situation", () => {
    const start = initialFlow();
    expect(reduceFlow(start, { type: "back" })).toBe(start);
  });

  it("reports progress out of 8 and holds no language", () => {
    expect(progress(initialFlow())).toEqual({ index: 1, total: 8 });
    expect(progress({ step: "today", firstChoice: 0, newChoice: 0 })).toEqual({ index: 8, total: 8 });
    expect(Object.keys(initialFlow()).sort()).toEqual(["firstChoice", "newChoice", "step"]);
  });
});
