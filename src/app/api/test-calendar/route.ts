import { auth } from "@/server/auth";
import { getTenantCorsair } from "@/server/corsair/client";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return Response.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const tenant = getTenantCorsair(
      session.user.id
    );

    const event =
      await tenant.googlecalendar.api.events.create({
        event: {
          summary: "Hackathon Planning",

          start: {
            dateTime:
              "2026-06-18T17:00:00+05:30",
          },

          end: {
            dateTime:
              "2026-06-18T18:00:00+05:30",
          },
        },
      });

    return Response.json(event);
  } catch (error) {
    console.error(error);

    return Response.json(
      { error },
      { status: 500 }
    );
  }
}