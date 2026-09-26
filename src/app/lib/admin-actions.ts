"use server";

import { runBlogGeneration } from "@/app/lib/ai/generate-blog";
import prisma from "@/app/lib/prisma";
import { auth } from "@/auth";
import { deleteBlobIfUnused } from "@/app/lib/blob";
import {
  getPublishedPostUrl,
  isIndexingConfigured,
  publishUrlNotification,
} from "@/app/lib/google/indexing";
import { Prisma } from "@prisma/client";
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

const EM_DASH = String.fromCharCode(0x2014);
const EN_DASH = String.fromCharCode(0x2013);

function normalizeDashes(text: string) {
  return text
    .replaceAll(` ${EM_DASH} `, ", ")
    .replaceAll(` ${EN_DASH} `, ", ")
    .replaceAll(EM_DASH, "-")
    .replaceAll(EN_DASH, "-");
}

type PostFormState =
  | {
      message?: string;
      errors?: Record<string, string[] | undefined>;
    }
  | null
  | undefined;

const SLUG_CONFLICT_ERRORS = {
  slug: ["A post with this slug already exists. Please choose a unique slug."],
};

function isUniqueConstraintError(error: unknown) {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  );
}

function revalidatePostSurfaces(...slugs: string[]) {
  revalidatePath("/blog");
  revalidatePath("/admin");
  revalidatePath("/sitemap.xml");
  revalidatePath("/feed.xml");

  for (const slug of slugs) {
    if (slug) revalidatePath(`/blog/${slug}`);
  }
}

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

export async function createPost(prevState: PostFormState, formData: FormData) {
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

  const tagsArray = tags
    .split(",")
    .map((tag) => normalizeDashes(tag.trim()))
    .filter(Boolean);

  const existingPost = await prisma.post.findUnique({
    where: { slug },
    select: { id: true },
  });

  if (existingPost) {
    return {
      errors: SLUG_CONFLICT_ERRORS,
      message: "Slug Conflict: Failed to Create Post.",
    };
  }

  let createdPost: { id: string; slug: string } | null = null;

  try {
    createdPost = await prisma.post.create({
      data: {
        title: normalizeDashes(title),
        slug,
        description: normalizeDashes(description),
        content: normalizeDashes(content),
        readTime,
        tags: tagsArray,
        thumbnail,
        published,
      },
      select: { id: true, slug: true },
    });
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return {
        errors: SLUG_CONFLICT_ERRORS,
        message: "Slug Conflict: Failed to Create Post.",
      };
    }
    return { message: "Database Error: Failed to Create Post." };
  }

  if (published && createdPost && isIndexingConfigured()) {
    await submitPostForIndexing(createdPost.id, createdPost.slug);
  }

  revalidatePostSurfaces(slug);
  redirect("/admin");
}

export async function updatePost(
  id: string,
  prevState: PostFormState,
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

  const tagsArray = tags
    .split(",")
    .map((tag) => normalizeDashes(tag.trim()))
    .filter(Boolean);

  const previous = await prisma.post.findUnique({
    where: { id },
    select: { slug: true, thumbnail: true, published: true, indexStatus: true },
  });

  if (!previous) {
    return { message: "Database Error: Failed to Update Post." };
  }

  try {
    await prisma.post.update({
      where: { id },
      data: {
        title: normalizeDashes(title),
        slug,
        description: normalizeDashes(description),
        content: normalizeDashes(content),
        readTime,
        tags: tagsArray,
        thumbnail,
        published,
      },
    });
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return {
        errors: SLUG_CONFLICT_ERRORS,
        message: "Slug Conflict: Failed to Update Post.",
      };
    }
    return { message: "Database Error: Failed to Update Post." };
  }

  if (
    typeof thumbnail === "string" &&
    previous.thumbnail &&
    previous.thumbnail !== thumbnail
  ) {
    await deleteBlobIfUnused(previous.thumbnail);
  }

  if (
    published &&
    isIndexingConfigured() &&
    (previous.indexStatus !== "submitted" || !previous.published)
  ) {
    await submitPostForIndexing(id, slug);
  }

  revalidatePostSurfaces(previous.slug, slug);
  redirect("/admin");
}

export async function deletePost(id: string) {
  const session = await auth();
  if (!session?.user) {
    return;
  }

  const existing = await prisma.post.findUnique({
    where: { id },
    select: { slug: true, thumbnail: true },
  });

  if (!existing) {
    return;
  }

  try {
    await prisma.post.delete({
      where: { id },
    });

    if (existing.thumbnail) {
      await deleteBlobIfUnused(existing.thumbnail);
    }

    revalidatePostSurfaces(existing.slug);
  } catch (error) {
    console.error("Failed to delete post:", error);
  }
}

export interface GenerationActionState {
  status: "success" | "skipped" | "failed";
  message: string;
}

export async function triggerGeneration(
  _prevState: GenerationActionState | null,
  _formData: FormData,
): Promise<GenerationActionState> {
  const session = await auth();
  if (!session?.user) {
    return { status: "failed", message: "Unauthorized" };
  }

  const result = await runBlogGeneration({ force: true });

  revalidatePostSurfaces();

  if (result.status === "success") {
    return {
      status: "success",
      message: `Draft created: ${result.slug} (${result.wordCount} words)`,
    };
  }

  if (result.status === "skipped") {
    return { status: "skipped", message: result.detail };
  }

  return { status: "failed", message: result.error.slice(0, 240) };
}
