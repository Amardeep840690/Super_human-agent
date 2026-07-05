import { NextResponse } from "next/server";
import { auth } from "@/server/auth";
import { refreshInbox } from "@/server/gmail/gmail-sync.service";
import { getInboxPage } from "@/server/gmail/gmail-query.service";

// export const runtime = "nodejs";

export async function POST() {
  console.log("session fetch...");
  
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    console.log("refreshing......");
    
    await refreshInbox(session.user.id);
    const page = await getInboxPage(session.user.id, {
      limit: 30,
      offset: 0,
    });
    console.log("complet efetching...");
    
    return NextResponse.json({ page });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unable to refresh inbox",
      },
      { status: 500 },
    );
  }
}
