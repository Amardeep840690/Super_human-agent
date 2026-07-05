"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { Skeleton, SkeletonCard } from "@/components/skeletons";
import { useToast } from "@/components/toast";
import { InboxEmailReader } from "@/components/inbox-email-reader";

import type {
  InboxCategory,
  InboxEmailDetail,
  InboxEmailPage,
  InboxEmailSummary,
} from "@/types/inbox";

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

type InboxCenterProps = {
  user: UserSummary;
  status: IntegrationStatus;
  initialPage: InboxEmailPage;
};

const filters: Array<{ id: InboxCategory; label: string }> = [
  { id: "all", label: "All" },
  { id: "primary", label: "Primary" },
  { id: "promotions", label: "Promotions" },
  { id: "social", label: "Social" },
  { id: "unread", label: "Unread" },
];

function formatRowDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function formatCategoryLabel(category: string) {
  return category
    .replace(/^CATEGORY_/i, "")
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function matchesFilter(email: InboxEmailSummary, filter: InboxCategory) {
  if (filter === "unread") {
    return email.unread;
  }

  if (filter === "all") {
    return true;
  }

  const categoryLabel = `CATEGORY_${filter.toUpperCase()}`;
  return email.categories.includes(categoryLabel);
}

function matchesSearch(email: InboxEmailSummary, search: string) {
  const normalizedQuery = search.trim().toLowerCase();

  if (!normalizedQuery) {
    return true;
  }

  const searchable = [
    email.sender,
    email.senderEmail ?? "",
    email.subject,
    email.preview,
    ...email.categories,
  ]
    .join(" ")
    .toLowerCase();

  return searchable.includes(normalizedQuery);
}

function filterEmails(
  emails: InboxEmailSummary[],
  search: string,
  filter: InboxCategory,
) {
  return emails.filter(
    (email) => matchesFilter(email, filter) && matchesSearch(email, search),
  );
}

function inboxEmptyMessage(
  hasConnection: boolean,
  hasQuery: boolean,
  filter: InboxCategory,
  hasMore: boolean,
) {
  if (!hasConnection) {
    return {
      title: "Connect Gmail to start reading mail",
      description:
        "Once Gmail is connected, your inbox cache will appear here.",
    };
  }

  if (hasQuery || filter !== "all") {
    return {
      title: "No matching emails",
      description: hasMore
        ? "No matches in the currently loaded cache yet. More cached mail will load as you scroll."
        : "Try a different search term or filter.",
    };
  }

  return {
    title: "Your inbox cache is empty",
    description: "Use Refresh Inbox to sync the latest messages from Gmail.",
  };
}

function Spinner({
  className = "h-4 w-4",
}: Readonly<{
  className?: string;
}>) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`${className} animate-spin`}
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
  );
}

