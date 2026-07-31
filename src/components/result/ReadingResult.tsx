"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { CardFront } from "@/components/tarot/TarotCard";
import { CardThumb } from "@/components/tarot/CardThumb";
import { Button } from "@/components/ui/Button";
import { ProgressSteps } from "@/components/ui/ProgressSteps";
import { Modal } from "@/components/ui/Modal";
import { PaymentModal } from "@/components/payment/PaymentModal";
import { NatalChartPanel } from "@/components/astrology/NatalChartPanel";
import { useToast } from "@/components/ui/Toast";
import { MysticAtmosphere } from "@/components/ui/MysticAtmosphere";
import { BilingualText, BilingualTitle, LangModeSwitch, type LangMode } from "@/components/ui/BilingualText";
import { positionEn, positionLabel } from "@/lib/tarot/bilingual";
import type { NatalChartResult } from "@/lib/astrology/natal";
import type {
  NatalFullReport,
  NatalPreviewReport,
} from "@/lib/astrology/report";

type SelectedCard = {
  id: string;
  nameMn: string;
  nameEn: string;
  imageUrl: string;
  slug?: string;
  keywordsMn: string[];
  shortMeaningMn?: string;
};

type FreeResult = {
  freeCardInterpretations: string[];
  freeOverallInterpretation: string;
  advice?: string;
  yesNoResult?: "yes" | "no";
  yesNoLabel?: "ТИЙМ" | "ҮГҮЙ";
  freeCardInterpretationsEn?: string[];
  freeOverallInterpretationEn?: string;
  adviceEn?: string;
  yesNoLabelEn?: "YES" | "NO";
};

type PaidResult = {
  paidCardInterpretations?: string[];
  paidOverallInterpretation?: string;
  advice?: string;
  challenge?: string;
  possibleOutcome?: string;
  cardConnections?: string;
  questionAnswer?: string;
  hiddenInfluence?: string;
  emotionalGuidance?: string;
  paidCardInterpretationsEn?: string[];
  paidOverallInterpretationEn?: string;
  adviceEn?: string;
  challengeEn?: string;
  possibleOutcomeEn?: string;
  cardConnectionsEn?: string;
  questionAnswerEn?: string;
  hiddenInfluenceEn?: string;
  emotionalGuidanceEn?: string;
};

export type ReadingView = {
  readingId: string;
  accessToken?: string;
  readingType: "three-card" | "five-card" | "yes-no";
  userName: string;
  question: string;
  email?: string;
  positions: string[];
  shuffledCardIds?: string[];
  selectedCardIds?: string[];
  requiredCount?: number;
  cards?: { id: string }[];
  selectedCards: SelectedCard[];
  freeResult: FreeResult | null;
  paidResult: PaidResult | null;
  isPaid: boolean;
  paymentStatus: string;
  price?: number;
  currency?: string;
  birthDate?: string | null;
  birthTime?: string | null;
  natal?: NatalChartResult | null;
  natalReport?: NatalFullReport | NatalPreviewReport | null;
};

const GOLD = "var(--gold)";

const PAID_CHAPTERS: Array<{
  key: keyof PaidResult;
  keyEn: keyof PaidResult;
  title: string;
  titleEn: string;
  eyebrow: string;
}> = [
  {
    key: "cardConnections",
    keyEn: "cardConnectionsEn",
    title: "Хөзрүүдийн хоорондын холбоо",
    titleEn: "How the cards connect",
    eyebrow: "CONNECTIONS",
  },
  {
    key: "questionAnswer",
    keyEn: "questionAnswerEn",
    title: "Таны асуултад өгөх хариу",
    titleEn: "Answer to your question",
    eyebrow: "ANSWER",
  },
  {
    key: "challenge",
    keyEn: "challengeEn",
    title: "Гол саад",
    titleEn: "Main challenge",
    eyebrow: "CHALLENGE",
  },
  {
    key: "hiddenInfluence",
    keyEn: "hiddenInfluenceEn",
    title: "Нуугдмал нөлөө",
    titleEn: "Hidden influence",
    eyebrow: "HIDDEN",
  },
  {
    key: "advice",
    keyEn: "adviceEn",
    title: "Практик зөвлөгөө",
    titleEn: "Practical advice",
    eyebrow: "ADVICE",
  },
  {
    key: "emotionalGuidance",
    keyEn: "emotionalGuidanceEn",
    title: "Сэтгэл хөдлөлийн чиглэл",
    titleEn: "Emotional guidance",
    eyebrow: "EMOTION",
  },
  {
    key: "possibleOutcome",
    keyEn: "possibleOutcomeEn",
    title: "Боломжит үр дүн",
    titleEn: "Possible outcome",
    eyebrow: "OUTCOME",
  },
];

