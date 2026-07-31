"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { NatalChartResult, PlanetId } from "@/lib/astrology/natal";
import type {
  NatalFullReport,
  NatalPreviewReport,
} from "@/lib/astrology/report";
import { Button } from "@/components/ui/Button";
import {
  BilingualText,
  BilingualTitle,
  LangModeSwitch,
  type LangMode,
} from "@/components/ui/BilingualText";
import {
  DegreeArc,
  NatalWheel,
  PLANET_TONE,
} from "@/components/astrology/NatalWheel";

function isFullReport(
  report: NatalFullReport | NatalPreviewReport | null | undefined
): report is NatalFullReport {
  return Boolean(
    report && "lifePathDetailedMn" in report && "synthesisMn" in report
  );
}

function isPreviewReport(
  report: NatalFullReport | NatalPreviewReport | null | undefined
): report is NatalPreviewReport {
  return Boolean(report && "locked" in report && report.locked);
}

function PlacementCard({
  title,
  glyph,
  signEn,
  signMn,
  degree,
  roleEn,
  roleMn,
  meaningEn,
  meaningMn,
  keywordsEn,
  keywordsMn,
  detailedEn,
  detailedMn,
  tone,
  mode,
}: {
  title: string;
  glyph: string;
  signEn: string;
  signMn: string;
  degree?: number;
  roleEn: string;
  roleMn: string;
  meaningEn: string;
  meaningMn: string;
  keywordsEn?: string[];
  keywordsMn?: string[];
  detailedEn?: string;
  detailedMn?: string;
  tone: string;
  mode: LangMode;
}) {
  const keywords =
    mode === "en"
      ? keywordsEn
      : mode === "mn"
        ? keywordsMn
        : keywordsEn?.length
          ? keywordsEn
          : keywordsMn;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45 }}
      className="relative overflow-hidden border border-border bg-bg-white p-5"
    >
      <div
        className="pointer-events-none absolute -right-8 -top-10 h-28 w-28 rounded-full opacity-30"
        style={{
          background: `radial-gradient(circle, ${tone}, transparent 70%)`,
        }}
      />
      <div className="relative flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] tracking-[0.22em] text-ink-soft">{title}</p>
          <p className="mt-2 font-serif text-2xl md:text-3xl">
            <span className="mr-2" style={{ color: tone }} aria-hidden>
              {glyph}
            </span>
            {signEn}
          </p>
          <p className="mt-1 text-sm text-ink-muted">
            {signMn}
            {degree != null ? ` · ${degree}°` : ""}
          </p>
        </div>
        {degree != null ? <DegreeArc degree={degree} tone={tone} size={56} /> : null}
      </div>
      <div className="relative mt-4">
        <BilingualText en={roleEn} mn={roleMn} mode={mode} />
      </div>
      <div className="relative mt-3">
        <BilingualText
          en={detailedEn || meaningEn}
          mn={detailedMn || meaningMn}
          mode={mode}
        />
      </div>
      {keywords?.length ? (
        <p className="relative mt-4 text-xs tracking-wide text-ink-soft">
          {keywords.join(" · ")}
        </p>
      ) : null}
    </motion.div>
  );
}

