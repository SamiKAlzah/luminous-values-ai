import { JOURNEY_IDS } from "../types";
import { contentHash, sha256Hex } from "./hash";
import type { ContentFile } from "./schema";

const EXPECTED_IDS: readonly string[] = [
  ...JOURNEY_IDS,
  "messages",
  "safety-floor",
];

function checkSource(f: ContentFile<unknown>, problems: string[]): void {
  const check = f.sourceCheck;
  if (!check) {
    problems.push(`${f.id}: sourceCheck is missing (source not verified)`);
    return;
  }
  if (!check.pass) {
    problems.push(`${f.id}: sourceCheck did not pass`);
  }
  const source = (f.body as { source?: { url?: string; arabicText?: string } })
    ?.source;
  if (!source) {
    problems.push(`${f.id}: body has no source to check against sourceCheck`);
    return;
  }
  if (check.url !== (source.url ?? "")) {
    problems.push(`${f.id}: source url changed since sourceCheck`);
  }
  if (check.arabicTextHash !== sha256Hex(source.arabicText ?? "")) {
    problems.push(`${f.id}: source arabicText changed since sourceCheck`);
  }
}

export function checkGate(
  files: ContentFile<unknown>[],
  mode: "strict" | "warn",
): { ok: boolean; problems: string[] } {
  const problems: string[] = [];
  const byId = new Map(files.map((f) => [f.id, f]));

  for (const id of EXPECTED_IDS) {
    if (!byId.has(id)) problems.push(`${id}: expected content file is missing`);
  }

  for (const f of files) {
    if (f.approval.status !== "approved") {
      problems.push(`${f.id}: status is draft, not approved`);
    } else if (f.approval.contentHash !== contentHash(f.body)) {
      problems.push(
        `${f.id}: contentHash mismatch (body edited after approval)`,
      );
    }
    if ((JOURNEY_IDS as readonly string[]).includes(f.id)) {
      checkSource(f, problems);
    }
  }

  return { ok: mode === "warn" || problems.length === 0, problems };
}
