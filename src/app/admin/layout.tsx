import { signOut } from "@/auth";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { ExternalLink, LayoutDashboard, LogOut, PenSquare } from "lucide-react";
import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/75 shadow-xs">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 max-w-7xl">
          <div className="flex items-center gap-6 sm:gap-8">
            <Link href="/admin" className="flex items-center gap-2.5 font-bold tracking-tight text-foreground hover:text-primary transition-colors">
              <div className="h-8 w-8 rounded-lg bg-primary/15 text-primary flex items-center justify-center font-extrabold text-sm border border-primary/20">
                DD
              </div>
              <span className="text-base sm:text-lg">David Dew <span className="text-primary font-normal">Studio</span></span>
            </Link>

            <nav className="hidden sm:flex items-center gap-4 text-sm font-medium">
              <Link
                href="/admin"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-foreground hover:text-primary hover:bg-accent transition-colors"
              >
                <LayoutDashboard className="h-4 w-4" />
                <span>Articles</span>
              </Link>
              <Link
                href="/admin/new"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-muted-foreground hover:text-primary hover:bg-accent transition-colors"
              >
                <PenSquare className="h-4 w-4" />
                <span>New Article</span>
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card text-xs sm:text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            >
              <span>View Site</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>

            <div className="border-l border-border/60 pl-2">
              <ThemeToggle />
            </div>

            <form
              action={async () => {
                "use server";
                await signOut();
              }}
            >
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs sm:text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30"
                title="Sign out of editorial studio"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 py-8 max-w-7xl">
        {children}
      </main>
    </div>
  );
}
