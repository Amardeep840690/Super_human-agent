import type { Message, MessagePart } from "@corsair-dev/gmail/types";

export type GmailCachedMessageData = {
  id: string;
  threadId?: string | null;
  labelIds?: string[];
  snippet?: string | null;
  historyId?: string | null;
  internalDate?: Date | string | null;
  payload?: MessagePart | null;
  raw?: string | null;
  subject?: string | null;
  body?: string | null;
  from?: string | null;
  to?: string | null;
  categories?: string[];
  ccRecipients?: string[];
  recipients?: string[];
  unread?: boolean;
  createdAt?: Date | null;
  messageDate?: string;
};

export type GmailInboxSyncSource = "bootstrap" | "manual-refresh" | "webhook" | "missing-body";

export type GmailInboxPage = {
  emails: import("@/types/inbox").InboxEmailSummary[];
  nextOffset: number;
  hasMore: boolean;
  loadedCount: number;
};

export type GmailMessage = Message;
