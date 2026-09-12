import { NextResponse } from "next/server";
import { db, isDatabaseConfigured } from "@/db";
import { teams } from "@/db/schema";
import { seedDatabaseIfEmpty } from "@/lib/data/seed";
import { getFallbackTeams } from "@/lib/data/memoryFallback";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    if (!isDatabaseConfigured()) {
      return NextResponse.json({
        success: true,
        teams: getFallbackTeams(),
        demoMode: true,
      });
    }
    await seedDatabaseIfEmpty();
    const allTeams = await db.select().from(teams).orderBy(teams.fullName);
    return NextResponse.json({
      success: true,
      teams: allTeams,
    });
  } catch (error) {
    console.error("Error fetching teams:", error);
    try {
      return NextResponse.json({
        success: true,
        teams: getFallbackTeams(),
        demoMode: true,
      });
    } catch {
      return NextResponse.json(
        { success: false, error: "Failed to fetch teams" },
        { status: 500 }
      );
    }
  }
}
