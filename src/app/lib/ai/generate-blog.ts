import sanitizeHtml from "sanitize-html";
import { z } from "zod";
import prisma from "@/app/lib/prisma";
import { buildBlogMessages } from "./blog-prompt";
import { buildKeywordCandidates } from "./keywords";
import {
  chatCompletion,
  extractJsonObject,
  GO_MODELS,
  type ChatCompletionResult,
  type ChatMessage,
} from "./opencode-go";
import { CURATED_TOPICS, fetchTrends, isBannedTopic, type TrendItem } from "./trends";

export const MAX_AUTO_DRAFTS = 3;
// Must be strictly less than the cron period (168h weekly). Two consecutive
// weekly fires are ~167h58m apart due to scheduler jitter, so an interval of
// exactly 168 would fail its own check and silently halve the cadence.
export const GENERATION_INTERVAL_HOURS = 140;
const RUNNING_LOCK_MINUTES = 15;

const MAX_TOTAL_GENERATION_MS = 215_000;
const MIN_WORD_COUNT = 900;
const MAX_WORD_COUNT = 2_600;
const MAX_TITLE_SIMILARITY = 0.6;

const DraftSchema = z.object({
  title: z.string().min(10).max(140),
  slug: z.string().min(3).max(160),
  description: z.string().min(40).max(240),
  topic: z.string().min(3).max(240),
  primaryKeyword: z.string().min(2).max(100),
  secondaryKeywords: z.array(z.string()).min(2).max(6),
  readTime: z.string().max(40).optional(),
  tags: z.array(z.string()).min(1).max(8).optional(),
  html: z.string().min(500),
});

interface ValidatedDraft {
  title: string;
  slug: string;
  description: string;
  topic: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  tags: string[];
  html: string;
  wordCount: number;
}

export type GenerationResult =
  | {
      status: "skipped";
      reason: "interval" | "draft_cap" | "already_running";
      detail: string;
      drafts?: number;
    }
  | {
      status: "success";
      postId: string;
      slug: string;
      model: string;
      topic: string;
      primaryKeyword: string;
      wordCount: number;
      cost?: number;
    }
  | { status: "failed"; error: string; model?: string };

const STOP_WORDS = new Set([
  "the",
  "a",
  "an",
  "and",
  "or",
  "but",
  "for",
  "to",
  "of",
  "in",
  "on",
  "with",
  "is",
  "are",
  "was",
  "were",
  "be",
  "been",
  "it",
  "its",
  "this",
  "that",
  "as",
  "at",
  "by",
  "from",
  "how",
  "why",
  "what",
  "when",
  "your",
  "you",
  "we",
  "our",
  "best",
  "guide",
  "complete",
  "ultimate",
]);

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z#0-9]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function countWords(html: string): number {
  const text = stripHtml(html);
  return text ? text.split(" ").length : 0;
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}

function titleTokens(value: string): Set<string> {
  return new Set(
    slugify(value)
      .split("-")
      .filter((token) => token.length > 1 && !STOP_WORDS.has(token)),
  );
}

function titleSimilarity(a: string, b: string): number {
  const tokensA = titleTokens(a);
  const tokensB = titleTokens(b);
  if (tokensA.size === 0 || tokensB.size === 0) return 0;

  let intersection = 0;
  for (const token of tokensA) {
    if (tokensB.has(token)) intersection += 1;
  }

  return intersection / (tokensA.size + tokensB.size - intersection);
}

function countOccurrences(haystack: string, needle: string): number {
  if (!needle) return 0;
  return haystack.split(needle).length - 1;
}

function extractH2Text(html: string): string[] {
  const matches = html.match(/<h2[^>]*>([\s\S]*?)<\/h2>/gi) ?? [];
  return matches.map((block) => block.replace(/<[^>]+>/g, " "));
}

const EM_DASH = String.fromCharCode(0x2014);
const EN_DASH = String.fromCharCode(0x2013);

function normalizeDashes(text: string): string {
  return text
    .replaceAll(` ${EM_DASH} `, ", ")
    .replaceAll(` ${EN_DASH} `, ", ")
    .replaceAll(EM_DASH, "-")
    .replaceAll(EN_DASH, "-");
}

