// Router evaluation: model vs model-without-floor vs keyword baseline on eval/cases.json.
//
//   npm run eval -- --split dev [--routers model,modelNoFloor,baseline] [--runs 3]
//                   [--cases <path>]
//
// --cases points at a different case file (for example a synthetic fixture for a smoke run).
// It is still validated with validateCases; there is no way to skip validation.
// The model routers need ANTHROPIC_API_KEY (npm run eval loads frontend/.env.local); the
// baseline needs no key. The key is never printed or written.
//
// Gates: dev exits 1 when a safety case reaches a journey on the model router. Test must use all
// three routers, --runs 3 and eval/cases.json; it refuses to run when a result for the same
// prompt hash exists (run-once rule), and writes nothing when over 10% of model responses fell
// back to the picker (the run did not count). Dev results are named
// <date>-dev-<hash8>-<HHMMSS>.json and are never overwritten.
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { sha256Hex } from "../src/lib/content/hash";
import { JOURNEY_LIST } from "../src/lib/content/load";
import type { JourneyText } from "../src/lib/content/schema";
import { validateCases, type EvalCase } from "../src/lib/eval/cases";
import {
  collectKnownFailures,
  runEval,
  scoreFloor,
  scoreRouter,
  type EvalResultFile,
  type MetricCount,
} from "../src/lib/eval/metrics";
import { checkTestRunAllowed, isRunUsable, resultFileName } from "../src/lib/eval/run";
import { percentile } from "../src/lib/eval/stats";
import { createBaselineRouter, type KeywordsFile, type Router } from "../src/lib/router/baseline";
import { createFloor } from "../src/lib/router/floor";
import { makeHaikuClassifier } from "../src/lib/router/model";
import { ROUTER_SYSTEM_PROMPT } from "../src/lib/router/prompt";
import { routeText, type RouteDeps } from "../src/lib/router/route";
import { JOURNEY_IDS, type JourneyId } from "../src/lib/types";

const ROOT = join(__dirname, "..");
const DEFAULT_CASES = join(ROOT, "eval", "cases.json");
const RESULTS_DIR = join(ROOT, "eval", "results");
const ALL_ROUTERS = ["model", "modelNoFloor", "baseline"] as const;
type RouterName = (typeof ALL_ROUTERS)[number];

// Same budget as the Netlify function, so the evaluation measures what ships.
const TIMEOUT_MS = 5000;

class UsageError extends Error {}

interface Args {
  split: "dev" | "test";
  routers: RouterName[];
  runs: number;
  casesPath: string;
  customCases: boolean;
}

function parseArgs(argv: string[]): Args {
  const flags = new Map<string, string>();
  for (let i = 0; i < argv.length; i += 2) {
    const flag = argv[i];
    const value = argv[i + 1];
    if (!flag?.startsWith("--") || value === undefined || value.startsWith("--")) {
      throw new UsageError(`Bad arguments near "${flag ?? ""}". Flags: --split --routers --runs --cases`);
    }
    flags.set(flag.slice(2), value);
  }

  for (const key of flags.keys()) {
    if (!["split", "routers", "runs", "cases"].includes(key)) {
      throw new UsageError(`Unknown flag --${key}`);
    }
  }

  const split = flags.get("split");
  if (split !== "dev" && split !== "test") throw new UsageError("--split dev|test is required");

  const requested = flags.get("routers")?.split(",").map((r) => r.trim()) ?? [...ALL_ROUTERS];
  const routers = requested.filter((r): r is RouterName =>
    (ALL_ROUTERS as readonly string[]).includes(r),
  );
  if (routers.length === 0 || routers.length !== requested.length) {
    throw new UsageError(`--routers must be a comma list of: ${ALL_ROUTERS.join(", ")}`);
  }

  const runs = Number(flags.get("runs") ?? 3);
  if (!Number.isInteger(runs) || runs < 1) throw new UsageError("--runs must be a positive integer");

  return {
    split,
    routers,
    runs,
    casesPath: flags.get("cases") ?? DEFAULT_CASES,
    customCases: flags.has("cases"),
  };
}

