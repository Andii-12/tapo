import { createReadingSchema } from "@/lib/validation/schemas";
import { jsonError, jsonOk } from "@/lib/api/response";
import { clientIp, rateLimit } from "@/lib/security/rate-limit";
import { createReading } from "@/services/reading.service";

export async function POST(request: Request) {
  const ip = clientIp(request);
  const rl = rateLimit(`create-reading:${ip}`, 10, 60_000);
  if (!rl.ok) {
    return jsonError("Хэт олон хүсэлт илгээлээ. Түр хүлээнэ үү.", 429);
  }

  try {
    const body = await request.json();
    const parsed = createReadingSchema.safeParse(body);
    if (!parsed.success) {
      return jsonError(
        parsed.error.issues[0]?.message || "Мэдээлэл буруу байна",
        400,
        { issues: parsed.error.issues }
      );
    }

    const data = await createReading(parsed.data);
    return jsonOk(data, 201);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Алдаа гарлаа";
    const status = message.includes("хариулж чадахгүй") ? 400 : 500;
    return jsonError(message, status);
  }
}