export function NatalChartPanel({
  natal,
  report,
  compact = false,
  locked = false,
  priceText,
  onUnlock,
  unlockHref,
}: {
  natal: NatalChartResult;
  report?: NatalFullReport | NatalPreviewReport | null;
  compact?: boolean;
  locked?: boolean;
  priceText?: string;
  onUnlock?: () => void;
  unlockHref?: string;
}) {
  const full = isFullReport(report) ? report : null;
  const preview = isPreviewReport(report) ? report : null;
  const showLocked = locked || Boolean(preview);
  const [highlight, setHighlight] = useState<PlanetId | undefined>();
  const [langMode, setLangMode] = useState<LangMode>("both");
  const planets = compact
    ? natal.planets.filter((p) =>
        ["sun", "moon", "venus", "mercury", "mars"].includes(p.id)
      )
    : natal.planets;

  return (
    <section className="space-y-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="text-center md:text-left">
          <p className="text-xs tracking-[0.28em] text-ink-soft">
            ✦ NATAL · LIFE PATH ✦
          </p>
          <BilingualTitle
            en="Natal chart & Life Path"
            mn="Төрсөн зурхай & Амьдралын зам"
            mode={langMode}
            as="h2"
            className="mt-2 text-2xl md:text-4xl"
          />
          <div className="mt-2">
            <BilingualText
              en={natal.timeNoteEn}
              mn={natal.timeNoteMn}
              mode={langMode}
            />
          </div>
        </div>
        <div className="shrink-0 self-center md:self-auto">
          <p className="mb-2 text-center text-[10px] tracking-[0.16em] text-ink-soft md:text-right">
            LANGUAGE
          </p>
          <LangModeSwitch value={langMode} onChange={setLangMode} />
        </div>
      </div>

      {!compact ? (
        <div className="grid items-center gap-8 border border-border bg-bg-white p-5 md:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] md:p-8">
          <NatalWheel natal={natal} highlight={highlight} />
          <div className="space-y-5">
            <div>
              <p className="text-[10px] tracking-[0.22em] text-ink-soft">
                CHART OVERVIEW
              </p>
              <BilingualTitle
                en="Your planetary placements"
                mn="Таны гаригуудын байрлал"
                mode={langMode}
                as="h3"
                className="mt-2 text-2xl"
              />
              <div className="mt-2">
                <BilingualText
                  en="Tap a planet below to highlight it on the wheel. Life Path number sits at the center."
                  mn="Доорх гариг дээр дарж зурхай дээр тодруулна. Голд Life Path тоо харагдана."
                  mode={langMode}
                />
              </div>
            </div>
            <ul className="grid gap-2 sm:grid-cols-2">
              {natal.planets.map((p) => {
                const tone = PLANET_TONE[p.id];
                const active = highlight === p.id;
                return (
                  <li key={p.id}>
                    <button
                      type="button"
                      onClick={() =>
                        setHighlight((h) => (h === p.id ? undefined : p.id))
                      }
                      className="flex w-full items-center gap-3 border px-3 py-2.5 text-left transition-colors"
                      style={{
                        borderColor: active ? tone : "var(--border)",
                        background: active
                          ? `color-mix(in srgb, ${tone} 14%, var(--bg-white))`
                          : "transparent",
                      }}
                    >
                      <span
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-lg"
                        style={{ borderColor: tone, color: tone }}
                        aria-hidden
                      >
                        {p.glyph}
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-medium">
                          {p.nameEn}
                          <span className="ml-1 text-ink-soft">
                            {p.sign.symbol} {p.degree}°
                          </span>
                        </span>
                        <span className="block truncate text-xs text-ink-soft">
                          {p.sign.nameEn} · {p.nameMn}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden border border-ink bg-bg-white p-5 md:col-span-2 xl:col-span-1"
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 30% 20%, color-mix(in srgb, var(--gold) 55%, transparent), transparent 45%), radial-gradient(circle at 80% 80%, var(--ink), transparent 40%)",
            }}
          />
          <p className="relative text-[10px] tracking-[0.22em] text-ink-soft">
            LIFE PATH
          </p>
          <p className="relative mt-3 font-serif text-6xl leading-none">
            {natal.lifePath.number}
          </p>
          <BilingualTitle
            en={natal.lifePath.titleEn}
            mn={natal.lifePath.titleMn}
            mode={langMode}
            as="p"
            className="relative mt-3 text-xl"
          />
          <div className="relative mt-3">
            <BilingualText
              en={
                full?.lifePathDetailedEn ||
                preview?.previewTexts.lifePathEn ||
                natal.lifePath.shortEn
              }
              mn={
                full?.lifePathDetailedMn ||
                preview?.previewTexts.lifePathMn ||
                natal.lifePath.shortMn
              }
              mode={langMode}
            />
          </div>
          <p className="relative mt-4 text-xs text-ink-soft">
            {(langMode === "en"
              ? natal.lifePath.keywordsEn
              : natal.lifePath.keywordsMn
            ).join(" · ")}
          </p>
        </motion.div>

        <PlacementCard
          title="SUN SIGN"
          glyph={natal.sun.glyph}
          signEn={natal.sun.sign.nameEn}
          signMn={natal.sun.sign.nameMn}
          degree={natal.sun.degree}
          roleEn={natal.sun.roleEn}
          roleMn={natal.sun.roleMn}
          meaningEn={natal.sun.sign.shortEn}
          meaningMn={natal.sun.sign.shortMn}
          keywordsEn={natal.sun.sign.keywordsEn}
          keywordsMn={natal.sun.sign.keywordsMn}
          detailedEn={full?.sunDetailedEn || preview?.previewTexts.sunEn}
          detailedMn={full?.sunDetailedMn || preview?.previewTexts.sunMn}
          tone={PLANET_TONE.sun}
          mode={langMode}
        />
        <PlacementCard
          title="MOON SIGN"
          glyph={natal.moon.glyph}
          signEn={natal.moon.sign.nameEn}
          signMn={natal.moon.sign.nameMn}
          degree={natal.moon.degree}
          roleEn={natal.moon.roleEn}
          roleMn={natal.moon.roleMn}
          meaningEn={natal.moon.sign.shortEn}
          meaningMn={natal.moon.sign.shortMn}
          keywordsEn={natal.moon.sign.keywordsEn}
          keywordsMn={natal.moon.sign.keywordsMn}
          detailedEn={full?.moonDetailedEn || preview?.previewTexts.moonEn}
          detailedMn={full?.moonDetailedMn || preview?.previewTexts.moonMn}
          tone={PLANET_TONE.moon}
          mode={langMode}
        />
        <PlacementCard
          title="VENUS SIGN"
          glyph={natal.venus.glyph}
          signEn={natal.venus.sign.nameEn}
          signMn={natal.venus.sign.nameMn}
          degree={natal.venus.degree}
          roleEn={natal.venus.roleEn}
          roleMn={natal.venus.roleMn}
          meaningEn={natal.venus.sign.shortEn}
          meaningMn={natal.venus.sign.shortMn}
          keywordsEn={natal.venus.sign.keywordsEn}
          keywordsMn={natal.venus.sign.keywordsMn}
          detailedEn={full?.venusDetailedEn || preview?.previewTexts.venusEn}
          detailedMn={full?.venusDetailedMn || preview?.previewTexts.venusMn}
          tone={PLANET_TONE.venus}
          mode={langMode}
        />
      </div>

      {showLocked && (onUnlock || unlockHref) ? (
        <div className="relative overflow-hidden border border-border bg-bg-white p-6 md:p-10">
          <div
            className="pointer-events-none absolute inset-0 opacity-40"
            style={{
              background:
                "radial-gradient(ellipse at 20% 0%, color-mix(in srgb, var(--ink) 5%, transparent), transparent 50%)",
            }}
          />
          <div className="relative">
            <p className="text-[10px] tracking-[0.22em] text-ink-soft">
              NATAL · SEPARATE PRODUCT
            </p>
            <BilingualTitle
              en="Full natal report is locked"
              mn="Дэлгэрэнгүй natal тайлан түгжигдсэн"
              mode={langMode}
              as="h3"
              className="mt-2 text-2xl md:text-3xl"
            />
            <div className="mt-3 max-w-2xl">
              <BilingualText
                en="The full natal report is separate from tarot. Unlock deep planet meanings and synthesis on the natal page with its own payment."
                mn="Төрсөн зурхайн бүрэн тайлан нь таро уншлагаас тусдаа. Гариг бүрийн гүнзгий тайлбар, нийлмэл дүгнэлтийг natal хуудсаас тусад нь төлнө."
                mode={langMode}
              />
            </div>
            {priceText ? (
              <p className="mt-6 font-serif text-4xl">{priceText}</p>
            ) : null}
            <div className="mt-5">
              {unlockHref ? (
                <a href={unlockHref}>
                  <Button type="button">
                    {langMode === "en" ? "Get natal report" : "Natal тайлан авах"}
                  </Button>
                </a>
              ) : (
                <Button type="button" onClick={onUnlock}>
                  {langMode === "en" ? "Unlock full report" : "Дэлгэрэнгүй нээх"}
                </Button>
              )}
            </div>
          </div>
        </div>
      ) : null}

      {full && !compact ? (
        <div className="space-y-10">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border pb-4">
            <div>
              <p className="text-[10px] tracking-[0.22em] text-ink-soft">
                DETAILED PLANETS
              </p>
              <BilingualTitle
                en="Planet-by-planet detail"
                mn="Гариг бүрийн дэлгэрэнгүй"
                mode={langMode}
                as="h3"
                className="mt-2 text-2xl md:text-3xl"
              />
            </div>
            <div className="max-w-sm">
              <BilingualText
                en="From Sun to Saturn — sign, degree, and full meaning."
                mn="Нар → Санчир хүртэл — орд, зэрэг, утгын бүрэн тайлбар."
                mode={langMode}
              />
            </div>
          </div>

          <div className="space-y-6">
            {full.planetDetails.map((p, i) => {
              const tone = PLANET_TONE[p.id];
              const element =
                langMode === "en" ? p.sign.elementEn : p.sign.elementMn;
              const keywords =
                langMode === "en" ? p.sign.keywordsEn : p.sign.keywordsMn;
              return (
                <motion.article
                  key={p.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: Math.min(i * 0.04, 0.2) }}
                  className="grid gap-5 border border-border bg-bg-white p-5 md:grid-cols-[140px_minmax(0,1fr)] md:p-7"
                >
                  <div className="flex flex-col items-center text-center md:items-stretch md:text-left">
                    <div
                      className="relative mx-auto flex h-24 w-24 items-center justify-center rounded-full border md:mx-0"
                      style={{
                        borderColor: tone,
                        boxShadow: `inset 0 0 0 1px color-mix(in srgb, ${tone} 35%, transparent), 0 0 28px color-mix(in srgb, ${tone} 18%, transparent)`,
                      }}
                    >
                      <span className="text-4xl" style={{ color: tone }}>
                        {p.glyph}
                      </span>
                      <span
                        className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border bg-bg-white text-sm"
                        style={{ borderColor: tone }}
                      >
                        {p.sign.symbol}
                      </span>
                    </div>
                    <div className="mt-4 flex justify-center md:justify-start">
                      <DegreeArc degree={p.degree} tone={tone} size={72} />
                    </div>
                    <p className="mt-3 text-[10px] tracking-[0.18em] text-ink-soft">
                      {String(i + 1).padStart(2, "0")} /{" "}
                      {String(full.planetDetails.length).padStart(2, "0")}
                    </p>
                  </div>

                  <div className="min-w-0">
                    <h4 className="font-serif text-2xl md:text-3xl">
                      {p.nameEn}{" "}
                      <span className="text-ink-soft">in</span> {p.sign.nameEn}
                    </h4>
                    <p className="mt-2 text-sm text-ink-muted">
                      {p.nameMn} · {p.sign.nameMn} · {element}
                      {langMode === "mn" ? " элемент" : ""} · {p.degree}°
                    </p>
                    <div className="mt-2">
                      <BilingualText
                        en={p.roleEn}
                        mn={p.roleMn}
                        mode={langMode}
                      />
                    </div>
                    <div
                      className="mt-5 h-px w-16"
                      style={{ background: tone }}
                    />
                    <div className="mt-5">
                      <BilingualText
                        en={p.detailedEn}
                        mn={p.detailedMn}
                        mode={langMode}
                      />
                    </div>
                    <p className="mt-4 text-xs text-ink-soft">
                      {keywords.join(" · ")}
                    </p>
                  </div>
                </motion.article>
              );
            })}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden border border-ink bg-bg-white p-6 md:p-10"
          >
            <div
              className="pointer-events-none absolute -right-20 top-0 h-56 w-56 rounded-full opacity-25"
              style={{
                background:
                  "radial-gradient(circle, var(--gold), transparent 70%)",
              }}
            />
            <p className="relative text-[10px] tracking-[0.22em] text-ink-soft">
              SYNTHESIS
            </p>
            <BilingualTitle
              en="Synthesis"
              mn="Нийлмэл дүгнэлт"
              mode={langMode}
              as="h3"
              className="relative mt-2 text-2xl md:text-3xl"
            />
            <div className="relative mt-5 max-w-3xl">
              <BilingualText
                en={full.synthesisEn}
                mn={full.synthesisMn}
                mode={langMode}
              />
            </div>
          </motion.div>
        </div>
      ) : null}

      {compact ? (
        <div className="border border-border bg-bg-white p-4 md:p-6">
          <BilingualTitle
            en="Key planets"
            mn="Гол гаригууд"
            mode={langMode}
            as="h3"
            className="text-xl"
          />
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {planets.map((p) => (
              <div
                key={p.id}
                className="flex items-center gap-3 border border-border px-3 py-2"
              >
                <span style={{ color: PLANET_TONE[p.id] }} className="text-xl">
                  {p.glyph}
                </span>
                <div>
                  <p className="text-sm">
                    {p.nameEn} · {p.sign.nameEn} {p.degree}°
                  </p>
                  <p className="text-xs text-ink-soft">
                    {langMode === "en" ? p.roleEn : p.roleMn}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
