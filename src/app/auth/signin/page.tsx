import LoginForm from "@/app/ui/login-form";
import { auth } from "@/auth";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Login | Admin",
};

export default async function LoginPage() {
  const session = await auth();
  
  if (session?.user) {
    redirect("/admin");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Admin Login</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to manage your blog content
          </p>
        </div>

        {/* Login Form Card */}
        <div className="rounded-lg border border-border bg-card p-8 shadow-sm">
          <LoginForm />
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-muted-foreground">
          Protected area • Authorized access only
        </p>
      </div>
    </div>
  );
}
