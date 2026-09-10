"use server";

import prisma from "@/app/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  buildGscInspectUrl,
  getPublishedPostUrl,
  publishUrlNotification,
} from "./indexing";

export interface IndexingActionState {
  message?: string;
}

export async function requestIndexing(
  postId: string,
  _prevState: IndexingActionState | null,
  _formData: FormData,
): Promise<IndexingActionState> {
  const session = await auth();
  if (!session?.user) {
    return { message: "Unauthorized" };
  }

  const post = await prisma.post.findUnique({
    where: { id: postId },
    select: { id: true, slug: true, published: true },
  });

  if (!post) {
    return { message: "Post not found" };
  }

  if (!post.published) {
    return { message: "Publish the post before requesting indexing" };
  }

  let url: string;
  let gscUrl: string;

  try {
    url = getPublishedPostUrl(post.slug);
    gscUrl = buildGscInspectUrl(url);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Indexing configuration error";
    return { message };
  }

  try {
    await publishUrlNotification(url);
    await prisma.post.update({
      where: { id: post.id },
      data: { indexedAt: new Date(), indexStatus: "submitted" },
    });
    revalidatePath("/admin");
  } catch (error) {
    console.error("Google Indexing API request failed:", error);
    await prisma.post
      .update({
        where: { id: post.id },
        data: { indexStatus: "error" },
      })
      .catch(() => undefined);
    revalidatePath("/admin");
  }

  redirect(gscUrl);
}
