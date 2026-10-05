import { describe, expect, it, vi } from "vitest";
import { parseRouteResponse, requestRoute } from "./routeClient";

const UNAVAILABLE = { outcome: "picker", reason: "unavailable" };

function okResponse(body: unknown): Response {
  return new Response(JSON.stringify(body), { status: 200 });
}

describe("parseRouteResponse", () => {
  it("accepts all four outcomes", () => {
    expect(parseRouteResponse({ outcome: "journey", journeyId: "tolerance_accent" })).toEqual({
      outcome: "journey",
      journeyId: "tolerance_accent",
    });
    expect(parseRouteResponse({ outcome: "picker", reason: "too_long" })).toEqual({
      outcome: "picker",
      reason: "too_long",
    });
    expect(parseRouteResponse({ outcome: "refer_specialist" })).toEqual({ outcome: "refer_specialist" });
    expect(parseRouteResponse({ outcome: "refer_safety" })).toEqual({ outcome: "refer_safety" });
  });

  it("rejects an unknown journey id, reason or outcome", () => {
    expect(parseRouteResponse({ outcome: "journey", journeyId: "hack" })).toBeNull();
    expect(parseRouteResponse({ outcome: "picker", reason: "nope" })).toBeNull();
    expect(parseRouteResponse({ outcome: "nope" })).toBeNull();
    expect(parseRouteResponse(null)).toBeNull();
    expect(parseRouteResponse("journey")).toBeNull();
  });
});

describe("requestRoute", () => {
  it("returns a valid body as parsed", async () => {
    const fetchImpl = vi.fn(async () => okResponse({ outcome: "journey", journeyId: "peace_before_escalation" }));
    expect(await requestRoute("hi", fetchImpl as unknown as typeof fetch)).toEqual({
      outcome: "journey",
      journeyId: "peace_before_escalation",
    });
    const [url, init] = fetchImpl.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("/.netlify/functions/route");
    expect(JSON.parse(init.body as string)).toEqual({ text: "hi" });
  });

  it("falls back to the unavailable picker when fetch rejects", async () => {
    const fetchImpl = vi.fn(async () => {
      throw new Error("offline");
    });
    expect(await requestRoute("x", fetchImpl as unknown as typeof fetch)).toEqual(UNAVAILABLE);
  });

  it("falls back when the request never resolves", async () => {
    const fetchImpl = vi.fn(() => new Promise<Response>(() => {}));
    expect(await requestRoute("x", fetchImpl as unknown as typeof fetch, 20)).toEqual(UNAVAILABLE);
  });

  it("falls back on HTTP 500, non-JSON and malformed bodies", async () => {
    const make = (r: () => Response) => vi.fn(async () => r()) as unknown as typeof fetch;
    expect(await requestRoute("x", make(() => new Response("{}", { status: 500 })))).toEqual(UNAVAILABLE);
    expect(await requestRoute("x", make(() => new Response("<html>", { status: 200 })))).toEqual(UNAVAILABLE);
    expect(await requestRoute("x", make(() => okResponse({ outcome: "nope" })))).toEqual(UNAVAILABLE);
  });
});
