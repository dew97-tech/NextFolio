"use client";

import { navItems } from "@/lib/site-nav";
import { List, X } from "@phosphor-icons/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function MobileMenu() {
  const pathname = usePathname();
  const [openPath, setOpenPath] = useState<string | null>(null);
  const open = openPath === pathname;

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenPath(null);
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpenPath(open ? null : pathname)}
        aria-expanded={open}
        aria-controls="mobile-nav"
        aria-label={open ? "Close menu" : "Open menu"}
        className="inline-flex h-9 w-9 items-center justify-center rounded border border-transparent text-foreground transition-colors hover:border-border hover:bg-accent active:scale-[0.98]"
      >
        {open ? <X size={20} aria-hidden="true" /> : <List size={20} aria-hidden="true" />}
      </button>

      {open && (
        <div
          id="mobile-nav"
          className="absolute inset-x-0 top-16 border-b border-border bg-background px-5 pb-3 pt-2"
        >
          <nav className="flex flex-col" aria-label="Primary mobile">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => {
                  setOpenPath(null);
                  if (item.href.startsWith("/#")) {
                    window.dispatchEvent(
                      new CustomEvent("typed-section", {
                        detail: item.href.slice(2),
                      }),
                    );
                  }
                }}
                className="rounded px-2 py-2.5 text-base text-foreground transition-colors hover:bg-accent"
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
}
