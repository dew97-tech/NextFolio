import { Reveal } from "@/components/reveal";
import { TypeLine } from "@/components/type-line";
import { resumeData } from "@/data/resume";
import { roleDuration, totalExperience } from "@/lib/experience";

export function Experience() {
  const total = totalExperience();

  return (
    <section id="experience" className="section-rule border-t border-border">
      <div className="mx-auto w-full max-w-[1180px] px-5 py-20 md:px-8 md:py-28">
        <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2">
          <h2 className="font-serif text-[clamp(1.75rem,3vw,2.25rem)] leading-tight tracking-[-0.02em]">
            <TypeLine text="Experience" trigger="view" caret={false} speedMs={28} />
          </h2>
          <p className="font-mono text-[13px] tabular-nums text-ink-muted">
            <TypeLine
              text={`${total.label} since ${total.sinceLabel}`}
              trigger="view"
              delayMs={450}
              highlight="4+ years"
            />
          </p>
        </div>

        <div className="mt-12 space-y-12 md:mt-16 md:space-y-14">
          {resumeData.experience.map((job) => {
            const duration = roleDuration(job.date);

            return (
              <Reveal key={job.company}>
                <article>
                  <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-1">
                    <h3 className="font-serif text-xl tracking-[-0.01em] text-foreground">
                      {job.company}
                    </h3>
                    <p className="font-mono text-[13px] tabular-nums text-ink-faint">
                      {job.date}
                      {duration ? ` · ${duration}` : ""}
                    </p>
                  </div>

                  <div className="max-w-[880px]">
                    <p className="mt-1.5 text-[15px] text-ink-muted">
                      {job.role} · {job.location}
                    </p>

                    {job.promotions.map((promotion) => (
                      <p key={promotion.role} className="mt-1 text-sm text-ink-faint">
                        Promoted from {promotion.role} ({promotion.date})
                      </p>
                    ))}

                    <ul className="mt-5 space-y-2.5">
                      {job.projects.map((project) => (
                        <li key={project.name} className="text-[15px] leading-relaxed">
                          <span className="font-medium text-foreground">
                            {project.name}.
                          </span>{" "}
                          <span className="text-ink-muted">{project.description}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
