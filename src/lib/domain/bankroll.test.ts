import { describe, expect, it } from "vitest";
import {
  calculateStakeSizing,
  DEFAULT_BANKROLL,
  DEFAULT_KELLY_FRACTION,
  DEFAULT_MAX_STAKE_PCT,
} from "./bankroll";
import { calculateHypotheticalReturn } from "./odds";

const base = {
  bankroll: 1000,
  kellyFraction: DEFAULT_KELLY_FRACTION,
  maxStakePct: DEFAULT_MAX_STAKE_PCT,
};

describe("calculateStakeSizing — sportsbook pricing", () => {
  it("computes EV and Kelly for a classic -110 / 55% scenario", () => {
    const r = calculateStakeSizing({
      ...base,
      winProbability: 0.55,
      pricing: { pricingMode: "sportsbook", americanOdds: -110 },
    });

    // b = 100/110 = 0.90909...
    expect(r.status).toBe("positive_ev");
    expect(r.profitMultiplier).toBeCloseTo(100 / 110, 10);
    // EV = 0.55 * (100/110) - 0.45 = exactly 0.05 per dollar
    expect(r.evPerDollar).toBeCloseTo(0.05, 10);
    expect(r.evPer100).toBeCloseTo(5.0, 8);
    // Full Kelly = 0.05 / (100/110) = 0.055
    expect(r.fullKellyFraction).toBeCloseTo(0.055, 10);
    // Quarter Kelly = 1.375% of bankroll
    expect(r.adjustedFraction).toBeCloseTo(0.055 * 0.25, 10);
    expect(r.cappedFraction).toBeCloseTo(0.055 * 0.25, 10);
    expect(r.stakeAmount).toBe(Math.round(1000 * 0.055 * 0.25)); // $14
    // Break-even at -110 = 110/210
    expect(r.breakEvenProb).toBeCloseTo(110 / 210, 10);
  });

  it("EV per $100 matches calculateHypotheticalReturn (no disagreement between surfaces)", () => {
    const p = 0.55;
    const odds = -110;
    const r = calculateStakeSizing({
      ...base,
      winProbability: p,
      pricing: { pricingMode: "sportsbook", americanOdds: odds },
    });
    expect(r.evPer100).toBeCloseTo(calculateHypotheticalReturn(odds, p, 100), 8);
  });

  it("handles positive (underdog) American odds", () => {
    const r = calculateStakeSizing({
      ...base,
      winProbability: 0.45,
      pricing: { pricingMode: "sportsbook", americanOdds: +150 },
    });
    // b = 1.5; EV = 0.45*1.5 - 0.55 = 0.125
    expect(r.status).toBe("positive_ev");
    expect(r.evPerDollar).toBeCloseTo(0.125, 10);
    expect(r.fullKellyFraction).toBeCloseTo(0.125 / 1.5, 10);
  });

  it("applies the max-stake cap when Kelly exceeds it", () => {
    const r = calculateStakeSizing({
      bankroll: 1000,
      winProbability: 0.55,
      pricing: { pricingMode: "sportsbook", americanOdds: -110 },
      kellyFraction: 1, // full Kelly = 5.5%
      maxStakePct: 0.025, // cap 2.5%
    });
    expect(r.adjustedFraction).toBeCloseTo(0.055, 10);
    expect(r.cappedFraction).toBeCloseTo(0.025, 10);
    expect(r.stakeAmount).toBe(25);
    expect(r.stakePctOfBankroll).toBeCloseTo(2.5, 10);
  });

  it("returns no_edge (zero stake) when EV is negative", () => {
    const r = calculateStakeSizing({
      ...base,
      winProbability: 0.5,
      pricing: { pricingMode: "sportsbook", americanOdds: -110 },
    });
    expect(r.status).toBe("no_edge");
    expect(r.evPerDollar).toBeLessThan(0);
    expect(r.fullKellyFraction).toBe(0);
    expect(r.stakeAmount).toBe(0);
  });

  it("returns no_edge at exact break-even (within float tolerance)", () => {
    const r = calculateStakeSizing({
      ...base,
      winProbability: 110 / 210, // exact break-even at -110
      pricing: { pricingMode: "sportsbook", americanOdds: -110 },
    });
    expect(r.status).toBe("no_edge");
    expect(r.stakeAmount).toBe(0);
  });

  it("rounds stakes to whole dollars", () => {
    const r = calculateStakeSizing({
      bankroll: 777,
      winProbability: 0.55,
      pricing: { pricingMode: "sportsbook", americanOdds: -110 },
      kellyFraction: 1,
      maxStakePct: 1,
    });
    expect(Number.isInteger(r.stakeAmount)).toBe(true);
  });
});

