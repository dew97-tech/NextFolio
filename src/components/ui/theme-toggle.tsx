"use client";

import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";

const labels = {
  system: "Auto",
  light: "Light",
  dark: "Dark",
} as const;

const order = ["system", "light", "dark"] as const;

const subscribe = () => () => {};

function useMounted() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const mounted = useMounted();

  const current = mounted && theme && theme in labels ? theme : "system";
  const currentLabel = labels[current as keyof typeof labels];
  const next =
    order[(order.indexOf(current as (typeof order)[number]) + 1) % order.length];
  const nextLabel = labels[next];

  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      aria-label={`Theme: ${currentLabel}. Switch to ${nextLabel}.`}
      title={`Theme: ${currentLabel}`}
      className="text-sm text-ink-muted transition-colors hover:text-foreground"
    >
      {currentLabel}
    </button>
  );
}
