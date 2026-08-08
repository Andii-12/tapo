"use client";

import { useEffect, useMemo, useState } from "react";
import { NatalChartPanel } from "@/components/astrology/NatalChartPanel";
import { PaymentModal } from "@/components/payment/PaymentModal";
import { Button } from "@/components/ui/Button";
import { Field, Input, Select } from "@/components/ui/Field";
import { Modal } from "@/components/ui/Modal";
import { MysticAtmosphere } from "@/components/ui/MysticAtmosphere";
import { useToast } from "@/components/ui/Toast";
import type { NatalChartResult } from "@/lib/astrology/natal";
import type {
  NatalFullReport,
  NatalPreviewReport,
} from "@/lib/astrology/report";
import { LIST_PRICES, formatMnt } from "@/lib/pricing";

const MN_MONTHS = [
  "1-р сар",
  "2-р сар",
  "3-р сар",
  "4-р сар",
  "5-р сар",
  "6-р сар",
  "7-р сар",
  "8-р сар",
  "9-р сар",
  "10-р сар",
  "11-р сар",
  "12-р сар",
];

function daysInMonth(year: number, month: number) {
  return new Date(year, month, 0).getDate();
}

type NatalSession = {
  orderId: string;
  accessToken: string;
  price: number;
  currency: string;
  isPaid: boolean;
  email: string | null;
  chart: NatalChartResult;
  report: NatalFullReport | NatalPreviewReport;
};