describe("calculateStakeSizing — prediction-market pricing", () => {
  it("computes EV and Kelly for 55c + 2% commission at 60% win probability", () => {
    const r = calculateStakeSizing({
      ...base,
      winProbability: 0.6,
      pricing: {
        pricingMode: "prediction_market",
        predictionMarketPriceCents: 55,
        predictionMarketCommissionPct: 2,
      },
    });

    // b = (1-0.55)(1-0.02)/0.55 = 0.441/0.55 = 0.801818...
    expect(r.status).toBe("positive_ev");
    expect(r.profitMultiplier).toBeCloseTo(0.441 / 0.55, 10);
    // EV = 0.6*b - 0.4
    const b = 0.441 / 0.55;
    expect(r.evPerDollar).toBeCloseTo(0.6 * b - 0.4, 10);
    expect(r.fullKellyFraction).toBeCloseTo((0.6 * b - 0.4) / b, 10);
    // Break-even must equal the odds.ts-style PM break-even: c / (c + (1-c)(1-m))
    expect(r.breakEvenProb).toBeCloseTo(0.55 / (0.55 + 0.45 * 0.98), 10);
  });

  it("returns no_edge when the contract price has no edge", () => {
    const r = calculateStakeSizing({
      ...base,
      winProbability: 0.5,
      pricing: {
        pricingMode: "prediction_market",
        predictionMarketPriceCents: 55,
        predictionMarketCommissionPct: 2,
      },
    });
    expect(r.status).toBe("no_edge");
    expect(r.stakeAmount).toBe(0);
  });
});

describe("calculateStakeSizing — validation", () => {
  const pricing = { pricingMode: "sportsbook" as const, americanOdds: -110 };

  it("rejects non-positive or non-finite bankrolls", () => {
    for (const bankroll of [0, -100, NaN, Infinity]) {
      const r = calculateStakeSizing({ ...base, bankroll, winProbability: 0.55, pricing });
      expect(r.status).toBe("invalid");
    }
  });

  it("rejects win probabilities outside (0,1)", () => {
    for (const p of [0, 1, -0.1, 1.1, NaN]) {
      const r = calculateStakeSizing({ ...base, winProbability: p, pricing });
      expect(r.status).toBe("invalid");
    }
  });

  it("rejects out-of-range Kelly fractions and caps", () => {
    expect(
      calculateStakeSizing({ ...base, winProbability: 0.55, pricing, kellyFraction: 0 }).status
    ).toBe("invalid");
    expect(
      calculateStakeSizing({ ...base, winProbability: 0.55, pricing, kellyFraction: 1.5 }).status
    ).toBe("invalid");
    expect(
      calculateStakeSizing({ ...base, winProbability: 0.55, pricing, maxStakePct: 0 }).status
    ).toBe("invalid");
    expect(
      calculateStakeSizing({ ...base, winProbability: 0.55, pricing, maxStakePct: 1.5 }).status
    ).toBe("invalid");
  });

  it("rejects invalid American odds", () => {
    const r = calculateStakeSizing({
      ...base,
      winProbability: 0.55,
      pricing: { pricingMode: "sportsbook", americanOdds: -50 }, // -50 is not a valid American price
    });
    expect(r.status).toBe("invalid");
  });

  it("rejects out-of-range prediction-market prices", () => {
    const r = calculateStakeSizing({
      ...base,
      winProbability: 0.55,
      pricing: {
        pricingMode: "prediction_market",
        predictionMarketPriceCents: 120,
        predictionMarketCommissionPct: 2,
      },
    });
    expect(r.status).toBe("invalid");
  });
});

describe("defaults", () => {
  it("ships conservative defaults (quarter Kelly, 5% cap, $1000 bankroll)", () => {
    expect(DEFAULT_KELLY_FRACTION).toBe(0.25);
    expect(DEFAULT_MAX_STAKE_PCT).toBe(0.05);
    expect(DEFAULT_BANKROLL).toBe(1000);
  });
});
