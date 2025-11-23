import prisma from "@/app/lib/prisma";
import BlogPagination from "@/app/ui/blog-pagination";
import BlogSearch from "@/app/ui/blog-search";
import { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Blog | David Dew Mallick",
  description: "Insights and guides on software engineering, SEO, and web development.",
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

  // Build where clause for search
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

  // Get total count for pagination
  const totalPosts = await prisma.post.count({ where });
  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);

  // Get posts for current page
  const posts = await prisma.post.findMany({
    where,
    orderBy: { date: "desc" },
    skip: (currentPage - 1) * POSTS_PER_PAGE,
    take: POSTS_PER_PAGE,
  });

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4 tracking-tight">Blog</h1>
        <Suspense fallback={<div className="h-10 bg-muted animate-pulse rounded-md" />}>
          <BlogSearch />
        </Suspense>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            {query ? `No posts found for "${query}"` : "No blog posts yet"}
          </p>
        </div>
      ) : (
        <>
          <div className="grid gap-8 mb-8">
            {posts.map((post: any) => (
              <article
                key={post.slug}
                className="group border border-border rounded-lg p-6 hover:bg-accent/50 transition-colors"
              >
                <Link href={`/blog/${post.slug}`} className="block">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                    <h2 className="text-2xl font-semibold group-hover:text-primary transition-colors">
                      {post.title}
                    </h2>
                    <span className="text-sm text-muted-foreground mt-2 md:mt-0">
                      {new Date(post.date).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-muted-foreground mb-4 line-clamp-2">
                    {post.description}
                  </p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-primary font-medium">{post.readTime}</span>
                    <div className="flex gap-2">
                      {post.tags.slice(0, 3).map((tag: string) => (
                        <span
                          key={tag}
                          className="bg-secondary/20 px-2 py-1 rounded-md text-xs text-secondary-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <Suspense fallback={<div className="h-10 w-64 bg-muted animate-pulse rounded-md" />}>
                <BlogPagination totalPages={totalPages} />
              </Suspense>
            </div>
          )}
        </>
      )}
    </div>
  );
}
