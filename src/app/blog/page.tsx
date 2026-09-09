import prisma from "@/app/lib/prisma";
import BlogPagination from "@/app/ui/blog-pagination";
import BlogSearch from "@/app/ui/blog-search";
import { ArrowRight, BookOpen, Calendar, Clock } from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Blog & Insights | David Dew Mallick",
  description: "Guides, deep dives, and tutorials on software architecture, SEO, performance optimization, and modern web applications.",
};

const POSTS_PER_PAGE = 6;

export default async function BlogPage({
  searchParams,
}: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const params = await searchParams;
  const query = params?.query || "";
  const currentPage = Number(params?.page) || 1;

  const where = {
    published: true,
    ...(query && {
      OR: [
        { title: { contains: query, mode: "insensitive" as const } },
        { description: { contains: query, mode: "insensitive" as const } },
        { tags: { hasSome: [query] } },
      ],
    }),
  };

  const totalPosts = await prisma.post.count({ where });
  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);

  const posts = await prisma.post.findMany({
    where,
    orderBy: { date: "desc" },
    skip: (currentPage - 1) * POSTS_PER_PAGE,
    take: POSTS_PER_PAGE,
  });

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-12 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
            <BookOpen className="h-3.5 w-3.5" />
            <span>Articles & Insights</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground mb-4">
            Engineering & Strategy
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl font-light">
            In-depth guides on building high-performance web systems, modern architecture patterns, and search engine optimization.
          </p>

          <div className="mt-8 max-w-xl">
            <Suspense fallback={<div className="h-11 bg-muted animate-pulse rounded-lg" />}>
              <BlogSearch />
            </Suspense>
          </div>
        </div>

        {posts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-12 text-center bg-card/50">
            <div className="mx-auto h-12 w-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground mb-4">
              <BookOpen className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-1">
              {query ? `No matching articles found` : "No articles published yet"}
            </h3>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              {query
                ? `We couldn't find anything matching "${query}". Try searching with different keywords or clearing your query.`
                : "Check back soon for upcoming guides and architectural deep-dives."}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post: any) => (
              <article
                key={post.slug}
                className="group rounded-2xl border border-border bg-card p-6 sm:p-7 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
              >
                <Link href={`/blog/${post.slug}`} className="block">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          <time dateTime={post.date.toISOString()}>
                            {new Date(post.date).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </time>
                        </span>
                        <span>•</span>
                        <span className="inline-flex items-center gap-1 font-medium text-primary">
                          <Clock className="h-3.5 w-3.5" />
                          {post.readTime}
                        </span>
                      </div>

                      <h2 className="text-xl sm:text-2xl font-bold text-foreground group-hover:text-primary transition-colors duration-200 tracking-tight mb-2.5">
                        {post.title}
                      </h2>

                      <p className="text-muted-foreground text-sm sm:text-base leading-relaxed line-clamp-2 mb-4">
                        {post.description}
                      </p>

                      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                        {post.tags.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {post.tags.slice(0, 3).map((tag: string) => (
                              <span key={tag} className="blog-tag">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        ) : <div />}

                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary group-hover:translate-x-1 transition-transform">
                          <span>Read article</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </span>
                      </div>
                    </div>

                    {post.thumbnail && (
                      <div className="relative w-full md:w-48 h-36 rounded-xl overflow-hidden bg-muted shrink-0 border border-border">
                        <Image
                          src={post.thumbnail}
                          alt={post.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 768px) 100vw, 192px"
                        />
                      </div>
                    )}
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-12 flex justify-center">
            <Suspense fallback={<div className="h-10 w-64 bg-muted animate-pulse rounded-md" />}>
              <BlogPagination totalPages={totalPages} />
            </Suspense>
          </div>
        )}
      </div>
    </div>
  );
}
