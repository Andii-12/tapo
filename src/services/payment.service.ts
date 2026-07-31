import { connectDB } from "@/lib/database/connect";
import { Payment } from "@/models/Payment";
import { Reading } from "@/models/Reading";
import { Settings } from "@/models/Settings";
import { config } from "@/lib/config";
import { generatePaymentRef } from "@/lib/security/tokens";
import { getMockPaymentProvider, getPaymentProvider } from "@/lib/payment/provider";
import type { ReadingType } from "@/types";

export async function getPrices() {
  await connectDB();
  let settings = await Settings.findOne({ key: "global" });
  if (!settings) {
    settings = await Settings.create({
      key: "global",
      threeCardPrice: config.payment.threeCardPrice,
      fiveCardPrice: config.payment.fiveCardPrice,
      natalPrice: config.payment.natalPrice,
      currency: config.payment.currency,
    });
  } else if (settings.natalPrice == null) {
    settings.natalPrice = config.payment.natalPrice;
    await settings.save();
  }
  return settings;
}

export function priceForType(
  type: ReadingType,
  prices: { threeCardPrice: number; fiveCardPrice: number }
) {
  if (type === "three-card") return prices.threeCardPrice;
  if (type === "five-card") return prices.fiveCardPrice;
  return 0;
}

export async function createPaymentOrder(readingId: string) {
  await connectDB();
  const reading = await Reading.findOne({ readingId });
  if (!reading) throw new Error("Уншлага олдсонгүй");
  if (reading.readingType === "yes-no") {
    throw new Error("Энэ уншлага үнэгүй тул төлбөр шаардлагагүй");
  }
  if (reading.paymentStatus === "paid") {
    throw new Error("Төлбөр аль хэдийн амжилттай болсон");
  }

  const prices = await getPrices();
  const amount = priceForType(reading.readingType, prices);
  const paymentRef = generatePaymentRef();
  const provider = getPaymentProvider();

  const created = await provider.createPayment({
    readingId,
    amount,
    currency: prices.currency,
    paymentRef,
  });

  const payment = await Payment.create({
    paymentRef,
    productType: "reading",
    readingId,
    amount,
    currency: prices.currency,
    provider: created.provider,
    status: "pending",
    providerTransactionId: created.providerTransactionId,
    qrPayload: created.qrPayload,
    checkoutUrl: created.checkoutUrl,
  });

  reading.paymentStatus = "pending";
  reading.price = amount;
  reading.currency = prices.currency;
  await reading.save();

  return payment;
}

export async function markReadingPaid(
  readingId: string,
  providerTransactionId?: string
) {
  await connectDB();
  const reading = await Reading.findOne({ readingId });
  if (!reading) throw new Error("Уншлага олдсонгүй");

  reading.paymentStatus = "paid";
  await reading.save();

  await Payment.findOneAndUpdate(
    { readingId, status: "pending" },
    {
      status: "paid",
      paidAt: new Date(),
      ...(providerTransactionId ? { providerTransactionId } : {}),
    },
    { sort: { createdAt: -1 } }
  );

  return reading;
}

export async function completeMockPayment(paymentRef: string) {
  if (!config.isDev && process.env.PAYMENT_PROVIDER !== "mock") {
    throw new Error("Mock төлбөр зөвхөн хөгжүүлэлтийн горимд боломжтой");
  }
  await connectDB();
  const payment = await Payment.findOne({ paymentRef });
  if (!payment) throw new Error("Төлбөр олдсонгүй");

  const mock = getMockPaymentProvider();
  if (payment.providerTransactionId) {
    mock.markPaid(payment.providerTransactionId);
  }

  payment.status = "paid";
  payment.paidAt = new Date();
  await payment.save();

  await fulfillPaidPayment(payment);
  return payment;
}

export async function fulfillPaidPayment(payment: {
  productType?: string;
  readingId?: string;
  natalOrderId?: string;
  providerTransactionId?: string;
}) {
  if (payment.productType === "natal" || payment.natalOrderId) {
    if (!payment.natalOrderId) throw new Error("natalOrderId байхгүй");
    const { markNatalOrderPaid } = await import("@/services/natal.service");
    return markNatalOrderPaid(
      payment.natalOrderId,
      payment.providerTransactionId
    );
  }
  if (!payment.readingId) throw new Error("readingId байхгүй");
  return markReadingPaid(payment.readingId, payment.providerTransactionId);
}

export async function getPaymentStatus(readingId: string) {
  await connectDB();
  const reading = await Reading.findOne({ readingId });
  if (!reading) throw new Error("Уншлага олдсонгүй");
  const payment = await Payment.findOne({ readingId }).sort({ createdAt: -1 });
  return {
    paymentStatus: reading.paymentStatus,
    payment: payment
      ? {
          paymentRef: payment.paymentRef,
          amount: payment.amount,
          currency: payment.currency,
          status: payment.status,
          qrPayload: payment.qrPayload,
          checkoutUrl: payment.checkoutUrl,
          paidAt: payment.paidAt,
        }
      : null,
  };
}
