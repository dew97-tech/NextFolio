"use server";

import prisma from "@/app/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { buildGscInspectUrl, getPublishedPostUrl } from "./indexing";

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

  let gscUrl: string;

  try {
    gscUrl = buildGscInspectUrl(getPublishedPostUrl(post.slug));
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Search Console is not configured";
    return { message };
  }

  await prisma.post.update({
    where: { id: post.id },
    data: { indexedAt: new Date(), indexStatus: "requested" },
  });

  revalidatePath("/admin");
  redirect(gscUrl);
}
