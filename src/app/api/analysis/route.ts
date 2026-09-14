import { NextRequest, NextResponse } from "next/server";
import { db, isDatabaseConfigured } from "@/db";
import { players, teams, games, playerGameStats, SPORT_IDS, DEFAULT_SPORT, type SportId } from "@/db/schema";
import { eq, desc, and } from "drizzle-orm";
import {
  calculateBreakEvenProbability,
  calculateNoVigProbability,
  calculateHypotheticalReturn,
  validateAmericanOdds,
} from "@/lib/domain/odds";
import {
  calculatePredictionMarketBreakEvenProbability,
  calculatePredictionMarketHypotheticalReturn,
  validatePredictionMarketCommission,
  validatePredictionMarketPrice,
} from "@/lib/domain/predictionMarket";
import { rateLimit } from "@/lib/server/rateLimit";
import { ageRequiredResponse, hasAgeConfirmation } from "@/lib/server/guards";
import { calculateHistoricalHitRate } from "@/lib/domain/statistics";
import { getMarketById } from "@/lib/domain/markets";
import {
  filterAndSettleEvidence,
  type EvidenceWindowType,
  type RawGameStatEntry,
} from "@/lib/domain/evidence";
import { seedDatabaseIfEmpty } from "@/lib/data/seed";
import {
  generateFallbackGameLogs,
  getFallbackPlayerHeader,
} from "@/lib/data/memoryFallback";

export const dynamic = "force-dynamic";

const STALE_DATA_WARNING_MS = 24 * 60 * 60 * 1000; // warn when data is >24h old

function parseSport(value: unknown): SportId {
  const v = String(value ?? "").toLowerCase();
  return (SPORT_IDS as string[]).includes(v) ? (v as SportId) : DEFAULT_SPORT;
}

