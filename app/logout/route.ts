import { NextResponse, type NextRequest } from "next/server";
import { safeNextUrl } from "@/lib/auth-next";
import { clearAuthNextCookie, createSupabaseRouteClient } from "@/lib/supabase-auth";

export async function GET(request: NextRequest) {
  const next = safeNextUrl(request.nextUrl.searchParams.get("next"));
  const response = NextResponse.redirect(next);
  const supabase = createSupabaseRouteClient(request, response);

  clearAuthNextCookie(response);
  await supabase?.auth.signOut();

  return response;
}
