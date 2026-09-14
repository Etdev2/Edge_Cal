# Edge Calculator — Business Potential & Profitability Evaluation

**Date:** 2026-09-14
**Subject:** `Etdev2/Edge_Cal` — NBA player-prop historical evidence comparator
**Analyst framing:** VC + startup CFO + strategy + operator + AI-automation architect
**Evidence base:** full repository review (source, ADRs, handoff/audit docs, test suite run) + external market research

> **Method note.** The prompt's `[INSERT BUSINESS IDEA]` and `[ADDITIONAL CONTEXT]` blocks were left empty. The idea was therefore reconstructed from the repository itself, and founder context was inferred. Every inferred item is labeled **[ASSUMPTION]** and §16/§22 show how the conclusion moves if an assumption is wrong.

---

## 0. Repository review — what actually exists (facts, not projections)

Verified by reading the code and running the suite on 2026-09-14:

| Item | Verified state |
|---|---|
| Stack | Next.js 16.3.5 App Router, React 19, PostgreSQL + Drizzle 0.45, Tailwind 4, Vercel-targeted |
| Test suite | `npm test` → **55 passed / 55** across `odds`, `statistics`, `evidence`, `predictionMarket` |
| Domain engine | `src/lib/domain/` — break-even, no-vig, Wilson 95%, hit-rate gap, hypothetical return, 10 markets, 7 evidence windows, DNP/low-minute/OT rules. ~800 LOC of genuinely correct, pure, tested math |
| Prediction-market pricing | `predictionMarket.ts` — cents pricing (1¢–99¢) + commission (0–25%), break-even `p / (p + (1-p)(1-c))`; 56¢ @ 2% → 56.5% |
| Hardening | HttpOnly 21+ cookie w/ server enforcement (403), optional `INVITE_CODE` middleware gate, 30 req/IP/min limiter, HSTS + frame/nosniff/referrer headers, CI workflow, committed Drizzle migration |
| Compliance surface | `CONTEXT.md` 15-term controlled glossary, `PROHIBITED_WORDS` + live `scanTextForCompliance()`, `/privacy`, `/terms`, 1-800-GAMBLER, neutral Above/Inconclusive/Below language |
| Product surface | `/` 5-step <30s stepper, `/wayfinder`, `/agents`, `/explorer`, `/snapshots` (immutable, exportable), `/compliance` |

**Engineering quality is well above the median pre-revenue prototype.** The math is right, the language discipline is unusual, and the hardening work is real.

### Three facts that dominate the economics

**Fact 1 — There is no real data in the product.** `createBallDontLieClient()` is defined in `src/lib/data/balldontlie.ts` and **is never called from anywhere in the codebase** (verified by grep across `src/`). Every number a user sees comes from `memoryFallback.ts` / `seed.ts`: 12 synthetic players, ~35 procedurally generated games each, with a scripted DNP at game #14 and a low-minute game at #22. The product is a correct calculator wrapped around fictional inputs.

**Fact 2 — The product currently misrepresents that data.** `Footer.tsx:122` renders *"Licensed Data: BALLDONTLIE NBA API · Server-side Cached"*, `api/analysis/route.ts:396` returns `source: "BALLDONTLIE_API (Normalized & Cached)"`, and `snapshots/[id]/page.tsx:200` stamps saved records *"Licensed BALLDONTLIE Source"* — all on synthetic data, with no key provisioned and no license signed. This is a **launch blocker, not a polish item**: shipping it to even an invited beta is a plain-language false statement about data provenance (FTC Act §5 / state UDAP exposure), and it silently invalidates every tester signal you would collect. *Recommended immediate fix: source label driven by actual provenance, `DEMO — SYNTHETIC DATA, NOT REAL NBA RESULTS` banner until a key is live.*

**Fact 3 — The business model has been deliberately amputated.** `docs/adr/0003-launch-as-analysis-only.md` forbids sportsbook feeds, wager placement, sportsbook connections, **affiliate links**, personalized alerts, and outcome-based compensation. `ADR-0004` further gates all predictive output behind a validation gate that does not yet exist. Affiliate revenue is how essentially every profitable company in this category actually makes money. ADR-0003 is defensible — it is also the single largest voluntary reduction in this business's revenue ceiling, and it must be treated as a *pricing* decision, not just a legal one.

---

## 1. Idea summary

**What is being built.** A mobile-first web tool that takes a single NBA player prop (player → market → line → side → price) and, in under 30 seconds, shows: the probability that price requires to break even, the historical hit rate of that exact line in a user-chosen evidence window, a Wilson 95% interval around that rate, the gap between the two, and an explicitly-labeled hypothetical return. It supports both American sportsbook odds and binary event-contract pricing in cents with an adjustable commission. It never tells you what to bet.

**Who is the customer.** A 21+ recreational-to-semi-serious NBA prop bettor in a legal US state, or a prediction-market trader pricing a player contract. **[ASSUMPTION]** Median user is male, 25–40, bets $20–200/week, uses 2–4 apps, and already reads box scores.

**What problem it solves.** Sportsbooks quote a price; bettors have no fast, honest way to see what that price implies and whether the recent record supports it. The status quo is manual box-score scrolling, a Twitter graphic of unknown provenance, or a "projection" from a tool that won't show its work.

**Why someone would pay.** Speed (30s vs. 10 minutes of scrolling), reproducibility (immutable snapshots you can re-open and export), and honesty about uncertainty (a small sample is shown as *inconclusive* instead of dressed up as a 70% hit rate).

**Likely business model.** Freemium consumer subscription, ~$9–19/month, with a free tier of limited daily analyses.

**Potential competitive advantage.** Three candidates, in descending order of realism: (1) the controlled-vocabulary compliance layer — the glossary, prohibited-word scanner, and immutable audit snapshots are a genuine, uncommon asset; (2) prediction-market-native pricing math with an explicit, auditable commission assumption, at a moment when that market is growing fast; (3) trustworthiness as positioning in a category full of touts. The core statistics are **not** an advantage — they are textbook.

**What must be true to succeed.**
1. A meaningful number of prop bettors will pay for *evidence* rather than for *picks*.
2. A repeatable customer acquisition channel exists that does not require paid ads (gambling-adjacent paid acquisition is largely closed).
3. Monthly churn can be held under ~8% despite an NBA-only, 8-month season.
4. A real, licensed, correction-aware data pipeline can be operated for <$500/month at beta scale.
5. Either ADR-0003 relaxes toward a compliant revenue path, or the subscription alone clears CAC — currently it does not, at the assumed inputs.

### Investment thesis (5 sentences)

Edge Calculator is a technically excellent, economically constrained product: the code is built, correct, tested and nearly deployable, which removes most execution risk from the *build* while removing none from the *business*. It enters a category where the commodity is the math — break-even and hit rate are free, public formulas — and the scarce goods are licensed data, distribution, and trust, of which it currently has none, none, and a plausible claim to the third. Its own architecture decisions forbid affiliate revenue, the category's dominant monetization, leaving a consumer subscription whose LTV:CAC pencils to roughly 1.5:1 under realistic churn — below the viability threshold. The probability-weighted expected value is approximately **$70K/year of profit and ~$390K of enterprise value at year 3**, which is attractive against a ~$10K cash outlay and unattractive against a full-time founder's opportunity cost. The correct action is therefore not to build more, but to spend under $5,000 and six weeks testing willingness-to-pay and one distribution channel against pre-committed kill criteria — while separately taking ten discovery calls on the B2B compliance-infrastructure angle, which is where the genuinely asymmetric upside sits.

---

## 2. Market opportunity

### External data points (cited)

