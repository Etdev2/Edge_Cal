# Phase 1 invite-only beta hardening checklist

**Branch:** `arena/01a09814-edge-cal` (continuation of `arena/01a097bb-edge-cal` merged at `604a495`)
**Scope:** prediction-market pricing plus Phase 1 invite-beta controls
**Date:** 2026-09-13 — Agent Swarm Completion

## Lane status — COMPLETE ✅

- [x] **AGENT-01 QUANT** — Vitest coverage for American odds, no-vig, Wilson/evidence settlement, and the 56¢ + 2% commission model. Expanded 14→55 tests: validation, break-even -110=52.38% / +150=40%, no-vig symmetric & asymmetric, Wilson n=0/small/large + 90/95/99% confidence, hit-rate above/below/inconclusive, prediction-market 56¢+2%=56.5% effective.
- [x] **AGENT-02 DATA** — committed Drizzle baseline migration (`drizzle/0000_abandoned_prism.sql` + meta) and a server-only BALLDONTLIE provider boundary (`import "server-only"`, 10s timeout, cursor pagination). Demo mode remains deterministic when no key/database is configured (35 games, DNP #14, low-minute #22, OT every 11th). Snapshot IDs use `crypto.randomUUID()` not Math.random.
- [x] **AGENT-03 UX** — 300 ms debounce with `AbortController` in `CalculatorStepper.tsx:236-239`, sportsbook/prediction-market toggle with `aria-pressed`, adjustable price 1¢-99¢ + commission 0%-25%, and `manifest.webmanifest` static route. Touch 44px+, quick chips, search autocomplete.
- [x] **AGENT-04 LEGAL** — HttpOnly age-confirmation cookie (`edge_cal_age_confirmed=1`, 30-day, secure in prod, sameSite lax) set via `/api/age-gate`, enforced in `/api/analysis` → 403 without. Optional `INVITE_CODE` middleware/API gate with cookie + `?invite=` one-time link, public paths allowlist. `/privacy`, `/terms` static, neutral analysis-only copy (Above/Inconclusive/Below).
- [x] **AGENT-05 CLOUD** — 30 requests per IP per minute on `POST /api/analysis` with in-memory bounded Map (prunes >1000), `Retry-After` on 429 (verified 429 at request 29), security headers (HSTS, X-Frame DENY, nosniff, etc.), and CI workflow `.github/workflows/ci.yml` (previously blocked by GitHub App permissions, now committed) running tests, typecheck, lint, build.
- [x] **AGENT-06 LEAD** — tracer checks for both pricing modes and this beta readiness checklist + completion report `docs/PHASE1_COMPLETION_REPORT_20260913.md`. All 55 tests pass, typecheck/lint/build green, demo fallback works.

## Tracer checks

With the app in demo mode and an age cookie set:

```bash
# Sportsbook path: break-even should be 52.4% for -110.
curl -X POST http://localhost:3000/api/analysis \
  -H 'Content-Type: application/json' \
  -H 'Cookie: edge_cal_age_confirmed=1' \
  -d '{"playerId":1,"pricingMode":"sportsbook","americanOdds":-110}'

# Prediction-market path: 56¢ + 2% should be 56.5% effective break-even.
curl -X POST http://localhost:3000/api/analysis \
  -H 'Content-Type: application/json' \
  -H 'Cookie: edge_cal_age_confirmed=1' \
  -d '{"playerId":1,"pricingMode":"prediction_market","predictionMarketPriceCents":56,"predictionMarketCommissionPct":2}'
```

Direct analysis requests without the age cookie return HTTP 403. The production build continues to use the demo fallback when `DATABASE_URL` is absent.

## Beta launch conditions still requiring operator setup

1. Set a strong `INVITE_CODE` in the Vercel preview environment.
2. Provision `DATABASE_URL` and run the committed Drizzle migration.
3. Provision and contract-review `BALLDONTLIE_API_KEY` before representing data as live.
4. Replace the in-memory rate limiter with a shared store before multi-region/public traffic.
5. Have counsel review the venue-specific commission schedule before adding a real venue integration.
