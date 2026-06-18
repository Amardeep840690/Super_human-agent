"use client";

import { useState } from "react";
import Link from "next/link";
// import { redirect } from "next/navigation";
// import { auth } from "@/server/auth";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function ChatPage() {
  // const session = await auth();

  // if (!session?.user) {
  //   redirect("/login");
  // }

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I can help you manage Gmail and Google Calendar.",
    },
  ]);

  async function sendMessage() {
    if (!message.trim()) return;

    const userMessage = message;

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: userMessage,
      },
    ]);

    setMessage("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
        }),
      });

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.response ?? "Sorry, I couldn't process that request.",
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Something went wrong. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-screen flex-col bg-zinc-950 text-white">
      <div className="border-b border-zinc-800 p-4">
    <Link href="/dashboard"><h1 className="text-xl font-semibold">Superhuman Agent</h1></Link>
        
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="mx-auto max-w-4xl space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[70%] rounded-xl px-4 py-3 ${
                  msg.role === "user" ? "bg-blue-600" : "bg-zinc-800"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="rounded-xl bg-zinc-800 px-4 py-3">
                Thinking...
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-zinc-800 p-4">
        <div className="mx-auto flex max-w-4xl gap-3">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendMessage();
              }
            }}
            placeholder="Schedule a meeting tomorrow at 5 PM..."
            className="flex-1 rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 outline-none focus:border-blue-500"
          />

          <button
            onClick={sendMessage}
            disabled={loading}
            className="rounded-lg bg-blue-600 px-5 py-3 font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
