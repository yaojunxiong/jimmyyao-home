import { NextResponse, type NextRequest } from "next/server";
import { getAiWorldPortal, type AiWorldPortalId } from "@/components/ai-world/portals";
import { createSupabaseRouteClient } from "@/lib/supabase-auth";

const portalIds = new Set<AiWorldPortalId>(["study", "forum", "knowledge", "ai-lab", "admin"]);
const publicPortalIds = new Set<AiWorldPortalId>(["study", "forum", "knowledge"]);

function getSiteOrigin(request: NextRequest) {
  return process.env.AUTH_URL || request.nextUrl.origin;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ portal: string }> }
) {
  const { portal: rawPortalId } = await params;
  const siteOrigin = getSiteOrigin(request);

  if (!portalIds.has(rawPortalId as AiWorldPortalId)) {
    return NextResponse.redirect(new URL("/", siteOrigin));
  }

  const portal = getAiWorldPortal(rawPortalId as AiWorldPortalId);

  if (!portal?.enabled || !portal.url) {
    const url = new URL("/", siteOrigin);
    url.searchParams.set("entry", rawPortalId);
    url.searchParams.set("status", "coming-soon");
    return NextResponse.redirect(url);
  }

  if (publicPortalIds.has(portal.id)) {
    return NextResponse.redirect(portal.url);
  }

  const cookieResponse = NextResponse.json({});
  const supabase = createSupabaseRouteClient(request, cookieResponse);
  const user = supabase ? (await supabase.auth.getUser()).data.user : null;

  if (!user?.email) {
    const signInUrl = new URL("/login", siteOrigin);
    signInUrl.searchParams.set("next", `${siteOrigin}/entry/${portal.id}`);
    return NextResponse.redirect(signInUrl, { headers: cookieResponse.headers });
  }

  return NextResponse.redirect(portal.url, { headers: cookieResponse.headers });
}
