export interface TrendItem {
  title: string;
  url: string;
  source: string;
  publishedAt?: string;
}

const BANNED_PATTERNS: RegExp[] = [
  /\bai\b/i,
  /\bgpt\b/i,
  /\bllms?\b/i,
  /\bopenai\b/i,
  /\bchatgpt\b/i,
  /\bmachine[\s-]?learning\b/i,
  /\bdeep[\s-]?learning\b/i,
  /\bneural\b/i,
  /\bgen[\s-]?ai\b/i,
  /\bgenerative\b/i,
  /\bprompt[\s-]?engineering\b/i,
  /\bembeddings?\b/i,
  /\bcopilot\b/i,
  /\bclaude\b/i,
  /\bgemini\b/i,
  /\bfine[\s-]?tuning\b/i,
  /\btransformers?\b/i,
  /\bdiffusion\b/i,
  /\bcomputer[\s-]?vision\b/i,
  /\bnlp\b/i,
];

export const CURATED_TOPICS: TrendItem[] = [
  {
    title: "Laravel Queue Workers: Scaling Background Jobs Without Losing Data",
    url: "",
    source: "Curated",
  },
  {
    title: "PostgreSQL Indexing Strategies: From B-Tree to BRIN",
    url: "",
    source: "Curated",
  },
  {
    title: "Zero-Downtime Schema Migrations in PostgreSQL",
    url: "",
    source: "Curated",
  },
  {
    title: "Eliminating N+1 Queries with Eloquent and Laravel Debugbar",
    url: "",
    source: "Curated",
  },
  {
    title: "PHP 8 Performance Patterns: OPcache, JIT, and Honest Benchmarks",
    url: "",
    source: "Curated",
  },
  {
    title: "Database Transactions and Locking: A Practical PostgreSQL Guide",
    url: "",
    source: "Curated",
  },
  {
    title: "Laravel Octane in Production: Lessons and Pitfalls",
    url: "",
    source: "Curated",
  },
  {
    title: "Normalization vs Denormalization: Choosing the Right Data Model",
    url: "",
    source: "Curated",
  },
  {
    title: "Caching Layers Explained: Redis, CDN, and Application Cache",
    url: "",
    source: "Curated",
  },
  {
    title: "REST API Design: Versioning, Pagination, and Error Contracts",
    url: "",
    source: "Curated",
  },
  {
    title: "Composable Laravel: Service Classes, Actions, and Pipelines",
    url: "",
    source: "Curated",
  },
  {
    title: "PostgreSQL Query Plans: Reading EXPLAIN ANALYZE Like a Pro",
    url: "",
    source: "Curated",
  },
  {
    title: "Type-Safe TypeScript: Generics, Zod, and Better Inference",
    url: "",
    source: "Curated",
  },
  {
    title: "Database Connection Pooling: Sizing, Timeouts, and Failure Modes",
    url: "",
    source: "Curated",
  },
];

export function isBannedTopic(text: string): boolean {
  const normalized = text.toLowerCase();
  return BANNED_PATTERNS.some((pattern) => pattern.test(normalized));
}

function hasStaleYear(text: string): boolean {
  const years = text.match(/\b(19|20)\d{2}\b/g);
  if (!years) return false;

  const cutoff = new Date().getFullYear() - 1;
  return years.some((year) => Number(year) < cutoff);
}

async function fetchJson<T>(url: string, timeoutMs = 8000): Promise<T> {
  const response = await fetch(url, {
    cache: "no-store",
    headers: { "User-Agent": "david-portfolio-blog-bot/1.0" },
    signal: AbortSignal.timeout(timeoutMs),
  });

  if (!response.ok) {
    throw new Error(`Feed request failed (${response.status}): ${url}`);
  }

  return (await response.json()) as T;
}

async function fetchText(url: string, timeoutMs = 8000): Promise<string> {
  const response = await fetch(url, {
    cache: "no-store",
    headers: { "User-Agent": "david-portfolio-blog-bot/1.0" },
    signal: AbortSignal.timeout(timeoutMs),
  });

  if (!response.ok) {
    throw new Error(`Feed request failed (${response.status}): ${url}`);
  }

  return await response.text();
}

