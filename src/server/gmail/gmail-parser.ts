import type { Message, MessagePart } from "@corsair-dev/gmail/types";
import type { GmailCachedMessageData } from "./gmail.types";

function getHeader(message: Message, name: string) {
  return message.payload?.headers
    ?.find((header) => header.name?.toLowerCase() === name.toLowerCase())
    ?.value?.trim();
}

function decodeBase64Url(value: string) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  return Buffer.from(normalized, "base64").toString("utf-8");
}

function normalizeText(value: string) {
  return value
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function decodeHtmlEntities(value: string) {
  if (!value) {
    return value;
  }

  return value
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">");
}

function stripHtml(value: string) {
  return decodeHtmlEntities(
    normalizeText(
      value
        .replace(/<style[\s\S]*?<\/style>/gi, " ")
        .replace(/<script[\s\S]*?<\/script>/gi, " ")
        .replace(/<br\s*\/?>/gi, "\n")
        .replace(/<\/(p|div|section|article|li|tr|h[1-6]|blockquote)>/gi, "\n")
        .replace(/<\/(td|th)>/gi, "\t")
        .replace(/<[^>]+>/g, " ")
        .replace(/&nbsp;/gi, " "),
    ),
  );
}

function extractBodyContent(part?: MessagePart | null): {
  text: string;
  html: string;
} {
  if (!part) {
    return { text: "", html: "" };
  }

  const mimeType = part.mimeType?.toLowerCase() ?? "";
  const bodyData = part.body?.data;

  let currentText = "";
  let currentHtml = "";

  if (bodyData) {
    try {
      const decoded = decodeBase64Url(bodyData);
      if (mimeType === "text/html") {
        currentHtml = decoded;
      } else {
        currentText = decoded;
      }
    } catch {
      currentText = "";
    }
  }

  if (part.parts?.length) {
    for (const child of part.parts) {
      const childContent = extractBodyContent(child);

      if (!currentText && childContent.text) {
        currentText = childContent.text;
      }

      if (!currentHtml && childContent.html) {
        currentHtml = childContent.html;
      }
    }
  }

  return {
    text: normalizeText(currentText || stripHtml(currentHtml)),
    html: currentHtml,
  };
}

function parseAddress(value?: string) {
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

function toMessageDate(message: Message) {
  const internalDate = message.internalDate
    ? new Date(message.internalDate)
    : null;

  if (internalDate && !Number.isNaN(internalDate.getTime())) {
    return internalDate.toISOString();
  }

  const headerDate = getHeader(message, "Date");
  const parsedDate = headerDate ? new Date(headerDate) : null;

  if (parsedDate && !Number.isNaN(parsedDate.getTime())) {
    return parsedDate.toISOString();
  }

  return new Date().toISOString();
}

function getMessageCategories(message: Message) {
  return (message.labelIds ?? []).filter((label) =>
    label.startsWith("CATEGORY_"),
  );
}

function extractRecipients(value?: string) {
  return (
    value
      ?.split(",")
      .map((item) => item.trim())
      .filter(Boolean) ?? []
  );
}

export function normalizeSearchableText(value: string) {
  return value.toLowerCase().replace(/\s+/g, " ").trim();
}

export function buildGmailCachedMessageData(
  message: Message,
): GmailCachedMessageData | null {
  if (!message.id) {
    return null;
  }

  const from = parseAddress(getHeader(message, "From"));
  const subject = getHeader(message, "Subject") || "No subject";
  const bodyContent = extractBodyContent(message.payload);
  const preview =
    decodeHtmlEntities(
      normalizeText(message.snippet ?? bodyContent.text),
    ).slice(0, 240) || "No preview available";
  const messageDate = toMessageDate(message);
  const categories = getMessageCategories(message);
  const recipients = extractRecipients(getHeader(message, "To"));
  const ccRecipients = extractRecipients(getHeader(message, "Cc"));
  const labelIds = message.labelIds ?? [];

  return {
    id: message.id,
    threadId: message.threadId ?? null,
    labelIds,
    snippet: message.snippet ?? preview,
    historyId: message.historyId ?? null,
    internalDate: message.internalDate ?? null,
    payload: message.payload ?? null,
    raw: message.raw ?? null,
    subject,
    body: bodyContent.text || null,
    from: from.email ? `${from.name || from.email} <${from.email}>` : from.name,
    to: recipients.join(", "),
    recipients,
    ccRecipients,
    categories,
    unread: labelIds.includes("UNREAD"),
    createdAt: new Date(),
    messageDate,
  };
}

export function getMessageTimestamp(message: Message) {
  return toMessageDate(message);
}
