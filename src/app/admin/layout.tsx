import { signOut } from "@/auth";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import AdminNav from "@/app/ui/admin-nav";
import { ArrowSquareOut, SignOut } from "@phosphor-icons/react/ssr";
import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border bg-background">
        <div className="mx-auto flex h-14 w-full max-w-[1180px] items-center justify-between gap-4 px-5 md:px-8">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="flex items-baseline gap-2">
              <span className="font-serif text-base tracking-tight text-foreground">
                David Dew Mallick
              </span>
              <span className="font-mono text-[11px] text-ink-faint">
                admin
              </span>
            </Link>
            <AdminNav />
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 text-sm text-ink-muted transition-colors hover:text-foreground"
            >
              <span className="hidden sm:inline">View site</span>
              <ArrowSquareOut size={14} aria-hidden="true" />
            </Link>

            <ThemeToggle />

            <form
              action={async () => {
                "use server";
                await signOut();
              }}
            >
              <button
                type="submit"
                className="inline-flex h-8 items-center gap-1.5 rounded border border-border px-2.5 text-sm text-ink-muted transition-colors hover:border-destructive/40 hover:text-destructive"
              >
                <SignOut size={14} aria-hidden="true" />
                <span className="hidden sm:inline">Sign out</span>
              </button>
            </form>
          </div>
        </div>
      </header>

      <main
        id="main-content"
        className="mx-auto w-full max-w-[1180px] flex-1 px-5 py-8 md:px-8 md:py-10"
      >
        {children}
      </main>
    </div>
  );
}
