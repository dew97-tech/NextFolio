"use client";

import { useEffect, useRef } from "react";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
};

export function Reveal({ children, className }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const show = () => element.setAttribute("data-reveal", "visible");

    if (typeof IntersectionObserver === "undefined") {
      show();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            show();
            observer.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 },
    );

    observer.observe(element);
    const fallback = window.setTimeout(show, 900);

    return () => {
      observer.disconnect();
      window.clearTimeout(fallback);
    };
  }, []);

  return (
    <div ref={ref} data-reveal="pending" className={className}>
      {children}
    </div>
  );
}
