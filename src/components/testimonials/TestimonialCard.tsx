"use client";

import type { TestimonialView } from "@/lib/content/testimonials";

function ThumbUp({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      aria-hidden
    >
      <path d="M7 11v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1h3Zm0 0V9.5A3.5 3.5 0 0 1 10.5 6H14l-.6-2.2A1.8 1.8 0 0 1 15.1 1.5L20 7.5V20a1 1 0 0 1-1 1h-7.5" />
    </svg>
  );
}

function ThumbDown({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      aria-hidden
    >
      <path d="M17 13V4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1h-3Zm0 0v1.5A3.5 3.5 0 0 1 13.5 18H10l.6 2.2a1.8 1.8 0 0 1-1.7 2.3L4 16.5V4a1 1 0 0 1 1-1h7.5" />
    </svg>
  );
}

export function TestimonialCard({
  item,
  compact,
}: {
  item: TestimonialView;
  compact?: boolean;
}) {
  const isGood = item.sentiment !== "bad";

  return (
    <article
      className={`flex h-full flex-col border border-border bg-bg-white ${
        compact ? "p-6" : "p-5 md:p-6"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-[10px] tracking-[0.2em] text-ink-soft">{item.tag}</p>
        <span
          className="inline-flex shrink-0 items-center gap-1.5 border border-border px-2 py-1 text-[10px] tracking-wide text-ink-muted"
          title={isGood ? "Сайн сэтгэгдэл" : "Муу сэтгэгдэл"}
        >
          {isGood ? (
            <ThumbUp className="h-3.5 w-3.5" />
          ) : (
            <ThumbDown className="h-3.5 w-3.5" />
          )}
          <span>{isGood ? "Сайн" : "Муу"}</span>
        </span>
      </div>
      <p
        className={`mt-3 flex-1 text-sm leading-relaxed text-ink-muted ${
          compact ? "line-clamp-5" : ""
        }`}
      >
        “{item.quote}”
      </p>
      <div className="mt-5">
        <p className="font-serif text-lg text-ink">{item.name}</p>
        {item.meta ? (
          <p className="text-xs text-ink-soft">{item.meta}</p>
        ) : null}
      </div>
    </article>
  );
}
