import { describe, expect, it } from "vitest";
import {
  calculateBreakEvenProbability,
  calculateHypotheticalReturn,
  calculateNoVigProbability,
  validateAmericanOdds,
} from "./odds";

 describe("American odds", () => {
  it("calculates -110 break-even at 52.38%", () => {
    expect(calculateBreakEvenProbability(-110)).toBeCloseTo(0.5238095, 6);
  });

  it("calculates positive odds break-even", () => {
    expect(calculateBreakEvenProbability(150)).toBeCloseTo(0.4, 6);
  });

  it("rejects odds between -100 and +100", () => {
    expect(validateAmericanOdds(-50).isValid).toBe(false);
    expect(validateAmericanOdds(50).isValid).toBe(false);
    expect(validateAmericanOdds(-110).isValid).toBe(true);
  });

  it("removes a symmetric -110 vig", () => {
    const result = calculateNoVigProbability(-110, -110);
    expect(result.sideNoVigProb).toBeCloseTo(0.5, 6);
    expect(result.vigPercent).toBeCloseTo(4.7619, 3);
  });

  it("calculates a labeled hypothetical return", () => {
    expect(calculateHypotheticalReturn(-110, 0.6, 100)).toBeCloseTo(14.55, 2);
  });
});
