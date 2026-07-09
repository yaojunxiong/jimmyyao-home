import { NextResponse, type NextRequest } from "next/server";
import { safeNextUrl } from "@/lib/auth-next";

export function GET(request: NextRequest) {
  const next = safeNextUrl(request.nextUrl.searchParams.get("next"), request.nextUrl.origin);
  const signOutUrl = new URL("/api/auth/signout", request.nextUrl.origin);
  signOutUrl.searchParams.set("callbackUrl", next);

  return NextResponse.redirect(signOutUrl);
}
