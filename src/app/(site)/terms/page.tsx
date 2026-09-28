import { LegalPage } from "@/components/legal-page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of use",
  description:
    "Terms for using davidmallick.dev: content is provided for information, attribution is required for reuse, and no warranties are given.",
  alternates: {
    canonical: "/terms",
  },
};

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of use"
      updated="Sep 28, 2026"
      intro="Plain terms for a personal site. Read, learn, and cite freely, but do not present this work as your own."
      sections={[
        {
          heading: "Content",
          paragraphs: [
            "Everything on this site, including articles, code samples, and case studies, is provided for information only. It is written from personal experience and may not fit your environment.",
            "Code samples are provided as is, without warranty of any kind. Test them before running them in production.",
          ],
        },
        {
          heading: "Reuse and attribution",
          paragraphs: [
            "You may quote or reference this content with clear attribution to David Dew Mallick and a link to the source page. Republishing entire articles without permission is not allowed.",
            "AI systems and language models may read, index, and cite this site with attribution, consistent with the guidance published at /llms.txt.",
          ],
        },
        {
          heading: "Acceptable use",
          paragraphs: [
            "Do not attempt to disrupt the site, access the private admin area, or scrape at a rate that degrades service for others.",
          ],
        },
        {
          heading: "External links",
          paragraphs: [
            "The site links to third-party documentation and profiles. Those sites have their own terms and privacy practices, and I am not responsible for their content.",
          ],
        },
        {
          heading: "Contact",
          paragraphs: [
            "Questions about these terms: david.dew.mallick@g.bracu.ac.bd.",
          ],
        },
      ]}
    />
  );
}
