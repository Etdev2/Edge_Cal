/**
 * Bankroll Management & Stake Sizing (illustrative).
 *
 * Pure domain math: given a win probability (historical hit rate or a
 * manual user estimate), a price (sportsbook American odds or prediction
 * market contract price + commission), and a bankroll, compute:
 *   - Expected Value (EV) per dollar staked,
 *   - Full Kelly fraction,
 *   - The stake after applying the user's fractional-Kelly choice and
 *     maximum-stake cap.
 *
 * Per CONTEXT.md / ADR 0003 the output is an *illustration of arithmetic*
 * on user-supplied inputs — never a wager recommendation. The UI must keep
 * the "illustrative, not a forecast" framing. Bankroll settings live in
 * the browser only (ADR 0005: minimize identity & financial data).
 *
 * Unified model:
 *   b  = net profit per $1 staked on a win
 *        - sportsbook:  b = |odds|/100  (odds >= +100)  or  100/|odds| (odds <= -100)
 *        - prediction market (contract price c, commission m):
 *          b = (1 - c)(1 - m) / c
 *   EV per $1 staked = p*b - (1 - p)
 *   Full Kelly f*    = (p*b - (1 - p)) / b
 *
 * EV per $100 in sportsbook mode is identical to `calculateHypotheticalReturn`
 * (see odds.ts) so the two surfaces never disagree.
 */

import {
  validateAmericanOdds,
  calculateBreakEvenProbability,
} from "./odds";
import {
  validatePredictionMarketPrice,
  validatePredictionMarketCommission,
} from "./predictionMarket";

export const DEFAULT_BANKROLL = 1000;
export const DEFAULT_KELLY_FRACTION = 0.25; // quarter Kelly — conservative default
export const DEFAULT_MAX_STAKE_PCT = 0.05; // never size above 5% of bankroll

export interface BankrollPricing {
  pricingMode: "sportsbook" | "prediction_market";
  americanOdds?: number;
  predictionMarketPriceCents?: number;
  predictionMarketCommissionPct?: number;
}

export interface StakeSizingInput {
  bankroll: number;
  winProbability: number; // 0..1 exclusive
  pricing: BankrollPricing;
  kellyFraction: number; // 0 < f <= 1
  maxStakePct: number; // 0 < cap <= 1
}

export type StakeSizingStatus = "positive_ev" | "no_edge" | "invalid";

export interface StakeSizingResult {
  status: StakeSizingStatus;
  reason: string;
  /** Net profit per $1 staked on a win (b). */
  profitMultiplier: number;
  /** EV per $1 staked at the given win probability (negative = -EV). */
  evPerDollar: number;
  /** EV per $100 staked — same unit as hypotheticalReturn100. */
  evPer100: number;
  /** Break-even win probability implied by the price (informational). */
  breakEvenProb: number;
  /** Raw Kelly optimal fraction (0..1). 0 when EV <= 0. */
  fullKellyFraction: number;
  /** fullKellyFraction * kellyFraction, clamped to [0, 1]. */
  adjustedFraction: number;
  /** min(adjustedFraction, maxStakePct). */
  cappedFraction: number;
  /** Whole-dollar stake (rounded). 0 when no_edge or below a $1 minimum. */
  stakeAmount: number;
  /** cappedFraction as a percentage of bankroll (e.g. 1.25). */
  stakePctOfBankroll: number;
}

function toInvalid(reason: string): StakeSizingResult {
  return {
    status: "invalid",
    reason,
    profitMultiplier: 0,
    evPerDollar: 0,
    evPer100: 0,
    breakEvenProb: 0,
    fullKellyFraction: 0,
    adjustedFraction: 0,
    cappedFraction: 0,
    stakeAmount: 0,
    stakePctOfBankroll: 0,
  };
}

/**
 * Converts the selected price into the unified (b, breakEvenProb) form.
 * Returns null (with reason) when the price is not usable.
 */
