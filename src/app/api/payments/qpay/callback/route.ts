import { jsonError, jsonOk } from "@/lib/api/response";
import { handleQPayCallback } from "@/services/payment.service";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      invoice_id?: string;
      payment_id?: string;
    };

    const invoiceId = body.invoice_id || body.payment_id;
    if (!invoiceId) {
      return jsonOk({ received: true, ignored: true });
    }

    const result = await handleQPayCallback(invoiceId);
    return jsonOk({ received: true, ...result });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Алдаа гарлаа";
    return jsonError(message, 500);
  }
}
