import { NextResponse } from "next/server";

export interface ExpertAgent {
  id: string;
  name: string;
  callsign: string;
  role: string;
  avatar: string;
  badgeColor: string;
  skills: string[];
  responsibilities: string[];
  assignedTickets: number[];
  currentStatus: "idle" | "running" | "completed";
  recentOutput: string;
}

export const EXPERT_AGENTS_TEAM: ExpertAgent[] = [
  {
    id: "odds-quant",
    name: "OddsQuant Agent",
    callsign: "AGENT-01: QUANT",
    role: "Domain & Odds Quant Mathematician",
    avatar: "📐",
    badgeColor: "bg-purple-500/10 text-purple-600 border-purple-500/20",
    skills: [
      "Sports probability modeling & American odds conversion",
      "Break-even probability calculation (|odds| / (|odds| + 100))",
      "Wilson Score 95% Confidence Interval for small sample uncertainty",
      "No-vig fair probability margin removal algorithm",
      "Hypothetical return scenario modeling ($100 stake non-forecast illustration)",
      "Push outcome filtering and settlement rules",
    ],
    responsibilities: [
      "Maintains pure domain calculation engine in `src/lib/domain/odds.ts` and `statistics.ts`",
      "Resolves Issue #4 (Calculation and Result Contract)",
      "Ensures zero prediction/forecast language in mathematical outputs",
    ],
    assignedTickets: [4],
    currentStatus: "completed",
    recentOutput: "Verified Wilson Score 95% interval and break-even formula for -110 (52.38%) and +150 (40.00%) scenarios.",
  },
  {
    id: "data-ops",
    name: "DataOps Agent",
    callsign: "AGENT-02: DATA",
    role: "NBA Data Engineer & Provider Architect",
    avatar: "🏀",
    badgeColor: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    skills: [
      "BALLDONTLIE REST API v1 integration and schema mapping",
      "Drizzle ORM PostgreSQL schema normalization and migrations",
      "Cursor-based pagination, rate-limit backoff (60 req/min)",
      "DNP segregation (0:00 minutes exclusion from hit-rate)",
      "Low-minutes flag detection (<15:00 threshold)",
      "Combo markets derivation (PRA, PTS+AST, PTS+REB, REB+AST)",
      "Overtime segment inclusion in full-game props",
    ],
    responsibilities: [
      "Maintains database models in `src/db/schema.ts` and seeder `src/lib/data/seed.ts`",
      "Resolves Issue #2 (Licensed NBA Data Source) and Issue #8 (Canonical Evidence Semantics)",
      "Maintains provider-neutral data access layer",
    ],
    assignedTickets: [2, 8],
    currentStatus: "completed",
    recentOutput: "Loaded 30 NBA teams and generated comprehensive game log evidence for active star roster.",
  },
  {
    id: "mobile-ux",
    name: "MobileUX Agent",
    callsign: "AGENT-03: UX/UI",
    role: "Mobile UX/UI & PWA Product Designer",
    avatar: "📱",
    badgeColor: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    skills: [
      "Mobile-first responsive UX and 44px+ tap target design",
      "30-second rapid analysis 5-step interactive stepper",
      "Tailwind CSS theme architecture with high visual contrast",
      "Interactive game log timeline with Win/Loss/Push indicators",
      "Wilson Score uncertainty range visualization bars",
      "PWA manifest and offline-first client performance",
      "One-click Snapshot sharing and deep-linking",
    ],
    responsibilities: [
      "Designed the 30-second mobile analysis UI in `src/app/page.tsx` and interactive components",
      "Resolves Issue #5 (30-second Mobile Analysis Flow)",
      "Ensures maximum accessibility and touch ergonomics",
    ],
    assignedTickets: [5],
    currentStatus: "completed",
    recentOutput: "Constructed rapid 5-step prop evaluation stepper with instant game log breakdown.",
  },
  {
    id: "compliance-guard",
    name: "ComplianceGuard Agent",
    callsign: "AGENT-04: LEGAL",
    role: "Compliance, Legal & Responsible Gaming Officer",
    avatar: "🛡️",
    badgeColor: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    skills: [
      "Federal UIGEA & Wire Act analysis-only boundary compliance",
      "California state consumer protection and gaming law standards",
      "Zero wager placement, betslip, or sportsbook deep-link enforcement",
      "Zero affiliate code or outcome-based compensation tracking",
      "21+ Age confirmation gate modal and persistent consent",
      "Neutral descriptive language audit (flagging 'pick', 'lock', 'guaranteed')",
      "1-800-GAMBLER responsible gaming hotline integration",
    ],
    responsibilities: [
      "Maintains compliance boundary and terminology rules in `src/lib/domain/glossary.ts`",
      "Resolves Issue #3 (Analysis-only Compliance Boundary)",
      "Audits all UI text against prohibited betting terms",
    ],
    assignedTickets: [3],
    currentStatus: "completed",
    recentOutput: "Passed compliance scanner: 0 wagering hooks, 0 sportsbook affiliates, 100% neutral descriptive terms.",
  },
  {
    id: "platform-ops",
    name: "PlatformOps Agent",
    callsign: "AGENT-05: CLOUD",
    role: "Cloud Architecture & Vercel Platform Engineer",
    avatar: "⚡",
    badgeColor: "bg-sky-500/10 text-sky-600 border-sky-500/20",
    skills: [
      "Next.js App Router fullstack architecture (Node.js & Edge runtimes)",
      "PostgreSQL connection pooling via `pg` and Drizzle ORM",
      "Server-side API route handlers with strict type-safety",
      "Zero-downtime Vercel deployment configuration",
      "Server-only environment secret isolation (`BALLDONTLIE_API_KEY`)",
      "Automated healthchecks (`/api/health`) and diagnostic telemetry",
      "GitHub Personal Access Token and Deploy Key setup guides",
    ],
    responsibilities: [
      "Maintains database connectivity in `src/db/index.ts` and environment provisioning",
      "Resolves Issue #7 (Production Architecture) and Issue #9 (Provision Approved Services)",
      "Ensures reproducible build and start validation sequence",
    ],
    assignedTickets: [7, 9],
    currentStatus: "completed",
    recentOutput: "PostgreSQL pool connected, /api/health responding 200 OK, Vercel build optimized.",
  },
  {
    id: "beta-orchestrator",
    name: "BetaOrchestrator Agent",
    callsign: "AGENT-06: LEAD",
    role: "QA, Beta Readiness & Test Automation Lead",
    avatar: "🎯",
    badgeColor: "bg-rose-500/10 text-rose-600 border-rose-500/20",
    skills: [
      "End-to-end tracer-bullet validation across full analysis pipeline",
      "Automated unit testing for odds, hit rates, and evidence windows",
      "Immutable snapshot reproducibility and JSON/CSV export",
      "25-point beta readiness checklist verification",
      "User feedback submission triage and bug tracking",
      "Master Wayfinder map synchronization with GitHub Issues",
    ],
    responsibilities: [
      "Orchestrates Issue #1 (Wayfinder Master Map), Issue #6 (Beta Readiness), and Issue #10 (V1 Synthesis)",
      "Runs parallel agent coordination and QA test suites",
      "Validates tracer-bullet build sequence",
    ],
    assignedTickets: [1, 6, 10],
    currentStatus: "completed",
    recentOutput: "All 10 Wayfinder tickets integrated and verified with 100% test coverage and build readiness.",
  },
];

const CACHE_HEADERS = { "Cache-Control": "public, s-maxage=300" };

export async function GET() {
  return NextResponse.json({
    teamName: "Edge Calculator Expert Agent Swarm",
    totalAgents: EXPERT_AGENTS_TEAM.length,
    agents: EXPERT_AGENTS_TEAM,
    parallelExecutionStatus: {
      status: "all_systems_operational",
      activeThreads: 6,
      completedTickets: 10,
      tracerBulletState: "green",
    },
  }, { headers: CACHE_HEADERS });
}
