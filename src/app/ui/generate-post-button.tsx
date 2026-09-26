"use client";

import {
  triggerGeneration,
  type GenerationActionState,
} from "@/app/lib/admin-actions";
import { cn } from "@/lib/utils";
import { CircleNotch, Sparkle } from "@phosphor-icons/react";
import { useActionState } from "react";

export default function GeneratePostButton() {
  const [state, formAction, pending] = useActionState<
    GenerationActionState | null,
    FormData
  >(triggerGeneration, null);

  return (
    <form action={formAction} className="flex flex-col items-end gap-1">
      <button
        type="submit"
        disabled={pending}
        title="Generate an AI draft now, ignoring the draft cap"
        className="inline-flex h-11 items-center gap-1.5 rounded border border-border px-4 text-sm text-ink-muted transition-colors hover:border-primary/40 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? (
          <CircleNotch size={14} className="animate-spin" aria-hidden="true" />
        ) : (
          <Sparkle size={14} aria-hidden="true" />
        )}
        <span>{pending ? "Generating…" : "Generate now"}</span>
      </button>

      {state?.message ? (
        <span
          className={cn(
            "max-w-[260px] text-right text-[11px] leading-tight",
            state.status === "success"
              ? "text-ok"
              : state.status === "failed"
                ? "text-warn"
                : "text-ink-faint",
          )}
        >
          {state.message}
        </span>
      ) : null}
    </form>
  );
}
