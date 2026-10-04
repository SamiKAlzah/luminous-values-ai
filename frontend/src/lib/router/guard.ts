const MINUTE_MS = 60_000;
const DAY_MS = 86_400_000;
const SWEEP_THRESHOLD = 5_000;

export interface GuardOptions {
  perIpPerMinute?: number;
  dailyCap?: number;
  now?: () => number;
}

// In-memory and best-effort: state lives per function instance and resets on a cold start.
export function createGuard(
  opts: GuardOptions = {},
): (clientKey: string) => Promise<"ok" | "limited"> {
  const perMinute = opts.perIpPerMinute ?? 10;
  const dailyCap = opts.dailyCap ?? 1000;
  const now = opts.now ?? Date.now;

  const hits = new Map<string, number[]>();
  let day = -1;
  let dayCount = 0;

  return async (clientKey) => {
    const t = now();

    const today = Math.floor(t / DAY_MS);
    if (today !== day) {
      day = today;
      dayCount = 0;
    }

    if (hits.size > SWEEP_THRESHOLD) {
      for (const [key, stamps] of hits) {
        if (stamps[stamps.length - 1] <= t - MINUTE_MS) hits.delete(key);
      }
    }

    const recent = (hits.get(clientKey) ?? []).filter((s) => s > t - MINUTE_MS);
    if (recent.length >= perMinute || dayCount >= dailyCap) {
      if (recent.length > 0) hits.set(clientKey, recent);
      else hits.delete(clientKey);
      return "limited";
    }

    recent.push(t);
    hits.set(clientKey, recent);
    dayCount += 1;
    return "ok";
  };
}
