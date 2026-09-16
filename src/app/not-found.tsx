import Link from "next/link";

export default function NotFound() {
  return (
    <main
      id="main-content"
      className="flex min-h-screen flex-col items-center justify-center px-5 text-center"
    >
      <p className="font-mono text-[13px] text-ink-faint">404</p>
      <h1 className="mt-4 font-serif text-[clamp(2rem,5vw,3rem)] leading-tight tracking-[-0.02em] text-foreground">
        Page not found
      </h1>
      <p className="mt-3 max-w-[46ch] text-ink-muted">
        The page you were looking for does not exist or has moved.
      </p>
      <div className="mt-8 flex items-center gap-7 text-sm">
        <Link href="/" className="link-draw text-foreground">
          Home
        </Link>
        <Link href="/blog" className="link-draw text-ink-muted hover:text-foreground">
          Blog
        </Link>
      </div>
    </main>
  );
}
