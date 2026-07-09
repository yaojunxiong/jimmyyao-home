import { NextResponse, type NextRequest } from "next/server";
import { safeNextUrl } from "@/lib/auth-next";
import { createSupabaseRouteClient, getAuthCallbackUrl, setAuthNextCookie } from "@/lib/supabase-auth";

export async function GET(request: NextRequest) {
  const next = safeNextUrl(request.nextUrl.searchParams.get("next"));
  const fallbackUrl = new URL("/login", request.nextUrl.origin);
  const response = NextResponse.redirect(fallbackUrl);
  const supabase = createSupabaseRouteClient(request, response);

  if (!supabase) {
    fallbackUrl.searchParams.set("error", "auth_not_configured");
    return NextResponse.redirect(fallbackUrl);
  }

  setAuthNextCookie(response, next);

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: getAuthCallbackUrl()
    }
  });

  if (error || !data.url) {
    fallbackUrl.searchParams.set("error", "google_failed");
    return NextResponse.redirect(fallbackUrl);
  }

  response.headers.set("Location", data.url);
  return response;
}
