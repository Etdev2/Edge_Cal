import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { players, teams, playerGameStats } from "@/db/schema";
import { eq, ilike, or, sql } from "drizzle-orm";
import { seedDatabaseIfEmpty } from "@/lib/data/seed";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
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
    return NextResponse.json(
      { success: false, error: "Failed to fetch players" },
      { status: 500 }
    );
  }
}
