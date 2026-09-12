import { NextRequest, NextResponse } from "next/server";
import { db, isDatabaseConfigured } from "@/db";
import { analysisSnapshots } from "@/db/schema";
import { desc } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    if (!isDatabaseConfigured()) {
      return NextResponse.json(
        { success: true, count: 0, snapshots: [], demoMode: true },
        { status: 200 }
      );
    }
    const searchParams = request.nextUrl.searchParams;
    const limitParam = searchParams.get("limit") || "50";
    const limit = Math.min(100, parseInt(limitParam, 10) || 50);

    const rows = await db
      .select()
      .from(analysisSnapshots)
      .orderBy(desc(analysisSnapshots.createdAt))
      .limit(limit);

    return NextResponse.json({
      success: true,
      count: rows.length,
      snapshots: rows,
    });
  } catch (error) {
    console.error("Error fetching snapshots:", error);
    return NextResponse.json(
      { success: true, count: 0, snapshots: [], demoMode: true },
      { status: 200 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      playerId,
      playerName,
      playerTeam,
      market,
      line,
      side,
      americanOdds,
      oppositeOdds,
      breakEvenProb,
      noVigProb,
      vigPercent,
      hitRate,
      hitRateGap,
      sampleSize,
      wins,
      losses,
      pushes,
      uncertaintyLower,
      uncertaintyUpper,
      hypotheticalReturn100,
      historicalStatus,
      evidenceWindow,
      opponentAbbr,
      gameEvidence,
      notes,
    } = body;

    // Generate collision-resistant snapshotId using Web Crypto (Node 16+)
    const snapshotId = `snap_${crypto.randomUUID().split("-")[0]}`;

    if (!isDatabaseConfigured()) {
      return NextResponse.json({
        success: true,
        snapshotId,
        demoMode: true,
        message:
          "Snapshot created in demo mode (not persisted). Set DATABASE_URL on Vercel to persist snapshots.",
        snapshotUrl: `/snapshots/${snapshotId}`,
      });
    }

    await db.insert(analysisSnapshots).values({
      snapshotId,
      playerId: parseInt(playerId, 10),
      playerName,
      playerTeam: playerTeam || "NBA",
      market,
      line: parseFloat(line),
      side,
      americanOdds: parseInt(americanOdds, 10),
      oppositeOdds: oppositeOdds ? parseInt(oppositeOdds, 10) : null,
      breakEvenProb: parseFloat(breakEvenProb),
      noVigProb: noVigProb ? parseFloat(noVigProb) : null,
      vigPercent: vigPercent ? parseFloat(vigPercent) : null,
      hitRate: parseFloat(hitRate),
      hitRateGap: parseFloat(hitRateGap),
      sampleSize: parseInt(sampleSize, 10),
      wins: parseInt(wins, 10),
      losses: parseInt(losses, 10),
      pushes: parseInt(pushes, 10),
      uncertaintyLower: parseFloat(uncertaintyLower),
      uncertaintyUpper: parseFloat(uncertaintyUpper),
      hypotheticalReturn100: parseFloat(hypotheticalReturn100),
      historicalStatus,
      evidenceWindow,
      opponentAbbr,
      gameEvidence: gameEvidence || [],
      source: "BALLDONTLIE_API (Normalized)",
      notes: notes || null,
    });

    return NextResponse.json({
      success: true,
      snapshotId,
      message: "Immutable analysis snapshot successfully saved.",
      snapshotUrl: `/snapshots/${snapshotId}`,
    });
  } catch (error) {
    console.error("Error creating snapshot:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create snapshot" },
      { status: 500 }
    );
  }
}
