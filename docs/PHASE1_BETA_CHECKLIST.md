# Phase 1 invite-only beta hardening checklist

**Branch:** `arena/01a097bb-edge-cal`
**Scope:** prediction-market pricing plus Phase 1 invite-beta controls

## Lane status

- [x] **AGENT-01 QUANT** — Vitest coverage for American odds, no-vig, Wilson/evidence settlement, and the 56¢ + 2% commission model.
- [x] **AGENT-02 DATA** — committed Drizzle baseline migration and a server-only BALLDONTLIE provider boundary. Demo mode remains deterministic when no key/database is configured.
- [x] **AGENT-03 UX** — 300 ms debounce with `AbortController`, sportsbook/prediction-market toggle, adjustable price/commission, and `manifest.webmanifest`.
- [x] **AGENT-04 LEGAL** — HttpOnly age-confirmation cookie, optional `INVITE_CODE` middleware/API gate, `/privacy`, `/terms`, and neutral analysis-only copy.
- [x] **AGENT-05 CLOUD** — 30 requests per IP per minute on `POST /api/analysis`, `Retry-After` on 429, and CI checks for tests, typecheck, lint, and build.
- [x] **AGENT-06 LEAD** — tracer checks for both pricing modes and this beta readiness checklist.

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
