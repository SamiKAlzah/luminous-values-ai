const Z = 1.96;

/** Wilson score interval (z = 1.96) for k successes out of n. */
export function wilson(k: number, n: number): { lo: number; hi: number } {
  if (n <= 0) return { lo: 0, hi: 1 };
  const p = k / n;
  const z2 = Z * Z;
  const denom = 1 + z2 / n;
  const centre = (p + z2 / (2 * n)) / denom;
  const half = (Z * Math.sqrt((p * (1 - p)) / n + z2 / (4 * n * n))) / denom;
  // Floating point can leave the bounds a hair inside [0, 1] at the extremes.
  return {
    lo: k <= 0 ? 0 : Math.max(0, centre - half),
    hi: k >= n ? 1 : Math.min(1, centre + half),
  };
}

/** Nearest-rank percentile (p in 0..100); 0 for an empty list. */
export function percentile(values: number[], p: number): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const rank = Math.min(sorted.length, Math.max(1, Math.ceil((p / 100) * sorted.length)));
  return sorted[rank - 1];
}
