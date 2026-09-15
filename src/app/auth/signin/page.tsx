import LoginForm from "@/app/ui/login-form";
import { auth } from "@/auth";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Sign in",
};

export default async function LoginPage() {
  const session = await auth();

  if (session?.user) {
    redirect("/admin");
  }

  return (
    <main
      id="main-content"
      className="flex min-h-screen items-center justify-center px-5 py-16"
    >
      <div className="w-full max-w-sm">
        <h1 className="font-serif text-2xl tracking-[-0.01em] text-foreground">
          Admin
        </h1>
        <p className="mt-2 text-sm text-ink-muted">
          Sign in to manage posts.
        </p>

        <div className="mt-8 rounded-lg border border-border bg-card p-6">
          <LoginForm />
        </div>

        <p className="mt-6 text-xs text-ink-faint">
          Authorized access only.
        </p>
      </div>
    </main>
  );
}
