"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Search,
  Sparkles,
  TrendingUp,
  TrendingDown,
  Info,
  Share2,
  BookmarkPlus,
  RotateCcw,
  Check,
  AlertCircle,
  Clock,
  ShieldCheck,
  SlidersHorizontal,
  DollarSign,
} from "lucide-react";
import { SUPPORTED_MARKETS, getMarketById } from "@/lib/domain/markets";
import { EVIDENCE_WINDOWS, EvidenceWindowType } from "@/lib/domain/evidence";
import { UncertaintyBar } from "./UncertaintyBar";
import { GameLogsList } from "./GameLogsList";

interface PlayerItem {
  id: number;
  fullName: string;
  position: string;
  jerseyNumber: string;
  teamAbbr: string;
  teamName: string;
}

interface TeamItem {
  id: number;
  abbreviation: string;
  fullName: string;
}

interface AnalysisResult {
  player: {
    id: number;
    fullName: string;
    position: string;
    jerseyNumber: string;
    teamAbbr: string;
  };
  market: {
    id: string;
    code: string;
    label: string;
    unit: string;
    isDerived: boolean;
  };
  line: number;
  side: "over" | "under";
  odds: {
    americanOdds: number;
    oppositeOdds?: number;
    breakEvenProb: number;
    breakEvenPercent: string;
    noVig?: {
      sideNoVigProb: number;
      sideNoVigPercent: string;
      vigPercent: string;
    } | null;
  };
  evidence: {
    window: EvidenceWindowType;
    opponentAbbr: string | null;
    totalGamesInWindow: number;
    dnpExcludedCount: number;
    lowMinuteGamesCount: number;
    wins: number;
    losses: number;
    pushes: number;
    eligibleGames: number;
    hitRate: number;
    hitRatePercent: string;
    hitRateGap: number;
    hitRateGapPoints: string;
    uncertaintyInterval: {
      lower: number;
      upper: number;
      confidence: number;
    };
    uncertaintyIntervalFormatted: string;
    historicalStatus: "above" | "inconclusive" | "below";
    statusReason: string;
    hypotheticalReturn100: number;
    gameLogs: any[];
    source: string;
    fetchedAt: string;
  };
}

