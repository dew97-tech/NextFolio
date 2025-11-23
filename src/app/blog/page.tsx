import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Blog | David Dew Mallick",
  description: "Insights and guides on software engineering, SEO, and web development.",
};


export default function BlogPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8 tracking-tight">Blog</h1>
      <div className="grid gap-8">
        {blogPosts.map((post) => (
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
                  {post.date}
                </span>
              </div>
              <p className="text-muted-foreground mb-4 line-clamp-2">
                {post.description}
              </p>
              <div className="flex items-center gap-4 text-sm">
                <span className="text-primary font-medium">{post.readTime}</span>
                <div className="flex gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-secondary px-2 py-1 rounded-md text-xs text-secondary-foreground"
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
    </div>
  );
}
