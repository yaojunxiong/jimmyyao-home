import { NextResponse, type NextRequest } from "next/server";
import { safeNextUrl } from "@/lib/auth-next";
import {
  clearAuthNextCookie,
  createSupabaseRouteClient,
  readAuthNextCookie
} from "@/lib/supabase-auth";

export async function GET(request: NextRequest) {
  const cookieNext = readAuthNextCookie(request);
  const next = safeNextUrl(cookieNext || request.nextUrl.searchParams.get("next"));
  const response = NextResponse.redirect(next);
  const supabase = createSupabaseRouteClient(request, response);
  const code = request.nextUrl.searchParams.get("code");

  clearAuthNextCookie(response);

  if (!supabase || !code) {
    return response;
  }

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    const loginUrl = new URL("/login", request.nextUrl.origin);
    loginUrl.searchParams.set("error", "callback_failed");
    return NextResponse.redirect(loginUrl);
  }

  return response;
}
