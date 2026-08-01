"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";

type PaymentProduct = "reading" | "natal";

type BankLink = {
  name: string;
  link: string;
  logo?: string;
  description?: string;
};

type PaymentSession = {
  paymentRef: string;
  qrPayload?: string;
  qrImage?: string;
  checkoutUrl?: string;
  bankUrls?: BankLink[];
  provider?: string;
};

export function PaymentModal({
  open,
  onClose,
  product = "reading",
  readingId,
  natalOrderId,
  token,
  priceText,
  onPaid,
}: {
  open: boolean;
  onClose: () => void;
  product?: PaymentProduct;
  readingId?: string;
  natalOrderId?: string;
  token: string;
  priceText: string;
  onPaid: () => Promise<void>;
}) {
  const [status, setStatus] = useState("Төлбөр хүлээгдэж байна");
  const [session, setSession] = useState<PaymentSession | null>(null);
  const [loading, setLoading] = useState(false);
  const isDev = process.env.NODE_ENV !== "production";

  const orderId = product === "natal" ? natalOrderId : readingId;
  const orderLabel =
    product === "natal" ? "Natal захиалга" : "Уншлагын дугаар";
  const provider = session?.provider;
  const isByl = provider === "byl";
  const isQPay = provider === "qpay";
  const isHosted = isByl || isQPay;

  async function ensureOrder() {
    if (session?.paymentRef) return session.paymentRef;
    if (!orderId) {
      setStatus("Захиалгын дугаар олдсонгүй");
      return null;
    }
    setLoading(true);
    setStatus("Төлбөр бэлтгэж байна…");
    try {
      const url =
        product === "natal"
          ? `/api/natal/orders/${orderId}/payment`
          : `/api/readings/${orderId}/payment`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Алдаа");
      setSession({
        paymentRef: json.data.paymentRef,
        qrPayload: json.data.qrPayload,
        qrImage: json.data.qrImage,
        checkoutUrl: json.data.checkoutUrl,
        bankUrls: json.data.bankUrls,
        provider: json.data.provider,
      });
      if (json.data.provider === "byl") {
        setStatus("Byl төлбөрийн хуудас руу орж төлнө үү");
      } else if (json.data.provider === "qpay") {
        setStatus("QPay QR кодоор эсвэл банкны аппаар төлнө үү");
      } else {
        setStatus("Төлбөр хүлээгдэж байна");
      }
      return json.data.paymentRef as string;
    } catch (e) {
      setStatus(e instanceof Error ? e.message : "Алдаа гарлаа");
      return null;
    } finally {
      setLoading(false);
    }
  }

  async function checkStatus() {
    if (!orderId) return;
    setLoading(true);
    setStatus("Төлбөр шалгаж байна…");
    try {
      await ensureOrder();
      const url =
        product === "natal"
          ? `/api/natal/orders/${orderId}/payment-status?token=${encodeURIComponent(token)}`
          : `/api/readings/${orderId}/payment-status?token=${encodeURIComponent(token)}`;
      const res = await fetch(url);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Алдаа");
      if (json.data.paymentStatus === "paid") {
        setStatus("Төлбөр амжилттай");
        await onPaid();
      } else {
        setStatus(
          isHosted
            ? "Төлбөр хараахан ирээгүй байна. Төлсний дараа дахин шалгана уу."
            : "Төлбөр хүлээгдэж байна"
        );
      }
    } catch (e) {
      setStatus(e instanceof Error ? e.message : "Төлбөр амжилтгүй");
    } finally {
      setLoading(false);
    }
  }

  async function mockPay() {
    setLoading(true);
    try {
      const ref = await ensureOrder();
      if (!ref) return;
      const res = await fetch("/api/payments/mock-complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentRef: ref }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Алдаа");
      setStatus("Төлбөр амжилттай");
      await onPaid();
    } catch (e) {
      setStatus(e instanceof Error ? e.message : "Төлбөр амжилтгүй");
    } finally {
      setLoading(false);
    }
  }

  const qrSrc =
    isQPay && session?.qrImage
      ? session.qrImage.startsWith("data:")
        ? session.qrImage
        : `data:image/png;base64,${session.qrImage}`
      : null;

  return (
    <Modal open={open} onClose={onClose} title="Төлбөр төлөх">
      <div className="space-y-4 text-sm">
        <p>
          {orderLabel}: <strong>{orderId}</strong>
        </p>
        <p className="font-serif text-3xl">{priceText}</p>

        {isByl && session?.checkoutUrl ? (
          <div className="space-y-3 border border-border bg-bg-white p-4">
            <p className="text-ink-muted">
              Byl-ээр QPay, SocialPay, Pocket зэрэг сувгаар төлнө. Доорх
              товчоор төлбөрийн хуудас нээгдэнэ.
            </p>
            <a href={session.checkoutUrl} target="_blank" rel="noopener noreferrer">
              <Button fullWidth>Byl төлбөрийн хуудас нээх</Button>
            </a>
          </div>
        ) : null}

        {isQPay ? (
          <div className="flex flex-col items-center gap-3">
            <div className="flex aspect-square w-48 items-center justify-center border border-border bg-bg-white p-2">
              {qrSrc ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={qrSrc}
                  alt="QPay QR код"
                  className="h-full w-full object-contain"
                />
              ) : (
                <span className="p-3 text-center text-[10px] text-ink-soft break-all">
                  {session?.qrPayload || "QR код"}
                </span>
              )}
            </div>
            {session?.checkoutUrl ? (
              <a
                href={session.checkoutUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm underline underline-offset-4"
              >
                QPay хуудас нээх
              </a>
            ) : null}
          </div>
        ) : null}

        {session?.bankUrls?.length ? (
          <div className="space-y-2">
            <p className="text-xs tracking-wide text-ink-soft">
              Банкны аппаар төлөх
            </p>
            <div className="flex flex-wrap gap-2">
              {session.bankUrls.map((bank) => (
                <a
                  key={`${bank.name}-${bank.link}`}
                  href={bank.link}
                  className="border border-border px-3 py-2 text-xs hover:border-ink"
                >
                  {bank.name}
                </a>
              ))}
            </div>
          </div>
        ) : null}

        <p className="text-ink-muted">
          {isHosted
            ? "Төлсний дараа «Төлбөр шалгах» товчийг дарна уу."
            : "Төлбөрийн дараа «Төлбөр шалгах» товчийг дарна уу."}
        </p>
        <p aria-live="polite">{status}</p>
        <div className="flex flex-wrap gap-3">
          <Button
            onClick={async () => {
              await ensureOrder();
            }}
            loading={loading}
          >
            Төлбөр эхлүүлэх
          </Button>
          <Button variant="secondary" onClick={checkStatus} loading={loading}>
            Төлбөр шалгах
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Болих
          </Button>
        </div>
        {isDev && provider === "mock" ? (
          <Button variant="secondary" onClick={mockPay} loading={loading} fullWidth>
            Туршилтын төлбөр амжилттай болгох
          </Button>
        ) : null}
      </div>
    </Modal>
  );
}
