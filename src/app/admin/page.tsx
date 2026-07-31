"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/Field";
import { LoadingState } from "@/components/ui/States";
import type { TestimonialView } from "@/lib/content/testimonials";

type Stats = {
  totalReadings: number;
  paidCount: number;
  totalRevenue: number;
  activeCards: number;
};

type ReadingRow = {
  readingId: string;
  userName: string;
  email?: string;
  readingType: string;
  paymentStatus: string;
  createdAt: string;
  question: string;
  selectedCardIds: string[];
  freeResult?: unknown;
  paidResult?: unknown;
  price?: number;
};

function formatMoney(amount: number) {
  return amount.toLocaleString("en-US");
}

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats | null>(null);
  const [readings, setReadings] = useState<ReadingRow[]>([]);
  const [q, setQ] = useState("");
  const [type, setType] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [cards, setCards] = useState<
    Array<{
      cardId: string;
      nameMn: string;
      yesNoAnswer: string;
      isActive: boolean;
      shortMeaningMn: string;
    }>
  >([]);
  const [prices, setPrices] = useState({
    threeCardPrice: 19900,
    fiveCardPrice: 29900,
    natalPrice: 14900,
    currency: "MNT",
  });
  const [tab, setTab] = useState<"readings" | "cards" | "prices" | "reviews">(
    "readings"
  );
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [testimonials, setTestimonials] = useState<TestimonialView[]>([]);
  const [reviewBusyId, setReviewBusyId] = useState<string | null>(null);
  const [reviewFilter, setReviewFilter] = useState<
    "" | "pending" | "approved" | "hidden"
  >("");

  async function deleteReading(readingId: string) {
    const ok = window.confirm(
      `${readingId} уншлагыг устгах уу? Энэ үйлдлийг буцаах боломжгүй.`
    );
    if (!ok) return;

    setDeletingId(readingId);
    try {
      const res = await fetch("/api/admin/readings", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ readingId }),
      });
      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }
      const json = await res.json();
      if (!res.ok) {
        alert(json.error || "Устгаж чадсангүй");
        return;
      }
      setReadings((prev) => prev.filter((r) => r.readingId !== readingId));
      await load();
    } finally {
      setDeletingId(null);
    }
  }

  async function load() {
    setLoading(true);
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (type) params.set("type", type);
    if (paymentStatus) params.set("paymentStatus", paymentStatus);
    const res = await fetch(`/api/admin/readings?${params}`);
    if (res.status === 401) {
      router.push("/admin/login");
      return;
    }
    const json = await res.json();
    setStats(json.data.stats);
    setReadings(json.data.readings);
    setLoading(false);
  }

  async function loadCards() {
    const res = await fetch("/api/admin/cards");
    if (res.status === 401) {
      router.push("/admin/login");
      return;
    }
    const json = await res.json();
    setCards(json.data);
  }

  async function loadPrices() {
    const res = await fetch("/api/admin/settings");
    if (res.ok) {
      const json = await res.json();
      if (json.data) {
        setPrices({
          threeCardPrice: json.data.threeCardPrice,
          fiveCardPrice: json.data.fiveCardPrice,
          natalPrice: json.data.natalPrice ?? 14900,
          currency: json.data.currency,
        });
      }
    }
  }

  async function loadTestimonials() {
    const res = await fetch("/api/admin/testimonials");
    if (res.status === 401) {
      router.push("/admin/login");
      return;
    }
    const json = await res.json();
    if (res.ok && Array.isArray(json.data)) {
      setTestimonials(json.data);
    }
  }

  async function setReviewStatus(
    id: string,
    status: "approved" | "pending" | "hidden"
  ) {
    setReviewBusyId(id);
    try {
      const res = await fetch("/api/admin/testimonials", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }
      const json = await res.json();
      if (!res.ok) {
        alert(json.error || "Шинэчилж чадсангүй");
        return;
      }
      setTestimonials((prev) =>
        prev.map((t) => (t.id === id ? { ...t, ...json.data } : t))
      );
    } finally {
      setReviewBusyId(null);
    }
  }

  async function deleteReview(id: string) {
    const ok = window.confirm("Энэ сэтгэгдлийг устгах уу?");
    if (!ok) return;
    setReviewBusyId(id);
    try {
      const res = await fetch("/api/admin/testimonials", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }
      const json = await res.json();
      if (!res.ok) {
        alert(json.error || "Устгаж чадсангүй");
        return;
      }
      setTestimonials((prev) => prev.filter((t) => t.id !== id));
    } finally {
      setReviewBusyId(null);
    }
  }

  useEffect(() => {
    load();
    loadCards();
    loadPrices();
    loadTestimonials();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading && !stats) {
    return <LoadingState message="Админ самбар ачаалж байна…" />;
  }

  const pendingCount = testimonials.filter((t) => t.status === "pending").length;
  const filteredReviews = reviewFilter
    ? testimonials.filter((t) => t.status === reviewFilter)
    : testimonials;

  return (
    <div className="min-h-screen bg-bg">
      <header className="border-b border-border bg-bg-white">
        <div className="container-page flex h-14 items-center justify-between">
          <p className="font-serif text-xl tracking-[0.12em]">ТАРО · Админ</p>
          <Button
            variant="secondary"
            onClick={async () => {
              await fetch("/api/admin/login", { method: "DELETE" });
              router.push("/admin/login");
            }}
          >
            Гарах
          </Button>
        </div>
      </header>

      <div className="container-page py-8">
        <div className="grid gap-4 sm:grid-cols-4">
          <div className="border border-border bg-bg-white p-4">
            <p className="text-xs text-ink-soft">Нийт уншлага</p>
            <p className="mt-2 font-serif text-2xl tabular-nums tracking-wide">
              {stats?.totalReadings ?? 0}
            </p>
          </div>
          <div className="border border-border bg-bg-white p-4">
            <p className="text-xs text-ink-soft">Төлбөртэй</p>
            <p className="mt-2 font-serif text-2xl tabular-nums tracking-wide">
              {stats?.paidCount ?? 0}
            </p>
          </div>
          <div className="border border-border bg-bg-white p-4">
            <p className="text-xs text-ink-soft">Орлого</p>
            <p className="mt-2 flex items-baseline gap-1.5 font-serif text-2xl tabular-nums tracking-wide">
              <span>{formatMoney(stats?.totalRevenue || 0)}</span>
              <span className="text-base font-sans text-ink-muted">₮</span>
            </p>
          </div>
          <div className="border border-border bg-bg-white p-4">
            <p className="text-xs text-ink-soft">Идэвхтэй хөзөр</p>
            <p className="mt-2 font-serif text-2xl tabular-nums tracking-wide">
              {stats?.activeCards ?? 0}
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          {(
            [
              ["readings", "Уншлагууд"],
              ["cards", "Хөзрүүд"],
              ["prices", "Үнэ"],
              [
                "reviews",
                pendingCount ? `Сэтгэгдэл (${pendingCount})` : "Сэтгэгдэл",
              ],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={`border px-4 py-2 text-sm ${
                tab === id ? "border-ink bg-ink text-on-ink" : "border-border"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === "readings" ? (
          <div className="mt-6 space-y-4">
            <div className="grid gap-3 md:grid-cols-4">
              <Input
                placeholder="Хайх (нэр, и-мэйл, дугаар)"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
              <select
                className="border border-border bg-bg-white px-3 py-3 text-sm"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="">Бүх төрөл</option>
                <option value="three-card">3 хөзөр</option>
                <option value="five-card">5 хөзөр</option>
                <option value="yes-no">Тийм/Үгүй</option>
              </select>
              <select
                className="border border-border bg-bg-white px-3 py-3 text-sm"
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value)}
              >
                <option value="">Бүх төлбөр</option>
                <option value="pending">pending</option>
                <option value="paid">paid</option>
                <option value="not_required">not_required</option>
                <option value="failed">failed</option>
              </select>
              <Button onClick={load}>Шүүх</Button>
            </div>

            <div className="overflow-x-auto border border-border bg-bg-white">
              <table className="min-w-full text-left text-sm">
                <thead className="border-b border-border text-xs text-ink-soft">
                  <tr>
                    <th className="p-3">Дугаар</th>
                    <th className="p-3">Нэр</th>
                    <th className="p-3">Төрөл</th>
                    <th className="p-3">Төлбөр</th>
                    <th className="p-3">Огноо</th>
                    <th className="p-3">Үйлдэл</th>
                  </tr>
                </thead>
                <tbody>
                  {readings.map((r) => (
                    <tr
                      key={r.readingId}
                      className="border-b border-border align-top"
                    >
                      <td className="p-3">{r.readingId}</td>
                      <td className="p-3">
                        <div>{r.userName}</div>
                        <div className="text-xs text-ink-soft">{r.email}</div>
                      </td>
                      <td className="p-3">{r.readingType}</td>
                      <td className="p-3">{r.paymentStatus}</td>
                      <td className="p-3">
                        {new Date(r.createdAt).toLocaleString("mn-MN")}
                      </td>
                      <td className="p-3">
                        <div className="flex flex-wrap gap-2">
                          <Button
                            variant="secondary"
                            onClick={async () => {
                              await fetch("/api/admin/resend-email", {
                                method: "POST",
                                headers: {
                                  "Content-Type": "application/json",
                                },
                                body: JSON.stringify({
                                  readingId: r.readingId,
                                }),
                              });
                              alert("И-мэйл дахин илгээх оролдлого хийлээ");
                            }}
                          >
                            И-мэйл
                          </Button>
                          <Button
                            variant="secondary"
                            disabled={deletingId === r.readingId}
                            onClick={() => deleteReading(r.readingId)}
                          >
                            {deletingId === r.readingId ? "Устгаж…" : "Устгах"}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : null}

        {tab === "cards" ? (
          <div className="mt-6 space-y-3">
            {cards.map((card) => (
              <div
                key={card.cardId}
                className="grid gap-3 border border-border bg-bg-white p-4 md:grid-cols-[1fr_120px_120px_100px]"
              >
                <div>
                  <p className="font-serif text-lg">{card.nameMn}</p>
                  <p className="text-xs text-ink-soft">{card.cardId}</p>
                  <textarea
                    className="mt-2 w-full border border-border p-2 text-sm"
                    defaultValue={card.shortMeaningMn}
                    rows={2}
                    onBlur={async (e) => {
                      await fetch("/api/admin/cards", {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          cardId: card.cardId,
                          shortMeaningMn: e.target.value,
                        }),
                      });
                    }}
                  />
                </div>
                <select
                  className="border border-border px-2 text-sm"
                  defaultValue={card.yesNoAnswer}
                  onChange={async (e) => {
                    await fetch("/api/admin/cards", {
                      method: "PATCH",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        cardId: card.cardId,
                        yesNoAnswer: e.target.value,
                      }),
                    });
                  }}
                >
                  <option value="yes">yes</option>
                  <option value="no">no</option>
                </select>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    defaultChecked={card.isActive}
                    onChange={async (e) => {
                      await fetch("/api/admin/cards", {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          cardId: card.cardId,
                          isActive: e.target.checked,
                        }),
                      });
                    }}
                  />
                  Идэвхтэй
                </label>
              </div>
            ))}
          </div>
        ) : null}

        {tab === "prices" ? (
          <div className="mt-6 max-w-md space-y-4 border border-border bg-bg-white p-6">
            <Field label="3 хөзрийн үнэ">
              <Input
                type="number"
                value={prices.threeCardPrice}
                onChange={(e) =>
                  setPrices((p) => ({
                    ...p,
                    threeCardPrice: Number(e.target.value),
                  }))
                }
              />
            </Field>
            <Field label="5 хөзрийн үнэ">
              <Input
                type="number"
                value={prices.fiveCardPrice}
                onChange={(e) =>
                  setPrices((p) => ({
                    ...p,
                    fiveCardPrice: Number(e.target.value),
                  }))
                }
              />
            </Field>
            <Field label="Natal дэлгэрэнгүй үнэ">
              <Input
                type="number"
                value={prices.natalPrice}
                onChange={(e) =>
                  setPrices((p) => ({
                    ...p,
                    natalPrice: Number(e.target.value),
                  }))
                }
              />
            </Field>
            <Button
              onClick={async () => {
                await fetch("/api/admin/settings", {
                  method: "PUT",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(prices),
                });
                alert("Үнэ хадгаллаа");
              }}
            >
              Хадгалах
            </Button>
          </div>
        ) : null}

        {tab === "reviews" ? (
          <div className="mt-6 space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <select
                className="border border-border bg-bg-white px-3 py-3 text-sm"
                value={reviewFilter}
                onChange={(e) =>
                  setReviewFilter(
                    e.target.value as "" | "pending" | "approved" | "hidden"
                  )
                }
              >
                <option value="">Бүх төлөв</option>
                <option value="pending">Хүлээгдэж буй</option>
                <option value="approved">Зөвшөөрсөн</option>
                <option value="hidden">Нуусан</option>
              </select>
              <Button variant="secondary" onClick={loadTestimonials}>
                Шинэчлэх
              </Button>
              <p className="text-sm text-ink-soft">
                Нийт {testimonials.length} · Хүлээгдэж буй {pendingCount}
              </p>
            </div>

            <div className="space-y-3">
              {filteredReviews.length === 0 ? (
                <p className="border border-border bg-bg-white p-6 text-sm text-ink-muted">
                  Сэтгэгдэл олдсонгүй.
                </p>
              ) : (
                filteredReviews.map((t) => (
                  <div
                    key={t.id}
                    className="border border-border bg-bg-white p-4 md:p-5"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="font-serif text-lg">{t.name}</p>
                        <p className="mt-1 text-xs text-ink-soft">
                          {t.meta || "—"} · {t.tag} ·{" "}
                          {t.sentiment === "bad" ? "Муу" : "Сайн"}
                          {t.isStatic ? " · Суурь" : ""}
                          {t.createdAt
                            ? ` · ${new Date(t.createdAt).toLocaleString("mn-MN")}`
                            : ""}
                        </p>
                      </div>
                      <span
                        className={`border px-2 py-1 text-[10px] tracking-[0.14em] ${
                          t.status === "approved"
                            ? "border-ink bg-ink text-on-ink"
                            : t.status === "pending"
                              ? "border-border bg-bg"
                              : "border-border text-ink-soft"
                        }`}
                      >
                        {t.status === "approved"
                          ? "ЗӨВШӨӨРСӨН"
                          : t.status === "pending"
                            ? "ХҮЛЭЭГДЭЖ БУЙ"
                            : "НУУСАН"}
                      </span>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                      {t.quote}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {t.status !== "approved" ? (
                        <Button
                          variant="secondary"
                          disabled={reviewBusyId === t.id}
                          onClick={() => setReviewStatus(t.id, "approved")}
                        >
                          Зөвшөөрөх
                        </Button>
                      ) : null}
                      {t.status !== "hidden" ? (
                        <Button
                          variant="secondary"
                          disabled={reviewBusyId === t.id}
                          onClick={() => setReviewStatus(t.id, "hidden")}
                        >
                          Нуух
                        </Button>
                      ) : null}
                      {t.status === "hidden" ? (
                        <Button
                          variant="secondary"
                          disabled={reviewBusyId === t.id}
                          onClick={() => setReviewStatus(t.id, "pending")}
                        >
                          Хүлээлгэх
                        </Button>
                      ) : null}
                      {!t.isStatic ? (
                        <Button
                          variant="secondary"
                          disabled={reviewBusyId === t.id}
                          onClick={() => deleteReview(t.id)}
                        >
                          Устгах
                        </Button>
                      ) : null}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
