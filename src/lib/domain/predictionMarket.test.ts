import { describe, expect, it } from "vitest";
import {
  calculatePredictionMarketBreakEvenProbability,
  calculatePredictionMarketHypotheticalReturn,
  validatePredictionMarketCommission,
  validatePredictionMarketPrice,
} from "./predictionMarket";

describe("prediction-market pricing", () => {
  it("validates the 56 cent quote and rejects impossible prices", () => {
    expect(validatePredictionMarketPrice(56).isValid).toBe(true);
    expect(validatePredictionMarketPrice(0).isValid).toBe(false);
    expect(validatePredictionMarketPrice(100).isValid).toBe(false);
  });

  it("validates a bounded commission assumption", () => {
    expect(validatePredictionMarketCommission(2).isValid).toBe(true);
    expect(validatePredictionMarketCommission(-0.1).isValid).toBe(false);
    expect(validatePredictionMarketCommission(26).isValid).toBe(false);
  });

  it("raises 56 cent break-even slightly when commission is 2%", () => {
    expect(calculatePredictionMarketBreakEvenProbability(56, 0)).toBeCloseTo(0.56, 6);
    expect(calculatePredictionMarketBreakEvenProbability(56, 2)).toBeCloseTo(0.56497, 5);
  });

  it("reduces the illustrative return when commission is applied", () => {
    const withoutFee = calculatePredictionMarketHypotheticalReturn(56, 0, 0.6);
    const withFee = calculatePredictionMarketHypotheticalReturn(56, 2, 0.6);
    expect(withFee).toBeLessThan(withoutFee);
  });
});
