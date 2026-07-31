import { jsonError, jsonOk } from "@/lib/api/response";
import { getNatalPaymentStatus } from "@/services/natal.service";

export async function GET(
  request: Request,
  context: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await context.params;
    const token = new URL(request.url).searchParams.get("token") || "";
    if (!token) return jsonError("token шаардлагатай", 400);
    const data = await getNatalPaymentStatus(orderId, token);
    return jsonOk(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Алдаа гарлаа";
    const status = message.includes("буруу") ? 403 : 400;
    return jsonError(message, status);
  }
}
