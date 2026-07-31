"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CardThumb, CardIcon } from "@/components/tarot/CardThumb";
import { Button } from "@/components/ui/Button";
import { LoadingState, ErrorState } from "@/components/ui/States";
import { MysticAtmosphere } from "@/components/ui/MysticAtmosphere";

type CatalogCard = {
  id: string;
  number: number;
  slug: string;
  nameMn: string;
  nameEn: string;
  imageUrl: string;
  keywordsMn: string[];
  keywordsEn: string[];
  shortMeaningMn: string;
  detailedMeaningMn: string;
  loveMeaningMn: string;
  careerMeaningMn: string;
  financeMeaningMn: string;
  personalGrowthMeaningMn: string;
  yesNoAnswer: "yes" | "no";
  yesNoExplanationMn: string;
  shortMeaningEn: string;
  detailedMeaningEn: string;
  loveMeaningEn: string;
  careerMeaningEn: string;
  financeMeaningEn: string;
  personalGrowthMeaningEn: string;
  yesNoExplanationEn: string;
};

type Filter = "all" | "major" | "cups" | "wands" | "swords" | "pentacles";

function cardGroup(card: CatalogCard): Filter {
  const s = `${card.slug} ${card.nameEn}`.toLowerCase();
  if (s.includes("cup")) return "cups";
  if (s.includes("wand") || s.includes("rod")) return "wands";
  if (s.includes("sword")) return "swords";
  if (s.includes("pentacle") || s.includes("coin")) return "pentacles";
  return "major";
}

const filters: { id: Filter; label: string }[] = [
  { id: "all", label: "Бүгд" },
  { id: "major", label: "Major" },
  { id: "cups", label: "Cups" },
  { id: "wands", label: "Wands" },
  { id: "swords", label: "Swords" },
  { id: "pentacles", label: "Pentacles" },
];