function loadCases(path: string): EvalCase[] {
  if (!existsSync(path)) {
    throw new UsageError(
      `Case file not found: ${path}. The reviewer writes eval/cases.json before any evaluation.`,
    );
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(readFileSync(path, "utf8"));
  } catch {
    throw new UsageError(`Case file is not valid JSON: ${path}`);
  }
  if (!Array.isArray(parsed)) throw new UsageError("Case file must be a JSON array of cases");

  const cases = parsed as EvalCase[];
  const problems = validateCases(cases);
  if (problems.length > 0) {
    throw new UsageError(
      `Case file has ${problems.length} problem(s):\n${problems.map((p) => `  - ${p}`).join("\n")}`,
    );
  }
  return cases;
}

function journeyText(t: JourneyText): string {
  return [
    t.title,
    t.situation,
    ...t.firstChoices.map((c) => c.text),
    t.newSituation,
    ...t.newChoices.map((c) => c.text),
  ].join(" ");
}

function journeyTexts(): Record<JourneyId, string> {
  const out = {} as Record<JourneyId, string>;
  JOURNEY_IDS.forEach((id, i) => {
    const { ar, en } = JOURNEY_LIST[i].body;
    out[id] = `${journeyText(ar)} ${journeyText(en)}`;
  });
  return out;
}

function readJsonFile<T>(path: string): T {
  return JSON.parse(readFileSync(path, "utf8")) as T;
}

function gitCommit(): string {
  try {
    return execFileSync("git", ["rev-parse", "HEAD"], { cwd: ROOT, encoding: "utf8" }).trim();
  } catch {
    return "unknown";
  }
}

function testRunAlreadyExists(split: string, promptHash8: string): string | undefined {
  if (!existsSync(RESULTS_DIR)) return undefined;
  return readdirSync(RESULTS_DIR).find(
    (name) => name.endsWith(`-${split}-${promptHash8}.json`),
  );
}

function fmt(m: MetricCount): string {
  return `${m.k}/${m.n} [${m.lo.toFixed(3)}, ${m.hi.toFixed(3)}]`;
}

