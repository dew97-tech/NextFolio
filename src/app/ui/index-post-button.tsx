"use client";

import {
  requestIndexing,
  type IndexingActionState,
} from "@/app/lib/google/indexing-actions";
import { ArrowSquareOut, CircleNotch } from "@phosphor-icons/react";
import { useActionState } from "react";

export default function IndexPostButton({
  postId,
  indexedAt,
}: {
  postId: string;
  indexedAt?: string | null;
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
            ? `Last opened in Search Console: ${new Date(indexedAt).toLocaleString()}`
            : "Open this URL in Search Console to request indexing"
        }
        className="inline-flex h-8 items-center gap-1.5 rounded border border-border px-2.5 text-sm text-ink-muted transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? (
          <CircleNotch size={14} className="animate-spin" aria-hidden="true" />
        ) : (
          <ArrowSquareOut size={14} aria-hidden="true" />
        )}
        <span>{indexedAt ? "Re-check" : "Index"}</span>
      </button>

      {state?.message ? (
        <span className="max-w-[160px] text-right text-[11px] leading-tight text-warn">
          {state.message}
        </span>
      ) : indexedAt ? (
        <span className="text-[11px] text-ink-faint">
          Requested {new Date(indexedAt).toLocaleDateString()}
        </span>
      ) : null}
    </form>
  );
}
