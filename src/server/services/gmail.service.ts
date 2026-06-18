import { generateOAuthUrl } from "corsair/oauth";
import { getOAuthRedirectUri } from "@/server/config";
import { getTenantCorsair } from "@/server/corsair/client";

export async function createGmailAuthorizationUrl(userId: string) {
  const tenant = getTenantCorsair(userId);
  const result = await generateOAuthUrl(tenant, "gmail", {
    tenantId: userId,
    redirectUri: getOAuthRedirectUri("gmail"),
  });

  return result.url;
}
