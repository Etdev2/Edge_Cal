import { describe, expect, it } from "vitest";
import {
  calculateHistoricalHitRate,
  calculateWilsonScoreInterval,
} from "./statistics";

describe("historical evidence statistics", () => {
  it("excludes pushes from the hit-rate denominator", () => {
    const result = calculateHistoricalHitRate([25, 24, 24, 20], 24, "over", 0.5238);
    expect(result.wins).toBe(1);
    expect(result.losses).toBe(1);
    expect(result.pushes).toBe(2);
    expect(result.eligibleGames).toBe(2);
    expect(result.hitRate).toBe(0.5);
  });

  it("returns a wide interval for a small sample", () => {
    const interval = calculateWilsonScoreInterval(1, 2);
    expect(interval.lower).toBeGreaterThanOrEqual(0);
    expect(interval.upper).toBeLessThanOrEqual(1);
    expect(interval.upper - interval.lower).toBeGreaterThan(0.4);
  });

  it("does not label fewer than three non-push games conclusive", () => {
    const result = calculateHistoricalHitRate([30, 31], 24.5, "over", 0.5238);
    expect(result.historicalStatus).toBe("inconclusive");
  });
});
