import { jsonError, jsonOk } from "@/lib/api/response";
import { getAdminSession } from "@/lib/security/admin-auth";
import { connectDB } from "@/lib/database/connect";
import { Reading } from "@/models/Reading";
import { Payment } from "@/models/Payment";
import { TarotCard } from "@/models/TarotCard";

export async function GET(request: Request) {
  const session = await getAdminSession();
  if (!session) return jsonError("Нэвтрээгүй", 401);

  await connectDB();
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim();
  const type = searchParams.get("type");
  const paymentStatus = searchParams.get("paymentStatus");
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const filter: Record<string, unknown> = {};
  if (type) filter.readingType = type;
  if (paymentStatus) filter.paymentStatus = paymentStatus;
  if (from || to) {
    filter.createdAt = {
      ...(from ? { $gte: new Date(from) } : {}),
      ...(to ? { $lte: new Date(to) } : {}),
    };
  }
  if (q) {
    filter.$or = [
      { readingId: new RegExp(q, "i") },
      { userName: new RegExp(q, "i") },
      { email: new RegExp(q, "i") },
    ];
  }

  const readings = await Reading.find(filter)
    .sort({ createdAt: -1 })
    .limit(100)
    .lean();

  const totalReadings = await Reading.countDocuments();
  const paidCount = await Reading.countDocuments({ paymentStatus: "paid" });
  const revenueAgg = await Payment.aggregate([
    { $match: { status: "paid" } },
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ]);
  const cardCount = await TarotCard.countDocuments({ isActive: true });

  return jsonOk({
    readings,
    stats: {
      totalReadings,
      paidCount,
      totalRevenue: revenueAgg[0]?.total || 0,
      activeCards: cardCount,
    },
  });
}

export async function DELETE(request: Request) {
  const session = await getAdminSession();
  if (!session) return jsonError("Нэвтрээгүй", 401);

  await connectDB();
  const body = await request.json().catch(() => ({}));
  const readingId =
    typeof body.readingId === "string" ? body.readingId.trim() : "";
  if (!readingId) return jsonError("Уншлагын дугаар шаардлагатай", 400);

  const reading = await Reading.findOneAndDelete({ readingId });
  if (!reading) return jsonError("Уншлага олдсонгүй", 404);

  await Payment.deleteMany({ readingId });

  return jsonOk({ deleted: true, readingId });
}
