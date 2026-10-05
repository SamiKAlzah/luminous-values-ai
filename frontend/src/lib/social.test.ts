import { describe, expect, it } from "vitest";
import { PROGRAM_SOCIAL_LINKS } from "./social";

describe("program social links", () => {
  it("are https links with a label", () => {
    for (const link of PROGRAM_SOCIAL_LINKS) {
      expect(link.label.trim().length, link.url).toBeGreaterThan(0);
      expect(new URL(link.url).protocol, link.url).toBe("https:");
    }
  });
});
