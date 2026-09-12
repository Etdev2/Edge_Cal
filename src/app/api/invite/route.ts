import { NextRequest, NextResponse } from "next/server";
import {
  INVITE_COOKIE,
  secureCookieOptions,
} from "@/lib/server/guards";

export async function POST(request: NextRequest) {
  const expected = process.env.INVITE_CODE?.trim();
  if (!expected) {
    return NextResponse.json(
      { success: false, error: "Invite gating is not configured." },
      { status: 503 }
    );
  }

  const body = await request.json().catch(() => ({}));
  const code = typeof body.code === "string" ? body.code.trim() : "";
  if (!code || code !== expected) {
    return NextResponse.json(
      { success: false, error: "That invite code is not valid." },
      { status: 403 }
    );
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set(INVITE_COOKIE, expected, secureCookieOptions(60 * 60 * 24 * 30));
  return response;
}