- Props plus prop-based same-game parlays represent roughly **35–50% of total NBA-season handle** at major US books; in Q1 2026, SGP/SGP+ tickets were 41% of NBA handle at DraftKings, 38% at FanDuel, 33% at BetMGM.
- US sports betting revenue is forecast at roughly **$22B in 2026**; the global market is ~$125B, with basketball at 15–18% of handle.
- A typical March 2026 Tuesday slate listed **~14,200 individual NBA markets** across the seven largest US books — the surface area the tool addresses is enormous.
- Prediction markets are growing violently: combined Kalshi + Polymarket monthly volume went from **<$5B (Sep 2025) to $44.8B (Jun 2026)**; ~87% of Kalshi's trailing-year $39.7B was sports.
- Competitor price points: **Outlier ~$35/mo, OddsJam ~$39–199/mo, PropsBot $49.99/mo, BettingPros $19.99/mo ($99/yr), Props.Cash free-tier + paid.**
- Data cost: **BALLDONTLIE ALL-STAR $9.99/mo**; player props / odds / box scores sit on the **$39.99/mo** tier; enterprise alternatives are SportsDataIO / Sportradar.

### Sizing

TAM/SAM/SOM here must be built bottom-up, because "US sports betting is $22B" says nothing about what people pay for *tools*. **[ASSUMPTION — derived, not sourced]** The paid betting-research-tool market (OddsJam, Outlier, Unabated, Props.Cash, BettingPros, OddsShopper, Pikkit, DarkHorse, et al.) plausibly supports **300K–600K paying subscribers** at a $25–45 blended monthly price.

| Layer | Estimate | Derivation |
|---|---|---|
| **TAM** — all paid betting research/tools subscriptions, US | **$250M–$500M/yr** | 300–600K subs × $25–45/mo × 12, discounted for churn-adjusted active base |
| **SAM** — NBA-weighted player-prop research tools, US, English | **$50M–$120M/yr** | NBA ≈ 20–25% of tool usage (NFL dominates); prop-specific subset |
| **SOM** — realistically obtainable by this product in 3 yrs | **$1M–$3M/yr** | Solo/indie, no affiliate revenue, no projections, no live data today, no audience. Reaching the top of this range would be a top-decile indie outcome |

> **Rule 14 compliance:** TAM is context, not evidence of capture. The only number that should drive decisions here is SOM, and SOM is small.

### Market characteristics

| Dimension | Assessment |
|---|---|
| Target customer | 21+ NBA prop bettor in a legal state; secondary: event-contract trader |
| Purchasing power | Moderate-to-good — this cohort already spends $50–500/mo on the activity itself; but they perceive tool spend as a *tax on* their bankroll, not an investment |
| Market growth | **Strong.** Props share rising, prediction-market volume up ~9x in 8 months |
| Market maturity | **Mid-to-late** for sportsbook tools (established leaders, known price points); **early** for prediction-market-native tooling |
| Competitive intensity | **High.** Well-funded incumbents, many free substitutes, near-zero switching cost |
| Existing alternatives | Props.Cash, Outlier, OddsJam, BettingPros, PropsBot, StatMuse, free Reddit/Discord spreadsheets, the books' own "trends" tabs, and ChatGPT |
| Fragmentation | **High** — dozens of small tools, no single dominant prop-research brand |
| Barriers to entry | **Low.** Data is $10–40/mo. The math is public. A competent developer replicates the core in 2–3 weeks |

**Market Opportunity Score: 6/10** — real, growing, monetizable demand; but crowded, low-barrier, and the obtainable slice is small.

### Capture required (at $12/mo, ~$110 blended annual ARPU after annual-plan mix)

| Annual revenue | Paying subs needed | % of SAM ($80M mid) | % of SOM ($2M mid) | Realism |
|---|---|---|---|---|
| $100K | ~910 | 0.13% | 5% | Achievable — top ~20% of attempts |
| $500K | ~4,550 | 0.63% | 25% | Hard — requires a working repeatable channel |
| $1M | ~9,100 | 1.25% | 50% | Very hard — implies category top-5 position |
| $5M | ~45,500 | 6.3% | 250% | Requires abandoning ADR-0003 and going multi-sport |
| $10M | ~91,000 | 12.5% | 500% | Not reachable on this thesis; a different company |

The honest read: **$100K is a fair target, $1M is a stretch, and $5M+ requires a different business.**

---

## 3. Business model

### Ranked monetization options

| Rank | Model | Fit | Notes |
|---|---|---|---|
| 1 | **Consumer subscription (freemium)** | Strong fit, weak economics | $9–19/mo; category-standard; churn is the problem |
| 2 | **B2B licensing — compliance & audit layer** | **Underrated; highest EV/hour** | The glossary + prohibited-language scanner + immutable snapshot trail is infrastructure a regulated operator or a prediction-market exchange would pay $2K–15K/mo for. Nobody else packages it |
| 3 | **API / embed for media & creators** | Good | Per-call pricing for podcasts, newsletters, Discords that want defensible on-screen numbers |
| 4 | **Prediction-market venue partnership** | High-variance | Neutral "evidence layer" inside/next to an exchange — see CFTC risk in §12 |
| 5 | **Affiliate** | **Blocked by ADR-0003** | The category's actual profit engine. Excluded by choice |
| 6 | Usage-based / credit packs | Moderate | Fits seasonality better than monthly subs |
| 7 | Advertising | Poor | Needs traffic this will not have for years |
| 8 | Data resale | Poor | You don't own the data; the license forbids it |
| 9 | Professional services | Poor | Not scalable, not the thesis |

**Recommendation: lead with (1), price-anchor below Outlier at $12/mo, and run (2) in parallel as customer discovery — (2) is where the asymmetry is.**

### Unit economics **[ALL FIGURES ASSUMPTIONS — ranges, not forecasts]**

| Metric | Low | Base | High | Basis |
|---|---|---|---|---|
| Price | $9/mo | **$12/mo** | $19/mo | Undercuts Outlier ($35) / OddsJam ($39); "evidence not picks" can't command premium pricing |
| Blended annual ARPU | $80 | **$110** | $170 | Assumes ~30% take annual at ~2 months free |
| COGS/sub/mo @1K subs | $2.00 | **$1.20** | $0.60 | Data $40–500/mo + Vercel/Neon $20–200/mo + Stripe ~3% |
| **Gross margin** | 78% | **88%** | 93% | Software economics hold; data cost is near-fixed |
| **CAC (organic-weighted)** | $80 | **$55** | $25 | Content/SEO/Reddit/Discord. Paid social & search largely closed to gambling-adjacent (see §14) |
| **Monthly churn** | 14% | **9%** | 6% | Betting tools churn hard; NBA-only adds a June–October cliff |
| Avg customer lifetime | 5.5 mo | **8 mo** | 13 mo | 1/churn, haircut for seasonality |
| **LTV (gross-margin)** | $41 | **$85** | $195 | ARPU/mo × GM × lifetime |
| **LTV:CAC** | 0.5:1 | **1.5:1** | 7.8:1 | **Base case is below the 3:1 viability bar** |
| Contribution margin/sub/mo | $7.00 | **$10.40** | $17.10 | |
| Fixed monthly cost (beta) | — | **$550–900** | — | Data $40–500, hosting $50–200, Redis $10, monitoring, amortized legal |
| **Break-even sub count (cash)** | — | **~55–90** | — | Excludes founder labor |
| Break-even with 1 contractor ($60K/yr) | — | **~570** | — | Includes $5K/mo labor |

**The single most important number in this document is LTV:CAC ≈ 1.5:1 in the base case.** At that ratio you cannot buy growth; you can only grow through unpaid channels, which caps growth rate at the founder's content output. Moving churn from 9% → 6% and CAC from $55 → $35 flips the business (LTV:CAC ≈ 4.2:1). Those two numbers *are* the business.

---

## 4. Probability distribution of outcomes

This is **not** normally distributed. It is a left-heavy, right-skewed indie-software distribution: most attempts die quietly, a meaningful minority become small profitable businesses, and a thin tail reaches scale. Survivorship bias is explicitly priced in — the reference class is "solo founder ships a well-built niche betting tool with no audience," where base rates of reaching $100K ARR are low.

### Scenarios

**FAILURE — 55%.** Shut down, or dormant, by month 9–18. Free users show up, conversion lands under 1.5%, churn runs 12%+, no channel compounds. Cumulative revenue <$25K, cumulative cash loss $5–20K, plus 600–1,200 founder hours.

