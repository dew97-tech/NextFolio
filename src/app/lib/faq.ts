import { toPlainText } from "./toc";

export type FaqEntry = {
  question: string;
  answer: string;
};

export function extractFaq(html: string): FaqEntry[] {
  const h2Pattern = /<h2[^>]*>([\s\S]*?)<\/h2>/gi;
  let faqStart = -1;
  let match: RegExpExecArray | null;

  while ((match = h2Pattern.exec(html))) {
    const headingText = toPlainText(match[1]);
    const isFaqHeading =
      /\bfaq\b/i.test(headingText) || /frequently asked/i.test(headingText);
    if (isFaqHeading) {
      faqStart = match.index + match[0].length;
      break;
    }
  }

  if (faqStart === -1) return [];

  const remaining = html.slice(faqStart);
  const nextH2 = /<h2[^>]*>/i.exec(remaining);
  const scoped = nextH2 ? remaining.slice(0, nextH2.index) : remaining;

  const entries: FaqEntry[] = [];
  const h3Pattern = /<h3[^>]*>([\s\S]*?)<\/h3>([\s\S]*?)(?=<h3[^>]*>|$)/gi;

  while ((match = h3Pattern.exec(scoped))) {
    const question = toPlainText(match[1]);
    const answer = toPlainText(match[2]);
    if (question && answer) {
      entries.push({ question, answer });
    }
  }

  return entries.slice(0, 6);
}
