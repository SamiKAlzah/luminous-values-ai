import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { ContentFile, JourneyBody } from "../src/lib/content/schema";
import { verifySource } from "../src/lib/content/verify";
import { JOURNEY_IDS } from "../src/lib/types";

// Manual, network-dependent check (spec §5): fetch each journey's source URL, confirm the quoted
// Arabic text appears on the page, and record the result in the journey file. The approval record
// is left untouched; the offline build gate reads the recorded result.
const JOURNEYS_DIR = join(__dirname, "..", "content", "journeys");

async function main(): Promise<void> {
  const rows: { id: string; pass: boolean; url: string }[] = [];
  for (const id of JOURNEY_IDS) {
    const path = join(JOURNEYS_DIR, `${id}.json`);
    const file = JSON.parse(readFileSync(path, "utf8")) as ContentFile<JourneyBody>;
    const sourceCheck = await verifySource(file.body.source);
    writeFileSync(path, JSON.stringify({ ...file, sourceCheck }, null, 2) + "\n");
    rows.push({ id, pass: sourceCheck.pass, url: sourceCheck.url });
  }

  const width = Math.max(...rows.map((r) => r.id.length));
  console.log(`${"journey".padEnd(width)}  result  url`);
  for (const r of rows) {
    console.log(`${r.id.padEnd(width)}  ${r.pass ? "PASS  " : "FAIL  "}  ${r.url || "(none)"}`);
  }
  const failed = rows.filter((r) => !r.pass).length;
  console.log(`${rows.length - failed} of ${rows.length} sources verified`);
  process.exit(failed === 0 ? 0 : 1);
}

void main();
