import { jsonError, jsonOk } from "@/lib/api/response";
import { natalEmailRequestSchema } from "@/lib/validation/schemas";
import { clientIp, rateLimit } from "@/lib/security/rate-limit";
import { sendNatalEmail } from "@/services/email.service";

export async function POST(
  request: Request,
  context: { params: Promise<{ orderId: string }> }
) {
  const ip = clientIp(request);
  const rl = rateLimit(`natal-email:${ip}`, 5, 60_000);
  if (!rl.ok) return jsonError("Хэт олон и-мэйл хүсэлт.", 429);

  try {
    const { orderId } = await context.params;
    const body = await request.json();
    const parsed = natalEmailRequestSchema.safeParse(body);
    if (!parsed.success) {
      return jsonError(parsed.error.issues[0]?.message || "Буруу хүсэлт", 400);
    }
    const data = await sendNatalEmail(
      orderId,
      parsed.data.token,
      parsed.data.email
    );
    return jsonOk(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Алдаа гарлаа";
    return jsonError(message, 400);
  }
}
