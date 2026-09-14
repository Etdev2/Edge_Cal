import { NextRequest, NextResponse } from "next/server";
import { db, isDatabaseConfigured } from "@/db";
import { teams, SPORT_IDS, DEFAULT_SPORT } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { seedDatabaseIfEmpty } from "@/lib/data/seed";
import { getFallbackTeams } from "@/lib/data/memoryFallback";

export const dynamic = "force-dynamic";

const CACHE_HEADERS = {
  "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
};

function parseSport(value: string | null): string {
  const v = (value ?? "").toLowerCase();
  return SPORT_IDS.includes(v as (typeof SPORT_IDS)[number]) ? v : DEFAULT_SPORT;
}

export async function GET(request: NextRequest) {
  try {
    const sport = parseSport(request.nextUrl.searchParams.get("sport"));

    if (!isDatabaseConfigured()) {
      return NextResponse.json(
        { success: true, sport, teams: getFallbackTeams(sport as (typeof SPORT_IDS)[number]), demoMode: true },
        { headers: CACHE_HEADERS }
      );
    }
    await seedDatabaseIfEmpty();
    const allTeams = await db
      .select()
      .from(teams)
      .where(eq(teams.sport, sport))
      .orderBy(asc(teams.fullName));
    return NextResponse.json(
      { success: true, sport, teams: allTeams },
      { headers: CACHE_HEADERS }
    );
  } catch (error) {
    console.error("Error fetching teams:", error);
    try {
      const sport = parseSport(request.nextUrl.searchParams.get("sport"));
      return NextResponse.json(
        { success: true, sport, teams: getFallbackTeams(sport as (typeof SPORT_IDS)[number]), demoMode: true },
        { headers: CACHE_HEADERS }
      );
    } catch {
      return NextResponse.json(
        { success: false, error: "Failed to fetch teams" },
        { status: 500 }
      );
    }
  }
}
