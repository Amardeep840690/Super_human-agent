"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { InboxEmailDetail } from "@/types/inbox";

function formatCategoryLabel(category: string) {
  return category
    .replace(/^CATEGORY_/i, "")
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function EmailBody({
  html,
  text,
}: Readonly<{
  html?: string | null;
  text: string;
}>) {
  const [sanitizedHtml, setSanitizedHtml] = useState<string | null>(null);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      if (!html) {
        setSanitizedHtml(null);
        return;
      }

      const parser = new DOMParser();
      const document = parser.parseFromString(html, "text/html");

      document
        .querySelectorAll("script, iframe, object, embed, form")
        .forEach((node) => {
          node.remove();
        });

      document.querySelectorAll("*").forEach((element) => {
        for (const attribute of Array.from(element.attributes)) {
          const name = attribute.name.toLowerCase();
          const value = attribute.value.trim();

          if (name.startsWith("on") || name === "srcdoc") {
            element.removeAttribute(attribute.name);
            continue;
          }

          if (
            (name === "href" || name === "src") &&
            /^javascript:/i.test(value)
          ) {
            element.removeAttribute(attribute.name);
          }
        }

        if (element.tagName === "A") {
          const anchor = element as HTMLAnchorElement;
          anchor.target = "_blank";
          anchor.rel = "noreferrer noopener";
        }
      });

      setSanitizedHtml(document.body.innerHTML);
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [html]);

  if (sanitizedHtml) {
    return (
      <div
        className="email-body"
        dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
      />
    );
  }

  return (
    <div className="whitespace-pre-wrap break-words text-[15px] leading-7 text-[var(--foreground)]">
      {text}
    </div>
  );
}

export function InboxEmailReader({
  email,
  onClose,
}: Readonly<{
  email: InboxEmailDetail;
  onClose?: () => void;
}>) {
  const surfaceClassName = onClose
    ? "w-full"
    : "mx-auto w-full max-w-[900px]";

  return (
    <div className={surfaceClassName}>
      <div className="mb-4">
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-2 rounded-full border border-[color:var(--border)] bg-[var(--card)] px-4 py-2 text-sm font-semibold text-[var(--foreground)] shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-[var(--hover)] hover:shadow-md"
          >
            <span aria-hidden="true">←</span>
            Close
          </button>
        ) : (
          <Link
            href="/inbox"
            className="inline-flex items-center gap-2 rounded-full border border-[color:var(--border)] bg-[var(--card)] px-4 py-2 text-sm font-semibold text-[var(--foreground)] shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-[var(--hover)] hover:shadow-md"
          >
            <span aria-hidden="true">←</span>
            Back to Inbox
          </Link>
        )}
      </div>

      <section className="rounded-[1.75rem] border border-[color:var(--border)] bg-[var(--card)] px-5 py-5 shadow-[0_20px_60px_-42px_rgba(var(--shadow),0.18)] sm:px-6 sm:py-6">
        <div className="flex flex-wrap items-center gap-2">
          {email.categories.length ? (
            email.categories.map((category) => (
              <span
                key={`${email.id}-${category}`}
                className="rounded-full border border-[color:var(--border)] bg-[var(--surface-muted)] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--muted)]"
              >
                {formatCategoryLabel(category)}
              </span>
            ))
          ) : (
            <span className="rounded-full border border-[color:var(--border)] bg-[var(--surface-muted)] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">
              Inbox
            </span>
          )}
          <span
            className={`rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] ${
              email.unread
                ? "border-[color:var(--accent)]/40 bg-[var(--accent-soft)] text-[var(--accent)]"
                : "border-[color:var(--border)] bg-[var(--surface-muted)] text-[var(--muted)]"
            }`}
          >
            {email.unread ? "Unread" : "Read"}
          </span>
        </div>

        <div className="mt-4 space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight text-[var(--foreground)] sm:text-4xl">
            {email.subject}
          </h1>
          <p className="text-sm leading-6 text-[var(--muted)]">
            {email.dateLabel}
          </p>
        </div>

        <div className="mt-6 grid gap-3 border-y border-[color:var(--border)] py-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--muted)]">
              Sender
            </p>
            <p className="text-sm font-semibold text-[var(--foreground)]">
              {email.sender}
            </p>
            <p className="break-words text-sm leading-6 text-[var(--muted)]">
              {email.senderEmail ?? "Unknown sender email"}
            </p>
          </div>

          <div className="space-y-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--muted)]">
              Recipient
            </p>
            <p className="break-words text-sm leading-6 text-[var(--foreground)]">
              {email.to.length ? email.to.join(", ") : "No recipient data"}
            </p>
          </div>

          <div className="space-y-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--muted)]">
              Date
            </p>
            <p className="text-sm leading-6 text-[var(--foreground)]">
              {email.dateLabel}
            </p>
          </div>

          <div className="space-y-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--muted)]">
              Labels
            </p>
            <p className="break-words text-sm leading-6 text-[var(--foreground)]">
              {email.categories.length
                ? email.categories.map(formatCategoryLabel).join(", ")
                : "Inbox"}
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-6 w-full rounded-[1.75rem] border border-[color:var(--border)] bg-[var(--surface-muted)]/70 p-4 shadow-[0_20px_60px_-42px_rgba(var(--shadow),0.14)] sm:p-6">
        <div className="mx-auto w-full max-w-[860px] rounded-[1.5rem] border border-[color:var(--border)] bg-[var(--card)] px-5 py-6 shadow-[0_16px_50px_-38px_rgba(var(--shadow),0.16)] sm:px-7 sm:py-8">
          <EmailBody html={email.contentHtml} text={email.contentText} />
        </div>
      </section>
    </div>
  );
}
