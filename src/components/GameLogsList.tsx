"use client";

import { useState } from "react";
import { AlertTriangle, Clock, Calendar, ChevronDown, ChevronUp } from "lucide-react";
import { SettledGameLogItem } from "@/lib/domain/evidence";

interface GameLogsListProps {
  games: SettledGameLogItem[];
  line: number;
  side: "over" | "under";
  unit: string;
}

export function GameLogsList({ games, line, side, unit }: GameLogsListProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const displayedGames = isExpanded ? games : games.slice(0, 8);

  if (!games || games.length === 0) {
    return (
      <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 text-center text-xs text-slate-400">
        No eligible games found in this evidence window.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="font-bold text-xs text-slate-300">
            Game Evidence Breakdown ({games.length} games)
          </span>
        </div>
        <span className="text-[11px] text-slate-500 font-medium">
          Line: {line} {unit} ({side.toUpperCase()})
        </span>
      </div>

      {/* Grid of game badges / cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {displayedGames.map((g, idx) => {
          const isWin = g.outcome === "win";
          const isPush = g.outcome === "push";

          return (
            <div
              key={`${g.gameId}-${idx}`}
              className={`p-3 rounded-xl border transition-all text-xs flex flex-col justify-between space-y-2 ${
                isWin
                  ? "bg-emerald-950/20 border-emerald-500/30 text-emerald-200"
                  : isPush
                  ? "bg-amber-950/20 border-amber-500/30 text-amber-200"
                  : "bg-slate-900/80 border-slate-800 text-slate-300"
              }`}
            >
              {/* Header row: Opponent, Venue, Date */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1.5 font-bold">
                  <span className="text-white">
                    {g.isHome ? "vs" : "@"} {g.opponentAbbr}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 font-mono">
                    {g.isHome ? "Home" : "Away"}
                  </span>
                </div>
                <div className="flex items-center space-x-1 text-[10px] text-slate-400 font-mono">
                  <Calendar className="w-3 h-3 text-slate-500" />
                  <span>{g.gameDate}</span>
                </div>
              </div>

              {/* Stat row vs Line & Result */}
              <div className="flex items-center justify-between pt-1 border-t border-slate-800/60">
                <div className="flex items-baseline space-x-2">
                  <span className="text-base font-black text-white font-mono">
                    {g.statValue}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {unit} (Line: {line})
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  {/* Low Minutes Warning */}
                  {g.lowMinutesFlag && (
                    <span
                      title="Low playing time (<15 mins) recorded"
                      className="inline-flex items-center space-x-0.5 px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[9px] font-bold"
                    >
                      <AlertTriangle className="w-2.5 h-2.5" />
                      <span>{g.min}m</span>
                    </span>
                  )}
                  {!g.lowMinutesFlag && (
                    <span className="inline-flex items-center space-x-0.5 text-[10px] text-slate-400 font-mono">
                      <Clock className="w-2.5 h-2.5 text-slate-500" />
                      <span>{g.min}m</span>
                    </span>
                  )}

                  {/* Outcome Tag */}
                  <span
                    className={`px-2 py-0.5 rounded font-black text-[10px] uppercase tracking-wider ${
                      isWin
                        ? "bg-emerald-500 text-slate-950"
                        : isPush
                        ? "bg-amber-400 text-slate-950"
                        : "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                    }`}
                  >
                    {g.outcome}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Expand / Collapse Button */}
      {games.length > 8 && (
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full py-2 px-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-semibold text-slate-300 hover:text-white transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
        >
          <span>{isExpanded ? "Show Fewer Games" : `Show All ${games.length} Games`}</span>
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      )}
    </div>
  );
}
