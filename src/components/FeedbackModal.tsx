"use client";

import { useState } from "react";
import { MessageSquarePlus, Send, CheckCircle2, AlertCircle } from "lucide-react";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  snapshotId?: string;
}

export function FeedbackModal({ isOpen, onClose, snapshotId }: FeedbackModalProps) {
  const [category, setCategory] = useState<"general" | "bug" | "data_correction" | "feature">("general");
  const [message, setMessage] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category,
          message,
          userEmail,
          snapshotId,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setIsSuccess(true);
        setTimeout(() => {
          setIsSuccess(false);
          setMessage("");
          onClose();
        }, 1800);
      } else {
        setErrorMessage(data.error || "Failed to submit feedback");
      }
    } catch (err) {
      setErrorMessage("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-slate-100">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl">
              <MessageSquarePlus className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-100 text-base">Beta Feedback & Corrections</h3>
          </div>
          <button onClick={onClose} className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800">
            Cancel
          </button>
        </div>

        {isSuccess ? (
          <div className="py-8 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
            <h4 className="font-bold text-slate-100 text-lg">Thank You!</h4>
            <p className="text-xs text-slate-400">Your feedback has been logged to the Wayfinder tracker.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMessage && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-xl flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Feedback Type</label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { id: "general", label: "General Feedback" },
                  { id: "data_correction", label: "Stat / Box Score Issue" },
                  { id: "bug", label: "App Bug" },
                  { id: "feature", label: "Feature Request" },
                ].map((t) => (
                  <button
                    type="button"
                    key={t.id}
                    onClick={() => setCategory(t.id as any)}
                    className={`p-2.5 rounded-xl border text-left font-medium transition-colors ${
                      category === t.id
                        ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400"
                        : "bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Your Feedback or Stat Report</label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="e.g. In the game vs MIN on Nov 12, player played 14 mins due to injury..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Email (Optional, for follow-up)</label>
              <input
                type="email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                placeholder="tester@example.com"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !message.trim()}
              className="w-full py-2.5 px-4 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? "Submitting..." : "Send Feedback"}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
