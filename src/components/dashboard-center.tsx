"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useToast } from "@/components/toast";
import { AppShell } from "@/components/app-shell";
import { DashboardHome } from "@/components/dashboard-home";
import { SettingsPanel } from "@/components/settings-panel";

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
type ActiveSection = "dashboard" | "settings";

function pageCopy(mode: "dashboard" | "settings") {
  return mode === "dashboard"
    ? {
        activeSection: "dashboard" as ActiveSection,
        title: "Dashboard",
        description: "Your command center for AI-assisted email and calendar work.",
      }
    : {
        activeSection: "settings" as ActiveSection,
        title: "Settings",
        description: "Manage your connected services and workspace preferences.",
      };
}

export function DashboardCenter({
  user,
  status: initialStatus,
  mode,
}: Readonly<{
  user: UserSummary;
  status: IntegrationStatus;
  mode: "dashboard" | "settings";
}>) {
  const { pushToast } = useToast();
  const [status, setStatus] = useState(initialStatus);
  const [pendingProvider, setPendingProvider] = useState<IntegrationKey | null>(
    null,
  );
  const [refreshing, setRefreshing] = useState(false);

  const copy = pageCopy(mode);

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
  }, [pushToast]);

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

  return (
    <AppShell
      user={user}
      status={status}
      activeSection={copy.activeSection}
      title={copy.title}
      description={copy.description}
      primaryAction={{ label: "Open Agent", href: "/chat" }}
      secondaryAction={mode === "settings" ? { label: "Refresh status", onClick: refreshStatus } : undefined}
    >
      {mode === "dashboard" ? (
        <DashboardHome user={user} status={status} />
      ) : (
        <SettingsPanel
          status={status}
          pendingProvider={pendingProvider}
          onConnect={startConnect}
          refreshing={refreshing}
          onRefresh={refreshStatus}
          headerSlot={
            <Link
              href="/chat"
              className="inline-flex items-center justify-center rounded-full border border-[color:var(--border)] bg-[var(--card)] px-4 py-2.5 text-sm font-semibold text-[var(--foreground)] shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-[var(--hover)] hover:shadow-md"
            >
              Open Agent
            </Link>
          }
        />
      )}
    </AppShell>
  );
}
