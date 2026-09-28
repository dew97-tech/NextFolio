import { slugify } from "./slug";

export type TocHeading = {
  id: string;
  text: string;
  level: 2 | 3;
};

const HEADING_PATTERN = /<h([23])([^>]*)>([\s\S]*?)<\/h\1>/gi;

export function toPlainText(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function withHeadingAnchors(html: string): {
  content: string;
  headings: TocHeading[];
} {
  const headings: TocHeading[] = [];
  const usedIds = new Map<string, number>();

  const content = html.replace(
    HEADING_PATTERN,
    (match, level: string, attributes: string, inner: string) => {
      const text = toPlainText(inner);
      if (!text) return match;

      const existing = /\bid=["']([^"']+)["']/.exec(attributes);
      if (existing) {
        headings.push({ id: existing[1], text, level: Number(level) as 2 | 3 });
        return match;
      }

      const base = slugify(text) || "section";
      const seen = usedIds.get(base) ?? 0;
      usedIds.set(base, seen + 1);
      const id = seen === 0 ? base : `${base}-${seen + 1}`;

      headings.push({ id, text, level: Number(level) as 2 | 3 });

      return `<h${level}${attributes} id="${id}">${inner}</h${level}>`;
    },
  );

  return { content, headings };
}
