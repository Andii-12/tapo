"use client";

import { motion } from "framer-motion";

export function LoadingState({ message }: { message: string }) {
  return (
    <div
      className="relative flex flex-col items-center justify-center gap-5 overflow-hidden py-24"
      role="status"
    >
      <div className="mystic-spinner" />
      <motion.p
        className="text-sm tracking-wide text-ink-muted"
        animate={{ opacity: [0.45, 1, 0.45] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
      >
        {message}
      </motion.p>
      <div className="flex gap-2 text-[10px] text-ink-soft" aria-hidden>
        {["✦", "☽", "✦"].map((s, i) => (
          <motion.span
            key={i}
            animate={{ opacity: [0.2, 1, 0.2], y: [0, -3, 0] }}
            transition={{
              duration: 1.8,
              delay: i * 0.25,
              repeat: Infinity,
            }}
          >
            {s}
          </motion.span>
        ))}
      </div>
    </div>
  );
}

export function ErrorState({
  title = "Алдаа гарлаа",
  message,
  onRetry,
}: {
  title?: string;
  message: string;
  onRetry?: () => void;
}) {
  return (
    <motion.div
      className="mx-auto max-w-md border border-border bg-bg-white p-8 text-center"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <p className="mb-2 text-xs tracking-[0.2em] text-ink-soft">⚠</p>
      <h2 className="font-serif text-2xl">{title}</h2>
      <p className="mt-3 text-sm text-ink-muted">{message}</p>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="mt-6 border border-ink px-5 py-2 text-sm transition hover:bg-ink hover:text-on-ink"
        >
          Дахин оролдох
        </button>
      ) : null}
    </motion.div>
  );
}
