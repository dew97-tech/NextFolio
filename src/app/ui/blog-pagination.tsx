"use client";

import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

export default function BlogPagination({ totalPages }: { totalPages: number }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  const allPages = generatePagination(currentPage, totalPages);

  return (
    <nav className="flex items-center gap-1.5" aria-label="Pagination">
      <PaginationArrow
        direction="left"
        href={createPageURL(currentPage - 1)}
        isDisabled={currentPage <= 1}
      />

      {allPages.map((page, index) => (
        <PaginationNumber
          key={`${page}-${index}`}
          href={createPageURL(page)}
          page={page}
          isActive={currentPage === page}
        />
      ))}

      <PaginationArrow
        direction="right"
        href={createPageURL(currentPage + 1)}
        isDisabled={currentPage >= totalPages}
      />
    </nav>
  );
}

function PaginationNumber({
  page,
  href,
  isActive,
}: {
  page: number | string;
  href: string;
  isActive: boolean;
}) {
  const className = `flex h-11 min-w-11 items-center justify-center px-2 font-mono text-sm tabular-nums transition-colors ${
    isActive
      ? "rounded bg-primary text-primary-foreground"
      : "rounded text-ink-muted hover:bg-accent hover:text-clay-text"
  }`;

  if (isActive || page === "...") {
    return (
      <span className={className} aria-current={isActive ? "page" : undefined}>
        {page}
      </span>
    );
  }

  return (
    <Link href={href} className={className}>
      {page}
    </Link>
  );
}

function PaginationArrow({
  href,
  direction,
  isDisabled,
}: {
  href: string;
  direction: "left" | "right";
  isDisabled?: boolean;
}) {
  const className = `flex h-11 w-11 items-center justify-center rounded border border-border transition-colors ${
    isDisabled
      ? "pointer-events-none text-ink-faint opacity-50"
      : "text-ink-muted hover:bg-accent hover:text-clay-text"
  }`;

  const label = direction === "left" ? "Previous page" : "Next page";
  const icon =
    direction === "left" ? <CaretLeft size={14} aria-hidden="true" /> : <CaretRight size={14} aria-hidden="true" />;

  if (isDisabled) {
    return (
      <span className={className} aria-disabled="true">
        <span className="sr-only">{label}</span>
        {icon}
      </span>
    );
  }

  return (
    <Link href={href} className={className} aria-label={label}>
      {icon}
    </Link>
  );
}

function generatePagination(currentPage: number, totalPages: number) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  if (currentPage <= 3) {
    return [1, 2, 3, "...", totalPages - 1, totalPages];
  }

  if (currentPage >= totalPages - 2) {
    return [1, 2, "...", totalPages - 2, totalPages - 1, totalPages];
  }

  return [
    1,
    "...",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "...",
    totalPages,
  ];
}
