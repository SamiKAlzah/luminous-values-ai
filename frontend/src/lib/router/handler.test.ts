import { describe, expect, it, vi } from "vitest";
import { handleRequest } from "./handler";
import type { RouteDeps } from "./route";

const SECRET = "my-very-private-situation-text";

function post(body: string): Request {
  return new Request("http://localhost/.netlify/functions/route", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body,
  });
}

function get(): Request {
  return new Request("http://localhost/.netlify/functions/route", { method: "GET" });
}

function fakeDeps(overrides: Partial<RouteDeps> = {}): Partial<RouteDeps> {
  return {
    floor: () => false,
    guard: async () => "ok",
    classify: async () => ({ route: "tolerance_accent", confidence: "high" }),
    timeoutMs: 1000,
    ...overrides,
  };
}

function expectJsonNoStore(res: Response) {
  expect(res.headers.get("content-type")).toBe("application/json");
  expect(res.headers.get("cache-control")).toBe("no-store");
}

describe("handleRequest", () => {
  it("routes a valid POST to a journey", async () => {
    const res = await handleRequest(
      post(JSON.stringify({ text: SECRET })),
      { apiKey: "k", ip: "1.2.3.4" },
      fakeDeps(),
    );
    expect(res.status).toBe(200);
    expectJsonNoStore(res);
    expect(await res.json()).toEqual({ outcome: "journey", journeyId: "tolerance_accent" });
  });

  it("passes the client ip to the guard", async () => {
    const guard = vi.fn(async () => "ok" as const);
    await handleRequest(
      post(JSON.stringify({ text: "hello" })),
      { apiKey: "k", ip: "9.9.9.9" },
      fakeDeps({ guard }),
    );
    expect(guard).toHaveBeenCalledWith("9.9.9.9");
  });

  it("returns a low_confidence picker for invalid JSON", async () => {
    const res = await handleRequest(post("{not json"), { apiKey: "k", ip: "ip" }, fakeDeps());
    expect(res.status).toBe(200);
    expectJsonNoStore(res);
    expect(await res.json()).toEqual({ outcome: "picker", reason: "low_confidence" });
  });

  it.each([["null"], ["[]"], ["42"], ['"text"'], ['{"text":42}'], ["{}"]])(
    "returns a low_confidence picker for body %s",
    async (body) => {
      const res = await handleRequest(post(body), { apiKey: "k", ip: "ip" }, fakeDeps());
      expect(res.status).toBe(200);
      expect(await res.json()).toEqual({ outcome: "picker", reason: "low_confidence" });
    },
  );

  it("returns an unavailable picker when the api key is missing", async () => {
    const res = await handleRequest(post(JSON.stringify({ text: SECRET })), {
      apiKey: undefined,
      ip: "ip-missing-key",
    });
    expect(res.status).toBe(200);
    expectJsonNoStore(res);
    expect(await res.json()).toEqual({ outcome: "picker", reason: "unavailable" });
  });

  it("returns refer_safety when the floor matches", async () => {
    const res = await handleRequest(
      post(JSON.stringify({ text: "kill myself" })),
      { apiKey: "k", ip: "ip" },
      fakeDeps({ floor: (t) => t.includes("kill myself") }),
    );
    expect(await res.json()).toEqual({ outcome: "refer_safety" });
  });

  it("GET reports availability from the api key", async () => {
    const on = await handleRequest(get(), { apiKey: "k", ip: "ip" });
    expect(on.status).toBe(200);
    expectJsonNoStore(on);
    expect(await on.json()).toEqual({ available: true });

    const off = await handleRequest(get(), { apiKey: undefined, ip: "ip" });
    expect(off.status).toBe(200);
    expectJsonNoStore(off);
    expect(await off.json()).toEqual({ available: false });

    const empty = await handleRequest(get(), { apiKey: "", ip: "ip" });
    expect(await empty.json()).toEqual({ available: false });
  });

  it.each(["PUT", "DELETE", "PATCH"])("returns 405 for %s", async (method) => {
    const res = await handleRequest(
      new Request("http://localhost/x", { method, body: JSON.stringify({ text: SECRET }) }),
      { apiKey: "k", ip: "ip" },
      fakeDeps(),
    );
    expect(res.status).toBe(405);
    expectJsonNoStore(res);
    expect(await res.text()).not.toContain(SECRET);
  });

  it("never echoes the request text in any response", async () => {
    const bodies: string[] = [];
    const cases: Array<Partial<RouteDeps>> = [
      fakeDeps(),
      fakeDeps({
        classify: async () => {
          throw new Error(SECRET);
        },
      }),
      fakeDeps({ guard: async () => "limited" }),
      fakeDeps({ floor: () => true }),
    ];
    for (const deps of cases) {
      const res = await handleRequest(
        post(JSON.stringify({ text: SECRET })),
        { apiKey: "k", ip: "ip" },
        deps,
      );
      bodies.push(await res.text());
    }
    const tooLong = await handleRequest(
      post(JSON.stringify({ text: SECRET.repeat(30) })),
      { apiKey: "k", ip: "ip" },
      fakeDeps(),
    );
    bodies.push(await tooLong.text());
    for (const b of bodies) expect(b).not.toContain(SECRET);
  });
});
