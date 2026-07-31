"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";

type PaymentProduct = "reading" | "natal";

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
  const [paymentRef, setPaymentRef] = useState<string | null>(null);
  const [qr, setQr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const isDev = process.env.NODE_ENV !== "production";

  const orderId = product === "natal" ? natalOrderId : readingId;
  const orderLabel =
    product === "natal" ? "Natal захиалга" : "Уншлагын дугаар";

  async function ensureOrder() {
    if (paymentRef) return paymentRef;
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
      setPaymentRef(json.data.paymentRef);
      setQr(json.data.qrPayload);
      setStatus("Төлбөр хүлээгдэж байна");
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
        setStatus("Төлбөр хүлээгдэж байна");
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

  return (
    <Modal open={open} onClose={onClose} title="Төлбөр төлөх">
      <div className="space-y-4 text-sm">
        <p>
          {orderLabel}: <strong>{orderId}</strong>
        </p>
        <p className="font-serif text-3xl">{priceText}</p>
        <div className="flex aspect-square w-40 items-center justify-center border border-border bg-bg">
          <span className="p-3 text-center text-[10px] text-ink-soft break-all">
            {qr || "QR код"}
          </span>
        </div>
        <p className="text-ink-muted">
          Төлбөрийн дараа «Төлбөр шалгах» товчийг дарна уу.
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
        {isDev ? (
          <Button variant="secondary" onClick={mockPay} loading={loading} fullWidth>
            Туршилтын төлбөр амжилттай болгох
          </Button>
        ) : null}
      </div>
    </Modal>
  );
}
