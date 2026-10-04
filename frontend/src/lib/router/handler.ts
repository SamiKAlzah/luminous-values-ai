import safetyFloor from "../../../content/safety-floor.json";
import { createFloor } from "./floor";
import { createGuard } from "./guard";
import { makeHaikuClassifier } from "./model";
import { routeText, type RouteDeps } from "./route";

const FLOOR_PHRASES = safetyFloor.body.phrases;

// One guard per function instance so the limits span requests.
const sharedGuard = createGuard();
const sharedFloor = createFloor(FLOOR_PHRASES);

const HEADERS = {
  "content-type": "application/json",
  "cache-control": "no-store",
};

function json(body: unknown, status = 200, extra: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...HEADERS, ...extra },
  });
}

async function readText(req: Request): Promise<unknown> {
  try {
    const body: unknown = JSON.parse(await req.text());
    if (typeof body !== "object" || body === null) return undefined;
    return (body as { text?: unknown }).text;
  } catch {
    return undefined;
  }
}

// Every outcome is HTTP 200 JSON, except unsupported methods (405). Raw user text is never
// logged and never appears in a response.
export async function handleRequest(
  req: Request,
  env: { apiKey?: string; ip: string },
  deps: Partial<RouteDeps> = {},
): Promise<Response> {
  if (req.method === "GET") return json({ available: Boolean(env.apiKey) });
  if (req.method !== "POST") {
    return json({ error: "method_not_allowed" }, 405, { allow: "GET, POST" });
  }

  const routeDeps: RouteDeps = {
    floor: sharedFloor,
    guard: sharedGuard,
    classify: makeHaikuClassifier({
      apiKey: env.apiKey,
      onUsage: (u) => console.log(JSON.stringify({ event: "usage", ...u })),
    }),
    timeoutMs: 5000,
    ...deps,
  };

  const result = await routeText(await readText(req), env.ip || "unknown", routeDeps);
  return json(result);
}
