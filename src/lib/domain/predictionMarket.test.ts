import { describe, expect, it } from "vitest";
import {
  calculatePredictionMarketBreakEvenProbability,
  calculatePredictionMarketHypotheticalReturn,
  validatePredictionMarketCommission,
  validatePredictionMarketPrice,
} from "./predictionMarket";

describe("prediction-market price validation", () => {
  it("validates the 56 cent quote and rejects impossible prices", () => {
    expect(validatePredictionMarketPrice(56).isValid).toBe(true);
    expect(validatePredictionMarketPrice(1).isValid).toBe(true);
    expect(validatePredictionMarketPrice(99).isValid).toBe(true);
    expect(validatePredictionMarketPrice(0).isValid).toBe(false);
    expect(validatePredictionMarketPrice(100).isValid).toBe(false);
  });

  it("rejects non-integer cents", () => {
    expect(validatePredictionMarketPrice(56.5).isValid).toBe(false);
    expect(validatePredictionMarketPrice(NaN).isValid).toBe(false);
  });

  it("validates a bounded commission assumption", () => {
    expect(validatePredictionMarketCommission(2).isValid).toBe(true);
    expect(validatePredictionMarketCommission(0).isValid).toBe(true);
    expect(validatePredictionMarketCommission(25).isValid).toBe(true);
    expect(validatePredictionMarketCommission(-0.1).isValid).toBe(false);
    expect(validatePredictionMarketCommission(26).isValid).toBe(false);
    expect(validatePredictionMarketCommission(NaN).isValid).toBe(false);
  });
});

describe("prediction-market break-even", () => {
  it("is exactly price when commission is 0%", () => {
    expect(calculatePredictionMarketBreakEvenProbability(56, 0)).toBeCloseTo(0.56, 6);
    expect(calculatePredictionMarketBreakEvenProbability(50, 0)).toBeCloseTo(0.5, 6);
  });

  it("raises 56 cent break-even to ~56.5% when commission is 2%", () => {
    // 56¢ + 2% should be 56.5% effective break-even per Phase 1 checklist
    const be = calculatePredictionMarketBreakEvenProbability(56, 2);
    expect(be).toBeCloseTo(0.56497, 4);
    // rounded to 1 decimal percent = 56.5%
    expect(`${(be * 100).toFixed(1)}%`).toBe("56.5%");
  });

  it("increases break-even as commission increases", () => {
    const c0 = calculatePredictionMarketBreakEvenProbability(56, 0);
    const c2 = calculatePredictionMarketBreakEvenProbability(56, 2);
    const c5 = calculatePredictionMarketBreakEvenProbability(56, 5);
    expect(c2).toBeGreaterThan(c0);
    expect(c5).toBeGreaterThan(c2);
  });

  it("handles edge prices", () => {
    expect(calculatePredictionMarketBreakEvenProbability(1, 0)).toBeCloseTo(0.01, 6);
    expect(calculatePredictionMarketBreakEvenProbability(99, 0)).toBeCloseTo(0.99, 6);
  });
});

describe("prediction-market hypothetical return", () => {
  it("reduces the illustrative return when commission is applied", () => {
    const withoutFee = calculatePredictionMarketHypotheticalReturn(56, 0, 0.6);
    const withFee = calculatePredictionMarketHypotheticalReturn(56, 2, 0.6);
    expect(withFee).toBeLessThan(withoutFee);
  });

  it("is positive when hit rate exceeds break-even", () => {
    // 56¢ break-even ~56%, at 70% hit rate should be positive
    const ret = calculatePredictionMarketHypotheticalReturn(56, 2, 0.7, 100);
    expect(ret).toBeGreaterThan(0);
  });

  it("is negative when hit rate below break-even", () => {
    const ret = calculatePredictionMarketHypotheticalReturn(56, 2, 0.4, 100);
    expect(ret).toBeLessThan(0);
  });

  it("scales with base stake", () => {
    const r100 = calculatePredictionMarketHypotheticalReturn(56, 2, 0.6, 100);
    const r200 = calculatePredictionMarketHypotheticalReturn(56, 2, 0.6, 200);
    expect(r200).toBeCloseTo(r100 * 2, 1);
  });

  it("matches formula: contracts * netPayoutOnWin * hitRate - stake", () => {
    // manual check: 56¢, 2%, 60% hit, $100 stake
    // contracts = 100/0.56 = 178.57
    // netPayout = 1 - (1-0.56)*0.02 = 1 - 0.0088 = 0.9912
    // return = 0.6 * 178.57 * 0.9912 - 100 ≈ 6.21
    const ret = calculatePredictionMarketHypotheticalReturn(56, 2, 0.6, 100);
    expect(ret).toBeCloseTo(6.21, 0);
  });
});
