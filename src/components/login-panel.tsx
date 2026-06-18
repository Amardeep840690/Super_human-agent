"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useToast } from "@/components/toast";

export function LoginPanel({
  isGoogleOAuthConfigured,
}: Readonly<{
  isGoogleOAuthConfigured: boolean;
}>) {
  const [isSigningIn, setIsSigningIn] = useState(false);
  const { pushToast } = useToast();

  const handleGoogleSignIn = async () => {
    setIsSigningIn(true);

    try {
      await signIn("google", { callbackUrl: "/dashboard" });
    } catch (error) {
      setIsSigningIn(false);
      pushToast({
        title: "Login failed",
        description:
          error instanceof Error
            ? error.message
            : "Unable to start Google sign in.",
        variant: "error",
      });
    }
  };

  return (
    <section className="mx-auto w-full max-w-5xl overflow-hidden rounded-[2rem] border border-white/10 bg-white/6 shadow-[0_40px_120px_-40px_rgba(15,23,42,0.85)] backdrop-blur-xl">
      <div className="grid lg:grid-cols-[1.1fr_0.9fr]">
        <div className="relative overflow-hidden p-8 sm:p-10 lg:p-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.24),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.16),transparent_26%)]" />
          <div className="relative space-y-6">
            <span className="inline-flex items-center rounded-full border border-sky-400/20 bg-sky-400/10 px-3 py-1 text-xs font-medium tracking-[0.24em] text-sky-200 uppercase">
              Superhuman Agent
            </span>
            <div className="space-y-4">
              <h1 className="max-w-md text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                A focused inbox and calendar assistant, built for speed.
              </h1>
              <p className="max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
                Log in with Google to unlock a tenant-scoped workspace. Each
                user keeps their own Corsair tenant via <code>user.id</code>,
                with Gmail and Calendar integrations ready to connect.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {[
                "JWT session auth",
                "Corsair tenant mapping",
                "Tailwind-only UI",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/10 bg-slate-950/45 px-4 py-3 text-sm text-slate-200"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 bg-slate-950/55 p-8 sm:p-10 lg:border-l lg:border-t-0 lg:p-12">
          <div className="space-y-5">
            <div>
              <p className="text-sm font-medium text-sky-200">Authentication</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">
                Continue with Google
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Sign in once, then use the dashboard, chat, and integrations
                routes without re-authenticating on every navigation.
              </p>
            </div>

            {!isGoogleOAuthConfigured ? (
              <div className="rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4 text-sm text-amber-100">
                Google OAuth env vars are not configured yet. Add
                <code className="mx-1 rounded bg-black/20 px-1.5 py-0.5">
                  GOOGLE_CLIENT_ID
                </code>
                and
                <code className="mx-1 rounded bg-black/20 px-1.5 py-0.5">
                  GOOGLE_CLIENT_SECRET
                </code>
                to enable login.
              </div>
            ) : null}

            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isSigningIn || !isGoogleOAuthConfigured}
              className="inline-flex w-full items-center justify-center gap-3 rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSigningIn ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-500 border-t-transparent" />
              ) : (
                <span className="h-2.5 w-2.5 rounded-full bg-sky-500" />
              )}
              Continue with Google
            </button>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
              <p className="font-medium text-white">What happens next</p>
              <p className="mt-2 leading-6">
                You land in the dashboard, then connect Gmail or Google Calendar
                using tenant-scoped Corsair auth flows.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
