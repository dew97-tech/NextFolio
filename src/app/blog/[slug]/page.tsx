import prisma from "@/app/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";


export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await prisma.post.findUnique({
    where: { slug },
  });

  if (!post || !post.published) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    author: {
      "@type": "Person",
      name: "David Dew Mallick",
    },
    datePublished: post.date.toISOString(),
    image: post.thumbnail || "https://david-dew-mallick.vercel.app/og-image.jpg",
  };

  return (
    <article className="container mx-auto px-4 py-12 max-w-3xl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* Header */}
      <header className="mb-8">
        <Link
          href="/blog"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-4"
        >
          ← Back to Blog
        </Link>
        <h1 className="text-4xl font-bold mb-4 tracking-tight">{post.title}</h1>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <time dateTime={post.date.toISOString()}>
            {new Date(post.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </time>
          <span>•</span>
          <span>{post.readTime}</span>
        </div>
        {post.tags.length > 0 && (
          <div className="flex gap-2 mt-4">
            {post.tags.map((tag: string) => (
              <span
                key={tag}
                className="bg-secondary/20 px-3 py-1 rounded-md text-xs font-medium text-secondary-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </header>

      {/* HTML Content */}
      <div 
        className="prose prose-lg prose-slate dark:prose-invert max-w-none
          prose-headings:font-bold prose-headings:tracking-tight
          prose-h1:text-3xl prose-h1:mt-8 prose-h1:mb-4
          prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4
          prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3
          prose-h4:text-lg prose-h4:mt-4 prose-h4:mb-2
          prose-p:text-base prose-p:leading-7 prose-p:mb-4
          prose-a:text-primary prose-a:no-underline hover:prose-a:underline
          prose-strong:font-semibold prose-strong:text-foreground
          prose-ul:my-4 prose-ul:list-disc prose-ul:pl-6
          prose-ol:my-4 prose-ol:list-decimal prose-ol:pl-6
          prose-li:my-2
          prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:my-4
          prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-mono
          prose-pre:bg-muted prose-pre:p-4 prose-pre:rounded-lg prose-pre:overflow-x-auto
          prose-table:w-full prose-table:my-6 prose-table:border-collapse
          prose-th:border prose-th:border-border prose-th:bg-muted prose-th:p-3 prose-th:text-left prose-th:font-semibold
          prose-td:border prose-td:border-border prose-td:p-3
          prose-thead:bg-muted/50
          prose-tbody:divide-y prose-tbody:divide-border
          prose-img:rounded-lg prose-img:my-6"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </article>
  );
}
