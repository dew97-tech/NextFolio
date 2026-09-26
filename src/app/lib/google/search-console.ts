import { createSign } from "node:crypto";

const TOKEN_URL = "https://oauth2.googleapis.com/token";
const SCOPE = "https://www.googleapis.com/auth/webmasters.readonly";

export interface SearchQuery {
  query: string;
  clicks: number;
  impressions: number;
  position: number;
}

interface TokenResponse {
  access_token?: string;
}

interface AnalyticsRow {
  keys?: string[];
  clicks?: number;
  impressions?: number;
  position?: number;
}

interface AnalyticsResponse {
  rows?: AnalyticsRow[];
}

function credentials() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const key = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");
  const property = process.env.GSC_PROPERTY;

  if (!email || !key || !property) {
    return null;
  }

  return { email, key, property };
}

export function isSearchConsoleConfigured(): boolean {
  return credentials() !== null;
}

function base64url(value: string): string {
  return Buffer.from(value).toString("base64url");
}

async function getAccessToken(email: string, key: string): Promise<string> {
  const issued = Math.floor(Date.now() / 1000);

  const header = base64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claims = base64url(
    JSON.stringify({
      iss: email,
      scope: SCOPE,
      aud: TOKEN_URL,
      iat: issued,
      exp: issued + 3600,
    }),
  );

  const signingInput = `${header}.${claims}`;
  const signature = createSign("RSA-SHA256")
    .update(signingInput)
    .sign(key, "base64url");

  const response = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: `${signingInput}.${signature}`,
    }),
    cache: "no-store",
    signal: AbortSignal.timeout(8000),
  });

  if (!response.ok) {
    throw new Error(`Google token exchange failed (${response.status})`);
  }

  const data = (await response.json()) as TokenResponse;
  if (!data.access_token) {
    throw new Error("Google token exchange returned no access token");
  }

  return data.access_token;
}

function isoDay(offsetDays: number): string {
  const date = new Date(Date.now() - offsetDays * 24 * 60 * 60 * 1000);
  return date.toISOString().slice(0, 10);
}

export async function fetchSearchQueries(limit = 20): Promise<SearchQuery[]> {
  const config = credentials();
  if (!config) return [];

  try {
    const token = await getAccessToken(config.email, config.key);

    const response = await fetch(
      `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(
        config.property,
      )}/searchAnalytics/query`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          startDate: isoDay(31),
          endDate: isoDay(3),
          dimensions: ["query"],
          rowLimit: limit,
        }),
        cache: "no-store",
        signal: AbortSignal.timeout(10000),
      },
    );

    if (!response.ok) return [];

    const data = (await response.json()) as AnalyticsResponse;

    return (data.rows ?? [])
      .map((row) => ({
        query: row.keys?.[0]?.trim() ?? "",
        clicks: row.clicks ?? 0,
        impressions: row.impressions ?? 0,
        position: row.position ?? 0,
      }))
      .filter((row) => row.query.length > 0);
  } catch {
    return [];
  }
}
