import { google } from "googleapis";
import { getSiteUrl } from "@/app/lib/site";

const INDEXING_SCOPE = "https://www.googleapis.com/auth/indexing";

function getServiceAccountCredentials() {
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!clientEmail || !privateKey) {
    throw new Error(
      "GOOGLE_SERVICE_ACCOUNT_EMAIL and GOOGLE_PRIVATE_KEY must be configured",
    );
  }

  return { clientEmail, privateKey };
}

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

export async function publishUrlNotification(url: string) {
  const { clientEmail, privateKey } = getServiceAccountCredentials();

  const auth = new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: [INDEXING_SCOPE],
  });

  const indexing = google.indexing({ version: "v3", auth });

  const response = await indexing.urlNotifications.publish({
    requestBody: { url, type: "URL_UPDATED" },
  });

  return response.data;
}
