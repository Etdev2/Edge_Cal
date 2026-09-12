import { NextResponse } from "next/server";
import {
  AGE_CONFIRMATION_COOKIE,
  secureCookieOptions,
} from "@/lib/server/guards";

export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.set(
    AGE_CONFIRMATION_COOKIE,
    "1",
    secureCookieOptions(60 * 60 * 24 * 30)
  );
  return response;
}
