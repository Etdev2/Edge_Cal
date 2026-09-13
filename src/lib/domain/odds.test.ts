import { describe, expect, it } from "vitest";
import {
  calculateBreakEvenProbability,
  calculateHypotheticalReturn,
  calculateNoVigProbability,
  formatAmericanOdds,
  formatPercentage,
  validateAmericanOdds,
} from "./odds";

describe("American odds validation", () => {
  it("accepts standard negative odds", () => {
    expect(validateAmericanOdds(-110).isValid).toBe(true);
    expect(validateAmericanOdds(-200).isValid).toBe(true);
    expect(validateAmericanOdds(-1000).isValid).toBe(true);
  });

  it("accepts standard positive odds", () => {
    expect(validateAmericanOdds(100).isValid).toBe(true);
    expect(validateAmericanOdds(150).isValid).toBe(true);
    expect(validateAmericanOdds(500).isValid).toBe(true);
  });

  it("rejects odds between -100 and +100", () => {
    expect(validateAmericanOdds(-50).isValid).toBe(false);
    expect(validateAmericanOdds(0).isValid).toBe(false);
    expect(validateAmericanOdds(50).isValid).toBe(false);
    expect(validateAmericanOdds(99).isValid).toBe(false);
  });

  it("rejects non-finite values", () => {
    expect(validateAmericanOdds(NaN).isValid).toBe(false);
    expect(validateAmericanOdds(Infinity).isValid).toBe(false);
  });

  it("rejects unrealistic extremes", () => {
    expect(validateAmericanOdds(-200000).isValid).toBe(false);
    expect(validateAmericanOdds(200000).isValid).toBe(false);
  });
});

describe("Break-even probability", () => {
  it("calculates -110 break-even at 52.38%", () => {
    expect(calculateBreakEvenProbability(-110)).toBeCloseTo(0.5238095, 6);
  });

  it("calculates -200 break-even at 66.67%", () => {
    expect(calculateBreakEvenProbability(-200)).toBeCloseTo(0.6666667, 5);
  });

  it("calculates +150 break-even at 40%", () => {
    expect(calculateBreakEvenProbability(150)).toBeCloseTo(0.4, 6);
  });

  it("calculates +100 break-even at 50%", () => {
    expect(calculateBreakEvenProbability(100)).toBeCloseTo(0.5, 6);
  });

  it("calculates +200 break-even at 33.33%", () => {
    expect(calculateBreakEvenProbability(200)).toBeCloseTo(0.333333, 5);
  });
});

describe("No-vig probability", () => {
  it("removes symmetric -110 vig to 50/50", () => {
    const result = calculateNoVigProbability(-110, -110);
    expect(result.sideNoVigProb).toBeCloseTo(0.5, 6);
    expect(result.oppositeNoVigProb).toBeCloseTo(0.5, 6);
    expect(result.vigPercent).toBeCloseTo(4.7619, 3);
  });

  it("handles asymmetric odds correctly", () => {
    const result = calculateNoVigProbability(-150, 130);
    expect(result.sideBreakEvenProb).toBeCloseTo(0.6, 5);
    expect(result.oppositeBreakEvenProb).toBeCloseTo(0.43478, 4);
    expect(result.sideNoVigProb + result.oppositeNoVigProb).toBeCloseTo(1, 6);
  });

  it("calculates vig as overround minus 1", () => {
    const result = calculateNoVigProbability(-110, -110);
    const expectedVig = (0.5238095 + 0.5238095 - 1) * 100;
    expect(result.vigPercent).toBeCloseTo(expectedVig, 2);
  });
});

describe("Hypothetical return", () => {
  it("calculates positive return when hit rate exceeds break-even", () => {
    // -110 needs 52.38%, at 60% should be positive
    expect(calculateHypotheticalReturn(-110, 0.6, 100)).toBeCloseTo(14.55, 1);
  });

  it("calculates negative return when hit rate below break-even", () => {
    expect(calculateHypotheticalReturn(-110, 0.4, 100)).toBeLessThan(0);
  });

  it("handles positive odds profit multiplier", () => {
    // +150: $100 wins $150, at 50% hit rate: 0.5*250 - 100 = 25
    expect(calculateHypotheticalReturn(150, 0.5, 100)).toBeCloseTo(25, 1);
  });

  it("scales with base stake", () => {
    const r100 = calculateHypotheticalReturn(-110, 0.6, 100);
    const r200 = calculateHypotheticalReturn(-110, 0.6, 200);
    expect(r200).toBeCloseTo(r100 * 2, 1);
  });
});

describe("Formatting helpers", () => {
  it("formats American odds with + sign", () => {
    expect(formatAmericanOdds(150)).toBe("+150");
    expect(formatAmericanOdds(-110)).toBe("-110");
  });

  it("formats percentage", () => {
    expect(formatPercentage(0.5238, 1)).toBe("52.4%");
    expect(formatPercentage(0.5, 0)).toBe("50%");
  });
});
