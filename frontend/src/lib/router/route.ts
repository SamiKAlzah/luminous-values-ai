import { ROUTES, type Confidence, type Route, type RouteResponse } from "../types";

export interface RouteDeps {
  floor: (t: string) => boolean;
  guard: (k: string) => Promise<"ok" | "limited">;
  classify: (t: string, s: AbortSignal) => Promise<unknown>;
  timeoutMs: number;
}

const FLOOR_SCAN_CHARS = 5000;
const MAX_CHARS = 500;

const UNAVAILABLE: RouteResponse = { outcome: "picker", reason: "unavailable" };

function parseClassification(out: unknown): { route: Route; confidence: Confidence } | null {
  if (typeof out !== "object" || out === null) return null;
  const { route, confidence } = out as { route?: unknown; confidence?: unknown };
  if (typeof route !== "string" || !(ROUTES as readonly string[]).includes(route)) return null;
  if (confidence !== "high" && confidence !== "low") return null;
  return { route: route as Route, confidence };
}

function mapClassification({
  route,
  confidence,
}: {
  route: Route;
  confidence: Confidence;
}): RouteResponse {
  if (route === "refer_safety" || route === "refer_specialist") return { outcome: route };
  if (route === "out_of_scope") return { outcome: "picker", reason: "out_of_scope" };
  if (confidence === "low") return { outcome: "picker", reason: "low_confidence" };
  return { outcome: "journey", journeyId: route };
}

async function classifyWithTimeout(text: string, deps: RouteDeps): Promise<unknown> {
  const controller = new AbortController();
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_resolve, reject) => {
    timer = setTimeout(() => {
      controller.abort();
      reject(new Error("timeout"));
    }, deps.timeoutMs);
  });
  try {
    return await Promise.race([deps.classify(text, controller.signal), timeout]);
  } finally {
    clearTimeout(timer);
  }
}

// Pipeline: empty check, safety floor, guard, length check, model, validation. Never throws.
export async function routeText(
  text: unknown,
  clientKey: string,
  deps: RouteDeps,
): Promise<RouteResponse> {
  try {
    if (typeof text !== "string" || text.trim().length === 0) {
      return { outcome: "picker", reason: "low_confidence" };
    }

    if (deps.floor(text.slice(0, FLOOR_SCAN_CHARS))) {
      return { outcome: "refer_safety" };
    }

    if ((await deps.guard(clientKey)) === "limited") return UNAVAILABLE;

    if (text.length > MAX_CHARS) return { outcome: "picker", reason: "too_long" };

    const parsed = parseClassification(await classifyWithTimeout(text, deps));
    return parsed ? mapClassification(parsed) : UNAVAILABLE;
  } catch {
    return UNAVAILABLE;
  }
}
