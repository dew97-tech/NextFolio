"use client";

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

  const isDark = mounted && resolvedTheme === "dark";
  const currentLabel = mounted ? (isDark ? "Dark" : "Light") : "Theme";
  const nextLabel = isDark ? "Light" : "Dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={`Theme: ${currentLabel}. Switch to ${nextLabel}.`}
      title={`Theme: ${currentLabel}`}
      className="text-sm text-ink-brown transition-colors hover:text-clay-text"
    >
      {currentLabel}
    </button>
  );
}
