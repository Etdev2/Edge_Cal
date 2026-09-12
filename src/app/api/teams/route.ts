import { NextResponse } from "next/server";
import { db } from "@/db";
import { teams } from "@/db/schema";
import { seedDatabaseIfEmpty } from "@/lib/data/seed";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await seedDatabaseIfEmpty();
    const allTeams = await db.select().from(teams).orderBy(teams.fullName);
    return NextResponse.json({
      success: true,
      teams: allTeams,
    });
  } catch (error) {
    console.error("Error fetching teams:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch teams" },
      { status: 500 }
    );
  }
}
