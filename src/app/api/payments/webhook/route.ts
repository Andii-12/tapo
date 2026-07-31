import { jsonError, jsonOk } from "@/lib/api/response";
import { config } from "@/lib/config";
import { verifyWebhookSignature } from "@/lib/security/tokens";
import { fulfillPaidPayment } from "@/services/payment.service";
import { connectDB } from "@/lib/database/connect";
import { Payment } from "@/models/Payment";

export async function POST(request: Request) {
  try {
    const raw = await request.text();
    const signature =
      request.headers.get("x-payment-signature") ||
      request.headers.get("x-webhook-signature") ||
      "";

    if (config.payment.provider !== "mock") {
      const ok = verifyWebhookSignature(
        raw,
        signature,
        config.payment.webhookSecret
      );
      if (!ok) return jsonError("Webhook гарын үсэг буруу", 401);
    }

    const body = JSON.parse(raw) as {
      paymentRef?: string;
      readingId?: string;
      natalOrderId?: string;
      status?: string;
      providerTransactionId?: string;
    };

    if (body.status !== "paid") {
      return jsonOk({ received: true, ignored: true });
    }

    await connectDB();
    const payment = await Payment.findOne({
      ...(body.paymentRef ? { paymentRef: body.paymentRef } : {}),
      ...(body.readingId ? { readingId: body.readingId } : {}),
      ...(body.natalOrderId ? { natalOrderId: body.natalOrderId } : {}),
    }).sort({ createdAt: -1 });

    if (!payment) return jsonError("Төлбөр олдсонгүй", 404);

    payment.status = "paid";
    payment.paidAt = new Date();
    if (body.providerTransactionId) {
      payment.providerTransactionId = body.providerTransactionId;
    }
    await payment.save();
    await fulfillPaidPayment(payment);

    return jsonOk({ received: true, paid: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Алдаа гарлаа";
    return jsonError(message, 400);
  }
}
