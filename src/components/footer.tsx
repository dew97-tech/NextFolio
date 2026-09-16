import { resumeData } from "@/data/resume";

export function Footer() {
  const { personal } = resumeData;

  return (
    <footer id="contact" className="border-t border-border">
      <div className="mx-auto grid w-full max-w-[1180px] gap-10 px-5 py-14 md:grid-cols-12 md:gap-8 md:px-8 md:py-16">
        <div className="md:col-span-5">
          <p className="font-serif text-lg tracking-tight text-foreground">
            {personal.name}
          </p>
          <p className="mt-2 text-sm text-ink-muted">{personal.location}</p>
        </div>

        <div className="md:col-span-4 md:col-start-9">
          <h2 className="text-sm font-medium text-foreground">Contact</h2>
          <ul className="mt-2 space-y-0.5 text-sm">
            <li>
              <a
                href={`mailto:${personal.email}`}
                className="inline-block py-1 text-ink-muted underline decoration-1 decoration-ink-faint underline-offset-4 transition-colors hover:text-foreground hover:decoration-foreground"
              >
                {personal.email}
              </a>
            </li>
            <li>
              <a
                href={personal.github}
                target="_blank"
                rel="noreferrer"
                className="inline-block py-1 text-ink-muted underline decoration-1 decoration-ink-faint underline-offset-4 transition-colors hover:text-foreground hover:decoration-foreground"
              >
                GitHub
              </a>
            </li>
            <li>
              <a
                href={personal.linkedin}
                target="_blank"
                rel="noreferrer"
                className="inline-block py-1 text-ink-muted underline decoration-1 decoration-ink-faint underline-offset-4 transition-colors hover:text-foreground hover:decoration-foreground"
              >
                LinkedIn
              </a>
            </li>
          </ul>
        </div>

        <div className="md:col-span-12">
          <p className="border-t border-border pt-6 font-mono text-xs text-ink-faint">
            {new Date().getFullYear()} David Dew Mallick
          </p>
        </div>
      </div>
    </footer>
  );
}
