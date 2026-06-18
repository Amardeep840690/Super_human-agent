import { auth } from "@/server/auth";
import { createAgent } from "@/server/agent/agent";
import { run } from "@openai/agents";

export async function POST(req: Request) {
  try {
    console.log("Chat route hit");

    const session = await auth();
    console.log("Session:", session);

    const body = await req.json();
    console.log("Body:", body);

    const { message } = body;

    const agent = await createAgent(session!.user!.id);

    const result = await run(agent, message);
    console.log(result);
    

    return Response.json({
      response: result.finalOutput,
    });
  } catch (error) {
    console.error("CHAT ERROR:", error);

    return Response.json(
      {
        error: error instanceof Error ? error.message : "Unknown error",
      },
      {
        status: 500,
      },
    );
  }
}
