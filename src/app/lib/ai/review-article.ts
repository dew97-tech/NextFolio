import { Prisma } from "@prisma/client";
import { z } from "zod";
import prisma from "@/app/lib/prisma";
import { getReviewSettings } from "@/app/lib/settings";
import {
  formatSearchResults,
  searchWeb,
  type SearchResult,
} from "@/app/lib/web-search";
import { buildAuthorProfile } from "./blog-prompt";
import { callModel } from "./call-model";
import {
  clampDescription,
  countWords,
  normalizeDashes,
  sanitizeGeneratedHtml,
} from "./generate-blog";
import { extractJsonObject } from "./opencode-go";
import {
  getPrompt,
  PROMPT_KEYS,
  PROMPT_REGISTRY,
  renderPrompt,
} from "./prompts";
import type { ReviewContextValues } from "./review-prompt";

const claimSchema = z.object({
  claim: z.string().min(5).max(400),
  verdict: z.enum(["supported", "contradicted", "unverifiable"]),
  evidence: z.string().min(3).max(600),
  sourceTitle: z.string().max(200).optional(),
});

const findingSchema = z.object({
  severity: z.enum(["error", "warning", "suggestion"]),
  category: z.enum([
    "accuracy",
    "code",
    "seo",
    "structure",
    "links",
    "keywords",
    "freshness",
  ]),
  title: z.string().min(3).max(120),
  detail: z.string().min(10).max(600),
  fix: z.string().max(600).optional(),
});

const reviewSchema = z.object({
  claims: z.array(claimSchema).max(15).optional(),
  findings: z.array(findingSchema).max(20),
  seoNotes: z
    .object({
      titleSuggestion: z.string().max(200),
      descriptionSuggestion: z.string().max(300),
      keywordNotes: z.string().max(600),
    })
    .partial()
    .optional(),
  suggested: z
    .object({
      title: z.string().max(200),
      description: z.string().max(400),
      content: z.string().min(200),
    })
    .partial()
    .optional(),
  sources: z
    .array(z.object({ title: z.string().max(200), url: z.string().url() }))
    .max(10)
    .optional(),
});

export type ReviewClaim = z.infer<typeof claimSchema>;
export type ReviewFinding = z.infer<typeof findingSchema>;
export type ReviewSeoNotes = {
  titleSuggestion?: string;
  descriptionSuggestion?: string;
  keywordNotes?: string;
};
export type ReviewSuggested = {
  title?: string;
  description?: string;
  content?: string;
};

export interface ReviewResult {
  reviewId: string;
  postId: string;
  model: string;
  status: string;
  usedWebSearch: boolean;
  degradedSearch: boolean;
  claims: ReviewClaim[];
  findings: ReviewFinding[];
  seoNotes: ReviewSeoNotes | null;
  suggested: ReviewSuggested | null;
  sources: Array<{ title: string; url: string }>;
  inputTokens?: number;
  outputTokens?: number;
  cost?: number;
  createdAt: string;
}

export interface ReviewHistoryItem {
  id: string;
  model: string;
  status: string;
  findingCount: number;
  error?: string | null;
  createdAt: string;
}

export async function listRecentReviews(
  postId: string,
  take = 5,
): Promise<ReviewHistoryItem[]> {
  const reviews = await prisma.articleReview.findMany({
    where: { postId },
    orderBy: { createdAt: "desc" },
    take,
    select: {
      id: true,
      model: true,
      status: true,
      findings: true,
      error: true,
      createdAt: true,
    },
  });

  return reviews.map((review) => ({
    id: review.id,
    model: review.model,
    status: review.status,
    findingCount: Array.isArray(review.findings)
      ? review.findings.length
      : 0,
    error: review.error,
    createdAt: review.createdAt.toISOString(),
  }));
}

export async function getStoredReview(
  reviewId: string,
): Promise<ReviewResult | null> {
  const review = await prisma.articleReview.findUnique({
    where: { id: reviewId },
  });

  if (!review) {
    return null;
  }

  const degradedSearch =
    review.status === "completed" && !review.usedWebSearch;

  return {
    reviewId: review.id,
    postId: review.postId,
    model: review.model,
    status: review.status,
    usedWebSearch: review.usedWebSearch,
    degradedSearch,
    claims: (review.claims as ReviewClaim[] | null) ?? [],
    findings: (review.findings as ReviewFinding[] | null) ?? [],
    seoNotes: (review.seoNotes as ReviewSeoNotes | null) ?? null,
    suggested: (review.suggested as ReviewSuggested | null) ?? null,
    sources:
      (review.sources as Array<{ title: string; url: string }> | null) ?? [],
    inputTokens: review.inputTokens ?? undefined,
    outputTokens: review.outputTokens ?? undefined,
    cost: review.cost ?? undefined,
    createdAt: review.createdAt.toISOString(),
  };
}

function buildSearchQueries(post: {
  title: string;
  keywords: string[];
}): string[] {
  const candidates = [
    post.keywords[0] ?? "",
    post.title,
    post.keywords[1] ?? "",
  ];

  const seen = new Set<string>();
  return candidates
    .map((query) => query.trim())
    .filter((query) => {
      if (query.length < 3 || seen.has(query.toLowerCase())) {
        return false;
      }
      seen.add(query.toLowerCase());
      return true;
    })
    .slice(0, 3);
}

