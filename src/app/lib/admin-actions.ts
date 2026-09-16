"use server";

import prisma from "@/app/lib/prisma";
import { auth } from "@/auth";
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
  } catch {
    return { message: "Database Error: Failed to Create Post." };
  }

  revalidatePath("/blog");
  revalidatePath("/admin");
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
  } catch {
    return { message: "Database Error: Failed to Update Post." };
  }

  revalidatePath("/blog");
  revalidatePath("/admin");
  redirect("/admin");
}

export async function deletePost(id: string) {
  const session = await auth();
  if (!session?.user) {
    return;
  }

  try {
    await prisma.post.delete({
      where: { id },
    });
    revalidatePath("/blog");
    revalidatePath("/admin");
  } catch (error) {
    console.error("Failed to delete post:", error);
  }
}
