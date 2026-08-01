import { jsonError, jsonOk } from "@/lib/api/response";
import { bylWebhookSecret, verifyBylSignature } from "@/lib/payment/byl-client";
import { handleBylWebhook } from "@/services/payment.service";

export async function POST(request: Request) {
  try {
    const raw = await request.text();
    const signature = request.headers.get("Byl-Signature") || "";
    const secret = bylWebhookSecret();

    if (!secret) {
      return jsonError("BYL_WEBHOOK_SECRET тохируулаагүй байна", 500);
    }

    if (!verifyBylSignature(raw, signature, secret)) {
      return jsonError("Webhook гарын үсэг буруу", 401);
    }

    const result = await handleBylWebhook(raw);
    return jsonOk({ received: true, ...result });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Алдаа гарлаа";
    return jsonError(message, 500);
  }
}
