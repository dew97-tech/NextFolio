"use client";

import { navItems } from "@/lib/site-nav";
import { cn } from "@/lib/utils";
import { useActiveSection } from "@/lib/use-active-section";
import Link from "next/link";
import { usePathname } from "next/navigation";

const sectionIds = navItems
  .filter((item) => item.href.startsWith("/#"))
  .map((item) => item.href.slice(2));

export function NavLinks() {
  const pathname = usePathname();
  const activeSection = useActiveSection(sectionIds, pathname === "/");

  return (
    <nav className="flex items-center gap-7" aria-label="Primary">
      {navItems.map((item) => {
        const isSection = item.href.startsWith("/#");
        const sectionId = isSection ? item.href.slice(2) : null;
        const isActive = isSection
          ? activeSection === sectionId
          : pathname.startsWith(item.href);

        return (
          <Link
            key={item.name}
            href={item.href}
            aria-current={
              isActive ? (isSection ? "location" : "page") : undefined
            }
            onClick={() => {
              if (!sectionId) return;
              window.dispatchEvent(
                new CustomEvent("typed-section", { detail: sectionId }),
              );
            }}
            className={cn(
              "link-draw py-1.5 text-sm text-ink-brown hover:text-clay-text",
              isActive && "text-clay-text",
            )}
          >
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
}
