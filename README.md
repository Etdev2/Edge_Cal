# Edge_Cal — Calculates The Sports Edge
**NBA + NFL Player-Prop Historical Evidence Comparator · Bankroll & Stake Sizing · Analysis-Only 21+ Beta**

Next.js (App Router) + PostgreSQL + Drizzle ORM. See `HANDOFF.md` for the Battle → Model mode
resume guide and `docs/PRODUCTION_RUNBOOK.md` for deployment and operations.

## 1-click Deploy to Vercel
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Etdev2/Edge_Cal)

1. Import `Etdev2/Edge_Cal` on Vercel (Framework: Next.js — auto-detected)
2. Add Environment Variables:
   - `DATABASE_URL` = Postgres URL (Neon / Supabase / Vercel Postgres) — **required**
   - `BALLDONTLIE_API_KEY` = optional, server-only
   - `INVITE_CODE` = optional, enables invite gating for the beta
   - `NEXT_PUBLIC_APP_URL` = optional (share links)
3. On a fresh Postgres: `npx drizzle-kit push` (migrations are committed in `drizzle/`)
4. Deploy. Healthcheck: `/api/health` → `{ "ok": true }`

## Local dev
```bash
npm install
cp .env.example .env
# edit .env → set DATABASE_URL
npx drizzle-kit push
npm run dev
```
No database? The app runs in a clearly-labeled demo mode (in-memory NBA + NFL dataset) so the
whole UI works locally and on Vercel build time.

## What's inside
- `/` — 30-sec rapid analysis, **NBA and NFL** tabs (player → market/line → odds or prediction-market price → evidence window → results)
- `/bankroll` — **Bankroll management**: EV per $100, full/fractional Kelly, max-stake cap, live example. Settings are browser-only (never sent to the server, per ADR 0005)
- Stake-sizing card in every analysis result (hit-rate default, optional manual win-probability override — always labeled illustrative)
- `/wayfinder` 10-ticket map, `/agents` 6-agent roster, `/explorer` 30 NBA + 32 NFL teams, `/snapshots` vault, `/compliance` glossary + prohibited-language scanner
- `src/lib/domain/` pure math (fully unit-tested): break-even, no-vig, Wilson 95%, hit-rate gap, hypothetical return, **EV + Kelly stake sizing**
- `src/db/schema.ts` Drizzle models (sport-scoped) + `src/lib/data/seed.ts` idempotent per-league auto-seed
- Hardening: per-route cache headers (CDN-friendly reads, `no-store` everywhere else), security headers, rate limiting, 21+ cookie gate, invite gating, committed migrations, CI (test → typecheck → lint → build)

## Sports & markets
| Sport | Markets | Evidence |
|---|---|---|
| NBA | PTS, REB, AST, 3PM, PRA, PTS+AST, PTS+REB, REB+AST, BLK, STL | 7 windows (season, L20, L10, L5, vs opponent, home, away), DNP exclusion, low-minute flag, OT included |
| NFL | PASS YDS, RUSH YDS, REC, REC YDS, TD (derived), TOTAL YDS (derived) | Same canonical windows + settlement semantics on 2026-season records |

## Domain rules
- `CONTEXT.md` canonical terms, `docs/adr/` architecture decisions
- Analysis-only, 21+, no wagering / affiliates / picks. Stake sizing is an arithmetic
  illustration on user inputs, never a recommendation. See `/compliance`.

## Handoff
- Start here: `HANDOFF.md` (also `docs/HANDOFF_OPTION_B.md`)
- Production: `docs/PRODUCTION_RUNBOOK.md`
