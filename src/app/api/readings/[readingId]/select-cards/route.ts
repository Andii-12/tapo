import { jsonError, jsonOk } from "@/lib/api/response";
import { selectCardsSchema } from "@/lib/validation/schemas";
import { selectCards } from "@/services/reading.service";

export async function POST(
  request: Request,
  context: { params: Promise<{ readingId: string }> }
) {
  try {
    const { readingId } = await context.params;
    const body = await request.json();
    const parsed = selectCardsSchema.safeParse(body);
    if (!parsed.success) {
      return jsonError(parsed.error.issues[0]?.message || "Буруу хүсэлт", 400);
    }
    const data = await selectCards(
      readingId,
      parsed.data.token,
      parsed.data.cardIds
    );
    return jsonOk(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Алдаа гарлаа";
    return jsonError(message, 400);
  }
}
