"use client";

import { Check, Copy, ShareNetwork } from "@phosphor-icons/react";
import { useState } from "react";

export default function BlogReadingProgress({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          url: window.location.href,
        });
      } catch {
        // dismissed
      }
    } else {
      await handleCopyLink();
    }
  };

  return (
    <div className="flex items-center gap-5">
      <button
        onClick={handleCopyLink}
        type="button"
        aria-live="polite"
        className="inline-flex items-center gap-1.5 text-[13px] text-ink-muted transition-colors hover:text-foreground"
      >
        {copied ? (
          <>
            <Check size={14} aria-hidden="true" className="text-ok" />
            <span className="text-ok">Copied</span>
          </>
        ) : (
          <>
            <Copy size={14} aria-hidden="true" />
            <span>Copy link</span>
          </>
        )}
      </button>

      <button
        onClick={handleShare}
        type="button"
        className="inline-flex items-center gap-1.5 text-[13px] text-ink-muted transition-colors hover:text-foreground"
      >
        <ShareNetwork size={14} aria-hidden="true" />
        <span>Share</span>
      </button>
    </div>
  );
}
