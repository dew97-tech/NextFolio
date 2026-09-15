import { MobileMenu } from "@/components/mobile-menu";
import { NavLinks } from "@/components/nav-links";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import Link from "next/link";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background">
      <div className="mx-auto flex h-16 w-full max-w-[1180px] items-center justify-between px-5 md:px-8">
        <Link
          href="/"
          className="font-serif text-lg tracking-tight text-foreground"
        >
          David Dew Mallick
        </Link>

        <div className="hidden items-center gap-7 md:flex">
          <NavLinks />
          <ThemeToggle />
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
