"use server";

import prisma from "@/app/lib/prisma";
import { auth } from "@/auth";
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

/**
 * Purges every cached surface a published post can appear on. Without this the
 * 24h ISR window on /blog/[slug] and the CDN-cached sitemap/feed would keep
 * serving stale content after an edit.
 */
function revalidatePostSurfaces(...slugs: string[]) {
  revalidatePath("/blog");
  revalidatePath("/admin");
  revalidatePath("/sitemap.xml");
  revalidatePath("/feed.xml");

  for (const slug of slugs) {
    if (slug) revalidatePath(`/blog/${slug}`);
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

  try {
    await prisma.post.create({
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
        message: "Slug Conflict: Failed to Create Post.",
      };
    }
    return { message: "Database Error: Failed to Create Post." };
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
    select: { slug: true },
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

  // Revalidate both the old and the new slug: a renamed post must not leave a
  // stale page behind at its previous URL.
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
    select: { slug: true },
  });

  if (!existing) {
    return;
  }

  try {
    await prisma.post.delete({
      where: { id },
    });
    revalidatePostSurfaces(existing.slug);
  } catch (error) {
    console.error("Failed to delete post:", error);
  }
}
