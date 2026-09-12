import Link from "next/link";

export default function TermsPage() {
  return (
    <article className="mx-auto max-w-3xl space-y-8 rounded-3xl border border-slate-800 bg-slate-900 p-6 text-sm leading-relaxed text-slate-300 shadow-xl sm:p-10">
      <header className="space-y-2 border-b border-slate-800 pb-6">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-400">Beta terms</p>
        <h1 className="text-3xl font-black text-white">Analysis-only use</h1>
        <p className="text-xs text-slate-400">Last updated September 12, 2026</p>
      </header>
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-white">Purpose and eligibility</h2>
        <p>
          This invited beta is for adults 21 and older who want to compare manually entered player-prop prices with historical evidence. It is not a sportsbook, broker, betting service, financial product, or predictive model.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-white">No recommendations</h2>
        <p>
          Historical hit rates, uncertainty ranges, market prices, commissions, and hypothetical returns are descriptive calculations. They are not guarantees, recommendations, forecasts, or instructions to place a wager. You are responsible for complying with the laws and rules that apply to you.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-white">Beta limitations</h2>
        <p>
          Data may be synthetic or delayed, and the service may change or be unavailable. Do not rely on it for time-sensitive decisions. We may revoke invite access to protect the beta or investigate misuse.
        </p>
      </section>
      <footer className="border-t border-slate-800 pt-5 text-xs text-slate-400">
        For the data practices that apply to saved analyses, read <Link className="text-sky-400 hover:underline" href="/privacy">Privacy &amp; data retention</Link>.
      </footer>
    </article>
  );
}
