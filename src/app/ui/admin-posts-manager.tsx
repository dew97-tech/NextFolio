"use client";

import DeletePostButton from "@/app/ui/delete-post-button";
import IndexPostButton from "@/app/ui/index-post-button";
import {
  CheckCircle2,
  Clock,
  ExternalLink,
  Eye,
  FileEdit,
  FileText,
  Image as ImageIcon,
  Pencil,
  Plus,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

interface PostItem {
  id: string;
  slug: string;
  title: string;
  description: string;
  published: boolean;
  date: string | Date;
  readTime: string;
  tags: string[];
  thumbnail?: string | null;
  source?: string;
  aiModel?: string | null;
  topic?: string | null;
  keywords?: string[];
  indexedAt?: string | null;
  indexStatus?: string | null;
}

export default function AdminPostsManager({
  initialPosts,
}: {
  initialPosts: PostItem[];
}) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft">("all");

  const stats = useMemo(() => {
    return {
      total: initialPosts.length,
      published: initialPosts.filter((p) => p.published).length,
      drafts: initialPosts.filter((p) => !p.published).length,
    };
  }, [initialPosts]);

  const filteredPosts = useMemo(() => {
    return initialPosts.filter((post) => {
      if (statusFilter === "published" && !post.published) return false;
      if (statusFilter === "draft" && post.published) return false;

      if (!query.trim()) return true;

      const q = query.toLowerCase();
      const matchesTitle = post.title.toLowerCase().includes(q);
      const matchesDesc = post.description.toLowerCase().includes(q);
      const matchesTags = post.tags.some((t) => t.toLowerCase().includes(q));

      return matchesTitle || matchesDesc || matchesTags;
    });
  }, [initialPosts, query, statusFilter]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            Articles & Publications
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Create, edit, curate, and optimize your technical blog posts.
          </p>
        </div>

        <Link
          href="/admin/new"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-all active:scale-95"
        >
          <Plus className="h-4 w-4" />
          <span>Write New Article</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-xs relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Total Articles
            </span>
            <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <FileText className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold tracking-tight text-foreground">
              {stats.total}
            </span>
            <span className="text-xs text-muted-foreground">in studio</span>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-xs relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Live & Published
            </span>
            <div className="h-9 w-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold tracking-tight text-foreground">
              {stats.published}
            </span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">visible to public</span>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-xs relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Work In Progress
            </span>
            <div className="h-9 w-9 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <FileEdit className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold tracking-tight text-foreground">
              {stats.drafts}
            </span>
            <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">drafts</span>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-4 bg-muted/20">
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-muted/60 border border-border/50 text-xs font-medium w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setStatusFilter("all")}
              className={`px-3.5 py-1.5 rounded-lg transition-all ${
                statusFilter === "all"
                  ? "bg-card text-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              All ({stats.total})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("published")}
              className={`px-3.5 py-1.5 rounded-lg transition-all ${
                statusFilter === "published"
                  ? "bg-card text-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Published ({stats.published})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("draft")}
              className={`px-3.5 py-1.5 rounded-lg transition-all ${
                statusFilter === "draft"
                  ? "bg-card text-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Drafts ({stats.drafts})
            </button>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by title, tag, or topic..."
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/30 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                <th className="py-3.5 px-5">Article</th>
                <th className="py-3.5 px-5">Status</th>
                <th className="py-3.5 px-5">Date</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredPosts.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-16 text-center">
                    <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
                      <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground mb-3">
                        <FileText className="h-6 w-6" />
                      </div>
                      <p className="font-semibold text-foreground text-base">
                        {query ? "No matching articles" : "No articles in this view"}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1 mb-4">
                        {query
                          ? `No articles match "${query}". Try adjusting your keywords.`
                          : "Ready to share knowledge? Start writing your next article."}
                      </p>
                      <Link
                        href="/admin/new"
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-all"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        <span>Write Article</span>
                      </Link>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredPosts.map((post) => (
                  <tr
                    key={post.id}
                    className="hover:bg-muted/20 transition-colors group"
                  >
                    <td className="py-4 px-5">
                      <div className="flex items-start gap-4">
                        <div className="relative h-14 w-20 rounded-lg overflow-hidden bg-muted border border-border shrink-0">
                          {post.thumbnail ? (
                            <Image
                              src={post.thumbnail}
                              alt={post.title}
                              fill
                              className="object-cover"
                              sizes="80px"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-muted-foreground/50">
                              <ImageIcon className="h-5 w-5" />
                            </div>
                          )}
                        </div>

                        <div className="min-w-0">
                          <Link
                            href={`/admin/edit/${post.id}`}
                            className="font-bold text-sm sm:text-base text-foreground group-hover:text-primary transition-colors line-clamp-1"
                          >
                            {post.title}
                          </Link>
                          <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5 max-w-xl">
                            {post.description || "No excerpt provided"}
                          </p>
                          <div className="flex flex-wrap items-center gap-2 mt-2">
                            <span className="text-[11px] font-mono text-muted-foreground/80">
                              /{post.slug}
                            </span>
                            {post.source === "ai" && (
                              <span
                                className="inline-flex items-center rounded-full border border-violet-500/30 bg-violet-500/10 px-2 py-0.5 text-[10px] font-semibold text-violet-600 dark:text-violet-400"
                                title={`AI draft${post.aiModel ? ` · ${post.aiModel}` : ""}${post.topic ? ` · ${post.topic}` : ""}`}
                              >
                                AI{post.aiModel ? ` · ${post.aiModel}` : ""}
                              </span>
                            )}
                            {post.keywords && post.keywords.length > 0 && (
                              <span
                                className="inline-flex items-center rounded-full border border-sky-500/30 bg-sky-500/10 px-2 py-0.5 text-[10px] font-semibold text-sky-600 dark:text-sky-400"
                                title={`Primary keyword: ${post.keywords[0]}`}
                              >
                                KW: {post.keywords[0]}
                              </span>
                            )}
                            {post.tags.slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className="blog-tag text-[10px] py-0.5 px-2"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-5 whitespace-nowrap">
                      {post.published ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          <span>Published</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                          <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                          <span>Draft</span>
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-5 whitespace-nowrap text-xs text-muted-foreground">
                      <div>
                        {new Date(post.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </div>
                      <div className="text-[11px] text-muted-foreground/70 mt-0.5">
                        {post.readTime}
                      </div>
                    </td>

                    <td className="py-4 px-5 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        {post.published && (
                          <Link
                            href={`/blog/${post.slug}`}
                            target="_blank"
                            className="inline-flex items-center justify-center h-8 w-8 rounded-lg border border-border bg-card text-muted-foreground hover:text-primary hover:bg-accent transition-colors"
                            title="View published article"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                        )}

                        <Link
                          href={`/admin/edit/${post.id}`}
                          className="inline-flex items-center justify-center gap-1 px-3 h-8 rounded-lg border border-border bg-card text-xs font-medium text-foreground hover:bg-accent hover:text-primary transition-colors"
                          title="Edit article"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          <span>Edit</span>
                        </Link>

                        {post.published && (
                          <IndexPostButton
                            postId={post.id}
                            indexedAt={post.indexedAt}
                            indexStatus={post.indexStatus}
                          />
                        )}

                        <DeletePostButton postId={post.id} />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
