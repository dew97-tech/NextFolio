import { Highlight } from "@/components/highlight";
import { Reveal } from "@/components/reveal";
import { SectionFolio, SectionHeading } from "@/components/section-heading";
import { resumeData } from "@/data/resume";

const projects = resumeData.experience.flatMap((job) =>
  job.projects.map((project) => ({
    name: project.name,
    description: project.description,
    highlight: project.highlight,
    achievements: project.achievements.slice(0, 4),
    company: job.company,
    date: job.date,
  })),
);

export function Projects() {
  return (
    <section
      id="projects"
      className="band-paper section-rule border-t border-border"
    >
      <div className="relative mx-auto w-full max-w-[1180px] px-5 py-20 md:px-8 md:py-28">
        <SectionFolio index={1} />
        <SectionHeading text="Selected work" sectionId="projects" />

        <div className="mt-12 md:mt-16">
          {projects.map((project, index) => (
            <Reveal key={`${project.company}-${project.name}`}>
              <article className="row-seq grid gap-5 border-t border-border py-10 md:grid-cols-12 md:gap-8 md:py-12">
                <div className="md:col-span-4">
                  <p className="font-mono text-[12px] tabular-nums text-ink-faint">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-2 text-lg font-semibold text-foreground">
                    {project.name}
                  </h3>
                  <p className="mt-2 font-mono text-[13px] leading-relaxed text-ink-faint">
                    {project.company}
                    <br />
                    {project.date}
                  </p>
                </div>

                <div className="md:col-span-8">
                  <p className="text-ink-muted">
                    <Highlight text={project.description} phrase={project.highlight} />
                  </p>
                  <ul className="mt-5 list-disc space-y-2.5 pl-5 text-[15px] marker:text-ink-faint">
                    {project.achievements.map((achievement) => (
                      <li key={achievement} className="text-ink-muted">
                        <Highlight text={achievement} phrase={project.highlight} />
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
