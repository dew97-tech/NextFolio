"use client";

import { cn } from "@/lib/utils";
import { Moon, Sun } from "@phosphor-icons/react";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

function useMounted() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useMounted();

  const isDark = resolvedTheme === "dark";
  const showSun = mounted && isDark;
  const showMoon = mounted && !isDark;

  const currentLabel = mounted ? (isDark ? "Dark" : "Light") : "Theme";
  const nextLabel = mounted ? (isDark ? "light" : "dark") : "the other";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={`${currentLabel} mode. Switch to ${nextLabel} mode.`}
      title={`${currentLabel} mode. Switch to ${nextLabel} mode.`}
      className="inline-flex h-11 w-11 items-center justify-center rounded text-ink-brown transition-colors hover:text-clay-text"
    >
      <span className="relative inline-flex h-[18px] w-[18px] items-center justify-center">
        <Sun
          size={18}
          aria-hidden="true"
          className={cn(
            "absolute transition-[transform,opacity] duration-500",
            showSun ? "rotate-0 opacity-100" : "-rotate-90 opacity-0",
          )}
        />
        <Moon
          size={18}
          aria-hidden="true"
          className={cn(
            "absolute transition-[transform,opacity] duration-500",
            showMoon ? "rotate-0 opacity-100" : "rotate-90 opacity-0",
          )}
        />
      </span>
    </button>
  );
}
