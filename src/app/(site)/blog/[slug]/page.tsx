import prisma from "@/app/lib/prisma";
import { publishedDate } from "@/app/lib/post-dates";
import { getSiteUrl } from "@/app/lib/site";
import BlogReadingProgress from "@/app/ui/blog-reading-progress";
import { resumeData } from "@/data/resume";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";

export const revalidate = 86400;

const getPostBySlug = cache(async (slug: string) => {
  return prisma.post.findUnique({
    where: { slug },
  });
});

export async function generateStaticParams() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    select: { slug: true },
  });

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

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
      publishedTime: publishedDate(post).toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
      authors: ["David Dew Mallick"],
      images: post.thumbnail
        ? [{ url: post.thumbnail }]
        : [{ url: "/og.png", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: post.thumbnail ? [post.thumbnail] : ["/og.png"],
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
  const post = await getPostBySlug(slug);

  if (!post || !post.published) {
    notFound();
  }

  const relatedCandidates = await prisma.post.findMany({
    where: {
      published: true,
      slug: { not: slug },
    },
    take: 12,
    orderBy: [{ publishedAt: { sort: "desc", nulls: "last" } }, { date: "desc" }],
    select: {
      id: true,
      slug: true,
      title: true,
      description: true,
      date: true,
      publishedAt: true,
      readTime: true,
      thumbnail: true,
      tags: true,
    },
  });

  const morePosts = relatedCandidates
    .map((candidate) => ({
      candidate,
      shared: candidate.tags.filter((tag) => post.tags.includes(tag)).length,
    }))
    .sort(
      (a, b) =>
        b.shared - a.shared ||
        publishedDate(b.candidate).getTime() - publishedDate(a.candidate).getTime(),
    )
    .slice(0, 2)
    .map((entry) => entry.candidate);

  const siteUrl = getSiteUrl();
  const { personal } = resumeData;
  const articleUrl = `${siteUrl}/blog/${slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": articleUrl,
    },
    url: articleUrl,
    author: {
      "@type": "Person",
      name: personal.name,
      url: siteUrl,
      sameAs: [personal.github, personal.linkedin],
    },
    publisher: {
      "@type": "Person",
      name: personal.name,
      url: siteUrl,
    },
    datePublished: publishedDate(post).toISOString(),
    dateModified: post.updatedAt.toISOString(),
    articleSection: post.tags[0],
    keywords: post.keywords.join(", "),
    image: post.thumbnail || `${siteUrl}/og.png`,
  };

  return (
    <article className="pb-24 pt-10 md:pt-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <div className="mx-auto w-full max-w-[720px] px-5 md:px-8">
        <Link
          href="/blog"
          className="link-draw font-mono text-sm text-clay-text hover:text-ink-brown"
        >
          Back to blog
        </Link>

        <header className="mt-8">
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag: string) => (
                <Link key={tag} href={`/blog?query=${encodeURIComponent(tag)}`} className="blog-tag">
                  {tag}
                </Link>
              ))}
            </div>
          )}

          <h1 className="mt-5 font-serif text-[clamp(1.75rem,4vw,2.5rem)] leading-[1.12] tracking-[-0.02em] text-ink-brown">
            {post.title}
          </h1>

          {post.description && (
            <p className="mt-4 text-lg leading-relaxed text-ink-muted">
              {post.description}
            </p>
          )}

          <div className="mt-7 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-5">
            <p className="font-mono text-sm tabular-nums text-ink-faint">
              <time dateTime={publishedDate(post).toISOString()}>
                {publishedDate(post).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </time>
              <span aria-hidden="true"> · </span>
              {post.readTime}
            </p>

            <BlogReadingProgress title={post.title} />
          </div>
        </header>

        {post.thumbnail && (
          <div className="relative mt-10 h-[280px] w-full overflow-hidden rounded-lg border border-border bg-muted sm:h-[380px]">
            <Image
              src={post.thumbnail}
              alt=""
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 720px"
            />
          </div>
        )}

        <div
          className="article-content mt-10"
          dangerouslySetInnerHTML={{ __html: cleanArticleContent(post.content) }}
        />

        <div className="mt-16 border-t border-border pt-10">
          <div className="flex items-start gap-5">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded border border-border font-serif text-lg">
              DD
            </div>
            <div className="min-w-0">
              <h2 className="font-medium text-ink-brown">{personal.name}</h2>
              <p className="mt-0.5 text-sm text-ink-muted">{personal.role}</p>
              <p className="mt-3 max-w-[62ch] text-base leading-relaxed text-ink-muted">
                I build AI-driven SaaS infrastructure and backend systems with
                Laravel, AWS, and SQL, and write about the engineering decisions
                behind them.
              </p>
              <p className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">
                <a
                  href={personal.github}
                  target="_blank"
                  rel="noreferrer"
                  className="text-clay-text underline decoration-1 decoration-clay underline-offset-4 transition-colors hover:text-ink-brown"
                >
                  GitHub
                </a>
                <a
                  href={personal.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="text-clay-text underline decoration-1 decoration-clay underline-offset-4 transition-colors hover:text-ink-brown"
                >
                  LinkedIn
                </a>
                <a
                  href={`mailto:${personal.email}`}
                  className="text-clay-text underline decoration-1 decoration-clay underline-offset-4 transition-colors hover:text-ink-brown"
                >
                  Email
                </a>
              </p>
            </div>
          </div>
        </div>

        {morePosts.length > 0 && (
          <div className="mt-16 border-t border-border pt-10">
            <h2 className="text-xl font-semibold text-ink-brown">More posts</h2>
            <ul className="mt-6 divide-y divide-border">
              {morePosts.map((related) => (
                <li key={related.slug}>
                  <Link
                    href={`/blog/${related.slug}`}
                    className="group block py-5"
                  >
                    <p className="font-mono text-sm tabular-nums text-ink-faint">
                      {publishedDate(related).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                      <span aria-hidden="true"> · </span>
                      {related.readTime}
                    </p>
                    <p className="mt-1.5 font-medium text-ink-brown underline-offset-4 group-hover:underline">
                      {related.title}
                    </p>
                    <p className="mt-1 line-clamp-2 text-sm text-ink-muted">
                      {related.description}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </article>
  );
}
