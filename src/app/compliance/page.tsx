"use client";

import { useState } from "react";
import {
  ShieldCheck,
  ShieldAlert,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Search,
  ExternalLink,
  PhoneCall,
} from "lucide-react";
import { GLOSSARY_TERMS, scanTextForCompliance, PROHIBITED_WORDS } from "@/lib/domain/glossary";

export default function CompliancePage() {
  const [testText, setTestText] = useState("");
  const [scanResult, setScanResult] = useState<{ isCompliant: boolean; flaggedWords: string[] } | null>(null);

  const handleScan = () => {
    if (!testText.trim()) {
      setScanResult(null);
      return;
    }
    const res = scanTextForCompliance(testText);
    setScanResult(res);
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-2xl border border-emerald-500/20">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-white">
                Analysis-Only Compliance &amp; Terminology Hub
              </h1>
              <p className="text-xs text-slate-400 pt-0.5">
                Statutory guardrails, California legal research resolution (Ticket #3), and CONTEXT.md glossary rules.
              </p>
            </div>
          </div>

          <a
            href="https://github.com/Etdev2/Edge_Cal/blob/main/docs/research/compliance-boundary.md"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 bg-slate-800 hover:bg-slate-700 px-3.5 py-2 rounded-xl border border-slate-700 transition-colors"
          >
            <span>Read Research Report</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* 4 Pillars of Compliance */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
            <div className="flex items-center space-x-1.5 text-emerald-400 font-bold text-xs">
              <CheckCircle2 className="w-4 h-4" />
              <span>0 Wagering Functions</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-tight">
              No bet placement, betslips, cashiers, or wallet balances.
            </p>
          </div>

          <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
            <div className="flex items-center space-x-1.5 text-emerald-400 font-bold text-xs">
              <CheckCircle2 className="w-4 h-4" />
              <span>0 Sportsbook Affiliates</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-tight">
              No affiliate codes, CPA bounties, or outcome revenue share.
            </p>
          </div>

          <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
            <div className="flex items-center space-x-1.5 text-emerald-400 font-bold text-xs">
              <CheckCircle2 className="w-4 h-4" />
              <span>Strict 21+ Age Gate</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-tight">
              Required age verification and local consent storage.
            </p>
          </div>

          <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
            <div className="flex items-center space-x-1.5 text-amber-400 font-bold text-xs">
              <ShieldAlert className="w-4 h-4" />
              <span>1-800-GAMBLER Link</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-tight">
              Neutral responsible gaming disclosures embedded sitewide.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Compliance Text Scanner */}
      <section id="prohibited" className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5 shadow-xl">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 bg-amber-500/10 text-amber-400 rounded-xl">
            <Search className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">
              Interactive Prohibited Language Audit Scanner
            </h2>
            <p className="text-xs text-slate-400">
              Test any copy against prohibited words (e.g. &quot;pick&quot;, &quot;lock&quot;, &quot;guaranteed&quot;, &quot;sure bet&quot;)
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <textarea
            rows={3}
            value={testText}
            onChange={(e) => setTestText(e.target.value)}
            placeholder="Type or paste draft UI text to audit (e.g. 'This historical calculation indicates an edge...')"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500 font-mono"
          />

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={handleScan}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs cursor-pointer shadow-md"
            >
              Run Compliance Audit
            </button>
            <div className="text-[11px] text-slate-400">
              Prohibited vocabulary items: {PROHIBITED_WORDS.length} terms
            </div>
          </div>

          {scanResult && (
            <div
              className={`p-4 rounded-xl border text-xs space-y-2 animate-in fade-in ${
                scanResult.isCompliant
                  ? "bg-emerald-950/20 border-emerald-500/30 text-emerald-300"
                  : "bg-rose-950/30 border-rose-500/40 text-rose-300"
              }`}
            >
              <div className="flex items-center space-x-2 font-bold">
                {scanResult.isCompliant ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Compliance Verified: 0 prohibited words detected.</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-4 h-4 text-rose-400" />
                    <span>
                      Compliance Violation: Flagged prohibited words:{" "}
                      <strong className="underline">{scanResult.flaggedWords.join(", ")}</strong>
                    </span>
                  </>
                )}
              </div>
              <p className="text-[11px] opacity-90">
                {scanResult.isCompliant
                  ? "Copy adheres strictly to CONTEXT.md descriptive standards."
                  : "Please rewrite using neutral glossary terms: replace 'pick/lock' with 'historical hit-rate comparison' or 'analysis'."}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Canonical CONTEXT.md Glossary */}
      <section id="glossary" className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-sky-400" />
              <span>Canonical CONTEXT.md Terminology Dictionary</span>
            </h2>
            <p className="text-xs text-slate-400">
              Mandatory domain terms and prohibited alternatives established in repo context
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {GLOSSARY_TERMS.map((item, idx) => (
            <div
              key={idx}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2.5 shadow-md"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-white text-sm">
                  {item.term}
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
                  Approved
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {item.definition}
              </p>

              <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-[11px]">
                <div className="text-rose-400">
                  <span className="text-slate-500 font-semibold mr-1">Avoid:</span>
                  <span className="line-through">{item.avoid.join(", ")}</span>
                </div>
                <span className="text-slate-500 text-[10px] italic">
                  {item.complianceNotes}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Responsible Gaming Box */}
      <div className="bg-amber-950/20 border border-amber-500/30 rounded-3xl p-6 sm:p-8 space-y-3">
        <div className="flex items-center space-x-2 text-amber-400 font-bold text-base">
          <ShieldAlert className="w-5 h-5" />
          <span>National Problem Gambling Helpline Network</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
          Edge Calculator is dedicated to neutral analytics and mathematical transparency. If gambling is causing problems in your life or the life of someone you care about, please reach out for free, confidential, 24/7 support.
        </p>
        <div className="pt-2 flex items-center space-x-3">
          <a
            href="tel:1-800-426-2537"
            className="inline-flex items-center space-x-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-4 py-2.5 rounded-xl text-xs transition-colors shadow-lg"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Call 1-800-GAMBLER (1-800-426-2537)</span>
          </a>
        </div>
      </div>
    </div>
  );
}
