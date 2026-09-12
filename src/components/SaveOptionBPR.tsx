"use client";

import { useState } from "react";
import { GitPullRequest, Loader2, CheckCircle2, AlertCircle, ExternalLink, KeyRound } from "lucide-react";

export function SaveOptionBPR() {
  const [token, setToken] = useState("");
  const [repoInput, setRepoInput] = useState("Etdev2/Edge_Cal");
  const [prTitle, setPrTitle] = useState("Option B: Save Edge Calculator progress");
  const [notes, setNotes] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ prUrl: string; prNumber: number; branch: string; filePath: string } | null>(null);

  const handleCreatePR = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);

    const trimmedToken = token.trim();
    if (trimmedToken.length < 10) {
      setError("Paste your GitHub token first (it stays in this request only — never stored).");
      return;
    }

    const [owner, repo] = repoInput.split("/").map((s) => s.trim());
    if (!owner || !repo) {
      setError("Repository must look like Etdev2/Edge_Cal.");
      return;
    }

    setIsCreating(true);
    try {
      const res = await fetch("/api/github/create-pr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: trimmedToken,
          owner,
          repo,
          title: prTitle,
          notes,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setResult({
          prUrl: data.prUrl,
          prNumber: data.prNumber,
          branch: data.branch,
          filePath: data.filePath,
        });
        // Clear token from memory after success for safety
        setToken("");
      } else {
        setError(data.error || "Could not create the PR. Check the token and repo access.");
      }
    } catch {
      setError("Network error while creating the PR. Try again.");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 space-y-4">
      <div className="flex items-center gap-2">
        <div className="p-2 rounded-lg bg-emerald-500/15 border border-emerald-500/30">
          <GitPullRequest className="w-4 h-4 text-emerald-400" />
        </div>
        <div>
          <h4 className="font-bold text-slate-100 text-sm">Option B — One-click save as PR</h4>
          <p className="text-[11px] text-slate-400">
            Creates a feature branch + save file + pull request on your GitHub. Token is used once, never stored.
          </p>
        </div>
      </div>

      {result ? (
        <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 space-y-2 text-sm">
          <div className="flex items-center gap-2 font-bold text-emerald-300">
            <CheckCircle2 className="w-5 h-5" />
            <span>PR #{result.prNumber} created!</span>
          </div>
          <p className="text-xs text-slate-300">
            Branch <code className="text-emerald-300">{result.branch}</code> with{" "}
            <code className="text-emerald-300">{result.filePath}</code>
          </p>
          <a
            href={result.prUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs"
          >
            <span>Review & merge on GitHub</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <div>
            <button
              onClick={() => setResult(null)}
              className="text-[11px] text-slate-400 hover:text-slate-200 underline"
            >
              Create another Option B save
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleCreatePR} className="space-y-3">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              GitHub token (Option B)
            </label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
              <input
                type="password"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="ghp_... or github_pat_..."
                autoComplete="off"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>
            <p className="text-[11px] text-slate-500 pt-1 leading-relaxed">
              Needs <strong className="text-slate-300">Contents: Read and write</strong> +{" "}
              <strong className="text-slate-300">Pull requests: Read and write</strong> on{" "}
              <code className="text-sky-300">Etdev2/Edge_Cal</code>. Use{" "}
              <a
                href="https://github.com/settings/tokens/new"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sky-400 underline"
              >
                Classic token (repo scope)
              </a>{" "}
              or a fine-grained token — either works for Option B.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Repository</label>
              <input
                type="text"
                value={repoInput}
                onChange={(e) => setRepoInput(e.target.value)}
                placeholder="Etdev2/Edge_Cal"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">PR title</label>
              <input
                type="text"
                value={prTitle}
                onChange={(e) => setPrTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Notes to include in the PR (optional)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Saving my Option B progress from the sandbox — please review."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <button
            type="submit"
            disabled={isCreating}
            className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            {isCreating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Creating branch + PR…</span>
              </>
            ) : (
              <>
                <GitPullRequest className="w-4 h-4" />
                <span>Create PR for Option B</span>
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
