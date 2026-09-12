# Edge Calculator — Battle Mode → Model Mode Handoff
**Repository:** `Etdev2/Edge_Cal`
**Date:** 2026-09-12
**Mode transition:** Battle Mode (rapid sandbox build) → Model Mode (clean resume / review)
**Previous PR:** #11 `Option B: Save Edge Calculator progress (20260912)` — only contained a single `docs/sandbox-option-b-*.md` proof file. This handoff fixes that by shipping the **full Next.js Vercel-deployable app** + this report.

---

## 1. TL;DR for resuming in Model Mode

- You have a working **Next.js 16 App Router + PostgreSQL + Drizzle ORM** Edge Calculator beta in this sandbox (`/app`).
- It implements Wayfinder Tickets #1–#10 end-to-end: 30-sec mobile analysis, break-even / Wilson 95% / hit-rate gap / hypothetical return, DNP + low-minute auditing, immutable snapshots, Wayfinder map, 6-agent roster, compliance hub, 21+ gate.
- What was missing on GitHub: PR #11 only saved **one markdown file**, not the app. This handoff creates a **second PR with the full Vercel-ready codebase** + this file.
- To resume in Model Mode: merge the new PR, `git pull origin main`, `npm install`, set `.env` from `.env.example`, `npx drizzle-kit push`, `npm run dev`.
- To deploy to Vercel: Import `Etdev2/Edge_Cal` → Framework Next.js → add `DATABASE_URL` → Deploy. No code changes needed.

### Quick resume commands
```bash
git clone https://github.com/Etdev2/Edge_Cal.git
cd Edge_Cal
npm install
cp .env.example .env
# edit .env → set DATABASE_URL
npx drizzle-kit push
npm run dev
# open http://localhost:3000
```

### Vercel deploy (1-click)
1. Go to https://vercel.com/new → Import `Etdev2/Edge_Cal`
2. Framework Preset: **Next.js** (auto-detected)
3. Environment Variables:
   - `DATABASE_URL` = your Postgres URL (Neon / Supabase / Vercel Postgres)
   - `BALLDONTLIE_API_KEY` = optional, server-only
4. Deploy. Healthcheck: `/api/health` should return `{ "ok": true }`.

---

## 2. What the agents built (work done)

### App routes (all validated: `next typegen` ✓, `tsc --noEmit` ✓, `next build` ✓)
- `/` — 30-second Rapid Prop Analysis stepper (player → market/line/side → American odds + optional no-vig → evidence window → live results)
- `/wayfinder` — Interactive map of all 10 tickets with question / resolution / acceptance criteria / blocked-by graph
- `/agents` — 6-agent swarm roster with skills, responsibilities, ticket assignments
- `/explorer` — 30 NBA teams + 12 featured star players + averages
- `/snapshots` + `/snapshots/[id]` — Immutable snapshot vault with JSON export + share links
- `/compliance` — CONTEXT.md glossary, prohibited-language scanner, 1-800-GAMBLER disclosure

### API routes
- `GET /api/health` — DB connectivity probe
- `GET /api/players?q=` — player search + team join, auto-seeds if empty
- `GET /api/teams` — 30 teams
- `POST /api/analysis` — full calculation engine (odds → break-even → evidence filter → hit-rate → Wilson 95% → gap → hypothetical return + game logs)
- `GET/POST /api/snapshots` + `GET /api/snapshots/[id]` — immutable audit records
- `GET/POST /api/feedback` — beta feedback triage
- `GET /api/wayfinder` + `GET /api/agents` — map + roster data
- `POST /api/github/create-pr` — **Option B one-click PR saver** (server-side, token used once, never stored)

### Domain engine (`src/lib/domain/`)
- `odds.ts` — `calculateBreakEvenProbability`, `calculateNoVigProbability`, `calculateHypotheticalReturn`, American-odds validation (`<=-100` or `>=+100`)
- `statistics.ts` — `calculateHistoricalHitRate` (push segregation) + `calculateWilsonScoreInterval` (95% z=1.96)
- `markets.ts` — 10 markets: PTS, REB, AST, 3PM, PRA (=pts+reb+ast), PTS+AST, PTS+REB, REB+AST, BLK, STL
- `evidence.ts` — 7 windows (season, L20, L10, L5, vs_opponent, home, away), DNP exclusion (`min<=0.1` or `isDnp`), low-minute flag `<15.0`, overtime included
- `glossary.ts` — 15 CONTEXT.md terms + `PROHIBITED_WORDS` + `scanTextForCompliance()`

### Data (`src/lib/data/` + `src/db/`)
- `nbaData.ts` — 30 teams + 12 stars with realistic averages
- `seed.ts` — `seedDatabaseIfEmpty()`: 30 teams, 12 players, ~35 games each (~420 games) with DNP game #14, low-minute game #22, OT every 11th game
- `schema.ts` — `teams`, `players`, `games`, `player_game_stats`, `analysis_snapshots`, `feedback_submissions`

### UI components (`src/components/`)
- `CalculatorStepper.tsx` — 5-step rapid flow + live dashboard
- `UncertaintyBar.tsx` — Wilson interval vs break-even visualization
- `GameLogsList.tsx` — win/loss/push cards with `<15m` badges
- `Header.tsx` / `Footer.tsx` / `AgeGateModal.tsx` (21+ gate) / `GitHubAccessModal.tsx` (now defaults to **Option B**) / `SaveOptionBPR.tsx` / `FeedbackModal.tsx`

---

## 3. Agent findings (by agent)

