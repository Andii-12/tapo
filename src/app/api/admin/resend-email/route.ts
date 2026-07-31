import { jsonError, jsonOk } from "@/lib/api/response";
import { getAdminSession } from "@/lib/security/admin-auth";
import { resendEmailByAdmin } from "@/services/email.service";

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) return jsonError("Нэвтрээгүй", 401);
  const body = await request.json();
  if (!body.readingId) return jsonError("readingId шаардлагатай", 400);
  try {
    const data = await resendEmailByAdmin(body.readingId);
    return jsonOk(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Алдаа гарлаа";
    return jsonError(message, 400);
  }
}
