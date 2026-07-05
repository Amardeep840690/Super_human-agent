import { redirect } from "next/navigation";
import { auth } from "@/server/auth";
import { getIntegrationStatus } from "@/server/services/integration-status.service";
import { getInboxPage } from "@/server/gmail/gmail-query.service";
import { InboxCenter } from "@/components/inbox-center";
import type { InboxEmailPage } from "@/types/inbox";

export default async function InboxPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const status = await getIntegrationStatus(session.user.id);

  let initialPage: InboxEmailPage = {
    emails: [],
    nextOffset: 0,
    hasMore: false,
    loadedCount: 0,
  };

  if (status.gmailConnected) {
    try {
      initialPage = await getInboxPage(session.user.id, {
        limit: 30,
        offset: 0,
        syncIfEmpty: true,
      });
    } catch {
      initialPage = {
        emails: [],
        nextOffset: 0,
        hasMore: false,
        loadedCount: 0,
      };
    }
  }

  return (
    <InboxCenter
      user={session.user}
      status={status}
      initialPage={initialPage}
    />
  );
}
