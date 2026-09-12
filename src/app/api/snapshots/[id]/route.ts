import { NextRequest, NextResponse } from "next/server";
import { db, isDatabaseConfigured } from "@/db";
import { analysisSnapshots } from "@/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    if (!isDatabaseConfigured()) {
      return NextResponse.json(
        {
          success: false,
          demoMode: true,
          error: "Snapshot persistence requires DATABASE_URL. This demo snapshot is not stored.",
        },
        { status: 404 }
      );
    }
    const rows = await db
      .select()
      .from(analysisSnapshots)
      .where(eq(analysisSnapshots.snapshotId, id))
      .limit(1);

    if (rows.length === 0) {
      return NextResponse.json(
        { success: false, error: "Snapshot not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      snapshot: rows[0],
    });
  } catch (error) {
    console.error("Error fetching snapshot:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load snapshot" },
      { status: 500 }
    );
  }
}
