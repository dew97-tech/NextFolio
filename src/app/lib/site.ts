export const DEFAULT_SITE_URL = "https://davidmallick.dev";

export function getSiteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL ?? DEFAULT_SITE_URL;
  return configured.replace(/\/+$/, "");
}
