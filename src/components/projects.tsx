import { Highlight } from "@/components/highlight";
import { Reveal } from "@/components/reveal";
import {
  RuleCross,
  SectionFolio,
  SectionHeading,
} from "@/components/section-heading";
import { resumeData } from "@/data/resume";
import { bridgeBooksCaseStudy } from "@/data/bridgebooks-case-study";
import Link from "next/link";

const projects = resumeData.experience.flatMap((job) =>
  job.projects.map((project) => ({
    name: project.name,
    description: project.description,
    highlight: project.highlight,
    achievements: project.achievements,
    company: job.company,
    date: job.date,
  })),
);

const otherProjects = projects.filter(
  (project) => project.name !== bridgeBooksCaseStudy.title,
);

export function Projects() {
  return (
    <section
      id="projects"
      className="band-paper section-rule scroll-mt-20 md:scroll-mt-24"
    >
      <div className="relative mx-auto w-full max-w-[1180px] px-5 py-20 md:px-8 md:py-28">
        <SectionFolio index={1} />
        <RuleCross />
        <SectionHeading text="Selected work" sectionId="projects" />

        <div className="mt-12 md:mt-16">
          <Reveal>
            <article className="grid gap-5 border-t border-border py-10 md:grid-cols-12 md:gap-8 md:py-12">
              <div className="md:col-span-4">
                <p className="font-mono text-xs tabular-nums text-ink-faint">01</p>
                <h3 className="mt-2 text-xl font-semibold text-ink">
                  {bridgeBooksCaseStudy.title}
                </h3>
                <p className="mt-2 font-mono text-sm leading-relaxed text-ink-faint">
                  JB Connect Ltd.
                  <br />
                  {bridgeBooksCaseStudy.date}
                </p>
              </div>

              <div className="md:col-span-8">
                <p className="text-ink-muted">{bridgeBooksCaseStudy.summary}</p>
                <p className="mt-3 text-base leading-relaxed text-ink-muted">
                  {bridgeBooksCaseStudy.collaboration}
                </p>

                <dl className="mt-7 grid gap-5 border-y border-border py-5 sm:grid-cols-3 sm:gap-6">
                  {bridgeBooksCaseStudy.results.map((result) => (
                    <div key={result.value}>
                      <dt className="font-mono text-sm leading-relaxed text-ink-muted">
                        {result.label}
                      </dt>
                      <dd className="mt-1 font-serif text-3xl tracking-[-0.02em] text-ink-brown">
                        {result.value}
                      </dd>
                    </div>
                  ))}
                </dl>

                <Link
                  href={bridgeBooksCaseStudy.href}
                  className="link-draw mt-6 inline-flex items-center gap-2 text-sm text-clay-text hover:text-ink-brown"
                >
                  Read the BridgeBooks case study <span aria-hidden="true">→</span>
                </Link>
              </div>
            </article>
          </Reveal>

          <h3 className="mt-10 font-serif text-2xl tracking-[-0.02em] text-ink-brown">
            Other selected work
          </h3>

          <div className="mt-4">
            {otherProjects.map((project, index) => {
              const selectedAchievement =
                project.achievements.find((achievement) =>
                  achievement
                    .toLowerCase()
                    .includes(project.highlight.toLowerCase()),
                ) ?? project.achievements[0];

              return (
                <Reveal key={`${project.company}-${project.name}`}>
                  <article className="row-seq grid gap-5 border-t border-border py-10 md:grid-cols-12 md:gap-8 md:py-12">
                    <div className="md:col-span-4">
                      <p className="font-mono text-xs tabular-nums text-ink-faint">
                        {String(index + 2).padStart(2, "0")}
                      </p>
                      <h3 className="mt-2 text-xl font-semibold text-ink">
                        {project.name}
                      </h3>
                      <p className="mt-2 font-mono text-sm leading-relaxed text-ink-faint">
                        {project.company}
                        <br />
                        {project.date}
                      </p>
                    </div>

                    <div className="md:col-span-8">
                      <p className="text-ink-muted">
                        <Highlight
                          text={project.description}
                          phrase={project.highlight}
                        />
                      </p>
                      {selectedAchievement ? (
                        <p className="mt-4 text-base leading-relaxed text-ink-muted">
                          <Highlight
                            text={selectedAchievement}
                            phrase={project.highlight}
                          />
                        </p>
                      ) : null}
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