async function main(): Promise<number> {
  const args = parseArgs(process.argv.slice(2));
  const notAllowed = checkTestRunAllowed(args);
  if (notAllowed) throw new UsageError(`Refusing to run: ${notAllowed}`);
  const allCases = loadCases(args.casesPath);
  const cases = allCases.filter((c) => c.split === args.split);

  const promptHash = sha256Hex(ROUTER_SYSTEM_PROMPT);
  const promptHash8 = promptHash.slice(0, 8);

  if (args.split === "test") {
    const existing = testRunAlreadyExists("test", promptHash8);
    if (existing) {
      throw new UsageError(
        `Refusing to run: eval/results/${existing} already holds a test run for prompt ${promptHash8}. ` +
          "The test set is run once per frozen prompt; change the prompt (new hash) to run again.",
      );
    }
  }

  const usesModel = args.routers.includes("model") || args.routers.includes("modelNoFloor");
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (usesModel && !apiKey) {
    throw new UsageError(
      "ANTHROPIC_API_KEY is not set. Put it in frontend/.env.local and use `npm run eval`, " +
        "or run with --routers baseline.",
    );
  }

  const floor = createFloor(
    readJsonFile<{ body: { phrases: { ar: string[]; en: string[] } } }>(
      join(ROOT, "content", "safety-floor.json"),
    ).body.phrases,
  );
  const keywords = readJsonFile<KeywordsFile>(join(ROOT, "eval", "keywords.json"));

  // Measurements gathered from the model calls themselves.
  const latencies: number[] = [];
  const usages: { inputTokens: number; outputTokens: number }[] = [];
  let modelId = "none (baseline only)";

  const fetchImpl: typeof fetch = async (input, init) => {
    try {
      const body = JSON.parse(String(init?.body)) as { model?: unknown };
      if (typeof body.model === "string") modelId = body.model;
    } catch {
      // Only used to record the model id.
    }
    return fetch(input, init);
  };
  const haiku = makeHaikuClassifier({ apiKey, fetchImpl, onUsage: (u) => usages.push(u) });
  const classify: RouteDeps["classify"] = async (text, signal) => {
    const start = performance.now();
    try {
      return await haiku(text, signal);
    } finally {
      latencies.push(performance.now() - start);
    }
  };
  const modelRouter = (floorFn: (t: string) => boolean): Router => {
    const deps: RouteDeps = {
      floor: floorFn,
      guard: async () => "ok",
      classify,
      timeoutMs: TIMEOUT_MS,
    };
    return (text) => routeText(text, "eval", deps);
  };

  const available: Record<RouterName, () => Router> = {
    model: () => modelRouter(floor),
    modelNoFloor: () => modelRouter(() => false),
    baseline: () => createBaselineRouter(keywords, journeyTexts(), floor),
  };
  const routers: Record<string, Router> = {};
  for (const name of args.routers) routers[name] = available[name]();

  console.log(
    `eval: split=${args.split} cases=${cases.length} runs=${args.runs} routers=${args.routers.join(",")}`,
  );
  const runs = await runEval({ cases, routers, runsPerCase: args.runs });

  const metrics: EvalResultFile["routers"] = {};
  const knownFailures: EvalResultFile["knownFailures"] = [];
  for (const name of args.routers) {
    metrics[name] = scoreRouter(cases, runs[name]);
    knownFailures.push(...collectKnownFailures(name, cases, runs[name]));
  }

  // A test run where the model mostly fell back to the picker measured nothing and must not
  // consume the run-once slot. Abort before anything is written.
  if (args.split === "test" && metrics.model && !isRunUsable(metrics.model.fallbackRate)) {
    throw new UsageError(
      "The test run did not count and nothing was written: too many model responses fell back to " +
        "the picker. Check the API key and network, then run again.",
    );
  }

  const mean = (pick: (u: { inputTokens: number; outputTokens: number }) => number): number =>
    usages.length === 0 ? 0 : usages.reduce((sum, u) => sum + pick(u), 0) / usages.length;

  const result: EvalResultFile = {
    runAt: new Date().toISOString(),
    modelId,
    promptHash,
    gitCommit: gitCommit(),
    split: args.split,
    runsPerCase: args.runs,
    routers: metrics,
    floor: scoreFloor(cases, floor),
    latencyMs: { p50: percentile(latencies, 50), p95: percentile(latencies, 95) },
    meanTokens: { input: mean((u) => u.inputTokens), output: mean((u) => u.outputTokens) },
    knownFailures,
  };

  mkdirSync(RESULTS_DIR, { recursive: true });
  const fileName = resultFileName(args.split, promptHash8, new Date());
  try {
    // "wx": never overwrite an existing result.
    writeFileSync(join(RESULTS_DIR, fileName), `${JSON.stringify(result, null, 2)}\n`, {
      flag: "wx",
    });
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "EEXIST") {
      throw new UsageError(`Refusing to overwrite eval/results/${fileName}.`);
    }
    throw err;
  }

  for (const [name, m] of Object.entries(metrics)) {
    console.log(`\n${name}`);
    console.log(`  in-scope top-1      ${fmt(m.inScopeTop1)}`);
    console.log(`  ambiguous hit       ${fmt(m.ambiguousHit)}`);
    console.log(`  out-of-scope        ${fmt(m.outOfScopeHandled)}`);
    console.log(`  specialist recall   ${fmt(m.specialistRecall)}`);
    console.log(`  safety recall       ${fmt(m.safetyRecall)}`);
    console.log(`  false referral      ${fmt(m.falseReferral)}`);
    console.log(`  consistency         ${fmt(m.consistency)}`);
    console.log(`  fallback            ${m.fallbackRate.k}/${m.fallbackRate.n}`);
  }
  console.log(`\nfloor alone: safety caught ${fmt(result.floor.safetyCaught)}, in-scope wrongly caught ${fmt(result.floor.inScopeWronglyCaught)}`);
  console.log(`known failures: ${knownFailures.length}`);
  console.log(`wrote eval/results/${fileName}`);

  if (args.split === "dev" && runs.model) {
    const leaked = cases.filter(
      (c, i) =>
        c.category === "safety" && runs.model[i].some((r) => r.outcome === "journey"),
    );
    if (leaked.length > 0) {
      console.error(
        `\nGATE FAILED: safety case(s) routed to a journey by the model router: ${leaked
          .map((c) => c.id)
          .join(", ")}. This prompt version is blocked.`,
      );
      return 1;
    }
  }
  return 0;
}

main()
  .then((code) => process.exit(code))
  .catch((err: unknown) => {
    console.error(err instanceof UsageError ? err.message : "eval failed unexpectedly");
    if (!(err instanceof UsageError) && err instanceof Error) console.error(err.stack);
    process.exit(1);
  });
