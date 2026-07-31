"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CardBack } from "./TarotCard";
import { Button } from "@/components/ui/Button";
import {
  MysticAtmosphere,
  fadeUp,
  staggerContainer,
} from "@/components/ui/MysticAtmosphere";

export function CardSelector({
  cardIds,
  requiredCount,
  onComplete,
  readingTitle,
}: {
  cardIds: string[];
  requiredCount: number;
  onComplete: (selectedIds: string[]) => Promise<void> | void;
  readingTitle: string;
}) {
  const [selected, setSelected] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [rippleId, setRippleId] = useState<string | null>(null);
  const done = selected.length >= requiredCount;

  const counterText = useMemo(() => {
    return `${requiredCount} хөзрөөс ${selected.length}-ийг сонголоо`;
  }, [requiredCount, selected.length]);

  async function handleSelect(id: string) {
    if (done || selected.includes(id) || submitting) return;
    setRippleId(id);
    window.setTimeout(() => setRippleId(null), 600);
    const next = [...selected, id];
    setSelected(next);
    if (next.length === requiredCount) {
      setSubmitting(true);
      try {
        await onComplete(next);
      } finally {
        setSubmitting(false);
      }
    }
  }

  return (
    <section className="relative overflow-hidden py-10">
      <MysticAtmosphere density={22} />
      <div className="container-page relative z-10">
        <motion.div
          className="mx-auto max-w-3xl text-center"
          initial="hidden"
          animate="show"
          variants={staggerContainer}
        >
          <motion.p
            variants={fadeUp}
            className="text-xs tracking-[0.28em] text-ink-soft"
          >
            ✦ СОНГОЛТ ✦
          </motion.p>
          <motion.h1
            variants={fadeUp}
            className="mt-3 font-serif text-3xl md:text-4xl"
          >
            {readingTitle}
          </motion.h1>
          <motion.p variants={fadeUp} className="mt-3 text-sm text-ink-muted">
            Асуултаа дотроо бодож, танд татагдсан хөзрүүдээ сонгоно уу.
          </motion.p>
          <motion.p
            variants={fadeUp}
            className="mt-4 text-sm tracking-wide"
            aria-live="polite"
          >
            {counterText}
          </motion.p>
          <motion.div
            className="mx-auto mt-4 h-px w-24 origin-center bg-ink/30"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          />
        </motion.div>

        <div className="tarot-grid relative mt-10">
          {cardIds.map((id, index) => {
            const isSelected = selected.includes(id);
            const selectedIndex = selected.indexOf(id);
            return (
              <div key={id} className="relative">
                <AnimatePresence>
                  {rippleId === id ? (
                    <motion.span
                      className="pointer-events-none absolute inset-0 z-20 rounded-sm border border-ink"
                      initial={{ opacity: 0.7, scale: 1 }}
                      animate={{ opacity: 0, scale: 1.35 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.55 }}
                    />
                  ) : null}
                </AnimatePresence>
                <CardBack
                  index={index}
                  selected={isSelected}
                  selectedIndex={isSelected ? selectedIndex : undefined}
                  disabled={done && !isSelected}
                  onClick={() => handleSelect(id)}
                  label={`Хөзөр ${index + 1}`}
                />
              </div>
            );
          })}
        </div>

        <AnimatePresence>
          {submitting ? (
            <motion.div
              className="mt-10 flex flex-col items-center gap-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <div className="mystic-spinner" />
              <Button loading>Таны тайлбарыг боловсруулж байна…</Button>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </section>
  );
}
