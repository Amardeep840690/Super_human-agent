import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/server/auth";
import type { InboxCategory } from "@/types/inbox";
import {
  getEmailById,
  // getEmailsByCategory,
  getInboxPage,
  // searchInboxEmails,
} from "@/server/gmail/gmail-query.service";

export async function GET(request: NextRequest) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const emailId = searchParams.get("id");

  try {
    if (emailId) {
      const email = await getEmailById(session.user.id, emailId);
      return NextResponse.json({ email });
    }

    // const category = (searchParams.get("category") ?? "all") as InboxCategory;
    // const search = searchParams.get("query") ?? "";
    const limit = Number(searchParams.get("limit") ?? "30");
    const offset = Number(searchParams.get("offset") ?? "0");

    // if (search.trim()) {
    //   const emails = await searchInboxEmails(session.user.id, search, category);
    //   return NextResponse.json({ emails });
    // }

    // if (category !== "all") {
    //   const emails = await getEmailsByCategory(session.user.id, category);
    //   return NextResponse.json({ emails });
    // }

    const page = await getInboxPage(session.user.id, {
      limit,
      offset,
    });
    return NextResponse.json({ page });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unable to load inbox",
      },
      { status: 500 },
    );
  }
}
