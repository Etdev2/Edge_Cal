"use client";

/* eslint-disable react-hooks/set-state-in-effect -- age gate hydration reads localStorage post-mount, intentional client-only pattern */
import { useState, useEffect } from "react";
import { ShieldAlert, CheckCircle2 } from "lucide-react";

export function AgeGateModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasConfirmed, setHasConfirmed] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("edge_cal_age_confirmed");
    if (saved !== "true") {
      setIsOpen(true);
    } else {
      setHasConfirmed(true);
      void fetch("/api/age-gate", { method: "POST" });
    }
  }, []);

  const handleConfirm = async () => {
    localStorage.setItem("edge_cal_age_confirmed", "true");
    await fetch("/api/age-gate", { method: "POST" });
    setHasConfirmed(true);
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-slate-100">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-100">21+ Age & Purpose Gate</h2>
            <p className="text-xs text-slate-400">Analysis-Only Beta Verification</p>
          </div>
        </div>

        <div className="space-y-3 text-sm text-slate-300 leading-relaxed mb-6">
          <p>
            Welcome to <strong className="text-white">Edge Calculator</strong>, an invited research and historical decision-support application.
          </p>
          <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-700/50 space-y-2 text-xs text-slate-300">
            <div className="flex items-start space-x-2">
              <span className="text-emerald-400 font-bold">✓</span>
              <span><strong>Analysis-Only:</strong> We do not place, accept, or route wagers. No sportsbook accounts or bet-slips are linked.</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-emerald-400 font-bold">✓</span>
              <span><strong>Descriptive Evidence:</strong> Hit rates and hit-rate gaps describe past completed games and are not forecasts.</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-emerald-400 font-bold">✓</span>
              <span><strong>Age Restriction:</strong> You must be 21 years of age or older to enter this beta.</span>
            </div>
          </div>
          <p className="text-xs text-slate-400">
            If you or someone you know has a gambling problem, crisis counseling and referral services can be accessed by calling <strong className="text-amber-400">1-800-GAMBLER</strong> (1-800-426-2537).
          </p>
        </div>

        <button
          onClick={handleConfirm}
          className="w-full py-3 px-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-bold rounded-xl shadow-lg shadow-orange-500/20 transition-all flex items-center justify-center space-x-2 cursor-pointer"
        >
          <CheckCircle2 className="w-5 h-5" />
          <span>I am 21+ and Agree to Enter</span>
        </button>
      </div>
    </div>
  );
}
