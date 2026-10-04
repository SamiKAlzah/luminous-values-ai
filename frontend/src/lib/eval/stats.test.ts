import { describe, expect, it } from "vitest";
import { percentile, wilson } from "./stats";

describe("wilson", () => {
  it("matches the reference interval for 27 of 30", () => {
    const { lo, hi } = wilson(27, 30);
    expect(lo).toBeCloseTo(0.7438, 3);
    expect(hi).toBeCloseTo(0.9654, 3);
  });

  it("returns the uninformative interval when n is 0", () => {
    expect(wilson(0, 0)).toEqual({ lo: 0, hi: 1 });
  });

  it("caps the upper bound at exactly 1 for a perfect score", () => {
    expect(wilson(30, 30).hi).toBe(1);
  });

  it("floors the lower bound at exactly 0 for a zero score", () => {
    expect(wilson(0, 30).lo).toBe(0);
  });
});

describe("percentile", () => {
  it("uses the nearest-rank method", () => {
    expect(percentile([10, 20, 30, 40], 50)).toBe(20);
    expect(percentile([10, 20, 30, 40], 95)).toBe(40);
  });

  it("does not depend on input order", () => {
    expect(percentile([40, 10, 30, 20], 50)).toBe(20);
  });

  it("returns 0 for an empty list", () => {
    expect(percentile([], 50)).toBe(0);
  });
});
