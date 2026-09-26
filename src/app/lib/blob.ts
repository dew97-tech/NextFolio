import { del } from "@vercel/blob";
import prisma from "@/app/lib/prisma";

function getStoreHostname(): string | null {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) return null;

  const storeId = token.split("_")[3];
  if (!storeId) return null;

  return `${storeId.toLowerCase()}.public.blob.vercel-storage.com`;
}

export function isOwnBlobUrl(url: string): boolean {
  const hostname = getStoreHostname();
  if (!hostname) return false;

  try {
    return new URL(url).hostname === hostname;
  } catch {
    return false;
  }
}

export async function deleteBlobIfUnused(
  url: string | null | undefined,
): Promise<boolean> {
  if (!url || !isOwnBlobUrl(url)) return false;

  const referenced = await prisma.post.count({ where: { thumbnail: url } });
  if (referenced > 0) return false;

  try {
    await del(url);
    return true;
  } catch (error) {
    console.error("Failed to delete blob:", error);
    return false;
  }
}
