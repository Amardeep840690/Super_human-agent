import type {
  InboxCategory,
  InboxEmailDetail,
  InboxEmailSummary,
} from "@/types/inbox";
import type { GmailCachedMessageData } from "./gmail.types";
import { normalizeSearchableText } from "./gmail-parser";

type GmailEntityRow = {
  entityId: string;
  updatedAt: Date;
  data: GmailCachedMessageData | null;
};

function normalizeRecipientList(value: unknown) {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string");
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

function parseAddress(value?: string | null) {
  if (!value) {
    return { name: "", email: "" };
  }

  const match = value.match(/^(.*?)(?:\s*<([^>]+)>)?$/);
  const rawName = match?.[1]?.trim() ?? value.trim();
  const email = match?.[2]?.trim() ?? rawName;
  const name =
    rawName && rawName !== email
      ? rawName.replace(/^"|"$/g, "")
      : (email.split("@")[0] ?? email);

  return {
    name: name.trim(),
    email,
  };
}

function formatDateLabel(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function normalizeStringArray(value: unknown) {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}

function getMessageDate(row: GmailEntityRow) {
  const value = row.data?.messageDate ?? row.updatedAt.toISOString();
  return value;
}

export function entityToInboxSummary(row: GmailEntityRow): InboxEmailSummary {
  const data = row.data ?? {} as GmailCachedMessageData;
  const from = parseAddress(data.from ?? "");
  const timestamp = getMessageDate(row);
  const categories = normalizeStringArray(data.labelIds)
    .filter((label) => label.startsWith("CATEGORY_"))
    .map((label) => label);

  return {
    id: row.entityId,
    threadId: data.threadId ?? undefined,
    sender: from.name || data.from || "Unknown sender",
    senderEmail: from.email || undefined,
    subject: data.subject ?? "No subject",
    preview: data.snippet ?? data.body ?? "No preview available",
    timestamp,
    unread: normalizeStringArray(data.labelIds).includes("UNREAD"),
    categories,
  };
}

export function entityToInboxDetail(row: GmailEntityRow): InboxEmailDetail {
  const summary = entityToInboxSummary(row);
  const data = row.data ?? {} as GmailCachedMessageData;
  const from = parseAddress(data.from ?? "");

  return {
    ...summary,
    to: normalizeRecipientList(data.recipients ?? data.to ?? []),
    cc: normalizeRecipientList(data.ccRecipients ?? []),
    dateLabel: formatDateLabel(summary.timestamp),
    content: data.body ?? data.snippet ?? "No content available.",
    contentHtml: undefined,
    contentText: data.body ?? "",
    senderEmail: summary.senderEmail || from.email || undefined,
  };
}

export function matchesInboxCategory(
  email: InboxEmailSummary,
  category: InboxCategory,
) {
  if (category === "all") {
    return true;
  }

  if (category === "unread") {
    return email.unread;
  }

  const categoryLabel = `CATEGORY_${category.toUpperCase()}`;
  return email.categories.includes(categoryLabel);
}

export function matchesInboxQuery(email: InboxEmailSummary, query: string) {
  const normalizedQuery = normalizeSearchableText(query);

  if (!normalizedQuery) {
    return true;
  }

  const searchable = normalizeSearchableText(
    [
      email.sender,
      email.senderEmail ?? "",
      email.subject,
      email.preview,
      ...email.categories,
    ].join(" "),
  );

  return searchable.includes(normalizedQuery);
}

// export function filterInboxEmails(
//   emails: InboxEmailSummary[],
//   category: InboxCategory,
//   query: string,
// ) {
//   return emails.filter(
//     (email) => matchesInboxCategory(email, category) && matchesInboxQuery(email, query),
//   );
// }
