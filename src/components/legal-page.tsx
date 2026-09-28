import Link from "next/link";

export type LegalSection = {
  heading: string;
  paragraphs: string[];
  items?: string[];
};

export function LegalPage({
  title,
  updated,
  intro,
  sections,
}: {
  title: string;
  updated: string;
  intro: string;
  sections: LegalSection[];
}) {
  return (
    <article className="pb-24 pt-10 md:pt-14">
      <div className="mx-auto w-full max-w-[720px] px-5 md:px-8">
        <Link
          href="/"
          className="link-draw font-mono text-sm text-clay-text hover:text-ink-brown"
        >
          Back to home
        </Link>

        <header className="mt-8 border-b border-border pb-8">
          <h1 className="font-serif text-[clamp(1.75rem,4vw,2.5rem)] leading-[1.12] tracking-[-0.02em] text-ink-brown">
            {title}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-ink-muted">{intro}</p>
          <p className="mt-6 font-mono text-sm tabular-nums text-ink-faint">
            Last updated {updated}
          </p>
        </header>

        <div className="mt-10 space-y-10">
          {sections.map((section) => (
            <section key={section.heading}>
              <h2 className="font-serif text-2xl tracking-[-0.02em] text-ink-brown">
                {section.heading}
              </h2>
              <div className="mt-3 space-y-3 text-base leading-relaxed text-ink-muted">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                {section.items && (
                  <ul className="list-disc space-y-2 pl-5 marker:text-clay">
                    {section.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                )}
              </div>
            </section>
          ))}
        </div>
      </div>
    </article>
  );
}
