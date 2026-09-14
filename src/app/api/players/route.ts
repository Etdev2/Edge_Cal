import { NextRequest, NextResponse } from "next/server";
import { db, isDatabaseConfigured } from "@/db";
import { players, teams, SPORT_IDS, DEFAULT_SPORT } from "@/db/schema";
import { eq, ilike, or, and } from "drizzle-orm";
import { seedDatabaseIfEmpty } from "@/lib/data/seed";
import { getFallbackPlayers } from "@/lib/data/memoryFallback";

export const dynamic = "force-dynamic";

const CACHE_HEADERS = {
  // Sport-filtered roster lists are cheap + low-churn; let the CDN (Vercel)
  // absorb repeated fetches for 60s with a 5min stale window.
  "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
};

function parseSport(value: string | null): string {
  const v = (value ?? "").toLowerCase();
  return SPORT_IDS.includes(v as (typeof SPORT_IDS)[number]) ? v : DEFAULT_SPORT;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const sport = parseSport(searchParams.get("sport"));

    // Demo memory mode — keeps `next build` green on Vercel without DATABASE_URL
    if (!isDatabaseConfigured()) {
      const query = (searchParams.get("q") || "").toLowerCase();
      const teamIdParam = searchParams.get("teamId");

      let fallback = getFallbackPlayers(sport as (typeof SPORT_IDS)[number]);
      if (query) {
        fallback = fallback.filter(
          (p) =>
            p.fullName.toLowerCase().includes(query) ||
            p.teamAbbr.toLowerCase().includes(query)
        );
      }
      if (teamIdParam) {
        const tid = parseInt(teamIdParam, 10);
        if (!isNaN(tid)) fallback = fallback.filter((p) => p.teamId === tid);
      }
      return NextResponse.json(
        { success: true, sport, count: fallback.length, players: fallback, demoMode: true },
        { headers: CACHE_HEADERS }
      );
    }

    // Auto-seed if empty
    await seedDatabaseIfEmpty();

    const query = searchParams.get("q") || "";
    const teamIdParam = searchParams.get("teamId");

    let playerRows = await db
      .select({
        id: players.id,
        externalId: players.externalId,
        sport: players.sport,
        firstName: players.firstName,
        lastName: players.lastName,
        fullName: players.fullName,
        position: players.position,
        jerseyNumber: players.jerseyNumber,
        teamId: players.teamId,
        teamAbbr: teams.abbreviation,
        teamName: teams.name,
        teamFullName: teams.fullName,
        teamColor: teams.primaryColor,
        height: players.height,
        weight: players.weight,
        avatarUrl: players.avatarUrl,
        isActive: players.isActive,
      })
      .from(players)
      .leftJoin(teams, eq(players.teamId, teams.id))
      .where(
        and(
          eq(players.sport, sport),
          eq(players.isActive, true),
          query
            ? or(
                ilike(players.fullName, `%${query}%`),
                ilike(teams.abbreviation, `%${query}%`),
                ilike(teams.name, `%${query}%`)
              )
            : undefined
        )
      );

    if (teamIdParam) {
      const tid = parseInt(teamIdParam, 10);
      if (!isNaN(tid)) {
        playerRows = playerRows.filter((p) => p.teamId === tid);
      }
    }

    return NextResponse.json(
      { success: true, sport, count: playerRows.length, players: playerRows },
      { headers: CACHE_HEADERS }
    );
  } catch (error) {
    console.error("Error fetching players:", error);
    // Last-resort fallback so build never crashes
    try {
      const sport = parseSport(request.nextUrl.searchParams.get("sport"));
      const fallback = getFallbackPlayers(sport as (typeof SPORT_IDS)[number]);
      return NextResponse.json(
        { success: true, sport, count: fallback.length, players: fallback, demoMode: true },
        { headers: CACHE_HEADERS }
      );
    } catch {
      return NextResponse.json(
        { success: false, error: "Failed to fetch players" },
        { status: 500 }
      );
    }
  }
}
