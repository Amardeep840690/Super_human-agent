"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { useToast } from "@/components/toast";

type IntegrationStatus = {
  gmailConnected: boolean;
  calendarConnected: boolean;
};

type UserSummary = {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
};

type IntegrationKey = "gmail" | "calendar";

const integrations: Array<{
  key: IntegrationKey;
  title: string;
  description: string;
  accent: string;
}> = [
  {
    key: "gmail",
    title: "Gmail",
    description: "Read mail, draft responses, and prepare summaries.",
    accent: "from-sky-400/20 via-cyan-400/10 to-transparent",
  },
  {
    key: "calendar",
    title: "Google Calendar",
    description: "Inspect availability and coordinate time blocks.",
    accent: "from-emerald-400/20 via-teal-400/10 to-transparent",
  },
];

function statusFor(status: IntegrationStatus, key: IntegrationKey) {
  return key === "gmail" ? status.gmailConnected : status.calendarConnected;
}

function statusLabel(isConnected: boolean) {
  return isConnected ? "Connected" : "Not connected";
}

function avatarFallback(name?: string | null) {
  const initial = name?.trim()?.[0]?.toUpperCase();
  return initial ?? "?";
}

export function DashboardCenter({
  user,
  status: initialStatus,
  mode,
}: Readonly<{
  user: UserSummary;
  status: IntegrationStatus;
  mode: "dashboard" | "integrations";
}>) {
  const { pushToast } = useToast();
  const [status, setStatus] = useState(initialStatus);
  const [pendingProvider, setPendingProvider] = useState<IntegrationKey | null>(
    null,
  );
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    setStatus(initialStatus);
  }, [initialStatus]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const connected = params.get("connected");
    const error = params.get("error");

    if (connected) {
      pushToast({
        title: `${connected === "gmail" ? "Gmail" : "Calendar"} connected`,
        description: "Your OAuth flow completed successfully.",
        variant: "success",
      });
    }

    if (error) {
      pushToast({
        title: "Integration error",
        description: error,
        variant: "error",
      });
    }

    if (connected || error) {
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

  const refreshStatus = async () => {
    setRefreshing(true);

    try {
      const response = await fetch("/api/integrations/status", {
        method: "GET",
      });

      const payload = (await response.json()) as IntegrationStatus & {
        error?: string;
      };

      if (!response.ok) {
        throw new Error(payload.error ?? "Unable to refresh status");
      }

      setStatus({
        gmailConnected: payload.gmailConnected,
        calendarConnected: payload.calendarConnected,
      });
      pushToast({
        title: "Status refreshed",
        description: "Fetched the latest integration state.",
        variant: "success",
      });
    } catch (error) {
      pushToast({
        title: "Refresh failed",
        description:
          error instanceof Error ? error.message : "Unable to refresh status.",
        variant: "error",
      });
    } finally {
      setRefreshing(false);
    }
  };

  const startConnect = async (provider: IntegrationKey) => {
    setPendingProvider(provider);

    try {
      const response = await fetch(`/api/connect/${provider}`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
      });

      const payload = (await response.json()) as {
        authorizationUrl?: string;
        error?: string;
      };

      if (!response.ok || !payload.authorizationUrl) {
        throw new Error(payload.error ?? `Unable to start ${provider} connect`);
      }

      pushToast({
        title: `Opening ${provider === "gmail" ? "Gmail" : "Calendar"}`,
        description: "Redirecting to Google authorization.",
        variant: "info",
      });

      window.setTimeout(() => {
        window.location.assign(payload.authorizationUrl!);
      }, 120);
    } catch (error) {
      pushToast({
        title: "Connection failed",
        description:
          error instanceof Error ? error.message : "Unable to open auth flow.",
        variant: "error",
      });
      setPendingProvider(null);
    }
  };

  const isDashboard = mode === "dashboard";

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <section className="rounded-[2rem] border border-white/10 bg-white/6 p-6 shadow-[0_30px_80px_-30px_rgba(15,23,42,0.8)] backdrop-blur-xl sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-slate-900/70 text-xl font-semibold text-white shadow-lg shadow-black/20">
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.name ?? "User avatar"}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span>{avatarFallback(user.name)}</span>
              )}
            </div>

            <div className="space-y-2">
              <span className="inline-flex items-center rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-medium tracking-[0.22em] text-emerald-200 uppercase">
                Signed in
              </span>
              <div>
                <h1 className="text-3xl font-semibold tracking-tight text-white">
                  {isDashboard ? "Dashboard" : "Integrations"}
                </h1>
                <p className="mt-1 text-sm text-slate-300">
                  {user.name ?? "Unknown user"} · {user.email ?? "No email"}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={refreshStatus}
              disabled={refreshing}
              className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {refreshing ? "Refreshing..." : "Refresh status"}
            </button>
            <Link
              href="/chat"
              className="inline-flex items-center justify-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
            >
              Open Assistant
            </Link>
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="inline-flex items-center justify-center rounded-full border border-rose-400/20 bg-rose-400/10 px-4 py-2 text-sm font-medium text-rose-100 transition hover:bg-rose-400/20"
            >
              Logout
            </button>
          </div>
        </div>

        {isDashboard ? (
          <div className="mt-8 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-3xl border border-white/10 bg-slate-950/50 p-5">
              <p className="text-xs font-medium uppercase tracking-[0.24em] text-sky-200">
                Workspace
              </p>
              <h2 className="mt-3 text-2xl font-semibold text-white">
                Everything starts with a clean tenant.
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
                Each Corsair operation uses{" "}
                <code>corsair.withTenant(user.id)</code>
                so Gmail and Calendar stay scoped to the signed-in user without
                a separate tenant table.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <p className="text-xs font-medium uppercase tracking-[0.24em] text-sky-200">
                Assistant entry
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                Use the open assistant button to jump into the chat surface and
                build out your workflow engine.
              </p>
            </div>
          </div>
        ) : (
          <div className="mt-8 rounded-3xl border border-white/10 bg-slate-950/50 p-5">
            <p className="text-sm leading-6 text-slate-300">
              Connect Gmail and Calendar from this page. The cards below will
              take you through the OAuth flow and return you here after
              authorization.
            </p>
          </div>
        )}
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {integrations.map((integration) => {
          const connected = statusFor(status, integration.key);
          const isPending = pendingProvider === integration.key;

          return (
            <article
              key={integration.key}
              className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/6 p-6 shadow-[0_25px_70px_-30px_rgba(15,23,42,0.8)] backdrop-blur-xl"
            >
              <div
                className={`absolute inset-x-0 top-0 h-24 bg-gradient-to-br ${integration.accent}`}
              />
              <div className="relative space-y-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-semibold text-white">
                      {integration.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-300">
                      {integration.description}
                    </p>
                  </div>
                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-medium ${
                      connected
                        ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-100"
                        : "border-slate-500/20 bg-slate-500/10 text-slate-300"
                    }`}
                  >
                    {statusLabel(connected)}
                  </span>
                </div>

                <div className="rounded-2xl border border-white/10 bg-slate-950/55 p-4">
                  <p className="text-sm text-slate-300">
                    Status:{" "}
                    <span className="font-medium text-white">
                      {connected ? "Connected" : "Not connected"}
                    </span>
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => startConnect(integration.key)}
                  disabled={isPending}
                  className="inline-flex w-full items-center justify-center rounded-full bg-white px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isPending ? (
                    <>
                      <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-slate-500 border-t-transparent" />
                      Starting...
                    </>
                  ) : connected ? (
                    `Reconnect ${integration.title}`
                  ) : (
                    `Connect ${integration.title}`
                  )}
                </button>
              </div>
            </article>
          );
        })}
      </section>
    </main>
  );
}
