import { TypeLine } from "@/components/type-line";
import { cn } from "@/lib/utils";

export function SectionHeading({
  text,
  sectionId,
  className,
}: {
  text: string;
  sectionId: string;
  className?: string;
}) {
  return (
    <h2
      className={cn(
        "font-serif text-[clamp(1.75rem,3vw,2.25rem)] leading-tight tracking-[-0.02em] text-ink-brown",
        className,
      )}
    >
      <TypeLine
        text={text}
        trigger="view"
        caret={false}
        speedMs={28}
        sectionId={sectionId}
        retrigger
      />
    </h2>
  );
}

export function RuleCross() {
  return <span className="rule-cross" aria-hidden="true" />;
}
