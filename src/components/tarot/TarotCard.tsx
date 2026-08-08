"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { RevealAura } from "@/components/ui/MysticAtmosphere";
import { CardIcon } from "@/components/tarot/CardThumb";
import {
  cardImageSizes,
  cardThumbUrl,
  isRasterCardImage,
} from "@/lib/tarot/card-image";

export function CardBack({
  selected,
  selectedIndex,
  disabled,
  onClick,
  label,
  index = 0,
}: {
  selected?: boolean;
  selectedIndex?: number;
  disabled?: boolean;
  onClick?: () => void;
  label?: string;
  index?: number;
}) {
  return (
    <motion.button
      type="button"
      disabled={disabled}
      onClick={onClick}
      aria-label={label || "Таро хөзөр"}
      aria-pressed={selected}
      initial={{ opacity: 0, y: 16, rotateZ: -2 }}
      animate={{
        opacity: disabled && !selected ? 0.35 : 1,
        y: selected ? -6 : 0,
        rotateZ: 0,
        scale: selected ? 1.04 : 1,
      }}
      whileHover={
        disabled
          ? undefined
          : {
              y: -8,
              scale: 1.05,
              rotateZ: selected ? 0 : -1.5,
              transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] },
            }
      }
      whileTap={disabled ? undefined : { scale: 0.97 }}
      transition={{
        duration: 0.45,
        delay: Math.min(index * 0.012, 0.6),
        ease: [0.22, 1, 0.36, 1],
      }}
      className={`card-perspective relative aspect-[2/3] w-full rounded-sm border disabled:cursor-not-allowed ${
        selected ? "border-ink mystic-selected" : "border-transparent"
      }`}
    >
      {selected ? <RevealAura active /> : null}
      <div className="card-back-shell absolute inset-0 overflow-hidden rounded-sm p-[3px]">
        <div className="card-back-shimmer absolute inset-0 opacity-40" />
        <div className="relative flex h-full w-full flex-col items-center justify-center rounded-[2px] border border-card-back-fg/60">
          <motion.div
            className="relative flex h-8 w-8 items-center justify-center"
            animate={{ rotate: selected ? 360 : 0 }}
            transition={{
              duration: selected ? 8 : 0.4,
              repeat: selected ? Infinity : 0,
              ease: "linear",
            }}
          >
            <span className="absolute h-7 w-7 rounded-full border border-card-back-fg/50" />
            <motion.span
              className="absolute h-5 w-5 rounded-full border border-card-back-fg/80"
              animate={{ opacity: [0.45, 1, 0.45], scale: [0.92, 1.08, 0.92] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
            />
            <span className="text-[10px] text-card-back-fg">☽</span>
          </motion.div>
          <div className="mt-2 flex gap-2 text-[8px] text-card-back-fg/65">
            <motion.span
              animate={{ opacity: [0.35, 1, 0.35] }}
              transition={{ duration: 2.2, repeat: Infinity, delay: 0.2 }}
            >
              ✦
            </motion.span>
            <span>○</span>
            <motion.span
              animate={{ opacity: [0.35, 1, 0.35] }}
              transition={{ duration: 2.2, repeat: Infinity, delay: 0.8 }}
            >
              ✦
            </motion.span>
          </div>
        </div>
      </div>
      {selected && selectedIndex != null ? (
        <motion.span
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="absolute -right-1 -top-1 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-bg-white text-[10px] text-ink shadow-[0_0_0_1px_var(--ink)]"
        >
          {selectedIndex + 1}
        </motion.span>
      ) : null}
    </motion.button>
  );
}

export function CardFront({
  nameMn,
  imageUrl,
  keyword,
  flipped,
  slug,
}: {
  nameMn: string;
  imageUrl: string;
  keyword?: string;
  flipped?: boolean;
  slug?: string;
}) {
  return (
    <div className="card-perspective relative aspect-[2/3] w-full">
      <RevealAura active={Boolean(flipped)} />
      <motion.div
        className="relative h-full w-full"
        initial={false}
        animate={{
          rotateY: flipped ? 0 : 180,
          scale: flipped ? 1 : 0.98,
        }}
        transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformStyle: "preserve-3d" }}
      >
        <motion.div
          className={`absolute inset-0 flex flex-col items-center overflow-hidden rounded-sm border border-border bg-bg-white ${
            isRasterCardImage(imageUrl) ? "p-0" : "p-2"
          }`}
          style={{ backfaceVisibility: "hidden" }}
          animate={
            flipped
              ? {
                  boxShadow: [
                    "0 0 0 rgba(17,17,17,0)",
                    "0 12px 40px rgba(17,17,17,0.12)",
                    "0 6px 18px rgba(17,17,17,0.06)",
                  ],
                }
              : { boxShadow: "0 0 0 rgba(17,17,17,0)" }
          }
          transition={{ duration: 1.1 }}
        >
          {flipped ? (
            <motion.div
              className="reveal-flash pointer-events-none absolute inset-0"
              initial={{ opacity: 0.35 }}
              animate={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
            />
          ) : null}
          {isRasterCardImage(imageUrl) ? (
            <motion.div
              className="relative h-full w-full"
              initial={false}
              animate={flipped ? { opacity: 1, scale: 1 } : { opacity: 0.6, scale: 0.96 }}
              transition={{ delay: flipped ? 0.25 : 0, duration: 0.5 }}
            >
              <Image
                src={cardThumbUrl(imageUrl)}
                alt={nameMn}
                fill
                sizes={cardImageSizes(false)}
                className="object-cover"
              />
            </motion.div>
          ) : (
            <>
              <motion.div
                className="flex flex-1 flex-col items-center justify-center"
                initial={false}
                animate={flipped ? { opacity: 1, scale: 1 } : { opacity: 0.6, scale: 0.96 }}
                transition={{ delay: flipped ? 0.25 : 0, duration: 0.5 }}
              >
                {slug ? (
                  <CardIcon slug={slug} size={88} className="text-ink" />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={imageUrl}
                    alt={nameMn}
                    className="h-[70%] w-full object-contain"
                  />
                )}
              </motion.div>
              <motion.p
                className="mt-1 text-center font-serif text-sm"
                initial={false}
                animate={flipped ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
                transition={{ delay: flipped ? 0.35 : 0, duration: 0.4 }}
              >
                {nameMn}
              </motion.p>
              {keyword ? (
                <motion.p
                  className="pb-1 text-center text-[11px] tracking-[0.12em] text-ink-soft"
                  initial={false}
                  animate={flipped ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ delay: flipped ? 0.45 : 0 }}
                >
                  {keyword}
                </motion.p>
              ) : null}
            </>
          )}
        </motion.div>
        <div
          className="absolute inset-0"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <div className="card-back-shell absolute inset-0 overflow-hidden rounded-sm p-[3px]">
            <div className="card-back-shimmer absolute inset-0 opacity-40" />
            <div className="relative flex h-full w-full flex-col items-center justify-center rounded-[2px] border border-card-back-fg/60">
              <span className="text-[10px] text-card-back-fg">☽</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
