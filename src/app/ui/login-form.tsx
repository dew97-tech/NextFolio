"use client";

import { authenticate } from "@/app/lib/actions";
import { CircleNotch } from "@phosphor-icons/react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

export default function LoginForm() {
  const [errorMessage, formAction] = useActionState(authenticate, undefined);

  return (
    <form action={formAction} className="space-y-5">
      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-medium text-foreground">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          spellCheck={false}
          placeholder="you@example.com"
          className="h-11 w-full rounded border border-input bg-surface px-3 text-base text-ink placeholder:text-ink-faint"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="block text-sm font-medium text-foreground">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={6}
          autoComplete="current-password"
          placeholder="At least 6 characters"
          className="h-11 w-full rounded border border-input bg-surface px-3 text-base text-ink placeholder:text-ink-faint"
        />
      </div>

      {errorMessage && (
        <p role="alert" className="text-sm text-danger">
          {errorMessage}
        </p>
      )}

      <LoginButton />
    </form>
  );
}

function LoginButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-11 w-full items-center justify-center gap-2 rounded bg-primary px-4 text-sm font-medium text-primary-foreground transition-[background-color,transform] hover:bg-[var(--clay-deep-hover)] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60"
    >
      {pending && <CircleNotch size={16} className="animate-spin" aria-hidden="true" />}
      <span>{pending ? "Signing in\u2026" : "Sign in"}</span>
    </button>
  );
}
