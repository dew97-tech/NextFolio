export type CaseStudyResult = {
  value: string;
  label: string;
  detail: string;
};

export type CaseStudyWorkstream = {
  title: string;
  items: readonly string[];
};

export type CaseStudySection = {
  title: string;
  paragraphs?: readonly string[];
  workstreams?: readonly CaseStudyWorkstream[];
};

export type CaseStudy = {
  href: string;
  title: string;
  summary: string;
  company: string;
  role: string;
  date: string;
  collaboration: string;
  description: string;
  ogDescription: string;
  results: readonly CaseStudyResult[];
  sections: readonly CaseStudySection[];
};
