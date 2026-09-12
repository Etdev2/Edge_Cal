"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, LockKeyhole, ShieldCheck } from "lucide-react";

export default function InvitePage() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      const response = await fetch("/api/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        setError(data.error || "That invite code is not valid.");
        return;
      }
      router.push("/");
    } catch {
      setError("Invite verification failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md items-center justify-center">
      <div className="w-full rounded-3xl border border-slate-800 bg-slate-900 p-7 shadow-2xl">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-xl border border-sky-500/20 bg-sky-500/10 p-3 text-sky-400">
            <LockKeyhole className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-black text-white">Invited beta access</h1>
            <p className="text-xs text-slate-400">Edge Calculator · 21+ analysis-only preview</p>
          </div>
        </div>
        <p className="mb-6 text-sm leading-relaxed text-slate-300">
          Enter the invite code supplied by the beta coordinator. Access is limited to invited testers while data quality and compliance controls are reviewed.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-xs font-bold text-slate-300">
            Invite code
            <input
              autoFocus
              required
              value={code}
              onChange={(event) => setCode(event.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 font-mono text-sm text-white outline-none focus:border-sky-500"
              placeholder="Enter your code"
            />
          </label>
          {error && <p className="text-xs text-rose-400">{error}</p>}
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-sky-500 px-4 py-3 text-sm font-bold text-slate-950 transition hover:bg-sky-400 disabled:opacity-60"
          >
            <span>{isSubmitting ? "Checking…" : "Continue to beta"}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>
        <div className="mt-6 flex items-start gap-2 border-t border-slate-800 pt-4 text-[11px] leading-relaxed text-slate-400">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
          <span>No identity documents, sportsbook credentials, or wagering history are collected.</span>
        </div>
      </div>
    </div>
  );
}
