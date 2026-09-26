import type { ChatMessage } from "./opencode-go";

export interface ImagePromptInput {
  title: string;
  description: string;
  tags: string[];
  content: string;
}

export const IMAGE_PROMPT_SYSTEM = `You are an art director writing image generation prompts for a technical engineering blog.

You receive a blog post's title, summary, tags, and an excerpt. You write one prompt that a person will paste into an image model such as GPT or Gemini to produce that article's cover image.

Return the prompt text only. No preamble, no labels, no quotation marks, no markdown, no line breaks.

WHAT THE IMAGE MUST BE
- Flat editorial illustration, the kind commissioned for a magazine feature on software engineering.
- Fine charcoal linework and flat charcoal fills on a warm neutral off-white background, close to #F4F4F5 with #232323 ink. Monochrome. A single slightly deeper grey is the only variation allowed.
- Geometric, diagrammatic, unhurried. The reader should find it calm and precise, never loud.
- One clear focal idea, described concretely. Name the specific subject drawn from the article rather than a generic topic.

COMPOSITION
- Landscape, 16:9 aspect ratio.
- The subject sits near the centre with generous negative space around it.

NEVER INCLUDE
- Text, letters, words, numbers, code, captions, labelled charts, UI screenshots, logos, watermarks, or signatures.
- Faces, people, hands, mascots, or cartoon characters.
- Gradients, glow, neon, glass, heavy shadows, 3D renders, or photographic realism.
- Robots, brains, neural networks, circuits, or anything suggesting artificial intelligence. This blog does not cover AI.
- Branded products or app icons.

Write four to six sentences. Describe the subject first, then the style, then the composition, then close with the exclusions that matter most for this particular subject.`;

function stripMarkup(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z#0-9]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function excerptOf(content: string, limit = 700): string {
  return stripMarkup(content).slice(0, limit);
}

function subjectOf(input: ImagePromptInput): string {
  const description = input.description.trim();
  if (description) return description;
  return input.title.trim();
}

export function buildImagePromptMessages(input: ImagePromptInput): ChatMessage[] {
  const tags = input.tags.length > 0 ? input.tags.join(", ") : "none";
  const excerpt = excerptOf(input.content) || "No excerpt available.";

  return [
    { role: "system", content: IMAGE_PROMPT_SYSTEM },
    {
      role: "user",
      content: `Write the cover image prompt for this article.

TITLE: ${input.title.trim() || "Untitled"}

SUMMARY: ${input.description.trim() || "No summary written yet."}

TAGS: ${tags}

EXCERPT:
${excerpt}

Return the prompt text only.`,
    },
  ];
}

export function cleanImagePrompt(raw: string): string {
  let text = raw.trim();

  text = text.replace(/^```[a-z]*\s*/i, "").replace(/```$/, "").trim();
  text = text.replace(/^(prompt|image prompt)\s*[:\-]\s*/i, "").trim();

  if (
    (text.startsWith('"') && text.endsWith('"')) ||
    (text.startsWith("'") && text.endsWith("'"))
  ) {
    text = text.slice(1, -1).trim();
  }

  return text.replace(/\s+/g, " ");
}

export function fallbackImagePrompt(input: ImagePromptInput): string {
  const subject = subjectOf(input) || "a software engineering concept";

  return [
    `Flat editorial illustration of ${subject}.`,
    "Fine charcoal linework and flat charcoal fills on a warm neutral off-white background, monochrome, calm and geometric.",
    "Landscape 16:9 with a single focal point near the centre and generous negative space around it.",
    "No text, letters, numbers, captions, logos, watermarks, faces, gradients, glow, neon, or 3D rendering.",
  ].join(" ");
}
