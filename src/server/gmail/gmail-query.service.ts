import "server-only";

import { and, desc, eq, sql } from "drizzle-orm";
import { db } from "@/server/db";
import { corsairEntities } from "@/server/db/schema";
import type { InboxCategory } from "@/types/inbox";

import {
  bootstrapInboxCache,
  getIntegrationAccountId,
} from "./gmail-sync.service";

import {
  entityToInboxDetail,
  entityToInboxSummary,
  // filterInboxEmails,
} from "./gmail-mapper";
import type { GmailInboxPage } from "./gmail.types";

const GMAIL_ENTITY_TYPE = "messages";
// const MAX_LOCAL_SCAN = 5000;
type GmailEntityRow = Parameters<typeof entityToInboxSummary>[0];

async function getGmailAccountId(userId: string) {
  const account = await getIntegrationAccountId(userId, "gmail");
  return account ?? null;
}

// async function loadInboxRows(userId: string) {
//   const accountId = await getGmailAccountId(userId);

//   if (!accountId) {
//     return [];
//   }

//   const messageDateOrder = sql<Date>`
//     COALESCE(
//       NULLIF(${corsairEntities.data} ->> 'messageDate', '')::timestamptz,
//       ${corsairEntities.updatedAt}
//     )
//   `;

//   return (await db
//     .select()
//     .from(corsairEntities)
//     .where(
//       and(
//         eq(corsairEntities.accountId, accountId),
//         eq(corsairEntities.entityType, GMAIL_ENTITY_TYPE),
//       ),
//     )
//     .orderBy(desc(messageDateOrder), desc(corsairEntities.updatedAt))
//     .limit(MAX_LOCAL_SCAN)) as GmailEntityRow[];
// }

async function loadInboxPageRows(
  userId: string,
  limit: number,
  offset: number,
) {
  const accountId = await getGmailAccountId(userId);

  if (!accountId) {
    return [];
  }

  const messageDateOrder = sql<Date>`
    COALESCE(
      NULLIF(${corsairEntities.data} ->> 'messageDate', '')::timestamptz,
      ${corsairEntities.updatedAt}
    )
  `;

  return (await db
    .select()
    .from(corsairEntities)
    .where(
      and(
        eq(corsairEntities.accountId, accountId),
        eq(corsairEntities.entityType, GMAIL_ENTITY_TYPE),
      ),
    )
    .orderBy(desc(messageDateOrder), desc(corsairEntities.updatedAt))
    .limit(limit + 1)
    .offset(offset)) as GmailEntityRow[];
}

function normalizeLimit(value?: number) {
  if (!value || Number.isNaN(value) || value <= 0) {
    return 30;
  }

  return Math.min(value, 100);
}

function normalizeOffset(value?: number) {
  if (!value || Number.isNaN(value) || value < 0) {
    return 0;
  }

  return value;
}

export async function getInboxPage(
  userId: string,
  options: {
    limit?: number;
    offset?: number;
    syncIfEmpty?: boolean;
  } = {},
): Promise<GmailInboxPage> {
  const limit = normalizeLimit(options.limit);
  const offset = normalizeOffset(options.offset);
  const rows = await loadInboxPageRows(userId, limit, offset);

  if (!rows.length && options.syncIfEmpty) {
    await bootstrapInboxCache(userId);
    return await getInboxPage(userId, { ...options, syncIfEmpty: false });
  }

  const pageRows = rows.slice(0, limit);
  const emails = pageRows.map((row) => entityToInboxSummary(row));

  return {
    emails,
    nextOffset: offset + emails.length,
    hasMore: rows.length > limit,
    loadedCount: offset + emails.length,
  };
}

export async function getEmailById(userId: string, id: string) {
  const accountId = await getGmailAccountId(userId);

  if (!accountId) {
    return null;
  }

  const rows = await db
    .select()
    .from(corsairEntities)
    .where(
      and(
        eq(corsairEntities.accountId, accountId),
        eq(corsairEntities.entityType, GMAIL_ENTITY_TYPE),
        eq(corsairEntities.entityId, id),
      ),
    )
    .limit(1);

  const row = (rows[0] ?? null) as GmailEntityRow | null;

  if (!row) {
    return null;
  }

  return entityToInboxDetail(row);
}

// unnessary part
// export async function getEmailsByCategory(
//   userId: string,
//   category: InboxCategory,
// ) {
//   const rows = await loadInboxRows(userId);
//   return filterInboxEmails(
//     rows.map((row) => entityToInboxSummary(row)),
//     category,
//     "",
//   );
// }
// unnessary part
// export async function searchInboxEmails(
//   userId: string,
//   query: string,
//   category: InboxCategory = "all",
// ) {
//   const rows = await loadInboxRows(userId);
//   return filterInboxEmails(
//     rows.map((row) => entityToInboxSummary(row)),
//     category,
//     query,
//   );
// }
