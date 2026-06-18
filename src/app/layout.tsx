import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { auth } from "@/server/auth";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Superhuman Agent",
  description:
    "A Superhuman-style AI assistant with Gmail and Calendar integrations.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.15),_transparent_30%),linear-gradient(180deg,_#020617_0%,_#0f172a_55%,_#020617_100%)] text-slate-100">
        <Providers session={session}>{children}</Providers>
      </body>
    </html>
  );
}
