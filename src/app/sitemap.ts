import prisma from "@/app/lib/prisma";
import { getSiteUrl } from "@/app/lib/site";
import { MetadataRoute } from "next";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { date: "desc" },
    select: { slug: true, updatedAt: true },
  });

  const blogEntries = posts.map((post) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const newestUpdate = posts[0]?.updatedAt ?? new Date();

  return [
    {
      url: siteUrl,
      lastModified: newestUpdate,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${siteUrl}/blog`,
      lastModified: newestUpdate,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...blogEntries,
  ];
}
