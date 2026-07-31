import { jsonError, jsonOk } from "@/lib/api/response";
import { tokenQuerySchema } from "@/lib/validation/schemas";
import { clientIp, rateLimit } from "@/lib/security/rate-limit";
import { generateReadingResult } from "@/services/reading.service";

export async function POST(
  request: Request,
  context: { params: Promise<{ readingId: string }> }
) {
  const ip = clientIp(request);
  const rl = rateLimit(`generate:${ip}`, 10, 60_000);
  if (!rl.ok) return jsonError("Хэт олон хүсэлт илгээлээ.", 429);

  try {
    const { readingId } = await context.params;
    const body = await request.json();
    const parsed = tokenQuerySchema.safeParse(body);
    if (!parsed.success) return jsonError("Хандах эрх буруу байна", 401);
    const data = await generateReadingResult(readingId, parsed.data.token);
    return jsonOk(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Алдаа гарлаа";
    return jsonError(message, 400);
  }
}
