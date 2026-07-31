import type { ReactNode } from "react";
import Link from "next/link";

export function SitePage({
  eyebrow,
  title,
  lead,
  children,
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
  children: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden py-12 md:py-16">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(ellipse at 20% 0%, color-mix(in srgb, var(--ink) 4%, transparent), transparent 50%)",
        }}
      />
      <div className="container-page relative z-10">
        <div className="mx-auto max-w-2xl">
          {eyebrow ? (
            <p className="text-xs tracking-[0.28em] text-ink-soft">{eyebrow}</p>
          ) : null}
          <h1 className="mt-3 font-serif text-4xl md:text-5xl">{title}</h1>
          {lead ? (
            <p className="mt-4 text-sm leading-relaxed text-ink-muted">{lead}</p>
          ) : null}
          <div className="mt-8 space-y-8 text-sm leading-relaxed text-ink-muted">
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}

export function SiteSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div>
      <h2 className="font-serif text-xl text-ink md:text-2xl">{title}</h2>
      <div className="mt-3 space-y-3">{children}</div>
    </div>
  );
}

export function SiteBulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2 border-l border-border pl-4">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

export function SiteCtaRow({
  links,
}: {
  links: Array<{ href: string; label: string }>;
}) {
  return (
    <p className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-ink">
      {links.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          className="underline underline-offset-4 hover:opacity-70"
        >
          {l.label}
        </Link>
      ))}
    </p>
  );
}
