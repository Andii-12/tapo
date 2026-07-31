"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Field, Input, Select, Textarea } from "@/components/ui/Field";
import { useToast } from "@/components/ui/Toast";
import type {
  TestimonialSentiment,
  TestimonialView,
} from "@/lib/content/testimonials";

const READING_TYPES = [
  "",
  "3 хөзрийн уншлага",
  "5 хөзрийн уншлага",
  "Тийм / Үгүй",
  "Natal тайлан",
  "3 хөзөр + Natal",
  "Бусад",
];

export function TestimonialForm({
  onCreated,
}: {
  onCreated?: (item: TestimonialView) => void;
}) {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [meta, setMeta] = useState("");
  const [tag, setTag] = useState("");
  const [sentiment, setSentiment] = useState<TestimonialSentiment>("good");
  const [quote, setQuote] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          quote,
          meta: meta || undefined,
          tag: tag.trim() || "СЭТГЭГДЭЛ",
          sentiment,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Илгээж чадсангүй");
      toast("Сэтгэгдэл илгээгдлээ. Админ баталгаажуулсны дараа харагдана.");
      setName("");
      setMeta("");
      setQuote("");
      setTag("");
      setSentiment("good");
      onCreated?.(json.data);
    } catch (err) {
      toast(err instanceof Error ? err.message : "Илгээж чадсангүй");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-4 border border-border bg-bg-white p-5 md:p-6"
    >
      <div>
        <p className="text-[10px] tracking-[0.2em] text-ink-soft">WRITE</p>
        <h3 className="mt-2 font-serif text-2xl">Сэтгэгдэл бичих</h3>
        <p className="mt-2 text-sm text-ink-muted">
          Таны туршлагыг бусадтай хуваалцаарай.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Нэр">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            maxLength={80}
          />
        </Field>
        <Field label="Уншлагын төрөл (заавал биш)">
          <Select value={meta} onChange={(e) => setMeta(e.target.value)}>
            <option value="">Сонгохгүй</option>
            {READING_TYPES.filter(Boolean).map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </Select>
        </Field>
      </div>
      <Field label="Ангилал / гарчиг">
        <Input
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          placeholder="Ж: Карьер, Харилцаа, Өөрийгөө мэдэх…"
          maxLength={40}
        />
      </Field>
      <Field label="Үнэлгээ">
        <div
          className="inline-flex border border-border p-0.5"
          role="group"
          aria-label="Үнэлгээ"
        >
          <button
            type="button"
            onClick={() => setSentiment("good")}
            className={`px-3 py-1.5 text-xs tracking-wide transition ${
              sentiment === "good"
                ? "bg-ink text-on-ink"
                : "text-ink-muted hover:text-ink"
            }`}
            aria-pressed={sentiment === "good"}
          >
            Сайн сэтгэгдэл
          </button>
          <button
            type="button"
            onClick={() => setSentiment("bad")}
            className={`px-3 py-1.5 text-xs tracking-wide transition ${
              sentiment === "bad"
                ? "bg-ink text-on-ink"
                : "text-ink-muted hover:text-ink"
            }`}
            aria-pressed={sentiment === "bad"}
          >
            Муу сэтгэгдэл
          </button>
        </div>
      </Field>
      <Field label="Сэтгэгдэл">
        <Textarea
          rows={4}
          value={quote}
          onChange={(e) => setQuote(e.target.value)}
          required
          minLength={20}
          maxLength={800}
          placeholder="Хамгийн багадаа 20 тэмдэгт…"
        />
      </Field>
      <Button type="submit" loading={loading} fullWidth>
        Илгээх
      </Button>
    </form>
  );
}
