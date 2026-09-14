"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Wallet, Info, AlertTriangle, Percent } from "lucide-react";
import {
  calculateStakeSizing,
  formatPct,
  formatSignedPct,
  type StakeSizingResult,
} from "@/lib/domain/bankroll";
import { useBankrollSettings } from "@/lib/client/bankrollStore";

interface StakeSizingCardProps {
  pricingMode: "sportsbook" | "prediction_market";
  americanOdds: number;
  predictionMarketPriceCents?: number | null;
  predictionMarketCommissionPct?: number | null;
  breakEvenProb: number;
  hitRate: number;
  hitRatePercent: string;
}

/**
 * Illustrative bankroll / stake-sizing panel.
 *
 * Inputs: the analysis price + a win probability (defaults to the historical
 * hit rate, optionally overridden by the user's own estimate) + browser-local
 * bankroll settings. Output: EV and a Kelly-based stake with a hard cap.
 *
 * Framing per CONTEXT.md/ADR 0003: arithmetic illustration on user inputs —
 * never a wager recommendation.
 */
export function StakeSizingCard({
  pricingMode,
  americanOdds,
  predictionMarketPriceCents,
  predictionMarketCommissionPct,
  breakEvenProb,
  hitRate,
  hitRatePercent,
}: StakeSizingCardProps) {
  const { settings, isHydrated } = useBankrollSettings();

  // Manual win-probability override (optional). Percent input, null = use hit rate.
  const [overridePct, setOverridePct] = useState<string>("");
  const [overrideActive, setOverrideActive] = useState(false);

  // A new analysis (different price/win-probability) starts from the hit rate.
  // React's "adjust state during render" pattern — no effect, no cascading
  // renders: when the analysis signature changes, reset the override on the
  // same render pass.
  const analysisSignature = [
    pricingMode,
    americanOdds,
    predictionMarketPriceCents ?? "",
    predictionMarketCommissionPct ?? "",
    breakEvenProb,
    hitRate,
  ].join("|");
  const [prevSignature, setPrevSignature] = useState(analysisSignature);
  if (prevSignature !== analysisSignature) {
    setPrevSignature(analysisSignature);
    setOverridePct("");
    setOverrideActive(false);
  }

  const overrideValue = overrideActive ? parseFloat(overridePct) : NaN;
  const winProbability = Number.isFinite(overrideValue)
    ? Math.min(0.999, Math.max(0.001, overrideValue / 100))
    : hitRate;
  const usingOverride = Number.isFinite(overrideValue) && overrideActive;

  const result: StakeSizingResult = useMemo(
    () =>
      calculateStakeSizing({
        bankroll: settings.bankroll,
        winProbability,
        pricing: {
          pricingMode,
          americanOdds,
          predictionMarketPriceCents:
            pricingMode === "prediction_market" ? predictionMarketPriceCents ?? 56 : undefined,
          predictionMarketCommissionPct:
            pricingMode === "prediction_market" ? predictionMarketCommissionPct ?? 2 : undefined,
        },
        kellyFraction: settings.kellyFraction,
        maxStakePct: settings.maxStakePct,
      }),
    [settings, winProbability, pricingMode, americanOdds, predictionMarketPriceCents, predictionMarketCommissionPct]
  );

  const posEv = result.evPer100 > 0;
  const hasStake = result.status === "positive_ev" && result.stakeAmount > 0;

  return (
    <div className="p-4 bg-slate-950/70 border border-indigo-500/25 rounded-xl space-y-3">
      <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
        <span className="flex items-center space-x-1.5">
          <Wallet className="w-3.5 h-3.5 text-indigo-400" />
          <span>Stake Sizing · Illustrative</span>
        </span>
        <Link
          href="/bankroll"
          className="text-indigo-400 hover:text-indigo-300 text-[11px] font-bold underline underline-offset-2"
        >
          Manage bankroll →
        </Link>
      </div>

      {!isHydrated ? (
        <p className="text-[11px] text-slate-500">Loading bankroll settings…</p>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-0.5">
              <span className="text-[10px] font-semibold text-slate-400">
                Expected Value (per $100)
              </span>
              <div
                className={`text-2xl font-black font-mono ${
                  result.status === "invalid"
                    ? "text-slate-500"
                    : posEv
                      ? "text-emerald-400"
                      : "text-rose-400"
                }`}
              >
                {result.status === "invalid"
                  ? "—"
                  : `${posEv ? "+" : "-"}$${Math.abs(result.evPer100).toFixed(2)}`}
              </div>
              <p className="text-[10px] text-slate-500">
                {formatSignedPct(result.evPerDollar)} per $1 at {formatPct(winProbability)} win prob
              </p>
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] font-semibold text-slate-400">Illustrative Stake</span>
              <div
                className={`text-2xl font-black font-mono ${
                  hasStake ? "text-white" : "text-slate-500"
                }`}
              >
                {hasStake ? `$${result.stakeAmount}` : result.status === "invalid" ? "—" : "$0"}
              </div>
              <p className="text-[10px] text-slate-500">
                {hasStake
                  ? `${result.stakePctOfBankroll.toFixed(2)}% of ${settings.bankroll.toLocaleString()} bankroll`
                  : "No illustrative stake at this price"}
              </p>
            </div>
          </div>

          {/* Detail row */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] font-mono text-slate-400">
            <span className="inline-flex items-center space-x-1">
              <Percent className="w-3 h-3 text-slate-500" />
              <span>
                Full Kelly {formatPct(result.fullKellyFraction)} →{" "}
                {formatPct(settings.kellyFraction)} applied{" "}
                {settings.kellyFraction < 1 ? `(quarter/half mix: ${formatPct(settings.kellyFraction)})` : ""}
              </span>
            </span>
            <span>·</span>
            <span>Cap {formatPct(settings.maxStakePct, 0)} of bankroll</span>
            <span>·</span>
            <span>Break-even {formatPct(result.breakEvenProb)}</span>
          </div>

          {/* Win probability override */}
          <div className="flex flex-wrap items-center gap-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={overrideActive}
                onChange={(e) => setOverrideActive(e.target.checked)}
                className="w-3.5 h-3.5 rounded accent-indigo-500"
              />
              <span className="text-[11px] text-slate-300">Use my own win probability</span>
            </label>
            {overrideActive && (
              <label className="flex items-center space-x-1.5">
                <input
                  type="number"
                  min="1"
                  max="99"
                  step="0.5"
                  value={overridePct}
                  onChange={(e) => setOverridePct(e.target.value)}
                  placeholder={`${(hitRate * 100).toFixed(0)}`}
                  aria-label="Custom win probability percent"
                  className="w-16 text-center font-mono font-bold text-white bg-slate-950 border border-indigo-500/40 rounded-lg py-1 text-xs focus:outline-none focus:border-indigo-400"
                />
                <span className="text-[11px] text-slate-400">% (hit rate is {hitRatePercent})</span>
              </label>
            )}
          </div>

          {result.status === "invalid" && (
            <p className="text-[10px] text-rose-400 flex items-center space-x-1">
              <AlertTriangle className="w-3 h-3 flex-shrink-0" />
              <span>{result.reason}</span>
            </p>
          )}
          {result.status === "no_edge" && (
            <p className="text-[10px] text-amber-400 flex items-center space-x-1">
              <AlertTriangle className="w-3 h-3 flex-shrink-0" />
              <span>{result.reason}</span>
            </p>
          )}
          {result.status === "positive_ev" && result.stakeAmount === 0 && (
            <p className="text-[10px] text-amber-400">
              Calculated stake is under $1 at this bankroll.
            </p>
          )}

          <p className="text-[10px] text-slate-500 leading-relaxed flex items-start space-x-1">
            <Info className="w-3 h-3 mt-0.5 flex-shrink-0 text-slate-500" />
            <span>
              {usingOverride
                ? "Based on your own win-probability estimate"
                : `Based on the historical hit rate (${hitRatePercent})`}{" "}
              treated as the future win rate — an arithmetic illustration, not a forecast or a
              recommendation. Bankroll settings stay in this browser and are never sent to the
              server.
            </span>
          </p>
        </>
      )}
    </div>
  );
}
