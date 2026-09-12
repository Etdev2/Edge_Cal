import { NextRequest, NextResponse } from "next/server";
import { INVITE_COOKIE, secureCookieOptions } from "@/lib/server/guards";

const PUBLIC_PATHS = new Set([
  "/api/age-gate",
  "/api/health",
  "/api/invite",
  "/compliance",
  "/invite",
  "/privacy",
  "/terms",
]);

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.has(pathname) || pathname.startsWith("/_next/") || pathname === "/favicon.ico";
}

export function middleware(request: NextRequest) {
  const expected = process.env.INVITE_CODE?.trim();
  if (!expected || isPublicPath(request.nextUrl.pathname)) {
    return NextResponse.next();
  }

  if (request.cookies.get(INVITE_COOKIE)?.value === expected) {
    return NextResponse.next();
  }

  // A one-time invite link is convenient for beta testers, but redirect away
  // from the query string immediately so the code is not left in browser history.
  const queryCode = request.nextUrl.searchParams.get("invite");
  if (queryCode === expected) {
    const cleanUrl = request.nextUrl.clone();
    cleanUrl.searchParams.delete("invite");
    const response = NextResponse.redirect(cleanUrl);
    response.cookies.set(INVITE_COOKIE, expected, secureCookieOptions(60 * 60 * 24 * 30));
    return response;
  }

  if (request.nextUrl.pathname.startsWith("/api/")) {
    return NextResponse.json(
      { success: false, error: "A valid beta invite is required.", code: "INVITE_REQUIRED" },
      { status: 403 }
    );
  }

  return NextResponse.redirect(new URL("/invite", request.url));
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
