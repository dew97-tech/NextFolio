import { Reveal } from "@/components/reveal";
import { TypeLine } from "@/components/type-line";
import { resumeData } from "@/data/resume";

export function Awards() {
  return (
    <section id="awards" className="section-rule border-t border-border">
      <div className="mx-auto w-full max-w-[1180px] px-5 py-20 md:px-8 md:py-28">
        <h2 className="font-serif text-[clamp(1.75rem,3vw,2.25rem)] leading-tight tracking-[-0.02em]">
          <TypeLine text="Awards" trigger="view" caret={false} speedMs={28} />
        </h2>

        <div className="reveal-stagger mt-12 grid gap-x-12 gap-y-9 md:grid-cols-2">
          {resumeData.awards.map((award) => (
            <Reveal key={award.title}>
              <div>
                <h3 className="font-medium text-foreground">{award.title}</h3>
                <p className="mt-1.5 text-[15px] leading-relaxed text-ink-muted">
                  {award.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
