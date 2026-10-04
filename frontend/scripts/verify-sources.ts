import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { verifySource } from "../src/lib/content/verify";
import { JOURNEY_IDS } from "../src/lib/types";
import { verifyJourneyFiles } from "./lib/verify-files";

// Manual, network-dependent check (spec §5): fetch each journey's source URL, confirm the quoted
// Arabic text appears in the page's server-rendered visible text, and record the result in the
// journey file. The approval record is left untouched; the offline build gate reads the result.
const JOURNEYS_DIR = join(__dirname, "..", "content", "journeys");

async function main(): Promise<void> {
  const rows = await verifyJourneyFiles(
    JOURNEY_IDS.map((id) => join(JOURNEYS_DIR, `${id}.json`)),
    {
      read: (path) => readFileSync(path, "utf8"),
      write: (path, data) => writeFileSync(path, data),
      verify: (source) => verifySource(source),
    },
  );

  const width = Math.max(...rows.map((r) => r.id.length));
  console.log(`${"journey".padEnd(width)}  result  url`);
  for (const r of rows) {
    const detail = r.error ? `(error: ${r.error})` : r.url || "(none)";
    console.log(`${r.id.padEnd(width)}  ${r.pass ? "PASS  " : "FAIL  "}  ${detail}`);
  }
  const failed = rows.filter((r) => !r.pass).length;
  console.log(`${rows.length - failed} of ${rows.length} sources verified`);
  process.exit(failed === 0 ? 0 : 1);
}

void main();