export default function NatalPage() {
  const { toast } = useToast();
  const currentYear = new Date().getFullYear();
  const years = useMemo(
    () => Array.from({ length: 100 }, (_, i) => currentYear - i),
    [currentYear]
  );

  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [hour, setHour] = useState("");
  const [minute, setMinute] = useState("");
  const [email, setEmail] = useState("");
  const [session, setSession] = useState<NatalSession | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [payOpen, setPayOpen] = useState(false);
  const [pdfOpen, setPdfOpen] = useState(false);
  const [emailOpen, setEmailOpen] = useState(false);
  const [sendEmail, setSendEmail] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const birthDate = params.get("birthDate");
    if (!birthDate || !/^\d{4}-\d{2}-\d{2}$/.test(birthDate)) return;
    const [y, m, d] = birthDate.split("-");
    setYear(y);
    setMonth(String(Number(m)));
    setDay(String(Number(d)));
    const birthTime = params.get("birthTime");
    if (birthTime && /^\d{2}:\d{2}$/.test(birthTime)) {
      const [h, min] = birthTime.split(":");
      setHour(h);
      setMinute(min);
    }
  }, []);

  const maxDay =
    year && month ? daysInMonth(Number(year), Number(month)) : 31;
  const days = useMemo(
    () => Array.from({ length: maxDay }, (_, i) => i + 1),
    [maxDay]
  );

  const isFree = Boolean(session && session.price <= 0);
  const listPrice = LIST_PRICES.natal;
  const priceText = session
    ? isFree
      ? `${formatMnt(listPrice)} → Sale Үнэгүй`
      : formatMnt(session.price)
    : "";

  async function refreshSession(orderId: string, token: string) {
    const res = await fetch(
      `/api/natal/orders/${orderId}?token=${encodeURIComponent(token)}`
    );
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Ачаалж чадсангүй");
    setSession({
      orderId: json.data.orderId,
      accessToken: token,
      price: json.data.price,
      currency: json.data.currency,
      isPaid: json.data.isPaid,
      email: json.data.email || null,
      chart: json.data.chart,
      report: json.data.report,
    });
    if (json.data.email) setSendEmail(json.data.email);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!year || !month || !day) {
      setError("Төрсөн он, сар, өдрөө сонгоно уу");
      return;
    }
    const birthDate = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const birthTime =
      hour !== "" && minute !== ""
        ? `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`
        : "";

    setLoading(true);
    try {
      const res = await fetch("/api/natal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          birthDate,
          birthTime,
          email: email.trim() || undefined,
          createOrder: true,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Тооцоолж чадсангүй");
      setSession({
        orderId: json.data.orderId,
        accessToken: json.data.accessToken,
        price: json.data.price,
        currency: json.data.currency,
        isPaid: json.data.isPaid,
        email: json.data.email || null,
        chart: json.data.chart,
        report: json.data.report,
      });
      if (json.data.email) setSendEmail(json.data.email);
      else if (email.trim()) setSendEmail(email.trim());
    } catch (err) {
      setSession(null);
      setError(err instanceof Error ? err.message : "Алдаа гарлаа");
    } finally {
      setLoading(false);
    }
  }

  async function downloadPdf() {
    if (!session) return;
    setBusy(true);
    try {
      const res = await fetch(
        `/api/natal/orders/${session.orderId}/pdf?token=${encodeURIComponent(session.accessToken)}`
      );
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error || "PDF татаж чадсангүй");
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `natal-${session.orderId}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      toast("PDF татагдлаа");
      setPdfOpen(false);
    } catch (err) {
      toast(err instanceof Error ? err.message : "PDF алдаа");
    } finally {
      setBusy(false);
    }
  }

  async function sendNatalMail() {
    if (!session) return;
    if (!sendEmail.trim()) {
      toast("И-мэйл хаяг оруулна уу");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch(`/api/natal/orders/${session.orderId}/email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: session.accessToken,
          email: sendEmail.trim(),
          confirm: true,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Илгээж чадсангүй");
      toast(`И-мэйл илгээлээ: ${json.data.recipient}`);
      setSession((s) => (s ? { ...s, email: sendEmail.trim() } : s));
      setEmailOpen(false);
    } catch (err) {
      toast(err instanceof Error ? err.message : "И-мэйл алдаа");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="relative overflow-hidden py-10 md:py-14">
      <MysticAtmosphere density={12} />
      <div className="container-page relative z-10">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs tracking-[0.28em] text-ink-soft">
            ✦ NATAL CHART ✦
          </p>
          <h1 className="mt-3 font-serif text-3xl md:text-5xl">
            Төрсөн зурхай
          </h1>
          <p className="mt-3 text-sm text-ink-muted">
            Life path, Sun, Moon, Venus болон бүх гол гаригуудын ордыг тооцоолж,
            дэлгэрэнгүй тайлбарыг төлбөрөөр нээнэ.
          </p>
        </div>

        <form
          onSubmit={onSubmit}
          className="mx-auto mt-10 max-w-2xl space-y-5 border border-border bg-bg-white p-6"
        >
          <Field label="Төрсөн огноо">
            <div className="grid grid-cols-3 gap-2">
              <Select value={year} onChange={(e) => setYear(e.target.value)}>
                <option value="">Он</option>
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </Select>
              <Select value={month} onChange={(e) => setMonth(e.target.value)}>
                <option value="">Сар</option>
                {MN_MONTHS.map((label, i) => (
                  <option key={label} value={i + 1}>
                    {label}
                  </option>
                ))}
              </Select>
              <Select value={day} onChange={(e) => setDay(e.target.value)}>
                <option value="">Өдөр</option>
                {days.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </Select>
            </div>
          </Field>

          <Field label="Төрсөн цаг (заавал биш — Moon-д чухал)">
            <div className="grid grid-cols-2 gap-2">
              <Select value={hour} onChange={(e) => setHour(e.target.value)}>
                <option value="">Цаг</option>
                {Array.from({ length: 24 }, (_, i) => (
                  <option key={i} value={i}>
                    {String(i).padStart(2, "0")}
                  </option>
                ))}
              </Select>
              <Select value={minute} onChange={(e) => setMinute(e.target.value)}>
                <option value="">Минут</option>
                {[0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55].map((m) => (
                  <option key={m} value={m}>
                    {String(m).padStart(2, "0")}
                  </option>
                ))}
              </Select>
            </div>
          </Field>

          <Field label="И-мэйл (заавал биш — тайлан илгээхэд)">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              autoComplete="email"
            />
          </Field>

          {error ? <p className="text-sm text-ink">{error}</p> : null}
          <Button type="submit" fullWidth loading={loading}>
            Тооцоолох
          </Button>
        </form>

        {session ? (
          <div className="mt-12 space-y-8">
            <NatalChartPanel
              natal={session.chart}
              report={session.report}
              locked={!session.isPaid}
              priceText={priceText}
              listPrice={isFree ? listPrice : undefined}
              onUnlock={
                session.isPaid ? undefined : () => setPayOpen(true)
              }
            />

            {session.isPaid ? (
              <div className="border border-border bg-bg-white p-6 md:p-8">
                <p className="text-[10px] tracking-[0.22em] text-ink-soft">
                  DELIVERABLES
                </p>
                <h3 className="mt-2 font-serif text-2xl">
                  Тайлангаа хадгалах
                </h3>
                <p className="mt-2 max-w-xl text-sm text-ink-muted">
                  Бүрэн natal тайланг PDF-ээр татаж авах эсвэл и-мэйлээр хүлээн
                  авна уу.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Button variant="secondary" onClick={() => setPdfOpen(true)}>
                    Бүрэн PDF татах
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setSendEmail(session.email || email || "");
                      setEmailOpen(true);
                    }}
                  >
                    И-мэйлээр авах
                  </Button>
                </div>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>

      {session ? (
        <PaymentModal
          open={payOpen}
          onClose={() => setPayOpen(false)}
          product="natal"
          natalOrderId={session.orderId}
          token={session.accessToken}
          priceText={priceText}
          listPrice={listPrice}
          isFree={isFree}
          onPaid={async () => {
            await refreshSession(session.orderId, session.accessToken);
            toast(isFree ? "Бүрэн тайлан нээгдлээ" : "Төлбөр амжилттай");
            setPayOpen(false);
          }}
        />
      ) : null}

      <Modal
        open={pdfOpen}
        onClose={() => setPdfOpen(false)}
        title="PDF татах"
      >
        <p className="text-sm text-ink-muted">
          Life path, бүх гаригийн дэлгэрэнгүй болон нийлмэл дүгнэлтийг PDF-ээр
          татна.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button onClick={downloadPdf} loading={busy}>
            PDF татах
          </Button>
          <Button variant="secondary" onClick={() => setPdfOpen(false)}>
            Болих
          </Button>
        </div>
      </Modal>

      <Modal
        open={emailOpen}
        onClose={() => setEmailOpen(false)}
        title="И-мэйлээр авах"
      >
        <p className="text-sm text-ink-muted">
          Дэлгэрэнгүй natal тайланг доорх хаяг руу илгээнэ.
        </p>
        <div className="mt-4">
          <Field label="И-мэйл хаяг">
            <Input
              type="email"
              value={sendEmail}
              onChange={(e) => setSendEmail(e.target.value)}
              placeholder="name@example.com"
            />
          </Field>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button onClick={sendNatalMail} loading={busy}>
            Илгээх
          </Button>
          <Button variant="secondary" onClick={() => setEmailOpen(false)}>
            Болих
          </Button>
        </div>
      </Modal>
    </section>
  );
}
