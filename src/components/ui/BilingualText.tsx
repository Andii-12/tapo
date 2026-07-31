"use client";

export type LangMode = "both" | "en" | "mn";

export function LangModeSwitch({
  value,
  onChange,
}: {
  value: LangMode;
  onChange: (v: LangMode) => void;
}) {
  const options: Array<{ id: LangMode; label: string }> = [
    { id: "both", label: "EN + MN" },
    { id: "en", label: "English" },
    { id: "mn", label: "Монгол" },
  ];

  return (
    <div
      className="inline-flex border border-border bg-bg-white p-0.5"
      role="group"
      aria-label="Language"
    >
      {options.map((opt) => {
        const active = value === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange(opt.id)}
            className={`px-3 py-1.5 text-xs tracking-wide transition ${
              active
                ? "bg-ink text-on-ink"
                : "text-ink-muted hover:text-ink"
            }`}
            aria-pressed={active}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

function Body({
  text,
  clamp,
  className = "",
}: {
  text: string;
  clamp?: boolean;
  className?: string;
}) {
  return (
    <p
      className={`text-sm leading-[1.75] text-ink-muted whitespace-pre-line ${
        clamp ? "line-clamp-5" : ""
      } ${className}`}
    >
      {text}
    </p>
  );
}

function LangPane({
  code,
  text,
  clamp,
}: {
  code: string;
  text: string;
  clamp?: boolean;
}) {
  return (
    <div className="min-w-0">
      <p className="mb-2 text-[10px] tracking-[0.18em] text-ink-soft">{code}</p>
      <Body text={text} clamp={clamp} />
    </div>
  );
}

export function BilingualText({
  en,
  mn,
  className = "",
  clamp,
  mode = "both",
}: {
  en?: string | null;
  mn?: string | null;
  className?: string;
  clamp?: boolean;
  mode?: LangMode;
}) {
  const e = (en || "").trim();
  const m = (mn || "").trim();
  if (!e && !m) return null;

  const showEn = mode === "en" || (mode === "both" && Boolean(e));
  const showMn = mode === "mn" || (mode === "both" && Boolean(m));
  const enText = showEn ? e : "";
  const mnText = showMn ? m : "";

  // Single language: clean paragraph, no EN/MN chrome
  if (mode === "en" || mode === "mn" || !(enText && mnText && enText !== mnText)) {
    const text =
      mode === "en"
        ? e || m
        : mode === "mn"
          ? m || e
          : enText || mnText || e || m;
    return (
      <div className={className}>
        <Body text={text} clamp={clamp} />
      </div>
    );
  }

  // Both languages: side-by-side on wide screens; stacked when clamped (narrow teasers)
  return (
    <div
      className={`grid gap-5 ${
        clamp
          ? "grid-cols-1"
          : "md:grid-cols-2 md:gap-0"
      } ${className}`}
    >
      <div className={clamp ? "" : "md:pr-6"}>
        <LangPane code="EN" text={enText} clamp={clamp} />
      </div>
      <div
        className={
          clamp
            ? "border-t border-border pt-5"
            : "border-t border-border pt-5 md:border-l md:border-t-0 md:pl-6 md:pt-0"
        }
      >
        <LangPane code="MN" text={mnText} clamp={clamp} />
      </div>
    </div>
  );
}

export function BilingualTitle({
  en,
  mn,
  mode = "both",
  as: Tag = "h3",
  className = "",
}: {
  en: string;
  mn: string;
  mode?: LangMode;
  as?: "h2" | "h3" | "h4" | "p";
  className?: string;
}) {
  if (mode === "en") {
    return <Tag className={`font-serif ${className}`}>{en}</Tag>;
  }
  if (mode === "mn") {
    return <Tag className={`font-serif ${className}`}>{mn}</Tag>;
  }
  return (
    <div className={className}>
      <Tag className="font-serif">{en}</Tag>
      <p className="mt-1 text-sm text-ink-muted">{mn}</p>
    </div>
  );
}
