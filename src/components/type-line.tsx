"use client";

import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

const DEFAULT_TYPE_INTERVAL_MS = 42;

export function TypeLine({
  text,
  className,
  trigger = "mount",
  delayMs = 0,
  caret = true,
  highlight,
  speedMs = DEFAULT_TYPE_INTERVAL_MS,
}: {
  text: string;
  className?: string;
  trigger?: "mount" | "view";
  delayMs?: number;
  caret?: boolean;
  highlight?: string;
  speedMs?: number;
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

    let timer: number | undefined;
    let startTimeout: number | undefined;

    const start = () => {
      element.setAttribute("data-typing", "active");

      let typed = 0;
      timer = window.setInterval(() => {
        typed += 1;
        setCount(typed);

        if (typed >= text.length) {
          window.clearInterval(timer);
          element.setAttribute("data-typing", "done");
        }
      }, speedMs);
    };

    const schedule = () => {
      if (delayMs > 0) {
        startTimeout = window.setTimeout(start, delayMs);
      } else {
        start();
      }
    };

    if (trigger === "view" && typeof IntersectionObserver !== "undefined") {
      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              observer.disconnect();
              schedule();
            }
          }
        },
        { threshold: 0.6 },
      );

      observer.observe(element);

      return () => {
        observer.disconnect();
        if (timer) window.clearInterval(timer);
        if (startTimeout) window.clearTimeout(startTimeout);
      };
    }

    schedule();

    return () => {
      if (timer) window.clearInterval(timer);
      if (startTimeout) window.clearTimeout(startTimeout);
    };
  }, [text, trigger, delayMs, speedMs]);

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
