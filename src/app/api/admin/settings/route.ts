import { jsonError, jsonOk } from "@/lib/api/response";
import { getAdminSession } from "@/lib/security/admin-auth";
import { connectDB } from "@/lib/database/connect";
import { Settings } from "@/models/Settings";
import { pricesUpdateSchema } from "@/lib/validation/schemas";

export async function GET() {
  const session = await getAdminSession();
  if (!session) return jsonError("Нэвтрээгүй", 401);
  await connectDB();
  const settings = await Settings.findOne({ key: "global" });
  return jsonOk(settings);
}

export async function PUT(request: Request) {
  const session = await getAdminSession();
  if (!session) return jsonError("Нэвтрээгүй", 401);
  const body = await request.json();
  const parsed = pricesUpdateSchema.safeParse(body);
  if (!parsed.success) return jsonError("Буруу үнэ", 400);
  await connectDB();
  const settings = await Settings.findOneAndUpdate(
    { key: "global" },
    { $set: parsed.data },
    { upsert: true, new: true }
  );
  return jsonOk(settings);
}
