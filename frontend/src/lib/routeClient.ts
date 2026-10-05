import { JOURNEY_IDS, type PickerReason, type RouteResponse } from "./types";

const ENDPOINT = "/.netlify/functions/route";
const DEFAULT_TIMEOUT_MS = 7000;

const UNAVAILABLE: RouteResponse = { outcome: "picker", reason: "unavailable" };
const PICKER_REASONS: readonly PickerReason[] = [
  "low_confidence",
  "out_of_scope",
  "unavailable",
  "too_long",
];

/** Accepts only the four response shapes the function can send; anything else is null. */
export function parseRouteResponse(x: unknown): RouteResponse | null {
  if (typeof x !== "object" || x === null) return null;
  const o = x as { outcome?: unknown; journeyId?: unknown; reason?: unknown };
  switch (o.outcome) {
    case "journey":
      return typeof o.journeyId === "string" &&
        (JOURNEY_IDS as readonly string[]).includes(o.journeyId)
        ? { outcome: "journey", journeyId: o.journeyId as (typeof JOURNEY_IDS)[number] }
        : null;
    case "picker":
      return typeof o.reason === "string" && (PICKER_REASONS as readonly string[]).includes(o.reason)
        ? { outcome: "picker", reason: o.reason as PickerReason }
        : null;
    case "refer_specialist":
      return { outcome: "refer_specialist" };
    case "refer_safety":
      return { outcome: "refer_safety" };
    default:
      return null;
  }
}

/** Never throws: any failure becomes the "smart routing unavailable" picker. */
export async function requestRoute(
  text: string,
  fetchImpl: typeof fetch = fetch,
  timeoutMs: number = DEFAULT_TIMEOUT_MS,
): Promise<RouteResponse> {
  const controller = new AbortController();
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_resolve, reject) => {
    timer = setTimeout(() => {
      controller.abort();
      reject(new Error("timeout"));
    }, timeoutMs);
  });

  const call = (async () => {
    const res = await fetchImpl(ENDPOINT, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ text }),
      signal: controller.signal,
    });
    if (!res.ok) throw new Error(`http_${res.status}`);
    return parseRouteResponse(await res.json());
  })();

  try {
    return (await Promise.race([call, timeout])) ?? UNAVAILABLE;
  } catch {
    return UNAVAILABLE;
  } finally {
    clearTimeout(timer);
    call.catch(() => {});
  }
}
