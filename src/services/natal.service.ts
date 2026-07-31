import { connectDB } from "@/lib/database/connect";
import { NatalOrder } from "@/models/NatalOrder";
import { Payment } from "@/models/Payment";
import { config } from "@/lib/config";
import {
  generateAccessToken,
  generateNatalOrderId,
  generatePaymentRef,
  hashToken,
  safeEqual,
} from "@/lib/security/tokens";
import { computeNatalChart } from "@/lib/astrology/natal";
import {
  buildNatalFullReport,
  buildNatalPreview,
} from "@/lib/astrology/report";
import { getMockPaymentProvider, getPaymentProvider } from "@/lib/payment/provider";
import { getPrices } from "@/services/payment.service";

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

  const paymentRef = generatePaymentRef();
  const provider = getPaymentProvider();
  const created = await provider.createPayment({
    readingId: orderId,
    amount: order.price,
    currency: order.currency,
    paymentRef,
  });

  const payment = await Payment.create({
    paymentRef,
    productType: "natal",
    natalOrderId: orderId,
    amount: order.price,
    currency: order.currency,
    provider: created.provider,
    status: "pending",
    providerTransactionId: created.providerTransactionId,
    qrPayload: created.qrPayload,
    checkoutUrl: created.checkoutUrl,
  });

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

  const payment = await Payment.findOne({ natalOrderId: orderId }).sort({
    createdAt: -1,
  });

  return {
    paymentStatus: order.paymentStatus,
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
