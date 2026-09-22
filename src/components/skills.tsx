import { ArrowSquareOut } from "@phosphor-icons/react/ssr";
import { Reveal } from "@/components/reveal";
import {
  RuleCross,
  SectionFolio,
  SectionHeading,
} from "@/components/section-heading";
import { resumeData } from "@/data/resume";

export function Skills() {
  const { skills, education, publications } = resumeData;

  const groups = [
    { label: "Languages and frameworks", items: skills.languagesAndFrameworks },
    { label: "Cloud and platforms", items: skills.cloudAndPlatforms },
    { label: "Practices", items: skills.methodologies },
  ];

  return (
    <section
      id="skills"
      className="band-paper section-rule"
    >
      <div className="relative mx-auto w-full max-w-[1180px] px-5 py-20 md:px-8 md:py-28">
        <SectionFolio index={3} />
        <RuleCross />
        <SectionHeading text="Skills" sectionId="skills" />

        <Reveal className="mt-12 space-y-9">
          {groups.map((group) => (
            <div key={group.label} className="grid gap-3 md:grid-cols-12 md:gap-8">
              <h3 className="text-sm font-medium text-foreground md:col-span-3">
                {group.label}
              </h3>
              <ul className="chip-seq flex flex-wrap gap-2 md:col-span-9">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="inline-flex items-center rounded-sm border border-border px-2 py-1 text-sm leading-none text-ink-muted"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </Reveal>

        <Reveal className="mt-16 border-t border-border pt-10">
          <h3 className="font-serif text-xl tracking-[-0.01em] text-ink-brown">
            Education
          </h3>
          <ul className="mt-7 space-y-7">
            {education.map((entry) => (
              <li
                key={`${entry.degree}-${entry.date}`}
                className="grid gap-1.5 md:grid-cols-12 md:gap-8"
              >
                <p className="font-mono text-sm tabular-nums text-ink-faint md:col-span-3">
                  {entry.date}
                </p>
                <div className="md:col-span-6">
                  <p className="font-medium text-ink">{entry.degree}</p>
                  <p className="text-base text-ink-muted">{entry.institution}</p>
                </div>
                <p className="font-mono text-sm tabular-nums text-ink-faint md:col-span-3">
                  GPA {entry.gpa}
                </p>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal className="mt-16 border-t border-border pt-10">
          <h3 className="font-serif text-xl tracking-[-0.01em] text-ink-brown">
            Publications
          </h3>
          <ul className="mt-7 space-y-7">
            {publications.map((publication) => (
              <li key={publication.title} className="grid gap-1.5 md:grid-cols-12 md:gap-8">
                <p className="font-mono text-sm tabular-nums text-ink-faint md:col-span-3">
                  {publication.publisher}, {publication.date}
                </p>
                <div className="md:col-span-9">
                  <a
                    href={publication.link}
                    target="_blank"
                    rel="noreferrer"
                    className="group block"
                  >
                    <span className="block font-serif text-xl leading-snug tracking-[-0.01em] text-ink-brown transition-colors group-hover:text-clay-text">
                      {publication.title}
                    </span>
                    <span className="mt-2 inline-flex items-center gap-1.5 font-mono text-sm text-ink-faint underline decoration-1 decoration-clay underline-offset-4 transition-colors group-hover:text-clay-text group-hover:decoration-clay-text">
                      Read the paper
                      <ArrowSquareOut
                        size={13}
                        aria-hidden="true"
                        className="transition-transform duration-150 group-hover:-translate-y-0.5"
                      />
                    </span>
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
