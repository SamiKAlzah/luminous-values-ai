import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { pickLatestResult } from "./latest";
import type { EvalResultFile } from "./metrics";

/** Build-time, server-only: reads eval/results/*.json next to the frontend root. */
export function loadLatestResult(): EvalResultFile | null {
  const dir = join(process.cwd(), "eval", "results");
  if (!existsSync(dir)) return null;

  const files: { name: string; json: EvalResultFile }[] = [];
  for (const name of readdirSync(dir)) {
    if (!name.endsWith(".json")) continue;
    try {
      files.push({ name, json: JSON.parse(readFileSync(join(dir, name), "utf8")) as EvalResultFile });
    } catch {
      // A malformed result file is skipped rather than breaking the build.
    }
  }
  return pickLatestResult(files);
}