export default function AllCardsPage() {
  const [cards, setCards] = useState<CatalogCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<CatalogCard | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/cards");
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Хөзөр ачаалж чадсангүй");
        setCards(json.data || []);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Алдаа гарлаа");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [selected]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return cards.filter((c) => {
      if (filter !== "all" && cardGroup(c) !== filter) return false;
      if (!q) return true;
      return (
        c.nameEn.toLowerCase().includes(q) ||
        c.nameMn.toLowerCase().includes(q) ||
        c.keywordsMn.some((k) => k.toLowerCase().includes(q))
      );
    });
  }, [cards, filter, query]);

  if (loading) return <LoadingState message="Хөзрүүдийг ачаалж байна…" />;
  if (error) {
    return (
      <div className="container-page py-16">
        <ErrorState message={error} onRetry={() => window.location.reload()} />
      </div>
    );
  }

  return (
    <section className="relative overflow-hidden py-10 md:py-14">
      <MysticAtmosphere density={14} />
      <div className="container-page relative z-10">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs tracking-[0.28em] text-ink-soft">✦ КАТАЛОГ ✦</p>
          <h1 className="mt-3 font-serif text-3xl md:text-5xl">Бүх хөзрүүд</h1>
          <p className="mt-3 text-sm text-ink-muted">
            72 таро хөзөр. Хөзөр дээр дарж томруулж, тайлбарыг уншина уу.
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-2">
            {filters.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilter(f.id)}
                className={`border px-3 py-2 text-xs tracking-wide transition ${
                  filter === f.id
                    ? "border-ink bg-ink text-on-ink"
                    : "border-border text-ink-muted hover:border-ink hover:text-ink"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Хөзөр хайх…"
            className="w-full border border-border bg-bg-white px-3 py-2.5 text-sm outline-none focus:border-ink md:max-w-xs"
            aria-label="Хөзөр хайх"
          />
        </div>

        <p className="mt-4 text-xs text-ink-soft" aria-live="polite">
          {filtered.length} хөзөр
        </p>

        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {filtered.map((card, i) => (
            <motion.button
              key={card.id}
              type="button"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.008, 0.4), duration: 0.35 }}
              whileHover={{ y: -4, scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelected(card)}
              className="group text-left"
              aria-label={`${card.nameEn} — тайлбар харах`}
            >
              <CardThumb
                nameEn={card.nameEn}
                nameMn={card.nameMn}
                imageUrl={card.imageUrl}
                slug={card.slug}
                className="transition group-hover:shadow-[0_10px_24px_rgba(17,17,17,0.12)]"
              />
              <p className="mt-2 truncate text-center text-[11px] text-ink-muted">
                {String(card.number).padStart(2, "0")}
              </p>
            </motion.button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <p className="py-16 text-center text-sm text-ink-muted">
            Хайлтад тохирох хөзөр олдсонгүй.
          </p>
        ) : null}
      </div>

      <AnimatePresence>
        {selected ? (
          <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-6">
            <motion.button
              type="button"
              aria-label="Хаах"
              className="absolute inset-0 bg-ink/45"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setSelected(null)}
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={selected.nameEn}
              initial={{ opacity: 0, y: 56, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 28, scale: 0.97 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-10 flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden border border-border bg-bg-white sm:max-h-[88vh]"
            >
              <motion.div
                className="flex items-start justify-between gap-4 border-b border-border px-5 py-4"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12, duration: 0.4 }}
              >
                <div>
                  <motion.p
                    className="text-xs tracking-[0.2em] text-ink-soft"
                    initial={{ opacity: 0, letterSpacing: "0.4em" }}
                    animate={{ opacity: 1, letterSpacing: "0.2em" }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                  >
                    ✦ {String(selected.number).padStart(2, "0")} ✦
                  </motion.p>
                  <motion.h2
                    className="mt-1 font-serif text-2xl md:text-3xl"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.22, duration: 0.45 }}
                  >
                    {selected.nameEn}
                  </motion.h2>
                </div>
                <Button variant="ghost" onClick={() => setSelected(null)}>
                  ✕
                </Button>
              </motion.div>

              <div className="grid flex-1 gap-6 overflow-y-auto p-5 md:grid-cols-[280px_1fr]">
                <motion.div
                  className="mx-auto flex w-56 flex-col items-center gap-3 sm:w-64 md:w-full"
                  initial={{ opacity: 0, rotateY: -28, scale: 0.9 }}
                  animate={{ opacity: 1, rotateY: 0, scale: 1 }}
                  transition={{
                    delay: 0.2,
                    duration: 0.7,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  style={{ transformPerspective: 900 }}
                >
                  <div className="relative flex aspect-[2/3] w-full flex-col items-center justify-center overflow-hidden border border-ink bg-bg-white">
                    {/\.(png|jpe?g|webp|gif)$/i.test(selected.imageUrl) ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={selected.imageUrl}
                        alt={selected.nameEn}
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    ) : (
                      <>
                        <motion.div
                          className="pointer-events-none absolute inset-0"
                          initial={{ opacity: 0.5 }}
                          animate={{ opacity: 0 }}
                          transition={{ delay: 0.35, duration: 0.8 }}
                          style={{
                            background:
                              "radial-gradient(circle at 50% 40%, rgba(255,255,255,0.9), transparent 65%)",
                          }}
                        />
                        <div className="mb-auto mt-2 w-full border border-border p-1 text-center text-[10px] tracking-[0.2em] text-ink-soft">
                          {String(selected.number).padStart(2, "0")}
                        </div>
                        <motion.div
                          initial={{ opacity: 0, scale: 0.7 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.4, duration: 0.55 }}
                        >
                          <motion.div
                            animate={{ y: [0, -3, 0] }}
                            transition={{
                              duration: 3.2,
                              repeat: Infinity,
                              ease: "easeInOut",
                              delay: 1,
                            }}
                          >
                            <CardIcon
                              slug={selected.slug}
                              size={120}
                              className="text-ink"
                            />
                          </motion.div>
                        </motion.div>
                        <motion.p
                          className="mt-4 text-center font-serif text-sm"
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.55 }}
                        >
                          {selected.nameEn}
                        </motion.p>
                      </>
                    )}
                  </div>
                </motion.div>

                <motion.div
                  className="space-y-5 text-sm"
                  initial="hidden"
                  animate="show"
                  variants={{
                    hidden: {},
                    show: {
                      transition: { staggerChildren: 0.09, delayChildren: 0.35 },
                    },
                  }}
                >
                  {(
                    [
                      {
                        titleMn: "Богино тайлбар",
                        titleEn: "Short meaning",
                        en: selected.shortMeaningEn,
                        mn: selected.shortMeaningMn,
                      },
                      {
                        titleMn: "Дэлгэрэнгүй утга",
                        titleEn: "Detailed meaning",
                        en: selected.detailedMeaningEn,
                        mn: selected.detailedMeaningMn,
                      },
                    ] as const
                  ).map((block) => (
                    <motion.div
                      key={block.titleEn}
                      variants={{
                        hidden: { opacity: 0, y: 14 },
                        show: {
                          opacity: 1,
                          y: 0,
                          transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
                        },
                      }}
                    >
                      <h3 className="font-serif text-lg">
                        {block.titleEn}
                        <span className="ml-2 text-sm text-ink-soft">
                          / {block.titleMn}
                        </span>
                      </h3>
                      {block.en ? (
                        <p className="mt-2 leading-relaxed text-ink">
                          {block.en}
                        </p>
                      ) : null}
                      <p className="mt-2 leading-relaxed text-ink-muted">
                        {block.mn}
                      </p>
                    </motion.div>
                  ))}

                  <motion.div
                    variants={{
                      hidden: { opacity: 0, y: 14 },
                      show: {
                        opacity: 1,
                        y: 0,
                        transition: { duration: 0.4 },
                      },
                    }}
                  >
                    <h3 className="font-serif text-lg">
                      Keywords
                      <span className="ml-2 text-sm text-ink-soft">
                        / Түлхүүр үгс
                      </span>
                    </h3>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {(selected.keywordsEn?.length
                        ? selected.keywordsEn
                        : selected.keywordsMn
                      ).map((k, i) => (
                        <motion.span
                          key={`${k}-${i}`}
                          className="border border-border px-2 py-1 text-xs text-ink-muted"
                          initial={{ opacity: 0, scale: 0.85 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.55 + i * 0.06, duration: 0.3 }}
                        >
                          {k}
                        </motion.span>
                      ))}
                    </div>
                    {selected.keywordsEn?.length ? (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {selected.keywordsMn.map((k) => (
                          <span
                            key={k}
                            className="border border-border/70 px-2 py-1 text-xs text-ink-soft"
                          >
                            {k}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </motion.div>

                  <motion.div
                    className="grid gap-4 sm:grid-cols-2"
                    variants={{
                      hidden: { opacity: 0, y: 14 },
                      show: {
                        opacity: 1,
                        y: 0,
                        transition: { duration: 0.4 },
                      },
                    }}
                  >
                    {(
                      [
                        [
                          "LOVE / ХАЙР",
                          selected.loveMeaningEn,
                          selected.loveMeaningMn,
                        ],
                        [
                          "CAREER / АЖИЛ",
                          selected.careerMeaningEn,
                          selected.careerMeaningMn,
                        ],
                        [
                          "FINANCE / САНХҮҮ",
                          selected.financeMeaningEn,
                          selected.financeMeaningMn,
                        ],
                        [
                          "GROWTH / ӨСӨЛТ",
                          selected.personalGrowthMeaningEn,
                          selected.personalGrowthMeaningMn,
                        ],
                      ] as const
                    ).map(([label, en, mn], i) => (
                      <motion.div
                        key={label}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 + i * 0.08, duration: 0.35 }}
                      >
                        <h4 className="text-xs tracking-wide text-ink-soft">
                          {label}
                        </h4>
                        {en ? (
                          <p className="mt-1 text-ink">{en}</p>
                        ) : null}
                        <p className="mt-1 text-ink-muted">{mn}</p>
                      </motion.div>
                    ))}
                  </motion.div>

                  <motion.div
                    className="border-t border-border pt-4"
                    variants={{
                      hidden: { opacity: 0, y: 16 },
                      show: {
                        opacity: 1,
                        y: 0,
                        transition: { duration: 0.45 },
                      },
                    }}
                  >
                    <h3 className="font-serif text-lg">
                      Yes / No
                      <span className="ml-2 text-sm text-ink-soft">
                        / Тийм / Үгүй
                      </span>
                    </h3>
                    <motion.p
                      className="mt-2 font-serif text-2xl"
                      initial={{
                        opacity: 0,
                        scale: 0.9,
                        letterSpacing: "0.2em",
                      }}
                      animate={{
                        opacity: 1,
                        scale: 1,
                        letterSpacing: "0.02em",
                      }}
                      transition={{ delay: 0.95, duration: 0.55 }}
                    >
                      {selected.yesNoAnswer === "yes" ? "YES / ТИЙМ" : "NO / ҮГҮЙ"}
                    </motion.p>
                    {selected.yesNoExplanationEn ? (
                      <motion.p
                        className="mt-2 text-ink"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.05 }}
                      >
                        {selected.yesNoExplanationEn}
                      </motion.p>
                    ) : null}
                    <motion.p
                      className="mt-2 text-ink-muted"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.15 }}
                    >
                      {selected.yesNoExplanationMn}
                    </motion.p>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
