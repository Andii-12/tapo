import { jsonError, jsonOk } from "@/lib/api/response";
import { createNatalPayment } from "@/services/natal.service";

export async function POST(
  request: Request,
  context: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await context.params;
    const body = await request.json();
    const token = (body.token as string) || "";
    if (!token) return jsonError("token шаардлагатай", 400);
    const payment = await createNatalPayment(orderId, token);
    return jsonOk({
      paymentRef: payment.paymentRef,
      amount: payment.amount,
      currency: payment.currency,
      status: payment.status,
      qrPayload: payment.qrPayload,
      qrImage: (payment.metadata as { qrImage?: string } | undefined)?.qrImage,
      checkoutUrl: payment.checkoutUrl,
      bankUrls: (payment.metadata as { bankUrls?: unknown } | undefined)?.bankUrls,
      provider: payment.provider,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Алдаа гарлаа";
    return jsonError(message, 400);
  }
}