### AGENT-01 QUANT (OddsQuant) — Ticket #4
- **Finding:** Break-even math verified: `-110 → 52.38%`, `+150 → 40.0%`. No-vig at `-110/-110` → `50.0%` each, vig `4.76%`.
- **Finding:** Wilson 95% is required — L5 samples otherwise look falsely confident. Example: Jokić PTS O26.5 season: 50.0% hit, interval `[34.1%–65.9%]` → correctly `inconclusive` vs 52.4% break-even.
- **Work:** `odds.ts` + `statistics.ts`, live dashboard cards, hypothetical-return labeled as illustration not forecast.

### AGENT-02 DATA (DataOps) — Tickets #2, #8
- **Finding:** BALLDONTLIE ALL-STAR ($9.99/mo, 60 req/min) is technically adequate but Terms contradict on competing-product use — need written clearance before paid launch. No correction feed, no historical injury timeline.
- **Finding:** DNP semantics unresolved upstream — implemented defensive rule: `0:00` / `isDnp` excluded, never counted as loss; low-minutes flagged not dropped.
- **Work:** Full Drizzle schema, seeder, provider-neutral adapter shape, opponent/home-away derivation, PRA combos derived from same finalized row.

### AGENT-03 UX (MobileUX) — Ticket #5
- **Finding:** 5-step stepper hits <30s on mobile; 44px+ targets, quick star chips + search, +/-0.5 line stepper, Over/Under pill, preset odds chips.
- **Work:** `CalculatorStepper`, `UncertaintyBar`, `GameLogsList`, snapshot save/share.

### AGENT-04 LEGAL (ComplianceGuard) — Tickets #3, #6
- **Finding:** Beta is defensible as analysis-only **iff**: free, invited, 21+, no wager storage, no sportsbook links, no affiliates, no picks/locks language, 1-800-GAMBLER present. Native app / paid / predictive picks need fresh counsel.
- **Work:** 21+ gate modal, glossary dictionary, live prohibited-language scanner (`/compliance`), neutral status language (Above / Inconclusive / Below).

### AGENT-05 CLOUD (PlatformOps) — Tickets #7, #9
- **Finding:** App is Vercel-ready as-is: no `next.config` hacks needed, server-only secrets, `/api/health` green, Drizzle `push` works without migrations.
- **Finding:** Previous PR #11 only proved token auth — did NOT ship code. This handoff ships code.
- **Work:** DB pooling, env template, healthcheck, Vercel instructions, Option B PR API.

### AGENT-06 LEAD (BetaOrchestrator) — Tickets #1, #6, #10
- **Finding:** Tracer bullet green: player search → analysis → snapshot → share → export all pass. 10/10 tickets resolved/implemented in sandbox, but GitHub Issues #4–#10 still show open — need `Closes #X` on merge or manual close with comment.
- **Work:** Wayfinder map sync, snapshot reproducibility, feedback API, this handoff doc.

---

## 4. GitHub state vs sandbox truth

| Ticket | GitHub | Sandbox truth |
|---|---|---|
| #1 Wayfinder map | open | Implemented — `/wayfinder` |
| #2 Data source | closed ✓ | Implemented + seeded |
| #3 Compliance | closed ✓ | Implemented + scanner |
| #4 Calc contract | open | Implemented + tested |
| #5 Mobile flow | open | Implemented (<30s) |
| #6 Beta readiness | open | Implemented (feedback + export) |
| #7 Architecture | open | Implemented (Drizzle + health) |
| #8 Evidence semantics | open | Implemented (DNP/low-min/OT/combos) |
| #9 Provisioning | open | Implemented (env + Vercel + Option B PR) |
| #10 V1 synthesis | open | Implemented (this build) |
| PR #11 | open/merged? | Only 1 markdown file — superseded by new full-app PR |

**Action for Model Mode:** after merging the full-app PR, comment on each open ticket with evidence link + close, or merge with `Closes #4 #5 #6 #7 #8 #9 #10` in PR body.

---

## 5. Files to review first (Model Mode checklist)

1. `src/lib/domain/odds.ts` + `statistics.ts` — verify formulas
2. `src/lib/domain/evidence.ts` — verify DNP / low-minute / window rules
3. `src/app/api/analysis/route.ts` — verify end-to-end pipeline
4. `src/db/schema.ts` + `src/lib/data/seed.ts` — verify models
5. `src/components/CalculatorStepper.tsx` — verify 30-sec UX
6. `src/app/compliance/page.tsx` — verify language + scanner
7. `vercel.json` + `.env.example` — verify deploy contract

---

## 6. Known gaps / risks before public beta

- BALLDONTLIE live adapter is abstracted but sandbox runs on seeded cache — wire `BALLDONTLIE_API_KEY` server-side before production data.
- No auth yet — guest-first by design; add invite codes before 25–50 tester rollout.
- No rate-limit / caching headers on analysis route — add for production.
- Snapshots store `gameEvidence` JSON — fine for beta, consider partitioning at scale.
- Token pasted in chat — **revoke it** after merge (Settings → Developer settings → Personal access tokens → Delete). Use 30-day expiry next time.

---

## 7. Battle Mode → Model Mode resume prompt (copy/paste)

```text
Resuming Edge Calculator in Model Mode.
Repo: Etdev2/Edge_Cal (main now has full Next.js Vercel app).
Read: HANDOFF.md, CONTEXT.md, docs/adr/, src/lib/domain/.
Verify: npm install, npx drizzle-kit push, npm run dev, test /api/health and /api/analysis.
Next: close Wayfinder tickets #4–#10 with evidence, wire BALLDONTLIE_API_KEY server-side, add invite gating, then Vercel deploy preview.
Constraints: analysis-only, 21+, no wagering/affiliates/predictive picks, neutral language only.
```

---

*Generated by the Edge Calculator Agent Swarm (6 agents) — Battle Mode build, ready for Model Mode review.*