function priceToMultiplier(pricing: BankrollPricing): {
  ok: boolean;
  b?: number;
  breakEven?: number;
  reason?: string;
} {
  if (pricing.pricingMode === "prediction_market") {
    const priceCents = pricing.predictionMarketPriceCents ?? 56;
    const commissionPct = pricing.predictionMarketCommissionPct ?? 2;
    const priceValidation = validatePredictionMarketPrice(priceCents);
    const commissionValidation = validatePredictionMarketCommission(commissionPct);
    if (!priceValidation.isValid || !commissionValidation.isValid) {
      return {
        ok: false,
        reason:
          priceValidation.errorMessage || commissionValidation.errorMessage || "Invalid market price",
      };
    }
    const c = priceCents / 100;
    const m = commissionPct / 100;
    const b = ((1 - c) * (1 - m)) / c;
    if (b <= 0) return { ok: false, reason: "Market price leaves no profit on a win" };
    // Break-even solves p*b - (1-p) = 0  →  p = 1 / (1 + b)
    return { ok: true, b, breakEven: 1 / (1 + b) };
  }

  const odds = pricing.americanOdds ?? -110;
  const oddsValidation = validateAmericanOdds(odds);
  if (!oddsValidation.isValid) {
    return { ok: false, reason: oddsValidation.errorMessage || "Invalid odds" };
  }
  const b = odds > 0 ? odds / 100 : 100 / Math.abs(odds);
  return { ok: true, b, breakEven: calculateBreakEvenProbability(odds) };
}

/**
 * Core stake-sizing calculation.
 *
 * Kelly on settled (non-push) outcomes: pushes are already excluded from the
 * win probability input (historical hit rate is computed on settled games),
 * which is the standard simplification.
 */
export function calculateStakeSizing(input: StakeSizingInput): StakeSizingResult {
  const { bankroll, winProbability, pricing, kellyFraction, maxStakePct } = input;

  if (!Number.isFinite(bankroll) || bankroll <= 0) {
    return toInvalid("Bankroll must be a positive number.");
  }
  if (
    !Number.isFinite(winProbability) ||
    winProbability <= 0 ||
    winProbability >= 1
  ) {
    return toInvalid("Win probability must be between 0% and 100% (exclusive).");
  }
  if (!Number.isFinite(kellyFraction) || kellyFraction <= 0 || kellyFraction > 1) {
    return toInvalid("Kelly fraction must be between 0 (exclusive) and 100%.");
  }
  if (!Number.isFinite(maxStakePct) || maxStakePct <= 0 || maxStakePct > 1) {
    return toInvalid("Maximum stake cap must be between 0% (exclusive) and 100%.");
  }

  const price = priceToMultiplier(pricing);
  if (!price.ok || price.b == null || price.breakEven == null) {
    return toInvalid(price.reason || "Invalid price input.");
  }

  const b = price.b;
  const p = winProbability;

  const evPerDollar = p * b - (1 - p);
  // Float noise around exact break-even (e.g. p === 110/210 at -110) must not
  // read as a positive edge.
  const EV_EPSILON = 1e-9;
  const fullKellyFraction = Math.max(0, evPerDollar / b);

  if (evPerDollar <= EV_EPSILON || fullKellyFraction <= 0) {
    return {
      status: "no_edge",
      reason:
        evPerDollar < 0
          ? `At ${formatPct(p)} win probability the price is negative EV (${formatSignedPct(evPerDollar)} per $1). No illustrative stake.`
          : `At ${formatPct(p)} win probability the price breaks even exactly. No illustrative stake.`,
      profitMultiplier: b,
      evPerDollar,
      evPer100: Math.round(evPerDollar * 100 * 100) / 100,
      breakEvenProb: price.breakEven,
      fullKellyFraction: 0,
      adjustedFraction: 0,
      cappedFraction: 0,
      stakeAmount: 0,
      stakePctOfBankroll: 0,
    };
  }

  const adjustedFraction = Math.min(1, fullKellyFraction * kellyFraction);
  const cappedFraction = Math.min(adjustedFraction, maxStakePct);
  const rawStake = bankroll * cappedFraction;
  const stakeAmount = Math.round(rawStake);

  const hitCap = adjustedFraction > maxStakePct;
  const reason = hitCap
    ? `Illustrative stake capped at the ${formatPct(maxStakePct)} maximum-stake limit (fractional Kelly wanted ${formatPct(adjustedFraction)}).`
    : `Fractional Kelly (${formatPct(kellyFraction)} of full Kelly) on the selected win probability.`;

  return {
    status: "positive_ev",
    reason,
    profitMultiplier: b,
    evPerDollar,
    evPer100: Math.round(evPerDollar * 100 * 100) / 100,
    breakEvenProb: price.breakEven,
    fullKellyFraction,
    adjustedFraction,
    cappedFraction,
    stakeAmount,
    stakePctOfBankroll: cappedFraction * 100,
  };
}

export function formatPct(value: number, decimals = 1): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

export function formatSignedPct(value: number, decimals = 2): string {
  const v = value * 100;
  return `${v > 0 ? "+" : ""}${v.toFixed(decimals)}%`;
}
