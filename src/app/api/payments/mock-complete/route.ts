import { jsonError, jsonOk } from "@/lib/api/response";
import { config } from "@/lib/config";
import { completeMockPayment } from "@/services/payment.service";

export async function POST(request: Request) {
  if (!config.isDev && config.payment.provider !== "mock") {
    return jsonError("Зөвхөн хөгжүүлэлтийн горимд", 403);
  }
  try {
    const body = await request.json();
    const paymentRef = body.paymentRef as string;
    if (!paymentRef) return jsonError("paymentRef шаардлагатай", 400);
    const payment = await completeMockPayment(paymentRef);
    return jsonOk({
      paymentRef: payment.paymentRef,
      status: payment.status,
      readingId: payment.readingId,
      natalOrderId: payment.natalOrderId,
      productType: payment.productType,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Алдаа гарлаа";
    return jsonError(message, 400);
  }
}
