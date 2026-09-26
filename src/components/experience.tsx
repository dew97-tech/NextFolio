import { Reveal } from "@/components/reveal";
import { RuleCross, SectionHeading } from "@/components/section-heading";
import { TypeLine } from "@/components/type-line";
import { jobs } from "@/data/resume";
import { roleDuration, totalExperience } from "@/lib/experience";
import Link from "next/link";

export function Experience() {
  const total = totalExperience();

  return (
    <section
      id="experience"
      className="band-surface section-rule scroll-mt-20 md:scroll-mt-24"
    >
      <div className="relative mx-auto w-full max-w-[1180px] px-5 py-20 md:px-8 md:py-28">
        <RuleCross />
        <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2">
          <SectionHeading text="Experience" sectionId="experience" />
          <p className="font-mono text-sm tabular-nums text-ink-muted">
            <TypeLine
              text={`${total.label} since ${total.sinceLabel}`}
              trigger="view"
              delayMs={450}
              highlight="4+ years"
              sectionId="experience"
              retrigger
            />
          </p>
        </div>

        <div className="mt-12 space-y-12 md:mt-16 md:space-y-14">
          {jobs.map((job) => {
            const duration = roleDuration(job.date);
            const caseStudy = job.projects.find(
              (project) => project.href !== undefined,
            );

            return (
              <Reveal key={job.company}>
                <article>
                  <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-1">
                    <h3 className="font-serif text-xl tracking-[-0.01em] text-ink-brown">
                      {job.company}
                    </h3>
                    <p className="font-mono text-sm tabular-nums text-ink-faint">
                      {job.date}
                      {duration ? ` · ${duration}` : ""}
                    </p>
                  </div>

                  <p className="mt-1.5 text-base text-ink-muted">
                    {job.role} · {job.location}
                  </p>

                  {job.promotions.map((promotion) => (
                    <p key={promotion.role} className="mt-1 text-sm text-ink-faint">
                      Promoted from {promotion.role} ({promotion.date})
                    </p>
                  ))}

                  {caseStudy?.href ? (
                    <Link
                      href={caseStudy.href}
                      className="link-draw group mt-4 inline-flex items-center gap-2 text-sm text-clay-text hover:text-ink-brown"
                    >
                      {caseStudy.name} case study
                      <span
                        aria-hidden="true"
                        className="-translate-x-1 opacity-0 transition-[opacity,transform] duration-200 group-hover:translate-x-0 group-hover:opacity-100"
                      >
                        →
                      </span>
                    </Link>
                  ) : null}
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
