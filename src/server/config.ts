export function getAppUrl() {
  const baseUrl =
    process.env.NEXTAUTH_URL ??
    process.env.AUTH_URL ??
    process.env.APP_URL ??
    "http://localhost:3000";

  return baseUrl.replace(/\/$/, "");
}

export function getOAuthRedirectUri(provider: "gmail" | "calendar") {
  return `${getAppUrl()}/api/connect/${provider}/callback`;
}
