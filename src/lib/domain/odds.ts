/**
 * Pure domain logic for Odds and Break-Even Probability calculations
 * Strictly adheres to CONTEXT.md and ADR 0003/0004
 */

export interface OddsValidationResult {
  isValid: boolean;
  errorMessage?: string;
}

export function validateAmericanOdds(odds: number): OddsValidationResult {
  if (isNaN(odds) || !isFinite(odds)) {
    return { isValid: false, errorMessage: "Odds must be a valid number" };
  }
  if (odds === 0) {
    return { isValid: false, errorMessage: "American odds cannot be 0" };
  }
  if (odds > -100 && odds < 100) {
    return {
      isValid: false,
      errorMessage: "American odds must be <= -100 or >= +100",
    };
  }
  if (odds < -100000 || odds > 100000) {
    return { isValid: false, errorMessage: "Odds are outside realistic bounds" };
  }
  return { isValid: true };
}

/**
 * Converts American odds into the Sportsbook Price's Break-Even Probability
 * Break-even probability = Probability required to have 0 expected profit
 * For negative odds (e.g. -110): |odds| / (|odds| + 100) -> 110 / 210 = 0.5238 (52.38%)
 * For positive odds (e.g. +150): 100 / (odds + 100) -> 100 / 250 = 0.4000 (40.00%)
 */
export function calculateBreakEvenProbability(americanOdds: number): number {
  if (americanOdds === 0) return 0.5;
  if (americanOdds < 0) {
    const absOdds = Math.abs(americanOdds);
    return absOdds / (absOdds + 100);
  } else {
    return 100 / (americanOdds + 100);
  }
}

export interface NoVigResult {
  sideBreakEvenProb: number;
  oppositeBreakEvenProb: number;
  sideNoVigProb: number;
  oppositeNoVigProb: number;
  vigPercent: number; // e.g. 4.76%
}

/**
 * Normalizes two-sided American odds to calculate the No-Vig Fair Market Probability
 * removing the sportsbook overround/margin.
 */
export function calculateNoVigProbability(
  sideOdds: number,
  oppositeOdds: number
): NoVigResult {
  const p1 = calculateBreakEvenProbability(sideOdds);
  const p2 = calculateBreakEvenProbability(oppositeOdds);
  const totalMarketSum = p1 + p2;
  const vigPercent = (totalMarketSum - 1) * 100;

  return {
    sideBreakEvenProb: p1,
    oppositeBreakEvenProb: p2,
    sideNoVigProb: p1 / totalMarketSum,
    oppositeNoVigProb: p2 / totalMarketSum,
    vigPercent: Math.max(0, vigPercent),
  };
}

/**
 * Hypothetical Return Scenario Illustration
 * Per CONTEXT.md: "The calculated return at the sportsbook price if the selected historical
 * hit rate were the future win probability. It is an illustration, not a forecast."
 *
 * Formula:
 * For $100 stake:
 * If odds < 0: Payout = 100 * (100 / |odds|)
 * If odds > 0: Payout = 100 * (odds / 100)
 * Expected Gross Return per non-push game = (hitRate * (100 + Payout)) + ((1 - hitRate) * 0)
 * Net Hypothetical Return per $100 = (hitRate * (100 + Payout)) - 100
 */
export function calculateHypotheticalReturn(
  americanOdds: number,
  hitRate: number,
  baseStake: number = 100
): number {
  let profitMultiplier: number;
  if (americanOdds < 0) {
    profitMultiplier = 100 / Math.abs(americanOdds);
  } else {
    profitMultiplier = americanOdds / 100;
  }

  const profitOnWin = baseStake * profitMultiplier;
  const totalPayoutOnWin = baseStake + profitOnWin;
  const netReturn = hitRate * totalPayoutOnWin - baseStake;

  return Math.round(netReturn * 100) / 100;
}

export function formatAmericanOdds(odds: number): string {
  if (odds > 0) return `+${odds}`;
  return `${odds}`;
}

export function formatPercentage(prob: number, decimals: number = 1): string {
  return `${(prob * 100).toFixed(decimals)}%`;
}
