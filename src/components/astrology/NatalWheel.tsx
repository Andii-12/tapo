"use client";

import { motion } from "framer-motion";
import type { NatalChartResult, PlanetId } from "@/lib/astrology/natal";

const SIGNS = [
  { symbol: "♈", name: "Aries" },
  { symbol: "♉", name: "Taurus" },
  { symbol: "♊", name: "Gemini" },
  { symbol: "♋", name: "Cancer" },
  { symbol: "♌", name: "Leo" },
  { symbol: "♍", name: "Virgo" },
  { symbol: "♎", name: "Libra" },
  { symbol: "♏", name: "Scorpio" },
  { symbol: "♐", name: "Sagittarius" },
  { symbol: "♑", name: "Capricorn" },
  { symbol: "♒", name: "Aquarius" },
  { symbol: "♓", name: "Pisces" },
];

const PLANET_TONE: Record<PlanetId, string> = {
  sun: "#8a7d64",
  moon: "#c8cdd4",
  mercury: "#8fa89a",
  venus: "#c4a08a",
  mars: "#b07060",
  jupiter: "#b89a5a",
  saturn: "#8a93a0",
};

function polar(cx: number, cy: number, r: number, deg: number) {
  const a = ((deg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
}

function ringSegment(
  cx: number,
  cy: number,
  rInner: number,
  rOuter: number,
  startDeg: number,
  endDeg: number
) {
  const s1 = polar(cx, cy, rOuter, startDeg);
  const e1 = polar(cx, cy, rOuter, endDeg);
  const e2 = polar(cx, cy, rInner, endDeg);
  const s2 = polar(cx, cy, rInner, startDeg);
  const large = endDeg - startDeg > 180 ? 1 : 0;
  return [
    `M ${s1.x} ${s1.y}`,
    `A ${rOuter} ${rOuter} 0 ${large} 1 ${e1.x} ${e1.y}`,
    `L ${e2.x} ${e2.y}`,
    `A ${rInner} ${rInner} 0 ${large} 0 ${s2.x} ${s2.y}`,
    "Z",
  ].join(" ");
}

export function NatalWheel({
  natal,
  size = 440,
  highlight,
}: {
  natal: NatalChartResult;
  size?: number;
  highlight?: PlanetId;
}) {
  const cx = size / 2;
  const cy = size / 2;
  const rOuter = size * 0.42;
  const rZodiacOuter = size * 0.42;
  const rZodiacInner = size * 0.33;
  const rPlanet = size * 0.255;
  const rInner = size * 0.16;
  const uid = `nw-${natal.birthDate.replace(/-/g, "")}`;

  // Spread overlapping planets slightly
  const plotted = [...natal.planets]
    .sort((a, b) => a.longitude - b.longitude)
    .reduce<Array<(typeof natal.planets)[number] & { lon: number }>>(
      (acc, p) => {
        let lon = p.longitude;
        if (acc.length > 0) {
          const prev = acc[acc.length - 1];
          const gap = (lon - prev.lon + 360) % 360;
          if (gap < 8) lon = (prev.lon + 8) % 360;
        }
        acc.push({ ...p, lon });
        return acc;
      },
      []
    );

  return (
    <motion.div
      className="relative mx-auto w-full max-w-[440px]"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        className="pointer-events-none absolute inset-[-8%] rounded-full opacity-70"
        style={{
          background:
            "radial-gradient(circle at 50% 45%, color-mix(in srgb, var(--ink) 10%, transparent), transparent 68%)",
        }}
      />
      <svg
        viewBox={`0 0 ${size} ${size}`}
        width="100%"
        height="auto"
        className="relative z-[1] drop-shadow-[0_20px_40px_color-mix(in_srgb,var(--ink)_12%,transparent)]"
        aria-label="Natal chart wheel"
        role="img"
      >
        <defs>
          <radialGradient id={`${uid}-disk`} cx="50%" cy="45%" r="55%">
            <stop offset="0%" stopColor="var(--bg-white)" stopOpacity="1" />
            <stop offset="70%" stopColor="var(--bg)" stopOpacity="0.95" />
            <stop offset="100%" stopColor="var(--bg)" stopOpacity="1" />
          </radialGradient>
          <linearGradient id={`${uid}-ring`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--ink)" stopOpacity="0.55" />
            <stop offset="50%" stopColor="#8a7d64" stopOpacity="0.45" />
            <stop offset="100%" stopColor="var(--ink)" stopOpacity="0.45" />
          </linearGradient>
          <filter id={`${uid}-soft`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.2" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <circle cx={cx} cy={cy} r={rOuter + 8} fill={`url(#${uid}-disk)`} />

        {/* Zodiac segments */}
        {SIGNS.map((sign, i) => {
          const start = i * 30;
          const end = start + 30;
          const mid = start + 15;
          const label = polar(cx, cy, (rZodiacOuter + rZodiacInner) / 2, mid);
          const even = i % 2 === 0;
          return (
            <g key={sign.name}>
              <path
                d={ringSegment(cx, cy, rZodiacInner, rZodiacOuter, start, end)}
                fill={
                  even
                    ? "color-mix(in srgb, var(--ink) 7%, transparent)"
                    : "color-mix(in srgb, var(--ink) 3%, transparent)"
                }
                stroke="color-mix(in srgb, var(--ink) 18%, transparent)"
                strokeWidth="0.6"
              />
              <text
                x={label.x}
                y={label.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={size * 0.038}
                fill="var(--ink)"
                opacity="0.72"
              >
                {sign.symbol}
              </text>
            </g>
          );
        })}

        {/* Degree ticks on zodiac inner edge */}
        {Array.from({ length: 72 }, (_, i) => {
          const deg = i * 5;
          const major = deg % 30 === 0;
          const a = polar(cx, cy, rZodiacInner, deg);
          const b = polar(
            cx,
            cy,
            rZodiacInner - (major ? 8 : 4),
            deg
          );
          return (
            <line
              key={deg}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke="var(--ink)"
              strokeWidth={major ? 1 : 0.4}
              opacity={major ? 0.35 : 0.15}
            />
          );
        })}

        {/* Outer & inner rings */}
        <circle
          cx={cx}
          cy={cy}
          r={rZodiacOuter}
          fill="none"
          stroke={`url(#${uid}-ring)`}
          strokeWidth="1.6"
        />
        <circle
          cx={cx}
          cy={cy}
          r={rZodiacInner}
          fill="none"
          stroke="var(--ink)"
          strokeWidth="0.8"
          opacity="0.35"
        />
        <circle
          cx={cx}
          cy={cy}
          r={rInner}
          fill="color-mix(in srgb, var(--bg-white) 88%, transparent)"
          stroke="var(--ink)"
          strokeWidth="1"
          opacity="0.9"
        />
        <circle
          cx={cx}
          cy={cy}
          r={rInner - 10}
          fill="none"
          stroke="#8a7d64"
          strokeWidth="0.7"
          opacity="0.45"
          strokeDasharray="2 3"
        />

        {/* House-like rays (subtle) */}
        {Array.from({ length: 12 }, (_, i) => {
          const p1 = polar(cx, cy, rInner, i * 30);
          const p2 = polar(cx, cy, rZodiacInner, i * 30);
          return (
            <line
              key={`ray-${i}`}
              x1={p1.x}
              y1={p1.y}
              x2={p2.x}
              y2={p2.y}
              stroke="var(--ink)"
              strokeWidth="0.5"
              opacity="0.12"
            />
          );
        })}

        {/* Planet markers */}
        {plotted.map((p) => {
          const pos = polar(cx, cy, rPlanet, p.lon);
          const tone = PLANET_TONE[p.id];
          const active = !highlight || highlight === p.id;
          const dim = highlight && highlight !== p.id;
          return (
            <g
              key={p.id}
              opacity={dim ? 0.28 : 1}
              filter={active ? `url(#${uid}-soft)` : undefined}
            >
              <circle
                cx={pos.x}
                cy={pos.y}
                r={size * 0.032}
                fill="var(--bg-white)"
                stroke={tone}
                strokeWidth="1.6"
              />
              <circle
                cx={pos.x}
                cy={pos.y}
                r={size * 0.042}
                fill="none"
                stroke={tone}
                strokeWidth="0.5"
                opacity="0.45"
              />
              <text
                x={pos.x}
                y={pos.y + 1}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={size * 0.034}
                fill="var(--ink)"
              >
                {p.glyph}
              </text>
              {/* Degree tick line toward center */}
              {(() => {
                const inner = polar(cx, cy, rPlanet - size * 0.045, p.lon);
                return (
                  <line
                    x1={pos.x}
                    y1={pos.y}
                    x2={inner.x}
                    y2={inner.y}
                    stroke={tone}
                    strokeWidth="1"
                    opacity="0.55"
                  />
                );
              })()}
            </g>
          );
        })}

        {/* Center life path */}
        <text
          x={cx}
          y={cy - 6}
          textAnchor="middle"
          dominantBaseline="middle"
          className="font-serif"
          fontSize={size * 0.09}
          fill="var(--ink)"
        >
          {natal.lifePath.number}
        </text>
        <text
          x={cx}
          y={cy + 18}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={size * 0.028}
          fill="var(--ink-soft)"
          letterSpacing="0.18em"
        >
          LIFE PATH
        </text>
      </svg>
    </motion.div>
  );
}

export function DegreeArc({
  degree,
  tone = "#8a7d64",
  size = 64,
}: {
  degree: number;
  tone?: string;
  size?: number;
}) {
  const r = size / 2 - 4;
  const cx = size / 2;
  const cy = size / 2;
  const pct = Math.min(30, Math.max(0, degree)) / 30;
  const large = pct > 0.5 ? 1 : 0;
  const toRad = (d: number) => ((d - 90) * Math.PI) / 180;
  const x1 = cx + r * Math.cos(toRad(0));
  const y1 = cy + r * Math.sin(toRad(0));
  const x2 = cx + r * Math.cos(toRad(pct * 360));
  const y2 = cy + r * Math.sin(toRad(pct * 360));

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden>
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke="color-mix(in srgb, var(--ink) 12%, transparent)"
        strokeWidth="3"
      />
      {pct > 0.01 ? (
        <path
          d={`M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`}
          fill="none"
          stroke={tone}
          strokeWidth="3"
          strokeLinecap="round"
        />
      ) : null}
      <text
        x={cx}
        y={cy + 1}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="11"
        fill="var(--ink)"
      >
        {Math.round(degree)}°
      </text>
    </svg>
  );
}

export { PLANET_TONE };
