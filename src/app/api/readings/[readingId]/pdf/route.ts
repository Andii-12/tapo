import { tokenQuerySchema } from "@/lib/validation/schemas";
import { generateReadingPdf } from "@/services/pdf.service";
import { jsonError } from "@/lib/api/response";

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
    if (!parsed.success) return jsonError("Хандах эрх буруу байна", 401);

    const pdf = await generateReadingPdf(readingId, parsed.data.token);
    return new Response(new Uint8Array(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="tarot-${readingId}.pdf"`,
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "PDF үүсгэж чадсангүй";
    return jsonError(message, 400);
  }
}