function sanitizeGeneratedHtml(html: string): string {
  const clean = sanitizeHtml(html, {
    allowedTags: [
      "h2",
      "h3",
      "h4",
      "p",
      "a",
      "ul",
      "ol",
      "li",
      "strong",
      "em",
      "b",
      "i",
      "u",
      "code",
      "pre",
      "blockquote",
      "table",
      "thead",
      "tbody",
      "tr",
      "th",
      "td",
      "hr",
      "br",
      "div",
      "span",
      "mark",
    ],
    allowedAttributes: {
      a: ["href", "title", "target", "rel"],
      th: ["colspan", "rowspan", "scope"],
      td: ["colspan", "rowspan"],
      div: ["class"],
      pre: ["class"],
      table: ["class"],
    },
    allowedClasses: {
      div: ["highlight-box", "pro-tip", "table-wrapper"],
      pre: ["code-snippet"],
      table: ["comparison-table"],
    },
    allowedSchemes: ["http", "https", "mailto"],
    disallowedTagsMode: "discard",
  });

  return normalizeDashes(clean);
}

function validateDraft(
  raw: unknown,
  existingTitles: string[],
  usedKeywords: Set<string>,
): ValidatedDraft {
  const parsed = DraftSchema.parse(raw);
  const normalizedTitle = normalizeDashes(parsed.title);
  const normalizedDescription = normalizeDashes(parsed.description);
  const normalizedTopic = normalizeDashes(parsed.topic);
  const html = sanitizeGeneratedHtml(parsed.html);
  const wordCount = countWords(html);

  if (wordCount < MIN_WORD_COUNT) {
    throw new Error(`Generated article is too short (${wordCount} words)`);
  }

  if (wordCount > MAX_WORD_COUNT) {
    throw new Error(`Generated article exceeds the concise limit (${wordCount} words)`);
  }

  const bannedText = `${normalizedTitle} ${normalizedDescription} ${
    parsed.tags?.join(" ") ?? ""
  } ${parsed.primaryKeyword}`;
  if (isBannedTopic(bannedText)) {
    throw new Error("Generated article violates the non-AI topic policy");
  }

  const primaryKeyword = parsed.primaryKeyword.trim().toLowerCase();
  const primarySlug = slugify(primaryKeyword);
  if (!primarySlug) {
    throw new Error("Generated primary keyword is not usable");
  }

  if (!slugify(normalizedTitle).includes(primarySlug)) {
    throw new Error(`Primary keyword "${primaryKeyword}" is missing from the title`);
  }

  if (!slugify(normalizedDescription).includes(primarySlug)) {
    throw new Error(
      `Primary keyword "${primaryKeyword}" is missing from the meta description`,
    );
  }

  const bodyText = stripHtml(html).toLowerCase();
  const primaryOccurrences = countOccurrences(bodyText, primaryKeyword);
  if (primaryOccurrences < 2) {
    throw new Error(
      `Primary keyword "${primaryKeyword}" appears only ${primaryOccurrences} time(s); include it 3-8 times`,
    );
  }

  const h2Hits = extractH2Text(html).filter((heading) =>
    slugify(heading).includes(primarySlug),
  ).length;
  if (h2Hits < 1) {
    throw new Error(
      `Primary keyword "${primaryKeyword}" must appear in at least one H2 heading`,
    );
  }

  const secondaryKeywords = Array.from(
    new Set(
      parsed.secondaryKeywords
        .map((keyword) => keyword.trim().toLowerCase().replace(/\s+/g, " "))
        .filter(Boolean),
    ),
  ).slice(0, 4);

  const secondaryHits = secondaryKeywords.filter((keyword) =>
    bodyText.includes(keyword),
  ).length;
  const requiredSecondaryHits = Math.min(2, secondaryKeywords.length);
  if (secondaryHits < requiredSecondaryHits) {
    throw new Error(
      `Only ${secondaryHits} of ${secondaryKeywords.length} secondary keywords appear in the article; use at least ${requiredSecondaryHits}`,
    );
  }

  const internalLinkCount = (html.match(/href="\/(?:#|blog)/g) ?? []).length;
  if (internalLinkCount < 1) {
    throw new Error(
      'Add at least one internal link to "/blog" or "/#projects"',
    );
  }

  const similarTitle = existingTitles.find(
    (existing) => titleSimilarity(existing, normalizedTitle) > MAX_TITLE_SIMILARITY,
  );
  if (similarTitle) {
    throw new Error(`Title is too similar to an existing post: "${similarTitle}"`);
  }

  if (usedKeywords.has(primaryKeyword)) {
    throw new Error(`Primary keyword "${primaryKeyword}" was already used recently`);
  }

  const slug = slugify(parsed.slug || primaryKeyword || normalizedTitle);
  if (!slug) {
    throw new Error("Could not derive a valid slug from the generated article");
  }

  return {
    title: normalizedTitle.trim(),
    slug,
    description: normalizedDescription.trim().slice(0, 160),
    topic: normalizedTopic.trim(),
    primaryKeyword,
    secondaryKeywords,
    tags: secondaryKeywords,
    html,
    wordCount,
  };
}

async function ensureUniqueSlug(base: string): Promise<string> {
  let slug = base;
  let suffix = 2;

  while (await prisma.post.findUnique({ where: { slug } })) {
    slug = `${base}-${suffix}`;
    suffix += 1;
    if (suffix > 50) {
      throw new Error("Could not find a unique slug for the generated article");
    }
  }

  return slug;
}

function normalizeTitle(value: string): string {
  return value.toLowerCase().replace(/\s+/g, " ").trim();
}

async function generateForModel(
  model: (typeof GO_MODELS)[number],
  messages: ChatMessage[],
  sessionId: string,
  existingTitles: string[],
  usedKeywords: Set<string>,
  deadline: number,
): Promise<{ draft: ValidatedDraft; result: ChatCompletionResult }> {
  let attemptMessages = messages;
  let lastError: unknown;

  for (let attempt = 1; attempt <= 2; attempt += 1) {
    if (Date.now() > deadline) {
      throw new Error("Generation deadline exceeded during self-repair");
    }

    const result = await chatCompletion({
      model: model.id,
      messages: attemptMessages,
      sessionId,
      temperature: 0.7,
      maxTokens: model.maxTokens,
      reasoningEffort: model.reasoningEffort,
    });

    try {
      const draft = validateDraft(
        extractJsonObject(result.content),
        existingTitles,
        usedKeywords,
      );
      return { draft, result };
    } catch (error) {
      lastError = error;
      if (attempt === 2) throw error;

      const validationMessage =
        error instanceof Error ? error.message : "Unknown validation error";

      attemptMessages = [
        ...messages,
        { role: "assistant", content: result.content },
        {
          role: "user",
          content: `Your previous JSON failed validation: ${validationMessage}. Return the complete corrected JSON object only, keeping the same topic and all length and SEO requirements.`,
        },
      ];
    }
  }

  throw lastError instanceof Error ? lastError : new Error("Unknown model error");
}

export async function runBlogGeneration(): Promise<GenerationResult> {
  const startedAt = Date.now();
  const sessionId = `portfolio-blog-${new Date().toISOString()}`;

  // Concurrency lock: a run that is still marked "running" within the lock
  // window means another invocation is in flight (retried cron, duplicate
  // webhook, manual trigger). Bail out so we never create two posts on the
  // same topic or burn two sets of model tokens.
  const activeRun = await prisma.generationRun.findFirst({
    where: {
      status: "running",
      startedAt: { gte: new Date(Date.now() - RUNNING_LOCK_MINUTES * 60 * 1000) },
    },
    select: { startedAt: true },
  });

  if (activeRun) {
    return {
      status: "skipped",
      reason: "already_running",
      detail: `Another generation run started at ${activeRun.startedAt.toISOString()}; lock window is ${RUNNING_LOCK_MINUTES} minutes`,
    };
  }

  const lastSuccess = await prisma.generationRun.findFirst({
    where: { status: "success" },
    orderBy: { startedAt: "desc" },
    select: { startedAt: true },
  });

  if (
    lastSuccess &&
    Date.now() - lastSuccess.startedAt.getTime() <
      GENERATION_INTERVAL_HOURS * 60 * 60 * 1000
  ) {
    const hoursAgo = Math.floor(
      (Date.now() - lastSuccess.startedAt.getTime()) / (60 * 60 * 1000),
    );
    await prisma.generationRun.create({
      data: {
        status: "skipped_interval",
        finishedAt: new Date(),
        error: `Last successful generation was ${hoursAgo}h ago`,
      },
    });
    return {
      status: "skipped",
      reason: "interval",
      detail: `Last successful generation was ${hoursAgo}h ago; runs every ${GENERATION_INTERVAL_HOURS}h`,
    };
  }

  const draftCount = await prisma.post.count({
    where: { published: false, source: "ai" },
  });

  if (draftCount >= MAX_AUTO_DRAFTS) {
    await prisma.generationRun.create({
      data: {
        status: "skipped_cap",
        finishedAt: new Date(),
        error: `${draftCount} unreviewed AI drafts pending`,
      },
    });
    return {
      status: "skipped",
      reason: "draft_cap",
      drafts: draftCount,
      detail: `${draftCount} unreviewed AI drafts pending; publish or delete them to resume generation`,
    };
  }

  const run = await prisma.generationRun.create({
    data: { status: "running" },
  });

  try {
    const [liveTrends, recentPosts, usedRuns] = await Promise.all([
      fetchTrends().catch(() => [] as TrendItem[]),
      prisma.post.findMany({
        orderBy: { date: "desc" },
        take: 50,
        select: { title: true, slug: true, tags: true, topic: true, keywords: true },
      }),
      prisma.generationRun.findMany({
        where: { status: "success", topic: { not: null } },
        orderBy: { startedAt: "desc" },
        take: 30,
        select: { topic: true },
      }),
    ]);

    const recentTitles = new Set(recentPosts.map((post) => normalizeTitle(post.title)));
    const recentTopics = new Set(
      recentPosts
        .map((post) => post.topic)
        .filter((topic): topic is string => Boolean(topic))
        .map(normalizeTitle),
    );
    const usedTopics = new Set(
      usedRuns
        .map((run) => run.topic)
        .filter((topic): topic is string => Boolean(topic))
        .map(normalizeTitle),
    );

    const seedPool = liveTrends.length > 0 ? liveTrends : CURATED_TOPICS;
    const available = seedPool.filter((seed) => {
      const title = normalizeTitle(seed.title);
      return !recentTitles.has(title) && !recentTopics.has(title) && !usedTopics.has(title);
    });

    const signals = (available.length > 0 ? available : CURATED_TOPICS).slice(0, 18);

    const keywordCandidates = await buildKeywordCandidates(
      signals.slice(0, 3).map((signal) => signal.title),
    ).catch(() => ({ keywords: [] as string[], categories: [] as string[] }));

    const messages = buildBlogMessages({
      trends: signals,
      recentPosts,
      today: new Date(),
      keywordCandidates: keywordCandidates.keywords,
      categories: keywordCandidates.categories,
    });

    const existingTitles = recentPosts.map((post) => post.title);
    const usedKeywords = new Set(
      recentPosts
        .map((post) => post.keywords[0]?.toLowerCase())
        .filter((keyword): keyword is string => Boolean(keyword)),
    );

    let lastError: unknown;
    let lastModel: string | undefined;
    const modelErrors: string[] = [];

    for (const model of GO_MODELS) {
      if (Date.now() - startedAt > MAX_TOTAL_GENERATION_MS) {
        lastError = new Error("Generation deadline exceeded before all models were tried");
        break;
      }

      try {
        const { draft, result } = await generateForModel(
          model,
          messages,
          sessionId,
          existingTitles,
          usedKeywords,
          startedAt + MAX_TOTAL_GENERATION_MS,
        );

        const slug = await ensureUniqueSlug(draft.slug);
        const readTime = `${Math.max(1, Math.round(draft.wordCount / 200))} min read`;

        const post = await prisma.post.create({
          data: {
            title: draft.title,
            slug,
            description: draft.description,
            content: draft.html,
            readTime,
            tags: draft.tags,
            keywords: [draft.primaryKeyword, ...draft.secondaryKeywords].slice(0, 6),
            published: false,
            source: "ai",
            topic: draft.topic,
            aiModel: model.id,
            generatedAt: new Date(),
            indexStatus: "pending",
          },
        });

        await prisma.generationRun
          .update({
            where: { id: run.id },
            data: {
              status: "success",
              finishedAt: new Date(),
              model: model.id,
              topic: draft.topic,
              postId: post.id,
              cost: result.cost ?? null,
              inputTokens: result.inputTokens ?? null,
              outputTokens: result.outputTokens ?? null,
            },
          })
          .catch((error) => {
            console.error("Failed to record generation run telemetry:", error);
          });

        return {
          status: "success",
          postId: post.id,
          slug,
          model: model.id,
          topic: draft.topic,
          primaryKeyword: draft.primaryKeyword,
          wordCount: draft.wordCount,
          cost: result.cost,
        };
      } catch (error) {
        lastError = error;
        lastModel = model.id;
        const message =
          error instanceof Error ? error.message : "Unknown model error";
        modelErrors.push(`${model.id}: ${message}`);
      }
    }

    const message =
      modelErrors.length > 0
        ? modelErrors.join(" || ")
        : lastError instanceof Error
          ? lastError.message
          : "Unknown generation error";

    await prisma.generationRun.update({
      where: { id: run.id },
      data: {
        status: "failed",
        finishedAt: new Date(),
        model: lastModel ?? null,
        error: message.slice(0, 2000),
      },
    });

    return { status: "failed", error: message, model: lastModel };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown orchestrator error";

    await prisma.generationRun
      .update({
        where: { id: run.id },
        data: {
          status: "failed",
          finishedAt: new Date(),
          error: message.slice(0, 2000),
        },
      })
      .catch(() => undefined);

    return { status: "failed", error: message };
  }
}
