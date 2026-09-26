import { resumeData } from "@/data/resume";

export function Footer() {
  const { personal } = resumeData;

  return (
    <footer id="contact" className="paper-canvas band-invert border-t border-border">
      <div className="mx-auto w-full max-w-[1180px] px-5 md:px-8">
        <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3 border-b border-border py-5">
          <p className="font-mono text-sm text-ink-faint">End of record</p>
          <a
            href="#main-content"
            className="link-draw back-to-top group inline-flex items-center gap-1.5 text-sm text-clay-text hover:text-ink-brown"
          >
            Back to top
            <span
              aria-hidden="true"
              className="back-to-top-arrow opacity-0 transition-opacity duration-200 group-hover:opacity-100"
            >
              ↑
            </span>
          </a>
        </div>
      </div>

      <div className="mx-auto grid w-full max-w-[1180px] gap-10 px-5 py-14 md:grid-cols-12 md:gap-8 md:px-8 md:py-16">
        <div className="md:col-span-5">
          <p className="font-serif text-lg tracking-tight text-ink-brown">
            {personal.name}
          </p>
          <p className="mt-2 text-sm text-ink-muted">{personal.location}</p>
        </div>

        <div className="md:col-span-4 md:col-start-9">
          <h2 className="text-sm font-medium text-ink-brown">Contact</h2>
          <ul className="mt-2 space-y-0.5 text-sm">
            <li>
              <a
                href={`mailto:${personal.email}`}
                className="inline-block py-1 text-clay-text underline decoration-1 decoration-clay underline-offset-4 transition-colors hover:text-ink-brown hover:decoration-ink-brown"
              >
                {personal.email}
              </a>
            </li>
            <li>
              <a
                href={personal.github}
                target="_blank"
                rel="noreferrer"
                className="inline-block py-1 text-clay-text underline decoration-1 decoration-clay underline-offset-4 transition-colors hover:text-ink-brown hover:decoration-ink-brown"
              >
                GitHub
              </a>
            </li>
            <li>
              <a
                href={personal.linkedin}
                target="_blank"
                rel="noreferrer"
                className="inline-block py-1 text-clay-text underline decoration-1 decoration-clay underline-offset-4 transition-colors hover:text-ink-brown hover:decoration-ink-brown"
              >
                LinkedIn
              </a>
            </li>
          </ul>
        </div>

        <div className="md:col-span-12">
          <p className="border-t border-border pt-6 font-mono text-sm text-ink-faint">
            {new Date().getFullYear()} David Dew Mallick
          </p>
        </div>
      </div>
    </footer>
  );
}
