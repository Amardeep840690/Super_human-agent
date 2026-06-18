import { NextResponse } from "next/server";
import { auth } from "@/server/auth";
import { createCalendarAuthorizationUrl } from "@/server/services/calendar.service";

export const runtime = "nodejs";

export async function POST() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const authorizationUrl = await createCalendarAuthorizationUrl(
      session.user.id,
    );

    return NextResponse.json({ authorizationUrl });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unable to start Calendar connect";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
