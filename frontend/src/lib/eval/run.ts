// Pure decisions for scripts/eval.ts, kept here (Node-free) so they can be unit tested.

export interface RunSettings {
  split: "dev" | "test";
  routers: string[];
  runs: number;
  /** True when --cases pointed at something other than the default eval/cases.json. */
  customCases: boolean;
}

const ALL_ROUTERS = ["model", "modelNoFloor", "baseline"];
const TEST_RUNS = 3;
const MAX_FALLBACK_RATE = 0.1;

/**
 * The test set is run once per frozen prompt, so a test run must be the real thing: all three
 * routers, 3 runs per case, the reviewer's case file. Returns a problem message, or undefined.
 */
export function checkTestRunAllowed(s: RunSettings): string | undefined {
  if (s.split !== "test") return undefined;
  const complete =
    s.routers.length === ALL_ROUTERS.length && ALL_ROUTERS.every((r) => s.routers.includes(r));
  if (!complete) {
    return `A test run needs all routers (${ALL_ROUTERS.join(",")}); the test set is run once per prompt.`;
  }
  if (s.runs !== TEST_RUNS) {
    return `A test run needs --runs ${TEST_RUNS}; the test set is run once per prompt.`;
  }
  if (s.customCases) {
    return "A test run must use eval/cases.json; --cases is for dev smoke runs only.";
  }
  return undefined;
}

/** A run where more than 10% of model responses fell back to the picker did not measure the model. */
export function isRunUsable(fallbackRate: { k: number; n: number }): boolean {
  return fallbackRate.n === 0 || fallbackRate.k / fallbackRate.n <= MAX_FALLBACK_RATE;
}

/**
 * Test results keep the plain <date>-test-<hash8>.json name (that name is the run-once marker).
 * Dev results get a UTC time suffix so they are never overwritten.
 */
export function resultFileName(split: "dev" | "test", promptHash8: string, now: Date): string {
  const iso = now.toISOString();
  const date = iso.slice(0, 10);
  if (split === "test") return `${date}-test-${promptHash8}.json`;
  const time = iso.slice(11, 19).replace(/:/g, "");
  return `${date}-dev-${promptHash8}-${time}.json`;
}
