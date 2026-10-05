import { describe, expect, it } from "vitest";
import { pickLatestResult } from "./latest";
import type { EvalResultFile } from "./metrics";

function file(split: "dev" | "test", runAt: string): { name: string; json: EvalResultFile } {
  return {
    name: `${runAt}-${split}.json`,
    json: { runAt, split } as unknown as EvalResultFile,
  };
}

describe("pickLatestResult", () => {
  it("returns null for an empty list", () => {
    expect(pickLatestResult([])).toBeNull();
  });

  it("ignores dev results", () => {
    expect(pickLatestResult([file("dev", "2026-10-05T10:00:00Z")])).toBeNull();
  });

  it("returns the newest test result", () => {
    const older = file("test", "2026-10-04T10:00:00Z");
    const newer = file("test", "2026-10-05T10:00:00Z");
    expect(pickLatestResult([newer, older, file("dev", "2026-10-06T10:00:00Z")])).toBe(newer.json);
  });
});
