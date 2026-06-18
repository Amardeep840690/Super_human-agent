import "server-only";

import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { eq } from "drizzle-orm";
import { db } from "@/server/db";
import { users } from "@/server/db/schema";

import {
  authSecret,
  googleClientId,
  googleClientSecret,
  isGoogleOAuthConfigured,
} from "@/server/auth/config";

type GoogleProfile = {
  sub?: string;
  email?: string;
  name?: string;
  picture?: string;
};

async function upsertGoogleUser(profile: GoogleProfile) {
  if (!profile.sub || !profile.email) {
    throw new Error("Google profile is missing required fields");
  }

  const displayName = profile.name?.trim() || profile.email;
  const image = profile.picture?.trim() || null;
  const existingUsers = await db
    .select()
    .from(users)
    .where(eq(users.providerId, profile.sub))
    .limit(1);
  const existingUser = existingUsers[0] ?? null;

  if (!existingUser) {
    const [createdUser] = await db
      .insert(users)
      .values({
        id: crypto.randomUUID(),
        email: profile.email,
        name: displayName,
        image,
        provider: "google",
        providerId: profile.sub,
      })
      .onConflictDoUpdate({
        target: users.providerId,
        set: {
          email: profile.email,
          name: displayName,
          image,
          updatedAt: new Date(),
        },
      })
      .returning();

    return createdUser;
  }

  const [updatedUser] = await db
    .update(users)
    .set({
      email: profile.email,
      name: displayName,
      image,
      updatedAt: new Date(),
    })
    .where(eq(users.providerId, profile.sub))
    .returning();

  return updatedUser ?? existingUser;
}

const googleProvider =
  isGoogleOAuthConfigured && googleClientId && googleClientSecret
    ? Google({
        clientId: googleClientId,
        clientSecret: googleClientSecret,
        authorization: {
          params: {
            scope: "openid email profile",
          },
        },
      })
    : null;

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: authSecret,
  trustHost: true,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: googleProvider ? [googleProvider] : [],
  callbacks: {
    async signIn({ profile }) {
      return Boolean((profile as GoogleProfile | undefined)?.email);
    },
    async jwt({ token, account, profile }) {
      if (account?.provider === "google" && profile) {
        const googleProfile = profile as GoogleProfile;
        const user = await upsertGoogleUser(googleProfile);

        token.sub = user.id;
        token.name = user.name;
        token.email = user.email;
        token.picture = user.image ?? undefined;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
        session.user.name = token.name ?? session.user.name;
        session.user.email = token.email ?? session.user.email;
        session.user.image = token.picture ?? session.user.image;
      }

      return session;
    },
  },
});
