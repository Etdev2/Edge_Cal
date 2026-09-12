import Link from "next/link";
import { ShieldAlert, Compass, Bot, HeartHandshake, PhoneCall } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800/80 text-slate-400 py-10 px-4 sm:px-6 lg:px-8 text-xs">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1 */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-lg bg-sky-600 text-white flex items-center justify-center font-bold text-xs">
                E
              </div>
              <span className="font-bold text-slate-200 text-sm">Edge Calculator</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Mobile-first NBA player prop historical evidence comparator. Developed for the invited beta research project.
            </p>
            <div className="flex items-center space-x-2 text-[10px] text-slate-500 font-mono">
              <span>Repo: Etdev2/Edge_Cal</span>
              <span>•</span>
              <span>Next.js App Router</span>
            </div>
          </div>

          {/* Col 2 */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-200 text-xs tracking-wider uppercase">Project Navigation</h4>
            <ul className="space-y-1.5 text-slate-400">
              <li>
                <Link href="/" className="hover:text-sky-400 transition-colors">
                  30-Second Rapid Calculator
                </Link>
              </li>
              <li>
                <Link href="/wayfinder" className="hover:text-sky-400 transition-colors">
                  Wayfinder Map (10 Tickets)
                </Link>
              </li>
              <li>
                <Link href="/agents" className="hover:text-sky-400 transition-colors">
                  Agent Swarm Roster
                </Link>
              </li>
              <li>
                <Link href="/explorer" className="hover:text-sky-400 transition-colors">
                  NBA Evidence Explorer
                </Link>
              </li>
              <li>
                <Link href="/snapshots" className="hover:text-sky-400 transition-colors">
                  Saved Snapshots
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3 */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-200 text-xs tracking-wider uppercase">Compliance & Rules</h4>
            <ul className="space-y-1.5 text-slate-400">
              <li>
                <Link href="/compliance" className="hover:text-sky-400 transition-colors">
                  Analysis-Only Boundary
                </Link>
              </li>
              <li>
                <Link href="/compliance#glossary" className="hover:text-sky-400 transition-colors">
                  Canonical CONTEXT.md Glossary
                </Link>
              </li>
              <li>
                <Link href="/compliance#prohibited" className="hover:text-sky-400 transition-colors">
                  Prohibited Language Scanner
                </Link>
              </li>
              <li>
                <Link href="/compliance#california" className="hover:text-sky-400 transition-colors">
                  California Legal Review (Ticket #3)
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4 */}
          <div className="space-y-3 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
            <div className="flex items-center space-x-2 text-amber-400 font-bold">
              <ShieldAlert className="w-4 h-4" />
              <span>Responsible Gaming</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              If gambling is no longer fun, support is available 24/7. Confidential help:
            </p>
            <a
              href="tel:1-800-426-2537"
              className="inline-flex items-center space-x-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 px-3 py-2 rounded-lg border border-amber-500/30 font-bold text-xs transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Call 1-800-GAMBLER</span>
            </a>
          </div>
        </div>

        {/* Legal Disclaimer Box */}
        <div className="pt-6 border-t border-slate-900 text-[11px] text-slate-500 space-y-2">
          <p>
            <strong>Disclaimer:</strong> Edge Calculator is an analytics and decision-support tool. It does not accept, place, or facilitate bets. Historical hit rates and mathematical scenarios reflect past completed games and do not guarantee or predict future athletic performance.
          </p>
          <div className="flex flex-wrap justify-between items-center text-[10px] text-slate-600 gap-2">
            <span>© 2026 Edge Calculator Beta. Analysis-Only 21+ Platform.</span>
            <span>Licensed Data: BALLDONTLIE NBA API · Server-side Cached</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
