import { generateOAuthUrl } from "corsair/oauth";
import { getOAuthRedirectUri } from "@/server/config";
import { getTenantCorsair } from "@/server/corsair/client";

export async function createCalendarAuthorizationUrl(userId: string) {
  const tenant = getTenantCorsair(userId);
  const result = await generateOAuthUrl(tenant, "googlecalendar", {
    tenantId: userId,
    redirectUri: getOAuthRedirectUri("calendar"),
  });

  return result.url;
}
