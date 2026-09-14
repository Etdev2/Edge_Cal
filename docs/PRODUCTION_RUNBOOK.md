# Edge_Cal — Production Runbook
**Updated:** 2026-09-14 · **Branch:** `arena/01a0a17c-edge-cal` · **Stack:** Next.js 16 App Router + PostgreSQL (Drizzle) on Vercel

This runbook covers deploying the current build (NBA + NFL props, bankroll/stake sizing,
hardening pass) to Vercel Postgres and verifying it end-to-end.

---

## 1. What this branch adds (vs. the beta baseline)

| Area | Change |
|---|---|
| **NFL support** | `sport` column on teams/players/games/stats/snapshots (committed migration `drizzle/0001`), 32 teams + 12 featured players + 8 completed 2026-season games each (demo seed), 6 NFL markets (PASS YDS, RUSH YDS, REC, REC YDS, TD, TOTAL YDS) on the same evidence engine, sport filters on `/api/players`, `/api/teams`, `POST /api/analysis`, sport toggle in the calculator + explorer |
| **Bankroll & stake sizing** | `src/lib/domain/bankroll.ts` (EV, Kelly, fractional Kelly, max-stake cap — 15 unit tests), browser-only settings store (`useSyncExternalStore` + localStorage, ADR 0005), per-analysis stake card (hit-rate default + manual win-probability override), `/bankroll` settings page, glossary + compliance boundary updated |
| **Hardening** | Per-route `Cache-Control` (players/teams `s-maxage=60`, wayfinder/agents `s-maxage=300`, health `s-maxage=10`, all sensitive routes `no-store` — the old global `/api/* no-store` would override route headers, so it was removed), data-freshness fields (`dataAsOf` + `staleDataWarning` >24h) surfaced in results, sport-mismatch guard on analysis (400 with a clear message), age-gate rejections are `no-store` |
| **Tests** | 88 tests across 6 suites (was 55): bankroll math (EV↔hypothetical-return parity, Kelly, caps, PM pricing, validation), market registry, NFL evidence settlement |

## 2. Deploying to Vercel

1. https://vercel.com/new → import `Etdev2/Edge_Cal` → Framework **Next.js** (auto-detected).
2. Environment Variables:

   | Variable | Required | Notes |
   |---|---|---|
   | `DATABASE_URL` | **yes** | Postgres connection (Neon / Supabase / Vercel Postgres). Pooling recommended. |
   | `INVITE_CODE` | no | When set, middleware requires an invite (link `?invite=CODE` or cookie). Leave unset for open preview. |
   | `BALLDONTLIE_API_KEY` | no | Server-only. Live NBA adapter is still abstracted (see §5); with demo seed the key is unused. |
   | `NEXT_PUBLIC_APP_URL` | no | Used in share links. |

3. Deploy. First request to any data route auto-seeds both leagues (idempotent, per-sport).
   Verify:
   - `GET /api/health` → `{ "ok": true, "db": "connected" }`
   - `GET /api/teams?sport=nba` → 30 teams · `GET /api/teams?sport=nfl` → 32 teams
   - `GET /api/players?sport=nfl&q=allen` → Josh Allen (BUF)
   - `POST /api/analysis` (with 21+ cookie) for an NBA **and** an NFL player.

## 3. Databases

- **Fresh database:** `drizzle-kit push` applies `drizzle/0000` + `drizzle/0001`. Migrations are
  committed; the app also auto-pushes demo seeds on first use.
- **Existing beta database** (has `drizzle/0000` only): run `npx drizzle-kit push` once — it
  applies `0001` (adds `sport` columns defaulting to `'nba'` and the NFL stat columns defaulting
  to `0`, so all existing NBA rows stay intact).
- No destructive changes in `0001`.

## 4. Local development

```bash
npm install
cp .env.example .env          # set DATABASE_URL
npx drizzle-kit push
npm run dev                   # http://localhost:3000
```

Checks (same as CI): `npm test` · `npm run typecheck` · `npm run lint` · `npm run build`.

## 5. Known gaps before public/paid launch (deliberate, tracked)

1. **Live data adapters.** Both leagues currently serve the deterministic demo seed (clearly
   labeled). Production data requires a licensed, final-gated ingestion job (NBA: BALLDONTLIE;
   NFL: equivalent licensed provider) writing normalized rows into `player_game_stats` with
   `source`/`fetchedAt` provenance. The `source` + `dataAsOf` + `staleDataWarning` fields are
   already wired end-to-end for that.
2. **Observability.** Structured request logging / Sentry is still out.
3. **Accessibility pass** (WCAG 2.1 AA) for the expanded stepper.
4. **Invite distribution.** `INVITE_CODE` is single-code; scale to per-tester codes before a
   25–50 person rollout.
5. **Security note (from the 2026-09-12 audit):** the classic PAT pasted in chat that session is
   treated as compromised — if it still exists, revoke it in GitHub → Settings → Developer
   settings. Never paste tokens in chat again.

## 6. Operations quick reference

| Task | Command / path |
|---|---|
| Health probe | `GET /api/health` (CDN-cached 10s) |
| Re-seed a league (fresh DB only) | delete that league's rows, then any data route call reseeds |
| Regenerate a migration | `npx drizzle-kit generate --name <desc>` (no live DB needed) |
| Apply migrations | `npx drizzle-kit push` |
| Unit suite | `npm test` (88 tests, vitest) |
| Rate limit (analysis) | 30 req/min per client IP, in-memory, `429` + `Retry-After` |
| Age gate | `edge_cal_age_confirmed` cookie, 30 days, set via `POST /api/age-gate` |
| Invite gate | `edge_cal_invite` cookie, 30 days, `?invite=CODE` one-time redirect |
