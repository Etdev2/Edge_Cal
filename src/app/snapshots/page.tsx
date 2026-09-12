"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Bookmark,
  Calendar,
  ExternalLink,
  Download,
  Share2,
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  Search,
} from "lucide-react";

interface SnapshotItem {
  id: number;
  snapshotId: string;
  playerName: string;
  playerTeam: string;
  market: string;
  line: number;
  side: "over" | "under";
  americanOdds: number;
  pricingMode?: "sportsbook" | "prediction_market";
  predictionMarketPriceCents?: number | null;
  predictionMarketCommissionPct?: number | null;
  breakEvenProb: number;
  hitRate: number;
  hitRateGap: number;
  sampleSize: number;
  wins: number;
  losses: number;
  pushes: number;
  historicalStatus: "above" | "inconclusive" | "below";
  evidenceWindow: string;
  createdAt: string;
}

export default function SnapshotsPage() {
  const [snapshots, setSnapshots] = useState<SnapshotItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function loadSnapshots() {
      try {
        const res = await fetch("/api/snapshots?limit=50");
        const data = await res.json();
        if (data.success && data.snapshots) {
          setSnapshots(data.snapshots);
        }
      } catch (err) {
        console.error("Failed to load snapshots:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadSnapshots();
  }, []);

  const filtered = snapshots.filter(
    (s) =>
      s.playerName.toLowerCase().includes(search.toLowerCase()) ||
      s.market.toLowerCase().includes(search.toLowerCase()) ||
      s.snapshotId.toLowerCase().includes(search.toLowerCase())
  );

  const exportAllAsJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(snapshots, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `edge_cal_snapshots_${new Date().toISOString().split("T")[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-amber-500/10 text-amber-400 rounded-2xl border border-amber-500/20">
              <Bookmark className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-white">
                Immutable Snapshot Vault
              </h1>
              <p className="text-xs text-slate-400 pt-0.5">
                Preserved historical comparisons with immutable game logs and mathematical evidence. Zero wagering data.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={exportAllAsJson}
              disabled={snapshots.length === 0}
              className="inline-flex items-center space-x-1.5 text-xs font-bold bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 px-3.5 py-2 rounded-xl border border-slate-700 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export All (JSON)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter saved analyses by player or market..."
          className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500"
        />
      </div>

      {/* Snapshots Grid */}
      {isLoading ? (
        <div className="p-12 text-center text-xs text-slate-400">Loading snapshots...</div>
      ) : filtered.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 text-center space-y-3">
          <Bookmark className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="font-bold text-slate-300 text-sm">No Snapshots Saved Yet</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Run an analysis on the Calculator and click &quot;Save Immutable Snapshot&quot; to archive your historical comparisons here.
          </p>
          <Link
            href="/"
            className="inline-flex items-center space-x-1.5 px-4 py-2 bg-sky-500 hover:bg-sky-600 text-slate-950 font-bold rounded-xl text-xs"
          >
            Go to Calculator
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((s) => {
            const hitRatePct = (s.hitRate * 100).toFixed(1);
            const breakEvenPct = (s.breakEvenProb * 100).toFixed(1);
            const gapPct = (s.hitRateGap * 100).toFixed(1);

            return (
              <div
                key={s.snapshotId}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 shadow-lg space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-sky-400">
                      {s.snapshotId}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(s.createdAt).toLocaleDateString()}</span>
                    </span>
                  </div>

                  <div>
                    <h3 className="font-black text-white text-base">
                      {s.playerName} ({s.playerTeam})
                    </h3>
                    <p className="text-xs text-slate-400">
                      {s.side.toUpperCase()} {s.line} {s.market} · {s.pricingMode === "prediction_market" ? "Price" : "Odds"}: <span className="text-amber-400 font-mono font-bold">{s.pricingMode === "prediction_market" ? `${s.predictionMarketPriceCents}¢ + ${s.predictionMarketCommissionPct}%` : s.americanOdds > 0 ? `+${s.americanOdds}` : s.americanOdds}</span>
                    </p>
                  </div>

                  {/* Metrics grid */}
                  <div className="grid grid-cols-3 gap-2 pt-2 text-center bg-slate-950/70 p-2.5 rounded-xl border border-slate-800/80">
                    <div>
                      <span className="text-[9px] text-slate-500 block uppercase">Hit Rate</span>
                      <span className="font-mono font-bold text-xs text-white">{hitRatePct}%</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-500 block uppercase">Break-Even</span>
                      <span className="font-mono font-bold text-xs text-amber-400">{breakEvenPct}%</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-500 block uppercase">Gap</span>
                      <span className={`font-mono font-bold text-xs ${s.hitRateGap >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                        {s.hitRateGap >= 0 ? "+" : ""}{gapPct}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">
                    Sample: {s.sampleSize} games ({s.wins}W - {s.losses}L - {s.pushes}P)
                  </span>
                  <Link
                    href={`/snapshots/${s.snapshotId}`}
                    className="inline-flex items-center space-x-1 text-xs font-bold text-sky-400 hover:text-sky-300 bg-sky-500/10 px-2.5 py-1 rounded-lg border border-sky-500/20"
                  >
                    <span>Inspect</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
