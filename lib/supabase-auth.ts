import { createServerClient, type CookieOptions } from "@supabase/ssr";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const authNextCookie = "jimmyyao-auth-next";
const callbackUrl = "https://www.jimmyyao.com/auth/callback";

function isProduction() {
  return process.env.NODE_ENV === "production";
}

function cookieDomain() {
  return isProduction() ? process.env.AUTH_COOKIE_DOMAIN || ".jimmyyao.com" : undefined;
}

function sharedCookieOptions(): CookieOptions {
  return {
    domain: cookieDomain(),
    path: "/",
    sameSite: "lax",
    secure: isProduction()
  };
}

export function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !anonKey) {
    return null;
  }

  return { url, anonKey };
}

export function getAuthCallbackUrl() {
  return callbackUrl;
}

export function createSupabaseRouteClient(request: NextRequest, response: NextResponse) {
  const config = getSupabaseConfig();

  if (!config) {
    return null;
  }

  return createServerClient(config.url, config.anonKey, {
    cookieOptions: sharedCookieOptions(),
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, {
            ...options,
            domain: cookieDomain(),
            path: options.path || "/",
            sameSite: options.sameSite || "lax",
            secure: isProduction()
          });
        });
      }
    }
  });
}

export function setAuthNextCookie(response: NextResponse, next: string) {
  response.cookies.set(authNextCookie, next, {
    domain: cookieDomain(),
    httpOnly: true,
    maxAge: 60 * 10,
    path: "/",
    sameSite: "lax",
    secure: isProduction()
  });
}

export function readAuthNextCookie(request: NextRequest) {
  return request.cookies.get(authNextCookie)?.value || null;
}

export function clearAuthNextCookie(response: NextResponse) {
  response.cookies.set(authNextCookie, "", {
    domain: cookieDomain(),
    expires: new Date(0),
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: isProduction()
  });
}
