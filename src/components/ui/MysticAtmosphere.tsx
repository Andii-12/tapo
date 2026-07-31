"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";

type Particle = {
  id: number;
  left: string;
  top: string;
  size: number;
  delay: number;
  duration: number;
  opacity: number;
  accent: boolean;
  drift: number;
};

function makeParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: `${(i * 17 + 11) % 100}%`,
    top: `${(i * 29 + 7) % 100}%`,
    size: i % 5 === 0 ? 2 : i % 3 === 0 ? 1.5 : 1,
    delay: (i % 9) * 0.35,
    duration: 5.5 + (i % 6) * 1.1,
    opacity: 0.08 + (i % 5) * 0.05,
    accent: i % 10 === 0,
    drift: 12 + (i % 7) * 4,
  }));
}

export function MysticAtmosphere({
  density = 16,
  className = "",
}: {
  density?: number;
  className?: string;
}) {
  const particles = useMemo(() => makeParticles(density), [density]);

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden
    >
      <div className="mystic-veil absolute inset-0" />
      <div className="mystic-aurora absolute inset-0" />
      <motion.div
        className="absolute -left-[15%] top-[10%] h-[42vmin] w-[42vmin] rounded-full opacity-25"
        style={{
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--ink) 8%, transparent), transparent 68%)",
        }}
        animate={{ x: [0, 28, 0], y: [0, 18, 0], scale: [1, 1.08, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -right-[12%] bottom-[5%] h-[36vmin] w-[36vmin] rounded-full opacity-25"
        style={{
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--ink) 7%, transparent), transparent 70%)",
        }}
        animate={{ x: [0, -22, 0], y: [0, -14, 0], scale: [1, 1.12, 1] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />
      {particles.map((p) => (
        <motion.span
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            background: p.accent ? "var(--gold)" : "var(--ink)",
            opacity: p.accent ? 0.55 : 1,
          }}
          animate={{
            y: [0, -p.drift, 0],
            x: [0, (p.id % 2 === 0 ? 1 : -1) * (p.drift * 0.35), 0],
            opacity: [p.opacity * 0.25, p.opacity, p.opacity * 0.25],
            scale: [1, p.accent ? 1.4 : 1.25, 1],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

/** Soft site-wide magical layer behind all pages */
export function PageAmbient() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      <div className="page-cosmic absolute inset-0" />
      <div className="page-grain absolute inset-0 opacity-[0.03]" />
      <motion.div
        className="absolute left-1/2 top-[-18%] h-[55vmax] w-[55vmax] -translate-x-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--ink) 4%, transparent), transparent 70%)",
        }}
        animate={{ opacity: [0.25, 0.45, 0.25], scale: [1, 1.04, 1] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[-20%] left-[-10%] h-[40vmax] w-[40vmax] rounded-full"
        style={{
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--ink) 5%, transparent), transparent 72%)",
        }}
        animate={{ x: [0, 40, 0], opacity: [0.2, 0.35, 0.2] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

export function RevealAura({ active }: { active: boolean }) {
  if (!active) return null;
  return (
    <motion.div
      className="pointer-events-none absolute -inset-4 rounded-full"
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: [0.1, 0.28, 0.1], scale: [0.95, 1.06, 0.95] }}
      transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      style={{
        background:
          "radial-gradient(circle, color-mix(in srgb, var(--ink) 10%, transparent) 0%, transparent 70%)",
      }}
      aria-hidden
    />
  );
}

export const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export const staggerContainer = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.06, delayChildren: 0.08 },
  },
};
