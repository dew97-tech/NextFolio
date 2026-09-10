import { isBannedTopic } from "./trends";

const SUGGEST_URL = "https://suggestqueries.google.com/complete/search?client=firefox&q=";

export const CATEGORY_KEYWORD_BANK: Record<string, string[]> = {
  laravel: [
    "laravel queue",
    "eloquent relationships",
    "laravel validation",
    "laravel octane",
    "laravel middleware",
    "laravel service container",
    "eloquent n+1",
    "laravel caching",
    "laravel events and listeners",
    "laravel testing",
  ],
  php: [
    "php 8 features",
    "php opcache",
    "php type juggling",
    "php pdo",
    "php generators",
    "php dependency injection",
    "php array performance",
    "php strict types",
  ],
  postgresql: [
    "postgresql index",
    "postgresql explain analyze",
    "postgresql partitioning",
    "postgresql jsonb",
    "postgresql vacuum",
    "postgresql transactions",
    "postgresql connection pooling",
  ],
  database: [
    "sql indexing",
    "database normalization",
    "sql joins",
    "database migrations",
    "query optimization",
    "acid transactions",
    "database sharding",
  ],
  typescript: [
    "typescript generics",
    "typescript utility types",
    "typescript zod",
    "typescript strict mode",
    "typescript type guards",
  ],
  javascript: [
    "javascript async await",
    "javascript event loop",
    "javascript array methods",
    "javascript modules",
  ],
  "api design": [
    "rest api versioning",
    "api pagination",
    "api authentication",
    "api rate limiting",
    "graphql vs rest",
  ],
  devops: [
    "docker compose",
    "ci cd pipeline",
    "nginx reverse proxy",
    "redis caching",
    "linux performance tuning",
  ],
};

const CATEGORY_ALIASES: Record<string, string[]> = {
  laravel: ["laravel", "eloquent", "blade", "artisan"],
  php: ["php", "composer", "opcache"],
  postgresql: ["postgresql", "postgres", "psql"],
  database: [
    "database",
    "sql",
    "mysql",
    "index",
    "indexing",
    "query",
    "transactions",
    "normalization",
    "sharding",
    "acid",
  ],
  typescript: ["typescript"],
  javascript: ["javascript", "node.js", "next.js", "react"],
  "api design": ["api", "rest", "graphql", "endpoint", "http"],
  devops: ["docker", "kubernetes", "nginx", "redis", "linux", "deployment", "ci/cd"],
};

export interface KeywordCandidates {
  keywords: string[];
  categories: string[];
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function matchCategories(text: string): string[] {
  const normalized = text.toLowerCase();

  return Object.entries(CATEGORY_ALIASES)
    .filter(([, aliases]) =>
      aliases.some((alias) =>
        new RegExp(`\\b${escapeRegex(alias)}\\b`, "i").test(normalized),
      ),
    )
    .map(([category]) => category);
}

function dedupeKeywords(values: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const value of values) {
    const keyword = value.toLowerCase().replace(/\s+/g, " ").trim();
    if (keyword.length < 3 || keyword.length > 70) continue;
    if (seen.has(keyword)) continue;
    if (isBannedTopic(keyword)) continue;
    seen.add(keyword);
    result.push(keyword);
  }

  return result;
}

async function fetchSuggestions(queries: string[]): Promise<string[]> {
  const responses = await Promise.allSettled(
    queries.map(async (query) => {
      const response = await fetch(`${SUGGEST_URL}${encodeURIComponent(query)}`, {
        cache: "no-store",
        headers: { "User-Agent": "david-portfolio-blog-bot/1.0" },
        signal: AbortSignal.timeout(6000),
      });

      if (!response.ok) return [] as string[];

      const data = (await response.json()) as unknown;
      if (!Array.isArray(data) || !Array.isArray(data[1])) return [] as string[];

      return (data[1] as unknown[]).filter(
        (item): item is string => typeof item === "string",
      );
    }),
  );

  return responses.flatMap((result) =>
    result.status === "fulfilled" ? result.value : [],
  );
}

export async function buildKeywordCandidates(
  seedTitles: string[],
): Promise<KeywordCandidates> {
  const combinedText = seedTitles.join(" ");
  const matched = matchCategories(combinedText);
  const categories = matched.length > 0 ? matched : ["database", "api design"];

  const bank = categories.flatMap(
    (category) => CATEGORY_KEYWORD_BANK[category] ?? [],
  );

  const seedQueries = Array.from(
    new Set(
      [
        seedTitles[0]?.slice(0, 70),
        seedTitles[1]?.slice(0, 70),
        `${categories[0]} best practices`,
        `${categories[0]} performance`,
      ].filter((value): value is string => Boolean(value)),
    ),
  ).slice(0, 4);

  const suggestions = await fetchSuggestions(seedQueries).catch(() => [] as string[]);

  return {
    keywords: dedupeKeywords([...bank, ...suggestions]).slice(0, 18),
    categories,
  };
}
