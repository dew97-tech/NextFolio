import { augmentaCaseStudy } from "@/data/augmenta-case-study";
import { CaseStudyPage } from "@/components/case-study";
import type { Metadata } from "next";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Augmenta Education case study",
  description: augmentaCaseStudy.description,
  alternates: {
    canonical: "/work/augmenta",
  },
  openGraph: {
    type: "article",
    title: "Augmenta Education case study",
    description: augmentaCaseStudy.ogDescription,
  },
};

export default function AugmentaCaseStudy() {
  return <CaseStudyPage data={augmentaCaseStudy} />;
}
