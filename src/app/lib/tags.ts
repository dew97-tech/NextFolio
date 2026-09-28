import prisma from "@/app/lib/prisma";
import { slugify } from "./slug";

const MAX_TAG_WORDS = 3;
const MAX_TAG_CHARS = 32;

export function displayTag(tag: string): string {
  const trimmed = tag.trim();
  const words = trimmed.split(/\s+/);
  let label = words.slice(0, MAX_TAG_WORDS).join(" ");

  if (label.length > MAX_TAG_CHARS) {
    label = label.slice(0, MAX_TAG_CHARS).replace(/\s+\S*$/, "");
  }

  if (words.length > MAX_TAG_WORDS || label.length < trimmed.length) {
    return `${label}...`;
  }

  return label;
}

export type TagSummary = {
  slug: string;
  tag: string;
  variants: string[];
  count: number;
  lastModified?: Date;
};

export async function getTagSummaries(): Promise<TagSummary[]> {
  const posts = await prisma.post.findMany({
    where: { published: true },
    select: { tags: true, updatedAt: true },
  });

  const map = new Map<
    string,
    {
      variants: Map<string, number>;
      count: number;
      lastModified?: Date;
    }
  >();

  for (const post of posts) {
    const seenInPost = new Set<string>();
    for (const tag of post.tags) {
      if (seenInPost.has(tag)) continue;
      seenInPost.add(tag);

      const slug = slugify(tag);
      if (!slug) continue;

      const entry = map.get(slug) ?? {
        variants: new Map<string, number>(),
        count: 0,
        lastModified: undefined,
      };

      entry.variants.set(tag, (entry.variants.get(tag) ?? 0) + 1);
      entry.count += 1;
      if (!entry.lastModified || post.updatedAt > entry.lastModified) {
        entry.lastModified = post.updatedAt;
      }

      map.set(slug, entry);
    }
  }

  return [...map.entries()]
    .map(([slug, entry]) => {
      const variants = [...entry.variants.entries()]
        .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
        .map(([value]) => value);

      return {
        slug,
        tag: variants[0],
        variants,
        count: entry.count,
        lastModified: entry.lastModified,
      };
    })
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}
