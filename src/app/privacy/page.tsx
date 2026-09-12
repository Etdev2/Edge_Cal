import Link from "next/link";

export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-3xl space-y-8 rounded-3xl border border-slate-800 bg-slate-900 p-6 text-sm leading-relaxed text-slate-300 shadow-xl sm:p-10">
      <header className="space-y-2 border-b border-slate-800 pb-6">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-400">Beta disclosure</p>
        <h1 className="text-3xl font-black text-white">Privacy &amp; data retention</h1>
        <p className="text-xs text-slate-400">Last updated September 12, 2026</p>
      </header>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-white">What the beta stores</h2>
        <p>
          Edge Calculator is an analysis-only research beta. It does not request identity documents, precise location, sportsbook credentials, payment details, or wagering history. A server-side age-confirmation cookie and, when enabled, an invite cookie are used to protect access; they are not used for advertising profiles.
        </p>
        <p>
          When a tester saves an analysis, the app may store the selected player, market, line, price, historical evidence, source, and timestamp as an immutable snapshot. The snapshot does not represent a forecast or a wagering instruction.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-white">Retention and correction</h2>
        <p>
          Snapshots are retained for beta reproducibility and quality review. Do not enter sensitive personal information into feedback fields. To request deletion or correction of a snapshot or feedback submission, use the contact method provided by your beta coordinator and include the snapshot identifier only.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-white">Data sources</h2>
        <p>
          Historical game records are labeled with their source and fetch time. Demo mode uses synthetic records and is clearly labeled. We do not sell personal information or use snapshots to make decisions about a person.
        </p>
      </section>

      <footer className="border-t border-slate-800 pt-5 text-xs text-slate-400">
        This disclosure is a beta product notice, not legal advice. See the <Link className="text-sky-400 hover:underline" href="/terms">terms and analysis-only boundary</Link> before using the calculator.
      </footer>
    </article>
  );
}
