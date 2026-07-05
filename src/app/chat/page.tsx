"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { AppShell } from "@/components/app-shell";
import { Skeleton, SkeletonCard } from "@/components/skeletons";
import { useToast } from "@/components/toast";

type Message = {
  role: "user" | "assistant";
  content: string;
};

type IntegrationStatus = {
  gmailConnected: boolean;
  calendarConnected: boolean;
};

function loadingShell() {
  return (
    <main className="px-4 py-4 sm:px-6 lg:px-8 lg:py-6">
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_280px]">
        <SkeletonCard className="min-h-[70vh] p-5 sm:p-6">
          <div className="space-y-4">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-8 w-3/5 rounded-2xl" />
            <Skeleton className="h-px w-full rounded-none" />
            <Skeleton className="h-24 w-full rounded-[1.5rem]" />
            <Skeleton className="h-20 w-4/5 rounded-[1.5rem] ml-auto" />
            <Skeleton className="h-20 w-3/5 rounded-[1.5rem]" />
          </div>
        </SkeletonCard>

        <div className="space-y-4">
          <SkeletonCard className="p-5">
            <Skeleton className="h-4 w-32" />
            <div className="mt-4 space-y-3">
              <Skeleton className="h-12 w-full rounded-2xl" />
              <Skeleton className="h-12 w-full rounded-2xl" />
            </div>
          </SkeletonCard>
          <SkeletonCard className="p-5">
            <Skeleton className="h-4 w-28" />
            <div className="mt-4 space-y-2">
              <Skeleton className="h-10 w-full rounded-2xl" />
              <Skeleton className="h-10 w-full rounded-2xl" />
              <Skeleton className="h-10 w-full rounded-2xl" />
            </div>
          </SkeletonCard>
        </div>
      </div>
    </main>
  );
}

export default function ChatPage() {
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();
  const { pushToast } = useToast();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [integrationStatus, setIntegrationStatus] = useState<IntegrationStatus>(
    {
      gmailConnected: false,
      calendarConnected: false,
    },
  );

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I can help you manage Gmail and Google Calendar.",
    },
  ]);

  useEffect(() => {
    if (sessionStatus === "unauthenticated") {
      router.replace("/login");
      return;
    }

    if (session?.user) {
      void fetch("/api/integrations/status")
        .then(async (response) => {
          if (!response.ok) {
            return null;
          }

          return (await response.json()) as IntegrationStatus;
        })
        .then((payload) => {
          if (payload) {
            setIntegrationStatus(payload);
          }
        })
        .catch(() => {
          // Keep the shell usable even if status polling fails.
        });
    }
  }, [router, session, sessionStatus]);

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
      pushToast({
        title: "Agent request failed",
        description:
          error instanceof Error ? error.message : "Unable to send message.",
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  }

  if (sessionStatus === "loading" || !session?.user) {
    return loadingShell();
  }

  return (
    <AppShell
      user={session.user}
      status={integrationStatus}
      activeSection="agent"
      title="Agent"
      description="Natural language control for email and scheduling."
      primaryAction={{ label: "Dashboard", href: "/dashboard" }}
      secondaryAction={{
        label: "Clear chat",
        onClick: () => setMessages((current) => current.slice(0, 1)),
      }}
    >
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_280px]">
        <section className="flex min-h-[calc(100vh-9rem)] flex-col overflow-hidden rounded-[2rem] border border-[color:var(--border)] bg-[var(--card)] shadow-[0_20px_60px_-44px_rgba(var(--shadow),0.28)]">
          <div className="border-b border-[color:var(--border)] px-5 py-4 sm:px-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center rounded-full bg-[var(--accent)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-white">
                Agent
              </span>
              <span className="inline-flex items-center rounded-full border border-[color:var(--border)] bg-[var(--surface-muted)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted)]">
                Gmail + Calendar
              </span>
            </div>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--muted)]">
              Ask for summaries, scheduling help, drafts, or inbox actions.
            </p>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5 sm:px-6">
            {messages.map((msg, index) => (
              <div
                key={`${msg.role}-${index}`}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[min(48rem,88%)] rounded-[1.5rem] px-4 py-3 text-sm leading-6 shadow-sm ${
                    msg.role === "user"
                      ? "bg-[var(--accent)] text-white"
                      : "border border-[color:var(--border)] bg-[var(--surface-muted)] text-[var(--foreground)]"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {loading ? (
              <div className="flex justify-start">
                <div className="rounded-[1.5rem] border border-[color:var(--border)] bg-[var(--surface-muted)] px-4 py-3 text-sm text-[var(--muted)] shadow-sm">
                  Thinking...
                </div>
              </div>
            ) : null}
          </div>

          <div className="border-t border-[color:var(--border)] bg-[var(--surface-muted)]/60 p-4 sm:p-5">
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    sendMessage();
                  }
                }}
                placeholder="Schedule a meeting tomorrow at 5 PM..."
                className="flex-1 rounded-full border border-[color:var(--border)] bg-[var(--card)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--ring)]"
              />

              <button
                onClick={sendMessage}
                disabled={loading}
                className="inline-flex items-center justify-center rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_-20px_rgba(37,99,235,0.42)] transition duration-200 hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Send
              </button>
            </div>
          </div>
        </section>

        <aside className="space-y-4">
          <div className="rounded-[2rem] border border-[color:var(--border)] bg-[var(--card)] p-5 shadow-[0_20px_60px_-44px_rgba(var(--shadow),0.28)]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--muted)]">
              Assistant status
            </p>
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between rounded-2xl bg-[var(--surface-muted)] px-4 py-3">
                <span className="text-sm text-[var(--foreground)]">Gmail</span>
                <span
                  className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${integrationStatus.gmailConnected ? "border-[color:var(--border)] bg-[var(--accent-soft)] text-[var(--accent)]" : "border-[color:var(--border)] bg-[var(--card)] text-[var(--muted)]"}`}
                >
                  {integrationStatus.gmailConnected
                    ? "Connected"
                    : "Not connected"}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-[var(--surface-muted)] px-4 py-3">
                <span className="text-sm text-[var(--foreground)]">
                  Calendar
                </span>
                <span
                  className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${integrationStatus.calendarConnected ? "border-[color:var(--border)] bg-[var(--accent-soft)] text-[var(--accent)]" : "border-[color:var(--border)] bg-[var(--card)] text-[var(--muted)]"}`}
                >
                  {integrationStatus.calendarConnected
                    ? "Connected"
                    : "Not connected"}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-[color:var(--border)] bg-[var(--card)] p-5 shadow-[0_20px_60px_-44px_rgba(var(--shadow),0.28)]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--muted)]">
              Quick prompts
            </p>
            <div className="mt-4 space-y-2">
              {[
                "Summarize my unread mail",
                "Draft a reply to the latest thread",
                "Find time for a 30 minute meeting",
              ].map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => setMessage(prompt)}
                  className="w-full rounded-2xl border border-[color:var(--border)] bg-[var(--surface-muted)] px-4 py-3 text-left text-sm text-[var(--foreground)] shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-[var(--hover)] hover:shadow-md"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </AppShell>
  );
}
