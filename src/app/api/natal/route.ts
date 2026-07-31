import { jsonError, jsonOk } from "@/lib/api/response";
import { z } from "zod";
import { createNatalOrder } from "@/services/natal.service";
import { getPrices } from "@/services/payment.service";
import { computeNatalChart } from "@/lib/astrology/natal";
import { buildNatalPreview } from "@/lib/astrology/report";
import { config } from "@/lib/config";

const schema = z.object({
  birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  birthTime: z
    .string()
    .regex(/^\d{1,2}:\d{2}$/)
    .optional()
    .or(z.literal("")),
  email: z.string().email().optional().or(z.literal("")),
  createOrder: z.boolean().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return jsonError("Төрсөн огноо/цаг буруу байна", 400);
    }

    if (parsed.data.createOrder !== false) {
      const order = await createNatalOrder({
        birthDate: parsed.data.birthDate,
        birthTime: parsed.data.birthTime || null,
        email: parsed.data.email || null,
      });
      return jsonOk(order);
    }

    const natal = computeNatalChart(
      parsed.data.birthDate,
      parsed.data.birthTime || null
    );
    const prices = await getPrices();
    return jsonOk({
      chart: natal,
      report: buildNatalPreview(natal),
      isPaid: false,
      price: prices.natalPrice ?? config.payment.natalPrice,
      currency: prices.currency,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Алдаа гарлаа";
    return jsonError(message, 400);
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const birthDate = searchParams.get("birthDate") || "";
  const birthTime = searchParams.get("birthTime") || "";
  const parsed = schema.safeParse({ birthDate, birthTime, createOrder: false });
  if (!parsed.success) {
    return jsonError("birthDate=YYYY-MM-DD шаардлагатай", 400);
  }
  try {
    const natal = computeNatalChart(
      parsed.data.birthDate,
      parsed.data.birthTime || null
    );
    const prices = await getPrices();
    return jsonOk({
      chart: natal,
      report: buildNatalPreview(natal),
      isPaid: false,
      price: prices.natalPrice ?? config.payment.natalPrice,
      currency: prices.currency,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Алдаа гарлаа";
    return jsonError(message, 400);
  }
}
