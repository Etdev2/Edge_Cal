/**
 * Pricing math for binary event-market contracts.
 *
 * A price of 56 cents means a contract costs $0.56 and pays $1.00 if the
 * selected outcome settles. Commission is modeled conservatively as a fee on
 * the winning contract's profit (not on the returned stake). This assumption
 * is intentionally explicit so the displayed break-even value is auditable.
 */

export const DEFAULT_PREDICTION_MARKET_PRICE_CENTS = 56;
export const DEFAULT_PREDICTION_MARKET_COMMISSION_PERCENT = 2;

export interface PredictionMarketValidationResult {
  isValid: boolean;
  errorMessage?: string;
}

export function validatePredictionMarketPrice(
  priceCents: number
): PredictionMarketValidationResult {
  if (!Number.isFinite(priceCents)) {
    return { isValid: false, errorMessage: "Market price must be a valid number" };
  }
  if (!Number.isInteger(priceCents) || priceCents < 1 || priceCents > 99) {
    return {
      isValid: false,
      errorMessage: "Market price must be a whole number from 1¢ to 99¢",
    };
  }
  return { isValid: true };
}

export function validatePredictionMarketCommission(
  commissionPercent: number
): PredictionMarketValidationResult {
  if (!Number.isFinite(commissionPercent)) {
    return { isValid: false, errorMessage: "Commission must be a valid number" };
  }
  if (commissionPercent < 0 || commissionPercent > 25) {
    return {
      isValid: false,
      errorMessage: "Commission must be between 0% and 25%",
    };
  }
  return { isValid: true };
}

/**
 * Calculates the probability required to break even after commission.
 *
 * price = p dollars paid for a contract
 * net profit on a win = (1 - p) * (1 - commission)
 * break-even = p / (p + net profit on a win)
 */
export function calculatePredictionMarketBreakEvenProbability(
  priceCents: number,
  commissionPercent: number = DEFAULT_PREDICTION_MARKET_COMMISSION_PERCENT
): number {
  const price = priceCents / 100;
  const commission = commissionPercent / 100;
  const netProfitOnWin = (1 - price) * (1 - commission);
  return price / (price + netProfitOnWin);
}

/**
 * Illustrative net return for a $100 cost basis if the historical hit rate
 * were the future settlement rate. This is not a forecast.
 */
export function calculatePredictionMarketHypotheticalReturn(
  priceCents: number,
  commissionPercent: number,
  hitRate: number,
  baseStake: number = 100
): number {
  const price = priceCents / 100;
  const commission = commissionPercent / 100;
  const contracts = baseStake / price;
  const netPayoutOnWin = 1 - (1 - price) * commission;
  const netReturn = hitRate * contracts * netPayoutOnWin - baseStake;
  return Math.round(netReturn * 100) / 100;
}

export function formatPredictionMarketPrice(priceCents: number): string {
  return `${priceCents}¢`;
}
