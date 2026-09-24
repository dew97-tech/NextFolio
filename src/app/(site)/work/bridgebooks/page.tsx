import { bridgeBooksCaseStudy } from "@/data/bridgebooks-case-study";
import { resumeData } from "@/data/resume";
import type { Metadata } from "next";
import Link from "next/link";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "BridgeBooks System case study",
  description:
    "How I helped build BridgeBooks article-generation infrastructure and improved reliability, model API costs, and page performance.",
  alternates: {
    canonical: "/work/bridgebooks",
  },
  openGraph: {
    type: "article",
    title: "BridgeBooks System case study",
    description:
      "Building AI article-generation infrastructure and improving reliability, model API costs, and page performance.",
  },
};

export default function BridgeBooksCaseStudy() {
  const { personal } = resumeData;

  return (
    <article className="mx-auto w-full max-w-[1180px] px-5 pb-24 pt-10 md:px-8 md:pt-14">
      <Link
        href="/#projects"
        className="link-draw font-mono text-sm text-clay-text hover:text-ink-brown"
      >
        Back to selected work
      </Link>

      <header className="mt-10 max-w-[850px] border-b border-border pb-10 md:mt-14">
        <p className="font-mono text-sm tabular-nums text-ink-faint">
          JB Connect Ltd. · Software Engineer · Oct 2024 - Present
        </p>
        <h1 className="mt-5 font-serif text-[clamp(2.5rem,5.5vw,4rem)] leading-[1.08] tracking-[-0.025em] text-ink-brown">
          {bridgeBooksCaseStudy.title}
        </h1>
        <p className="mt-5 max-w-[68ch] text-lg leading-relaxed text-ink-muted">
          {bridgeBooksCaseStudy.summary}
        </p>
      </header>

      <section aria-labelledby="results-heading" className="mt-10">
        <h2 id="results-heading" className="sr-only">
          Results
        </h2>
        <dl className="grid border-y border-border sm:grid-cols-3">
          {bridgeBooksCaseStudy.results.map((result, index) => (
            <div
              key={result.value}
              className={`py-6 ${index > 0 ? "border-t border-border sm:border-l sm:border-t-0 sm:pl-6" : "sm:pr-6"} ${index === 1 ? "sm:px-6" : ""} ${index === 2 ? "sm:pl-6" : ""}`}
            >
              <dt className="font-mono text-sm leading-relaxed text-ink-muted">
                {result.label}
              </dt>
              <dd className="mt-1 font-serif text-4xl tracking-[-0.02em] text-ink-brown">
                {result.value}
              </dd>
              <dd className="mt-2 max-w-[32ch] text-base leading-relaxed text-ink-muted">
                {result.detail}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <div className="mt-14 max-w-[900px]">
        <section className="grid gap-4 border-b border-border py-8 md:grid-cols-12 md:gap-8">
          <h2 className="font-serif text-2xl tracking-[-0.02em] text-ink-brown md:col-span-4">
            The work
          </h2>
          <div className="space-y-4 text-base leading-relaxed text-ink-muted md:col-span-8">
            <p>{bridgeBooksCaseStudy.collaboration}</p>
            <p>
              The generation workload moved from AWS Lambda to containerized
              deployment. The failure rate reached 5% within three weeks of the
              change.
            </p>
          </div>
        </section>

        <section className="grid gap-4 border-b border-border py-8 md:grid-cols-12 md:gap-8">
          <h2 className="font-serif text-2xl tracking-[-0.02em] text-ink-brown md:col-span-4">
            Cost and performance
          </h2>
          <div className="space-y-4 text-base leading-relaxed text-ink-muted md:col-span-8">
            <p>
              Reworking model API usage reduced generation costs by 95%. SQL
              query tuning improved page load times by 70%.
            </p>
          </div>
        </section>

        <section className="grid gap-4 border-b border-border py-8 md:grid-cols-12 md:gap-8">
          <h2 className="font-serif text-2xl tracking-[-0.02em] text-ink-brown md:col-span-4">
            Systems around generation
          </h2>
          <div className="md:col-span-8">
            {bridgeBooksCaseStudy.workstreams.map((workstream) => (
              <div key={workstream.title} className="mb-8 last:mb-0">
                <h3 className="font-medium text-ink">{workstream.title}</h3>
                <ul className="mt-3 list-disc space-y-3 pl-5 text-base leading-relaxed marker:text-clay">
                  {workstream.items.map((item) => (
                    <li key={item} className="text-ink-muted">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </div>

      <nav
        aria-label="Case study actions"
        className="mt-12 flex flex-wrap gap-x-7 gap-y-3 text-sm"
      >
        <Link
          href="/#projects"
          className="link-draw text-clay-text hover:text-ink-brown"
        >
          Back to selected work
        </Link>
        <a
          href={`mailto:${personal.email}`}
          className="link-draw text-clay-text hover:text-ink-brown"
        >
          Contact me
        </a>
        <a
          href="/David_Mallick_CV.pdf"
          download="David_Mallick_CV.pdf"
          className="link-draw text-clay-text hover:text-ink-brown"
        >
          Download CV
        </a>
      </nav>
    </article>
  );
}
