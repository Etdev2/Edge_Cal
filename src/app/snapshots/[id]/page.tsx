"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Bookmark,
  Share2,
  Calendar,
  ShieldCheck,
  Check,
  TrendingUp,
  TrendingDown,
  Download,
} from "lucide-react";
import { UncertaintyBar } from "@/components/UncertaintyBar";
import { GameLogsList } from "@/components/GameLogsList";

export default function SnapshotDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [snapshot, setSnapshot] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function fetchSnapshot() {
      try {
        const res = await fetch(`/api/snapshots/${id}`);
        const data = await res.json();
        if (data.success && data.snapshot) {
          setSnapshot(data.snapshot);
        } else {
          setError(data.error || "Snapshot not found");
        }
      } catch (err) {
        setError("Failed to load snapshot");
      } finally {
        setIsLoading(false);
      }
    }
    fetchSnapshot();
  }, [id]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const exportAsJson = () => {
    if (!snapshot) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(snapshot, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${snapshot.snapshotId}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  if (isLoading) {
    return (
      <div className="p-12 text-center text-xs text-slate-400">Loading immutable snapshot...</div>
    );
  }

  if (error || !snapshot) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Snapshot Not Found</h2>
        <p className="text-xs text-slate-400">
          The requested snapshot identifier <code>{id}</code> does not exist or has expired.
        </p>
        <Link
          href="/snapshots"
          className="inline-flex items-center space-x-1.5 px-4 py-2 bg-sky-500 text-slate-950 font-bold rounded-xl text-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Snapshots Vault</span>
        </Link>
      </div>
    );
  }

  const hitRatePct = (snapshot.hitRate * 100).toFixed(1);
  const breakEvenPct = (snapshot.breakEvenProb * 100).toFixed(1);
  const gapPct = (snapshot.hitRateGap * 100).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/snapshots"
          className="inline-flex items-center space-x-1 text-xs font-semibold text-slate-400 hover:text-slate-200"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Snapshots</span>
        </Link>

        <div className="flex items-center space-x-2">
          <button
            onClick={exportAsJson}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-semibold cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export JSON</span>
          </button>
          <button
            onClick={handleShare}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-slate-950 text-xs font-bold cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copied ? "Link Copied!" : "Share"}</span>
          </button>
        </div>
      </div>

      {/* Snapshot Verification Header Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-mono text-sm font-bold text-sky-400">
                {snapshot.snapshotId}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                IMMUTABLE AUDIT RECORD
              </span>
            </div>
            <h1 className="text-2xl font-black text-white pt-1">
              {snapshot.playerName} ({snapshot.playerTeam})
            </h1>
            <p className="text-xs text-slate-400">
              {snapshot.side.toUpperCase()} {snapshot.line} {snapshot.market} · Sportsbook Odds: <strong className="text-amber-400">{snapshot.americanOdds > 0 ? `+${snapshot.americanOdds}` : snapshot.americanOdds}</strong>
            </p>
          </div>

          <div className="text-right space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Archived At</span>
            <span className="text-xs font-mono text-slate-300 flex items-center space-x-1">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>{new Date(snapshot.createdAt).toLocaleString()}</span>
            </span>
          </div>
        </div>

        {/* Metrics Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-[11px] font-semibold text-slate-400">Historical Hit Rate</span>
            <div className="text-3xl font-black text-white font-mono">{hitRatePct}%</div>
            <p className="text-[10px] text-slate-400">{snapshot.wins} wins in {snapshot.wins + snapshot.losses} non-push games</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-[11px] font-semibold text-slate-400">Break-Even Probability</span>
            <div className="text-3xl font-black text-amber-400 font-mono">{breakEvenPct}%</div>
            <p className="text-[10px] text-slate-400">At {snapshot.americanOdds > 0 ? `+${snapshot.americanOdds}` : snapshot.americanOdds} odds</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-[11px] font-semibold text-slate-400">Hit-Rate Gap</span>
            <div className={`text-3xl font-black font-mono ${snapshot.hitRateGap >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
              {snapshot.hitRateGap >= 0 ? "+" : ""}{gapPct}%
            </div>
            <p className="text-[10px] text-slate-400">Historical hit rate minus break-even</p>
          </div>
        </div>

        {/* Uncertainty Bar */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
          <UncertaintyBar
            lower={snapshot.uncertaintyLower}
            upper={snapshot.uncertaintyUpper}
            hitRate={snapshot.hitRate}
            breakEvenProb={snapshot.breakEvenProb}
          />
        </div>

        {/* Game Evidence Breakdown */}
        {snapshot.gameEvidence && (
          <GameLogsList
            games={snapshot.gameEvidence}
            line={snapshot.line}
            side={snapshot.side}
            unit={snapshot.market}
          />
        )}

        {/* Compliance Footer */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center space-x-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Analysis-Only Record · 0 Bet Data Stored · Licensed BALLDONTLIE Source</span>
          </div>
        </div>
      </div>
    </div>
  );
}
