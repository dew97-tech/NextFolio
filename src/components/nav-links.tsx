"use client";

import { navItems } from "@/lib/site-nav";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavLinks() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-7" aria-label="Primary">
      {navItems.map((item) => {
        const isSection = item.href.startsWith("/#");
        const isActive = !isSection && pathname.startsWith(item.href);

        return (
          <Link
            key={item.name}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "py-1.5 text-sm text-ink-muted transition-colors hover:text-foreground",
              isActive && "text-foreground underline decoration-1 underline-offset-4",
            )}
          >
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
}
