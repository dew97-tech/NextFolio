"use client";

import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

const DEFAULT_TYPE_INTERVAL_MS = 42;
const FORCE_COOLDOWN_MS = 400;
const FORCE_DELAY_MS = 200;

export function TypeLine({
  text,
  className,
  trigger = "mount",
  delayMs = 0,
  caret = true,
  highlight,
  speedMs = DEFAULT_TYPE_INTERVAL_MS,
  sectionId,
  retrigger = false,
}: {
  text: string;
  className?: string;
  trigger?: "mount" | "view";
  delayMs?: number;
  caret?: boolean;
  highlight?: string;
  speedMs?: number;
  sectionId?: string;
  retrigger?: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduceMotion) {
      element.setAttribute("data-typing", "done");
      return;
    }

    let interval: number | undefined;
    let startTimeout: number | undefined;
    let startedAt = 0;

    const clearTimers = () => {
      if (interval) window.clearInterval(interval);
      if (startTimeout) window.clearTimeout(startTimeout);
      interval = undefined;
      startTimeout = undefined;
    };

    const start = () => {
      clearTimers();
      startedAt = Date.now();
      element.setAttribute("data-typing", "active");

      let typed = 0;
      setCount(typed);

      interval = window.setInterval(() => {
        typed += 1;
        setCount(typed);

        if (typed >= text.length) {
          window.clearInterval(interval);
          interval = undefined;
          element.setAttribute("data-typing", "done");
        }
      }, speedMs);
    };

    const schedule = (wait: number) => {
      clearTimers();
      if (wait > 0) {
        startTimeout = window.setTimeout(start, wait);
      } else {
        start();
      }
    };

    const reset = () => {
      clearTimers();
      setCount(0);
      element.setAttribute("data-typing", "pending");
    };

    const isVisible = () => {
      const rect = element.getBoundingClientRect();
      return rect.bottom > 0 && rect.top < window.innerHeight;
    };

    const onForce = (event: Event) => {
      if (!sectionId) return;
      if ((event as CustomEvent<string>).detail !== sectionId) return;
      if (element.getAttribute("data-typing") === "active") return;
      if (Date.now() - startedAt < FORCE_COOLDOWN_MS) return;
      if (!isVisible()) return;

      setCount(0);
      element.setAttribute("data-typing", "pending");
      schedule(Math.max(delayMs, FORCE_DELAY_MS));
    };

    if (sectionId) {
      window.addEventListener("typed-section", onForce);
    }

    if (trigger === "view" || retrigger) {
      if (typeof IntersectionObserver !== "undefined") {
        const observer = new IntersectionObserver(
          (entries) => {
            for (const entry of entries) {
              if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
                if (element.getAttribute("data-typing") !== "active") {
                  schedule(delayMs);
                }
              } else if (retrigger && entry.intersectionRatio === 0) {
                reset();
              }
            }
          },
          { threshold: [0, 0.6] },
        );

        observer.observe(element);

        return () => {
          observer.disconnect();
          clearTimers();
          if (sectionId) window.removeEventListener("typed-section", onForce);
        };
      }
    }

    schedule(delayMs);

    return () => {
      clearTimers();
      if (sectionId) window.removeEventListener("typed-section", onForce);
    };
  }, [text, trigger, delayMs, speedMs, sectionId, retrigger]);

  const fullText = highlight
    ? (() => {
        const index = text.toLowerCase().indexOf(highlight.toLowerCase());

        if (index === -1) return text;

        return (
          <>
            {text.slice(0, index)}
            <span className="highlight-marker">
              {text.slice(index, index + highlight.length)}
            </span>
            {text.slice(index + highlight.length)}
          </>
        );
      })()
    : text;

  return (
    <span className={cn(className)}>
      <span className="sr-only">{text}</span>
      <span
        ref={ref}
        aria-hidden="true"
        data-typing="pending"
        className="type-line"
      >
        <span className="type-line-full">{fullText}</span>
        <span className="type-line-progress">
          {text.slice(0, count)}
          {caret ? <span className="type-caret" /> : null}
        </span>
      </span>
    </span>
  );
}
