import { describe, expect, it } from "vitest";
import { checkTestRunAllowed, isRunUsable, resultFileName } from "./run";

const FULL = {
  split: "test" as const,
  routers: ["model", "modelNoFloor", "baseline"],
  runs: 3,
  customCases: false,
};

describe("checkTestRunAllowed", () => {
  it("allows the full default test run", () => {
    expect(checkTestRunAllowed(FULL)).toBeUndefined();
  });

  it("allows the three routers in any order", () => {
    expect(
      checkTestRunAllowed({ ...FULL, routers: ["baseline", "model", "modelNoFloor"] }),
    ).toBeUndefined();
  });

  it("refuses a test run without every router", () => {
    expect(checkTestRunAllowed({ ...FULL, routers: ["baseline"] })).toMatch(/routers/);
    expect(checkTestRunAllowed({ ...FULL, routers: ["model", "baseline"] })).toMatch(/routers/);
  });

  it("refuses a test run with other than 3 runs", () => {
    expect(checkTestRunAllowed({ ...FULL, runs: 1 })).toMatch(/--runs 3/);
  });

  it("refuses a test run on a custom case file", () => {
    expect(checkTestRunAllowed({ ...FULL, customCases: true })).toMatch(/--cases/);
  });

  it("does not restrict dev runs", () => {
    expect(
      checkTestRunAllowed({ split: "dev", routers: ["baseline"], runs: 1, customCases: true }),
    ).toBeUndefined();
  });
});

describe("isRunUsable", () => {
  it("accepts a fallback rate up to 10%", () => {
    expect(isRunUsable({ k: 0, n: 120 })).toBe(true);
    expect(isRunUsable({ k: 12, n: 120 })).toBe(true);
  });

  it("rejects a fallback rate above 10%", () => {
    expect(isRunUsable({ k: 13, n: 120 })).toBe(false);
    expect(isRunUsable({ k: 120, n: 120 })).toBe(false);
  });

  it("treats a run with no responses as usable", () => {
    expect(isRunUsable({ k: 0, n: 0 })).toBe(true);
  });
});

describe("resultFileName", () => {
  const at = new Date("2026-10-04T09:08:05.226Z");

  it("keeps the plain pattern for test runs", () => {
    expect(resultFileName("test", "bd9e803c", at)).toBe("2026-10-04-test-bd9e803c.json");
  });

  it("adds a UTC time suffix for dev runs", () => {
    expect(resultFileName("dev", "bd9e803c", at)).toBe("2026-10-04-dev-bd9e803c-090805.json");
  });
});
