export const isGoogleOAuthConfigured = Boolean(
  process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET,
);

export const googleClientId = process.env.GOOGLE_CLIENT_ID ?? "";
export const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET ?? "";

export const authSecret =
  process.env.AUTH_SECRET ??
  process.env.NEXTAUTH_SECRET ??
  "superhuman-agent-dev-secret";
