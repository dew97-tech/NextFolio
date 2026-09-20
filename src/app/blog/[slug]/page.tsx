import prisma from "@/app/lib/prisma";
import BlogReadingProgress from "@/app/ui/blog-reading-progress";
import { ArrowLeft, Calendar, Clock, Github, Linkedin, Mail } from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.post.findUnique({
    where: { slug },
  });

  if (!post || !post.published) {
    return {
      title: "Post not found",
    };
  }

  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: `/blog/${slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      url: `/blog/${slug}`,
      publishedTime: post.date.toISOString(),
      authors: ["David Dew Mallick"],
      images: post.thumbnail
        ? [{ url: post.thumbnail }]
        : [{ url: "/og.png", width: 1200, height: 630 }],
    },
  };
}

function cleanArticleContent(rawHtml: string): string {
  if (!rawHtml) return "";
  return rawHtml
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "");
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await prisma.post.findUnique({
    where: { slug },
  });

  if (!post || !post.published) {
    notFound();
  }

  const morePosts = await prisma.post.findMany({
    where: {
      published: true,
      slug: { not: slug },
    },
    take: 2,
    orderBy: { date: "desc" },
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    author: {
      "@type": "Person",
      name: "David Dew Mallick",
      url: "https://david-dew-mallick.vercel.app",
    },
    datePublished: post.date.toISOString(),
    image: post.thumbnail || "https://david-dew-mallick.vercel.app/og-image.jpg",
  };

  return (
    <article className="min-h-screen pt-24 pb-20 px-4 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="container mx-auto max-w-3xl">
        <div className="mb-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to All Articles</span>
          </Link>
        </div>

        <header className="mb-10 pb-8 border-b border-border/60">
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((tag: string) => (
                <span key={tag} className="blog-tag">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground leading-[1.15] mb-4">
            {post.title}
          </h1>

          {post.description && (
            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed mb-6 font-light">
              {post.description}
            </p>
          )}

          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-border/40">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-full bg-gradient-to-tr from-primary to-cyan-500 flex items-center justify-center text-white font-bold text-sm shadow-md ring-2 ring-background">
                DD
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">David Dew Mallick</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <time dateTime={post.date.toISOString()}>
                      {new Date(post.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </time>
                  </span>
                  <span>•</span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {post.readTime}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <BlogReadingProgress title={post.title} />
            </div>
          </div>
        </header>

        {post.thumbnail && (
          <div className="mb-10 rounded-2xl overflow-hidden border border-border bg-muted shadow-sm">
            <div className="relative w-full h-[320px] sm:h-[420px]">
              <Image
                src={post.thumbnail}
                alt={post.title}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 768px"
              />
            </div>
          </div>
        )}

        <div
          className="article-content leading-relaxed"
          dangerouslySetInnerHTML={{ __html: cleanArticleContent(post.content) }}
        />

        <div className="mt-16 pt-8 border-t border-border">
          <div className="rounded-2xl p-6 sm:p-8 bg-card border border-border shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="h-20 w-20 rounded-full bg-gradient-to-tr from-primary via-indigo-500 to-cyan-500 flex items-center justify-center text-white font-extrabold text-2xl shadow-lg shrink-0">
              DD
            </div>
            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div>
                  <h3 className="text-lg font-bold text-foreground">David Dew Mallick</h3>
                  <p className="text-xs font-medium text-primary">Software Engineer & Systems Architect</p>
                </div>
                <div className="flex items-center justify-center sm:justify-start gap-3 text-muted-foreground">
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-md hover:text-primary hover:bg-accent transition-colors"
                    title="GitHub"
                  >
                    <Github className="h-4 w-4" />
                  </a>
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-md hover:text-primary hover:bg-accent transition-colors"
                    title="LinkedIn"
                  >
                    <Linkedin className="h-4 w-4" />
                  </a>
                  <a
                    href="mailto:contact@daviddew.dev"
                    className="p-1.5 rounded-md hover:text-primary hover:bg-accent transition-colors"
                    title="Email"
                  >
                    <Mail className="h-4 w-4" />
                  </a>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Building resilient web applications, high-performance architectures, and optimized digital experiences. Specializing in Next.js, TypeScript, PostgreSQL, and SEO systems.
              </p>
            </div>
          </div>
        </div>

        {morePosts.length > 0 && (
          <div className="mt-16 pt-12 border-t border-border">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold tracking-tight text-foreground">
                More Articles
              </h2>
              <Link
                href="/blog"
                className="text-sm font-medium text-primary hover:underline"
              >
                View all articles →
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 gap-6">
              {morePosts.map((related: any) => (
                <Link
                  key={related.slug}
                  href={`/blog/${related.slug}`}
                  className="group rounded-xl border border-border bg-card p-5 hover:border-primary/50 hover:shadow-md transition-all duration-200 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                      <span>{new Date(related.date).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>{related.readTime}</span>
                    </div>
                    <h3 className="font-bold text-base text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-2">
                      {related.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {related.description}
                    </p>
                  </div>
                  {related.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-4">
                      {related.tags.slice(0, 2).map((t: string) => (
                        <span key={t} className="blog-tag">
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
