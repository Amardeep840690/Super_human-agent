import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/server/auth";
import { getIntegrationStatus } from "@/server/services/integration-status.service";
import { AppShell } from "@/components/app-shell";

export default async function CalendarPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const status = await getIntegrationStatus(session.user.id);

  return (
    <AppShell
      user={session.user}
      status={status}
      activeSection="calendar"
      title="Calendar"
      description="A focused calendar workspace built for upcoming planning flows."
      primaryAction={{ label: "Open Agent", href: "/chat" }}
    >
      <div className="fade-in grid min-h-[calc(100vh-10rem)] place-items-center">
        <section className="w-full max-w-2xl rounded-[2rem] border border-[color:var(--border)] bg-[var(--card)] p-6 text-center shadow-[0_24px_70px_-50px_rgba(var(--shadow),0.28)]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--muted)]">
            Calendar
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--foreground)]">
            Calendar workspace
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[var(--muted)]">
            This route now exists as a real page so navigation stays route-based
            and server components do not need placeholder callbacks.
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center rounded-full border border-[color:var(--border)] bg-[var(--surface-muted)] px-4 py-2.5 text-sm font-semibold text-[var(--foreground)] shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-[var(--hover)] hover:shadow-md"
            >
              Back to Dashboard
            </Link>
            <Link
              href="/settings"
              className="inline-flex items-center justify-center rounded-full bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_14px_30px_-20px_rgba(37,99,235,0.42)] transition duration-200 hover:opacity-95"
            >
              Open Settings
            </Link>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
