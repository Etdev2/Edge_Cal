"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Wallet,
  Percent,
  ShieldCheck,
  RotateCcw,
  Info,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";
import {
  calculateStakeSizing,
  formatPct,
  formatSignedPct,
} from "@/lib/domain/bankroll";
import { useBankrollSettings, DEFAULT_BANKROLL_SETTINGS } from "@/lib/client/bankrollStore";

const KELLY_PRESETS = [
  { id: 0.25, label: "Quarter Kelly", hint: "25% of full Kelly — conservative default" },
  { id: 0.5, label: "Half Kelly", hint: "50% of full Kelly" },
  { id: 1, label: "Full Kelly", hint: "100% — mathematically aggressive" },
] as const;

export default function BankrollPage() {
  const { settings, isHydrated, update, reset } = useBankrollSettings();
  const [bankrollInput, setBankrollInput] = useState("");
  const [capInput, setCapInput] = useState("");

  // Example: -110 price with a 55% win probability (typical +3.6pt gap scenario)
  const example = useMemo(
    () =>
      calculateStakeSizing({
        bankroll: settings.bankroll,
        winProbability: 0.55,
        pricing: { pricingMode: "sportsbook", americanOdds: -110 },
        kellyFraction: settings.kellyFraction,
        maxStakePct: settings.maxStakePct,
      }),
    [settings]
  );

  const isDefault =
    settings.bankroll === DEFAULT_BANKROLL_SETTINGS.bankroll &&
    settings.kellyFraction === DEFAULT_BANKROLL_SETTINGS.kellyFraction &&
    settings.maxStakePct === DEFAULT_BANKROLL_SETTINGS.maxStakePct;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link
        href="/"
        className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-400 hover:text-sky-400 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Calculator</span>
      </Link>

      {/* Header */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-3">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-2xl border border-indigo-500/20">
            <Wallet className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white">Bankroll &amp; Stake Sizing</h1>
            <p className="text-xs text-slate-400 pt-0.5">
              Set your bankroll once — every analysis then shows EV and an illustrative Kelly-based stake.
            </p>
          </div>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed max-w-2xl">
          The calculator converts each analysis price into an <strong className="text-slate-200">expected value</strong>,
          applies the Kelly criterion at your chosen fraction, and caps the result at your maximum
          single-stake limit. All of this is <strong className="text-slate-200">arithmetic on your own inputs</strong> —
          an illustration, never a forecast or a recommendation.
        </p>
      </div>

      {!isHydrated ? (
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl text-xs text-slate-400">
          Loading settings…
        </div>
      ) : (
        <>
          {/* Settings grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Bankroll */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
              <span className="text-xs font-bold text-slate-300 flex items-center space-x-1.5">
                <Wallet className="w-3.5 h-3.5 text-indigo-400" />
                <span>Total Bankroll</span>
              </span>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold text-slate-500">$</span>
                <input
                  type="number"
                  min="1"
                  step="50"
                  value={bankrollInput === "" ? settings.bankroll : bankrollInput}
                  onChange={(e) => {
                    setBankrollInput(e.target.value);
                    const v = parseFloat(e.target.value);
                    if (Number.isFinite(v) && v > 0) update({ bankroll: v });
                  }}
                  onBlur={() => setBankrollInput("")}
                  className="w-full text-center font-mono font-bold text-white bg-slate-950 border border-slate-800 rounded-xl py-2 text-lg focus:outline-none focus:border-indigo-500"
                  aria-label="Total bankroll in dollars"
                />
              </div>
              <div className="flex gap-1.5">
                {[500, 1000, 5000, 10000].map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => update({ bankroll: v })}
                    className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-colors cursor-pointer ${
                      settings.bankroll === v
                        ? "bg-indigo-500 text-slate-950"
                        : "bg-slate-800/70 text-slate-400 hover:text-white border border-slate-700/60"
                    }`}
                  >
                    ${v.toLocaleString()}
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-slate-500 leading-relaxed">
                The full amount of money you would allocate to this activity. Stakes are always a
                fraction of this number.
              </p>
            </div>

            {/* Kelly fraction */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
              <span className="text-xs font-bold text-slate-300 flex items-center space-x-1.5">
                <Percent className="w-3.5 h-3.5 text-indigo-400" />
                <span>Kelly Fraction</span>
              </span>
              <div className="space-y-1.5">
                {KELLY_PRESETS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => update({ kellyFraction: p.id })}
                    aria-pressed={settings.kellyFraction === p.id}
                    className={`w-full text-left px-3 py-2 rounded-xl border transition-all cursor-pointer ${
                      settings.kellyFraction === p.id
                        ? "bg-indigo-500/15 border-indigo-500/50"
                        : "bg-slate-800/40 border-slate-700/50 hover:border-slate-600"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-xs font-bold ${
                          settings.kellyFraction === p.id ? "text-indigo-300" : "text-slate-200"
                        }`}
                      >
                        {p.label}
                      </span>
                      {settings.kellyFraction === p.id && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                      )}
                    </div>
                    <span className="text-[10px] text-slate-500">{p.hint}</span>
                  </button>
                ))}
              </div>
              <label className="flex items-center space-x-2">
                <span className="text-[10px] text-slate-400">Custom:</span>
                <input
                  type="number"
                  min="1"
                  max="100"
                  step="5"
                  value={settings.kellyFraction * 100}
                  onChange={(e) => {
                    const v = (parseFloat(e.target.value) || 0) / 100;
                    if (v > 0 && v <= 1) update({ kellyFraction: v });
                  }}
                  className="w-16 text-center font-mono font-bold text-white bg-slate-950 border border-slate-800 rounded-lg py-1 text-xs focus:outline-none focus:border-indigo-500"
                  aria-label="Custom Kelly fraction percent"
                />
                <span className="text-[10px] text-slate-400">% of full Kelly</span>
              </label>
            </div>

            {/* Max stake cap */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
              <span className="text-xs font-bold text-slate-300 flex items-center space-x-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                <span>Maximum Single Stake</span>
              </span>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  min="0.5"
                  max="100"
                  step="0.5"
                  value={capInput === "" ? settings.maxStakePct * 100 : capInput}
                  onChange={(e) => {
                    setCapInput(e.target.value);
                    const v = (parseFloat(e.target.value) || 0) / 100;
                    if (v > 0 && v <= 1) update({ maxStakePct: v });
                  }}
                  onBlur={() => setCapInput("")}
                  className="w-full text-center font-mono font-bold text-white bg-slate-950 border border-slate-800 rounded-xl py-2 text-lg focus:outline-none focus:border-indigo-500"
                  aria-label="Maximum single stake percent of bankroll"
                />
                <span className="text-xs text-slate-400 font-bold">% cap</span>
              </div>
              <div className="flex gap-1.5">
                {[0.025, 0.05, 0.1].map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => update({ maxStakePct: v })}
                    className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-colors cursor-pointer ${
                      settings.maxStakePct === v
                        ? "bg-indigo-500 text-slate-950"
                        : "bg-slate-800/70 text-slate-400 hover:text-white border border-slate-700/60"
                    }`}
                  >
                    {(v * 100).toFixed(1)}%
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-slate-500 leading-relaxed">
                Hard ceiling on any single stake, regardless of how large Kelly computes. At the
                default 5% cap, a $1,000 bankroll never sizes above $50 on one analysis.
              </p>
            </div>
          </div>

          {/* Live example */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-sm font-bold text-slate-200">
                Live Example with Your Settings
              </h2>
              <button
                type="button"
                onClick={reset}
                disabled={isDefault}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 border border-slate-700 transition-colors cursor-pointer disabled:cursor-not-allowed"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset to defaults</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-400">
              Scenario: <strong className="text-slate-200">-110 price</strong> ·{" "}
              <strong className="text-slate-200">55% win probability</strong> (a +2.6pt gap over the
              52.4% break-even).
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-0.5">
                <span className="text-[10px] font-semibold text-slate-400">EV per $100</span>
                <div className={`text-xl font-black font-mono ${example.evPer100 > 0 ? "text-emerald-400" : "text-rose-400"}`}>
                  {example.evPer100 > 0 ? "+" : "-"}${Math.abs(example.evPer100).toFixed(2)}
                </div>
                <p className="text-[10px] text-slate-500">{formatSignedPct(example.evPerDollar)} per $1</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-0.5">
                <span className="text-[10px] font-semibold text-slate-400">Full Kelly</span>
                <div className="text-xl font-black font-mono text-white">
                  {formatPct(example.fullKellyFraction)}
                </div>
                <p className="text-[10px] text-slate-500">
                  → yours: {formatPct(settings.kellyFraction)} = {formatPct(example.adjustedFraction)}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-0.5">
                <span className="text-[10px] font-semibold text-slate-400">After Cap</span>
                <div className="text-xl font-black font-mono text-white">
                  {formatPct(example.cappedFraction)}
                </div>
                <p className="text-[10px] text-slate-500">cap = {formatPct(settings.maxStakePct, 1)}</p>
              </div>
              <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/30 space-y-0.5">
                <span className="text-[10px] font-semibold text-indigo-300">Illustrative Stake</span>
                <div className="text-xl font-black font-mono text-white">
                  ${example.stakeAmount}
                </div>
                <p className="text-[10px] text-indigo-300/70">
                  {example.stakePctOfBankroll.toFixed(2)}% of ${settings.bankroll.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* How it works */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
                <Info className="w-3.5 h-3.5 text-indigo-400" />
                <span>How the math works</span>
              </h3>
              <ul className="space-y-1.5 text-[11px] text-slate-400 leading-relaxed list-disc pl-4">
                <li>
                  <strong className="text-slate-200">EV per $1</strong> = p×b − (1−p), where p is the
                  win probability and b is the net profit per dollar on a win (at −110, b = 91¢).
                </li>
                <li>
                  <strong className="text-slate-200">Full Kelly</strong> f* = (p×b − (1−p)) / b — the
                  stake share that maximizes long-run bankroll growth if p is exactly right.
                </li>
                <li>
                  <strong className="text-slate-200">Fractional Kelly</strong> (default quarter) scales
                  f* down because real win probabilities are estimates, and Kelly is extremely
                  sensitive to overestimating p.
                </li>
                <li>
                  <strong className="text-slate-200">The cap</strong> keeps any single stake small even
                  when EV looks large — concentration control, independent of Kelly.
                </li>
                <li>
                  A negative or zero EV produces <strong className="text-slate-200">no stake at all</strong> —
                  the tool never sizes into a losing scenario.
                </li>
              </ul>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Privacy &amp; boundaries</span>
              </h3>
              <ul className="space-y-1.5 text-[11px] text-slate-400 leading-relaxed list-disc pl-4">
                <li>
                  Bankroll, Kelly fraction, and cap are stored <strong className="text-slate-200">only in
                  this browser</strong> (localStorage). They are never sent to the server and are not
                  part of any snapshot.
                </li>
                <li>
                  The win probability defaults to the analysis&apos;s historical hit rate — a
                  descriptive sample statistic, not a forecast. You may override it with your own
                  estimate; the label always says which one is in use.
                </li>
                <li>
                  Output is an arithmetic illustration on your inputs. It is not a prediction, a
                  guarantee, or an instruction to wager. 21+ only. If gambling stops being
                  controllable, call <a className="text-amber-400 underline" href="tel:1-800-426-2537">1-800-GAMBLER</a>.
                </li>
              </ul>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
