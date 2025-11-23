"use client";

import { deletePost } from "@/app/lib/admin-actions";
import { TrashIcon } from "@heroicons/react/24/outline";

export default function DeletePostButton({ postId }: { postId: string }) {
  const handleDelete = async (formData: FormData) => {
    if (confirm('Are you sure you want to delete this post?')) {
      await deletePost(postId);
    }
  };

  return (
    <form action={handleDelete}>
      <button 
        type="submit"
        className="inline-flex items-center gap-1.5 rounded-md border border-destructive/50 px-3 py-1.5 text-sm font-medium text-destructive transition-colors hover:bg-destructive hover:text-destructive-foreground"
      >
        <TrashIcon className="h-4 w-4" />
        <span>Delete</span>
      </button>
    </form>
  );
}
