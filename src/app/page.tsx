"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import {
  MysticAtmosphere,
  fadeUp,
  staggerContainer,
} from "@/components/ui/MysticAtmosphere";
import { TestimonialsBoard } from "@/components/testimonials/TestimonialsBoard";

function HeroArt() {
  const gold = "var(--gold)";
  return (
    <motion.div
      className="relative mx-auto w-full max-w-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        className="pointer-events-none absolute -inset-8 opacity-40"
        style={{
          background: `radial-gradient(circle at 50% 45%, color-mix(in srgb, var(--ink) 8%, transparent), transparent 62%)`,
        }}
      />
      <div className="relative aspect-square overflow-hidden border border-border bg-bg">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              "linear-gradient(color-mix(in srgb, var(--ink) 8%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in srgb, var(--ink) 8%, transparent) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
            maskImage:
              "radial-gradient(circle at center, black 35%, transparent 78%)",
          }}
        />
        <motion.svg
          viewBox="0 0 420 420"
          className="relative z-10 h-full w-full text-ink"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
        >
          <motion.circle
            cx="210"
            cy="210"
            r="168"
            stroke="currentColor"
            strokeWidth="0.6"
            opacity="0.35"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.6, delay: 0.15 }}
          />
          <motion.circle
            cx="210"
            cy="210"
            r="132"
            stroke={gold}
            strokeWidth="0.8"
            opacity="0.7"
            strokeDasharray="4 10"
            animate={{ rotate: 360 }}
            transition={{ duration: 64, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: "210px 210px" }}
          />
          <motion.circle
            cx="210"
            cy="210"
            r="96"
            stroke="currentColor"
            strokeWidth="1"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.3, delay: 0.25 }}
          />
          <motion.circle
            cx="210"
            cy="210"
            r="58"
            stroke="currentColor"
            strokeWidth="1"
            animate={{ rotate: -360 }}
            transition={{ duration: 42, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: "210px 210px" }}
          />
          <motion.path
            d="M210 52 L220 92 L262 92 L228 116 L241 156 L210 132 L179 156 L192 116 L158 92 L200 92 Z"
            stroke={gold}
            strokeWidth="1.2"
            fill="none"
            animate={{ opacity: [0.45, 1, 0.45] }}
            transition={{ duration: 4.2, repeat: Infinity }}
          />
          <ellipse
            cx="210"
            cy="210"
            rx="34"
            ry="18"
            stroke="currentColor"
            strokeWidth="1.2"
          />
          <motion.circle
            cx="210"
            cy="210"
            r="7"
            fill="currentColor"
            animate={{ scale: [1, 1.35, 1], opacity: [0.65, 1, 0.65] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            style={{ transformOrigin: "210px 210px" }}
          />
          <path
            d="M118 292 C145 255 178 248 210 278 C242 248 275 255 302 292"
            stroke="currentColor"
            strokeWidth="1"
            opacity="0.85"
          />
          <motion.circle
            cx="78"
            cy="118"
            r="16"
            stroke="currentColor"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.circle
            cx="78"
            cy="118"
            r="4"
            fill={gold}
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2.8, repeat: Infinity }}
          />
          <path
            d="M328 96 C352 96 364 118 352 136 C340 154 316 148 318 124 C320 106 328 96 328 96 Z"
            stroke="currentColor"
            strokeWidth="1"
          />
          <motion.g
            animate={{ rotate: 360 }}
            transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: "210px 210px" }}
          >
            <circle cx="210" cy="54" r="2.5" fill={gold} />
            <circle cx="366" cy="210" r="2" fill="currentColor" opacity="0.7" />
            <circle cx="210" cy="366" r="2.5" fill={gold} />
            <circle cx="54" cy="210" r="2" fill="currentColor" opacity="0.7" />
          </motion.g>
          <line
            x1="48"
            y1="378"
            x2="372"
            y2="378"
            stroke="currentColor"
            opacity="0.22"
          />
          <text
            x="210"
            y="398"
            textAnchor="middle"
            fill="currentColor"
            opacity="0.45"
            style={{ fontSize: 9, letterSpacing: "0.28em" }}
          >
            TAROT · NATAL
          </text>
        </motion.svg>
      </div>
    </motion.div>
  );
}

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-border">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 15% 20%, color-mix(in srgb, var(--ink) 4%, transparent), transparent 42%), radial-gradient(ellipse at 85% 60%, color-mix(in srgb, var(--ink) 4%, transparent), transparent 45%), var(--bg-white)",
          }}
        />
        <MysticAtmosphere density={12} />
        <div className="container-page relative z-10 grid items-center gap-12 py-16 md:grid-cols-2 md:gap-14 md:py-28">
          <motion.div
            initial="hidden"
            animate="show"
            variants={staggerContainer}
            className="relative"
          >
            <motion.p
              variants={fadeUp}
              className="font-serif text-sm tracking-[0.35em] text-ink md:text-base"
            >
              ТАРО
            </motion.p>
            <motion.div
              variants={fadeUp}
              className="mt-4 h-px w-14 bg-ink"
            />
            <motion.h1
              variants={fadeUp}
              className="mt-6 font-serif text-5xl leading-[1.05] md:text-6xl lg:text-[72px]"
            >
              Асуултынхаа
              <br />
              хариуг ол
            </motion.h1>
            <motion.p
              variants={fadeUp}
              className="mt-6 max-w-md text-base leading-relaxed text-ink-muted"
            >
              Таро уншлага эсвэл төрсөн зурхай — асуултаа бодож, өөрт тохирсон
              замыг сонгоорой.
            </motion.p>
            <motion.div
              variants={fadeUp}
              className="mt-9 flex flex-wrap items-center gap-3"
            >
              <Link href="#unshlaga">
                <Button>Уншлага эхлүүлэх</Button>
              </Link>
              <Link href="/natal">
                <Button variant="secondary">Natal тайлан</Button>
              </Link>
            </motion.div>
            <motion.p
              variants={fadeUp}
              className="mt-6 text-[11px] tracking-[0.18em] text-ink-soft"
            >
              3 · 5 ХӨЗӨР · ТИЙМ/ҮГҮЙ · NATAL
            </motion.p>
          </motion.div>
          <HeroArt />
        </div>
      </section>

      <section
        id="unshlaga"
        className="relative overflow-hidden border-y border-border bg-bg-white py-16 md:py-24"
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-50"
          style={{
            background:
              "radial-gradient(ellipse at 10% 0%, color-mix(in srgb, var(--ink) 4%, transparent), transparent 45%), radial-gradient(ellipse at 90% 100%, color-mix(in srgb, var(--ink) 5%, transparent), transparent 40%)",
          }}
        />
        <div className="container-page relative z-10">
          <motion.div
            className="mx-auto max-w-2xl text-center"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-xs tracking-[0.28em] text-ink-soft">
              ✦ READINGS ✦
            </p>
            <h2 className="mt-3 font-serif text-3xl md:text-5xl">
              Уншлагын төрлүүд
            </h2>
            <p className="mt-3 text-sm text-ink-muted">
              Таро уншлага болон төрсөн зурхай — тус тусдаа сонгож, тус тусдаа
              төлнө.
            </p>
          </motion.div>

          <div className="mt-12 grid items-stretch gap-4 sm:grid-cols-2">
            {[
              {
                index: "01",
                mark: "3",
                eyebrow: "TAROT",
                title: "3 хөзрийн уншлага",
                desc: "Одоогийн нөхцөл, нөлөөлөх хүчин зүйл, цаашдын чиглэл.",
                href: "/3-hozort",
                cta: "Эхлүүлэх",
              },
              {
                index: "02",
                mark: "5",
                eyebrow: "TAROT · DEEP",
                title: "5 хөзрийн дэлгэрэнгүй",
                desc: "Нөхцөл, саад, шалтгаан, зөвлөгөө, боломжит үр дүн.",
                href: "/5-hozort",
                cta: "Эхлүүлэх",
              },
              {
                index: "03",
                mark: "?",
                eyebrow: "FREE",
                title: "Тийм эсвэл Үгүй",
                desc: "Нэг хөзөр — асуултдаа хурдан, тод хариу.",
                href: "/tiim-ugui",
                cta: "Хариулт авах",
                badge: "Үнэгүй",
              },
              {
                index: "04",
                mark: "☉",
                eyebrow: "ASTROLOGY",
                title: "Natal · Төрсөн зурхай",
                desc: "Life Path, Нар · Сар · Сугар болон гариг бүрийн тайлбар.",
                href: "/natal",
                cta: "Зурхай нээх",
              },
            ].map((item, i) => (
              <motion.article
                key={item.href}
                className="group relative flex h-full flex-col overflow-hidden border border-border bg-bg/80 p-6 backdrop-blur-[2px] transition duration-500 hover:border-ink/40 hover:shadow-[0_12px_40px_color-mix(in_srgb,var(--ink)_6%,transparent)] md:p-8"
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.08, duration: 0.45 }}
              >
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-ink transition duration-500 group-hover:scale-x-100" />
                <div className="flex items-start justify-between gap-3">
                  <p className="text-[10px] tracking-[0.22em] text-ink-soft">
                    {item.eyebrow}
                  </p>
                  <div className="flex items-center gap-3">
                    {item.badge ? (
                      <span className="border border-border px-2 py-0.5 text-[10px] tracking-[0.16em] text-ink-soft">
                        {item.badge}
                      </span>
                    ) : null}
                    <span className="font-serif text-sm text-ink-soft">
                      {item.index}
                    </span>
                  </div>
                </div>
                <p className="mt-6 font-serif text-5xl leading-none md:text-6xl">
                  {item.mark}
                </p>
                <h3 className="mt-5 font-serif text-2xl md:text-[28px]">
                  {item.title}
                </h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-muted">
                  {item.desc}
                </p>
                <div className="mt-8">
                  <Link href={item.href}>
                    <Button fullWidth>{item.cta}</Button>
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border">
        <div className="container-page py-16 md:py-20">
          <motion.div
            className="mx-auto max-w-xl text-center"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-xs tracking-[0.28em] text-ink-soft">✦ 72 ХӨЗӨР ✦</p>
            <h2 className="mt-3 font-serif text-3xl md:text-4xl">Бүх хөзрүүд</h2>
            <p className="mt-3 text-sm text-ink-muted">
              Бүх 72 таро хөзрийг үзэж, хөзөр бүрийн утга, түлхүүр үгс болон
              тайлбарыг уншаарай.
            </p>
            <div className="mt-8">
              <Link href="/buh-hozruud">
                <Button>Хөзрүүдийг харах</Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="relative overflow-hidden border-t border-border bg-bg-white">
        <MysticAtmosphere density={8} />
        <div className="container-page relative z-10 py-16 md:py-20">
          <h2 className="text-center font-serif text-3xl">
            Хэрхэн ажилладаг вэ?
          </h2>
          <div className="mx-auto mt-12 flex max-w-3xl flex-col items-center gap-6 md:flex-row md:justify-between">
            {[
              "Асуултаа бичнэ",
              "Хөзрөө сонгоно",
              "Тайлбараа уншина",
            ].map((text, i) => (
              <motion.div
                key={text}
                className="flex items-center gap-6"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
              >
                <div className="text-center">
                  <p className="font-serif text-4xl">{i + 1}</p>
                  <p className="mt-2 text-sm text-ink-muted">{text}</p>
                </div>
                {i < 2 ? (
                  <span className="hidden text-ink-soft md:inline" aria-hidden>
                    →
                  </span>
                ) : null}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="setgegdel"
        className="border-t border-border py-16 md:py-24"
      >
        <div className="container-page">
          <TestimonialsBoard
            limit={3}
            showForm={false}
            showAllLink
          />
        </div>
      </section>

      <section
        id="butsaan-olgolt"
        className="border-t border-border bg-bg-white py-16 md:py-20"
      >
        <div className="container-page">
          <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-[1.2fr_0.8fr] md:items-center">
            <div>
              <p className="text-xs tracking-[0.28em] text-ink-soft">
                ✦ БУЦААН ОЛГОЛТ ✦
              </p>
              <h2 className="mt-2 font-serif text-3xl md:text-4xl">
                Буцаан олголт
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-ink-muted">
                Дижитал тайлан нээгдсэний дараа ерөнхийдөө буцаан олголт хийхгүй.
                Давхар төлбөр эсвэл техникийн алдаанаас тайлан нээгдээгүй
                тохиолдолд 48 цагийн дотор хүсэлт гаргана уу.
              </p>
            </div>
            <div className="flex flex-col gap-3 md:items-end">
              <Link href="/butsaan-olgoltiin-bodlogo">
                <Button>Буцаан олголтын бодлого</Button>
              </Link>
              <Link
                href="/holboo-barih"
                className="text-sm underline underline-offset-4"
              >
                Холбоо барих
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
