import { connectDB } from "@/lib/database/connect";
import { NatalOrder } from "@/models/NatalOrder";
import { Payment } from "@/models/Payment";
import { config } from "@/lib/config";
import {
  generateAccessToken,
  generateNatalOrderId,
  hashToken,
  safeEqual,
} from "@/lib/security/tokens";
import { computeNatalChart } from "@/lib/astrology/natal";
import {
  buildNatalFullReport,
  buildNatalPreview,
} from "@/lib/astrology/report";
import {
  createProviderPayment,
  getPrices,
  syncPaymentWithProvider,
} from "@/services/payment.service";

function verifyNatalToken(
  order: { accessTokenHash: string },
  token: string
) {
  return safeEqual(order.accessTokenHash, hashToken(token));
}

export async function createNatalOrder(input: {
  birthDate: string;
  birthTime?: string | null;
  email?: string | null;
}) {
  await connectDB();
  const natal = computeNatalChart(input.birthDate, input.birthTime || null);
  const prices = await getPrices();
  const natalPrice =
    typeof prices.natalPrice === "number"
      ? prices.natalPrice
      : config.payment.natalPrice;

  const orderId = generateNatalOrderId();
  const token = generateAccessToken();
  const email = input.email
    ? input.email.trim().toLowerCase()
    : undefined;

  await NatalOrder.create({
    orderId,
    accessTokenHash: hashToken(token),
    birthDate: input.birthDate,
    birthTime: input.birthTime || undefined,
    email,
    paymentStatus: "unpaid",
    price: natalPrice,
    currency: prices.currency,
    emailHistory: [],
  });

  return {
    orderId,
    accessToken: token,
    price: natalPrice,
    currency: prices.currency,
    isPaid: false,
    email: email || null,
    chart: natal,
    report: buildNatalPreview(natal),
  };
}

export async function assertNatalAccess(orderId: string, token: string) {
  await connectDB();
  const order = await NatalOrder.findOne({ orderId });
  if (!order) throw new Error("Захиалга олдсонгүй");
  if (!verifyNatalToken(order, token)) throw new Error("Хандалт буруу");
  return order;
}

export async function updateNatalOrderEmail(
  orderId: string,
  token: string,
  email: string
) {
  const order = await assertNatalAccess(orderId, token);
  order.email = email.trim().toLowerCase();
  await order.save();
  return order;
}

export async function getNatalOrderPayload(orderId: string, token: string) {
  const order = await assertNatalAccess(orderId, token);

  const natal = computeNatalChart(order.birthDate, order.birthTime || null);
  const isPaid = order.paymentStatus === "paid";

  return {
    orderId: order.orderId,
    price: order.price,
    currency: order.currency,
    paymentStatus: order.paymentStatus,
    isPaid,
    email: order.email || null,
    chart: natal,
    report: isPaid ? buildNatalFullReport(natal) : buildNatalPreview(natal),
  };
}

export async function createNatalPayment(orderId: string, token: string) {
  await connectDB();
  const order = await NatalOrder.findOne({ orderId });
  if (!order) throw new Error("Захиалга олдсонгүй");
  if (!verifyNatalToken(order, token)) throw new Error("Хандалт буруу");
  if (order.paymentStatus === "paid") {
    throw new Error("Төлбөр аль хэдийн амжилттай болсон");
  }

  const payment = await createProviderPayment({
    productType: "natal",
    orderRef: orderId,
    amount: order.price,
    currency: order.currency,
    natalOrderId: orderId,
    description: `TARO · Natal тайлан · ${orderId} · ${order.price} ${order.currency}`,
  });

  if (payment.status === "paid") {
    return payment;
  }

  order.paymentStatus = "pending";
  await order.save();

  return payment;
}

export async function markNatalOrderPaid(
  orderId: string,
  providerTransactionId?: string
) {
  await connectDB();
  const order = await NatalOrder.findOne({ orderId });
  if (!order) throw new Error("Захиалга олдсонгүй");

  order.paymentStatus = "paid";
  order.paidAt = new Date();
  await order.save();

  await Payment.findOneAndUpdate(
    { natalOrderId: orderId, status: "pending" },
    {
      status: "paid",
      paidAt: new Date(),
      ...(providerTransactionId ? { providerTransactionId } : {}),
    },
    { sort: { createdAt: -1 } }
  );

  return order;
}

export async function getNatalPaymentStatus(orderId: string, token: string) {
  await connectDB();
  const order = await NatalOrder.findOne({ orderId });
  if (!order) throw new Error("Захиалга олдсонгүй");
  if (!verifyNatalToken(order, token)) throw new Error("Хандалт буруу");

  let payment = await Payment.findOne({ natalOrderId: orderId }).sort({
    createdAt: -1,
  });

  if (
    payment &&
    payment.status === "pending" &&
    (payment.provider === "byl" || payment.provider === "qpay")
  ) {
    await syncPaymentWithProvider(payment);
    payment = await Payment.findOne({ natalOrderId: orderId }).sort({
      createdAt: -1,
    });
  }

  const meta = (payment?.metadata || {}) as {
    qrImage?: string;
    bankUrls?: Array<{ name: string; link: string; logo?: string }>;
  };

  return {
    paymentStatus: order.paymentStatus,
    payment: payment
      ? {
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
        }
      : null,
  };
}