export function CalculatorStepper({ initialPlayerId }: { initialPlayerId?: number }) {
  // State
  const [playersList, setPlayersList] = useState<PlayerItem[]>([]);
  const [teamsList, setTeamsList] = useState<TeamItem[]>([]);
  const [isLoadingPlayers, setIsLoadingPlayers] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerItem | null>(null);

  const [selectedMarket, setSelectedMarket] = useState("PTS");
  const [line, setLine] = useState<number>(24.5);
  const [side, setSide] = useState<"over" | "under">("over");

  const [americanOdds, setAmericanOdds] = useState<number>(-110);
  const [includeOppositeOdds, setIncludeOppositeOdds] = useState(false);
  const [oppositeOdds, setOppositeOdds] = useState<number>(-110);

  const [evidenceWindow, setEvidenceWindow] = useState<EvidenceWindowType>("season");
  const [selectedOpponent, setSelectedOpponent] = useState<string>("");

  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [savedSnapshotId, setSavedSnapshotId] = useState<string | null>(null);
  const [isSavingSnapshot, setIsSavingSnapshot] = useState(false);
  const [shareToast, setShareToast] = useState(false);

  // Load initial players & teams
  useEffect(() => {
    async function loadInitialData() {
      try {
        const [playersRes, teamsRes] = await Promise.all([
          fetch("/api/players"),
          fetch("/api/teams"),
        ]);
        const pData = await playersRes.json();
        const tData = await teamsRes.json();

        if (pData.success && pData.players) {
          setPlayersList(pData.players);
          if (initialPlayerId) {
            const found = pData.players.find((p: PlayerItem) => p.id === initialPlayerId);
            if (found) setSelectedPlayer(found);
            else setSelectedPlayer(pData.players[0]);
          } else {
            setSelectedPlayer(pData.players[0]);
          }
        }
        if (tData.success && tData.teams) {
          setTeamsList(tData.teams);
          if (tData.teams.length > 0) {
            setSelectedOpponent(tData.teams[0].abbreviation);
          }
        }
      } catch (err) {
        console.error("Failed to load players/teams:", err);
      } finally {
        setIsLoadingPlayers(false);
      }
    }
    loadInitialData();
  }, [initialPlayerId]);

  // Update default line when market changes
  const handleMarketChange = (mId: string) => {
    setSelectedMarket(mId);
    const m = getMarketById(mId);
    setLine(m.defaultLine);
  };

  // Perform reactive calculation
  const executeAnalysis = useCallback(async () => {
    if (!selectedPlayer) return;

    setIsCalculating(true);
    setError(null);

    try {
      const payload: any = {
        playerId: selectedPlayer.id,
        market: selectedMarket,
        line,
        side,
        americanOdds,
        evidenceWindow,
      };

      if (includeOppositeOdds && oppositeOdds) {
        payload.oppositeOdds = oppositeOdds;
      }
      if (evidenceWindow === "vs_opponent" && selectedOpponent) {
        payload.opponentAbbr = selectedOpponent;
      }

      const res = await fetch("/api/analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setAnalysis(data.analysis);
      } else {
        setError(data.error || "Analysis failed");
      }
    } catch (err) {
      setError("Calculation request failed");
    } finally {
      setIsCalculating(false);
    }
  }, [selectedPlayer, selectedMarket, line, side, americanOdds, includeOppositeOdds, oppositeOdds, evidenceWindow, selectedOpponent]);

  // Re-run whenever inputs change
  useEffect(() => {
    if (selectedPlayer) {
      executeAnalysis();
    }
  }, [executeAnalysis, selectedPlayer, selectedMarket, line, side, americanOdds, includeOppositeOdds, oppositeOdds, evidenceWindow, selectedOpponent]);

  // Save Immutable Snapshot
  const handleSaveSnapshot = async () => {
    if (!analysis || !selectedPlayer) return;
    setIsSavingSnapshot(true);

    try {
      const res = await fetch("/api/snapshots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          playerId: selectedPlayer.id,
          playerName: selectedPlayer.fullName,
          playerTeam: selectedPlayer.teamAbbr,
          market: analysis.market.id,
          line: analysis.line,
          side: analysis.side,
          americanOdds: analysis.odds.americanOdds,
          oppositeOdds: analysis.odds.oppositeOdds,
          breakEvenProb: analysis.odds.breakEvenProb,
          noVigProb: analysis.odds.noVig?.sideNoVigProb,
          vigPercent: analysis.odds.noVig?.vigPercent ? parseFloat(analysis.odds.noVig.vigPercent) : null,
          hitRate: analysis.evidence.hitRate,
          hitRateGap: analysis.evidence.hitRateGap,
          sampleSize: analysis.evidence.totalGamesInWindow,
          wins: analysis.evidence.wins,
          losses: analysis.evidence.losses,
          pushes: analysis.evidence.pushes,
          uncertaintyLower: analysis.evidence.uncertaintyInterval.lower,
          uncertaintyUpper: analysis.evidence.uncertaintyInterval.upper,
          hypotheticalReturn100: analysis.evidence.hypotheticalReturn100,
          historicalStatus: analysis.evidence.historicalStatus,
          evidenceWindow: analysis.evidence.window,
          opponentAbbr: analysis.evidence.opponentAbbr,
          gameEvidence: analysis.evidence.gameLogs,
        }),
      });

      const data = await res.json();
      if (data.success && data.snapshotId) {
        setSavedSnapshotId(data.snapshotId);
      }
    } catch (err) {
      console.error("Failed to save snapshot:", err);
    } finally {
      setIsSavingSnapshot(false);
    }
  };

  // Copy share link
  const handleShare = () => {
    const url = savedSnapshotId
      ? `${window.location.origin}/snapshots/${savedSnapshotId}`
      : window.location.href;
    navigator.clipboard.writeText(url);
    setShareToast(true);
    setTimeout(() => setShareToast(false), 2000);
  };

  const filteredPlayers = playersList.filter((p) =>
    p.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.teamAbbr.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentMarketDef = getMarketById(selectedMarket);

  return (
    <div className="space-y-6">
      {/* 5-Step Rapid Mobile Input Panel */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl space-y-5">
        <div className="flex flex-wrap items-center justify-between pb-3 border-b border-slate-800 gap-2">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h2 className="text-base font-bold text-slate-100">
              30-Second Rapid Prop Analysis
            </h2>
          </div>
          <div className="flex items-center space-x-2 text-[11px] text-slate-400">
            <Clock className="w-3.5 h-3.5 text-sky-400" />
            <span>Target: &lt; 30 sec completion</span>
          </div>
        </div>

        {/* STEP 1: Select Player */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs font-bold text-slate-300">
            <span className="flex items-center space-x-1.5">
              <span className="w-5 h-5 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center text-[10px]">1</span>
              <span>Select NBA Player</span>
            </span>
            {selectedPlayer && (
              <span className="text-sky-400 font-mono">
                {selectedPlayer.fullName} ({selectedPlayer.teamAbbr} #{selectedPlayer.jerseyNumber})
              </span>
            )}
          </div>

          {/* Quick star chips */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {playersList.slice(0, 6).map((p) => (
              <button
                type="button"
                key={p.id}
                onClick={() => setSelectedPlayer(p)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  selectedPlayer?.id === p.id
                    ? "bg-sky-500 text-slate-950 shadow-md font-bold"
                    : "bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/60"
                }`}
              >
                {p.fullName.split(" ")[1] || p.fullName} ({p.teamAbbr})
              </button>
            ))}
          </div>

          {/* Search Dropdown / Autocomplete */}
          <div className="relative pt-1">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search player or team (e.g. Jokic, Luka, Edwards, OKC)..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-colors"
              />
            </div>

            {searchQuery.trim() !== "" && (
              <div className="absolute top-full mt-1 w-full bg-slate-900 border border-slate-800 rounded-xl shadow-2xl max-h-48 overflow-y-auto z-30 p-1">
                {filteredPlayers.length === 0 ? (
                  <div className="p-3 text-xs text-slate-400 text-center">No matching player found</div>
                ) : (
                  filteredPlayers.map((p) => (
                    <button
                      type="button"
                      key={p.id}
                      onClick={() => {
                        setSelectedPlayer(p);
                        setSearchQuery("");
                      }}
                      className="w-full text-left px-3 py-2 text-xs rounded-lg hover:bg-slate-800 text-slate-200 flex justify-between items-center"
                    >
                      <span className="font-semibold">{p.fullName}</span>
                      <span className="text-slate-400 text-[10px] font-mono">{p.teamAbbr} · {p.position}</span>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* STEP 2: Prop Market & Line */}
        <div className="space-y-3 pt-2 border-t border-slate-800/80">
          <div className="flex justify-between items-center text-xs font-bold text-slate-300">
            <span className="flex items-center space-x-1.5">
              <span className="w-5 h-5 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center text-[10px]">2</span>
              <span>Prop Market &amp; Line</span>
            </span>
            <span className="text-slate-400 text-[11px] font-mono">
              {currentMarketDef.label}
            </span>
          </div>

          {/* Market Chips */}
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
            {SUPPORTED_MARKETS.map((m) => (
              <button
                type="button"
                key={m.id}
                onClick={() => handleMarketChange(m.id)}
                className={`py-2 px-2 rounded-xl text-xs font-bold text-center transition-all cursor-pointer ${
                  selectedMarket === m.id
                    ? "bg-gradient-to-r from-sky-500 to-indigo-500 text-slate-950 shadow-md scale-[1.02]"
                    : "bg-slate-800/60 text-slate-300 hover:bg-slate-700/80 border border-slate-700/60"
                }`}
              >
                <div className="text-xs">{m.code}</div>
                <div className="text-[9px] opacity-75 font-normal truncate">{m.label}</div>
              </button>
            ))}
          </div>

          {/* Line Adjustment Stepper & Over/Under Toggle */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {/* Line Stepper */}
            <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between">
              <div className="text-xs text-slate-400 font-semibold pl-1">Line:</div>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setLine((prev) => Math.max(0.5, prev - 0.5))}
                  className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold flex items-center justify-center cursor-pointer text-sm"
                >
                  -0.5
                </button>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  value={line}
                  onChange={(e) => setLine(parseFloat(e.target.value) || 0)}
                  className="w-16 text-center font-mono font-bold text-white bg-slate-900 border border-slate-700 rounded-lg py-1 text-sm focus:outline-none focus:border-sky-500"
                />
                <button
                  type="button"
                  onClick={() => setLine((prev) => prev + 0.5)}
                  className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold flex items-center justify-center cursor-pointer text-sm"
                >
                  +0.5
                </button>
              </div>
            </div>

            {/* Over / Under Pill */}
            <div className="grid grid-cols-2 gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => setSide("over")}
                className={`py-2 rounded-lg font-bold text-xs flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
                  side === "over"
                    ? "bg-emerald-500 text-slate-950 shadow-md"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5" />
                <span>OVER {line}</span>
              </button>
              <button
                type="button"
                onClick={() => setSide("under")}
                className={`py-2 rounded-lg font-bold text-xs flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
                  side === "under"
                    ? "bg-amber-500 text-slate-950 shadow-md"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <TrendingDown className="w-3.5 h-3.5" />
                <span>UNDER {line}</span>
              </button>
            </div>
          </div>
        </div>

        {/* STEP 3: Sportsbook American Odds */}
        <div className="space-y-2.5 pt-2 border-t border-slate-800/80">
          <div className="flex justify-between items-center text-xs font-bold text-slate-300">
            <span className="flex items-center space-x-1.5">
              <span className="w-5 h-5 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center text-[10px]">3</span>
              <span>Sportsbook American Odds</span>
            </span>
            <span className="text-slate-400 text-[11px] font-mono">
              Break-Even: {analysis ? analysis.odds.breakEvenPercent : "52.4%"}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-6 gap-1.5">
            {[-125, -120, -115, -110, +100, +115].map((preset) => (
              <button
                type="button"
                key={preset}
                onClick={() => setAmericanOdds(preset)}
                className={`py-1.5 px-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                  americanOdds === preset
                    ? "bg-amber-500 text-slate-950 shadow-md"
                    : "bg-slate-800/60 text-slate-300 hover:bg-slate-700/80 border border-slate-700/60"
                }`}
              >
                {preset > 0 ? `+${preset}` : preset}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <div className="flex items-center space-x-2">
              <span className="text-xs text-slate-400">Custom Odds:</span>
              <input
                type="number"
                value={americanOdds}
                onChange={(e) => setAmericanOdds(parseInt(e.target.value, 10) || -110)}
                placeholder="-110"
                className="w-24 text-center font-mono font-bold text-white bg-slate-950 border border-slate-800 rounded-lg py-1 text-xs focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* No-Vig Option */}
            <button
              type="button"
              onClick={() => setIncludeOppositeOdds(!includeOppositeOdds)}
              className={`text-xs px-2.5 py-1 rounded-lg border flex items-center space-x-1.5 transition-colors cursor-pointer ${
                includeOppositeOdds
                  ? "bg-indigo-500/20 border-indigo-500/50 text-indigo-300"
                  : "bg-slate-800/40 border-slate-700/50 text-slate-400 hover:text-slate-200"
              }`}
            >
              <SlidersHorizontal className="w-3 h-3" />
              <span>{includeOppositeOdds ? "No-Vig Enabled" : "+ Add Opposite Odds (No-Vig)"}</span>
            </button>

            {includeOppositeOdds && (
              <div className="flex items-center space-x-2 animate-in fade-in">
                <span className="text-xs text-slate-400">Opposite Side Odds:</span>
                <input
                  type="number"
                  value={oppositeOdds}
                  onChange={(e) => setOppositeOdds(parseInt(e.target.value, 10) || -110)}
                  placeholder="-110"
                  className="w-20 text-center font-mono font-bold text-white bg-slate-950 border border-slate-800 rounded-lg py-1 text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>
            )}
          </div>
        </div>

        {/* STEP 4: Evidence Window */}
        <div className="space-y-2 pt-2 border-t border-slate-800/80">
          <div className="flex justify-between items-center text-xs font-bold text-slate-300">
            <span className="flex items-center space-x-1.5">
              <span className="w-5 h-5 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center text-[10px]">4</span>
              <span>Evidence Window Sample</span>
            </span>
            <span className="text-slate-400 text-[11px]">
              {analysis ? `${analysis.evidence.eligibleGames} non-push games` : ""}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-1.5">
            {EVIDENCE_WINDOWS.map((win) => (
              <button
                type="button"
                key={win.id}
                onClick={() => setEvidenceWindow(win.id)}
                className={`py-1.5 px-2 rounded-xl text-xs font-bold text-center transition-all cursor-pointer ${
                  evidenceWindow === win.id
                    ? "bg-slate-100 text-slate-950 shadow-md scale-[1.02]"
                    : "bg-slate-800/60 text-slate-300 hover:bg-slate-700/80 border border-slate-700/60"
                }`}
              >
                <div className="text-xs">{win.shortLabel}</div>
              </button>
            ))}
          </div>

          {/* Opponent selector if vs_opponent */}
          {evidenceWindow === "vs_opponent" && (
            <div className="pt-2 flex items-center space-x-2 animate-in fade-in">
              <span className="text-xs text-slate-400">Target Opponent:</span>
              <select
                value={selectedOpponent}
                onChange={(e) => setSelectedOpponent(e.target.value)}
                className="bg-slate-950 text-slate-100 border border-slate-800 rounded-lg px-3 py-1.5 text-xs font-bold focus:outline-none focus:border-sky-500"
              >
                {teamsList.map((t) => (
                  <option key={t.id} value={t.abbreviation}>
                    {t.fullName} ({t.abbreviation})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* STEP 5: LIVE ANALYSIS RESULTS DASHBOARD */}
      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-rose-400 text-xs flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {analysis && (
        <div className="space-y-6">
          {/* Main Primary Metrics Card */}
          <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-5 sm:p-7 shadow-2xl space-y-6">
            {/* Header / Player Banner */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-xl font-black text-white">
                    {analysis.player.fullName}
                  </h3>
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-xs font-bold">
                    {analysis.player.teamAbbr} #{analysis.player.jerseyNumber}
                  </span>
                </div>
                <p className="text-xs text-slate-400 pt-0.5">
                  Prop: <strong className="text-slate-200">{analysis.side.toUpperCase()} {analysis.line} {analysis.market.label}</strong> · Odds: <strong className="text-amber-400">{analysis.odds.americanOdds > 0 ? `+${analysis.odds.americanOdds}` : analysis.odds.americanOdds}</strong>
                </p>
              </div>

              {/* Status Badge */}
              <div className="flex items-center space-x-2">
                {analysis.evidence.historicalStatus === "above" && (
                  <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-xs">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span>Historical Evidence Above Break-Even</span>
                  </span>
                )}
                {analysis.evidence.historicalStatus === "inconclusive" && (
                  <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold text-xs">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    <span>Inconclusive / Neutral Evidence</span>
                  </span>
                )}
                {analysis.evidence.historicalStatus === "below" && (
                  <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 font-bold text-xs">
                    <span className="w-2 h-2 rounded-full bg-rose-400" />
                    <span>Historical Evidence Below Break-Even</span>
                  </span>
                )}
              </div>
            </div>

            {/* Core Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Hit Rate Card */}
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
                <span className="text-[11px] font-semibold text-slate-400">Historical Hit Rate</span>
                <div className="text-3xl font-black text-white font-mono">
                  {analysis.evidence.hitRatePercent}
                </div>
                <p className="text-[10px] text-slate-400">
                  {analysis.evidence.wins} wins in {analysis.evidence.eligibleGames} non-push games
                </p>
              </div>

              {/* Break-Even Prob Card */}
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
                <span className="text-[11px] font-semibold text-slate-400">Break-Even Probability</span>
                <div className="text-3xl font-black text-amber-400 font-mono">
                  {analysis.odds.breakEvenPercent}
                </div>
                <p className="text-[10px] text-slate-400">
                  Required win % at {analysis.odds.americanOdds > 0 ? `+${analysis.odds.americanOdds}` : analysis.odds.americanOdds} odds
                </p>
              </div>

              {/* Hit Rate Gap Card */}
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
                <span className="text-[11px] font-semibold text-slate-400">Historical Hit-Rate Gap</span>
                <div className={`text-3xl font-black font-mono ${
                  analysis.evidence.hitRateGap >= 0 ? "text-emerald-400" : "text-rose-400"
                }`}>
                  {analysis.evidence.hitRateGapPoints}
                </div>
                <p className="text-[10px] text-slate-400">
                  Hit rate minus break-even (descriptive only)
                </p>
              </div>
            </div>

            {/* Wilson Score Uncertainty Visualization */}
            <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800/80 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-300">Sampling Uncertainty (Wilson Score Interval)</span>
                <span className="text-[11px] text-slate-500 font-mono">95% Confidence Level</span>
              </div>

              <UncertaintyBar
                lower={analysis.evidence.uncertaintyInterval.lower}
                upper={analysis.evidence.uncertaintyInterval.upper}
                hitRate={analysis.evidence.hitRate}
                breakEvenProb={analysis.odds.breakEvenProb}
              />

              <p className="text-[11px] text-slate-400 leading-relaxed">
                {analysis.evidence.statusReason}
              </p>
            </div>

            {/* Hypothetical Return Scenario & No-Vig (If enabled) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                  <span className="flex items-center space-x-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Hypothetical Return Scenario</span>
                  </span>
                  <span className={`font-mono font-bold ${
                    analysis.evidence.hypotheticalReturn100 >= 0 ? "text-emerald-400" : "text-rose-400"
                  }`}>
                    {analysis.evidence.hypotheticalReturn100 >= 0 ? "+$" : "-$"}{Math.abs(analysis.evidence.hypotheticalReturn100).toFixed(2)}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  Calculated return on a $100 baseline IF the historical hit rate ({analysis.evidence.hitRatePercent}) were the future win rate. Descriptive illustration only; not a forecast.
                </p>
              </div>

              {analysis.odds.noVig && (
                <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                    <span>No-Vig Fair Market Quote</span>
                    <span className="font-mono font-bold text-indigo-400">
                      {analysis.odds.noVig.sideNoVigPercent}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-relaxed">
                    Sportsbook juice / vig margin is {analysis.odds.noVig.vigPercent}. Normalized two-sided probability removes bookmaker margin.
                  </p>
                </div>
              )}
            </div>

            {/* Game Logs Evidence Component */}
            <GameLogsList
              games={analysis.evidence.gameLogs}
              line={analysis.line}
              side={analysis.side}
              unit={analysis.market.unit}
            />

            {/* Provenance & Action Buttons */}
            <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center space-x-2 text-slate-400 text-[11px]">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Source: {analysis.evidence.source}</span>
                <span>•</span>
                <span>All Games Final</span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={handleSaveSnapshot}
                  disabled={isSavingSnapshot || savedSnapshotId !== null}
                  className="px-3.5 py-2 bg-sky-500 hover:bg-sky-600 disabled:bg-emerald-600 text-slate-950 font-bold rounded-xl transition-all flex items-center space-x-1.5 cursor-pointer text-xs"
                >
                  {savedSnapshotId ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Saved ({savedSnapshotId})</span>
                    </>
                  ) : (
                    <>
                      <BookmarkPlus className="w-3.5 h-3.5" />
                      <span>{isSavingSnapshot ? "Saving..." : "Save Immutable Snapshot"}</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleShare}
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold rounded-xl transition-all border border-slate-700 flex items-center space-x-1.5 cursor-pointer text-xs"
                >
                  {shareToast ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                  <span>{shareToast ? "Link Copied!" : "Share Analysis"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
