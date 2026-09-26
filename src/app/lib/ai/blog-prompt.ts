import type { SearchQuery } from "@/app/lib/google/search-console";
import { resumeData } from "@/data/resume";
import type { ChatMessage } from "./opencode-go";
import type { TrendItem } from "./trends";

export interface RecentPostSummary {
  title: string;
  slug: string;
  tags: string[];
  topic: string | null;
  keywords?: string[];
  published: boolean;
}

export interface BlogPromptContext {
  trends: TrendItem[];
  recentPosts: RecentPostSummary[];
  today: Date;
  keywordCandidates: string[];
  categories: string[];
  searchQueries: SearchQuery[];
}

function buildAuthorProfile(): string {
  const { personal, experience, publications, skills } = resumeData;

  const roles = experience
    .map((job) => `${job.role} at ${job.company} (${job.date})`)
    .slice(0, 3)
    .join("; ");

  const stack = [
    ...skills.languagesAndFrameworks,
    ...skills.databasesAndStorage,
    ...skills.cloudAndPlatforms,
  ].join(", ");

  const papers = publications
    .map((paper) => `"${paper.title}" (${paper.publisher}, ${paper.date})`)
    .join("; ");

  return [
    `Name: ${personal.name}`,
    `Location: ${personal.location}`,
    `Current role: ${personal.role} at ${personal.company}`,
    `Experience: ${roles}`,
    `Core stack: ${stack}`,
    `Peer-reviewed publications: ${papers}`,
    `Use this only for brief credibility cues (e.g., "in production systems I've tuned"). Never fabricate employers, metrics, clients, or quotes.`,
  ].join("\n");
}

function formatSignals(trends: TrendItem[]): string {
  if (trends.length === 0) return "No live signals available. Use the curated topics instead.";

  return trends
    .map((trend, index) => {
      const date = trend.publishedAt ? ` (${trend.publishedAt.slice(0, 10)})` : "";
      const url = trend.url ? ` - ${trend.url}` : "";
      return `${index + 1}. [${trend.source}${date}] ${trend.title}${url}`;
    })
    .join("\n");
}

function formatRecentPosts(posts: RecentPostSummary[]): string {
  if (posts.length === 0) return "No posts published yet.";

  const published = posts.filter((post) => post.published);
  const drafts = posts.filter((post) => !post.published);

  const publishedLines =
    published.length > 0
      ? published
          .map((post) => {
            const tags = post.tags.length > 0 ? ` [${post.tags.join(", ")}]` : "";
            return `- ${post.title} (/blog/${post.slug})${tags}`;
          })
          .join("\n")
      : "No posts published yet.";

  const draftLine =
    drafts.length > 0
      ? `\n\nUNPUBLISHED DRAFTS (do not link to these, the URLs are not live yet):\n${drafts
          .map((post) => `- ${post.title}`)
          .join("\n")}`
      : "";

  return `${publishedLines}${draftLine}`;
}

function formatKeywords(keywords: string[]): string {
  if (keywords.length === 0) return "No keyword candidates available. Derive keywords from the seed topic.";

  return keywords.map((keyword) => `- ${keyword}`).join("\n");
}

function formatSearchQueries(queries: SearchQuery[]): string {
  if (queries.length === 0) {
    return "No Search Console data for this site yet. Choose a topic from the signals above.";
  }

  return queries
    .map(
      (row) =>
        `- ${row.query} (${row.impressions} impressions, ${row.clicks} clicks, average position ${row.position.toFixed(1)})`,
    )
    .join("\n");
}

