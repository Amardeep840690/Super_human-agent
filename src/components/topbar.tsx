"use client";

import Link from "next/link";

type TopbarProps = {
  title: string;
  description: string;
  onMenuClick?: () => void;
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
};

export function Topbar({
  title,
  description,
  onMenuClick,
  primaryAction,
  secondaryAction,
}: Readonly<TopbarProps>) {
  const secondaryDisabled = Boolean(
    secondaryAction?.disabled ?? secondaryAction?.loading,
  );

  return (
    <header className="sticky top-0 z-20 border-b border-[color:var(--border)] bg-[color:color-mix(in_srgb,var(--background)_88%,transparent)] backdrop-blur-xl">
      <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          {onMenuClick ? (
            <button
              type="button"
              onClick={onMenuClick}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--border)] bg-[var(--card)] text-[var(--muted)] shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-[var(--hover)] hover:text-[var(--foreground)] hover:shadow-md lg:hidden"
              aria-label="Open navigation"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              >
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          ) : null}

          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">
              Superhuman Agent
            </p>
            <h1 className="truncate text-lg font-semibold tracking-tight text-[var(--foreground)] sm:text-xl">
              {title}
            </h1>
            <p className="hidden truncate text-sm text-[var(--muted)] sm:block">
              {description}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {secondaryAction ? (
            <button
              type="button"
              onClick={secondaryAction.onClick}
              disabled={secondaryDisabled}
              className={`inline-flex items-center gap-2 rounded-full border border-[color:var(--border)] bg-[var(--card)] px-4 py-2 text-sm font-medium text-[var(--foreground)] shadow-sm transition duration-200 ${
                secondaryDisabled
                  ? "cursor-not-allowed opacity-70"
                  : "hover:-translate-y-0.5 hover:bg-[var(--hover)] hover:shadow-md"
              }`}
            >
              {secondaryAction.loading ? (
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4 animate-spin text-[var(--muted)]"
                  fill="none"
                  aria-hidden="true"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="9"
                    stroke="currentColor"
                    strokeWidth="2"
                    opacity="0.22"
                  />
                  <path
                    d="M21 12a9 9 0 0 0-9-9"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              ) : null}
              {secondaryAction.label}
            </button>
          ) : null}

          {primaryAction ? (
            <Link
              href={primaryAction.href}
              className="inline-flex items-center justify-center rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white shadow-[0_12px_30px_-16px_rgba(37,99,235,0.45)] transition duration-200 hover:-translate-y-0.5 hover:opacity-95"
            >
              {primaryAction.label}
            </Link>
          ) : null}
        </div>
      </div>
    </header>
  );
}
