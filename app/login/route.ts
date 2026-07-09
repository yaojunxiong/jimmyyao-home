import { NextResponse, type NextRequest } from "next/server";
import { safeNextUrl } from "@/lib/auth-next";

export function GET(request: NextRequest) {
  const next = safeNextUrl(request.nextUrl.searchParams.get("next"), request.nextUrl.origin);
  const signInUrl = new URL("/api/auth/signin", request.nextUrl.origin);
  signInUrl.searchParams.set("callbackUrl", next);

  return NextResponse.redirect(signInUrl);
}
