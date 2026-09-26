"use client";

import { generateImagePrompt } from "@/app/lib/admin-actions";
import { Check, CircleNotch, CopySimple, Sparkle } from "@phosphor-icons/react";
import { useState, useTransition } from "react";

export default function ImagePromptPanel({
  title,
  description,
  tags,
  content,
}: {
  title: string;
  description: string;
  tags: string[];
  content: string;
}) {
  const [prompt, setPrompt] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [pending, startTransition] = useTransition();

  const handleGenerate = () => {
    setError("");
    setCopied(false);

    startTransition(async () => {
      const state = await generateImagePrompt({
        title,
        description,
        tags: tags.join(", "),
        content,
      });

      if (state.prompt) {
        setPrompt(state.prompt);
        return;
      }

      setError(state.message ?? "Could not generate a prompt");
    });
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(prompt);
    setCopied(true);
  };

  return (
    <div className="space-y-3 border-t border-border pt-4">
      <div className="flex items-start justify-between gap-3">
        <p className="text-[13px] text-ink-muted">
          Generate a prompt for the cover image, then paste it into an image
          model such as GPT or Gemini.
        </p>

        <button
          type="button"
          onClick={handleGenerate}
          disabled={pending}
          className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded border border-border px-3 text-[13px] text-ink-muted transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? (
            <CircleNotch size={14} className="animate-spin" aria-hidden="true" />
          ) : (
            <Sparkle size={14} aria-hidden="true" />
          )}
          <span>
            {pending ? "Generating…" : prompt ? "Regenerate" : "Generate prompt"}
          </span>
        </button>
      </div>

      {error ? (
        <p role="alert" className="text-[13px] text-danger">
          {error}
        </p>
      ) : null}

      {prompt ? (
        <div className="space-y-3 rounded border border-border bg-surface p-3">
          <p className="font-mono text-[12px] leading-relaxed text-ink-muted">
            {prompt}
          </p>

          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex h-8 items-center gap-1.5 rounded border border-border px-2.5 text-[13px] text-ink-muted transition-colors hover:text-foreground"
          >
            {copied ? (
              <Check size={14} aria-hidden="true" />
            ) : (
              <CopySimple size={14} aria-hidden="true" />
            )}
            <span>{copied ? "Copied" : "Copy"}</span>
          </button>
        </div>
      ) : null}
    </div>
  );
}
