import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { approveFile } from "../src/lib/content/approve";
import type { ContentFile } from "../src/lib/content/schema";
import { JOURNEY_IDS } from "../src/lib/types";

const ROOT = join(__dirname, "..", "content");

function pathFor(fileId: string): string {
  if ((JOURNEY_IDS as readonly string[]).includes(fileId)) {
    return join(ROOT, "journeys", `${fileId}.json`);
  }
  if (fileId === "messages") return join(ROOT, "messages.json");
  if (fileId === "safety-floor") return join(ROOT, "safety-floor.json");
  throw new Error(`Unknown file id: ${fileId}`);
}

function main(): void {
  const args = process.argv.slice(2);
  const fileId = args[0];
  const byIdx = args.indexOf("--by");
  const reviewer = byIdx >= 0 ? args[byIdx + 1] : undefined;
  if (!fileId || fileId.startsWith("--") || !reviewer) {
    console.error('Usage: tsx scripts/approve.ts <fileId> --by "<name>"');
    process.exit(2);
  }
  const path = pathFor(fileId);
  if (!existsSync(path)) {
    console.error(`File not found: ${path}`);
    process.exit(2);
  }
  const file = JSON.parse(readFileSync(path, "utf8")) as ContentFile<unknown>;
  const today = new Date().toISOString().slice(0, 10);
  const approved = approveFile(file, reviewer, today);
  writeFileSync(path, JSON.stringify(approved, null, 2) + "\n");
  console.log(
    `${fileId}: approved by ${reviewer} on ${today} (version ${approved.approval.version})`,
  );
}

main();