function postProcessSuggested(
  suggested: ReviewSuggested | undefined,
  publishedSlugs: Set<string>,
  findings: ReviewFinding[],
): ReviewSuggested | null {
  if (!suggested) {
    return null;
  }

  const result: ReviewSuggested = {};

  if (suggested.title) {
    const title = normalizeDashes(suggested.title.trim());
    if (title.length >= 25 && title.length <= 70) {
      result.title = title;
    } else {
      findings.push({
        severity: "warning",
        category: "seo",
        title: "Suggested title discarded",
        detail: `The rewritten title was ${title.length} characters; the page requires 25 to 70 before the site suffix.`,
        fix: "Adjust the title manually or rerun the review.",
      });
    }
  }

  if (suggested.description) {
    result.description = clampDescription(
      normalizeDashes(suggested.description.trim()),
    );
  }

  if (suggested.content) {
    const html = sanitizeGeneratedHtml(normalizeDashes(suggested.content));
    const words = countWords(html);
    const invalidLink = Array.from(
      html.matchAll(/href="\/blog\/([a-z0-9-]+)"/g),
      (match) => match[1],
    ).find((slug) => !publishedSlugs.has(slug));

    if (words < 300) {
      findings.push({
        severity: "warning",
        category: "structure",
        title: "Suggested rewrite discarded",
        detail: `The rewritten article was only ${words} words, so it was not offered for apply.`,
        fix: "Rerun the review or edit the article manually.",
      });
    } else if (invalidLink) {
      findings.push({
        severity: "warning",
        category: "links",
        title: "Suggested rewrite discarded",
        detail: `The rewritten article linked to "/blog/${invalidLink}", which is not a published post.`,
        fix: "Fix the internal link and rerun the review.",
      });
    } else {
      result.content = html;
    }
  }

  return Object.keys(result).length > 0 ? result : null;
}

async function persistFailure(
  postId: string,
  model: string,
  error: unknown,
): Promise<string> {
  const message =
    error instanceof Error ? error.message : "Unknown article review error";

  await prisma.articleReview
    .create({
      data: {
        postId,
        model,
        status: "failed",
        error: message.slice(0, 2000),
      },
    })
    .catch((persistError) => {
      console.error("Failed to persist review failure:", persistError);
    });

  return message;
}

export async function runArticleReview(postId: string): Promise<ReviewResult> {
  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post) {
    throw new Error("Post not found.");
  }

  const settings = await getReviewSettings();

  const publishedPosts = await prisma.post.findMany({
    where: { published: true },
    select: { title: true, slug: true },
  });
  const publishedSlugs = new Set(publishedPosts.map((entry) => entry.slug));

  let searchResults: SearchResult[] = [];
  let degradedSearch = true;

  if (settings.webSearch) {
    const outcome = await searchWeb(buildSearchQueries(post), 3);
    searchResults = outcome.results;
    degradedSearch = outcome.degraded;
  }

  const context: ReviewContextValues = {
    today: new Date().toISOString().slice(0, 10),
    articleTitle: post.title,
    articleDescription: post.description,
    articleSlug: post.slug,
    articlePrimaryKeyword: post.keywords[0] ?? "(none recorded)",
    articleKeywords: post.keywords.join(", ") || "(none recorded)",
    articleTags: post.tags.join(", ") || "(none recorded)",
    articleContent: post.content,
    searchResults: formatSearchResults(searchResults),
    publishedPosts:
      publishedPosts.length > 0
        ? publishedPosts
            .map((entry) => `- ${entry.title} (/blog/${entry.slug})`)
            .join("\n")
        : "No published posts yet.",
    authorProfile: buildAuthorProfile(),
  };

  const prompt = await getPrompt(PROMPT_KEYS.review);
  const messages = renderPrompt(
    PROMPT_REGISTRY[PROMPT_KEYS.review],
    prompt,
    context,
  );

  let modelResult;
  try {
    modelResult = await callModel({
      modelId: settings.modelId,
      messages,
      sessionId: `portfolio-review-${postId}-${Date.now()}`,
      temperature: 0.3,
      maxTokens: 8000,
      reasoningEffort: settings.reasoningEffort,
      timeoutMs: 180_000,
    });
  } catch (error) {
    const message = await persistFailure(
      postId,
      settings.modelId,
      error,
    );
    throw new Error(`Review model failed: ${message}`);
  }

  let parsed: z.infer<typeof reviewSchema>;
  try {
    parsed = reviewSchema.parse(extractJsonObject(modelResult.content));
  } catch (error) {
    const message = await persistFailure(
      postId,
      settings.modelId,
      "The review model returned a response that did not match the required JSON contract.",
    );
    console.error("Review JSON validation failed:", error);
    throw new Error(message);
  }

  const findings = parsed.findings;
  const suggested = postProcessSuggested(
    parsed.suggested,
    publishedSlugs,
    findings,
  );

  const review = await prisma.articleReview.create({
    data: {
      postId,
      model: settings.modelId,
      status: "completed",
      usedWebSearch: searchResults.length > 0,
      claims: (parsed.claims ?? []) as Prisma.InputJsonValue,
      findings: findings as Prisma.InputJsonValue,
      seoNotes: (parsed.seoNotes ?? null) as Prisma.InputJsonValue,
      suggested: (suggested ?? null) as Prisma.InputJsonValue,
      sources: (parsed.sources ?? []) as Prisma.InputJsonValue,
      inputTokens: modelResult.inputTokens ?? null,
      outputTokens: modelResult.outputTokens ?? null,
      cost: modelResult.cost ?? null,
    },
  });

  return {
    reviewId: review.id,
    postId,
    model: settings.modelId,
    status: "completed",
    usedWebSearch: searchResults.length > 0,
    degradedSearch,
    claims: parsed.claims ?? [],
    findings,
    seoNotes: parsed.seoNotes ?? null,
    suggested,
    sources: parsed.sources ?? [],
    inputTokens: modelResult.inputTokens,
    outputTokens: modelResult.outputTokens,
    cost: modelResult.cost,
    createdAt: review.createdAt.toISOString(),
  };
}
