"use client";

import { createPost, updatePost } from "@/app/lib/admin-actions";
import { upload } from "@vercel/blob/client";
import {
  Image as ImageIcon,
  Upload,
  Clock,
  Tag,
  CheckCircle2,
  FileText,
  Trash2,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import TiptapEditor from "./tiptap-editor";

export default function PostForm({ post }: { post?: any }) {
  const [title, setTitle] = useState(post?.title || "");
  const [slug, setSlug] = useState(post?.slug || "");
  const [description, setDescription] = useState(post?.description || "");
  const [thumbnailUrl, setThumbnailUrl] = useState(post?.thumbnail || "");
  const [content, setContent] = useState(post?.content || "");
  const [isPublished, setIsPublished] = useState(post?.published ?? false);
  const [readTime, setReadTime] = useState(post?.readTime || "5 min read");
  const [tags, setTags] = useState<string[]>(post?.tags || ["Engineering", "Web Development"]);
  const [tagInput, setTagInput] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const inputFileRef = useRef<HTMLInputElement>(null);

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    if (!post) {
      setSlug(generateSlug(val));
    }
  };

  const handleContentChange = (newHtml: string) => {
    setContent(newHtml);
    const textOnly = newHtml.replace(/<[^>]*>/g, " ");
    const words = textOnly.trim().split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(1, Math.ceil(words / 200));
    setReadTime(`${minutes} min read`);
  };

  const handleAddTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return;

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
      alert("Upload failed. You can also paste an image URL directly.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (formData: FormData) => {
    formData.set("title", title);
    formData.set("slug", slug);
    formData.set("description", description);
    formData.set("thumbnail", thumbnailUrl);
    formData.set("content", content);
    formData.set("published", isPublished ? "true" : "false");
    formData.set("readTime", readTime);
    formData.set("tags", tags.join(", "));

    if (post) {
      await updatePost(post.id, null, formData);
    } else {
      await createPost(null, formData);
    }
  };

  return (
    <form action={handleSubmit} className="space-y-8">
      <input type="hidden" name="published" value={isPublished ? "true" : "false"} />
      <input type="hidden" name="thumbnail" value={thumbnailUrl} />
      <input type="hidden" name="readTime" value={readTime} />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-5">
            <div>
              <label htmlFor="title" className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                Article Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={title}
                onChange={handleTitleChange}
                required
                placeholder="Enter an engaging, descriptive title..."
                className="w-full text-2xl md:text-3xl font-bold bg-transparent border-0 border-b border-border/80 focus:border-primary pb-2.5 outline-none text-foreground placeholder:text-muted-foreground/50 transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="slug" className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                  URL Slug
                </label>
                <div className="flex items-center gap-1 text-sm text-muted-foreground bg-muted/40 border border-input rounded-md px-3 py-2">
                  <span className="text-xs opacity-70">/blog/</span>
                  <input
                    type="text"
                    id="slug"
                    name="slug"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    required
                    className="bg-transparent border-none outline-none text-foreground flex-1 font-mono text-xs"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="readTime" className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                  Read Time
                </label>
                <div className="flex items-center gap-2 bg-muted/40 border border-input rounded-md px-3 py-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    id="readTime"
                    name="readTime"
                    value={readTime}
                    onChange={(e) => setReadTime(e.target.value)}
                    className="bg-transparent border-none outline-none text-foreground flex-1 text-xs"
                  />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                Excerpt / Subtitle
              </label>
              <textarea
                id="description"
                name="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={2}
                placeholder="A concise summary of your article for social previews and SEO..."
                className="w-full rounded-md border border-input bg-background/80 px-3 py-2 text-sm placeholder:text-muted-foreground/60 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-primary" />
                Article Content
              </label>
              <span className="text-xs text-muted-foreground">
                TipTap Rich Text Editor (Supports HTML paste & tables)
              </span>
            </div>
            <TiptapEditor content={content} onChange={handleContentChange} />
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              Publishing Settings
            </h3>

            <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/30">
              <div>
                <p className="text-sm font-semibold text-foreground">Status</p>
                <p className="text-xs text-muted-foreground">
                  {isPublished ? "Visible to public" : "Saved as private draft"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsPublished(!isPublished)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  isPublished ? "bg-emerald-500" : "bg-muted-foreground/30"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isPublished ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            <div className="space-y-2 pt-2 border-t border-border">
              <SubmitButton isPublished={isPublished} />
              {post?.slug && (
                <a
                  href={`/blog/${post.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full flex items-center justify-center gap-1.5 py-2 px-4 rounded-md border border-border hover:bg-accent text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  View Live Article
                </a>
              )}
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-primary" />
              Featured Cover Image
            </h3>

            {thumbnailUrl ? (
              <div className="space-y-3">
                <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-border group">
                  <img src={thumbnailUrl} alt="Cover preview" className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setThumbnailUrl("")}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-background/90 text-destructive hover:bg-destructive hover:text-white transition-colors shadow-md"
                    title="Remove image"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <input
                  type="text"
                  value={thumbnailUrl}
                  onChange={(e) => setThumbnailUrl(e.target.value)}
                  placeholder="Or paste image URL directly..."
                  className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs text-muted-foreground outline-none focus:border-primary"
                />
              </div>
            ) : (
              <div className="space-y-3">
                <div className="border-2 border-dashed border-border hover:border-primary/50 rounded-xl p-6 text-center transition-colors">
                  <ImageIcon className="w-8 h-8 mx-auto text-muted-foreground/50 mb-2" />
                  <p className="text-xs text-muted-foreground mb-3">
                    Upload an image or paste a URL
                  </p>
                  <label
                    htmlFor="thumbnail-upload"
                    className="inline-flex items-center gap-1.5 rounded-md bg-primary/10 hover:bg-primary/20 text-primary px-3 py-1.5 text-xs font-semibold cursor-pointer transition-colors"
                  >
                    {isUploading ? (
                      <>
                        <Upload className="w-3.5 h-3.5 animate-spin" />
                        <span>Uploading...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload Image</span>
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
                <input
                  type="text"
                  value={thumbnailUrl}
                  onChange={(e) => setThumbnailUrl(e.target.value)}
                  placeholder="Or paste image URL directly..."
                  className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs text-muted-foreground outline-none focus:border-primary"
                />
              </div>
            )}
          </div>

          <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
              <Tag className="w-4 h-4 text-primary" />
              Tags & Categories
            </h3>

            <div className="flex flex-wrap gap-1.5">
              {tags.map((tag) => (
                <span key={tag} className="blog-tag gap-1 text-xs">
                  <span>{tag}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-destructive transition-colors ml-0.5"
                    title="Remove tag"
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                placeholder="Add a tag..."
                className="flex-1 rounded-md border border-input bg-background px-3 py-1.5 text-xs outline-none focus:border-primary"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-3 py-1.5 bg-accent hover:bg-accent/80 text-foreground text-xs font-semibold rounded-md transition-colors"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

function SubmitButton({ isPublished }: { isPublished: boolean }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-primary py-2.5 px-4 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-all disabled:opacity-50"
    >
      {pending ? (
        <span>Saving...</span>
      ) : (
        <>
          <CheckCircle2 className="w-4 h-4" />
          <span>{isPublished ? "Publish Article" : "Save as Draft"}</span>
        </>
      )}
    </button>
  );
}
