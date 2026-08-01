import mongoose from "mongoose";
import { connectDB } from "@/lib/database/connect";
import { Payment, type IPayment } from "@/models/Payment";
import { Reading } from "@/models/Reading";
import { Settings } from "@/models/Settings";
import { config } from "@/lib/config";
import { generatePaymentRef } from "@/lib/security/tokens";
import {
  getMockPaymentProvider,
  getPaymentProvider,
  getProviderByName,
  type PaymentProviderName,
} from "@/lib/payment/provider";
import type { ReadingType } from "@/types";

const EXTERNAL_PROVIDERS: PaymentProviderName[] = ["byl", "qpay"];

function paymentPayload(payment: IPayment) {
  const meta = (payment.metadata || {}) as {
    qrImage?: string;
    bankUrls?: Array<{ name: string; link: string; logo?: string }>;
  };

  return {
    paymentRef: payment.paymentRef,
    amount: payment.amount,
    currency: payment.currency,
    status: payment.status,
    provider: payment.provider,
    qrPayload: payment.qrPayload,
    qrImage: meta.qrImage,
    checkoutUrl: payment.checkoutUrl,
    bankUrls: meta.bankUrls,
    paidAt: payment.paidAt,
  };
}

function paymentDescription(
  product: "reading" | "natal",
  ref: string,
  amount: number,
  currency: string,
  readingType?: ReadingType
) {
  if (product === "natal") {
    return `ТАРО · Natal тайлан · ${ref} · ${amount} ${currency}`;
  }
  const label =
    readingType === "five-card"
      ? "5 хөзрийн уншлага"
      : readingType === "three-card"
        ? "3 хөзрийн уншлага"
        : "Таро уншлага";
  return `ТАРО · ${label} · ${ref} · ${amount} ${currency}`;
}

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

type PaymentDoc = mongoose.HydratedDocument<IPayment>;

export async function syncPaymentWithProvider(
  payment: PaymentDoc
): Promise<PaymentDoc> {
  if (
    payment.status === "paid" ||
    !EXTERNAL_PROVIDERS.includes(payment.provider as PaymentProviderName)
  ) {
    return payment;
  }
  if (!payment.providerTransactionId) {
    return payment;
  }

  const provider = getProviderByName(payment.provider as PaymentProviderName);
  const status = await provider.checkPayment(payment.providerTransactionId);
  if (status !== "paid") {
    return payment;
  }

  payment.status = "paid";
  payment.paidAt = new Date();
  await payment.save();
  await fulfillPaidPayment(payment);
  return payment;
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

  const existing = await Payment.findOne({
    readingId,
    status: "pending",
    provider: config.payment.provider,
  }).sort({ createdAt: -1 });

  if (existing?.providerTransactionId) {
    reading.paymentStatus = "pending";
    await reading.save();
    return existing;
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
    description: paymentDescription(
      "reading",
      paymentRef,
      amount,
      prices.currency,
      reading.readingType
    ),
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
    metadata: {
      qrImage: created.qrImage,
      bankUrls: created.bankUrls,
    },
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
  if (!config.isDev && config.payment.provider !== "mock") {
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
  let payment = await Payment.findOne({ readingId }).sort({ createdAt: -1 });

  if (
    payment &&
    payment.status === "pending" &&
    EXTERNAL_PROVIDERS.includes(payment.provider as PaymentProviderName)
  ) {
    await syncPaymentWithProvider(payment);
    payment = await Payment.findOne({ readingId }).sort({ createdAt: -1 });
  }

  return {
    paymentStatus: reading.paymentStatus,
    payment: payment ? paymentPayload(payment) : null,
  };
}

export async function handleProviderInvoicePaid(
  provider: PaymentProviderName,
  invoiceId: string
) {
  await connectDB();
  const payment = await Payment.findOne({
    providerTransactionId: invoiceId,
    provider,
  }).sort({ createdAt: -1 });

  if (!payment) {
    return { found: false, paid: false };
  }

  if (payment.status === "paid") {
    return { found: true, paid: true };
  }

  await syncPaymentWithProvider(payment);
  const refreshed = await Payment.findById(payment._id);
  return { found: true, paid: refreshed?.status === "paid" };
}

/** @deprecated Use handleProviderInvoicePaid("qpay", id) */
export async function handleQPayCallback(invoiceId: string) {
  return handleProviderInvoicePaid("qpay", invoiceId);
}

export async function handleBylWebhook(raw: string) {
  const body = JSON.parse(raw) as {
    type?: string;
    data?: { object?: { id?: number | string; status?: string } };
  };

  if (body.type !== "invoice.paid") {
    return { ignored: true, paid: false };
  }

  const invoiceId = body.data?.object?.id;
  if (invoiceId == null) {
    return { ignored: true, paid: false };
  }

  return handleProviderInvoicePaid("byl", String(invoiceId));
}

/** Used by natal service when creating payments. */
export async function createProviderPayment(input: {
  productType: "reading" | "natal";
  orderRef: string;
  amount: number;
  currency: string;
  description: string;
  readingId?: string;
  natalOrderId?: string;
}) {
  const existingFilter =
    input.productType === "natal"
      ? { natalOrderId: input.natalOrderId, status: "pending", provider: config.payment.provider }
      : { readingId: input.readingId, status: "pending", provider: config.payment.provider };

  const existing = await Payment.findOne(existingFilter).sort({ createdAt: -1 });
  if (existing?.providerTransactionId) return existing;

  const paymentRef = generatePaymentRef();
  const provider = getPaymentProvider();
  const created = await provider.createPayment({
    readingId: input.orderRef,
    amount: input.amount,
    currency: input.currency,
    paymentRef,
    description: input.description,
  });

  return Payment.create({
    paymentRef,
    productType: input.productType,
    readingId: input.readingId,
    natalOrderId: input.natalOrderId,
    amount: input.amount,
    currency: input.currency,
    provider: created.provider,
    status: "pending",
    providerTransactionId: created.providerTransactionId,
    qrPayload: created.qrPayload,
    checkoutUrl: created.checkoutUrl,
    metadata: {
      qrImage: created.qrImage,
      bankUrls: created.bankUrls,
    },
  });
}
