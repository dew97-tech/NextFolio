import prisma from "@/app/lib/prisma";
import { getSiteUrl } from "@/app/lib/site";
import { caseStudies } from "@/data/case-studies";
import { MetadataRoute } from "next";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();

  const workEntries: MetadataRoute.Sitemap = caseStudies.map((caseStudy) => ({
    url: `${siteUrl}${caseStudy.href}`,
    lastModified: new Date(),
    changeFrequency: "yearly" as const,
    priority: 0.9,
  }));

  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${siteUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...workEntries,
  ];

  try {
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

    const revisions: MetadataRoute.Sitemap = workEntries.map((entry) => ({
      ...entry,
      lastModified: newestUpdate,
    }));

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
      ...revisions,
      ...blogEntries,
    ];
  } catch (error) {
    console.error("Failed to fetch posts for sitemap, serving static routes only:", error);
    return staticEntries;
  }
}
