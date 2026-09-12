import { NextRequest, NextResponse } from "next/server";

export const AGE_CONFIRMATION_COOKIE = "edge_cal_age_confirmed";
export const INVITE_COOKIE = "edge_cal_invite";

export function hasAgeConfirmation(request: NextRequest): boolean {
  return request.cookies.get(AGE_CONFIRMATION_COOKIE)?.value === "1";
}

export function ageRequiredResponse(): NextResponse {
  return NextResponse.json(
    {
      success: false,
      error: "Confirm that you are 21 or older before requesting analysis.",
      code: "AGE_CONFIRMATION_REQUIRED",
    },
    { status: 403 }
  );
}

export function secureCookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge,
  };
}
