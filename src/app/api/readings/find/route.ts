import { jsonError, jsonOk } from "@/lib/api/response";
import { findReadingSchema } from "@/lib/validation/schemas";
import {
  findReadingByRef,
  serializeReading,
} from "@/services/reading.service";
import {
  generateAccessToken,
  hashToken,
} from "@/lib/security/tokens";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = findReadingSchema.safeParse(body);
    if (!parsed.success) {
      return jsonError(parsed.error.issues[0]?.message || "Буруу мэдээлэл", 400);
    }

    const reading = await findReadingByRef(
      parsed.data.readingId,
      parsed.data.email
    );

    const accessToken = generateAccessToken();
    reading.accessTokenHash = hashToken(accessToken);
    await reading.save();

    const data = await serializeReading(reading, accessToken, true);
    return jsonOk(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Алдаа гарлаа";
    return jsonError(message, 404);
  }
}