**LOW — 22%.** Poor execution or weak adoption; survives as a hobby.

**BASE — 15%.** Competent execution, one working content channel, real data shipped, 1,500–2,500 subs by year 3.

**HIGH — 6%.** Strong execution: a creator/partnership channel compounds, multi-sport expansion, churn controlled near 6%.

**PRECISION / UPSIDE — 2%.** Exceptional product + distribution + timing: becomes the trusted neutral evidence layer for prediction-market props, or is acquired by an exchange, book-adjacent platform, or odds provider for the compliance/audit stack.

### Forecast grid (revenue = annualized run-rate at that date; valuation = 3× ARR or ~4× SDE, discounted for regulatory/churn risk)

| Scenario | | 6 mo | 12 mo | 24 mo | 36 mo | 5 yr |
|---|---|---|---|---|---|---|
| **LOW** (22%) | Revenue | $1K | $8K | $20K | $25K | $20K |
| | Profit | –$3K | –$1K | $6K | $10K | $6K |
| | Valuation | ~$0 | ~$10K | ~$40K | ~$40K | ~$25K |
| **BASE** (15%) | Revenue | $3K | $45K | $130K | $200K | $300K |
| | Profit | –$5K | $12K | $70K | $110K | $170K |
| | Valuation | ~$0 | $135K | $400K | $600K | $900K |
| **HIGH** (6%) | Revenue | $12K | $150K | $450K | $800K | $1.5M |
| | Profit | –$8K | $50K | $200K | $380K | $700K |
| | Valuation | ~$30K | $500K | $1.5M | $2.4M | $5M |
| **UPSIDE** (2%) | Revenue | $30K | $400K | $1.4M | $3M | $7M |
| | Profit | –$10K | $120K | $600K | $1.6M | $3M |
| | Valuation | ~$100K | $1.6M | $6M | $12M | $30M |

### Derived probabilities

| Outcome | Probability | Reasoning |
|---|---|---|
| **Failure** (abandoned / <$25K cumulative) | **55%** | No audience, no data yet, commodity math, closed paid channels, high-churn vertical |
| **Sustainable small business** (≥$50K/yr durable profit) | **23%** | BASE + HIGH + UPSIDE |
| **>$100K annual profit** | **17%** | Requires ~1,200+ retained subs |
| **>$1M annual revenue** | **5%** | Upper half of HIGH + all of UPSIDE |
| **>$1M annual profit** | **2.5%** | Essentially the UPSIDE case only |
| **Worth $10M+** | **3%** | Needs ~$3M ARR at 3–4×, or a strategic acquisition |
| **Worth $100M+** | **0.3%** | Would require abandoning the current thesis entirely |

These are deliberately humble. The dominant driver of the 55% failure weight is not product quality — the product is good — it is the **absence of any demonstrated distribution channel or willingness-to-pay evidence**, combined with a self-imposed ban on the category's proven revenue model.

---

## 5. Expected value

`EV = Σ (P × Value)`, computed at the 36-month column.

**Expected annual revenue (yr 3)**
`(.55 × $8K) + (.22 × $25K) + (.15 × $200K) + (.06 × $800K) + (.02 × $3M)`
`= $4.4K + $5.5K + $30K + $48K + $60K` = **≈ $148K**

**Expected annual profit (yr 3)**
`(.55 × –$3K) + (.22 × $10K) + (.15 × $110K) + (.06 × $380K) + (.02 × $1.6M)`
`= –$1.65K + $2.2K + $16.5K + $22.8K + $32K` = **≈ $72K**

**Expected enterprise value (yr 3)**
`(.55 × $0) + (.22 × $40K) + (.15 × $600K) + (.06 × $2.4M) + (.02 × $12M)`
`= $0 + $8.8K + $90K + $144K + $240K` = **≈ $483K**

**Expected founder equity value:** ≈ **$483K** at 100% ownership. This business should take **$0 outside capital**, so no dilution haircut applies. (If it took a $250K seed at a $2M post for 12.5%, expected founder equity falls to ~$423K plus $250K of de-risked runway — a bad trade at this scale.)

### EV vs. required inputs

| Input | Requirement | Comment |
|---|---|---|
| Cash | $8K–25K (lean/recommended) | Trivially affordable; **excellent** ratio to $483K EV |
| Human labor | ~330 hrs remaining build + ~50 hrs/mo ongoing → **~2,100 hrs over 3 yrs** | This is the real cost |
| AI labor | ~420 hrs build + ~80 hrs/mo → ~$300–900/mo in tokens/tools | Cheap, and the founder clearly knows how to wield it |
| Opportunity cost | 2,100 hrs × $85–150/hr alternative = **$180K–$315K** | **This exceeds the EV of the enterprise value on a risk-adjusted, time-discounted basis if pursued full-time** |
| Time | 3 years to a $72K EV profit run-rate | Slow |

### Verdict on EV profile