function decodeEntities(value: string): string {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)));
}

function parseFeed(xml: string, source: string, limit: number): TrendItem[] {
  const blocks = xml.match(/<item[\s\S]*?<\/item>|<entry[\s\S]*?<\/entry>/gi) ?? [];
  const items: TrendItem[] = [];

  for (const block of blocks) {
    const titleMatch = block.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    const linkMatch =
      block.match(/<link[^>]*href=["']([^"']+)["']/i) ??
      block.match(/<link[^>]*>([\s\S]*?)<\/link>/i);
    const dateMatch = block.match(/<(?:pubDate|published|updated)[^>]*>([\s\S]*?)<\//i);

    const title = titleMatch
      ? decodeEntities(titleMatch[1].replace(/<!\[CDATA\[|\]\]>/g, "").trim())
      : "";
    const url = linkMatch ? decodeEntities(linkMatch[1].trim()) : "";

    if (title && url) {
      items.push({ title, url, source, publishedAt: dateMatch?.[1]?.trim() });
    }

    if (items.length >= limit) break;
  }

  return items;
}

interface HackerNewsHit {
  title?: string;
  story_title?: string;
  url?: string;
  story_url?: string;
  objectID: string;
  created_at?: string;
}

async function fetchHackerNews(): Promise<TrendItem[]> {
  const queries = ["laravel", "php", "postgresql", "database", "software engineering"];
  const oneYearAgo = Math.floor(Date.now() / 1000) - 365 * 24 * 60 * 60;

  const responses = await Promise.allSettled(
    queries.map((query) =>
      fetchJson<{ hits: HackerNewsHit[] }>(
        `https://hn.algolia.com/api/v1/search?query=${encodeURIComponent(
          query,
        )}&tags=story&numericFilters=points>60,created_at_i>${oneYearAgo}&hitsPerPage=4`,
      ),
    ),
  );

  return responses.flatMap((result) => {
    if (result.status !== "fulfilled") return [];

    return result.value.hits
      .map((hit) => ({
        title: hit.title ?? hit.story_title ?? "",
        url:
          hit.url ??
          hit.story_url ??
          `https://news.ycombinator.com/item?id=${hit.objectID}`,
        source: "Hacker News",
        publishedAt: hit.created_at,
      }))
      .filter((item) => item.title);
  });
}

interface DevToArticle {
  title: string;
  url: string;
  published_at?: string;
  tag_list?: string[];
}

async function fetchDevTo(): Promise<TrendItem[]> {
  const tags = ["laravel", "php", "postgresql", "database", "webdev"];

  const responses = await Promise.allSettled(
    tags.map((tag) =>
      fetchJson<DevToArticle[]>(
        `https://dev.to/api/articles?tag=${encodeURIComponent(tag)}&top=7&per_page=4`,
      ),
    ),
  );

  return responses.flatMap((result) => {
    if (result.status !== "fulfilled") return [];

    return result.value.map((article) => ({
      title: article.title,
      url: article.url,
      source: "dev.to",
      publishedAt: article.published_at,
    }));
  });
}

export async function fetchTrends(): Promise<TrendItem[]> {
  const responses = await Promise.allSettled([
    fetchHackerNews(),
    fetchDevTo(),
    fetchText("https://laravel-news.com/feed").then((xml) =>
      parseFeed(xml, "Laravel News", 6),
    ),
    fetchText("https://www.php.net/feed.atom").then((xml) =>
      parseFeed(xml, "PHP.net", 6),
    ),
  ]);

  const items = responses.flatMap((result) =>
    result.status === "fulfilled" ? result.value : [],
  );

  const seen = new Set<string>();

  return items
    .filter((item) => {
      const key = item.title.toLowerCase().replace(/\s+/g, " ").trim();
      if (!key || seen.has(key) || isBannedTopic(item.title)) return false;
      if (hasStaleYear(item.title)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, 24);
}
