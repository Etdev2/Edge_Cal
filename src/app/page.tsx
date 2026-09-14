import Link from "next/link";
import {
  Activity,
  Compass,
  Bot,
  ShieldCheck,
  Zap,
  TrendingUp,
  BarChart3,
  CheckCircle2,
  Lock,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { CalculatorStepper } from "@/components/CalculatorStepper";

export default function HomePage() {
  return (
    <div className="space-y-10">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 p-6 sm:p-10 shadow-2xl">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            <span>Wayfinder V1 Beta Build · Next.js App Router Monorepo</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            NBA + NFL Player-Prop <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-sky-400 via-indigo-300 to-amber-300 bg-clip-text text-transparent">
              Historical Evidence Comparator
            </span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
            Compare manually entered NBA and NFL player-prop prices with historical box scores, 95%
            Wilson Score uncertainty intervals, push-settled evidence, and bankroll-based stake
            sizing (EV + fractional Kelly) — in under 30 seconds.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2 text-xs">
            <div className="flex items-center space-x-1.5 text-slate-300 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700/60">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Analysis-Only (21+)</span>
            </div>
            <div className="flex items-center space-x-1.5 text-slate-300 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700/60">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>🏀 NBA + 🏈 NFL Props</span>
            </div>
            <div className="flex items-center space-x-1.5 text-slate-300 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700/60">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Wilson Score 95% Range</span>
            </div>
            <div className="flex items-center space-x-1.5 text-slate-300 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700/60">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Bankroll · EV · Kelly Sizing</span>
            </div>
            <div className="flex items-center space-x-1.5 text-slate-300 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700/60">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>DNP &amp; Low-Minute Auditing</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Interactive 30-Second Analysis Stepper */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
              <Activity className="w-5 h-5 text-sky-400" />
              <span>Interactive Player-Prop Analysis</span>
            </h2>
            <p className="text-xs text-slate-400">
              Select player, market line, American odds, and evidence window
            </p>
          </div>
        </div>

        <CalculatorStepper />
      </section>

      {/* Wayfinder & Expert Agents Status Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        {/* Wayfinder Map Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 bg-sky-500/10 text-sky-400 rounded-xl">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-100 text-sm">Wayfinder Master Map</h3>
                <p className="text-[11px] text-slate-400">10 Decision Tickets Synced</p>
              </div>
            </div>
            <Link
              href="/wayfinder"
              className="inline-flex items-center space-x-1 text-xs font-bold text-sky-400 hover:text-sky-300 bg-sky-500/10 px-2.5 py-1 rounded-lg border border-sky-500/20"
            >
              <span>Explore Map</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            The canonical Wayfinder roadmap tracks all architectural decisions, compliance boundaries, licensed data source contracts, and beta rollout criteria.
          </p>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-slate-300 font-semibold">#2 BALLDONTLIE Data Validation</span>
              <span className="text-emerald-400 font-mono font-bold text-[10px] bg-emerald-500/10 px-2 py-0.5 rounded">RESOLVED</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-slate-300 font-semibold">#3 Analysis-Only Compliance Boundary</span>
              <span className="text-emerald-400 font-mono font-bold text-[10px] bg-emerald-500/10 px-2 py-0.5 rounded">RESOLVED</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-slate-300 font-semibold">#4 Calculation &amp; Result Contract</span>
              <span className="text-emerald-400 font-mono font-bold text-[10px] bg-emerald-500/10 px-2 py-0.5 rounded">IMPLEMENTED</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-slate-300 font-semibold">#5 30-Second Mobile Analysis UX</span>
              <span className="text-emerald-400 font-mono font-bold text-[10px] bg-emerald-500/10 px-2 py-0.5 rounded">IMPLEMENTED</span>
            </div>
          </div>
        </div>

        {/* Expert Agent Swarm Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 bg-purple-500/10 text-purple-400 rounded-xl">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-100 text-sm">Expert Agent Swarm</h3>
                <p className="text-[11px] text-slate-400">6 Specialized Agents Assembled</p>
              </div>
            </div>
            <Link
              href="/agents"
              className="inline-flex items-center space-x-1 text-xs font-bold text-purple-400 hover:text-purple-300 bg-purple-500/10 px-2.5 py-1 rounded-lg border border-purple-500/20"
            >
              <span>View Roster</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            A specialized squad running parallel tasks across probability quant algorithms, NBA data ops, mobile UX ergonomics, legal compliance, and cloud deployment.
          </p>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="font-bold text-slate-200 flex items-center space-x-1.5">
                <span>📐 OddsQuant</span>
              </div>
              <p className="text-[10px] text-slate-400">Break-even &amp; Wilson Score 95%</p>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="font-bold text-slate-200 flex items-center space-x-1.5">
                <span>🏀 DataOps</span>
              </div>
              <p className="text-[10px] text-slate-400">BALLDONTLIE API &amp; Drizzle ORM</p>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="font-bold text-slate-200 flex items-center space-x-1.5">
                <span>📱 MobileUX</span>
              </div>
              <p className="text-[10px] text-slate-400">30s Mobile Stepper &amp; PWA</p>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="font-bold text-slate-200 flex items-center space-x-1.5">
                <span>🛡️ ComplianceGuard</span>
              </div>
              <p className="text-[10px] text-slate-400">Analysis-Only 21+ &amp; Glossary</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
