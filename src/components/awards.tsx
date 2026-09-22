import { Reveal } from "@/components/reveal";
import {
  RuleCross,
  SectionFolio,
  SectionHeading,
} from "@/components/section-heading";
import { resumeData } from "@/data/resume";

export function Awards() {
  return (
    <section
      id="awards"
      className="band-surface section-rule"
    >
      <div className="relative mx-auto w-full max-w-[1180px] px-5 py-20 md:px-8 md:py-28">
        <SectionFolio index={4} />
        <RuleCross />
        <SectionHeading text="Awards" sectionId="awards" />

        <div className="reveal-stagger mt-12 grid gap-x-12 gap-y-9 md:grid-cols-2">
          {resumeData.awards.map((award) => (
            <Reveal key={award.title}>
              <div>
                <h3 className="font-medium text-ink">{award.title}</h3>
                <p className="mt-1.5 text-base leading-relaxed text-ink-muted">
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
