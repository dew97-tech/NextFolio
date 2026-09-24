import prisma from "@/app/lib/prisma";
import BlogReadingProgress from "@/app/ui/blog-reading-progress";
import { resumeData } from "@/data/resume";
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
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
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
    image:
      post.thumbnail || "https://david-dew-mallick.vercel.app/og.png",
  };

  const { personal } = resumeData;

  return (
    <article className="pb-24 pt-10 md:pt-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
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
              <time dateTime={post.date.toISOString()}>
                {new Date(post.date).toLocaleDateString("en-US", {
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
                      {new Date(related.date).toLocaleDateString("en-US", {
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
