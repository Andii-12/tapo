import { jsonError, jsonOk } from "@/lib/api/response";
import { tokenQuerySchema } from "@/lib/validation/schemas";
import { getReading } from "@/services/reading.service";

export async function GET(
  request: Request,
  context: { params: Promise<{ readingId: string }> }
) {
  try {
    const { readingId } = await context.params;
    const { searchParams } = new URL(request.url);
    const parsed = tokenQuerySchema.safeParse({
      token: searchParams.get("token"),
    });
    if (!parsed.success) {
      return jsonError("Хандах эрх буруу байна", 401);
    }
    const data = await getReading(readingId, parsed.data.token);
    return jsonOk(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Алдаа гарлаа";
    const status = message.includes("олдсонгүй") ? 404 : 401;
    return jsonError(message, status);
  }
}
