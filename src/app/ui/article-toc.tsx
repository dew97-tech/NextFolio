"use client";

import type { TocHeading } from "@/app/lib/toc";
import { useEffect, useState } from "react";

export default function ArticleToc({ headings }: { headings: TocHeading[] }) {
  const [activeId, setActiveId] = useState<string | null>(
    headings[0]?.id ?? null,
  );

  useEffect(() => {
    const elements = headings
      .map((heading) => document.getElementById(heading.id))
      .filter((element): element is HTMLElement => element !== null);

    if (elements.length === 0) return;

    let frame = 0;

    const updateActive = () => {
      let current = elements[0].id;
      for (const element of elements) {
        if (element.getBoundingClientRect().top <= 140) {
          current = element.id;
        }
      }
      setActiveId(current);
    };

    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(updateActive);
    };

    updateActive();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [headings]);

  return (
    <nav aria-label="On this page" className="border-l border-border pl-6">
      <p className="eyebrow text-ink-faint">On this page</p>
      <ul className="mt-4 space-y-1.5">
        {headings.map((heading) => {
          const isActive = heading.id === activeId;
          return (
            <li
              key={heading.id}
              className={heading.level === 3 ? "pl-4" : undefined}
            >
              <a
                href={`#${heading.id}`}
                aria-current={isActive ? "location" : undefined}
                className={`block py-1 text-sm leading-snug transition-colors ${
                  isActive
                    ? "font-medium text-ink-brown"
                    : "text-ink-muted hover:text-ink-brown"
                }`}
              >
                {heading.text}
              </a>
            </li>
          );
        })}
      </ul>
      <a
        href="#main-content"
        className="link-draw mt-6 inline-block py-1 text-sm text-clay-text hover:text-ink-brown"
      >
        Back to top
      </a>
    </nav>
  );
}
