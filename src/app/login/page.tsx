import { redirect } from "next/navigation";
import { auth, isGoogleOAuthConfigured } from "@/server/auth";
import { LoginPanel } from "@/components/login-panel";

export default async function LoginPage() {
  const session = await auth();

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl items-center px-4 py-12 sm:px-6 lg:px-8">
      <LoginPanel isGoogleOAuthConfigured={isGoogleOAuthConfigured} />
    </main>
  );
}
