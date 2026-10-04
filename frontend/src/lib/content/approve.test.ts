import { describe, expect, it } from "vitest";
import { approveFile } from "./approve";
import { contentHash } from "./hash";
import type { ContentFile } from "./schema";

const draft: ContentFile<{ a: string }> = {
  id: "x",
  approval: {
    status: "draft",
    reviewedBy: "",
    reviewedAt: "",
    version: 2,
    contentHash: "",
  },
  body: { a: "hello" },
};

describe("approveFile", () => {
  const out = approveFile(draft, "Dr Reviewer", "2026-10-04");

  it("marks the file approved by the reviewer on the given day", () => {
    expect(out.approval.status).toBe("approved");
    expect(out.approval.reviewedBy).toBe("Dr Reviewer");
    expect(out.approval.reviewedAt).toBe("2026-10-04");
  });

  it("bumps the version and recomputes the content hash", () => {
    expect(out.approval.version).toBe(3);
    expect(out.approval.contentHash).toBe(contentHash(draft.body));
  });

  it("leaves the body untouched and does not mutate the input", () => {
    expect(out.body).toEqual({ a: "hello" });
    expect(draft.approval.status).toBe("draft");
    expect(draft.approval.version).toBe(2);
  });
});
