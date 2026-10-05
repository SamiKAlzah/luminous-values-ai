import type { EvalResultFile } from "./metrics";

/** Newest test-split result wins; dev runs are tuning runs and are never published. */
export function pickLatestResult(
  files: { name: string; json: EvalResultFile }[],
): EvalResultFile | null {
  const test = files.filter((f) => f.json.split === "test");
  if (test.length === 0) return null;
  return test.reduce((best, f) =>
    Date.parse(f.json.runAt) > Date.parse(best.json.runAt) ? f : best,
  ).json;
}
