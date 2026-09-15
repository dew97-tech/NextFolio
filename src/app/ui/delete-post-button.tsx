"use client";

import { deletePost } from "@/app/lib/admin-actions";
import { Trash } from "@phosphor-icons/react";

export default function DeletePostButton({ postId }: { postId: string }) {
  const handleDelete = async () => {
    if (confirm("Delete this post? This cannot be undone.")) {
      await deletePost(postId);
    }
  };

  return (
    <form action={handleDelete}>
      <button
        type="submit"
        className="inline-flex h-8 items-center gap-1.5 rounded border border-border px-2.5 text-sm text-ink-muted transition-colors hover:border-destructive/40 hover:text-destructive"
      >
        <Trash size={14} aria-hidden="true" />
        <span>Delete</span>
      </button>
    </form>
  );
}
