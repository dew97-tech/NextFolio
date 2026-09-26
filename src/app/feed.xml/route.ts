import prisma from "@/app/lib/prisma";
import { publishedDate } from "@/app/lib/post-dates";
import { getSiteUrl } from "@/app/lib/site";

export const revalidate = 3600;

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export async function GET() {
  const siteUrl = getSiteUrl();

  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: [{ publishedAt: { sort: "desc", nulls: "last" } }, { date: "desc" }],
    take: 20,
    select: {
      title: true,
      slug: true,
      description: true,
      date: true,
      publishedAt: true,
    },
  });

  const items = posts
    .map((post) => {
      const url = `${siteUrl}/blog/${post.slug}`;

      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${escapeXml(post.description)}</description>
      <pubDate>${publishedDate(post).toUTCString()}</pubDate>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>David Dew Mallick</title>
    <link>${siteUrl}</link>
    <description>Notes on building web applications: Next.js, Laravel, databases, and the automation around them.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}
