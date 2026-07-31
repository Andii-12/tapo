import { jsonError, jsonOk } from "@/lib/api/response";
import { tokenQuerySchema } from "@/lib/validation/schemas";
import { assertReadingAccess } from "@/services/reading.service";
import { getPaymentStatus } from "@/services/payment.service";
import { clientIp, rateLimit } from "@/lib/security/rate-limit";

export async function GET(
  request: Request,
  context: { params: Promise<{ readingId: string }> }
) {
  const ip = clientIp(request);
  const rl = rateLimit(`payment-status:${ip}`, 30, 60_000);
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
