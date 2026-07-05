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
    <section className="mx-auto w-full max-w-5xl overflow-hidden rounded-[2rem] border border-[color:var(--border)] bg-[var(--card)] shadow-[0_40px_120px_-56px_rgba(var(--shadow),0.26)]">
      <div className="grid lg:grid-cols-[1.1fr_0.9fr]">
        <div className="relative overflow-hidden p-8 sm:p-10 lg:p-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.10),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(15,23,42,0.05),transparent_26%)]" />
          <div className="relative space-y-5">
            <span className="inline-flex items-center rounded-full border border-[color:var(--border)] bg-[var(--surface-muted)] px-3 py-1 text-xs font-semibold tracking-[0.24em] text-[var(--accent)] uppercase">
              Superhuman Agent
            </span>
            <div className="space-y-3">
              <h1 className="max-w-md text-4xl font-semibold tracking-tight text-[var(--foreground)] sm:text-5xl">
                Manage email, schedule meetings, and automate daily work from one place.
              </h1>
              <p className="max-w-lg text-sm leading-6 text-[var(--muted)] sm:text-base">
                Sign in with Google to open your workspace.
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-[color:var(--border)] bg-[linear-gradient(180deg,var(--surface-muted)_0%,var(--card)_100%)] p-8 sm:p-10 lg:border-l lg:border-t-0 lg:p-12">
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-[var(--accent)]">
                Authentication
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-[var(--foreground)]">
                Sign in with Google
              </h2>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                One sign in gives you access to the workspace.
              </p>
            </div>

            {!isGoogleOAuthConfigured ? (
              <div className="rounded-2xl border border-[color:var(--border)] bg-[var(--surface-muted)] p-4 text-sm text-[var(--muted)]">
                Google login is not configured yet.
              </div>
            ) : null}

            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isSigningIn || !isGoogleOAuthConfigured}
              className="inline-flex w-full items-center justify-center gap-3 rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white transition duration-200 hover:-translate-y-0.5 hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSigningIn ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/50 border-t-transparent" />
              ) : (
                <span className="h-2.5 w-2.5 rounded-full bg-[var(--card)]" />
              )}
              Continue with Google
            </button>

            <div className="rounded-2xl border border-[color:var(--border)] bg-[var(--card)] p-4 text-sm text-[var(--muted)]">
              You can connect Gmail and Calendar after signing in.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
