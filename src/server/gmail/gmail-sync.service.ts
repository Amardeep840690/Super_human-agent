import "server-only";

import type { Message } from "@corsair-dev/gmail/types";
import { and, eq } from "drizzle-orm";
import { db } from "@/server/db";
import {
  corsairAccounts,
  corsairEntities,
  corsairIntegrations,
} from "@/server/db/schema";

import { getTenantCorsair } from "@/server/corsair/client";
import {
  buildGmailCachedMessageData,
  getMessageTimestamp,
} from "./gmail-parser";
import type { GmailCachedMessageData } from "./gmail.types";

const INBOX_SYNC_BATCH_SIZE = 90;
const GMAIL_ENTITY_TYPE = "messages";
const GMAIL_CACHE_VERSION = "gmail-v1";

export async function getIntegrationAccountId(
  userId: string,
  integration: "gmail" | "googlecalendar",
): Promise<string> {
  const account = await db
    .select({
      id: corsairAccounts.id,
    })
    .from(corsairAccounts)
    .innerJoin(
      corsairIntegrations,
      eq(corsairAccounts.integrationId, corsairIntegrations.id),
    )
    .where(
      and(
        eq(corsairAccounts.tenantId, userId),
        eq(corsairIntegrations.name, integration),
      ),
    )
    .limit(1);

  if (!account.length) {
    throw new Error(`${integration} account not connected.`);
  }

  return account[0].id;
}

async function getGmailAccountId(userId: string) {
  const account = await getIntegrationAccountId(userId, "gmail");
  return account ?? null;
}

// Insert or update a Gmail message in the local cache.
async function upsertCachedMessage(accountId: string, message: Message) {
  const data = buildGmailCachedMessageData(message);

  if (!data?.id) {
    return null;
  }

  const payload: GmailCachedMessageData = {
    ...data,
    createdAt: new Date(),
    messageDate: getMessageTimestamp(message),
  };

  const existing = await db
    .select()
    .from(corsairEntities)
    .where(
      and(
        eq(corsairEntities.accountId, accountId),
        eq(corsairEntities.entityType, GMAIL_ENTITY_TYPE),
        eq(corsairEntities.entityId, data.id),
      ),
    )
    .limit(1);

  if (existing[0]) {
    await db
      .update(corsairEntities)
      .set({
        version: GMAIL_CACHE_VERSION,
        data: payload,
        updatedAt: new Date(),
      })
      .where(eq(corsairEntities.id, existing[0].id));

    return existing[0].id;
  }

  const [saved] = await db
    .insert(corsairEntities)
    .values({
      id: crypto.randomUUID(),
      accountId,
      entityId: data.id,
      entityType: GMAIL_ENTITY_TYPE,
      version: GMAIL_CACHE_VERSION,
      data: payload,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning({ id: corsairEntities.id });

  return saved?.id ?? null;
}

// Sync the latest inbox emails from Gmail into the local cache.
async function syncInboxBatch(userId: string) {
  const accountId = await getGmailAccountId(userId);

  if (!accountId) {
    return { synced: 0 };
  }

  const tenant = getTenantCorsair(userId);
  console.log("syncced inbox batch...");
  
  const response = await tenant.gmail.api.messages.list({
    userId: "me",
    q: "in:inbox",
    maxResults: INBOX_SYNC_BATCH_SIZE,
  });

  const messages = response.messages ?? [];
  const hydrated = await Promise.allSettled(
    messages
      .filter((message): message is Message & { id: string } =>
        Boolean(message.id),
      )
      .map((message) =>
        tenant.gmail.api.messages.get({
          userId: "me",
          id: message.id,
          format: "full",
        }),
      ),
  );

  let synced = 0;

  for (const result of hydrated) {
    if (result.status !== "fulfilled") {
      continue;
    }

    const saved = await upsertCachedMessage(accountId, result.value);
    if (saved) {
      synced += 1;
    }
  }

  return { synced };
}

export async function bootstrapInboxCache(userId: string) {
  return await syncInboxBatch(userId);
}

export async function refreshInbox(userId: string) {
  console.log("refreshing inbox....");
  
  const result = await syncInboxBatch(userId);
  return result;
}

export async function ensureEmailCached(userId: string, emailId: string) {
  const { getEmailById } = await import("./gmail-query.service");
  const current = await getEmailById(userId, emailId);

  if (current?.contentText || current?.contentHtml) {
    return current;
  }

  const accountId = await getGmailAccountId(userId);
  if (!accountId) {
    return current;
  }

  const tenant = getTenantCorsair(userId);
  const fullMessage = await tenant.gmail.api.messages.get({
    userId: "me",
    id: emailId,
    format: "full",
  });

  await upsertCachedMessage(accountId, fullMessage);
  return await getEmailById(userId, emailId);
}

export async function syncInboxFromWebhook(userId: string) {
  return await syncInboxBatch(userId);
}
