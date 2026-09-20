"use server";

import prisma from "@/app/lib/prisma";
import { auth } from "@/auth";
import { deleteBlobIfUnused } from "@/app/lib/blob";
import {
  getPublishedPostUrl,
  isIndexingConfigured,
  publishUrlNotification,
} from "@/app/lib/google/indexing";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const PostSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().min(1),
  content: z.string().min(1),
  readTime: z.string().min(1),
  tags: z.string(),
  thumbnail: z.string().optional(),
  published: z.preprocess(
    (val) => val === true || val === "true" || val === "on" || val === 1 || val === "1",
    z.boolean(),
  ),
});

async function submitPostForIndexing(postId: string, slug: string) {
  try {
    await publishUrlNotification(getPublishedPostUrl(slug));
    await prisma.post.update({
      where: { id: postId },
      data: { indexedAt: new Date(), indexStatus: "submitted" },
    });
  } catch (error) {
    console.error("Automatic indexing request failed:", error);
    await prisma.post
      .update({ where: { id: postId }, data: { indexStatus: "error" } })
      .catch(() => undefined);
  }
}

export async function createPost(prevState: any, formData: FormData) {
  const session = await auth();
  if (!session?.user) {
    return { message: "Unauthorized" };
  }

  const validatedFields = PostSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    description: formData.get("description"),
    content: formData.get("content"),
    readTime: formData.get("readTime"),
    tags: formData.get("tags"),
    thumbnail: formData.get("thumbnail"),
    published: formData.get("published"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Post.",
    };
  }

  const { title, slug, description, content, readTime, tags, thumbnail, published } =
    validatedFields.data;

  const tagsArray = tags.split(",").map((tag) => tag.trim());

  let createdPost: { id: string; slug: string } | null = null;

  try {
    createdPost = await prisma.post.create({
      data: {
        title,
        slug,
        description,
        content,
        readTime,
        tags: tagsArray,
        thumbnail,
        published,
      },
      select: { id: true, slug: true },
    });
  } catch (error) {
    return { message: "Database Error: Failed to Create Post." };
  }

  if (published && createdPost && isIndexingConfigured()) {
    await submitPostForIndexing(createdPost.id, createdPost.slug);
  }

  revalidatePath("/blog");
  revalidatePath("/blog/[slug]", "page");
  revalidatePath("/sitemap.xml");
  revalidatePath("/admin");
  redirect("/admin");
}

export async function updatePost(
  id: string,
  prevState: any,
  formData: FormData,
) {
  const session = await auth();
  if (!session?.user) {
    return { message: "Unauthorized" };
  }

  const validatedFields = PostSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    description: formData.get("description"),
    content: formData.get("content"),
    readTime: formData.get("readTime"),
    tags: formData.get("tags"),
    thumbnail: formData.get("thumbnail"),
    published: formData.get("published"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Update Post.",
    };
  }

  const { title, slug, description, content, readTime, tags, thumbnail, published } =
    validatedFields.data;

  const tagsArray = tags.split(",").map((tag) => tag.trim());

  let previousThumbnail: string | null = null;
  let wasPublished = false;
  let previousIndexStatus: string | null = null;

  try {
    const existing = await prisma.post.findUnique({
      where: { id },
      select: { thumbnail: true, published: true, indexStatus: true },
    });
    previousThumbnail = existing?.thumbnail ?? null;
    wasPublished = existing?.published ?? false;
    previousIndexStatus = existing?.indexStatus ?? null;

    await prisma.post.update({
      where: { id },
      data: {
        title,
        slug,
        description,
        content,
        readTime,
        tags: tagsArray,
        thumbnail,
        published,
      },
    });
  } catch (error) {
    return { message: "Database Error: Failed to Update Post." };
  }

  if (
    typeof thumbnail === "string" &&
    previousThumbnail &&
    previousThumbnail !== thumbnail
  ) {
    await deleteBlobIfUnused(previousThumbnail);
  }

  if (
    published &&
    isIndexingConfigured() &&
    (previousIndexStatus !== "submitted" || !wasPublished)
  ) {
    await submitPostForIndexing(id, slug);
  }

  revalidatePath("/blog");
  revalidatePath("/blog/[slug]", "page");
  revalidatePath("/sitemap.xml");
  revalidatePath("/admin");
  redirect("/admin");
}

export async function deletePost(id: string) {
  const session = await auth();
  if (!session?.user) {
    return;
  }

  try {
    const post = await prisma.post.findUnique({
      where: { id },
      select: { slug: true, thumbnail: true },
    });

    await prisma.post.delete({
      where: { id },
    });
    if (post?.thumbnail) {
      await deleteBlobIfUnused(post.thumbnail);
    }
    if (post) {
      revalidatePath(`/blog/${post.slug}`);
    }
    revalidatePath("/blog");
    revalidatePath("/blog/[slug]", "page");
    revalidatePath("/sitemap.xml");
    revalidatePath("/admin");
  } catch (error) {
    console.error("Failed to delete post:", error);
  }
}