export async function POST(request: NextRequest) {
  if (!hasAgeConfirmation(request)) return ageRequiredResponse();

  try {
    const body = await request.json();
    const {
      playerId,
      sport: sportParam,
      market = "PTS",
      line = 24.5,
      side = "over",
      americanOdds = -110,
      oppositeOdds,
      pricingMode = "sportsbook",
      predictionMarketPriceCents = 56,
      predictionMarketCommissionPct = 2,
      evidenceWindow = "season",
      opponentAbbr,
    } = body;

    const limit = rateLimit(request, { limit: 30, windowMs: 60_000 });
    if (!limit.allowed) {
      return NextResponse.json(
        { success: false, error: "Analysis rate limit exceeded. Please wait a minute and try again." },
        {
          status: 429,
          headers: { "Retry-After": String(limit.retryAfterSeconds) },
        }
      );
    }

    const pid = parseInt(playerId, 10);
    const sport = parseSport(sportParam);
    const numericLine = parseFloat(line);
    const numericOdds = parseInt(americanOdds, 10);
    const numericOppositeOdds = oppositeOdds ? parseInt(oppositeOdds, 10) : undefined;
    const numericPriceCents = Number(predictionMarketPriceCents);
    const numericCommissionPct = Number(predictionMarketCommissionPct);
    const validatedPricingMode: "sportsbook" | "prediction_market" =
      pricingMode === "prediction_market" ? "prediction_market" : "sportsbook";
    const validatedSide: "over" | "under" = side === "under" ? "under" : "over";
    const validatedWindow: EvidenceWindowType = evidenceWindow as EvidenceWindowType;

    if (!pid || isNaN(pid)) {
      return NextResponse.json(
        { success: false, error: "Valid playerId is required" },
        { status: 400 }
      );
    }

    if (isNaN(numericLine) || numericLine < 0) {
      return NextResponse.json(
        { success: false, error: "Valid prop line is required" },
        { status: 400 }
      );
    }

    let breakEvenProb: number;
    let noVigResult: ReturnType<typeof calculateNoVigProbability> | null = null;

    if (validatedPricingMode === "prediction_market") {
      const priceValidation = validatePredictionMarketPrice(numericPriceCents);
      const commissionValidation = validatePredictionMarketCommission(numericCommissionPct);
      if (!priceValidation.isValid || !commissionValidation.isValid) {
        return NextResponse.json(
          {
            success: false,
            error: priceValidation.errorMessage || commissionValidation.errorMessage,
          },
          { status: 400 }
        );
      }
      breakEvenProb = calculatePredictionMarketBreakEvenProbability(
        numericPriceCents,
        numericCommissionPct
      );
    } else {
      const oddsValidation = validateAmericanOdds(numericOdds);
      if (!oddsValidation.isValid) {
        return NextResponse.json(
          { success: false, error: oddsValidation.errorMessage },
          { status: 400 }
        );
      }
      breakEvenProb = calculateBreakEvenProbability(numericOdds);
      if (numericOppositeOdds && validateAmericanOdds(numericOppositeOdds).isValid) {
        noVigResult = calculateNoVigProbability(numericOdds, numericOppositeOdds);
      }
    }

    const marketDef = getMarketById(market, sport);

    // Demo memory mode — no DATABASE_URL (e.g. Vercel build or unconfigured env)
    if (!isDatabaseConfigured()) {
      const header = getFallbackPlayerHeader(pid, sport);
      if (!header) {
        return NextResponse.json(
          { success: false, error: `Player not found in the ${sport.toUpperCase()} demo dataset` },
          { status: 404 }
        );
      }
      const rawGameEntries = generateFallbackGameLogs(pid, sport);
      return buildAnalysisResponse({
        sport,
        player: header,
        marketDef,
        numericLine,
        validatedSide,
        numericOdds,
        numericOppositeOdds,
        pricingMode: validatedPricingMode,
        predictionMarketPriceCents: numericPriceCents,
        predictionMarketCommissionPct: numericCommissionPct,
        breakEvenProb,
        noVigResult,
        rawGameEntries,
        validatedWindow,
        opponentAbbr,
        demoMode: true,
      });
    }

    await seedDatabaseIfEmpty();

    // 1. Fetch player and team (scoped to the requested sport)
    const playerRows = await db
      .select({
        id: players.id,
        sport: players.sport,
        fullName: players.fullName,
        position: players.position,
        jerseyNumber: players.jerseyNumber,
        teamId: players.teamId,
        teamAbbr: teams.abbreviation,
        teamName: teams.name,
      })
      .from(players)
      .leftJoin(teams, eq(players.teamId, teams.id))
      .where(and(eq(players.id, pid), eq(players.sport, sport)))
      .limit(1);

    if (playerRows.length === 0) {
      // Distinguish "no such player" from "player exists in the other league"
      const anySport = await db
        .select({ id: players.id, sport: players.sport })
        .from(players)
        .where(eq(players.id, pid))
        .limit(1);
      if (anySport.length > 0) {
        return NextResponse.json(
          {
            success: false,
            error: `Player ${anySport[0].sport.toUpperCase()} roster does not match the requested ${sport.toUpperCase()} analysis`,
          },
          { status: 400 }
        );
      }
      return NextResponse.json(
        { success: false, error: "Player not found" },
        { status: 404 }
      );
    }

    const player = playerRows[0];

    // 2. Fetch all raw player game stats with opponent team info (sport-scoped)
    const statRows = await db
      .select({
        gameId: playerGameStats.gameId,
        gameDate: games.gameDate,
        season: games.season,
        seasonType: games.seasonType,
        isHome: playerGameStats.isHome,
        opponentId: playerGameStats.opponentTeamId,
        opponentAbbr: teams.abbreviation,
        opponentName: teams.fullName,
        min: playerGameStats.min,
        minutesNumeric: playerGameStats.minutesNumeric,
        pts: playerGameStats.pts,
        reb: playerGameStats.reb,
        ast: playerGameStats.ast,
        fg3m: playerGameStats.fg3m,
        blk: playerGameStats.blk,
        stl: playerGameStats.stl,
        passYds: playerGameStats.passYds,
        passTd: playerGameStats.passTd,
        passInt: playerGameStats.passInt,
        rushYds: playerGameStats.rushYds,
        rushTd: playerGameStats.rushTd,
        rec: playerGameStats.rec,
        recYds: playerGameStats.recYds,
        recTd: playerGameStats.recTd,
        turnover: playerGameStats.turnover,
        isDnp: playerGameStats.isDnp,
        lowMinutesFlag: playerGameStats.lowMinutesFlag,
        isOvertime: games.isOvertime,
        fetchedAt: playerGameStats.fetchedAt,
      })
      .from(playerGameStats)
      .innerJoin(games, eq(playerGameStats.gameId, games.id))
      .innerJoin(teams, eq(playerGameStats.opponentTeamId, teams.id))
      .where(
        and(
          eq(playerGameStats.playerId, pid),
          eq(playerGameStats.sport, sport),
          eq(games.sport, sport)
        )
      )
      .orderBy(desc(games.gameDate));

    const rawGameEntries: RawGameStatEntry[] = statRows.map((r) => ({
      gameId: r.gameId,
      gameDate: r.gameDate,
      season: r.season,
      seasonType: r.seasonType,
      isHome: r.isHome,
      opponentAbbr: r.opponentAbbr ?? "OPP",
      opponentName: r.opponentName ?? "Opponent",
      teamAbbr: player.teamAbbr ?? "TEAM",
      min: r.min,
      minutesNumeric: r.minutesNumeric,
      pts: r.pts,
      reb: r.reb,
      ast: r.ast,
      fg3m: r.fg3m,
      blk: r.blk,
      stl: r.stl,
      passYds: r.passYds,
      passTd: r.passTd,
      passInt: r.passInt,
      rushYds: r.rushYds,
      rushTd: r.rushTd,
      rec: r.rec,
      recYds: r.recYds,
      recTd: r.recTd,
      turnover: r.turnover,
      isDnp: r.isDnp,
      lowMinutesFlag: r.lowMinutesFlag,
      isOvertime: r.isOvertime,
      fetchedAt: r.fetchedAt?.toISOString?.() ?? r.fetchedAt,
    }));

    return buildAnalysisResponse({
      sport,
      player: {
        id: player.id,
        fullName: player.fullName,
        position: player.position ?? "",
        jerseyNumber: player.jerseyNumber ?? "",
        teamAbbr: player.teamAbbr ?? "TEAM",
      },
      marketDef,
      numericLine,
      validatedSide,
      numericOdds,
      numericOppositeOdds,
      pricingMode: validatedPricingMode,
      predictionMarketPriceCents: numericPriceCents,
      predictionMarketCommissionPct: numericCommissionPct,
      breakEvenProb,
      noVigResult,
      rawGameEntries,
      validatedWindow,
      opponentAbbr,
      demoMode: false,
    });
  } catch (error) {
    console.error("Analysis calculation error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to perform analysis" },
      { status: 500 }
    );
  }
}

