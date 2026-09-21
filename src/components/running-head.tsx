"use client";

import { cn } from "@/lib/utils";
import { useActiveSection } from "@/lib/use-active-section";
import { usePathname } from "next/navigation";

const sectionLabels: Record<string, string> = {
  projects: "Selected work",
  experience: "Experience",
  skills: "Skills",
  awards: "Awards",
};

const sectionIds = Object.keys(sectionLabels);

export function RunningHead() {
  const pathname = usePathname();
  const active = useActiveSection(sectionIds, pathname === "/");
  const label = active ? sectionLabels[active] : null;

  return (
    <p
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute left-1/2 hidden -translate-x-1/2 select-none font-mono text-xs tracking-[0.01em] text-ink-faint transition-opacity duration-150 lg:block",
        label ? "opacity-100" : "opacity-0",
      )}
    >
      {label ?? "David Dew Mallick"}
    </p>
  );
}
