"use client";

import Link from "next/link";

type UserSummary = {
  name?: string | null;
  email?: string | null;
};

type IntegrationStatus = {
  gmailConnected: boolean;
  calendarConnected: boolean;
};

function statValue(isConnected: boolean) {
  return isConnected ? "Connected" : "Needs setup";
}

function statusChip(isConnected: boolean) {
  return isConnected
    ? "bg-[var(--accent-soft)] text-[var(--accent)] border-[color:var(--border)]"
    : "bg-[var(--surface-muted)] text-[var(--muted)] border-[color:var(--border)]";
}

export function DashboardHome({
  user,
  status,
}: Readonly<{
  user: UserSummary;
  status: IntegrationStatus;
}>) {
  const greeting = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(new Date());

  const quickActions = [
    { label: "Open Agent", href: "/chat" },
    { label: "Manage Settings", href: "/settings" },
    { label: "Review Inbox", href: "/inbox" },
    { label: "Check Calendar", href: "/calendar" },
  ];

  const todayOverview = [
    { label: "Gmail", value: statValue(status.gmailConnected) },
    { label: "Calendar", value: statValue(status.calendarConnected) },
    { label: "Focus", value: "2 priorities" },
    { label: "Mode", value: "Ready" },
  ];

  const suggestions = [
    "Summarize my inbox and surface urgent threads.",
    "Draft replies for anything waiting on me.",
    "Find time for a 30 minute meeting this week.",
  ];

  const activity = [
    {
      title: "Signed in",
      detail: "Workspace opened successfully.",
    },
    {
      title: "Integrations",
      detail: "Gmail and Calendar are available through Corsair.",
    },
    {
      title: "Assistant",
      detail: "Ready for email and scheduling tasks.",
    },
  ];

  return (
    <div className="fade-in space-y-6 pb-8">
      <section className="rounded-[2rem] border border-[color:var(--border)] bg-[var(--card)] p-6 shadow-[0_24px_70px_-50px_rgba(var(--shadow),0.28)]">
        <div className="space-y-3">
          <span className="inline-flex items-center rounded-full bg-[var(--surface-muted)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted)] border border-[color:var(--border)]">
            Welcome
          </span>
          <h2 className="text-3xl font-semibold tracking-tight text-[var(--foreground)]">
            Good to see you{user.name ? `, ${user.name}` : ""}.
          </h2>
          <p className="max-w-2xl text-sm leading-6 text-[var(--muted)]">
            {greeting}
          </p>
        </div>
      </section>

      <section className="rounded-[2rem] border border-[color:var(--border)] bg-[var(--card)] p-6 shadow-[0_24px_70px_-50px_rgba(var(--shadow),0.28)]">
        <div className="flex items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center rounded-full bg-[var(--surface-muted)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted)] border border-[color:var(--border)]">
              Quick Actions
            </span>
            <p className="mt-3 text-sm text-[var(--muted)]">
              Shortcuts for the most common tasks.
            </p>
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {quickActions.map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className="rounded-2xl border border-[color:var(--border)] bg-[var(--surface-muted)] px-4 py-4 text-sm font-medium text-[var(--foreground)] shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-[var(--hover)] hover:shadow-md"
            >
              {action.label}
            </Link>
          ))}
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
        <div className="rounded-[2rem] border border-[color:var(--border)] bg-[var(--card)] p-6 shadow-[0_24px_70px_-50px_rgba(var(--shadow),0.28)]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <span className="inline-flex items-center rounded-full bg-[var(--surface-muted)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted)] border border-[color:var(--border)]">
                Today&apos;s Overview
              </span>
              <p className="mt-3 text-sm text-[var(--muted)]">
                A quick read on the workspace.
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {todayOverview.map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-[color:var(--border)] bg-[var(--surface-muted)] p-4"
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--muted)]">
                  {item.label}
                </p>
                <p className="mt-2 text-base font-semibold text-[var(--foreground)]">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-[color:var(--border)] bg-[var(--card)] p-6 shadow-[0_24px_70px_-50px_rgba(var(--shadow),0.28)]">
          <span className="inline-flex items-center rounded-full bg-[var(--surface-muted)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted)] border border-[color:var(--border)]">
            Assistant Suggestions
          </span>
          <div className="mt-4 space-y-3">
            {suggestions.map((suggestion) => (
              <div
                key={suggestion}
                className="rounded-2xl border border-[color:var(--border)] bg-[var(--surface-muted)] px-4 py-4 text-sm leading-6 text-[var(--foreground)]"
              >
                {suggestion}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-[2rem] border border-[color:var(--border)] bg-[var(--card)] p-6 shadow-[0_24px_70px_-50px_rgba(var(--shadow),0.28)]">
        <span className="inline-flex items-center rounded-full bg-[var(--surface-muted)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted)] border border-[color:var(--border)]">
          Recent Activity
        </span>
        <div className="mt-4 space-y-3">
          {activity.map((item) => (
            <div
              key={item.title}
              className="flex items-start justify-between gap-4 rounded-2xl border border-[color:var(--border)] bg-[var(--surface-muted)] px-4 py-4"
            >
              <div>
                <p className="text-sm font-semibold text-[var(--foreground)]">
                  {item.title}
                </p>
                <p className="mt-1 text-sm text-[var(--muted)]">{item.detail}</p>
              </div>
              <span className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${statusChip(true)}`}>
                Now
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
