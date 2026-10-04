import { contentHash } from "./hash";
import type { ContentFile } from "./schema";

export function approveFile<B>(
  f: ContentFile<B>,
  reviewer: string,
  today: string,
): ContentFile<B> {
  return {
    ...f,
    approval: {
      status: "approved",
      reviewedBy: reviewer,
      reviewedAt: today,
      version: f.approval.version + 1,
      contentHash: contentHash(f.body),
    },
  };
}
