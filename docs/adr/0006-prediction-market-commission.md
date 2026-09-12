# Prediction-market price and commission assumption

## Decision

The calculator may compare a player-prop side against a manually entered binary event-market contract price in cents. A default quote of **56¢** is available alongside the existing **-110 sportsbook** quote. This is a price comparison only; it is not a predictive estimate, recommendation, wager route, or affiliate integration.

When a tester enters a commission percentage, Edge Cal models the fee as applying to the winning contract's profit, not to the returned stake. For a contract price `p` and commission `c`, the effective break-even probability is:

```text
p / (p + (1 - p) * (1 - c))
```

At 56¢ and 2% commission, the effective break-even is approximately 56.5%. The UI shows both the raw price and commission assumption so a tester can reproduce the calculation.

## Why

Different event markets publish different fee schedules. Hiding a fee inside a generic probability would make a comparison look more precise than it is. An explicit, adjustable commission assumption keeps the beta auditable and lets the eventual venue-specific adapter replace this neutral model without changing the historical evidence engine.

## Guardrails

- Price is constrained to 1¢–99¢ and commission to 0%–25%.
- The selected pricing mode, price, and commission are persisted with a saved snapshot.
- The output uses historical hit rate and neutral descriptive language; it does not expose an estimated probability or model edge.
- Venue-specific fee schedules require a separate legal, product, and data-source review before launch.