function InboxListItem({
  email,
  selected,
  onSelect,
  registerRef,
}: Readonly<{
  email: InboxEmailSummary;
  selected: boolean;
  onSelect: (emailId: string) => void;
  registerRef: (emailId: string, element: HTMLButtonElement | null) => void;
}>) {
  return (
    <button
      ref={(element) => registerRef(email.id, element)}
      type="button"
      onClick={() => onSelect(email.id)}
      className={`group block w-full rounded-[1.5rem] border px-4 py-4 text-left transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--card)] ${
        selected
          ? "border-[color:color-mix(in_srgb,var(--accent)_36%,var(--border))] bg-[color:color-mix(in_srgb,var(--accent-soft)_70%,var(--surface-muted))] shadow-[0_22px_56px_-44px_rgba(var(--shadow),0.3)]"
          : "border-[color:var(--border)] bg-[var(--surface-muted)] hover:-translate-y-0.5 hover:bg-[var(--hover)] hover:shadow-[0_18px_42px_-34px_rgba(var(--shadow),0.2)]"
      }`}
    >
      <div className="flex items-start gap-3">
        <span
          className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${
            email.unread
              ? "bg-[var(--accent)] shadow-[0_0_0_6px_color-mix(in_srgb,var(--accent)_10%,transparent)]"
              : "border border-[color:var(--border)] bg-transparent"
          }`}
          aria-hidden="true"
        />
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p
                className={`truncate text-[15px] ${
                  email.unread
                    ? "font-semibold text-[var(--foreground)]"
                    : "font-medium text-[var(--foreground)]"
                }`}
              >
                {email.sender}
              </p>
              <p className="mt-0.5 truncate text-[15px] font-medium text-[var(--foreground)]">
                {email.subject}
              </p>
            </div>
            <span className="shrink-0 text-[11px] font-medium tracking-wide text-[var(--muted)]">
              {formatRowDate(email.timestamp)}
            </span>
          </div>

          {email.categories.length ? (
            <div className="flex flex-wrap gap-1.5">
              {email.categories.slice(0, 2).map((category) => (
                <span
                  key={`${email.id}-${category}`}
                  className="rounded-full border border-[color:var(--border)] bg-[var(--card)] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--muted)]"
                >
                  {formatCategoryLabel(category)}
                </span>
              ))}
            </div>
          ) : null}

          <p className="line-clamp-2 break-words text-sm leading-6 text-[var(--muted)]">
            {email.preview}
          </p>
        </div>
      </div>
    </button>
  );
}

function ReaderSkeleton() {
  return (
    <div className="p-5 sm:p-6">
      <div className="mb-5 flex items-center gap-3">
        <Skeleton className="h-9 w-24 rounded-full" />
        <Skeleton className="h-9 w-28 rounded-full" />
      </div>
      <div className="rounded-[1.75rem] border border-[color:var(--border)] bg-[var(--card)] px-5 py-5 shadow-[0_20px_60px_-42px_rgba(var(--shadow),0.18)] sm:px-6 sm:py-6">
        <Skeleton className="h-4 w-24 rounded-full" />
        <Skeleton className="mt-4 h-10 w-4/5 rounded-2xl" />
        <Skeleton className="mt-4 h-4 w-40 rounded-xl" />
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <Skeleton className="h-20 rounded-2xl" />
          <Skeleton className="h-20 rounded-2xl" />
          <Skeleton className="h-20 rounded-2xl" />
        </div>
      </div>
      <div className="mt-6 rounded-[1.75rem] border border-[color:var(--border)] bg-[var(--surface-muted)]/70 p-5 shadow-[0_20px_60px_-42px_rgba(var(--shadow),0.14)] sm:p-6">
        <Skeleton className="h-4 w-full rounded-xl" />
        <Skeleton className="mt-3 h-4 w-[92%] rounded-xl" />
        <Skeleton className="mt-3 h-4 w-[88%] rounded-xl" />
        <Skeleton className="mt-3 h-4 w-[80%] rounded-xl" />
      </div>
    </div>
  );
}

export function InboxCenter({
  user,
  status,
  initialPage,
}: Readonly<InboxCenterProps>) {
  const { pushToast } = useToast();
  const [emails, setEmails] = useState(() => initialPage.emails);
  const [nextOffset, setNextOffset] = useState(() => initialPage.nextOffset);
  const [hasMore, setHasMore] = useState(() => initialPage.hasMore);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<InboxCategory>("all");
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [listError, setListError] = useState<string | null>(null);
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);
  const [readerLoading, setReaderLoading] = useState(false);
  const [readerError, setReaderError] = useState<string | null>(null);
  const [emailDetails, setEmailDetails] = useState<
    Record<string, InboxEmailDetail>
  >({});
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const loadMoreAnchorRef = useRef<HTMLDivElement | null>(null);
  const listItemRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const activeReaderRequest = useRef<AbortController | null>(null);
  const emailDetailsRef = useRef<Record<string, InboxEmailDetail>>({});

  const setEmailDetailsAndRef = useCallback(
    (updater: (current: Record<string, InboxEmailDetail>) => Record<string, InboxEmailDetail>) => {
      setEmailDetails((current) => {
        const next = updater(current);
        emailDetailsRef.current = next;
        return next;
      });
    },
    [],
  );

  const registerListItemRef = useCallback(
    (emailId: string, element: HTMLButtonElement | null) => {
      if (!element) {
        listItemRefs.current.delete(emailId);
        return;
      }

      listItemRefs.current.set(emailId, element);
    },
    [],
  );

  const visibleEmails = useMemo(
    () => filterEmails(emails, search, filter),
    [emails, search, filter],
  );
  const isFiltered = search.trim().length > 0 || filter !== "all";
  const emptyState = inboxEmptyMessage(
    status.gmailConnected,
    isFiltered,
    filter,
    hasMore,
  );

  const applyInboxPage = useCallback((page: InboxEmailPage) => {
    setEmails(page.emails);
    setNextOffset(page.nextOffset);
    setHasMore(page.hasMore);
  }, []);

  const preserveListScrollPosition = useCallback(
    (apply: () => void) => {
      const container = scrollContainerRef.current;
      const scrollTop = container?.scrollTop ?? 0;

      apply();

      if (!container) {
        return;
      }

      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          container.scrollTop = scrollTop;
        });
      });
    },
    [],
  );

  const selectedEmail = useMemo(() => {
    if (!selectedEmailId) {
      return null;
    }

    return emailDetails[selectedEmailId] ?? null;
  }, [emailDetails, selectedEmailId]);

  const openEmail = useCallback(
    async (emailId: string) => {
      setSelectedEmailId(emailId);
      setReaderError(null);

      if (emailDetailsRef.current[emailId]) {
        return;
      }

      activeReaderRequest.current?.abort();
      const controller = new AbortController();
      activeReaderRequest.current = controller;
      setReaderLoading(true);

      try {
        const response = await fetch(
          `/api/inbox?id=${encodeURIComponent(emailId)}`,
          { method: "GET", signal: controller.signal },
        );
        const payload = (await response.json()) as {
          email?: InboxEmailDetail | null;
          error?: string;
        };

        if (!response.ok) {
          throw new Error(payload.error ?? "Unable to load email");
        }

        if (!payload.email) {
          throw new Error("Email not found in cache.");
        }

        setEmailDetailsAndRef((current) => ({
          ...current,
          [emailId]: payload.email!,
        }));
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        const message =
          error instanceof Error ? error.message : "Unable to load email";
        setReaderError(message);
      } finally {
        if (!controller.signal.aborted) {
          setReaderLoading(false);
        }
      }
    },
    [setEmailDetailsAndRef],
  );

  const closeReader = useCallback(() => {
    const previous = selectedEmailId;
    setSelectedEmailId(null);
    setReaderError(null);

    if (!previous) {
      return;
    }

    window.requestAnimationFrame(() => {
      listItemRefs.current.get(previous)?.focus();
    });
  }, [selectedEmailId]);

  const loadMoreEmails = useCallback(async () => {
    if (!status.gmailConnected || loadingMore || refreshing || !hasMore) {
      return;
    }

    setLoadingMore(true);
    setListError(null);

    try {
      const response = await fetch(
        `/api/inbox?limit=30&offset=${encodeURIComponent(nextOffset)}`,
        {
          method: "GET",
        },
      );
      const payload = (await response.json()) as {
        page?: InboxEmailPage;
        error?: string;
      };

      if (!response.ok) {
        throw new Error(payload.error ?? "Unable to load more emails");
      }

      if (payload.page) {
        setEmails((current) => [...current, ...payload.page!.emails]);
        setNextOffset(payload.page.nextOffset);
        setHasMore(payload.page.hasMore);
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to load more emails";
      setListError(message);
    } finally {
      setLoadingMore(false);
    }
  }, [hasMore, loadingMore, nextOffset, refreshing, status.gmailConnected]);

  const refreshInbox = async () => {
    if (refreshing) {
      return;
    }

    setRefreshing(true);
    setListError(null);

    try {
      const response = await fetch("/api/inbox/refresh", {
        method: "POST",
      });
      const payload = (await response.json()) as {
        page?: InboxEmailPage;
        error?: string;
      };

      if (!response.ok) {
        throw new Error(payload.error ?? "Unable to refresh inbox");
      }

      if (payload.page) {
        preserveListScrollPosition(() => applyInboxPage(payload.page!));
      }
      pushToast({
        title: "Inbox updated",
        variant: "success",
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to refresh inbox";
      setListError(message);
      pushToast({
        title: "Inbox refresh failed",
        description: message,
        variant: "error",
      });
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const anchor = loadMoreAnchorRef.current;
    const root = scrollContainerRef.current;

    if (
      !anchor ||
      !hasMore ||
      loadingMore ||
      refreshing ||
      !status.gmailConnected
    ) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          void loadMoreEmails();
        }
      },
      {
        root,
        rootMargin: "240px",
      },
    );

    observer.observe(anchor);

    return () => observer.disconnect();
  }, [hasMore, loadMoreEmails, loadingMore, refreshing, status.gmailConnected]);

  const content: ReactNode = !status.gmailConnected ? (
    <SkeletonCard className="grid h-full place-items-center p-8 text-center">
      <div className="max-w-md space-y-4">
        <p className="text-2xl font-semibold tracking-tight text-[var(--foreground)]">
          Connect Gmail to start reading mail
        </p>
        <p className="text-sm leading-6 text-[var(--muted)]">
          Inbox browsing is powered by a local cache for fast search and
          filtering, with manual refresh whenever you want the latest sync.
        </p>
        <Link
          href="/settings"
          className="inline-flex items-center justify-center rounded-full bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_14px_30px_-20px_rgba(37,99,235,0.42)] transition duration-200 hover:opacity-95"
        >
          Open Settings
        </Link>
      </div>
    </SkeletonCard>
  ) : (
    <SkeletonCard className="flex h-full flex-col overflow-hidden">
      <div className="border-b border-[color:var(--border)] bg-[var(--surface-muted)]/70 p-4 sm:p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--muted)]">
              Inbox cache
            </p>
            <h2 className="text-2xl font-semibold tracking-tight text-[var(--foreground)]">
              Browse your mail
            </h2>
            <p className="text-sm leading-6 text-[var(--muted)]">
              Search and filtering happen locally on the loaded cache.
            </p>
          </div>

          <div className="flex flex-col items-end gap-2">
            <span className="rounded-full border border-[color:var(--border)] bg-[var(--card)] px-3 py-1 text-[11px] font-semibold text-[var(--muted)]">
              {visibleEmails.length} visible
            </span>
            <span className="rounded-full border border-[color:var(--border)] bg-[var(--surface-muted)] px-3 py-1 text-[11px] font-semibold text-[var(--muted)]">
              {emails.length} cached
            </span>
          </div>
        </div>

        <label className="mt-4 block">
          <span className="sr-only">Search emails</span>
          <div className="flex items-center gap-3 rounded-full border border-[color:var(--border)] bg-[var(--card)] px-4 py-3 shadow-sm">
            <svg
              viewBox="0 0 24 24"
              className="h-4.5 w-4.5 shrink-0 text-[var(--muted)]"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            >
              <path d="m21 21-4.3-4.3" />
              <circle cx="11" cy="11" r="6.5" />
            </svg>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search sender, subject, preview..."
              className="w-full bg-transparent text-sm text-[var(--foreground)] outline-none placeholder:text-[var(--muted)]"
            />
          </div>
        </label>

        <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
          {filters.map((item) => {
            const active = filter === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setFilter(item.id)}
                className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition duration-200 ${
                  active
                    ? "border-[color:var(--border)] bg-[var(--accent-soft)] text-[var(--accent)]"
                    : "border-[color:var(--border)] bg-[var(--card)] text-[var(--muted)] hover:bg-[var(--hover)] hover:text-[var(--foreground)]"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      <div
        className={`grid min-h-0 flex-1 transition-[grid-template-columns] duration-300 ease-out xl:grid-cols-[minmax(0,1fr)_minmax(0,0fr)] ${
          selectedEmailId
            ? "xl:grid-cols-[minmax(360px,0.42fr)_minmax(0,0.58fr)]"
            : ""
        }`}
      >
        <div className="flex min-h-0 flex-col">
          <div
            ref={scrollContainerRef}
            className="min-h-0 flex-1 overflow-y-auto p-3 sm:p-4"
          >
            {listError ? (
              <div className="mb-3 rounded-[1.35rem] border border-[color:var(--border)] bg-[var(--surface-muted)] p-4 text-sm leading-6 text-[var(--muted)]">
                {listError}
              </div>
            ) : null}

            {visibleEmails.length ? (
              <div className="space-y-3">
                {visibleEmails.map((email) => (
                  <InboxListItem
                    key={email.id}
                    email={email}
                    selected={email.id === selectedEmailId}
                    onSelect={openEmail}
                    registerRef={registerListItemRef}
                  />
                ))}
              </div>
            ) : (
              <div className="grid h-full place-items-center p-6 text-center">
                <div className="max-w-md space-y-4 rounded-[1.75rem] border border-[color:var(--border)] bg-[var(--surface-muted)]/80 p-6 shadow-[0_20px_60px_-42px_rgba(var(--shadow),0.18)]">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-[color:var(--border)] bg-[var(--card)] text-[var(--muted)]">
                    <svg
                      viewBox="0 0 24 24"
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M4 6h16v12H4z" />
                      <path d="m4 8 8 5 8-5" />
                    </svg>
                  </div>
                  <div className="space-y-2">
                    <p className="text-lg font-semibold text-[var(--foreground)]">
                      {emptyState.title}
                    </p>
                    <p className="text-sm leading-6 text-[var(--muted)]">
                      {emptyState.description}
                    </p>
                  </div>

                  {status.gmailConnected ? (
                    <button
                      type="button"
                      onClick={refreshInbox}
                      disabled={refreshing}
                      className={`inline-flex items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_14px_30px_-20px_rgba(37,99,235,0.42)] transition duration-200 ${
                        refreshing ? "cursor-not-allowed opacity-80" : "hover:opacity-95"
                      }`}
                    >
                      {refreshing ? <Spinner className="h-4 w-4" /> : null}
                      {refreshing ? "Refreshing..." : "Refresh Inbox"}
                    </button>
                  ) : null}
                </div>
              </div>
            )}

            <div ref={loadMoreAnchorRef} className="h-6" />

            {loadingMore ? (
              <div className="flex items-center justify-center gap-2 py-5 text-sm text-[var(--muted)]">
                <Spinner className="h-4 w-4 text-[var(--muted)]" />
                Loading more...
              </div>
            ) : null}
          </div>
        </div>

        <div className="relative hidden min-h-0 overflow-hidden border-l border-[color:var(--border)] bg-[var(--background)]/30 xl:block">
          <div
            className={`absolute inset-0 flex min-h-0 flex-col transition duration-300 ease-out ${
              selectedEmailId
                ? "translate-x-0 opacity-100"
                : "translate-x-10 opacity-0 pointer-events-none"
            }`}
          >
            <div className="min-h-0 flex-1 overflow-y-auto">
              {readerLoading ? (
                <ReaderSkeleton />
              ) : readerError ? (
                <div className="grid h-full place-items-center p-8 text-center">
                  <div className="max-w-md space-y-4 rounded-[1.75rem] border border-[color:var(--border)] bg-[var(--card)] p-6 shadow-[0_20px_60px_-42px_rgba(var(--shadow),0.18)]">
                    <p className="text-lg font-semibold text-[var(--foreground)]">
                      Unable to open email
                    </p>
                    <p className="text-sm leading-6 text-[var(--muted)]">
                      {readerError}
                    </p>
                    <div className="flex flex-wrap justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => selectedEmailId && void openEmail(selectedEmailId)}
                        className="inline-flex items-center justify-center gap-2 rounded-full border border-[color:var(--border)] bg-[var(--surface-muted)] px-4 py-2 text-sm font-semibold text-[var(--foreground)] shadow-sm transition duration-200 hover:bg-[var(--hover)]"
                      >
                        Retry
                      </button>
                      <button
                        type="button"
                        onClick={closeReader}
                        className="inline-flex items-center justify-center rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white shadow-[0_12px_30px_-18px_rgba(37,99,235,0.35)] transition duration-200 hover:opacity-95"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              ) : selectedEmail ? (
                <div className="p-5 sm:p-6">
                  <InboxEmailReader email={selectedEmail} onClose={closeReader} />
                </div>
              ) : selectedEmailId ? (
                <div className="grid h-full place-items-center p-8 text-center text-sm text-[var(--muted)]">
                  Select an email to read it.
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </SkeletonCard>
  );

  return (
    <AppShell
      user={user}
      status={status}
      activeSection="inbox"
      title="Inbox"
      description="Fast, premium Gmail browsing with local filtering and cache-backed sync."
      contentScroll="none"
      primaryAction={{ label: "Open Agent", href: "/chat" }}
      secondaryAction={
        status.gmailConnected
          ? {
              label: refreshing ? "Refreshing..." : "Refresh Inbox",
              onClick: refreshInbox,
              disabled: refreshing,
              loading: refreshing,
            }
          : undefined
      }
    >
      <div className="fade-in h-full">{content}</div>
    </AppShell>
  );
}
