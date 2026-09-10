"use client";

import {
  requestIndexing,
  type IndexingActionState,
} from "@/app/lib/google/indexing-actions";
import { Loader2, Search } from "lucide-react";
import { useActionState } from "react";

export default function IndexPostButton({
  postId,
  indexedAt,
  indexStatus,
}: {
  postId: string;
  indexedAt?: string | null;
  indexStatus?: string | null;
}) {
  const [state, formAction, pending] = useActionState<
    IndexingActionState | null,
    FormData
  >(requestIndexing.bind(null, postId), null);

  return (
    <form action={formAction} className="inline-flex flex-col items-end gap-1">
      <button
        type="submit"
        disabled={pending}
        title={
          indexedAt
            ? `Last index request: ${new Date(indexedAt).toLocaleString()}`
            : "Request indexing in Google Search Console"
        }
        className="inline-flex items-center justify-center gap-1 px-3 h-8 rounded-lg border border-border bg-card text-xs font-medium text-foreground hover:bg-accent hover:text-primary transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {pending ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <Search className="h-3.5 w-3.5" />
        )}
        <span>{indexedAt ? "Re-index" : "Index"}</span>
      </button>

      {state?.message ? (
        <span className="text-[10px] leading-tight text-amber-600 dark:text-amber-400 max-w-[150px] text-right">
          {state.message}
        </span>
      ) : indexedAt ? (
        <span className="text-[10px] text-emerald-600 dark:text-emerald-400">
          Indexed {new Date(indexedAt).toLocaleDateString()}
        </span>
      ) : indexStatus === "error" ? (
        <span className="text-[10px] text-amber-600 dark:text-amber-400">
          Last attempt failed
        </span>
      ) : null}
    </form>
  );
}
