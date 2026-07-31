import { jsonError, jsonOk } from "@/lib/api/response";
import { paymentCreateSchema, tokenQuerySchema } from "@/lib/validation/schemas";
import { assertReadingAccess } from "@/services/reading.service";
import {
  createPaymentOrder,
  getPaymentStatus,
} from "@/services/payment.service";
import { clientIp, rateLimit } from "@/lib/security/rate-limit";

export async function POST(
  request: Request,
  context: { params: Promise<{ readingId: string }> }
) {
  try {
    const { readingId } = await context.params;
    const body = await request.json();
    const parsed = paymentCreateSchema.safeParse(body);
    if (!parsed.success) return jsonError("Хандах эрх буруу байна", 401);
    await assertReadingAccess(readingId, parsed.data.token);
    const payment = await createPaymentOrder(readingId);
    return jsonOk({
      paymentRef: payment.paymentRef,
      amount: payment.amount,
      currency: payment.currency,
      status: payment.status,
      qrPayload: payment.qrPayload,
      checkoutUrl: payment.checkoutUrl,
      provider: payment.provider,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Алдаа гарлаа";
    return jsonError(message, 400);
  }
}

export async function GET(
  request: Request,
  context: { params: Promise<{ readingId: string }> }
) {
  const ip = clientIp(request);
  const rl = rateLimit(`pay-status:${ip}`, 30, 60_000);
  if (!rl.ok) return jsonError("Хэт олон хүсэлт.", 429);

  try {
    const { readingId } = await context.params;
    const { searchParams } = new URL(request.url);
    const parsed = tokenQuerySchema.safeParse({
      token: searchParams.get("token"),
    });
    if (!parsed.success) return jsonError("Хандах эрх буруу байна", 401);
    await assertReadingAccess(readingId, parsed.data.token);
    const data = await getPaymentStatus(readingId);
    return jsonOk(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Алдаа гарлаа";
    return jsonError(message, 400);
  }
}
