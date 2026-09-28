import prisma from "@/app/lib/prisma";
import { getSiteUrl } from "@/app/lib/site";
import { loadTagSummaries } from "@/app/lib/tags";
import { caseStudies } from "@/data/case-studies";
import { MetadataRoute } from "next";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();

  const workEntries: MetadataRoute.Sitemap = caseStudies.map((caseStudy) => ({
    url: `${siteUrl}${caseStudy.href}`,
    changeFrequency: "yearly" as const,
    priority: 0.9,
  }));

  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      changeFrequency: "monthly" as const,
      priority: 1,
    },
    ...workEntries,
  ];

  try {
    const posts = await prisma.post.findMany({
      where: { published: true },
      orderBy: { updatedAt: "desc" },
      select: { slug: true, updatedAt: true },
    });

    const newestPostUpdate = posts[0]?.updatedAt;

    const tagEntries: MetadataRoute.Sitemap = (await loadTagSummaries())
      .filter((summary) => summary.count >= 3)
      .map((summary) => ({
        url: `${siteUrl}/blog/tag/${summary.slug}`,
        lastModified: summary.lastModified,
        changeFrequency: "weekly" as const,
        priority: 0.6,
      }));

    return [
      {
        url: siteUrl,
        changeFrequency: "monthly" as const,
        priority: 1,
      },
      {
        url: `${siteUrl}/blog`,
        lastModified: newestPostUpdate,
        changeFrequency: "weekly" as const,
        priority: 0.9,
      },
      ...workEntries,
      ...posts.map((post) => ({
        url: `${siteUrl}/blog/${post.slug}`,
        lastModified: post.updatedAt,
        changeFrequency: "monthly" as const,
        priority: 0.8,
      })),
      ...tagEntries,
    ];
  } catch (error) {
    console.error("Failed to fetch posts for sitemap, serving static routes only:", error);
    return [
      ...staticEntries,
      {
        url: `${siteUrl}/blog`,
        changeFrequency: "weekly" as const,
        priority: 0.9,
      },
    ];
  }
}
