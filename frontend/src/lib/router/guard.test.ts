import { describe, expect, it } from "vitest";
import { createGuard } from "./guard";

function clock(start = Date.UTC(2026, 0, 1, 12, 0, 0)) {
  let t = start;
  return {
    now: () => t,
    advance: (ms: number) => {
      t += ms;
    },
  };
}

describe("createGuard", () => {
  it("allows 10 calls per key per minute, then limits", async () => {
    const c = clock();
    const guard = createGuard({ now: c.now });
    for (let i = 0; i < 10; i++) {
      expect(await guard("a")).toBe("ok");
    }
    expect(await guard("a")).toBe("limited");
    expect(await guard("a")).toBe("limited");
  });

  it("does not affect other keys", async () => {
    const c = clock();
    const guard = createGuard({ now: c.now });
    for (let i = 0; i < 11; i++) await guard("a");
    expect(await guard("b")).toBe("ok");
  });

  it("allows the key again after the window passes", async () => {
    const c = clock();
    const guard = createGuard({ now: c.now });
    for (let i = 0; i < 10; i++) await guard("a");
    expect(await guard("a")).toBe("limited");
    c.advance(60_001);
    expect(await guard("a")).toBe("ok");
  });

  it("honours a custom per-minute limit", async () => {
    const c = clock();
    const guard = createGuard({ perIpPerMinute: 2, now: c.now });
    expect(await guard("a")).toBe("ok");
    expect(await guard("a")).toBe("ok");
    expect(await guard("a")).toBe("limited");
  });

  it("enforces the daily cap across keys and resets at the next UTC day", async () => {
    const c = clock(Date.UTC(2026, 0, 1, 23, 59, 0));
    const guard = createGuard({ dailyCap: 3, now: c.now });
    expect(await guard("a")).toBe("ok");
    expect(await guard("b")).toBe("ok");
    expect(await guard("c")).toBe("ok");
    expect(await guard("d")).toBe("limited");
    c.advance(61_000); // now 00:00:01 UTC the next day
    expect(await guard("d")).toBe("ok");
  });

  it("does not spend the daily cap on per-key rejections", async () => {
    const c = clock();
    const guard = createGuard({ perIpPerMinute: 1, dailyCap: 2, now: c.now });
    expect(await guard("a")).toBe("ok");
    expect(await guard("a")).toBe("limited");
    expect(await guard("a")).toBe("limited");
    expect(await guard("b")).toBe("ok");
    expect(await guard("c")).toBe("limited");
  });
});
