"use client";

import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { Sidebar } from "@/components/sidebar";
import { Topbar } from "@/components/topbar";

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

type AppShellProps = {
  user: UserSummary;
  status: IntegrationStatus;
  activeSection: ActiveSection;
  title: string;
  description: string;
  contentScroll?: "auto" | "none";
  primaryAction?: {
    label: string;
    href: string;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
    disabled?: boolean;
    loading?: boolean;
  };
  children: ReactNode;
};

const STORAGE_KEY = "superhuman-agent-sidebar";

function readSidebarPreference() {
  if (typeof window === "undefined") {
    return false;
  }

  return window.localStorage.getItem(STORAGE_KEY) === "collapsed";
}

export function AppShell({
  user,
  status,
  activeSection,
  title,
  description,
  contentScroll = "auto",
  primaryAction,
  secondaryAction,
  children,
}: Readonly<AppShellProps>) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(readSidebarPreference);
  const sidebarWidth = sidebarCollapsed ? 72 : 260;

  useEffect(() => {
    window.localStorage.setItem(
      STORAGE_KEY,
      sidebarCollapsed ? "collapsed" : "expanded",
    );
    document.documentElement.style.setProperty(
      "--sidebar-width",
      `${sidebarWidth}px`,
    );
  }, [sidebarCollapsed, sidebarWidth]);

  const closeMobileNav = () => setMobileNavOpen(false);

  return (
    <div
      className="h-screen overflow-hidden bg-[var(--background)] text-[var(--foreground)]"
      style={{ "--sidebar-width": `${sidebarWidth}px` } as CSSProperties}
    >
      <Sidebar
        user={user}
        status={status}
        activeSection={activeSection}
        collapsed={sidebarCollapsed}
        mobile={false}
        onToggleCollapse={() => setSidebarCollapsed((current) => !current)}
      />

      <div className="flex h-screen flex-col transition-[padding-left] duration-200 ease-out lg:pl-[var(--sidebar-width)]">
        <Topbar
          title={title}
          description={description}
          onMenuClick={() => setMobileNavOpen(true)}
          primaryAction={primaryAction}
          secondaryAction={secondaryAction}
        />

        <main className="min-h-0 flex-1 overflow-hidden">
          <div
            className={`h-full px-4 py-4 sm:px-6 lg:px-8 lg:py-6 ${
              contentScroll === "auto"
                ? "overflow-y-auto"
                : "overflow-hidden"
            }`}
          >
            {children}
          </div>
        </main>
      </div>

      {mobileNavOpen ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            aria-label="Close navigation overlay"
            className="absolute inset-0 bg-slate-950/25 backdrop-blur-[2px]"
            onClick={closeMobileNav}
          />
          <div className="absolute left-0 top-0 h-full">
            <Sidebar
              user={user}
              status={status}
              activeSection={activeSection}
              collapsed={false}
              mobile
              onToggleCollapse={() => undefined}
              onRequestClose={closeMobileNav}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
