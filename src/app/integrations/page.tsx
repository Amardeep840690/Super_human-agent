import { redirect } from "next/navigation";
import { auth } from "@/server/auth";
import { getIntegrationStatus } from "@/server/services/integration-status.service";
import { DashboardCenter } from "@/components/dashboard-center";

export default async function IntegrationsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const status = await getIntegrationStatus(session.user.id);

  return (
    <DashboardCenter
      mode="integrations"
      user={session.user}
      status={status}
    />
  );
}