export function RevealStage({
  reading,
  onContinue,
}: {
  reading: ReadingView;
  onContinue: () => void;
}) {
  const [flippedCount, setFlippedCount] = useState(0);
  const allFlipped = flippedCount >= reading.selectedCards.length;

  useEffect(() => {
    setFlippedCount(0);
    const timers: number[] = [];
    reading.selectedCards.forEach((_, i) => {
      timers.push(
        window.setTimeout(() => setFlippedCount(i + 1), 700 + i * 850)
      );
    });
    return () => timers.forEach(clearTimeout);
  }, [reading.selectedCards]);

  return (
    <section className="relative overflow-hidden py-10">
      <MysticAtmosphere density={16} />
      <div className="container-page relative z-10">
        <ProgressSteps
          steps={
            reading.readingType === "yes-no"
              ? ["Мэдээлэл", "Хөзөр", "Хариу"]
              : ["Мэдээлэл", "Хөзөр сонгох", "Тайлбар"]
          }
          current={2}
        />
        <motion.div
          className="mt-10 text-center"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-xs tracking-[0.28em] text-ink-soft">✦ ИЛРЭЛТ ✦</p>
          <h1 className="mt-3 font-serif text-3xl md:text-4xl">
            Таны сонгосон хөзрүүд
          </h1>
        </motion.div>
        <div className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-8 sm:grid-cols-3 md:grid-cols-5 md:gap-6">
          {reading.selectedCards.map((card, i) => (
            <motion.div
              key={card.id}
              className="text-center"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.12, duration: 0.55 }}
            >
              <motion.p
                className="mb-3 text-xs tracking-wide text-ink-soft"
                animate={
                  i < flippedCount
                    ? { opacity: 1, letterSpacing: "0.08em" }
                    : { opacity: 0.5 }
                }
              >
                {positionLabel(reading.positions[i])}
              </motion.p>
              <CardFront
                nameMn={card.nameEn || card.nameMn}
                imageUrl={card.imageUrl}
                keyword={card.keywordsMn?.[0]}
                flipped={i < flippedCount}
                slug={card.slug}
              />
            </motion.div>
          ))}
        </div>
        <motion.div
          className="mt-12 flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: allFlipped ? 1 : 0.35 }}
          transition={{ duration: 0.5 }}
        >
          <Button onClick={onContinue} disabled={!allFlipped}>
            Тайлбарыг харах
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

