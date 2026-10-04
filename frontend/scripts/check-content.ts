import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { checkGate } from "../src/lib/content/gate";
import type { ContentFile } from "../src/lib/content/schema";

const ROOT = join(__dirname, "..", "content");

function readJson(path: string): ContentFile<unknown> {
  return JSON.parse(readFileSync(path, "utf8")) as ContentFile<unknown>;
}

function loadAll(): ContentFile<unknown>[] {
  const files: ContentFile<unknown>[] = [];
  const journeysDir = join(ROOT, "journeys");
  if (existsSync(journeysDir)) {
    for (const name of readdirSync(journeysDir).sort()) {
      if (name.endsWith(".json")) files.push(readJson(join(journeysDir, name)));
    }
  }
  for (const name of ["messages.json", "safety-floor.json"]) {
    const path = join(ROOT, name);
    if (existsSync(path)) files.push(readJson(path));
  }
  return files;
}

const strict =
  process.env.CONTEXT === "production" || process.env.CONTENT_GATE === "strict";
const mode = strict ? "strict" : "warn";
const { ok, problems } = checkGate(loadAll(), mode);

console.log(`content gate (${mode}): ${problems.length} problem(s)`);
for (const p of problems) console.log(`  - ${p}`);

process.exit(ok ? 0 : 1);
