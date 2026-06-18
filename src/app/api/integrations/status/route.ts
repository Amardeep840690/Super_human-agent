import { NextResponse } from "next/server";
import { auth } from "@/server/auth";
import { getIntegrationStatus } from "@/server/services/integration-status.service";

export const runtime = "nodejs";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const status = await getIntegrationStatus(session.user.id);

    return NextResponse.json(status);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to load integration status";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