function SpreadShowcase({
  cards,
  positions,
  mode = "both",
}: {
  cards: SelectedCard[];
  positions: string[];
  mode?: LangMode;
}) {
  return (
    <div className="relative overflow-hidden border border-border bg-bg-white p-5 md:p-8">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, color-mix(in srgb, var(--ink) 5%, transparent), transparent 55%)",
        }}
      />
      <div className="relative">
        <p className="text-center text-[10px] tracking-[0.28em] text-ink-soft">
          {mode === "mn" ? "ТАНЫ ТАРАЛТ" : "YOUR SPREAD"}
        </p>
        <div
          className={`mt-6 grid gap-4 ${
            cards.length <= 3
              ? "mx-auto max-w-2xl grid-cols-3"
              : "grid-cols-3 md:grid-cols-5"
          }`}
        >
          {cards.map((card, i) => (
            <motion.div
              key={card.id}
              className="text-center"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.45 }}
            >
              <p className="mb-2 text-[10px] tracking-[0.14em] text-ink-soft">
                {positionForMode(positions[i], mode)}
              </p>
              <CardThumb
                nameEn={card.nameEn || card.nameMn}
                nameMn={card.nameMn}
                imageUrl={card.imageUrl}
                slug={card.slug}
                className="mx-auto max-w-[140px] shadow-[0_12px_28px_color-mix(in_srgb,var(--ink)_14%,transparent)]"
              />
              <p className="mt-2 font-serif text-sm leading-snug">
                {card.nameEn || card.nameMn}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function positionForMode(positionMn: string, mode: LangMode): string {
  if (mode === "en") return positionEn(positionMn);
  if (mode === "mn") return positionMn;
  return positionLabel(positionMn);
}

function PaidChapter({
  index,
  total,
  eyebrow,
  title,
  titleEn,
  bodyMn,
  bodyEn,
  mode,
}: {
  index: number;
  total: number;
  eyebrow: string;
  title: string;
  titleEn: string;
  bodyMn: string;
  bodyEn?: string;
  mode: LangMode;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden border border-border bg-bg-white p-6 md:p-8"
    >
      <div
        className="pointer-events-none absolute -right-10 top-0 h-40 w-40 rounded-full opacity-20"
        style={{
          background: `radial-gradient(circle, ${GOLD}, transparent 70%)`,
        }}
      />
      <div className="relative flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] tracking-[0.22em] text-ink-soft">
            {eyebrow}
          </p>
          <BilingualTitle
            en={titleEn}
            mn={title}
            mode={mode}
            as="h3"
            className="mt-2 text-2xl md:text-3xl"
          />
        </div>
        <p className="shrink-0 font-serif text-sm text-ink-soft">
          {String(index).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </p>
      </div>
      <div className="relative mt-4 h-px w-14" style={{ background: GOLD }} />
      <div className="relative mt-5">
        <BilingualText en={bodyEn} mn={bodyMn} mode={mode} />
      </div>
    </motion.article>
  );
}

export function ReadingResult({
  reading,
  onRefresh,
}: {
  reading: ReadingView;
  onRefresh: () => Promise<void>;
}) {
  const { toast } = useToast();
  const [payOpen, setPayOpen] = useState(false);
  const [emailOpen, setEmailOpen] = useState(false);
  const [pdfOpen, setPdfOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [langMode, setLangMode] = useState<LangMode>("both");
  const token = reading.accessToken || "";
  const isPremium =
    reading.isPaid && reading.readingType !== "yes-no";

  if (reading.readingType === "yes-no" && reading.freeResult) {
    const card = reading.selectedCards[0];
    const yesNoLabel =
      langMode === "mn"
        ? reading.freeResult.yesNoLabel || reading.freeResult.yesNoLabelEn
        : reading.freeResult.yesNoLabelEn || reading.freeResult.yesNoLabel;
    const yesNoSub =
      langMode === "both" &&
      reading.freeResult.yesNoLabelEn &&
      reading.freeResult.yesNoLabel &&
      String(reading.freeResult.yesNoLabelEn) !==
        String(reading.freeResult.yesNoLabel)
        ? reading.freeResult.yesNoLabel
        : null;

    return (
      <section className="relative overflow-hidden py-12">
        <MysticAtmosphere density={20} />
        <div className="container-page relative z-10">
          <div className="mb-6 flex justify-end">
            <LangModeSwitch value={langMode} onChange={setLangMode} />
          </div>
          <div className="mx-auto grid max-w-4xl gap-10 md:grid-cols-2 md:items-center">
            <motion.div
              className="mx-auto w-56 md:w-72"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <CardFront
                nameMn={card?.nameEn || card?.nameMn || ""}
                imageUrl={card?.imageUrl || ""}
                flipped
                slug={card?.slug}
              />
            </motion.div>
            <div>
              <motion.p
                className="text-xs tracking-[0.28em] text-ink-soft"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                ✦ ХАРИУЛТ ✦
              </motion.p>
              <motion.h1
                className="mt-3 font-serif text-6xl md:text-7xl"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.35,
                  duration: 0.85,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                {yesNoLabel}
              </motion.h1>
              {yesNoSub ? (
                <p className="mt-2 text-sm text-ink-soft">{yesNoSub}</p>
              ) : null}
              <motion.div
                className="mt-4 h-px w-16 origin-left bg-ink"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.7, duration: 0.5 }}
              />
              <motion.div
                className="mt-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.85 }}
              >
                <BilingualText
                  en={reading.freeResult.freeOverallInterpretationEn}
                  mn={reading.freeResult.freeOverallInterpretation}
                  mode={langMode}
                />
              </motion.div>
              <motion.div
                className="mt-8 flex flex-wrap gap-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                <Button
                  type="button"
                  onClick={() => {
                    sessionStorage.removeItem("tarot-session-yes-no");
                    window.location.assign("/tiim-ugui?new=1");
                  }}
                >
                  Дахин асуух
                </Button>
                <Link href="/">
                  <Button variant="secondary">Нүүр хуудас</Button>
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  async function downloadPdf() {
    setBusy(true);
    try {
      const res = await fetch(
        `/api/readings/${reading.readingId}/pdf?token=${encodeURIComponent(token)}`
      );
      if (!res.ok) throw new Error("PDF үүсгэж чадсангүй");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `tarot-${reading.readingId}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      toast("PDF амжилттай үүслээ.");
      setPdfOpen(false);
    } catch {
      toast("PDF үүсгэж чадсангүй");
    } finally {
      setBusy(false);
    }
  }

  async function sendEmail() {
    setBusy(true);
    try {
      const res = await fetch(`/api/readings/${reading.readingId}/email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, confirm: true }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Алдаа");
      toast("Тайлбарыг таны и-мэйл хаяг руу амжилттай илгээлээ.");
      setEmailOpen(false);
    } catch (e) {
      toast(e instanceof Error ? e.message : "И-мэйл илгээж чадсангүй");
    } finally {
      setBusy(false);
    }
  }

  const priceText = `${(reading.price || 19900).toLocaleString("mn-MN")}₮`;
  const paidChapters = PAID_CHAPTERS.map((c) => ({
    ...c,
    bodyMn: reading.paidResult?.[c.key] as string | undefined,
    bodyEn: reading.paidResult?.[c.keyEn] as string | undefined,
  })).filter((c) => Boolean(c.bodyMn));

  const overallMn = isPremium
    ? reading.paidResult?.paidOverallInterpretation ||
      reading.paidResult?.questionAnswer ||
      reading.freeResult?.freeOverallInterpretation
    : reading.freeResult?.freeOverallInterpretation ||
      "Ерөнхий дүгнэлт бэлэн болоогүй байна.";
  const overallEn = isPremium
    ? reading.paidResult?.paidOverallInterpretationEn ||
      reading.paidResult?.questionAnswerEn ||
      reading.freeResult?.freeOverallInterpretationEn
    : reading.freeResult?.freeOverallInterpretationEn;

  return (
    <section className="relative overflow-hidden py-10 md:py-14">
      <MysticAtmosphere density={isPremium ? 18 : 12} />
      <div className="container-page relative z-10">
        <ProgressSteps
          steps={["Мэдээлэл", "Хөзөр сонгох", "Тайлбар"]}
          current={2}
        />

        <motion.div
          className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
        >
          <div>
            <p className="text-xs tracking-[0.28em] text-ink-soft">
              {isPremium ? "✦ PREMIUM READING ✦" : "✦ ТАЙЛБАР ✦"}
            </p>
            <h1 className="mt-2 font-serif text-3xl md:text-5xl">
              {isPremium
                ? `${reading.userName}, таны бүрэн уншлага`
                : "Таны уншлагын тайлбар"}
            </h1>
            <p className="mt-2 text-sm text-ink-muted">
              Уншлагын дугаар: {reading.readingId}
            </p>
            {isPremium ? (
              <p className="mt-3 max-w-2xl text-sm text-ink-muted">
                «{reading.question}»
              </p>
            ) : null}
          </div>
          <div className="shrink-0">
            <p className="mb-2 text-[10px] tracking-[0.16em] text-ink-soft">
              LANGUAGE
            </p>
            <LangModeSwitch value={langMode} onChange={setLangMode} />
          </div>
        </motion.div>

        {isPremium ? (
          <div className="mt-10 space-y-12">
            <SpreadShowcase
              cards={reading.selectedCards}
              positions={reading.positions}
              mode={langMode}
            />

            {/* Card-by-card chapters */}
            <div className="space-y-8">
              <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border pb-4">
                <div>
                  <p className="text-[10px] tracking-[0.22em] text-ink-soft">
                    CARD CHAPTERS
                  </p>
                  <h2 className="mt-2 font-serif text-2xl md:text-3xl">
                    {langMode === "mn"
                      ? "Хөзөр бүрийн бүрэн тайлбар"
                      : langMode === "en"
                        ? "Full card interpretations"
                        : "Card interpretations"}
                  </h2>
                </div>
                <p className="max-w-sm text-sm text-ink-muted">
                  {langMode === "mn"
                    ? "Байрлал · нэр · түлхүүр үг · дэлгэрэнгүй утга."
                    : "Position · name · keywords · detailed meaning."}
                </p>
              </div>

              {reading.selectedCards.map((card, i) => {
                const textMn =
                  reading.paidResult?.paidCardInterpretations?.[i] ||
                  reading.freeResult?.freeCardInterpretations?.[i] ||
                  "";
                const textEn =
                  reading.paidResult?.paidCardInterpretationsEn?.[i] ||
                  reading.freeResult?.freeCardInterpretationsEn?.[i] ||
                  "";
                return (
                  <motion.article
                    key={card.id}
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.5, delay: Math.min(i * 0.05, 0.2) }}
                    className="grid gap-6 border border-border bg-bg-white p-5 md:grid-cols-[160px_minmax(0,1fr)] md:p-8"
                  >
                    <div>
                      <CardThumb
                        nameEn={card.nameEn || card.nameMn}
                        nameMn={card.nameMn}
                        imageUrl={card.imageUrl}
                        slug={card.slug}
                        className="shadow-[0_14px_32px_color-mix(in_srgb,var(--ink)_12%,transparent)]"
                      />
                      <p className="mt-3 text-center text-[10px] tracking-[0.18em] text-ink-soft md:text-left">
                        {String(i + 1).padStart(2, "0")} /{" "}
                        {String(reading.selectedCards.length).padStart(2, "0")}
                      </p>
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] tracking-[0.2em] text-ink-soft">
                        {positionForMode(reading.positions[i], langMode)}
                      </p>
                      <h3 className="mt-2 font-serif text-2xl md:text-3xl">
                        {card.nameEn || card.nameMn}
                      </h3>
                      {card.nameMn && card.nameEn && langMode !== "en" ? (
                        <p className="mt-1 text-sm text-ink-muted">{card.nameMn}</p>
                      ) : null}
                      {card.keywordsMn?.length ? (
                        <p className="mt-3 text-xs tracking-wide text-ink-soft">
                          {card.keywordsMn.join(" · ")}
                        </p>
                      ) : null}
                      <div
                        className="mt-5 h-px w-16"
                        style={{ background: GOLD }}
                      />
                      <div className="mt-5">
                        <BilingualText
                          en={textEn}
                          mn={textMn}
                          mode={langMode}
                        />
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </div>

            {/* Overall synthesis */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative overflow-hidden border border-ink bg-bg-white p-6 md:p-10"
            >
              <div
                className="pointer-events-none absolute -left-16 top-0 h-56 w-56 rounded-full opacity-25"
                style={{
                  background: `radial-gradient(circle, ${GOLD}, transparent 70%)`,
                }}
              />
              <p className="relative text-[10px] tracking-[0.22em] text-ink-soft">
                SYNTHESIS
              </p>
              <BilingualTitle
                en="Overall synthesis"
                mn="Ерөнхий дүгнэлт"
                mode={langMode}
                as="h2"
                className="relative mt-2 text-2xl md:text-4xl"
              />
              <div
                className="relative mt-4 h-px w-16"
                style={{ background: GOLD }}
              />
              <div className="relative mt-6">
                <BilingualText en={overallEn} mn={overallMn} mode={langMode} />
              </div>
            </motion.div>

            {/* Deep chapters */}
            {paidChapters.length > 0 ? (
              <div className="space-y-6">
                <div className="border-b border-border pb-4">
                  <p className="text-[10px] tracking-[0.22em] text-ink-soft">
                    DEEP INSIGHTS
                  </p>
                  <h2 className="mt-2 font-serif text-2xl md:text-3xl">
                    {langMode === "en"
                      ? "Deep insights"
                      : langMode === "mn"
                        ? "Гүнзгий тайлбарууд"
                        : "Deep insights"}
                  </h2>
                </div>
                {paidChapters.map((ch, i) => (
                  <PaidChapter
                    key={ch.key}
                    index={i + 1}
                    total={paidChapters.length}
                    eyebrow={ch.eyebrow}
                    title={ch.title}
                    titleEn={ch.titleEn}
                    bodyMn={ch.bodyMn!}
                    bodyEn={ch.bodyEn}
                    mode={langMode}
                  />
                ))}
              </div>
            ) : null}

            {/* Deliverables */}
            <div className="relative overflow-hidden border border-border bg-bg-white p-6 md:p-8">
              <div
                className="pointer-events-none absolute inset-0 opacity-35"
                style={{
                  background:
                    "radial-gradient(ellipse at 15% 0%, color-mix(in srgb, var(--ink) 5%, transparent), transparent 50%)",
                }}
              />
              <div className="relative">
                <p className="text-[10px] tracking-[0.22em] text-ink-soft">
                  DELIVERABLES
                </p>
                <h2 className="mt-2 font-serif text-2xl">Тайлангаа хадгалах</h2>
                <p className="mt-2 max-w-xl text-sm text-ink-muted">
                  Бүрэн уншлагыг PDF-ээр татаж авах эсвэл и-мэйлээр хүлээн авна уу.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Button variant="secondary" onClick={() => setPdfOpen(true)}>
                    Бүрэн PDF татах
                  </Button>
                  <Button variant="secondary" onClick={() => setEmailOpen(true)}>
                    И-мэйлээр авах
                  </Button>
                  <Button
                    type="button"
                    onClick={() => {
                      const key =
                        reading.readingType === "five-card"
                          ? "tarot-session-five-card"
                          : "tarot-session-three-card";
                      sessionStorage.removeItem(key);
                      window.location.assign(
                        reading.readingType === "five-card"
                          ? "/5-hozort?new=1"
                          : "/3-hozort?new=1"
                      );
                    }}
                  >
                    Шинэ уншлага
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* ——— Free / locked layout ——— */
          <div className="mt-10 grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-10">
              {reading.selectedCards.map((card, i) => {
                const textMn =
                  reading.freeResult?.freeCardInterpretations?.[i] || "";
                const textEn =
                  reading.freeResult?.freeCardInterpretationsEn?.[i] || "";
                return (
                  <motion.article
                    key={card.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="grid grid-cols-[128px_1fr] items-start gap-5 border-b border-border pb-8 sm:grid-cols-[160px_1fr]"
                  >
                    <CardThumb
                      nameEn={card.nameEn || card.nameMn}
                      nameMn={card.nameMn}
                      imageUrl={card.imageUrl}
                      slug={card.slug}
                      className="shadow-[0_6px_18px_rgba(17,17,17,0.08)]"
                    />
                    <div className="min-w-0">
                      <p className="text-xs leading-5 text-ink-soft">
                        {i + 1}. {positionForMode(reading.positions[i], langMode)}
                      </p>
                      <h3 className="mt-1 font-serif text-xl leading-snug">
                        {card.nameEn || card.nameMn}
                      </h3>
                      <div className="relative mt-3">
                        <BilingualText
                          en={textEn}
                          mn={textMn}
                          mode={langMode}
                          clamp
                        />
                        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-bg to-transparent" />
                      </div>
                      <button
                        type="button"
                        onClick={() => setPayOpen(true)}
                        className="mt-3 text-sm tracking-wide text-ink underline underline-offset-4 transition hover:opacity-70"
                      >
                        {langMode === "en" ? "Continue" : "Үргэлжлүүлэх"}
                      </button>
                    </div>
                  </motion.article>
                );
              })}
            </div>

            <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
              <div className="border border-border bg-bg-white p-5">
                <BilingualTitle
                  en="Overall"
                  mn="Ерөнхий дүгнэлт"
                  mode={langMode}
                  as="h2"
                  className="text-xl"
                />
                <div className="relative mt-3 max-h-52 overflow-hidden">
                  <BilingualText
                    en={overallEn}
                    mn={overallMn}
                    mode={langMode}
                    clamp
                  />
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-bg-white to-transparent" />
                </div>
                <Button
                  className="mt-4"
                  fullWidth
                  onClick={() => setPayOpen(true)}
                >
                  {langMode === "en" ? "Continue" : "Үргэлжлүүлэх"}
                </Button>
              </div>
              <div className="border border-border bg-bg-white p-5">
                <BilingualTitle
                  en="Next step"
                  mn="Дараах алхам"
                  mode={langMode}
                  as="h2"
                  className="text-xl"
                />
                <div className="mt-3">
                  <BilingualText
                    en={reading.freeResult?.adviceEn}
                    mn={
                      reading.freeResult?.advice ||
                      "Асуултаа дахин эргэцүүлж, нэг жижиг бодитой алхам хийхэд анхаараарай."
                    }
                    mode={langMode}
                    clamp
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setPayOpen(true)}
                  className="mt-3 text-sm tracking-wide text-ink underline underline-offset-4 transition hover:opacity-70"
                >
                  {langMode === "en" ? "Continue" : "Үргэлжлүүлэх"}
                </button>
              </div>
              <div className="flex w-full flex-col gap-3">
                <Button fullWidth onClick={() => setPayOpen(true)}>
                  Бүрэн тайлбар нээх — {priceText}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  fullWidth
                  onClick={() => {
                    const key =
                      reading.readingType === "five-card"
                        ? "tarot-session-five-card"
                        : "tarot-session-three-card";
                    sessionStorage.removeItem(key);
                    window.location.assign(
                      reading.readingType === "five-card"
                        ? "/5-hozort?new=1"
                        : "/3-hozort?new=1"
                    );
                  }}
                >
                  Дахин асуух
                </Button>
              </div>
            </aside>
          </div>
        )}

        {!isPremium ? (
          <div className="relative mt-16 overflow-hidden border border-border bg-bg-white p-6 md:p-10">
            <div
              className="pointer-events-none absolute inset-0 opacity-40"
              style={{
                background:
                  "radial-gradient(ellipse at 20% 0%, color-mix(in srgb, var(--ink) 5%, transparent), transparent 50%)",
              }}
            />
            <div className="relative">
              <p className="text-[10px] tracking-[0.22em] text-ink-soft">
                PREMIUM UNLOCK
              </p>
              <h2 className="mt-2 font-serif text-3xl">Үргэлжлэлийг нээх</h2>
              <p className="mt-3 max-w-2xl text-sm text-ink-muted">
                Хөзөр бүрийн бүрэн тайлбар, асуултад өгөх дэлгэрэнгүй хариу,
                холбоо, саад, зөвлөгөө болон боломжит үр дүнг төлбөрийн дараа
                бүрэн уншина.
              </p>
              <p className="mt-8 font-serif text-4xl">{priceText}</p>
              <div className="mt-6">
                <Button onClick={() => setPayOpen(true)}>Үргэлжлүүлэх</Button>
              </div>
            </div>
          </div>
        ) : null}

        {reading.natal ? (
          <div className="mt-16 border-t border-border pt-10">
            <p className="mb-4 text-sm text-ink-muted">
              Preview only · Товч preview. Full natal report & payment are
              separate from tarot —{" "}
              <Link href="/natal" className="underline underline-offset-4">
                /natal
              </Link>
              .
            </p>
            <NatalChartPanel
              natal={reading.natal}
              report={reading.natalReport}
              compact
              locked
              unlockHref={
                reading.birthDate
                  ? `/natal?birthDate=${encodeURIComponent(reading.birthDate)}${
                      reading.birthTime
                        ? `&birthTime=${encodeURIComponent(reading.birthTime)}`
                        : ""
                    }`
                  : "/natal"
              }
            />
          </div>
        ) : null}

        <PaymentModal
          open={payOpen}
          onClose={() => setPayOpen(false)}
          readingId={reading.readingId}
          token={token}
          priceText={priceText}
          onPaid={async () => {
            await onRefresh();
            toast("Төлбөр амжилттай — бүрэн тайлан нээгдлээ");
            setPayOpen(false);
          }}
        />

        <Modal
          open={emailOpen}
          onClose={() => setEmailOpen(false)}
          title="И-мэйлээр авах"
        >
          <p className="text-sm text-ink-muted">
            Тайлбарыг таны оруулсан и-мэйл хаяг руу илгээх үү?
          </p>
          <p className="mt-2 text-sm">{reading.email || "И-мэйл бүртгэгдээгүй"}</p>
          <div className="mt-6 flex gap-3">
            <Button onClick={sendEmail} loading={busy}>
              Илгээх
            </Button>
            <Button variant="secondary" onClick={() => setEmailOpen(false)}>
              Болих
            </Button>
          </div>
        </Modal>

        <Modal open={pdfOpen} onClose={() => setPdfOpen(false)} title="PDF татах">
          <p className="text-sm text-ink-muted">
            {isPremium
              ? "Таны PDF файлд бүрэн тайлбар багтана."
              : "Таны PDF файлд богино тайлбар багтана."}
          </p>
          <div className="mt-6 flex gap-3">
            <Button onClick={downloadPdf} loading={busy}>
              PDF үүсгэх
            </Button>
            <Button variant="secondary" onClick={() => setPdfOpen(false)}>
              Болих
            </Button>
          </div>
        </Modal>
      </div>
    </section>
  );
}
