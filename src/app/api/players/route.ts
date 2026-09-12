import { NextRequest, NextResponse } from "next/server";
import { db, isDatabaseConfigured } from "@/db";
import { players, teams } from "@/db/schema";
import { eq, ilike, or } from "drizzle-orm";
import { seedDatabaseIfEmpty } from "@/lib/data/seed";
import { getFallbackPlayers } from "@/lib/data/memoryFallback";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    // Demo memory mode — keeps `next build` green on Vercel without DATABASE_URL
    if (!isDatabaseConfigured()) {
      const searchParams = request.nextUrl.searchParams;
      const query = (searchParams.get("q") || "").toLowerCase();
      const teamIdParam = searchParams.get("teamId");

      let fallback = getFallbackPlayers();
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
      return NextResponse.json({
        success: true,
        count: fallback.length,
        players: fallback,
        demoMode: true,
      });
    }

    // Auto-seed if empty
    await seedDatabaseIfEmpty();

    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q") || "";
    const teamIdParam = searchParams.get("teamId");

    let playerRows = await db
      .select({
        id: players.id,
        externalId: players.externalId,
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
        query
          ? or(
              ilike(players.fullName, `%${query}%`),
              ilike(teams.abbreviation, `%${query}%`),
              ilike(teams.name, `%${query}%`)
            )
          : undefined
      );

    if (teamIdParam) {
      const tid = parseInt(teamIdParam, 10);
      if (!isNaN(tid)) {
        playerRows = playerRows.filter((p) => p.teamId === tid);
      }
    }

    return NextResponse.json({
      success: true,
      count: playerRows.length,
      players: playerRows,
    });
  } catch (error) {
    console.error("Error fetching players:", error);
    // Last-resort fallback so build never crashes
    try {
      const fallback = getFallbackPlayers();
      return NextResponse.json({
        success: true,
        count: fallback.length,
        players: fallback,
        demoMode: true,
      });
    } catch {
      return NextResponse.json(
        { success: false, error: "Failed to fetch players" },
        { status: 500 }
      );
    }
  }
}
