export type InboxCategory = "all" | "primary" | "promotions" | "social" | "unread";

export type InboxEmailSummary = {
  id: string;
  threadId?: string;
  sender: string;
  senderEmail?: string;
  subject: string;
  preview: string;
  timestamp: string;
  unread: boolean;
  categories: string[];
};

export type InboxEmailDetail = InboxEmailSummary & {
  to: string[];
  cc: string[];
  dateLabel: string;
  content: string;
  contentHtml?: string;
  contentText: string;
};

export type InboxEmailPage = {
  emails: InboxEmailSummary[];
  nextOffset: number;
  hasMore: boolean;
  loadedCount: number;
};
