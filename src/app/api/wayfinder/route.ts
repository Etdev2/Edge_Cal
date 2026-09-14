import { NextResponse } from "next/server";

export interface WayfinderTicketData {
  id: number;
  title: string;
  category: "master" | "research" | "specification" | "operations" | "ux" | "compliance";
  state: "open" | "closed" | "in_progress" | "implemented";
  blockedBy: number[];
  blocking: number[];
  assignedAgent: string;
  agentRole: string;
  question: string;
  resolutionSummary: string;
  acceptanceCriteria: string[];
  deliverableLink?: string;
  interactiveFeature: string;
}

export const WAYFINDER_TICKETS: WayfinderTicketData[] = [
  {
    id: 1,
    title: "Wayfinder: NBA historical edge calculator beta",
    category: "master",
    state: "in_progress",
    blockedBy: [],
    blocking: [4, 5, 6, 7, 8, 9, 10],
    assignedAgent: "BetaOrchestrator Agent",
    agentRole: "Program Manager & Beta Orchestrator",
    question: "Produce an implementation-ready, expert-reviewed specification and sequenced delivery plan for an invited beta of a mobile-first Next.js PWA.",
    resolutionSummary: "Single monorepo architecture implemented in Next.js App Router with PostgreSQL + Drizzle ORM, pure domain packages, 30-second mobile analysis UX, and strict 21+ compliance boundaries.",
    acceptanceCriteria: [
      "Target beta size: 25-50 invited testers",
      "NBA player props first with guest-first PWA flow",
      "Analysis-only boundary strictly enforced",
      "Manual line and American-odds entry",
      "Descriptive language only (no betting picks or locks)",
    ],
    interactiveFeature: "Full Interactive App Sandbox & Visual Issue Tree",
  },
  {
    id: 2,
    title: "Validate the licensed NBA data source",
    category: "research",
    state: "closed",
    blockedBy: [],
    blocking: [7, 8, 9],
    assignedAgent: "DataOps Agent",
    agentRole: "NBA Data Engineer & Provider Architect",
    question: "Does BALLDONTLIE All-Star permit and reliably supply every game-level statistic, injury field, historical season, commercial caching right, attribution requirement, correction behavior, and rate limit?",
    resolutionSummary: "Conditional technical go for BALLDONTLIE ALL-STAR API ($9.99/mo, 60 req/min). Requires server-only adapter, rate-limiter, local PostgreSQL caching, final-game gating, and DNP auditing.",
    acceptanceCriteria: [
      "Server-only API key handling without client leakage",
      "Fallback mock seed dataset with realistic minutes and box scores",
      "PTS, REB, AST, 3PM, PRA extraction verified",
      "DNP segregation from played games",
      "Timestamped source provenance displayed on all results",
    ],
    deliverableLink: "https://github.com/Etdev2/Edge_Cal/blob/main/docs/research/ball-dont-lie-nba-data-source.md",
    interactiveFeature: "Live BALLDONTLIE Provider Adapter & Historical Box Score Explorer",
  },
  {
    id: 3,
    title: "Validate the analysis-only compliance boundary",
    category: "compliance",
    state: "closed",
    blockedBy: [],
    blocking: [6],
    assignedAgent: "ComplianceGuard Agent",
    agentRole: "Compliance, Legal & Responsible Gaming Officer",
    question: "What federal, California, distribution-platform, advertising-claims, privacy, age, and responsible-gambling requirements should constrain an analysis-only 21+ invited beta?",
    resolutionSummary: "Conditional go for a free, invited, analysis-only California PWA. Strictly zero wager placement, no betslips, no affiliate links, no sportsbook routing, 21+ age check, and neutral responsible gambling disclosures.",
    acceptanceCriteria: [
      "No wager acceptance, storage, or transmission",
      "No sportsbook affiliate links or outcome-based commissions",
      "21+ Age confirmation modal and disclaimer banner",
      "1-800-GAMBLER helpline links embedded",
      "Prohibited terms scanner active on all UI text",
    ],
    deliverableLink: "https://github.com/Etdev2/Edge_Cal/blob/main/docs/research/compliance-boundary.md",
    interactiveFeature: "Compliance Verification Guard & Terminology Audit Scanner",
  },
  {
    id: 4,
    title: "Define the calculation and result contract",
    category: "specification",
    state: "implemented",
    blockedBy: [5, 8],
    blocking: [10],
    assignedAgent: "OddsQuant Agent",
    agentRole: "Domain & Odds Quant Mathematician",
    question: "What exact inputs, formulas, rounding rules, win-loss-push treatment, no-vig option, uncertainty presentation, historical-status language, hypothetical-return language, and error states form the stable V1 analysis contract?",
    resolutionSummary: "Implemented standard American odds to break-even probability, Wilson score 95% confidence interval, push segregation, No-vig margin removal, hypothetical return for $100 stake, and 3-state neutral historical status (Above, Inconclusive, Below).",
    acceptanceCriteria: [
      "American odds validation (<= -100 or >= +100)",
      "Break-even formula: |odds|/(|odds|+100) or 100/(odds+100)",
      "Push games properly excluded from hit rate denominator",
      "Hypothetical return scenario clearly labeled as non-forecast",
      "Wilson Score 95% confidence interval computed on all sample sizes",
    ],
    interactiveFeature: "Interactive Calculation Sandbox & Odds Converter",
  },
  {
    id: 5,
    title: "Choose the 30-second mobile analysis flow",
    category: "ux",
    state: "implemented",
    blockedBy: [],
    blocking: [4, 6, 7],
    assignedAgent: "MobileUX Agent",
    agentRole: "Mobile UX/UI & PWA Product Designer",
    question: "Which clickable mobile interaction and information hierarchy lets a new user complete a trustworthy NBA player-prop analysis in under 45 seconds while still exposing sample size, uncertainty, game evidence, and source freshness?",
    resolutionSummary: "Fast 5-step intuitive stepper and instant one-screen dashboard: 1. Player & Team, 2. Prop Market, 3. Line & Side Toggle, 4. Sportsbook American Odds, 5. Evidence Window. Yields comprehensive comparison in <15 seconds.",
    acceptanceCriteria: [
      "Fast 30-second completion time on mobile screens",
      "Touch-friendly 44px+ hit targets",
      "Visual game log cards with win/loss/push indicators",
      "Low-minute (<15m) visual badges",
      "One-click 'Save Snapshot' & 'Share' action",
    ],
    interactiveFeature: "30-Second Rapid Mobile Analysis Stepper",
  },
  {
    id: 6,
    title: "Define beta readiness and rollout",
    category: "operations",
    state: "implemented",
    blockedBy: [3, 4, 5, 7],
    blocking: [10],
    assignedAgent: "BetaOrchestrator Agent",
    agentRole: "QA, Beta Readiness & Test Automation Lead",
    question: "What measurable functional, data-quality, accessibility, performance, privacy, responsible-gaming, analytics, support, and invited-user criteria must pass before the V1 beta is considered ready?",
    resolutionSummary: "Comprehensive 25-point beta readiness checklist with automated test verification, invitation access token simulation, guest mode, user feedback collection, and snapshot export.",
    acceptanceCriteria: [
      "25-point Beta readiness audit pass",
      "Automated tracer-bullet calculation tests",
      "User feedback submission API and category triage",
      "Guest access mode + optional invitation access code",
      "Immutable snapshot export (JSON & CSV)",
    ],
    interactiveFeature: "Live Beta Readiness Audit & Feedback Center",
  },
  {
    id: 7,
    title: "Define the production architecture and data operations",
    category: "specification",
    state: "implemented",
    blockedBy: [2, 5, 8],
    blocking: [9, 10],
    assignedAgent: "PlatformOps Agent",
    agentRole: "Platform & DevOps Engineer",
    question: "What exact monorepo boundaries, public API contracts, Supabase/PostgreSQL schema and access rules, provider adapters, ingestion schedules, correction jobs, freshness guarantees, observability, test layers, CI checks, and Vercel deployment topology should the V1 specification require?",
    resolutionSummary: "Next.js App Router architecture with Drizzle ORM + PostgreSQL, server-side data adapters, health checks, type-safe API route handlers, and zero secrets exposed to client bundle.",
    acceptanceCriteria: [
      "Normalized PostgreSQL schema for teams, players, games, stats, snapshots",
      "Drizzle ORM queries with zero client secret exposure",
      "GET /api/health database connectivity check",
      "Provider adapter abstraction with caching and fallback",
      "Zero-downtime Vercel deployment readiness",
    ],
    interactiveFeature: "Production Architecture Topology & Schema Inspector",
  },
  {
    id: 8,
    title: "Define canonical NBA evidence semantics",
    category: "specification",
    state: "implemented",
    blockedBy: [2],
    blocking: [4, 7, 10],
    assignedAgent: "DataOps Agent",
    agentRole: "NBA Data Engineer & Provider Architect",
    question: "What canonical definitions and inclusion rules govern players, teams, games, season types, DNPs, low-minute appearances, overtime, traded players, evidence windows, opponent splits, derived combo markets, and official stat corrections?",
    resolutionSummary: "Established formal rules: DNPs excluded from sample, overtime included in stats, low-minutes (<15m) flagged with alert badges without silent dropping, combo markets derived (PRA = pts+reb+ast), home/away/opponent window filtering.",
    acceptanceCriteria: [
      "Single markets: PTS, REB, AST, 3PM, BLK, STL",
      "Combo markets: PRA, PTS+AST, PTS+REB, REB+AST",
      "DNP rule: 0 minutes or DNP status excluded from hit rate",
      "Overtime included in final settlement",
      "Low minutes (<15:00) flagged in game logs",
    ],
    interactiveFeature: "Canonical NBA Evidence Rules Engine & Stat Derivations",
  },
  {
    id: 9,
    title: "Provision the approved project services",
    category: "operations",
    state: "implemented",
    blockedBy: [2, 7],
    blocking: [10],
    assignedAgent: "PlatformOps Agent",
    agentRole: "Platform & DevOps Engineer",
    question: "Which human-owned accounts, API subscriptions, projects, secrets, environments, billing limits, and repository protections must be provisioned so the specification can be implemented and verified?",
    resolutionSummary: "Configured PostgreSQL via Drizzle ORM, BALLDONTLIE_API_KEY environment variable template, NEXT_PUBLIC_APP_URL, Next.js build configuration, and GitHub Key provisioning instructions.",
    acceptanceCriteria: [
      "Environment variable configuration schema (.env)",
      "Database connection pooling and migration push ready",
      "Vercel deployment setup with single-click import",
      "GitHub Fine-Grained Personal Access Token generator instructions",
      "Healthcheck probe responding 200 OK",
    ],
    interactiveFeature: "Service Provisioning & GitHub Access Key Generator Guide",
  },
  {
    id: 10,
    title: "Synthesize the implementation-ready V1 specification",
    category: "specification",
    state: "implemented",
    blockedBy: [4, 6, 7, 8, 9],
    blocking: [],
    assignedAgent: "BetaOrchestrator Agent",
    agentRole: "Program Manager & Beta Orchestrator",
    question: "Once every upstream decision is resolved, what single implementation-ready specification and tracer-bullet build sequence faithfully combines the product, calculation, evidence, UX, architecture, compliance, and beta-readiness contracts?",
    resolutionSummary: "Synthesized complete working V1 Edge Calculator application with all 6 expert agents, interactive UI/UX, pure mathematical domain engine, realistic evidence dataset, snapshot vault, and Wayfinder map.",
    acceptanceCriteria: [
      "All upstream decision tickets 1-9 unified into working system",
      "End-to-end tracer bullet from player search -> analysis -> snapshot verified",
      "Typecheck, typegen, and production build 100% passing",
      "Mobile PWA ready with responsive UI",
      "Compliance and responsible gaming guardrails verified",
    ],
    interactiveFeature: "Full Application Live Sandbox & Master Specification Hub",
  },
];

const CACHE_HEADERS = { "Cache-Control": "public, s-maxage=300" };

export async function GET() {
  return NextResponse.json({
    mapTitle: "NBA Historical Edge Calculator Beta",
    repository: "https://github.com/Etdev2/Edge_Cal",
    tickets: WAYFINDER_TICKETS,
    summary: {
      total: WAYFINDER_TICKETS.length,
      closed: WAYFINDER_TICKETS.filter((t) => t.state === "closed" || t.state === "implemented").length,
      inProgress: WAYFINDER_TICKETS.filter((t) => t.state === "in_progress").length,
      open: WAYFINDER_TICKETS.filter((t) => t.state === "open").length,
    },
  }, { headers: CACHE_HEADERS });
}
