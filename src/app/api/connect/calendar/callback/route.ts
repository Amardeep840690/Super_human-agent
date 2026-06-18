import { NextResponse } from "next/server";
import { auth } from "@/server/auth";
import { processOAuthCallback } from "corsair/oauth";
import { getTenantCorsair } from "@/server/corsair/client";
import { getOAuthRedirectUri } from "@/server/config";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const session = await auth();
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  if (!session?.user?.id) {
    return NextResponse.redirect(new URL("/login", url.origin));
  }

  if (!code || !state) {
    return NextResponse.redirect(
      new URL("/integrations?error=calendar_oauth_missing", url.origin),
    );
  }

  try {
    const tenant = getTenantCorsair(session.user.id);
    const result = await processOAuthCallback(tenant, {
      code,
      state,
      redirectUri: getOAuthRedirectUri("calendar"),
    });

    if (result.tenantId !== session.user.id) {
      return NextResponse.redirect(
        new URL("/integrations?error=calendar_oauth_mismatch", url.origin),
      );
    }

    return NextResponse.redirect(
      new URL("/integrations?connected=calendar", url.origin),
    );
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unable to complete Calendar connect";

    return NextResponse.redirect(
      new URL(`/integrations?error=${encodeURIComponent(message)}`, url.origin),
    );
  }
}