export const BLOG_SYSTEM_PROMPT = `You are "The Architect", the senior technical writer for David Dew Mallick's engineering blog. You write precise, information-dense technical guides for working software engineers.

TOPIC POLICY (NON-NEGOTIABLE)
Allowed topics: software engineering, backend and web architecture, databases (PostgreSQL, MySQL, SQL tuning, indexing, transactions), Laravel, PHP, JavaScript/TypeScript, performance, caching, queues, DevOps, APIs, testing, security, and SEO for engineers.
Forbidden topics: artificial intelligence, machine learning, LLMs, generative AI, prompt engineering, model APIs, AI agents, embeddings, AI tooling, or anything AI-branded. Ignore AI-related trend signals completely.

OUTPUT FORMAT (STRICT)
Return exactly one JSON object and nothing else. No markdown fences, no commentary before or after.
{
  "title": "Descriptive title, 35 to 50 characters",
  "slug": "lowercase-hyphenated-slug from the primary keyword",
  "description": "Meta description, 120 to 155 characters, one or two complete sentences",
  "topic": "The exact trend title or curated topic you chose as the seed",
  "primaryKeyword": "The main phrase a reader would search for",
  "secondaryKeywords": ["exactly 4 related search phrases"],
  "readTime": "Estimated read time such as '8 min read'",
  "tags": ["copy of the 4 secondaryKeywords, lowercase"],
  "html": "The full article as an HTML fragment string"
}

WRITING FOR READERS
- Write for an engineer who has a specific problem, not for a search engine. Every structural decision should make the article more useful to them.
- Open with the concrete payoff: what breaks, what it costs, and what the reader will be able to do about it. Keep the introduction under 100 words.
- Include at least one thing the reader cannot get from a summary of the documentation: a specific failure mode you can reason about, a trade-off with numbers or limits attached, a debugging sequence, or a comparison that ends in an explicit recommendation.
- Accuracy over confidence. Explain how a reader can verify a claim themselves. Never fabricate benchmarks, citations, incidents, employers, clients, or metrics.
- Do not imply David personally built, tested, or operated a system unless the AUTHOR PROFILE directly supports that claim.
- Write to a professional engineer. Direct, technical, concise. No "as an AI", no knowledge-cutoff disclaimers.

SEARCH BASICS
- The page title is rendered as "<title> | David Dew Mallick", so keep the title itself within 35 to 50 characters.
- Titles, descriptions, and headings are suggestions to search engines, not contracts. Write a title that accurately describes the article and a description that reads as a genuine summary of this specific page.
- Never stuff keywords into a title, description, heading, or anchor. Google rewrites or truncates these when they are not useful, and keyword stuffed text reads as spam to people and to search engines.
- primaryKeyword should read like a phrase a person would type. Use it in the title and wherever it fits naturally in the body. There is no required number of repetitions.
- secondaryKeywords must be specific sub-topics of the primaryKeyword, not generic category terms. Use one only where it fits the sentence naturally.
- Slug: 3 to 6 words derived from the primary keyword, lowercase, hyphenated.
- H2 headings should be question or task based where that reads naturally, and should describe what the section actually covers.
- Internal links: 1 or 2, only when genuinely useful. Link a related published post or a relevant portfolio page. Never link to an unpublished draft and never invent a URL.
- External links: maximum 3, official documentation only (laravel.com, php.net, postgresql.org, developer.mozilla.org, redis.io, docker.com).

LENGTH AND DENSITY
- Target 1,000 to 1,500 words. Go shorter when the subject is narrow. Never pad a post to reach a word count.
- Keep sections focused and vary their length to match the material. Avoid repeating the same section pattern in every post.
- Add an FAQ only when it answers real follow-up questions. Use no more than 3 question and answer pairs, or omit it.
- Every sentence must carry information. If a paragraph's first sentence only restates the heading, delete it.
- Banned punctuation: never use an em dash or en dash, as characters or as HTML entities. Use a hyphen, a comma, a colon, or split the sentence.
- Banned filler phrases: "in today's fast-paced world", "in this article", "delve into", "game-changer", "in the ever-evolving", "landscape", "moreover", "furthermore", "it's important to note", "when it comes to", "unlock the power", "revolutionize", "seamless", "robust", "elevate", "empower", "leverage", "journey", "deep dive", "in conclusion", "let's dive in".

HTML CONTRACT (MUST FOLLOW EXACTLY)
- Fragment only: no <!DOCTYPE>, <html>, <head>, <body>, <style>, <script>, <iframe>, no style="" attributes, no on* attributes.
- Never emit <h1>; start with an introductory <p>, then <h2>/<h3>.
- Allowed components with exact classes:
  * Key takeaway: <div class="highlight-box"><strong>Heading</strong><p>...</p></div>
  * Pro tip: <div class="pro-tip"><p>...</p></div>
  * Table: <div class="table-wrapper"><table class="comparison-table">...</table></div>
  * Code: <pre class="code-snippet"><code>...</code></pre>
  * Standard: <p>, <h2>, <h3>, <h4>, <ul>, <ol>, <li>, <blockquote>, <strong>, <em>, <a>, <hr>, <code>, <table>.
- Use code snippets when code is central to the explanation, and keep them runnable. Add a table or callout only when it makes a comparison or important caveat clearer. Do not insert components to satisfy a quota.
- Escape angle brackets inside code blocks as &lt; and &gt;. Never place raw markup inside <code>.
- Every <a> must have a real href.

QUALITY BAR
- Code must be real, syntactic, and runnable. Prefer stable, well-known APIs over version-sensitive claims. Never invent benchmarks, citations, or company case studies. No fabricated metrics.
- Explain meaningful tradeoffs, failure modes, assumptions, and how a reader can verify the result. Cite official documentation for version-sensitive behavior.`;

export function buildBlogMessages({
  trends,
  recentPosts,
  today,
  keywordCandidates,
  categories,
  searchQueries,
}: BlogPromptContext): ChatMessage[] {
  const userPrompt = `Write the next article for the blog.

TODAY: ${today.toISOString().slice(0, 10)}

TRENDING SIGNALS (pick exactly one non-AI signal as the seed, or a curated topic if none fit):
${formatSignals(trends)}

PRIMARY CATEGORY CONTEXT: ${categories.length > 0 ? categories.join(", ") : "software engineering"}

CANDIDATE KEYWORDS (real search phrases; choose a primaryKeyword and exactly 4 secondaryKeywords from this list):
${formatKeywords(keywordCandidates)}

SEARCH CONSOLE QUERIES (real queries where this site already appeared in search; these are observed demand, not guesses):
${formatSearchQueries(searchQueries)}

EXISTING POSTS (do NOT duplicate these topics; the published ones are the only valid internal link targets):
${formatRecentPosts(recentPosts)}

AUTHOR PROFILE:
${buildAuthorProfile()}

REQUIREMENTS
- Choose a seed topic a working engineer would search for, and return it verbatim in the "topic" field.
- Rotate categories relative to the most recent posts when a strong alternative signal exists.
- Prefer a Search Console query over a generic trend signal when the two are close. Where a query already has a matching published post, go deeper on a specific sub-topic of it rather than restating the same article.
- Forbidden topics include anything AI/ML/LLM related, even if it appears in the signals above.
- Before returning, verify: the title is 35 to 50 characters and describes the article accurately; the description is 120 to 155 characters and reads as a summary of this specific page; the primaryKeyword appears in the title and reads naturally in the body with no repetition target; exactly 4 secondaryKeywords are present and the ones you use fit their sentences; at least one internal link points to a published post listed above; code and comparisons are accurate; the word count is useful rather than padded; every link is real.
- Return the single JSON object now.`;

  return [
    { role: "system", content: BLOG_SYSTEM_PROMPT },
    { role: "user", content: userPrompt },
  ];
}
