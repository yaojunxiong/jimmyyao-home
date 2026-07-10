import { createBrowserClient } from "@supabase/ssr";

export function createSupabaseBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !publishableKey) {
    return null;
  }

  const isProduction =
    typeof window !== "undefined" &&
    (window.location.hostname === "jimmyyao.com" ||
      window.location.hostname.endsWith(".jimmyyao.com"));

  return createBrowserClient(url, publishableKey, {
    cookieOptions: {
      domain: isProduction ? ".jimmyyao.com" : undefined,
      path: "/",
      sameSite: "lax",
      secure: isProduction
    }
  });
}
