"use client";

import { createPost, updatePost } from "@/app/lib/admin-actions";
import { upload } from "@vercel/blob/client";
import { Image as ImageIcon, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { useFormStatus } from "react-dom";

export default function PostForm({ post }: { post?: any }) {
  const [thumbnailUrl, setThumbnailUrl] = useState(post?.thumbnail || "");
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    formData.set("thumbnail", thumbnailUrl);
    if (post) {
      await updatePost(post.id, null, formData);
    } else {
      await createPost(null, formData);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }

    const file = event.target.files[0];
    setIsUploading(true);

    try {
      const newBlob = await upload(file.name, file, {
        access: "public",
        handleUploadUrl: "/api/upload",
      });
      setThumbnailUrl(newBlob.url);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form action={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="title" className="text-sm font-medium">Title</label>
        <input
          type="text"
          id="title"
          name="title"
          defaultValue={post?.title}
          required
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="slug" className="text-sm font-medium">Slug</label>
        <input
          type="text"
          id="slug"
          name="slug"
          defaultValue={post?.slug}
          required
          placeholder="my-blog-post"
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="description" className="text-sm font-medium">Description</label>
        <textarea
          id="description"
          name="description"
          defaultValue={post?.description}
          required
          rows={3}
          className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Thumbnail Image</label>
        <div className="flex items-center gap-4">
          {thumbnailUrl && (
            <div className="relative h-24 w-24 overflow-hidden rounded-lg border border-border">
              <img src={thumbnailUrl} alt="Thumbnail preview" className="h-full w-full object-cover" />
            </div>
          )}
          <div className="flex-1">
            <label
              htmlFor="thumbnail-upload"
              className="inline-flex items-center gap-2 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground cursor-pointer"
            >
              {isUploading ? (
                <>
                  <Upload className="h-4 w-4 animate-spin" />
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <ImageIcon className="h-4 w-4" />
                  <span>{thumbnailUrl ? "Change Image" : "Upload Image"}</span>
                </>
              )}
            </label>
            <input
              id="thumbnail-upload"
              type="file"
              ref={inputFileRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />
          </div>
        </div>
        <input type="hidden" name="thumbnail" value={thumbnailUrl} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="readTime" className="text-sm font-medium">Read Time</label>
          <input
            type="text"
            id="readTime"
            name="readTime"
            defaultValue={post?.readTime || "5 min read"}
            required
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="tags" className="text-sm font-medium">Tags (comma separated)</label>
          <input
            type="text"
            id="tags"
            name="tags"
            defaultValue={post?.tags?.join(", ")}
            required
            placeholder="SEO, Web Development"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="content" className="text-sm font-medium">Content (HTML)</label>
        <textarea
          id="content"
          name="content"
          defaultValue={post?.content}
          required
          rows={20}
          className="flex min-h-[500px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="<p>Your HTML content here...</p>"
        />
        <p className="text-xs text-muted-foreground">Paste your HTML content here. Tables, headings, and all HTML tags are supported.</p>
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="published"
          name="published"
          defaultChecked={post?.published}
          className="h-4 w-4 rounded border-input text-primary focus:ring-2 focus:ring-ring"
        />
        <label htmlFor="published" className="text-sm font-medium">Publish immediately</label>
      </div>

      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
    >
      {pending ? "Saving..." : "Save Post"}
    </button>
  );
}
