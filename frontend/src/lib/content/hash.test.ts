import { describe, expect, it } from "vitest";
import { contentHash, sha256Hex } from "./hash";

describe("contentHash", () => {
  it("is independent of key order", () => {
    expect(contentHash({ b: 1, a: 2 })).toBe(contentHash({ a: 2, b: 1 }));
  });

  it("is independent of nested key order", () => {
    expect(contentHash({ x: { b: 1, a: 2 } })).toBe(
      contentHash({ x: { a: 2, b: 1 } }),
    );
  });

  it("changes when a nested string changes", () => {
    expect(contentHash({ a: { b: ["x"] } })).not.toBe(
      contentHash({ a: { b: ["y"] } }),
    );
  });

  it("is a 64-character lowercase hex digest", () => {
    expect(contentHash({ a: 1 })).toMatch(/^[0-9a-f]{64}$/);
  });
});

describe("sha256Hex", () => {
  it("matches the known digest of the empty string", () => {
    expect(sha256Hex("")).toBe(
      "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    );
  });
});
