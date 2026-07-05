import { notFound, redirect } from "next/navigation";
import { auth } from "@/server/auth";
import { getIntegrationStatus } from "@/server/services/integration-status.service";
import { ensureEmailCached } from "@/server/gmail/gmail-sync.service";
import { getEmailById } from "@/server/gmail/gmail-query.service";
import { AppShell } from "@/components/app-shell";
import { InboxEmailReader } from "@/components/inbox-email-reader";

type EmailPageProps = {
  params: Promise<{
    emailId: string;
  }>;
};

export default async function InboxEmailPage({ params }: Readonly<EmailPageProps>) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const { emailId } = await params;
  const status = await getIntegrationStatus(session.user.id);

  let email = null;

  try {
    email = await getEmailById(session.user.id, emailId);

    if (!email?.contentText && !email?.contentHtml) {
      email = await ensureEmailCached(session.user.id, emailId);
    }
  } catch {
    email = null;
  }

  if (!email) {
    notFound();
  }

  return (
    <AppShell
      user={session.user}
      status={status}
      activeSection="inbox"
      title="Email"
      description="Focused reading surface."
      primaryAction={{ label: "Open Agent", href: "/chat" }}
      secondaryAction={undefined}
    >
      <div className="fade-in py-2 sm:py-4">
        <InboxEmailReader email={email} />
      </div>
    </AppShell>
  );
}
