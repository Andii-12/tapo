import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { clientIp, rateLimit } from "@/lib/security/rate-limit";
import {
  createTestimonial,
  listApprovedTestimonials,
} from "@/services/testimonial.service";

export async function GET(req: NextRequest) {
  try {
    const limit = Number(req.nextUrl.searchParams.get("limit") || 50);
    const data = await listApprovedTestimonials(
      Number.isFinite(limit) ? Math.min(Math.max(limit, 1), 100) : 50
    );
    return NextResponse.json({ data });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Алдаа" },
      { status: 500 }
    );
  }
}

const createSchema = z.object({
  name: z.string().min(2).max(80),
  quote: z.string().min(20).max(800),
  meta: z.string().max(120).optional(),
  tag: z.string().max(40).optional(),
  sentiment: z.enum(["good", "bad"]).default("good"),
});

export async function POST(req: NextRequest) {
  const ip = clientIp(req);
  const rl = rateLimit(`testimonial-create:${ip}`, 5, 60_000);
  if (!rl.ok) {
    return NextResponse.json(
      { error: "Хэт олон хүсэлт. Түр хүлээнэ үү." },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();
    const parsed = createSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Мэдээлэл буруу байна" },
        { status: 400 }
      );
    }
    const data = await createTestimonial(parsed.data);
    return NextResponse.json({ data }, { status: 201 });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Алдаа" },
      { status: 400 }
    );
  }
}
