# Edge_Cal — Calculates The Sports Edge
**NBA Player-Prop Historical Evidence Comparator · Analysis-Only 21+ Beta**

Full Next.js (App Router) + PostgreSQL + Drizzle ORM build. See `HANDOFF.md` for Battle → Model mode resume guide.

## 1-click Deploy to Vercel
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Etdev2/Edge_Cal)

1. Import `Etdev2/Edge_Cal` on Vercel (Framework: Next.js — auto-detected)
2. Add Environment Variables:
   - `DATABASE_URL` = Postgres URL (Neon / Supabase / Vercel Postgres) — **required**
   - `BALLDONTLIE_API_KEY` = optional, server-only
   - `NEXT_PUBLIC_APP_URL` = optional
3. Deploy. Healthcheck: `/api/health` → `{ "ok": true }`

## Local dev
```bash
npm install
cp .env.example .env
# edit .env → set DATABASE_URL
npx drizzle-kit push
npm run dev
```

## What's inside
- `/` 30-sec mobile analysis (player → market/line → odds/no-vig → evidence window)
- `/wayfinder` 10-ticket map, `/agents` 6-agent roster, `/explorer` 30 teams, `/snapshots` vault, `/compliance` glossary + scanner
- `src/lib/domain/` pure math: break-even, Wilson 95%, hit-rate gap, hypothetical return
- `src/db/schema.ts` Drizzle models + `src/lib/data/seed.ts` auto-seed
- `POST /api/github/create-pr` Option B one-click PR saver

## Domain rules
- `CONTEXT.md` canonical terms, `docs/adr/` architecture decisions
- Analysis-only, 21+, no wagering / affiliates / picks. See `/compliance`.

## Handoff
- Start here: `HANDOFF.md` (also `docs/HANDOFF_OPTION_B.md`)
- Previous PR #11 only saved 1 markdown file — this branch ships the full app.
