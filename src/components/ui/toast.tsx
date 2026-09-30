"use client";

import { cn } from "@/lib/utils";
import {
  CaretDown,
  CheckCircle,
  Info,
  WarningCircle,
  X,
} from "@phosphor-icons/react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FocusEvent,
  type ReactNode,
} from "react";

export type ToastVariant = "success" | "info" | "error";

export interface ToastInput {
  variant: ToastVariant;
  label?: string;
  title: string;
  detail?: string;
}

interface ToastRecord extends ToastInput {
  id: number;
}

interface ToastContextValue {
  toast: (input: ToastInput) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const MAX_VISIBLE_TOASTS = 3;
const AUTO_DISMISS_MS = 6000;

const DEFAULT_LABELS: Record<ToastVariant, string> = {
  success: "Done",
  info: "Notice",
  error: "Something went wrong",
};

function ToastCard({
  record,
  onDismiss,
}: {
  record: ToastRecord;
  onDismiss: (id: number) => void;
}) {
  const duration = record.variant === "error" ? null : AUTO_DISMISS_MS;
  const timerRef = useRef<number | null>(null);
  const remainingRef = useRef(duration ?? 0);
  const startedAtRef = useRef(0);

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    if (duration === null) return;
    startedAtRef.current = Date.now();
    timerRef.current = window.setTimeout(
      () => onDismiss(record.id),
      remainingRef.current,
    );
  }, [duration, onDismiss, record.id]);

  useEffect(() => {
    startTimer();
    return clearTimer;
  }, [startTimer, clearTimer]);

  const pause = useCallback(() => {
    if (duration === null || timerRef.current === null) return;
    remainingRef.current = Math.max(
      0,
      remainingRef.current - (Date.now() - startedAtRef.current),
    );
    clearTimer();
  }, [clearTimer, duration]);

  const resume = useCallback(() => {
    if (duration === null || timerRef.current !== null) return;
    startTimer();
  }, [duration, startTimer]);

  const handleBlur = useCallback(
    (event: FocusEvent<HTMLDivElement>) => {
      if (event.currentTarget.contains(event.relatedTarget as Node | null)) {
        return;
      }
      resume();
    },
    [resume],
  );

  const Icon =
    record.variant === "success"
      ? CheckCircle
      : record.variant === "error"
        ? WarningCircle
        : Info;

  return (
    <div
      role={record.variant === "error" ? "alert" : "status"}
      onMouseEnter={pause}
      onMouseLeave={resume}
      onFocus={pause}
      onBlur={handleBlur}
      className={cn(
        "toast-in rounded border border-border bg-surface p-3.5",
        record.variant === "error" ? "border-l-2 border-l-danger" : null,
      )}
    >
      <div className="flex items-start gap-3">
        <Icon
          size={16}
          weight="fill"
          aria-hidden="true"
          className={cn(
            "mt-0.5 shrink-0",
            record.variant === "success"
              ? "text-ok"
              : record.variant === "error"
                ? "text-danger"
                : "text-ink-faint",
          )}
        />

        <div className="min-w-0 flex-1">
          <p className="eyebrow text-ink-faint">
            {record.label ?? DEFAULT_LABELS[record.variant]}
          </p>
          <p className="mt-1 text-sm font-medium leading-snug text-foreground">
            {record.title}
          </p>

          {record.detail ? (
            <details className="group mt-2">
              <summary className="inline-flex cursor-pointer list-none items-center gap-1 font-mono text-[11px] uppercase tracking-[0.08em] text-ink-muted transition-colors hover:text-foreground [&::-webkit-details-marker]:hidden">
                <span>Details</span>
                <CaretDown
                  size={10}
                  aria-hidden="true"
                  className="transition-transform group-open:rotate-180"
                />
              </summary>
              <pre className="mt-2 max-h-40 overflow-y-auto whitespace-pre-wrap break-words rounded border border-border bg-paper-soft p-2 font-mono text-[11px] leading-relaxed text-ink-muted">
                {record.detail}
              </pre>
            </details>
          ) : null}
        </div>

        <button
          type="button"
          onClick={() => onDismiss(record.id)}
          aria-label="Dismiss notification"
          className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded text-ink-faint transition-colors hover:text-foreground"
        >
          <X size={13} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastRecord[]>([]);
  const idRef = useRef(0);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((record) => record.id !== id));
  }, []);

  const toast = useCallback((input: ToastInput) => {
    idRef.current += 1;
    const record: ToastRecord = { ...input, id: idRef.current };
    setToasts((prev) => [...prev, record].slice(-MAX_VISIBLE_TOASTS));
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setToasts((prev) => prev.slice(0, -1));
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const value = useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ul
        aria-label="Notifications"
        className="pointer-events-none fixed bottom-5 right-5 z-[70] flex w-[calc(100vw-2.5rem)] max-w-sm flex-col gap-2"
      >
        {toasts.map((record) => (
          <li key={record.id} className="pointer-events-auto">
            <ToastCard record={record} onDismiss={dismiss} />
          </li>
        ))}
      </ul>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
