import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseRouteClient } from "@/lib/supabase-auth";

export async function GET(request: NextRequest) {
  const cookieResponse = NextResponse.json({});
  const supabase = createSupabaseRouteClient(request, cookieResponse);

  if (!supabase) {
    return NextResponse.json({ user: null }, { headers: cookieResponse.headers });
  }

  const { data } = await supabase.auth.getUser();

  return NextResponse.json(
    {
      user: data.user
        ? {
            id: data.user.id,
            email: data.user.email,
            name: data.user.user_metadata?.name || data.user.email
          }
        : null
    },
    { headers: cookieResponse.headers }
  );
}
