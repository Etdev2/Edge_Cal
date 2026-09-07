# BALLDONTLIE NBA data-source validation

Status: **Conditional go for prototype and closed beta; written license clarification required before commercial launch**

Research ticket: [Validate the licensed NBA data source](https://github.com/Etdev2/Edge_Cal/issues/2)  
Provider: [BALLDONTLIE NBA API](https://docs.balldontlie.io/)  
Terms reviewed: [Terms of Service](https://www.balldontlie.io/terms), last updated August 4, 2026  
Reviewed: September 7, 2026

## Decision

BALLDONTLIE's NBA **ALL-STAR** tier is technically adequate for the V1 historical player-prop calculator. It includes player search, games, game-level player statistics, active players, and current player injuries at 60 requests per minute for $9.99/month. Basic game-player rows expose the required inputs for points, rebounds, assists, made three-pointers, minutes, game date, season, lifecycle state, postseason status, and home/visitor team IDs.

Use ALL-STAR behind a provider-neutral ingestion adapter and an application-owned cache. Treat the provider as a best-effort upstream source, not as an official NBA feed or a settlement-grade source.

Do **not** treat the commercial license as fully cleared yet. The current Terms contain an internal contradiction: the plain-language summary says competing products and resale are permitted, while Section 6 says Data may not be used to create or operate products that compete with BALLDONTLIE and may not be resold unmodified. Because BALLDONTLIE now offers betting-analysis products, obtain written confirmation that Edge Calculator's historical prop-analysis interface is permitted before a paid or public commercial launch. The Terms also state that BALLDONTLIE grants only rights it can grant and does not clear all third-party trademark, publicity, contractual, or other rights.

## Requirement-by-requirement findings

| V1 requirement | Finding | Decision / constraint |
| --- | --- | --- |
| Players and teams | Player search and team data are available on Free, ALL-STAR, and GOAT. Player records carry stable provider IDs and current team information. | Use provider IDs as external identifiers; keep internal canonical IDs because rosters and provider mappings can change. |
| Historical games | The documentation states NBA data spans 1946 to current, and the Games endpoint filters by seasons or dates. Game records expose date, season, status/state, postseason, scores, and home/visitor IDs. | Adequate for V1 evidence windows. Audit recent seasons before launch; the docs do not promise field-level completeness for every historical year. |
| Game-level player stats | ALL-STAR includes the Game Player Stats endpoint. It can filter by player, game, date range, season, season type, and period. Full-game period 0 is the default. | Use completed full-game rows only. Persist the raw provider row plus normalized values and fetch metadata. |
| PTS / REB / AST / 3PM | Each row includes `pts`, `reb`, `ast`, and `fg3m`. | Directly supported. |
| PRA | No separate PRA field is needed. | Derive `pts + reb + ast` from the same finalized row; test null/missing-field behavior. |
| Regular season vs playoffs | `season_type` supports `preseason`, `regular`, `ist`, `playin`, and `playoffs`; game rows also expose `postseason`. | Store provider season type explicitly; do not combine regular season and playoffs by default. Decide NBA Cup/play-in semantics in the evidence contract. |
| Opponent and home/away | The stat row identifies the player's team; the nested game identifies home and visitor team IDs. | Derive opponent and venue deterministically from those IDs. |
| Overtime | Full-game period 0 includes the completed game, while periods 5+ represent overtime segments. | Full-game props naturally include overtime. Do not sum period rows when the period-0 row is used. |
| Minutes / low-minute flags | Player rows include `min`. | Normalize the string defensively; use for display/flags, not silent exclusion unless the evidence contract explicitly says so. |
| DNP handling | The docs do not specify whether DNPs appear as zero-minute rows, are omitted, or vary historically. | **Unresolved data-semantic gap.** Run an authenticated sample audit against known DNP games before locking eligibility rules. Missing stat rows must not automatically be interpreted as a played game. |
| Injuries | ALL-STAR includes current Player Injuries with player, return-date text, description, and status; it supports player/team filters and cursor pagination. | Useful as current context only. The documented shape has no event timestamp, report source, or historical injury timeline, so it cannot support historical availability labels or point-in-time model features. |
| Freshness | Game and player-stat pages describe in-progress data as realtime, but the Terms make all live data best-effort and provide no latency SLA. | V1 should analyze only `status_state=final` games. Show `fetched_at` and source. Avoid live/in-game conclusions. |
| Corrections | Terms say data may be corrected or changed at any time without notice. No correction feed, revision number, row `updated_at`, or completed-game finalization SLA is documented. | Re-fetch a rolling correction window and compare payload hashes. Preserve immutable analysis snapshots so a later correction does not silently rewrite a saved result. |
| Pagination | Cursor pagination defaults to 25 and allows at most 100 records per page. | Implement cursor traversal, deduplication by provider row ID, bounded retries, and resumable sync checkpoints. |
| Rate limit | ALL-STAR is documented at 60 requests/minute; 429 is the rate-limit response. Trials are capped at 5 requests/minute. | Centralize server-side throttling. A rough full-season backfill of about 32,000 player-game rows would require about 320 max-size pages, or at least ~5.3 minutes at the plan ceiling before retries. |
| Authentication | Every request requires an API key in the `Authorization` header. Terms prohibit sharing credentials or API access. | Keep the key server-side only; never call BALLDONTLIE directly from the browser or mobile client. |
| Caching and derived products | Section 6 expressly permits copying, caching, storing, archiving, modifying, combining, analyzing, publishing, displaying, distributing, sublicensing, and creating derivative products from lawfully obtained Data, subject to restrictions. | An application-owned normalized cache and derived hit-rate calculations are facially permitted, subject to the competing-product ambiguity and third-party rights caveat. |
| Commercial use | Section 6 lists analytics, fantasy, gaming, lawful sportsbook/wagering products, and AI/ML uses as permitted. | Commercial analytics is facially permitted, but launch remains conditional on written non-competition clarification and separate product-compliance review. |
| Attribution | Section 6 says no attribution or case-by-case permission is required absent a separate agreement. | Attribution is not contractually required under the reviewed public Terms. Still show the source and freshness for user trust and provenance. |
| Data redistribution | Modified/derived products are broadly permitted, but unmodified original Data may not be resold. | Do not expose a raw-data download/API or reconstruct a substitute feed. Show only records and fields needed to substantiate an analysis. |
| Official status and accuracy | The provider says it aggregates third-party sources, is not league affiliated, and offers data “as is”; it forbids implying official status. | Never label the feed “official NBA data.” Add independent QA and a correction/reporting path. |
| Service continuity | The provider may modify, limit, suspend, or discontinue services, and pricing may change with notice. | Keep the adapter/provider boundary, raw snapshots, health monitoring, and a migration path to a second provider. |

## Official-source evidence

1. [NBA API documentation — account tiers, prices, and endpoint access](https://docs.balldontlie.io/#nba-api): ALL-STAR includes Game Player Stats, Active Players, and Player Injuries; the table lists 60 requests/minute and $9.99/month.
2. [NBA API documentation — pagination and errors](https://docs.balldontlie.io/#pagination): cursor pagination, 25 default, 100 maximum, and HTTP 429 for rate limiting.
3. [NBA API documentation — Games](https://docs.balldontlie.io/#games): realtime claim for in-progress games, lifecycle states, date/season filters, postseason state, and home/visitor IDs.
4. [NBA API documentation — Game Player Stats](https://docs.balldontlie.io/#game-player-stats): realtime claim, fields `min`, `fg3m`, `reb`, `ast`, `pts`, nested player/team/game records, max page size 100, and season/date/player/game/season-type/period filters.
5. [NBA API documentation — Player Injuries](https://docs.balldontlie.io/#player-injuries): current documented injury shape and filters.
6. [Terms of Service §§1–2](https://www.balldontlie.io/terms): third-party aggregation, non-official status, lawful downstream-use responsibilities, and prohibition on sole-source wager grading/settlement.
7. [Terms of Service §§5–7](https://www.balldontlie.io/terms): credential restrictions; permission to cache, store, analyze, and create derivative products; no-attribution statement; non-competition and unmodified-resale restrictions.
8. [Terms of Service §§8–9](https://www.balldontlie.io/terms): best-effort quality, possible staleness/duplication/corrections, and no live-data SLA.
9. [Terms of Service §§11, 15–17, 21](https://www.balldontlie.io/terms): third-party-rights caveat, upstream dependency risk, modification/discontinuation, termination behavior, and terms changes.

## Required implementation safeguards

1. Route all provider calls through a server-only adapter; keep the API key out of clients and logs.
2. Persist provider IDs separately from internal canonical IDs.
3. Store normalized game-player rows plus source URL/endpoint, provider record ID, `fetched_at`, payload hash, and source plan/version metadata.
4. Accept only finalized games for historical calculations. Re-fetch recent finals on a rolling schedule to detect corrections.
5. Make every saved analysis an immutable snapshot of its inputs and selected evidence-row IDs.
6. Handle cursor pagination, 429 backoff, 5xx retries with jitter, idempotent upserts, deduplication, and resumable checkpoints.
7. Display source and freshness; avoid “official,” “guaranteed,” or settlement-grade claims.
8. Do not expose bulk raw-data export or a public pass-through API.
9. Build provider contract tests from authenticated fixtures before production integration.
10. Maintain a provider-replacement path and periodic data-quality reconciliation against an independent reference sample.

## Acceptance checks before beta

- Authenticated smoke test confirms one active star and one bench player across PTS, REB, AST, FG3M, PRA, minutes, opponent, home/away, season type, and overtime.
- Known DNP, inactive, postponed, canceled, and stat-correction cases establish exact eligibility behavior.
- A complete current-season backfill produces no duplicate provider row IDs and reconciles sampled box scores.
- Rolling re-fetch detects and records changed final rows without mutating saved analyses.
- Load test stays below 60 requests/minute and exercises 429/500/503 recovery.
- Injury endpoint behavior is tested for stale entries, missing players, and status changes.
- Terms version/date is recorded, and a launch checklist rechecks the Terms before every paid/public release.

## Open questions requiring direct provider confirmation

Send these questions to `hello@balldontlie.io` before commercial launch:

1. Is a consumer historical player-prop analysis app that calculates hit rates and implied-probability gaps considered a product that “competes with us” under Section 6?
2. Does the ALL-STAR subscription permit displaying selected underlying game rows to end users as evidence, provided the app does not offer bulk export or a substitute API?
3. Are there additional plan-specific limits on caching duration, database retention, downstream user volume, or the number of applications not stated in the public Terms?
4. How are completed-game statistical corrections communicated, and when should a final game be considered stable?
5. Are DNP/inactive players represented as zero-minute rows or omitted, and is that behavior consistent across supported seasons?
6. What historical completeness guarantees, if any, apply to basic game-player statistics by season?
7. What is the intended freshness and provenance of injury statuses, and is historical injury data available?

## Bottom line

**Technical fit: yes. Operational fit: yes, with caching and reconciliation. Commercial-license fit: conditional.**

Proceed with ALL-STAR for fixture development, authenticated contract tests, the clickable prototype, and a limited closed beta. Before charging users or broadly marketing the product, obtain written clarification of the competing-product clause and complete separate legal/compliance review. The app should remain analysis-only, use manual sportsbook inputs, and never rely on this feed to accept, grade, or settle wagers.
