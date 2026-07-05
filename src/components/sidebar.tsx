"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { ThemeToggle } from "@/components/theme-toggle";

type UserSummary = {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
};

type IntegrationStatus = {
  gmailConnected: boolean;
  calendarConnected: boolean;
};

type ActiveSection = "agent" | "dashboard" | "inbox" | "calendar" | "settings";

type SidebarProps = {
  user: UserSummary;
  status: IntegrationStatus;
  activeSection: ActiveSection;
  collapsed: boolean;
  mobile?: boolean;
  onToggleCollapse: () => void;
  onRequestClose?: () => void;
};

const navItems: Array<
  {
    id: ActiveSection;
    label: string;
    href: string;
    icon: ReactNode;
  }
> = [
  {
    id: "agent",
    label: "Agent",
    href: "/chat",
    type: "link",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 3 4.5 8v8L12 21l7.5-5V8L12 3Z" />
        <path d="M12 8v8M8.5 10.5 12 12.5l3.5-2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: "dashboard",
    label: "Dashboard",
    href: "/dashboard",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="4" y="4" width="7" height="7" rx="1.8" />
        <rect x="13" y="4" width="7" height="4" rx="1.8" />
        <rect x="13" y="10" width="7" height="10" rx="1.8" />
        <rect x="4" y="13" width="7" height="7" rx="1.8" />
      </svg>
    ),
  },
  {
    id: "inbox",
    label: "Inbox",
    href: "/inbox",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v8A2.5 2.5 0 0 1 17.5 17H13l-1 2-1-2H6.5A2.5 2.5 0 0 1 4 14.5v-8Z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: "calendar",
    label: "Calendar",
    href: "/calendar",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="4" y="5" width="16" height="15" rx="2" />
        <path d="M8 3.5v3M16 3.5v3M4 9h16" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "settings",
    label: "Settings",
    href: "/settings",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 8.5A3.5 3.5 0 1 1 8.5 12 3.5 3.5 0 0 1 12 8.5Z" />
        <path d="m19 12-.8-.5a1.5 1.5 0 0 1-.7-1.5 1.5 1.5 0 0 1 1-1.3l.9-.3-1.6-2.7-1 .5a1.5 1.5 0 0 1-1.7-.2 1.5 1.5 0 0 1-.5-1.6l.3-1-3 .1-.2 1a1.5 1.5 0 0 1-1.2 1.2 1.5 1.5 0 0 1-1.5-.6l-.6-.9-2.5 1.6.5 1a1.5 1.5 0 0 1-.2 1.7 1.5 1.5 0 0 1-1.5.6L3 9.5 3 12l1 .2a1.5 1.5 0 0 1 1.2 1.2 1.5 1.5 0 0 1-.6 1.5l-.8.6 1.7 2.5.9-.5a1.5 1.5 0 0 1 1.7.2 1.5 1.5 0 0 1 .6 1.5l-.2 1 2.9.1.3-1a1.5 1.5 0 0 1 1.4-1 1.5 1.5 0 0 1 1.3.7l.5.8 2.6-1.5-.4-.9a1.5 1.5 0 0 1 .2-1.7 1.5 1.5 0 0 1 1.5-.6l1 .2-.1-3Z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

function avatarFallback(name?: string | null) {
  const initial = name?.trim()?.[0]?.toUpperCase();
  return initial ?? "?";
}

function labelTone(active: boolean) {
  if (active) {
    return "bg-[var(--hover)] text-[var(--foreground)]";
  }

  return "text-[var(--muted)] hover:bg-[var(--hover)] hover:text-[var(--foreground)]";
}

export function Sidebar({
  user,
  status,
  activeSection,
  collapsed,
  mobile = false,
  onToggleCollapse,
  onRequestClose,
}: Readonly<SidebarProps>) {
  return (
    <aside
      className={`fixed inset-y-0 left-0 z-30 flex h-screen flex-col border-r border-[color:var(--border)] bg-[var(--sidebar)] shadow-[0_18px_60px_-34px_rgba(var(--shadow),0.26)] transition-[width,transform] duration-200 ease-out ${mobile ? "lg:hidden" : "hidden lg:flex"} ${collapsed ? "w-[72px]" : "w-[260px]"}`}
    >
      <div className={`flex items-center gap-3 px-3 py-4 ${collapsed ? "justify-center" : "justify-between"}`}>
        <Link
          href="/dashboard"
          onClick={onRequestClose}
          className={`flex items-center gap-3 rounded-2xl transition hover:bg-[var(--hover)] ${collapsed ? "p-0" : "px-2 py-1.5"}`}
          title="Superhuman Agent"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--accent)] text-sm font-semibold text-white shadow-[0_16px_30px_-20px_rgba(37,99,235,0.55)]">
            SA
          </div>
          {!collapsed ? (
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold tracking-tight text-[var(--foreground)]">
                Superhuman Agent
              </p>
              <p className="text-xs text-[var(--muted)]">Executive workspace</p>
            </div>
          ) : null}
        </Link>

        <button
          type="button"
          onClick={onToggleCollapse}
          className={`inline-flex h-9 w-9 items-center justify-center rounded-full border border-[color:var(--border)] bg-[var(--card)] text-[var(--muted)] shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-[var(--hover)] hover:text-[var(--foreground)] ${collapsed ? "absolute right-2 top-3" : ""}`}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <svg
            viewBox="0 0 24 24"
            className="h-4.5 w-4.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {collapsed ? <path d="m10 6 6 6-6 6" /> : <path d="m14 6-6 6 6 6" />}
          </svg>
        </button>
      </div>

      <nav className="mt-2 flex-1 space-y-1 px-3">
        {navItems.map((item) => {
          const active = item.id === activeSection;
          const baseClass =
            "group flex h-11 items-center gap-3 rounded-2xl border border-transparent px-3 text-sm font-medium transition duration-200";
          const content = (
            <>
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-xl transition ${active ? "bg-[var(--accent-soft)] text-[var(--accent)]" : "text-[var(--muted)] group-hover:bg-[var(--hover)] group-hover:text-[var(--foreground)]"}`}
              >
                {item.icon}
              </span>
              {!collapsed ? (
                <span className="flex min-w-0 flex-1 items-center justify-between">
                  <span className="truncate">{item.label}</span>
                </span>
              ) : null}
            </>
          );

          return (
            <Link
              key={item.id}
              href={item.href}
              onClick={onRequestClose}
              className={`${baseClass} ${active ? "border-[color:var(--border)] bg-[var(--hover)] text-[var(--foreground)] shadow-sm" : labelTone(false)}`}
              title={item.label}
            >
              {content}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-[color:var(--border)] p-3" />

      <div className="border-t border-[color:var(--border)] p-3">
        <div className={`rounded-[1.5rem] border border-[color:var(--border)] bg-[var(--card)] p-3 shadow-sm ${collapsed ? "flex justify-center" : ""}`}>
          <div className={`flex items-center gap-3 ${collapsed ? "justify-center" : ""}`}>
            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-2xl bg-[var(--surface-muted)] text-sm font-semibold text-[var(--foreground)]">
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
            {!collapsed ? (
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-[var(--foreground)]">
                  {user.name ?? "Unknown user"}
                </p>
                <p className="truncate text-xs text-[var(--muted)]">{user.email ?? "No email"}</p>
              </div>
            ) : null}
          </div>

          {!collapsed ? (
            <div className="mt-3 flex flex-wrap gap-2">
              <span
                className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${status.gmailConnected ? "border-[color:var(--border)] bg-[var(--accent-soft)] text-[var(--accent)]" : "border-[color:var(--border)] bg-[var(--surface-muted)] text-[var(--muted)]"}`}
              >
                Gmail {status.gmailConnected ? "connected" : "offline"}
              </span>
              <span
                className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${status.calendarConnected ? "border-[color:var(--border)] bg-[var(--accent-soft)] text-[var(--accent)]" : "border-[color:var(--border)] bg-[var(--surface-muted)] text-[var(--muted)]"}`}
              >
                Calendar {status.calendarConnected ? "connected" : "offline"}
              </span>
            </div>
          ) : null}
        </div>

        <div className={`mt-3 flex ${collapsed ? "flex-col" : "items-center gap-2"}`}>
          <ThemeToggle compact={collapsed} />
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/login" })}
            className={`inline-flex items-center justify-center rounded-full border border-[color:var(--border)] bg-[var(--card)] px-3 py-2 text-sm font-medium text-[var(--foreground)] shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-[var(--hover)] hover:shadow-md ${collapsed ? "mt-2 h-10 w-full px-0" : "flex-1"}`}
            title="Logout"
          >
            {collapsed ? (
              <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M10 17l5-5-5-5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M15 12H4" strokeLinecap="round" />
                <path d="M20 4v16" strokeLinecap="round" />
              </svg>
            ) : (
              "Logout"
            )}
          </button>
        </div>
      </div>
    </aside>
  );
}
