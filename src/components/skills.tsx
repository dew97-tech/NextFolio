import { Reveal } from "@/components/reveal";
import { TypeLine } from "@/components/type-line";
import { resumeData } from "@/data/resume";

export function Skills() {
  const { skills, education, publications } = resumeData;

  const groups = [
    { label: "Languages and frameworks", items: skills.languagesAndFrameworks },
    { label: "Cloud and platforms", items: skills.cloudAndPlatforms },
    { label: "Practices", items: skills.methodologies },
  ];

  return (
    <section id="skills" className="section-rule border-t border-border">
      <div className="mx-auto w-full max-w-[1180px] px-5 py-20 md:px-8 md:py-28">
        <h2 className="font-serif text-[clamp(1.75rem,3vw,2.25rem)] leading-tight tracking-[-0.02em]">
          <TypeLine text="Skills" trigger="view" caret={false} speedMs={28} />
        </h2>

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
                    className="inline-flex items-center rounded border border-border px-2 py-1 text-[13px] leading-none text-ink-muted"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </Reveal>

        <Reveal className="mt-16 border-t border-border pt-10">
          <h3 className="font-serif text-xl tracking-[-0.01em]">Education</h3>
          <ul className="mt-7 space-y-7">
            {education.map((entry) => (
              <li
                key={`${entry.degree}-${entry.date}`}
                className="grid gap-1.5 md:grid-cols-12 md:gap-8"
              >
                <p className="font-mono text-[13px] tabular-nums text-ink-faint md:col-span-3">
                  {entry.date}
                </p>
                <div className="md:col-span-6">
                  <p className="font-medium text-foreground">{entry.degree}</p>
                  <p className="text-[15px] text-ink-muted">{entry.institution}</p>
                </div>
                <p className="font-mono text-[13px] tabular-nums text-ink-faint md:col-span-3">
                  GPA {entry.gpa}
                </p>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal className="mt-16 border-t border-border pt-10">
          <h3 className="font-serif text-xl tracking-[-0.01em]">Publications</h3>
          <ul className="mt-7 space-y-7">
            {publications.map((publication) => (
              <li key={publication.title} className="grid gap-1.5 md:grid-cols-12 md:gap-8">
                <p className="font-mono text-[13px] tabular-nums text-ink-faint md:col-span-3">
                  {publication.publisher}, {publication.date}
                </p>
                <div className="md:col-span-9">
                  <a
                    href={publication.link}
                    target="_blank"
                    rel="noreferrer"
                    className="underline decoration-1 decoration-ink-faint underline-offset-4 transition-colors hover:decoration-foreground"
                  >
                    {publication.title}
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
