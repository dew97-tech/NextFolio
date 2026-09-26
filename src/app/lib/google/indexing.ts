import { getSiteUrl } from "@/app/lib/site";

export function getGscProperty(): string {
  const property = process.env.GSC_PROPERTY;
  if (!property) {
    throw new Error("GSC_PROPERTY must be configured");
  }
  return property;
}

export function getPublishedPostUrl(slug: string): string {
  return `${getSiteUrl()}/blog/${slug}`;
}

export function buildGscInspectUrl(url: string): string {
  const property = getGscProperty();
  return `https://search.google.com/search-console/inspect?resource_id=${encodeURIComponent(
    property,
  )}&id=${encodeURIComponent(url)}`;
}
