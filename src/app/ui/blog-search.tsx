"use client";

import { MagnifyingGlass } from "@phosphor-icons/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

export default function BlogSearch() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");

    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }

    replace(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <div className="relative">
      <label htmlFor="blog-search" className="sr-only">
        Search posts
      </label>
      <input
        id="blog-search"
        type="search"
        placeholder="Search posts…"
        onChange={(event) => handleSearch(event.target.value)}
        defaultValue={searchParams.get("query")?.toString()}
        className="h-10 w-full rounded border border-input bg-surface pl-9 pr-4 text-sm text-foreground placeholder:text-ink-faint"
      />
      <MagnifyingGlass
        size={16}
        aria-hidden="true"
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint"
      />
    </div>
  );
}