- **As a full-time, founder-salary-replacing venture: POOR.** $483K expected value against $180K–$315K of opportunity cost and 3 years, with a 55% chance of zero, is not a rational full-time allocation.
- **As a capital-light, part-time (10–15 hrs/wk) venture: MARGINAL-TO-ATTRACTIVE.** $8–25K of cash against a $483K expected value, where the code is already a sunk asset, is a reasonable asymmetric bet *provided* kill criteria are honored.
- **Reframed as B2B compliance/audit infrastructure (§3 model #2): potentially ATTRACTIVE** — but that is currently an untested hypothesis, not a business.

**Overall: MARGINAL.** The EV is real but it is not large, and it is heavily contingent on two unvalidated variables.

---

## 6. Time to profitability

| Milestone | Low (fast) | **Most likely** | High (slow) | Notes |
|---|---|---|---|---|
| **Time to MVP** | **0 months** | **1–2 months** | 3 months | Code exists. "MVP" here means *credible*: live licensed data replacing synthetic, honest source labeling, paywall, Stripe |
| **First paying customer** | 2 mo | **4 mo** | 8 mo | Gated on real data + an audience to sell to |
| **Cash break-even** (~$700/mo fixed, ~60–90 subs) | 4 mo | **7–9 mo** | 18 mo / never (55%) | Excludes founder labor |
| **Meaningful profitability** ($100K/yr profit) | 18 mo | **30 mo** | 48 mo / never | 17% likely at all |
| **$100K annual revenue** | 9 mo | **14–20 mo** | 30 mo / never | ~910 subs |
| **$1M annual revenue** | 30 mo | **42–60 mo** | never | 5% likely |
| **$1M annual profit** | 42 mo | **60+ mo** | never | 2.5% likely |

**The rate limiter on every line in this table is distribution, not engineering.** Note that the "Time to MVP ≈ 0" advantage is worth less than it appears: shipping early into a channel you don't have just means failing sooner. That is not entirely bad — see §17.

---

## 7. Capital requirements

| Category | **Lean** | **Recommended** | **Aggressive** |
|---|---|---|---|
| Development | $0 (founder + AI) | $3,000 (design polish, a11y pass) | $120,000 (PT engineer 12 mo) |
| Infrastructure / cloud | $300/yr (Vercel Hobby→Pro, Neon free→$19) | $1,200/yr | $6,000/yr (multi-region, Redis, CDN) |
| AI / API costs | $600/yr | $2,400/yr | $12,000/yr |
| **Data licensing** | $480/yr (BALLDONTLIE ALL-STAR) | $1,200/yr (props/odds tier) | $25,000/yr (SportsDataIO/Sportradar w/ commercial rights) |
| Legal | $1,500 (basic ToS/privacy review) | **$12,000** (multi-state advisory-services opinion + data-license review + prediction-market framing) | $45,000 (counsel retainer, per-venue reviews) |
| Insurance (E&O/cyber) | $0 | $1,800/yr | $6,000/yr |
| Marketing | $0 | $10,000 (content, creator seeding) | $80,000 (creator deals, sponsorships) |
| Sales | $0 | $0 | $30,000 (B2B BD contractor) |
| Employees / contractors | $0 | $4,000 (part-time support/content) | $60,000 |
| Hardware | $0 | $0 | $2,000 |
| Customer service | $0 (founder) | $1,200 (helpdesk tooling) | $18,000 |
| Compliance | $0 | $2,000 (geo/age vendor eval) | $15,000 |
| Working capital | $500 | $5,000 | $40,000 |
| Contingency (15%) | $500 | $6,500 | $70,000 |
| **TOTAL (year 1)** | **$4,000–8,000** | **$50,000–60,000** | **$530,000** |

*Note: the "Recommended" legal line is the one most founders skip and most regret. A product that computes betting break-evens, is marketed to bettors, and touches event-contract pricing sits close to several state advisory-service and gambling-promotion regimes; $12K of counsel is cheap relative to a cease-and-desist that arrives after you have customers.*

| Question | Answer |
|---|---|
| **Capital before first revenue** | **$4,000–$12,000** (data + hosting + minimal legal + Stripe) |
| **Capital before break-even** | **$8,000–$25,000** (lean path, ~7–9 months of fixed costs) |
| **Total outside funding requirement** | **$0 — and it should stay $0.** This is not a venture-shaped outcome distribution (3% chance of $10M+). Taking institutional money here misaligns the founder with the most likely good outcome (a $150–300K/yr profitable business) |

---

## 8. Human hours vs. AI hours

**Definitions used.** *AI-assisted* = a human frames the task, reviews and owns the output (code, copy, analysis). *AI-automated* = the workflow runs on a schedule or trigger with spot-checking only (ingestion, monitoring, first-line support triage, content drafting).

### Initial build — remaining work only (the ~1,200 hours already spent are sunk)

| Area | Human hrs | AI hrs | Automatable | Notes |
|---|---|---|---|---|
| Initial research (market, competitor, legal landscape) | 25 | 60 | 70% | AI does the sweep; human judges |
| Product design | 30 | 40 | 40% | Taste is not automatable |
| Software development (live data pipeline, paywall, source honesty fix, Redis limiter) | 90 | 180 | 60% | The heaviest remaining line |
| Content / data creation (SEO pages, glossary explainers, launch assets) | 35 | 120 | 75% | AI drafts, human edits for credibility — betting audiences detect AI slop instantly |
| Marketing (channel setup, community presence) | 60 | 40 | 25% | **Must be human.** Reputation in betting communities is person-to-person |
| Sales (B2B discovery calls) | 30 | 10 | 10% | Not automatable |
| Legal / compliance | 20 | 25 | 30% | AI prepares; a licensed attorney must sign |
| Customer support setup | 10 | 15 | 60% | |
| Operations (monitoring, runbooks, ingestion cron) | 20 | 40 | 70% | |
| Accounting / finance setup | 6 | 8 | 60% | Stripe + bookkeeping |
| Product maintenance | 10 | 30 | 70% | |
| Administration (entity, banking, vendor contracts) | 12 | 6 | 25% | |
| **INITIAL TOTAL** | **~348 hrs** | **~574 hrs** | **~55%** | ≈ 9 focused weeks at 40 hrs/wk, or 5–6 months part-time |

### Ongoing monthly operations (post-launch, ~500–1,500 subs)

| Area | Human hrs/mo | AI hrs/mo | Automatable |
|---|---|---|---|
| Data ops / ingestion QA / corrections | 6 | 25 | 75% |
| Content & SEO | 10 | 45 | 70% |
| Marketing & community | 14 | 12 | 20% |
| Sales (B2B pipeline) | 6 | 4 | 15% |
| Customer support | 8 | 18 | 65% |
| Product development | 10 | 35 | 60% |
| Legal / compliance monitoring | 2 | 6 | 40% |
| Accounting / admin | 2 | 5 | 70% |
| **ONGOING TOTAL** | **~58 hrs/mo** | **~150 hrs/mo** | **~60%** |

### Biggest remaining human bottlenecks

1. **Distribution and credibility.** This is the binding constraint. Trust in betting communities is earned by a *person* posting consistently, being publicly wrong sometimes, and answering skeptics. AI-generated presence in this vertical is detected and punished with unusual speed. **Not automatable at any price.**
2. **Data correctness incidents.** When a stat line is wrong — and it will be, via corrections and DNP edge cases — a human must diagnose and communicate. Every wrong number in a betting tool costs disproportionate trust.
3. **Legal judgment.** State-by-state advisory regimes, data-license terms (the handoff already flags that BALLDONTLIE's terms *contradict on competing-product use*), and prediction-market framing all need a licensed human.
4. **Adversarial support.** Users who lose money are an emotionally difficult support population. Automation handles the volume, not the hard 10%.

---

## 9. Founder leverage

| Dimension | Assessment |
|---|---|
| Revenue per founder hour | Base case yr 3: $200K ÷ ~700 hrs/yr ≈ **$285/hr**. Blended across all scenarios (EV $148K ÷ 700) ≈ **$210/hr** |
| Profit per founder hour | Base yr 3: $110K ÷ 700 ≈ **$157/hr**. EV-weighted ≈ **$103/hr** |
| Ability to delegate | **Moderate.** Engineering and content delegate well; community presence and data-trust incidents do not |
| Ability to automate | **High for operations (~60%), low for growth.** The founder has already demonstrated unusual AI-agent leverage — six-agent swarm workflows, docs-as-contracts, ADRs, tests-as-evidence |
| Need for specialized employees | **Low.** No quants, no sales team, no ops staff required at base scale |
| Operational complexity | **Low-to-moderate.** Stateless calculator + nightly ingestion is a simple system |
| Founder dependency | **High.** The brand, the trust, and the channel are all the founder |

**Founder Leverage Score: 6/10.** The product side is genuinely high-leverage and the founder's AI-operating model is a real edge. It is dragged down by a distribution function that is irreducibly founder-bound and by an 8-month sport season that caps annual output.

---

## 10. Scalability

| Dimension | Score | Note |
|---|---|---|
| Technical | 9/10 | Stateless compute, pure functions, serverless. Trivially scalable |
| Operational | 6/10 | Data ingestion, corrections, and support scale sub-linearly but not free |
| Geographic | 4/10 | US-legal-state-bound; gambling regulation is per-jurisdiction |
| Customer | 8/10 | Self-serve, no onboarding, no implementation |
| Distribution | 3/10 | **The bottleneck.** No paid channel, no viral loop, founder-bound organic |
| AI automation | 7/10 | ~60% of ongoing ops automatable |
| Marginal cost | 9/10 | Near-zero per additional analysis; data cost is fixed, not per-user |
| International | 3/10 | NBA has global audience but licensing, payments, and law do not travel |

**Scalability Score: 7/10** (weighted toward technical/marginal-cost, penalized on distribution and geography).

### What breaks first, at each scale

| Users | What breaks |
|---|---|
| **100** | Nothing technical. **The synthetic data breaks** — the first knowledgeable tester checks a real box score, sees the numbers are fake, and the "Licensed Data: BALLDONTLIE" footer converts a bug into a credibility event |
| **1,000** | (a) **`rateLimit.ts` in-memory Map is per-lambda** — on Vercel it neither limits correctly nor shares state across instances; (b) BALLDONTLIE's 60 req/min ceiling forces a real cached ingestion job rather than read-through; (c) support becomes a daily task; (d) Neon free tier connection limits |
| **10,000** | (a) `analysisSnapshots.gameEvidence` jsonb grows unbounded — the audit already flags this; (b) need a proper nightly ingestion + correction re-fetch pipeline with backfill; (c) data license tier must be renegotiated for commercial redistribution volume; (d) first support hire; (e) Postgres needs indexes reviewed and read replicas |
| **100,000** | (a) Enterprise data license ($25–50K/yr) becomes mandatory and possibly contested; (b) per-state compliance surface (geolocation, responsible-gaming, advisory registration) becomes a real legal program; (c) real infra team; (d) at this scale you are visible enough to attract both regulators and incumbent competitors |
| **1,000,000** | Not reachable on the current thesis. This would require multi-sport, affiliate or transaction revenue, and a capital structure this business shouldn't have |

---

## 11. Defensibility / moat

| Source | Present? | Strength |
|---|---|---|
| Brand | Not yet | Potentially the best available moat — "the honest one" |
| Network effects | **No** | Single-player tool. No liquidity, no UGC loop |
| Proprietary data | **No** | Licensed from a $10/mo vendor anyone can buy |
| AI/data flywheel | **No** | No model, and ADR-0004 gates one behind a validation regime that doesn't exist |
| Switching costs | **Very low** | Snapshots are exportable (a user-friendly choice that reduces lock-in) |
| Community | Not yet | Buildable; slow; founder-bound |
| Distribution | **No** | Zero owned audience today |
| Patents / IP | **No** | Break-even and Wilson intervals are not patentable |
| Partnerships | **No** | None signed |
| Marketplace liquidity | N/A | |
| Cost advantage | Marginal | Solo + AI keeps opex very low — real, but not durable |
| First-mover | **No** | Props.Cash and Outlier long predate this |
| **Regulatory advantage** | **Emerging — the genuine one** | The controlled glossary, prohibited-language scanner, 21+ server enforcement, immutable audit snapshots, and ADR trail constitute a *compliance posture* competitors would need months and counsel to replicate. This is the most defensible asset in the repo, and it is currently being spent on a consumer tool that doesn't value it |
| Technical advantage | Marginal | Correct, tested math — necessary, not sufficient |
| User-generated data | **No** | Snapshots aren't aggregated into anything |

**Moat Score: 3/10.**

### "What prevents a better-funded competitor from copying this?"

**Essentially nothing, on the consumer product.** OddsJam or Outlier could ship break-even + hit-rate + Wilson intervals in a two-week sprint, on top of data feeds and audiences they already have. The formulas are public, the data is $40/month, and there is no proprietary asset. Realistically, they *haven't* not because they can't, but because they've judged that "inconclusive" is a worse conversion story than "+EV bet found" — which is itself a warning about §3's willingness-to-pay assumption.

**The honest answer is that the defensible thing is not the calculator — it is the compliance and auditability layer.** A well-funded competitor can copy the math trivially and the compliance posture only slowly, because it requires an opinionated language contract, a legal review, and the discipline to *not* say "lock." If this business is going to have a moat, that is where it is, and that argues for the B2B path in §3.

---

## 12. Risk analysis

| # | Risk | Prob. | Impact | Mitigation |
|---|---|---|---|---|
| 1 | **Data misrepresentation (live in repo today)** — "Licensed BALLDONTLIE" labels on synthetic data | **High** | **Critical** | Fix before *any* external user. Provenance-driven labels + explicit DEMO banner. ~2 hours of work; the cheapest risk elimination in this document |
| 2 | **Customer acquisition failure** — no channel compounds | **High** | **Critical** | Validate one channel *before* more building (§18 Phase 1). Kill criteria in §17 |
| 3 | **Willingness-to-pay failure** — users want picks, not evidence | **High** | **Critical** | Fake-door price test; paid pilot before building billing |
| 4 | **Retention/churn** — 12%+ monthly, plus June–Oct dead season | **High** | **High** | Annual plans at a real discount; off-season content/other sports; usage-based credits |
| 5 | **Competitive** — incumbent ships the same feature | **Medium** | **High** | Move to the compliance/B2B position where copying is slower |
| 6 | **CFTC prop prohibition** — the June 10, 2026 proposed rule would permit outcome contracts but **prohibit discrete in-game props** as manipulable | **Medium-High** | **High** | Directly threatens ADR-0006's prediction-market pricing mode. Do **not** build further on this path until the rule finalizes; keep the module but don't market it |
| 7 | **Data license** — handoff already notes BALLDONTLIE terms *contradict on competing-product use* | **Medium** | **High** | Get written clearance before paid launch; price a SportsDataIO fallback |
| 8 | **Legal/regulatory (state advisory regimes)** | **Medium** | **High** | The $12K legal line in §7 exists for this. ADR-0003's conservatism is genuinely protective here |
| 9 | **Platform dependency** (Vercel, Neon, Stripe, data vendor, ad platforms' gambling policies) | **Medium** | **Medium** | Portable stack; the ad-policy dependency is the one that actually bites (§14) |
| 10 | **Execution** — scope drift toward more features instead of customers | **Medium-High** | **High** | The repo shows a pattern worth naming: extensive infrastructure, agent rosters, and Wayfinder maps built *before* a single real user. Hard-cap build hours until §18 Phase 1 passes |
| 11 | **Technical** | **Low** | Low | Code quality is high; 55 tests; the known gaps (Redis limiter, ingestion) are ordinary |
| 12 | **Financial** | **Low** | Low | Capital at risk is $4–25K. This risk is well-controlled |
| 13 | **AI dependency** | Low | Low | AI is a productivity input, not a product dependency |
| 14 | **Key-person / founder** | **High** | **High** | Entirely founder-dependent for brand, channel, and judgment. Unmitigable at this stage; accept it |
| 15 | **Reputational — one wrong number** | Medium | High | Immutable snapshots + correction policy + visible freshness badges (already specced as P1-12) |

**Risk Score: 7/10** (1 = extremely low, 10 = exceptionally high). Financial and technical risk are genuinely low; market, distribution, willingness-to-pay, and regulatory risk are all high, and they are the ones that determine the outcome.

---

## 13. Return on capital

| Metric | Value |
|---|---|
| Expected capital requirement | **$25,000** (recommended path, year 1) |
| Expected annual profit at maturity (EV-weighted, yr 3) | **$72,000** |
| Base-case annual profit at maturity | $110,000 |
| **Potential ROI (EV basis)** | **~288% annually on deployed capital** at year 3 |
| Base-case ROI | ~440% annually |
| **Payback period** | **7–14 months** in base case; never in the 55% failure case |
| **EV-adjusted payback** | ~18 months |
| Revenue per dollar invested (EV, yr 3) | **$5.92** |
| Profit per dollar invested (EV, yr 3) | **$2.88** |
| Enterprise value per dollar invested (EV, yr 3) | **$19.30** |

**Capital Efficiency: 8/10.** This is the strongest number in the analysis and it deserves emphasis: as a *use of money*, this is excellent — tiny capital requirement, high gross margin, most of the build already sunk, no inventory, no headcount. The constraint is not capital; **it is founder time and distribution.** The trap is reading the 8/10 capital efficiency as a green light when the binding constraints score 3–4/10.

---

## 14. Distribution & customer acquisition

| Channel | Viability | Assessment |
|---|---|---|
| **Organic search / SEO** | **Strongest** | Long-tail programmatic pages — *"[Player] points over/under [line] hit rate last 10 games"* — map perfectly onto ~14,200 daily NBA markets. High intent, compounding, zero marginal cost, and it plays to the product's actual strength. **This is the channel** |
| Content marketing | Strong | Methodology posts, "why your 70% hit rate is inconclusive" — differentiates on honesty |
| Communities (Reddit r/sportsbook, Discord, X) | Strong but slow | Requires genuine founder presence over months; highly effective when earned, brutally punished when faked |
| Viral / referral loops | Moderate | Shareable snapshot links already built — a real, underused asset. Make snapshots beautiful and public-by-default |
| Partnerships | Moderate | Podcasts/newsletters wanting defensible on-screen numbers; ties to the API model |
| Influencers / creators | Moderate | Expensive, and most betting creators monetize via affiliate — structurally misaligned with ADR-0003 |
| Affiliates | **Blocked** | ADR-0003 |
| **Paid acquisition** | **Largely closed** | Google and Meta restrict gambling and gambling-adjacent advertising; "analysis-only" tools are routinely caught by the same filters. Assume paid is unavailable, or available at punitive CAC |
| App stores | **Restricted** | Gambling-adjacent apps face review friction and 21+/geo requirements; PWA sidesteps this — a point in favor of the current architecture |
| Direct sales | N/A consumer | **Highly relevant for the B2B path** |
| Enterprise sales | Relevant only for B2B path | 6–12 month cycles, but $2–15K/mo contracts |
| Social media (organic) | Moderate | Daily "evidence card" posts are cheap and on-brand |

**Strongest likely channel: programmatic SEO on player/line/window long-tail queries, compounded by shareable snapshot links, seeded by genuine founder presence in 2–3 communities.**

**Customer acquisition difficulty: DIFFICULT.** Not *extremely* difficult — the SEO surface is real and the product genuinely fits it — but the closure of paid channels removes the ability to buy your way out of a slow start, and the founder has no existing audience **[ASSUMPTION]**.

**Distribution Score: 4/10.**

---

## 15. Competitive position

| Competitor | Strengths | Weaknesses | Pricing | Position | Why switch to Edge Cal | What Edge Cal could do better |
|---|---|---|---|---|---|---|
| **Props.Cash** | The default prop-trends tool; deep filters; strong brand | Trend-mining invites cherry-picking; no uncertainty quantification | Free tier + paid | Category leader in prop trends | Statistical honesty; Wilson intervals; push handling | Be the tool that tells you when the sample is too small |
| **Outlier.bet** | Slick UX, projections, +EV surfacing | Projections are opaque; "trust us" model | ~$35/mo | Premium prosumer | Transparency, reproducibility, 1/3 the price | Show every input; let users re-derive the number |
| **OddsJam** | Huge odds coverage, arbitrage, +EV, real distribution | Expensive; overwhelming; odds-first not evidence-first | ~$39–199/mo | Market leader, sharp segment | Simplicity, 30-second flow, price | Own "fast and honest" vs. their "comprehensive" |
| **BettingPros** | Cheap, aggregated expert picks, media backing | Picks aggregation ≠ analysis; low rigor | $19.99/mo, $99/yr | Mass-market | Evidence over opinion | Be the anti-tout |
| **PropsBot** | AI-props positioning, current marketing tailwind | "AI picks" is a crowded, trust-eroded claim | $49.99/mo | Challenger | Auditability; no black box | Explicitly contrast with unvalidated AI picks |
| **StatMuse / free box scores** | Free, fast, trusted | No odds math, no settlement logic, no pushes | Free | Substitute | Does the odds half they don't | Keep the free tier good enough to beat this |
| **Free Discord/Reddit spreadsheets** | Free, community-trusted | Error-prone, manual, no uncertainty | Free | Substitute — **the real competitor** | Speed + correctness | This is who you actually take users from |
| **ChatGPT / general LLMs** | Free, conversational, improving | Hallucinate stat lines; no settlement semantics; no reproducibility | $0–20/mo | Rising substitute | Deterministic, auditable, snapshot-able | **Fastest-growing threat** — an LLM with a good sports data tool call does ~70% of this for free |
| **Sportsbook "trends" tabs** | Free, in-app, zero friction | Deliberately flattering to the house | Free | Substitute | Neutrality | Independence is the whole pitch |

### Positioning verdict: **DIFFERENTIATED** (not significantly differentiated, not category-creating)

The differentiation is real but narrow: **statistical honesty about uncertainty, plus reproducible audit snapshots, plus dual sportsbook/event-contract pricing.** Nobody else does the prediction-market commission math explicitly, and nobody else refuses to overclaim. But it is differentiation *within* an established category on a dimension (honesty about your edge being inconclusive) that may be **negatively correlated with consumer willingness to pay.** That tension is the central product risk, and it is why §18 Phase 1 must test pricing before anything else gets built.

---

## 16. Key economic drivers & sensitivity

The five variables that dominate outcomes:

1. **Monthly churn** (base 9%)
2. **CAC** (base $55)
3. **Free→paid conversion rate** (base 3%)
4. **Subscription price** (base $12/mo)
5. **Top-of-funnel volume** (base: 12,000 monthly visitors by month 12)

### Sensitivity — ±20% on each, base LTV $85 / CAC $55 / LTV:CAC 1.5

| Variable | −20% | Base | +20% | Effect on LTV:CAC | Verdict |
|---|---|---|---|---|---|
| **Churn** (9%/mo) | 7.2% → lifetime 10 mo → **LTV $106** | $85 | 10.8% → lifetime 6.7 mo → **LTV $71** | **1.93 ↔ 1.29** (±29%) | **Most sensitive.** Churn alone moves the business between "maybe" and "dead" |
| **CAC** ($55) | $44 | $55 | $66 | **1.93 ↔ 1.29** (∓25%) | Equally decisive, and partly outside your control given closed paid channels |
| **Conversion** (3%) | 2.4% | 3% | 3.6% | Revenue ±20%, CAC ±25% (CAC is inversely proportional) | High leverage — and the cheapest to test (§18 Phase 1) |
| **Price** ($12) | $9.60 → LTV $68 | $85 | $14.40 → LTV $101 | **1.24 ↔ 1.84** (±20%) | High leverage, but coupled: +20% price likely costs 10–25% conversion, so net effect is roughly flat. **Do not assume you can price your way out** |
| **Traffic** (12K/mo) | 9.6K | 12K | 14.4K | Revenue ±20%, **LTV:CAC unchanged** | Scales the business without fixing it. A broken ratio times more traffic is a bigger loss |

### Compounding

Churn and CAC compound. Both 20% favorable → LTV:CAC ≈ **2.4** (still under 3). Both 20% adverse → **1.0** (each customer costs exactly what they return — an unambiguous kill signal). **The base case does not clear the bar even under favorable single-variable movement**; it requires favorable movement on *both* churn and CAC plus a conversion improvement. That is precisely what §18 Phase 1 is designed to measure cheaply.

**Most sensitive assumption overall: churn — which is itself a proxy for whether "evidence, not picks" is something people want *continuously* or only once.** If users get their answer, learn the mental model, and leave, this is a great free tool and a poor subscription.

---

## 17. Kill criteria

Pre-commit to these *now*, in writing, before emotional attachment accrues. The repository already shows a pattern of building infrastructure ahead of demand — these exist to interrupt it.

1. **Willingness-to-pay.** Fewer than **25 pre-payments or credible paid-pilot commitments** (real money, not email signups) from 500 qualified visitors within 45 days of the demand test → **stop.**
2. **CAC.** Blended CAC cannot be brought below **$60** across any channel after 90 days and $2,500 of spend/effort → **stop or pivot to B2B.**
3. **Churn.** Month-3 cohort retention below **60%** (i.e. >13%/mo churn) after two consecutive cohorts → **stop the subscription model.** Convert to free + API/B2B.
4. **Conversion.** Free→paid conversion below **1.5%** after 1,000 activated free users → **stop.**
5. **Data viability.** Written commercial clearance from a data provider (competing-product use permitted, at ≤$500/mo for beta scale) not obtained within 60 days → **stop.** There is no business without licensed data.
6. **Spend cap.** Cumulative cash spend exceeds **$25,000** before reaching $2,000 MRR → **stop.**
7. **Time cap.** More than **500 additional founder hours** invested past this evaluation without a paying customer → **stop.** (The build is done; hours past this point should buy customers, not features.)

**Any two triggered simultaneously = shut down and harvest the assets** (see §19 — the assets are substantial even in failure).

---

## 18. Validation plan

Total cost to reach a defensible go/no-go: **under $5,000 and roughly 10 weeks.**

### Phase 1 — Demand test (weeks 1–3)
- **Objective:** Determine whether prop bettors will pay for *evidence* rather than *picks*, before writing another line of code.
- **Method:** Landing page with the real value proposition and a live demo *clearly labeled as demo data*. Three price points ($9 / $12 / $19) split-tested. A "Start free trial" button that collects payment details via Stripe and honestly says "we'll charge when we launch." Seed via 3 Reddit/Discord communities, 20 manual X replies/day, and 50 free hand-run analyses given away in exchange for a 10-minute call.
- **Cost:** $300 (domain, Stripe, landing tooling). **Human hrs:** 45. **AI hrs:** 60.
- **Success metric:** ≥3% of qualified visitors enter payment details; ≥15 of 50 call subjects say they'd pay ≥$10/mo; ≥25 real pre-payments.
- **Go/no-go:** <25 pre-payments from 500 qualified visitors → **NO-GO** (kill criterion 1).

### Phase 2 — Real-data MVP (weeks 4–7)
- **Objective:** Replace synthetic data with licensed, correction-aware real NBA data and remove every false provenance label. *This phase is the actual MVP; everything built so far is scaffolding around fictional inputs.*
- **Method:** Provision BALLDONTLIE (or SportsDataIO) with **written** competing-use clearance; build the ingestion cron + correction re-fetch; provenance-driven source badges with freshness; replace the in-memory limiter with Upstash; ship Stripe billing.
- **Cost:** $600 (data + infra + Stripe). **Human hrs:** 90. **AI hrs:** 180.
- **Success metric:** 100% of displayed numbers reconcile against an independent box-score source across a 50-analysis spot-check; zero "licensed" claims on unlicensed data.
- **Go/no-go:** No written data clearance → **NO-GO** (kill criterion 5).

### Phase 3 — First paying customers (weeks 8–12)
- **Objective:** Convert Phase 1 pre-payments into live, retained, paying subscribers.
- **Method:** Invite the pre-payment list via the existing `INVITE_CODE` gate. Charge real money. Weekly 20-minute calls with the first 15 customers. Ship the top-3 requested changes only.
- **Cost:** $500. **Human hrs:** 70. **AI hrs:** 90.
- **Success metric:** ≥25 paying subscribers; ≥70% complete a second week of use; NPS ≥ 30.
- **Go/no-go:** <15 paying after 30 days, or week-2 usage <50% → **NO-GO.**

### Phase 4 — Product-market fit (months 4–9)
- **Objective:** Prove retention and one repeatable channel.
- **Method:** Ship 200–500 programmatic SEO pages against the long-tail query surface; make snapshot links public and beautiful; measure cohort retention monthly; run the off-season retention experiment (this is where NBA-only seasonality gets tested honestly).
- **Cost:** $3,000. **Human hrs:** 260. **AI hrs:** 500.
- **Success metric:** 300+ paying subs; month-3 retention ≥60%; ≥30% of signups from organic search; CAC ≤$60.
- **Go/no-go:** Retention <60% or CAC >$60 → **NO-GO on subscriptions**; pivot to free consumer + B2B (kill criteria 2, 3).

### Phase 5 — Scale (months 10–36)
- **Objective:** $200K–$800K ARR.
- **Method:** Multi-sport (NFL is the bigger market — this is the highest-value expansion); annual plans; API/embed tier; B2B compliance-layer contracts; revisit ADR-0003 with counsel on compliant non-affiliate revenue.
- **Cost:** $25K–150K, funded from revenue. **Human hrs:** 700/yr. **AI hrs:** 1,800/yr.
- **Success metric:** LTV:CAC ≥3.0; net revenue retention ≥90%; ≥2 B2B contracts.
- **Go/no-go:** LTV:CAC still <2.0 at month 24 → harvest or sell.

**Run the B2B discovery track in parallel from week 1:** 10 conversations with prediction-market exchanges, regulated operators entering new states, and sports-media compliance teams about the glossary + scanner + audit-snapshot stack. Cost: 20 hours. This is the highest expected-value 20 hours in the entire plan, because it is the only path that tests the asset with an actual moat.

---

## 19. Opportunity cost

| Factor | Estimate |
|---|---|
| Months of focused effort before meaningful validation | **2.5–3 months** to a real go/no-go (Phases 1–3); **9 months** to a PMF verdict |
| Capital at risk | **$4,000–$25,000** — genuinely modest |
| Founder hours at risk | **~350 hrs** to the Phase 3 decision point; **~2,100 hrs** over a 3-year full pursuit |
| Difficulty of abandoning | **Moderate-to-high.** Elevated by sunk-cost pressure: substantial existing work, ADRs, agent rosters, handoff docs, and a Wayfinder ticket system all create narrative momentum. The extensive process artifacts make the project *feel* further along than the business is — the code is at ~80%, the business is at ~5% |
| Skills/assets gained even if it fails | **Substantial.** A production Next.js 16 + Drizzle + Vercel codebase; a demonstrated AI-agent development methodology that shipped 55 tests, CI, ADRs and hardening; domain expertise in odds math and gambling compliance; a reusable compliance/controlled-vocabulary component; and a portfolio piece that is unusually strong evidence of engineering judgment |

**Opportunity Cost Score: 6/10.**

The validation path is cheap (350 hours, $5K). The *full pursuit* is expensive (2,100 hours, $180–315K of forgone earnings, 3 years) for an EV of ~$483K with a 55% chance of zero. The score would be 3/10 if the founder committed only to the validation path and 8/10 if they went full-time immediately. **The structure of the decision matters more than the decision itself.**

---

## 20. Business potential scorecard

| Category | Score | Weight | Weighted | Rationale |
|---|---:|---:|---:|---|
| Market Size | 6 | 5% | 0.30 | Real and growing, but obtainable slice is $1–3M |
| Customer Pain | 7 | 6% | 0.42 | Genuine — Props.Cash exists because of it |
| Willingness to Pay | 5 | **11%** | 0.55 | They pay for picks and +EV alerts; "inconclusive" is a hard sell |
| Revenue Potential | 4 | **9%** | 0.36 | $200K base / $1M+ only 5% likely |
| Profit Potential | 5 | 6% | 0.30 | High margin, small absolute numbers |
| Scalability | 7 | 4% | 0.28 | Excellent technically, constrained by distribution |
| Capital Efficiency | 8 | 5% | 0.40 | Genuine strength — tiny capital, build already sunk |
| AI Automation Potential | 7 | 3% | 0.21 | ~60% of ops; founder has proven leverage |
| Founder Leverage | 6 | 4% | 0.24 | Product scales; credibility doesn't |
| Distribution | 4 | **13%** | 0.52 | Paid closed, no audience, SEO is slow. **The binding constraint** |
| Competitive Advantage | 3 | 6% | 0.18 | Differentiated on a dimension that may not convert |
| Defensibility / Moat | 3 | **8%** | 0.24 | Copyable in 2 weeks by an incumbent |
| Ease of Execution | 7 | 3% | 0.21 | Code is built and correct |
| Speed to Market | 8 | 3% | 0.24 | Weeks, not months |
| Probability of Success | 4 | **9%** | 0.36 | 45% survive, 23% sustainable, 17% >$100K profit |
| Risk-Adjusted Return | 4 | 5% | 0.20 | EV real but modest vs. time |
| **TOTAL** | | **100%** | **5.01** | |

### **OVERALL BUSINESS POTENTIAL: 5.0 / 10**

*(Unweighted average would be 5.5 — weighting deliberately lowers it.)*

**Largest weights and why:**
- **Distribution (13%)** — in a category where the math is public and the data costs $40/month, *the only scarce resource is attention.* Everything else is downstream of whether customers can be reached.
- **Willingness to Pay (11%)** — the product's core differentiator (honest uncertainty) is plausibly *anti-correlated* with what this market pays for. This is the thesis's central unvalidated claim, so it carries the second-largest weight.
- **Revenue Potential + Probability of Success (9% each)** — the outcome distribution is the decision.
- **Moat (8%)** — with zero switching costs and zero proprietary assets, even success invites immediate replication.

**Deliberately de-weighted:** Ease of Execution and Speed to Market (3% each). These score highest (7, 8) but are **weak predictors of commercial outcome** — they measure work already completed, and weighting them heavily would let sunk effort inflate the score. That is exactly the bias this framework exists to prevent.

---

## 21. Final investment verdict

# **RECOMMENDATION: 3 — VALIDATE CHEAPLY**

*with a parallel, explicitly-funded exploration of the B2B compliance-infrastructure path (§3 model #2), which is where the asymmetric upside sits.*

**Why not 4 (BUILD MVP):** the MVP is already built. The unvalidated risk is entirely commercial, so more building is the *wrong* next dollar. **Why not 2 (WATCH):** the asset is real, the capital at risk is trivial, and the validation is cheap and fast — waiting costs more than testing.

| Metric | Value |
|---|---|
| **Recommendation** | **3 — Validate Cheaply** |
| **Overall Business Potential** | **5.0 / 10** |
| **Probability of commercial success** (sustainable ≥$50K/yr profit) | **23%** |
| **Probability of failure** | **55%** |
| **Expected time to first revenue** | **4 months** (3–5 mo range) |
| **Expected time to profitability** (cash break-even) | **7–9 months** |
| **Most likely 3-year revenue** | **$200K** (base case, conditional on surviving); **EV-weighted: $148K**; **modal outcome: <$25K** |
| **Most likely 3-year profit** | **$110K** (base case, conditional); **EV-weighted: $72K** |
| **High-case 3-year revenue** | **$800K** (6% probability) |
| **High-case 3-year profit** | **$380K** (6% probability) |
| **Estimated capital required** | **$4K lean / $50–60K recommended / $530K aggressive** |
| **Initial human hours** (remaining) | **~348** |
| **Initial AI hours** | **~574** |
| **Ongoing human hours/month** | **~58** |
| **Ongoing AI hours/month** | **~150** |
| **AI-automatable percentage** | **~55% build / ~60% ongoing** |
| **Risk Score** | **7 / 10** |
| **Scalability Score** | **7 / 10** |
| **Founder Leverage Score** | **6 / 10** |
| **Capital Efficiency Score** | **8 / 10** |
| **Moat Score** | **3 / 10** |

### Non-negotiable preconditions before any external user

1. **Remove the false data-provenance claims** (`Footer.tsx:122`, `api/analysis/route.ts:396`, `snapshots/[id]/page.tsx:200`). ~2 hours.
2. **Obtain written data-license clearance** for competing-product use before charging anyone.
3. **Do not market the prediction-market pricing mode** until the CFTC's June 2026 proposed rule on discrete in-game props is finalized.

---

## 22. The one-sentence decision

> **If I were the founder, I would *validate* this opportunity — spending no more than $5,000 and 10 weeks proving that prop bettors will pay for evidence rather than picks, while simultaneously taking ten B2B discovery calls on the compliance and audit stack — because the engineering is genuinely excellent and nearly free to finish, but the business rests on two entirely untested assumptions (that people pay for "inconclusive," and that a reachable channel exists without paid ads), and at the base-case LTV:CAC of 1.5:1 the consumer subscription does not work, so the only rational next dollar buys evidence about customers, not more product.**

### What would change my mind?

**Three pieces of evidence, in order of impact:**

1. **A demonstrated distribution channel — or an existing audience.** *If the founder already has a 20,000+ person betting audience (X, YouTube, Discord, newsletter), Distribution moves 4 → 8, CAC collapses toward $15, LTV:CAC clears 5:1, failure probability drops from 55% to ~30%, and the recommendation moves to **4 — BUILD MVP** immediately.* Conversely, if 90 days of honest effort produces no channel at sub-$60 CAC, failure probability rises above 70% and the answer becomes **1 — DO NOT PURSUE.** *This single variable is worth more than everything else in this document combined.*

2. **Hard willingness-to-pay data.** *If 50+ people pre-pay real money at $12/mo within 45 days, Willingness to Pay moves 5 → 8, Revenue Potential 4 → 6, overall score moves to ~6.2/10, and this becomes a straightforward build.* If fewer than 25 pre-pay from 500 qualified visitors, the central thesis is falsified and the consumer product should be abandoned in favor of the B2B path or shut down.

3. **One signed B2B compliance-layer contract.** *If a prediction-market exchange, a regulated operator, or a sports-media compliance team pays $2K+/month for the glossary + prohibited-language scanner + immutable audit-snapshot stack, the entire analysis inverts: the moat moves 3 → 7, the churn problem disappears (B2B contracts don't churn like $12/mo consumer subs), the TAM shifts to regulated-gambling compliance software, and the recommendation moves to **5 — STRONG OPPORTUNITY**.* This is the asymmetric upside hiding in this repository, and it is not currently the plan. **It costs 20 hours to test.**

---

## Appendix — Assumptions register

**Founder context [ASSUMED — the prompt's context block was empty]:** solo founder; strong full-stack engineering; demonstrated high-leverage AI-agent workflow; no existing betting audience; no committed capital beyond personal funds; no quantitative-modeling background evidenced in the repo; no counsel engaged; able to commit part-time.

**If any of these is wrong, the analysis moves materially:** an existing audience → recommendation 4 (see §22.1); $250K of available capital → does *not* improve the outcome much, because the constraint is distribution, not capital; a co-founder with betting-media distribution → recommendation 5; an engaged gaming attorney → removes ~1 point of risk score and unlocks re-examining ADR-0003.

**Market sizing [DERIVED, not sourced]:** TAM/SAM/SOM in §2 are bottom-up estimates from competitor pricing and plausible subscriber counts. No published market-research figure for the "betting research tools" segment was located; treat the $250–500M TAM as an order-of-magnitude estimate with ±50% error bars.

**Unit economics [ASSUMED]:** every figure in §3 is a range-labeled assumption. Churn (9%) and CAC ($55) are the two that matter and both are unvalidated.

**Probabilities [JUDGMENT]:** the distribution in §4 reflects base rates for solo-founder niche B2C software with no audience, adjusted upward for code completion and downward for the affiliate-revenue ban, commodity math, and closed paid channels.

---

## Sources

- [Why Player Props Have Become the Most Watched NBA Betting Market — Last Word On Basketball](https://lastwordonsports.com/basketball/2026/06/09/props-nba-betting-market/)
- [NBA Betting Guide 2026: 190+ Props, 1.4s Live Speed — Tech Insider](https://tech-insider.org/sports-betting/nba-betting-guide/)
- [Sports Betting — Worldwide | Statista Market Forecast](https://www.statista.com/outlook/amo/gambling/sports-betting/worldwide/)
- [US Sports Betting 2026 — eMarketer](https://www.emarketer.com/content/us-sports-betting-2026)
- [Best Free Player Prop Research Tools (2026) — Comparison Guide](https://www.dumbmoneypicks.ai/guides/best-free-player-prop-research-tools-2026)
- [OddsJam Review 2026: Is This $199/Month Betting Tool Worth It? — XCLSV](https://xclsvmedia.com/oddsjam-review-2026-is-this-199-month-betting-tool-worth-it/)
- [BettingPros Review 2026 — XCLSV](https://xclsvmedia.com/bettingpros-review-2026-picks-aggregator-worth-subscribing/)
- [No injuries, no props: CFTC proposes prediction market rules — ESPN](https://www.espn.com/espn/betting/story/_/id/49019930/cftc-proposes-rules-limiting-prediction-markets-kalshi-sports)
- [Trading volume on prediction markets has soared in recent months — Pew Research Center](https://www.pewresearch.org/short-reads/2026/05/27/trading-volume-on-prediction-markets-has-soared-in-recent-months/)
- [Prediction Markets Top $11B in Contract Volume — DeFi Rate](https://defirate.com/news/volume-report-top-11b-contracts-sports-combos/)
- [Kalshi vs Polymarket 2026: fees, volume, and US access compared — MetaMask](https://metamask.io/news/kalshi-vs-polymarket)
- [BALLDONTLIE — Sports API](https://www.balldontlie.io/)
- [Best NBA APIs in 2026 — Highlightly](https://highlightly.net/blogs/best-nba-apis-in-2026)
- [NBA Database | NBA API — SportsDataIO](https://sportsdata.io/nba-api)
- [38 US States with Legal Sports Betting in 2026 — Track360](https://track360.io/blog/us-sports-betting-state-by-state-operator-map-2026)
