"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Compass,
  CheckCircle2,
  Clock,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  GitBranch,
  Layers,
  Sparkles,
  Bot,
  Filter,
  Check,
} from "lucide-react";
import { WAYFINDER_TICKETS, WayfinderTicketData } from "@/app/api/wayfinder/route";

export default function WayfinderPage() {
  const [tickets, setTickets] = useState<WayfinderTicketData[]>(WAYFINDER_TICKETS);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedTicket, setSelectedTicket] = useState<WayfinderTicketData | null>(WAYFINDER_TICKETS[0]);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const categories = [
    { id: "all", label: "All Tickets" },
    { id: "specification", label: "Specifications" },
    { id: "research", label: "Research Artifacts" },
    { id: "ux", label: "UX & Mobile" },
    { id: "compliance", label: "Compliance & Legal" },
    { id: "operations", label: "Data & Ops" },
  ];

  const filteredTickets = tickets.filter((t) => {
    if (selectedCategory !== "all" && t.category !== selectedCategory) return false;
    if (statusFilter === "closed" && t.state !== "closed" && t.state !== "implemented") return false;
    if (statusFilter === "open" && t.state !== "open" && t.state !== "in_progress") return false;
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Wayfinder Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-sky-500/10 text-sky-400 rounded-2xl border border-sky-500/20">
              <Compass className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl sm:text-2xl font-black text-white">
                  Wayfinder: Navigation &amp; Ticket Dashboard
                </h1>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30">
                  Etdev2/Edge_Cal
                </span>
              </div>
              <p className="text-xs text-slate-400 pt-0.5">
                Authoritative dependency graph, decision specifications, and tracer-bullet execution plan.
              </p>
            </div>
          </div>

          <a
            href="https://github.com/Etdev2/Edge_Cal/issues/1"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-1.5 text-xs font-bold text-sky-400 hover:text-sky-300 bg-slate-800 hover:bg-slate-700 px-3.5 py-2 rounded-xl border border-slate-700 transition-colors"
          >
            <span>View on GitHub</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Progress Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400">Total Tickets</span>
            <div className="text-xl font-black text-white font-mono">10</div>
          </div>
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
            <span className="text-[10px] uppercase font-bold text-emerald-400">Resolved / Implemented</span>
            <div className="text-xl font-black text-emerald-400 font-mono">10 / 10</div>
          </div>
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
            <span className="text-[10px] uppercase font-bold text-purple-400">Expert Agents</span>
            <div className="text-xl font-black text-purple-400 font-mono">6 Active</div>
          </div>
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
            <span className="text-[10px] uppercase font-bold text-amber-400">Tracer Bullet Build</span>
            <div className="text-xl font-black text-amber-400 font-mono">V1 Pass</div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2">
        <div className="flex flex-wrap gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? "bg-sky-500 text-slate-950 font-bold shadow-md"
                  : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Ticket List + Ticket Detail Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col: Tickets List */}
        <div className="lg:col-span-5 space-y-2.5 max-h-[750px] overflow-y-auto pr-1">
          {filteredTickets.map((t) => {
            const isSelected = selectedTicket?.id === t.id;
            const isDone = t.state === "closed" || t.state === "implemented";

            return (
              <button
                type="button"
                key={t.id}
                onClick={() => setSelectedTicket(t)}
                className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                  isSelected
                    ? "bg-slate-800/90 border-sky-500/50 shadow-lg ring-1 ring-sky-500/30"
                    : "bg-slate-900 border-slate-800 hover:bg-slate-850 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold text-sky-400">
                      #{t.id}
                    </span>
                    <span className="text-[10px] uppercase px-2 py-0.5 rounded font-bold bg-slate-950 text-slate-400 border border-slate-800">
                      {t.category}
                    </span>
                  </div>
                  {isDone ? (
                    <span className="inline-flex items-center space-x-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      <Check className="w-3 h-3" />
                      <span>{t.state === "closed" ? "RESOLVED" : "IMPLEMENTED"}</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center space-x-1 text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                      <Clock className="w-3 h-3" />
                      <span>IN PROGRESS</span>
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-slate-100 text-xs sm:text-sm leading-snug">
                  {t.title}
                </h3>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <span className="flex items-center space-x-1">
                    <Bot className="w-3 h-3 text-purple-400" />
                    <span className="truncate">{t.assignedAgent}</span>
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Col: Deep Dive Ticket Details */}
        <div className="lg:col-span-7">
          {selectedTicket ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6 sticky top-20">
              {/* Header */}
              <div className="pb-4 border-b border-slate-800 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-mono font-bold text-sky-400">
                      Ticket #{selectedTicket.id}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {selectedTicket.category}
                    </span>
                  </div>
                  <a
                    href={`https://github.com/Etdev2/Edge_Cal/issues/${selectedTicket.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-sky-400 hover:text-sky-300 flex items-center space-x-1 font-semibold"
                  >
                    <span>Open GitHub Issue #{selectedTicket.id}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <h2 className="text-lg sm:text-xl font-bold text-white">
                  {selectedTicket.title}
                </h2>

                <div className="flex items-center space-x-2 text-xs text-slate-400">
                  <span className="text-slate-500">Assigned:</span>
                  <span className="text-purple-300 font-bold">{selectedTicket.assignedAgent}</span>
                  <span className="text-slate-600">·</span>
                  <span className="text-slate-400">{selectedTicket.agentRole}</span>
                </div>
              </div>

              {/* Core Question from Ticket */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  The Decision Question
                </h4>
                <div className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800/80 text-xs text-slate-200 leading-relaxed italic">
                  &ldquo;{selectedTicket.question}&rdquo;
                </div>
              </div>

              {/* Resolution & Implementation Contract */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  Resolution &amp; Built Contract
                </h4>
                <div className="p-3.5 bg-emerald-950/20 border border-emerald-500/30 rounded-xl text-xs text-emerald-200 leading-relaxed">
                  {selectedTicket.resolutionSummary}
                </div>
              </div>

              {/* Acceptance Criteria */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Acceptance Criteria Verified
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {selectedTicket.acceptanceCriteria.map((crit, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span>{crit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Dependency Graph Links */}
              <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center space-x-2 text-slate-400">
                  <GitBranch className="w-4 h-4 text-sky-400" />
                  <span>
                    Blocked by: {selectedTicket.blockedBy.length > 0 ? selectedTicket.blockedBy.map((b) => `#${b}`).join(", ") : "None (Root)"}
                  </span>
                </div>

                <Link
                  href="/"
                  className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-slate-950 font-bold rounded-xl text-xs flex items-center space-x-1.5 shadow-md"
                >
                  <span>Test in Interactive App</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="p-8 bg-slate-900 border border-slate-800 rounded-2xl text-center text-xs text-slate-400">
              Select a ticket to view full specification and resolution details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
