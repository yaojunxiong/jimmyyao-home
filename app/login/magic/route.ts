import { NextResponse, type NextRequest } from "next/server";
import { safeNextUrl } from "@/lib/auth-next";
import { createSupabaseRouteClient, getAuthCallbackUrl, setAuthNextCookie } from "@/lib/supabase-auth";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const email = String(formData.get("email") || "").trim();
  const next = safeNextUrl(String(formData.get("next") || ""));
  const loginUrl = new URL("/login", request.nextUrl.origin);
  loginUrl.searchParams.set("next", next);
  const response = NextResponse.redirect(loginUrl);
  const supabase = createSupabaseRouteClient(request, response);

  if (!email || !supabase) {
    loginUrl.searchParams.set("error", "magic_failed");
    return NextResponse.redirect(loginUrl);
  }

  setAuthNextCookie(response, next);

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: getAuthCallbackUrl()
    }
  });

  if (error) {
    loginUrl.searchParams.set("error", "magic_failed");
    return NextResponse.redirect(loginUrl);
  }

  loginUrl.searchParams.set("sent", "1");
  response.headers.set("Location", loginUrl.toString());
  return response;
}
