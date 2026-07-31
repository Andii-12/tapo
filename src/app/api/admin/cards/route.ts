import { jsonError, jsonOk } from "@/lib/api/response";
import { getAdminSession } from "@/lib/security/admin-auth";
import { connectDB } from "@/lib/database/connect";
import { TarotCard } from "@/models/TarotCard";
import { cardUpdateSchema } from "@/lib/validation/schemas";

export async function GET() {
  const session = await getAdminSession();
  if (!session) return jsonError("Нэвтрээгүй", 401);
  await connectDB();
  const cards = await TarotCard.find().sort({ number: 1 }).lean();
  return jsonOk(cards);
}

export async function PATCH(request: Request) {
  const session = await getAdminSession();
  if (!session) return jsonError("Нэвтрээгүй", 401);
  await connectDB();
  const body = await request.json();
  const cardId = body.cardId as string;
  if (!cardId) return jsonError("cardId шаардлагатай", 400);
  const parsed = cardUpdateSchema.safeParse(body);
  if (!parsed.success) return jsonError("Буруу өгөгдөл", 400);

  const card = await TarotCard.findOneAndUpdate(
    { cardId },
    { $set: parsed.data },
    { new: true }
  );
  if (!card) return jsonError("Хөзөр олдсонгүй", 404);
  return jsonOk(card);
}
