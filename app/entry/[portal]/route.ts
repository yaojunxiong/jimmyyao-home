import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@/auth";
import { getAiWorldPortal, type AiWorldPortalId } from "@/components/ai-world/portals";

const portalIds = new Set<AiWorldPortalId>(["study", "forum", "knowledge", "ai-lab", "admin"]);

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

  const session = await auth();

  if (!session?.user?.email) {
    const signInUrl = new URL("/login", siteOrigin);
    signInUrl.searchParams.set("next", `${siteOrigin}/entry/${portal.id}`);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.redirect(portal.url);
}
