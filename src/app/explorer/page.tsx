"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BarChart3,
  Search,
  Users,
  Activity,
  Layers,
} from "lucide-react";
import { NBA_PLAYERS, NBA_TEAMS } from "@/lib/data/nbaData";
import { NFL_PLAYERS, NFL_TEAMS } from "@/lib/data/nflData";

type Sport = "nba" | "nfl";

export default function ExplorerPage() {
  const [sport, setSport] = useState<Sport>("nba");
  const [selectedConference, setSelectedConference] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTeam, setSelectedTeam] = useState<number | null>(null);

  const teams = sport === "nfl" ? NFL_TEAMS : NBA_TEAMS;
  const conferences = sport === "nfl" ? ["All", "AFC", "NFC"] : ["All", "West", "East"];

  const playerMatchesQuery = (p: { fullName: string; teamAbbr: string; teamId: number }) => {
    if (selectedTeam && p.teamId !== selectedTeam) return false;
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      return p.fullName.toLowerCase().includes(q) || p.teamAbbr.toLowerCase().includes(q);
    }
    return true;
  };
  const filteredNbaPlayers = NBA_PLAYERS.filter(playerMatchesQuery);
  const filteredNflPlayers = NFL_PLAYERS.filter(playerMatchesQuery);
  const filteredPlayersCount =
    sport === "nfl" ? filteredNflPlayers.length : filteredNbaPlayers.length;

  const handleSportChange = (next: Sport) => {
    if (next === sport) return;
    setSport(next);
    setSelectedConference("All");
    setSelectedTeam(null);
  };

  const filteredTeams = teams.filter((t) => {
    if (selectedConference !== "All" && t.conference !== selectedConference) return false;
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      return (
        t.fullName.toLowerCase().includes(q) ||
        t.abbreviation.toLowerCase().includes(q) ||
        t.city.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-2xl border border-indigo-500/20">
              <BarChart3 className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-white">
                Evidence &amp; Roster Explorer
              </h1>
              <p className="text-xs text-slate-400 pt-0.5">
                Inspect {sport === "nfl" ? "32 NFL teams" : "30 NBA teams"}, player averages, and launch historical prop evaluations directly.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono font-bold text-slate-400 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
              Season: {sport === "nfl" ? "2026 Regular" : "2025-26 Regular"}
            </span>
          </div>
        </div>

        {/* Sport tabs */}
        <div className="grid grid-cols-2 gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 max-w-xs" role="group" aria-label="Sport">
          <button
            type="button"
            aria-pressed={sport === "nba"}
            onClick={() => handleSportChange("nba")}
            className={`py-2 rounded-lg font-black text-sm transition-all cursor-pointer ${
              sport === "nba"
                ? "bg-gradient-to-r from-sky-500 to-indigo-500 text-slate-950 shadow-md"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            🏀 NBA
          </button>
          <button
            type="button"
            aria-pressed={sport === "nfl"}
            onClick={() => handleSportChange("nfl")}
            className={`py-2 rounded-lg font-black text-sm transition-all cursor-pointer ${
              sport === "nfl"
                ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            🏈 NFL
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          {conferences.map((conf) => (
            <button
              key={conf}
              onClick={() => setSelectedConference(conf)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedConference === conf
                  ? "bg-indigo-500 text-slate-950 shadow-md"
                  : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
              }`}
            >
              {conf} {conf !== "All" ? (sport === "nfl" ? "Conference" : "Side") : "Teams"}
            </button>
          ))}
          {selectedTeam && (
            <button
              onClick={() => setSelectedTeam(null)}
              className="text-xs px-2.5 py-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white font-semibold cursor-pointer"
            >
              Clear Team Filter
            </button>
          )}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search team or player..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Star Player Roster Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-2">
            <Users className="w-4 h-4 text-indigo-400" />
            <span>Featured Players ({filteredPlayersCount})</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sport === "nba"
            ? filteredNbaPlayers.map((p) => (
                <div
                  key={p.id}
                  className="bg-slate-900 border border-slate-800 hover:border-indigo-500/50 rounded-2xl p-5 shadow-lg space-y-4 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-black text-white text-base">{p.fullName}</h3>
                      <p className="text-xs text-slate-400">
                        {p.teamAbbr} #{p.jerseyNumber} · {p.position} · {p.height}
                      </p>
                    </div>
                    <span className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center font-bold text-sm text-indigo-400 font-mono">
                      {p.teamAbbr}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800/80 text-center text-xs">
                    <div>
                      <span className="text-[9px] text-slate-500 uppercase font-bold block">PTS</span>
                      <span className="font-mono font-bold text-white">{p.typicalAverages.pts}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-500 uppercase font-bold block">REB</span>
                      <span className="font-mono font-bold text-white">{p.typicalAverages.reb}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-500 uppercase font-bold block">AST</span>
                      <span className="font-mono font-bold text-white">{p.typicalAverages.ast}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-[10px] text-slate-500 font-mono">
                      3PM: {p.typicalAverages.fg3m} · BLK: {p.typicalAverages.blk}
                    </span>
                    <Link
                      href="/"
                      className="inline-flex items-center space-x-1 px-3 py-1.5 bg-indigo-500 hover:bg-indigo-600 text-slate-950 font-bold rounded-xl text-xs transition-colors"
                    >
                      <Activity className="w-3.5 h-3.5" />
                      <span>Analyze Prop</span>
                    </Link>
                  </div>
                </div>
              ))
            : filteredNflPlayers.map((p) => (
                <div
                  key={p.id}
                  className="bg-slate-900 border border-slate-800 hover:border-emerald-500/50 rounded-2xl p-5 shadow-lg space-y-4 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-black text-white text-base">{p.fullName}</h3>
                      <p className="text-xs text-slate-400">
                        {p.teamAbbr} #{p.jerseyNumber} · {p.position} · {p.height}
                      </p>
                    </div>
                    <span className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center font-bold text-sm text-emerald-400 font-mono">
                      {p.teamAbbr}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800/80 text-center text-xs">
                    {(
                      [
                        ["PASS", p.typicalAverages.passYds],
                        ["RUSH", p.typicalAverages.rushYds],
                        ["REC", p.typicalAverages.rec],
                      ] as [string, number][]
                    ).map(([label, value]) => (
                      <div key={label}>
                        <span className="text-[9px] text-slate-500 uppercase font-bold block">{label}</span>
                        <span className="font-mono font-bold text-white">{value}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-[10px] text-slate-500 font-mono">
                      REC YDS: {p.typicalAverages.recYds} · TD: {(p.typicalAverages.passTd + p.typicalAverages.rushTd + p.typicalAverages.recTd).toFixed(1)}
                    </span>
                    <Link
                      href="/"
                      className="inline-flex items-center space-x-1 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-xl text-xs transition-colors"
                    >
                      <Activity className="w-3.5 h-3.5" />
                      <span>Analyze Prop</span>
                    </Link>
                  </div>
                </div>
              ))}
        </div>
      </div>

      {/* Teams Selector */}
      <div className="space-y-4 pt-6 border-t border-slate-800">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-2">
          <Layers className="w-4 h-4 text-sky-400" />
          <span>{sport === "nfl" ? "All 32 NFL Franchises" : "All 30 NBA Franchises"}</span>
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-2.5">
          {filteredTeams.map((t) => (
            <button
              key={t.id}
              onClick={() => setSelectedTeam(selectedTeam === t.id ? null : t.id)}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                selectedTeam === t.id
                  ? "bg-indigo-500 text-slate-950 font-bold shadow-lg scale-[1.02]"
                  : "bg-slate-900 border-slate-800 hover:bg-slate-800 text-slate-300"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono font-black text-sm">{t.abbreviation}</span>
                <span className="text-[10px] opacity-75">{t.conference}</span>
              </div>
              <div className="text-xs truncate font-medium pt-1">{t.name}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
