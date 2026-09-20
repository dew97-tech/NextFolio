"use server";

import { auth } from "@/auth";
import { deleteBlobIfUnused, isOwnBlobUrl } from "./blob";

export async function discardUploadedBlob(url: string): Promise<boolean> {
  const session = await auth();
  if (!session?.user) return false;
  if (!isOwnBlobUrl(url)) return false;

  return deleteBlobIfUnused(url);
}
