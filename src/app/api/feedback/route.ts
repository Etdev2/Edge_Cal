import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { feedbackSubmissions } from "@/db/schema";
import { desc } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const rows = await db
      .select()
      .from(feedbackSubmissions)
      .orderBy(desc(feedbackSubmissions.createdAt))
      .limit(50);

    return NextResponse.json({
      success: true,
      feedback: rows,
    });
  } catch (error) {
    console.error("Error fetching feedback:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch feedback" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { category = "general", message, userEmail, snapshotId } = body;

    if (!message || message.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: "Feedback message cannot be empty" },
        { status: 400 }
      );
    }

    await db.insert(feedbackSubmissions).values({
      category,
      message: message.trim(),
      userEmail: userEmail?.trim() || null,
      snapshotId: snapshotId || null,
    });

    return NextResponse.json({
      success: true,
      message: "Feedback submitted successfully. Thank you for helping harden the beta!",
    });
  } catch (error) {
    console.error("Error submitting feedback:", error);
    return NextResponse.json(
      { success: false, error: "Failed to submit feedback" },
      { status: 500 }
    );
  }
}
