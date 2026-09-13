import { describe, expect, it } from "vitest";
import {
  calculateHistoricalHitRate,
  calculateWilsonScoreInterval,
} from "./statistics";

describe("Wilson Score Interval", () => {
  it("excludes pushes from the hit-rate denominator", () => {
    const result = calculateHistoricalHitRate([25, 24, 24, 20], 24, "over", 0.5238);
    expect(result.wins).toBe(1);
    expect(result.losses).toBe(1);
    expect(result.pushes).toBe(2);
    expect(result.eligibleGames).toBe(2);
    expect(result.hitRate).toBe(0.5);
  });

  it("returns a wide interval for a small sample n=2", () => {
    const interval = calculateWilsonScoreInterval(1, 2);
    expect(interval.lower).toBeGreaterThanOrEqual(0);
    expect(interval.upper).toBeLessThanOrEqual(1);
    expect(interval.upper - interval.lower).toBeGreaterThan(0.4);
  });

  it("returns [0,1] for n=0", () => {
    const interval = calculateWilsonScoreInterval(0, 0);
    expect(interval.lower).toBe(0);
    expect(interval.upper).toBe(1);
  });

  it("is narrower for larger samples", () => {
    const small = calculateWilsonScoreInterval(50, 100);
    const large = calculateWilsonScoreInterval(500, 1000);
    expect(large.upper - large.lower).toBeLessThan(small.upper - small.lower);
  });

  it("clamps to [0,1] even for extreme wins", () => {
    const allWins = calculateWilsonScoreInterval(10, 10);
    expect(allWins.lower).toBeGreaterThanOrEqual(0);
    expect(allWins.upper).toBeLessThanOrEqual(1);
    expect(allWins.upper).toBe(1);
  });

  it("supports 90% and 99% confidence levels", () => {
    const c90 = calculateWilsonScoreInterval(5, 10, 0.90);
    const c95 = calculateWilsonScoreInterval(5, 10, 0.95);
    const c99 = calculateWilsonScoreInterval(5, 10, 0.99);
    expect(c90.confidence).toBe(0.90);
    expect(c95.confidence).toBe(0.95);
    expect(c99.confidence).toBe(0.99);
    // higher confidence => wider interval
    expect(c99.upper - c99.lower).toBeGreaterThan(c95.upper - c95.lower);
    expect(c95.upper - c95.lower).toBeGreaterThan(c90.upper - c90.lower);
  });
});

describe("Historical hit rate settlement", () => {
  it("does not label fewer than three non-push games conclusive", () => {
    const result = calculateHistoricalHitRate([30, 31], 24.5, "over", 0.5238);
    expect(result.historicalStatus).toBe("inconclusive");
  });

  it("labels above when interval floor exceeds break-even", () => {
    // 9 wins out of 10, break-even 52% => interval lower should be > 0.52
    const result = calculateHistoricalHitRate(
      [30, 30, 30, 30, 30, 30, 30, 30, 30, 20],
      24.5,
      "over",
      0.5238
    );
    expect(result.wins).toBe(9);
    expect(result.historicalStatus).toBe("above");
  });

  it("labels below when interval ceiling below break-even", () => {
    // 1 win out of 10, break-even 52% => ceiling < 0.52
    const result = calculateHistoricalHitRate(
      [20, 20, 20, 20, 20, 20, 20, 20, 20, 30],
      24.5,
      "over",
      0.5238
    );
    expect(result.wins).toBe(1);
    expect(result.historicalStatus).toBe("below");
  });

  it("handles under side correctly", () => {
    const result = calculateHistoricalHitRate([20, 20, 30, 30], 24.5, "under", 0.5238);
    expect(result.wins).toBe(2);
    expect(result.losses).toBe(2);
  });

  it("handles integer line pushes", () => {
    const result = calculateHistoricalHitRate([24, 24, 25, 23], 24, "over", 0.5);
    expect(result.pushes).toBe(2);
    expect(result.eligibleGames).toBe(2);
    expect(result.wins).toBe(1);
    expect(result.losses).toBe(1);
  });

  it("returns raw hit rate including pushes", () => {
    const result = calculateHistoricalHitRate([30, 24, 20], 24, "over", 0.5);
    expect(result.totalGames).toBe(3);
    expect(result.pushes).toBe(1);
    expect(result.rawHitRateIncludingPushes).toBeCloseTo(1 / 3, 5);
  });
});
