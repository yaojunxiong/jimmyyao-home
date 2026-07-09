import { NextResponse, type NextRequest } from "next/server";
import { safeNextUrl } from "@/lib/auth-next";

export function GET(request: NextRequest) {
  const next = safeNextUrl(request.nextUrl.searchParams.get("next"), request.nextUrl.origin);
  return NextResponse.redirect(next);
}
