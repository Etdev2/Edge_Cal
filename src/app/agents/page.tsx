"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Bot,
  Sparkles,
  CheckCircle2,
  Cpu,
  Layers,
  ArrowRight,
  Terminal,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { EXPERT_AGENTS_TEAM, ExpertAgent } from "@/app/api/agents/route";

export default function AgentsPage() {
  const [agents] = useState<ExpertAgent[]>(EXPERT_AGENTS_TEAM);
  const [activeAgent, setActiveAgent] = useState<ExpertAgent>(EXPERT_AGENTS_TEAM[0]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-purple-500/10 text-purple-400 rounded-2xl border border-purple-500/20">
              <Bot className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl sm:text-2xl font-black text-white">
                  Expert Agent Team &amp; Skill Matrix
                </h1>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Parallel Execution Ready
                </span>
              </div>
              <p className="text-xs text-slate-400 pt-0.5">
                Specialized squad assembled to deliver the Edge Calculator V1 specification and architecture.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-xs">
            <span className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>All 6 Agents Synchronized</span>
            </span>
          </div>
        </div>

        {/* Swarm Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400">Total Hired Agents</span>
            <div className="text-xl font-black text-white font-mono">6 Agents</div>
          </div>
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
            <span className="text-[10px] uppercase font-bold text-sky-400">Parallel Execution</span>
            <div className="text-xl font-black text-sky-400 font-mono">Full Concurrency</div>
          </div>
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
            <span className="text-[10px] uppercase font-bold text-emerald-400">Tickets Resolved</span>
            <div className="text-xl font-black text-emerald-400 font-mono">10 / 10</div>
          </div>
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
            <span className="text-[10px] uppercase font-bold text-amber-400">Compliance Rate</span>
            <div className="text-xl font-black text-amber-400 font-mono">100% Guarded</div>
          </div>
        </div>
      </div>

      {/* Agents Roster Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {agents.map((agent) => {
          const isSelected = activeAgent.id === agent.id;

          return (
            <div
              key={agent.id}
              onClick={() => setActiveAgent(agent)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
                isSelected
                  ? "bg-slate-900 border-purple-500/60 shadow-xl ring-1 ring-purple-500/30"
                  : "bg-slate-900/80 border-slate-800 hover:border-slate-700"
              }`}
            >
              {/* Top info */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <span className="text-2xl p-2 rounded-xl bg-slate-950 border border-slate-800">
                      {agent.avatar}
                    </span>
                    <div>
                      <h3 className="font-bold text-slate-100 text-sm">
                        {agent.name}
                      </h3>
                      <span className="text-[10px] font-mono text-purple-400">
                        {agent.callsign}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    READY
                  </span>
                </div>

                <div className="text-xs font-semibold text-slate-300">
                  {agent.role}
                </div>

                {/* Skills Preview */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Specialized Skills</span>
                  <ul className="space-y-1 text-xs text-slate-300">
                    {agent.skills.slice(0, 3).map((skill, idx) => (
                      <li key={idx} className="flex items-start space-x-1.5 text-[11px]">
                        <span className="text-sky-400 font-bold">•</span>
                        <span>{skill}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Bottom Assigned Tickets */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400 text-[11px]">
                  Assigned: {agent.assignedTickets.map((t) => `#${t}`).join(", ")}
                </span>
                <span className="text-xs font-bold text-purple-400 flex items-center space-x-1">
                  <span>View Details</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Agent Deep Dive */}
      {activeAgent && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div className="flex items-center space-x-3">
              <span className="text-3xl p-3 rounded-2xl bg-slate-950 border border-slate-800">
                {activeAgent.avatar}
              </span>
              <div>
                <h2 className="text-xl font-bold text-white">{activeAgent.name}</h2>
                <p className="text-xs text-slate-400">{activeAgent.role} · <code className="text-purple-400">{activeAgent.callsign}</code></p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 rounded-xl bg-purple-500/10 text-purple-300 text-xs font-bold border border-purple-500/20">
                Assigned Wayfinder Tickets: {activeAgent.assignedTickets.map((t) => `#${t}`).join(", ")}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Complete Skill Set */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Expert Skill Set &amp; Technical Capabilities
              </h3>
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                {activeAgent.skills.map((skill, idx) => (
                  <div key={idx} className="flex items-start space-x-2 text-xs text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>{skill}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Core Responsibilities & Latest Output */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Core Responsibilities &amp; Active Deliverables
              </h3>
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3 text-xs">
                <div className="space-y-2">
                  {activeAgent.responsibilities.map((resp, idx) => (
                    <div key={idx} className="flex items-start space-x-2 text-slate-300">
                      <span className="text-purple-400 font-bold">→</span>
                      <span>{resp}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                    Recent Verified Agent Trace:
                  </span>
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-emerald-300 font-mono text-[11px]">
                    {activeAgent.recentOutput}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
