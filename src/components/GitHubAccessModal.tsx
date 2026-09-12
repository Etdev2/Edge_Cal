"use client";

import { useState } from "react";
import { Key, ExternalLink, Copy, Check, Trophy, PartyPopper, GitPullRequest } from "lucide-react";
import { SaveOptionBPR } from "./SaveOptionBPR";

interface GitHubAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GitHubAccessModal({ isOpen, onClose }: GitHubAccessModalProps) {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const cloneCommands = `# 1. Clone your repository
git clone https://github.com/Etdev2/Edge_Cal.git
cd Edge_Cal

# 2. Link your Vercel Project
vercel link

# 3. Pull Environment Variables & Deploy
vercel env pull .env.production.local
vercel deploy --prod`;

  const tokenName = "Edge_Cal_Agent_Key";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-slate-100 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
              <Key className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100">GitHub Access Keys & Vercel Linking</h2>
              <p className="text-xs text-slate-400">Repository: <code className="text-emerald-400">Etdev2/Edge_Cal</code></p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 text-sm font-semibold px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700"
          >
            Close
          </button>
        </div>

        {/* Winner banner for Option B */}
        <div className="mb-5 rounded-xl border border-emerald-500/30 bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-sky-500/10 p-4 flex items-start gap-3">
          <div className="p-2 rounded-lg bg-emerald-500/15 border border-emerald-500/30 shrink-0">
            <Trophy className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-sm">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-white">Option B it is — great pick!</span>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                <PartyPopper className="w-3 h-3" /> now the default
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              <strong className="text-white">Option B: Classic token + one-click PR save.</strong> Paste
              a token below and we&apos;ll create a feature branch, commit a save file, and open a pull
              request on <code className="text-emerald-300">Etdev2/Edge_Cal</code> — so what you&apos;ve
              got in the sandbox is saved on GitHub.
            </p>
          </div>
        </div>

        <div className="space-y-5 text-sm">
          {/* OPTION B — hero */}
          <div className="rounded-xl border border-emerald-500/40 bg-slate-800/40 p-4 space-y-3 relative overflow-hidden">
            <div className="absolute top-3 right-3 text-[10px] font-black tracking-widest uppercase px-2 py-1 rounded bg-emerald-500 text-slate-950 flex items-center gap-1">
              <GitPullRequest className="w-3 h-3" /> Option B • Selected
            </div>
            <div className="flex items-center gap-2 pr-32">
              <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold text-xs">B</span>
              <h3 className="font-semibold text-slate-100">Save what you&apos;ve got as a PR</h3>
            </div>
            <SaveOptionBPR />
          </div>

          {/* OPTION A — reference (not winner anymore) */}
          <div className="bg-slate-800/30 rounded-xl p-4 border border-slate-700/60 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-6 h-6 rounded-full bg-slate-700 text-slate-300 flex items-center justify-center font-bold text-xs">A</span>
                <h3 className="font-semibold text-slate-300">Option A: Fine-Grained Token (reference)</h3>
              </div>
              <a
                href="https://github.com/settings/personal-access-tokens/new"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1.5 text-xs text-slate-300 hover:text-white font-semibold bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700"
              >
                <span>Token generator</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Still good, but Option B above is now your pick. If you ever want scoped-only access, name
              it below and scope to <strong className="text-slate-200">Only select repositories → Etdev2/Edge_Cal</strong>:
            </p>

            <div className="bg-slate-900 rounded-lg p-3 text-xs font-mono space-y-2 border border-slate-700/50">
              <div className="flex justify-between items-center text-slate-300 gap-2">
                <span className="text-slate-400">Token name (copy):</span>
                <button
                  onClick={() => copyToClipboard(tokenName, "token-name")}
                  className="inline-flex items-center gap-1.5 text-slate-200 font-semibold bg-slate-800 hover:bg-slate-700 px-2 py-1 rounded-lg border border-slate-700"
                >
                  <span>{tokenName}</span>
                  {copiedSection === "token-name" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <ul className="list-none space-y-1.5 text-slate-300 font-sans pt-1 text-[11px]">
                {[
                  ["Contents", "Read and write"],
                  ["Issues", "Read and write"],
                  ["Pull requests", "Read and write"],
                  ["Workflows", "Read and write"],
                ].map(([perm, level]) => (
                  <li key={perm} className="flex items-center justify-between bg-slate-800/60 px-2.5 py-1.5 rounded-lg border border-slate-700/50">
                    <strong className="text-slate-200">{perm}</strong>
                    <span className="text-slate-400 font-bold">{level}</span>
                  </li>
                ))}
              </ul>
            </div>

            <a
              href="https://github.com/settings/tokens/new"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[11px] text-sky-400 hover:text-sky-300 font-semibold"
            >
              <span>Or use a Classic token (repo scope) — works for Option B too</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Vercel Linking */}
          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/60 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">2</span>
                <h3 className="font-semibold text-slate-200">Connect to Vercel for Live Preview</h3>
              </div>
              <a
                href="https://vercel.com/new"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-semibold bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/30"
              >
                <span>Import on Vercel</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              After you merge your Option B PR, Vercel deploys every commit to <code className="text-emerald-400">main</code>. Or deploy via CLI:
            </p>

            <div className="relative">
              <pre className="bg-slate-950 rounded-lg p-3 text-xs font-mono text-emerald-300 overflow-x-auto border border-slate-800 whitespace-pre-wrap">
                {cloneCommands}
              </pre>
              <button
                onClick={() => copyToClipboard(cloneCommands, "clone")}
                className="absolute top-2.5 right-2.5 p-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                title="Copy commands"
              >
                {copiedSection === "clone" ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-800 flex flex-col sm:flex-row gap-2 sm:justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-sm transition-colors"
          >
            Got it, Let&apos;s Build with B!
          </button>
        </div>
      </div>
    </div>
  );
}