function buildAnalysisResponse(args: {
  sport: SportId;
  player: {
    id: number;
    fullName: string;
    position: string;
    jerseyNumber: string;
    teamAbbr: string;
  };
  marketDef: ReturnType<typeof getMarketById>;
  numericLine: number;
  validatedSide: "over" | "under";
  numericOdds: number;
  numericOppositeOdds?: number;
  pricingMode: "sportsbook" | "prediction_market";
  predictionMarketPriceCents: number;
  predictionMarketCommissionPct: number;
  breakEvenProb: number;
  noVigResult: ReturnType<typeof calculateNoVigProbability> | null;
  rawGameEntries: RawGameStatEntry[];
  validatedWindow: EvidenceWindowType;
  opponentAbbr?: string;
  demoMode: boolean;
}) {
  const {
    sport,
    player,
    marketDef,
    numericLine,
    validatedSide,
    numericOdds,
    numericOppositeOdds,
    pricingMode,
    predictionMarketPriceCents,
    predictionMarketCommissionPct,
    breakEvenProb,
    noVigResult,
    rawGameEntries,
    validatedWindow,
    opponentAbbr,
    demoMode,
  } = args;

  const statExtractor = (row: RawGameStatEntry) => marketDef.extractValue(row);

  const settlement = filterAndSettleEvidence(
    rawGameEntries,
    validatedWindow,
    opponentAbbr,
    statExtractor,
    numericLine,
    validatedSide
  );

  const statsResult = calculateHistoricalHitRate(
    settlement.statValues,
    numericLine,
    validatedSide,
    breakEvenProb
  );

  const hitRateGap = statsResult.hitRate - breakEvenProb;
  const hypotheticalReturn100 =
    pricingMode === "prediction_market"
      ? calculatePredictionMarketHypotheticalReturn(
          predictionMarketPriceCents,
          predictionMarketCommissionPct,
          statsResult.hitRate,
          100
        )
      : calculateHypotheticalReturn(numericOdds, statsResult.hitRate, 100);

  // Data freshness: most recent verified row, and a warning when the cached
  // evidence is older than 24h (live-data gap surfaced per audit P1-12).
  const fetchedTimes = rawGameEntries
    .map((g) => (g.fetchedAt ? new Date(g.fetchedAt).getTime() : NaN))
    .filter((t) => !isNaN(t));
  const newestFetchedAt =
    fetchedTimes.length > 0 ? new Date(Math.max(...fetchedTimes)).toISOString() : null;
  const staleDataWarning =
    newestFetchedAt != null &&
    Date.now() - new Date(newestFetchedAt).getTime() > STALE_DATA_WARNING_MS;

  return NextResponse.json({
    success: true,
    demoMode,
    sport,
    analysis: {
      sport,
      player: {
        id: player.id,
        fullName: player.fullName,
        position: player.position,
        jerseyNumber: player.jerseyNumber,
        teamAbbr: player.teamAbbr,
      },
      market: {
        id: marketDef.id,
        code: marketDef.code,
        label: marketDef.label,
        unit: marketDef.unit,
        isDerived: marketDef.isDerived,
      },
      line: numericLine,
      side: validatedSide,
      odds: {
        pricingMode,
        americanOdds: numericOdds,
        oppositeOdds: numericOppositeOdds,
        predictionMarketPriceCents:
          pricingMode === "prediction_market" ? predictionMarketPriceCents : null,
        predictionMarketCommissionPct:
          pricingMode === "prediction_market" ? predictionMarketCommissionPct : null,
        breakEvenProb: Math.round(breakEvenProb * 1000) / 1000,
        breakEvenPercent: `${(breakEvenProb * 100).toFixed(1)}%`,
        noVig: noVigResult
          ? {
              sideNoVigProb: Math.round(noVigResult.sideNoVigProb * 1000) / 1000,
              sideNoVigPercent: `${(noVigResult.sideNoVigProb * 100).toFixed(1)}%`,
              vigPercent: `${noVigResult.vigPercent.toFixed(2)}%`,
            }
          : null,
      },
      evidence: {
        window: validatedWindow,
        opponentAbbr: opponentAbbr || null,
        totalGamesInWindow: settlement.eligibleGames.length,
        dnpExcludedCount: settlement.dnpGamesCount,
        lowMinuteGamesCount: settlement.lowMinuteGamesCount,
        wins: statsResult.wins,
        losses: statsResult.losses,
        pushes: statsResult.pushes,
        eligibleGames: statsResult.eligibleGames,
        hitRate: Math.round(statsResult.hitRate * 1000) / 1000,
        hitRatePercent: `${(statsResult.hitRate * 100).toFixed(1)}%`,
        hitRateGap: Math.round(hitRateGap * 1000) / 1000,
        hitRateGapPoints: `${hitRateGap * 100 > 0 ? "+" : ""}${(hitRateGap * 100).toFixed(1)}%`,
        uncertaintyInterval: statsResult.uncertaintyInterval,
        uncertaintyIntervalFormatted: `[${(statsResult.uncertaintyInterval.lower * 100).toFixed(1)}% – ${(statsResult.uncertaintyInterval.upper * 100).toFixed(1)}%]`,
        historicalStatus: statsResult.historicalStatus,
        statusReason: statsResult.statusReason,
        hypotheticalReturn100,
        gameLogs: settlement.eligibleGames,
        source: demoMode
          ? "Demo memory dataset (set DATABASE_URL for PostgreSQL persistence)"
          : "BALLDONTLIE_API (Normalized & Cached)",
        fetchedAt: new Date().toISOString(),
        dataAsOf: newestFetchedAt,
        staleDataWarning,
      },
    },
  });
}
