# Edge_Cal — Production Readiness Audit
**Date:** 2026-09-12 (UTC) • **Branch audited:** `arena/01a09797-edge-cal` @ `6b5a234` + local working tree  
**Auditor:** Arena Agent Mode — full clone, install, typecheck, build, lint, npm audit, domain review, Wayfinder map cross-check  
**Context:** Wayfinder map (#1) + 9 decision tickets (#2–#10). Frontend tracer bullet (Next.js 16 + Drizzle + seeded data) is built and builds green. This audit answers: *what's production-ready, what's not, and what to do next.*

> **Security note — action required:** A classic PAT `github_pat_11AZU...` was pasted in your chat message during this session. Treat it as compromised. **Revoke it now:** GitHub → Settings → Developer settings → Personal access tokens → Delete that token, then mint a fine-grained PAT scoped only to `Etdev2/Edge_Cal` with `Contents: read/write` + `Pull requests: read/write`, 7–30-day expiry. Never paste tokens in chat — use the `POST /api/github/create-pr` modal which transmits once server-side and never persists.

---

## 1. Executive summary

| Dimension | Status |
|---|---|
| **Tracer bullet build** | ✅ Green — `tsc --noEmit` passes, `next build` succeeds (10 routes, 8 API endpoints, 6 pages) with demo-mode fallback when `DATABASE_URL` unset |
| **Wayfinder map** | ✅ Implemented in `/wayfinder` (10/10 tickets marked Implemented/Resolved in UI) but **7 tickets still OPEN on GitHub** (#1, #4, #5, #6, #7, #8, #9, #10) — need `Closes #X` on merge |
| **Domain engine** | ✅ Strong — pure functions in `src/lib/domain/` correctly implement break-even, no-vig, Wilson 95%, hit-rate gap, hypothetical return, DNP/low-min, 7 evidence windows, 10 markets |
| **Data layer** | ⚠️ **Demo-seeded only** (~420 synthetic games). Provider-neutral schema is sound, but **no live BALLDONTLIE adapter, no correction re-fetch, no freshness guarantees** — blocks paid/public launch per ADR 0002 |
| **Compliance** | ⚠️ UI guardrails exist (21+ gate, glossary, scanner, 1-800-GAMBLER) but **gate is localStorage-only, no server enforcement, no privacy/terms pages, no audit log** |
| **Production hardening** | 🔴 Not ready — no rate-limit, no caching headers, no security headers, no CI, no tests, no PWA manifest, no observability, critical `next` CVE, `Math.random` snapshot IDs, `drizzle.config` hardcoded |
| **Deploy** | ⚠️ Vercel-ready in happy path, but **will run in demoMode with 0 persisted snapshots until `DATABASE_URL` is provisioned** and env validation is added |

**Verdict:** This is a high-quality **beta prototype** suitable for an internal demo or 5-person trusted review. It is **not yet production-ready for the 25–50 invited beta** defined in #1/#6. Tier 1 hardening (below) is 2–3 focused days; Tier 2 (live data) is the critical path to a credible beta.

---

## 2. What we verified (working correctly)

**Build & types:** `npm install` (397 pkgs), `tsc --noEmit` ✅, `next build` ✅ (Turbopack 5.1s). No throw at import when `DATABASE_URL` unset — lazy pool + `isDatabaseConfigured()` everywhere is correct and Vercel-safe.

**Routing:** 6 pages (`/`, `/wayfinder`, `/agents`, `/explorer`, `/snapshots`, `/compliance`, `/snapshots/[id]`) + 8 API routes all `force-dynamic` and JSON-consistent with `{success, ... demoMode}` contracts.

**Domain math — spot-checked:**

- `calculateBreakEvenProbability`: `-110 → 52.38%` (110/210), `+150 → 40%` (100/250) ✅. Validation rejects `-50`/`+50` correctly.
- `calculateNoVigProbability`: `-110/-110 → 50%/50%, vig 4.76%` ✅.
- `calculateWilsonScoreInterval`: z=1.96, continuity-correct center/margin, clamped [0,1], rounded to 0.001 ✅. Correctly wide on n=5.
- `calculateHistoricalHitRate`: push segregation (`stat===line` → push, excluded from denominator), `eligible = wins+losses`, status `above/inconclusive/below` via interval vs break-even, `n<3 → inconclusive` guard ✅.
- `filterAndSettleEvidence`: DNP = `isDnp || minutes<=0.1` excluded (never a loss), low-min `<15` flagged not dropped, OT included, sorting desc by date, 7 windows all wired ✅.
- Markets: 10 definitions with correct extractors, combo PRA derived from same row ✅. Seed: 30 teams, 12 stars, 35 games each, DNP on #14, low-min #22, OT every 11th — deterministic and auditable ✅.

**Compliance UX:** AgeGate modal, `Header` 21+/1-800 bar persistent, `Footer` disclaimer, `GLOSSARY_TERMS` 15 terms + 11 `PROHIBITED_WORDS`, live `scanTextForCompliance()` on `/compliance` ✅.

**DB schema:** `teams`, `players`, `games`, `playerGameStats`, `analysisSnapshots` (immutable, jsonb `gameEvidence`), `feedbackSubmissions` — all correctly indexed, provenance `source`, timestamps, `analysisSnapshots.snapshotId` unique ✅.

---

## 3. Production gaps — prioritized

### 🔴 P0 - Must-fix before any invited beta (blocks #6 beta readiness)

1. **Critical CVEs in `next@16.2.6`** — `npm audit` shows 7 vulns including **2 critical RCEs** (GHSA-p293, GHSA-2xp9) fixed in `16.3.5`. Also `esbuild ≤0.24.2` moderate (dev-only via drizzle-kit) and `postcss` high.
2. **No rate-limit / abuse protection on `POST /api/analysis`** — unauthenticated, hits DB+compute per keystroke (reactive `useEffect` on every input change). Add IP/token bucket + debounce.
3. **Snapshot IDs use `Math.random`** (`snap_`+random 36) — predictable, low entropy, collision-prone under load. Replace with `crypto.randomUUID()`.
4. **Invite gating missing** — ADR says guest-first, but #6 requires **invited 25–50 testers**. Currently anyone with URL can use + save snapshots. Need `INVITE_CODE` env allowlist or signed invite links before sharing beyond core team.
5. **Age gate is client-only** (`localStorage`) — trivially bypassed, no server check, no 21+ audit trail. Add server cookie + middleware gate for beta.
6. **Lint failures hidden** — 2 `react-hooks/set-state-in-effect` errors (AgeGateModal:13, CalculatorStepper:214) flagged but build still exits 0 due to ESLint flat config not failing CI. Must be fixed or suppressed intentionally, and CI must fail on lint.
7. **`drizzle.config.json` hardcoded to localhost** — `dbCredentials.url` is `postgresql://postgres:postgres@127.0.0.1:5432/app_db` instead of `env.DATABASE_URL`. `drizzle-kit push` will not use Vercel env without `.env` override.
8. **No database migrations committed** — using `drizzle-kit push` imperatively. No `drizzle/` migration folder, so fresh Vercel Postgres has no schema unless manual push. Commit migrations + document.
9. **No CI** — no `.github/workflows/` to run `lint`, `typecheck`, `build`, and block PRs. Manual merges risk regressions.
10. **Zero tests** — no unit tests for `odds.ts`, `statistics.ts`, `evidence.ts` despite being pure, easily tested, and safety-critical. Need Vitest suite (50–60 cases) as regression net.

### 🟠 P1 - Must-fix before public/paid or credible 25-person beta

11. **No live BALLDONTLIE adapter** (#2, #8) — `BALLDONTLIE_API_KEY` env exists but never read. All data is seeded synthetic. Need server-only adapter with cursor pagination, retries/backoff, 60 req/min limiter, final-game gating, correction re-fetch window (e.g., nightly D-1 re-fetch), normalized cache into `player_game_stats` with `source`/`fetchedAt` provenance shown in UI.
12. **No data freshness / source transparency** in analysis response beyond `demoMode` string. Must surface `source: BALLDONTLIE_API | DEMO_SEED`, `fetchedAt`, `gamesFetchedAt`, stale warning >24h.
13. **No caching headers** — `GET /api/players`, `/api/teams`, `POST /api/analysis` (for same inputs) are uncached. Add `Cache-Control: s-maxage` + `ETag` or `Next.js fetch` revalidation for teams/players; short `s-maxage=60` for analysis.
14. **No security headers** — `next.config.ts` is empty `{}`. Need `headers()` with `Strict-Transport-Security`, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, minimal `Content-Security-Policy`.
15. **No PWA artifacts** despite "PWA" in spec (#5, #7) — missing `manifest.json`, `themeColor`, service worker, icons, offline fallback. Either ship PWA or remove claim.
16. **Reactive analysis fires on every keystroke** — `CalculatorStepper` `useEffect` re-runs on any input change with no debounce/dedup/cancel. Add 300ms debounce + `AbortController`.
17. **No privacy/terms/data-retention pages** — ADR 0005 requires minimizing PII, but there is no `/privacy` disclosure explaining what `analysisSnapshots.gameEvidence` stores, retention, deletion, or contact for data correction (#6 support criteria).
18. **No observability** — only `console.error`. Need structured request logging (route, latency, demoMode, error code), health includes build SHA, optional Sentry.

### 🟡 P2 - Polish before scaling to 50 testers

19. **Accessibility gaps** — stepper uses `div` buttons without `aria-` and keyboard handlers; line stepper not labeled; color contrast not audited. Need axe pass for WCAG 2.1 AA.
20. **Performance** — no image optimization (`avatarUrl` are unsplash hotlinks, not `next/image`), no bundle analysis, no edge caching for explorer.
21. **Snapshot `gameEvidence` jsonb unbounded growth** — stores full settled logs per snapshot. Fine for beta, but add payload cap (e.g., 20 games max persisted) + note in schema.
22. **Feedback triage is write-only** — `GET /api/feedback` exists but no admin view. Wire `/compliance` or new `/admin` (invite-gated) feedback inbox.
23. **Vercel `functions.maxDuration=15` but no timeout handling** in adapter — ensure adapter respects 10s budget.
24. **Docs drift** — `HANDOFF.md` says "previous PR #11 only saved 1 markdown file" (now stale after merge #13). Update after this branch merges.

---

## 4. Wayfinder ticket mapping → gaps

| Ticket | Title | GitHub | Implemented? | Production blocker |
|---|---|---|---|---|
| #2 | Licensed NBA data source | closed | seeded ✅, live adapter ❌ | P1-11,12 |
| #3 | Compliance boundary | closed | UI guardrails ✅, server gate ❌ | P0-5, P1-17 |
| #5 | 30-sec mobile flow | **open** | stepper ✅, debounce/a11y/PWA ❌ | P1-15,16, P2-19 |
| #8 | Evidence semantics | **open** | DNP/low-min/OT/windows ✅, correction feed ❌ | P1-11 |
| #4 | Calculation contract | **open** | formulas ✅, tests ❌ | P0-10 |
| #7 | Production arch & data ops | **open** | Drizzle+health ✅, headers/CI/migrations ❌ | P0-6..10, P1-13,14 |
| #9 | Provision approved services | **open** | env template ✅, real provisioning ❌ | P0-7,8 |
| #6 | Beta readiness & rollout | **open** | feedback+snapshots ✅, invite gating/privacy ❌ | P0-4,5 |
| #10 | V1 synthesis | **open** | tracer bullet ✅, spec doc ❌ | This audit |
| #1 | Wayfinder map | **open** | page ✅, GitHub close sync ❌ | All |

**Action:** Merge this branch with `Closes #4 #5 #6 #7 #8 #9 #10` and manually ensure #1 checklist is ticked with links to `/wayfinder`, `/compliance`, and this audit.

---

## 5. Recommended delivery plan (tracer-bullet friendly)

### Phase 0 — Immediate hygiene (this branch, 1 session)

Fix P0-1,3,6,7 without behavior change: bump `next` to `16.3.5`, `drizzle.config` → env, snapshot `randomUUID`, silence/fix 2 lint errors correctly, add `next.config` security headers, commit `.github/workflows/ci.yml` (lint+typecheck+build). Zero risk to demo.

### Phase 1 — Invite-only beta hardening (2–3 days, unblocks #6)

P0-4,5,8,9,10 + P1-16: add `INVITE_CODE` middleware gate, server age cookie, `drizzle/` migrations, Vitest unit suite, rate-limit on analysis (Upstash or in-memory for beta), debounce analysis. Deploy preview, invite 5 trusted testers, collect feedback via `/api/feedback`.

### Phase 2 — Data trust (1 week, unblocks #2, #8)

Implement BALLDONTLIE adapter (`src/lib/data/balldontlie.ts`), ingestion cron `POST /api/cron/ingest` (Vercel Cron), correction re-fetch job, source/freshness badges in `CalculatorStepper` & `GameLogsList`, stale-data banner. Keep seeded fallback for dev. Requires `BALLDONTLIE_API_KEY` provisioned on Vercel.

### Phase 3 — PWA + launch ops (3–4 days, unblocks #5, #7)

`manifest.json`, service worker, offline shell, `/privacy` + `/terms`, axe a11y pass, bundle/image optimization, Sentry + health build SHA, Vercel prod deploy + `DATABASE_URL` on Neon/Supabase, custom domain if desired.

### Phase 4 — 25–50 invited beta rollout (#6 criteria)

Invite codes issued, analytics events (`analysis_completed`, `snapshot_saved`, `feedback_submitted`), support runbook (how to report data correction, expected response SLAs), weekly data quality report (freshness %, DNP audit %, correction count).

---

## 6. What to do next — decision for you

Pick one lane; we can execute it on `arena/01a09797-edge-cal` this session:

**A) Ship Phase 0 now (30–45 min)** — I push the low-risk hygiene fixes, open a PR, and you merge to get a clean, CVE-free baseline. No product changes.

**B) Jump to Phase 1 invite-beta hardening (half-day)** — hygiene + invite gating + migrations + CI + tests + rate-limit. Gets you to a genuinely shippable 25-person beta.

**C) Go data-first (Phase 2)** — wire the live BALLDONTLIE adapter first. Makes the calculator real, but takes longer before you can invite testers.

**D) Just review — no code changes yet** — keep this audit as a decision doc and discuss with your team.

My recommendation: **A then immediately B**. Phase 0 is cheap and removes the critical `next` RCE; Phase 1 is what #6 actually requires before you invite anyone. Data trust (Phase 2) can run in parallel once your `BALLDONTLIE_API_KEY` and `DATABASE_URL` are provisioned.

---

## 7. Quick commands for Model Mode resume

```bash
git checkout arena/01a09797-edge-cal
git pull origin arena/01a09797-edge-cal
npm install          # picks up next@16.3.5 after Phase 0
npm run lint         # should be 0 errors after fixes
npm run typecheck    # alias for tsc --noEmit
npm run build        # must stay green with demoMode fallback
# With DATABASE_URL set:
npx drizzle-kit generate && npx drizzle-kit push
npm run dev          # http://localhost:3000  /api/health -> {ok:true}
```

---

## 8. Files that matter most (read in this order)

1. `src/lib/domain/odds.ts` + `statistics.ts` + `evidence.ts` — formula authority
2. `src/app/api/analysis/route.ts` — end-to-end pipeline (keep pure domain separate from route)
3. `src/db/schema.ts` + `src/lib/data/seed.ts` + `memoryFallback.ts` — persistence & demo fallback
4. `src/components/CalculatorStepper.tsx` — UX contract (will need debounce + a11y fixes)
5. `src/app/compliance/page.tsx` + `src/lib/domain/glossary.ts` — compliance surface
6. `next.config.ts` + `drizzle.config.json` + `vercel.json` — deploy contract (currently under-specified)

---

*Audit generated by Arena Agent Mode on a clean clone. Build artifacts verified; no credentials persisted. Next step is your call: choose A, B, C, or D above and I will execute on this branch.*
