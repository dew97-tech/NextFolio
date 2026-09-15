import { Reveal } from "@/components/reveal";
import { resumeData } from "@/data/resume";

const projects = resumeData.experience.flatMap((job) =>
  job.projects.map((project) => ({
    name: project.name,
    description: project.description,
    achievements: project.achievements.slice(0, 4),
    company: job.company,
    date: job.date,
  })),
);

export function Projects() {
  return (
    <section id="projects" className="border-t border-border">
      <div className="mx-auto w-full max-w-[1180px] px-5 py-20 md:px-8 md:py-28">
        <h2 className="font-serif text-[clamp(1.75rem,3vw,2.25rem)] leading-tight tracking-[-0.02em]">
          Selected work
        </h2>

        <div className="mt-12 space-y-16 md:mt-16 md:space-y-20">
          {projects.map((project) => (
            <Reveal key={`${project.company}-${project.name}`}>
              <article className="grid gap-5 md:grid-cols-12 md:gap-8">
                <div className="md:col-span-4">
                  <h3 className="text-lg font-semibold text-foreground">
                    {project.name}
                  </h3>
                  <p className="mt-2 font-mono text-[13px] leading-relaxed text-ink-faint">
                    {project.company}
                    <br />
                    {project.date}
                  </p>
                </div>

                <div className="md:col-span-8">
                  <p className="text-ink-muted">{project.description}</p>
                  <ul className="mt-5 space-y-2.5 text-[15px]">
                    {project.achievements.map((achievement) => (
                      <li key={achievement} className="flex gap-3">
                        <span
                          aria-hidden="true"
                          className="mt-[0.7em] h-px w-3 shrink-0 bg-rule-strong"
                        />
                        <span className="text-ink-muted">{achievement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
