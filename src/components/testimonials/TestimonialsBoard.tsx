"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { TestimonialCard } from "@/components/testimonials/TestimonialCard";
import { TestimonialForm } from "@/components/testimonials/TestimonialForm";
import type { TestimonialView } from "@/lib/content/testimonials";
import { STATIC_TESTIMONIALS } from "@/lib/content/testimonials";

function fallbackList(): TestimonialView[] {
  return STATIC_TESTIMONIALS.map((t) => ({
    id: t.slug,
    slug: t.slug,
    name: t.name,
    quote: t.quote,
    meta: t.meta,
    tag: t.tag,
    sentiment: t.sentiment,
    isStatic: true,
  }));
}

export function TestimonialsBoard({
  showForm = true,
  limit,
  showAllLink,
}: {
  showForm?: boolean;
  limit?: number;
  showAllLink?: boolean;
}) {
  const [items, setItems] = useState<TestimonialView[]>(fallbackList());
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/testimonials");
        const json = await res.json();
        if (!cancelled && res.ok && Array.isArray(json.data)) {
          setItems(json.data);
        }
      } catch {
        // keep fallback
      } finally {
        if (!cancelled) setLoaded(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const visible = limit ? items.slice(0, limit) : items;

  return (
    <div className="space-y-8">
      {showAllLink ? (
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs tracking-[0.28em] text-ink-soft">
              ✦ СЭТГЭГДЭЛ ✦
            </p>
            <h2 className="mt-2 font-serif text-3xl md:text-4xl">
              Үйлчлүүлэгчдийн сэтгэгдэл
            </h2>
          </div>
          <Link
            href="/uilchluulegchdiin-setgegdel"
            className="text-sm underline underline-offset-4"
          >
            Бүгдийг харах
          </Link>
        </div>
      ) : null}

      <div
        className={
          limit
            ? "grid items-stretch gap-5 md:grid-cols-3"
            : "space-y-5"
        }
      >
        {visible.map((t, i) => (
          <motion.div
            key={t.id}
            className={limit ? "h-full" : undefined}
            initial={loaded ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: Math.min(i * 0.06, 0.2), duration: 0.4 }}
          >
            <TestimonialCard item={t} compact={Boolean(limit)} />
          </motion.div>
        ))}
      </div>

      {showForm ? (
        <TestimonialForm
          onCreated={(item) => {
            if (item.status === "approved") {
              setItems((prev) => [item, ...prev]);
            }
          }}
        />
      ) : (
        <div className="border border-border bg-bg-white px-6 py-8 text-center">
          <p className="text-[10px] tracking-[0.22em] text-ink-soft">
            WRITE A REVIEW
          </p>
          <p className="mt-2 font-serif text-xl text-ink md:text-2xl">
            Сэтгэгдэл бичих үү?
          </p>
          <p className="mx-auto mt-2 max-w-md text-sm text-ink-muted">
            Таны туршлагыг бусадтай хуваалцаарай.
          </p>
          <div className="mt-5">
            <Link href="/uilchluulegchdiin-setgegdel">
              <Button>Сэтгэгдэл бичих</Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
