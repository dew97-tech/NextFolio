"use client";

import { ArrowClockwise, Warning } from "@phosphor-icons/react";
import Link from "next/link";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 sm:px-6">
      <div className="max-w-md w-full text-center">
        <div className="mx-auto h-14 w-14 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mb-6">
          <Warning size={28} aria-hidden="true" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-3">
          Something went wrong
        </h1>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          An unexpected error occurred while loading this page. Please try again.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors focus-visible:ring-2 focus-visible:ring-primary"
          >
            <ArrowClockwise size={16} aria-hidden="true" />
            Try again
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-border font-medium hover:bg-accent transition-colors focus-visible:ring-2 focus-visible:ring-primary"
          >
            Back home
          </Link>
        </div>
      </div>
    </div>
  );
}
