import { Highlight } from "@/components/highlight";
import { Reveal } from "@/components/reveal";
import { RuleCross, SectionHeading } from "@/components/section-heading";
import { jobs } from "@/data/resume";
import { bridgeBooksCaseStudy } from "@/data/bridgebooks-case-study";
import Link from "next/link";

const projects = jobs.flatMap((job) =>
  job.projects.map((project) => ({
    name: project.name,
    description: project.description,
    highlight: project.highlight,
    achievements: project.achievements,
    stack: project.stack,
    outcomes: project.outcomes,
    company: job.company,
    date: job.date,
  })),
);

const otherProjects = projects.filter(
  (project) => project.name !== bridgeBooksCaseStudy.title,
);

const featuredStack =
  projects.find((project) => project.name === bridgeBooksCaseStudy.title)
    ?.stack ?? [];

export function Projects() {
  return (
    <section
      id="projects"
      className="band-paper section-rule scroll-mt-20 md:scroll-mt-24"
    >
      <div className="relative mx-auto w-full max-w-[1180px] px-5 py-20 md:px-8 md:py-28">
        <RuleCross />
        <SectionHeading text="Selected work" sectionId="projects" />

        <div className="mt-12 md:mt-16">
          <Reveal>
            <article className="grid gap-5 border-t border-border py-10 md:grid-cols-12 md:gap-8 md:py-12">
              <div className="md:col-span-4">
                <h3 className="text-xl font-semibold text-ink">
                  {bridgeBooksCaseStudy.title}
                </h3>
                <p className="eyebrow mt-2 leading-relaxed text-ink-faint">
                  JB Connect Ltd.
                  <br />
                  {bridgeBooksCaseStudy.date}
                </p>
                {featuredStack.length > 0 ? (
                  <ul className="mt-3 flex flex-wrap gap-1.5">
                    {featuredStack.map((tag) => (
                      <li key={tag} className="blog-tag">
                        {tag}
                      </li>
                    ))}
                  </ul>
                ) : null}
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
                  className="link-draw group mt-6 inline-flex items-center gap-2 text-sm text-clay-text hover:text-ink-brown"
                >
                  Read the {bridgeBooksCaseStudy.title} case study
                  <span
                    aria-hidden="true"
                    className="-translate-x-1 opacity-0 transition-[opacity,transform] duration-200 group-hover:translate-x-0 group-hover:opacity-100"
                  >
                    →
                  </span>
                </Link>
              </div>
            </article>
          </Reveal>

          <h3 className="mt-10 font-serif text-2xl tracking-[-0.02em] text-ink-brown">
            Other selected work
          </h3>

          <div className="mt-4">
            {otherProjects.map((project) => {
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
                      <h3 className="text-xl font-semibold text-ink">
                        {project.name}
                      </h3>
                      <p className="eyebrow mt-2 leading-relaxed text-ink-faint">
                        {project.company}
                        <br />
                        {project.date}
                      </p>
                      {project.stack.length > 0 ? (
                        <ul className="mt-3 flex flex-wrap gap-1.5">
                          {project.stack.map((tag) => (
                            <li key={tag} className="blog-tag">
                              {tag}
                            </li>
                          ))}
                        </ul>
                      ) : null}
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
                      {project.outcomes?.length ? (
                        <dl className="mt-5 border-y border-border py-4">
                          {project.outcomes.map((outcome) => (
                            <div key={outcome.label}>
                              <dt className="font-mono text-sm leading-relaxed text-ink-muted">
                                {outcome.label}
                              </dt>
                              <dd className="mt-1 font-serif text-3xl tracking-[-0.02em] text-ink-brown">
                                {outcome.value}
                              </dd>
                              <p className="mt-1 text-sm leading-relaxed text-ink-muted">
                                {outcome.detail}
                              </p>
                            </div>
                          ))}
                        </dl>
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
