"use client";

import type { ReactNode } from "react";

type IntegrationStatus = {
  gmailConnected: boolean;
  calendarConnected: boolean;
};

type IntegrationKey = "gmail" | "calendar";

type SettingsPanelProps = {
  status: IntegrationStatus;
  pendingProvider: IntegrationKey | null;
  onConnect: (provider: IntegrationKey) => void;
  refreshing: boolean;
  onRefresh: () => void;
  headerSlot?: ReactNode;
};

function statusTone(isConnected: boolean) {
  return isConnected
    ? "bg-[var(--accent-soft)] text-[var(--accent)] border-[color:var(--border)]"
    : "bg-[var(--surface-muted)] text-[var(--muted)] border-[color:var(--border)]";
}

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
    accent: "bg-[var(--accent-soft)]",
  },
  {
    key: "calendar",
    title: "Google Calendar",
    description: "Inspect availability and coordinate time blocks.",
    accent: "bg-[var(--accent-soft)]",
  },
];

export function SettingsPanel({
  status,
  pendingProvider,
  onConnect,
  refreshing,
  onRefresh,
  headerSlot,
}: Readonly<SettingsPanelProps>) {
  return (
    <div className="fade-in space-y-4">
      <section className="rounded-[2rem] border border-[color:var(--border)] bg-[var(--card)] p-5 shadow-[0_20px_60px_-44px_rgba(var(--shadow),0.28)] sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--muted)]">
              Workspace settings
            </p>
            <h2 className="text-xl font-semibold tracking-tight text-[var(--foreground)]">
              Connected services and account controls
            </h2>
            <p className="max-w-2xl text-sm leading-6 text-[var(--muted)]">
              Gmail and Google Calendar stay tenant-scoped through the existing
              Corsair integration layer.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {headerSlot}
            <button
              type="button"
              onClick={onRefresh}
              disabled={refreshing}
              className="inline-flex items-center justify-center rounded-full border border-[color:var(--border)] bg-[var(--card)] px-4 py-2.5 text-sm font-semibold text-[var(--foreground)] shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-[var(--hover)] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
            >
              {refreshing ? "Refreshing..." : "Refresh status"}
            </button>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {integrations.map((integration) => {
          const connected =
            integration.key === "gmail"
              ? status.gmailConnected
              : status.calendarConnected;
          const isPending = pendingProvider === integration.key;

          return (
            <article
              key={integration.key}
              className="overflow-hidden rounded-[1.75rem] border border-[color:var(--border)] bg-[var(--card)] shadow-[0_20px_60px_-44px_rgba(var(--shadow),0.28)]"
            >
              <div className={`h-20 ${integration.accent}`} />
              <div className="space-y-4 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-[var(--foreground)]">
                      {integration.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                      {integration.description}
                    </p>
                  </div>
                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusTone(connected)}`}
                  >
                    {connected ? "Connected" : "Not connected"}
                  </span>
                </div>

                <div className="rounded-2xl border border-[color:var(--border)] bg-[var(--surface-muted)] px-4 py-3">
                  <p className="text-sm text-[var(--muted)]">
                    Current state:{" "}
                    <span className="font-medium text-[var(--foreground)]">
                      {connected ? "Connected" : "Not connected"}
                    </span>
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => onConnect(integration.key)}
                  disabled={isPending}
                  className="inline-flex w-full items-center justify-center rounded-full bg-[var(--accent)] px-4 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_-20px_rgba(37,99,235,0.42)] transition duration-200 hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isPending ? "Starting..." : connected ? `Reconnect ${integration.title}` : `Connect ${integration.title}`}
                </button>
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}
