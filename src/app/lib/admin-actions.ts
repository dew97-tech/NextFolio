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
  tags: z.string(), // Comma separated
  thumbnail: z.string().optional(),
  published: z.coerce.boolean(),
});

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

  try {
    await prisma.post.create({
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
    return { message: "Database Error: Failed to Create Post." };
  }

  revalidatePath("/blog");
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

  try {
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

  revalidatePath("/blog");
  revalidatePath("/admin");
  redirect("/admin");
}

export async function deletePost(id: string) {
  const session = await auth();
  if (!session?.user) {
    // return { message: "Unauthorized" };
    return;
  }

  try {
    await prisma.post.delete({
      where: { id },
    });
    revalidatePath("/blog");
    revalidatePath("/admin");
  } catch (error) {
    // return { message: "Database Error: Failed to Delete Post." };
    console.error("Failed to delete post:", error);
  }
}
