export const STEPS = [
  "situation",
  "first_choice",
  "solution",
  "effect",
  "trust",
  "new_situation",
  "new_feedback",
  "today",
] as const;
export type StepId = (typeof STEPS)[number];

export interface FlowState {
  step: StepId;
  firstChoice: number | null;
  newChoice: number | null;
}

export type FlowAction =
  | { type: "next" }
  | { type: "back" }
  | { type: "pickFirst"; index: number }
  | { type: "pickNew"; index: number };

const CHOICE_COUNT = 3;

export function initialFlow(): FlowState {
  return { step: "situation", firstChoice: null, newChoice: null };
}

function validChoice(index: number): boolean {
  return Number.isInteger(index) && index >= 0 && index < CHOICE_COUNT;
}

// Steps that wait for a choice cannot be skipped with "next"; the last step has no successor.
const NEXT: Partial<Record<StepId, StepId>> = {
  situation: "first_choice",
  solution: "effect",
  effect: "trust",
  trust: "new_situation",
  new_feedback: "today",
};

export function reduceFlow(state: FlowState, action: FlowAction): FlowState {
  switch (action.type) {
    case "next": {
      const to = NEXT[state.step];
      return to ? { ...state, step: to } : state;
    }
    case "back": {
      const i = STEPS.indexOf(state.step);
      if (i === 0) return state;
      const to = STEPS[i - 1];
      return {
        step: to,
        firstChoice: to === "first_choice" ? null : state.firstChoice,
        newChoice: to === "new_situation" ? null : state.newChoice,
      };
    }
    case "pickFirst":
      if (state.step !== "first_choice" || !validChoice(action.index)) return state;
      return { ...state, step: "solution", firstChoice: action.index };
    case "pickNew":
      if (state.step !== "new_situation" || !validChoice(action.index)) return state;
      return { ...state, step: "new_feedback", newChoice: action.index };
  }
}

export function progress(state: FlowState): { index: number; total: number } {
  return { index: STEPS.indexOf(state.step) + 1, total: STEPS.length };
}
