import { connectDB } from "@/lib/database/connect";
import { Testimonial } from "@/models/Testimonial";
import {
  STATIC_TESTIMONIALS,
  type TestimonialSentiment,
  type TestimonialView,
} from "@/lib/content/testimonials";
import { sanitizeText } from "@/lib/security/tokens";

type TestimonialStatus = "approved" | "pending" | "hidden";

function toView(doc: {
  _id: { toString(): string };
  slug: string;
  name: string;
  quote: string;
  meta: string;
  tag: string;
  sentiment?: TestimonialSentiment;
  status?: TestimonialStatus;
  isStatic: boolean;
  createdAt?: Date;
}): TestimonialView {
  return {
    id: doc._id.toString(),
    slug: doc.slug,
    name: doc.name,
    quote: doc.quote,
    meta: doc.meta,
    tag: doc.tag,
    sentiment: doc.sentiment === "bad" ? "bad" : "good",
    status: doc.status || "approved",
    isStatic: Boolean(doc.isStatic),
    createdAt: doc.createdAt?.toISOString(),
  };
}

export async function ensureStaticTestimonials() {
  await connectDB();
  for (const item of STATIC_TESTIMONIALS) {
    await Testimonial.updateOne(
      { slug: item.slug },
      {
        $setOnInsert: {
          slug: item.slug,
          name: item.name,
          quote: item.quote,
          meta: item.meta,
          tag: item.tag,
          sentiment: item.sentiment,
          status: "approved",
          isStatic: true,
        },
        $set: { sentiment: item.sentiment },
      },
      { upsert: true }
    );
  }
}

export async function listApprovedTestimonials(
  limit = 50
): Promise<TestimonialView[]> {
  await ensureStaticTestimonials();
  const docs = await Testimonial.find({ status: "approved" })
    .sort({ isStatic: -1, createdAt: -1 })
    .limit(limit)
    .lean();
  return docs.map((d) => toView(d as never));
}

export async function createTestimonial(input: {
  name: string;
  quote: string;
  meta?: string;
  tag?: string;
  sentiment: TestimonialSentiment;
}): Promise<TestimonialView> {
  await connectDB();
  const name = sanitizeText(input.name, 80);
  const quote = sanitizeText(input.quote, 800);
  const meta = sanitizeText(input.meta || "Хэрэглэгчийн сэтгэгдэл", 120);
  const tag = sanitizeText(input.tag || "СЭТГЭГДЭЛ", 40) || "СЭТГЭГДЭЛ";
  const sentiment = input.sentiment === "bad" ? "bad" : "good";

  if (name.length < 2) throw new Error("Нэрээ оруулна уу");
  if (quote.length < 20) throw new Error("Сэтгэгдэл хэт богино байна");

  const slug = `user-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  const doc = await Testimonial.create({
    slug,
    name,
    quote,
    meta,
    tag,
    sentiment,
    status: "pending",
    isStatic: false,
  });

  return toView(doc);
}

export async function listAdminTestimonials(): Promise<TestimonialView[]> {
  await ensureStaticTestimonials();
  const docs = await Testimonial.find()
    .sort({ createdAt: -1 })
    .limit(200)
    .lean();
  return docs.map((d) => toView(d as never));
}

export async function updateTestimonialStatus(
  id: string,
  status: TestimonialStatus
): Promise<TestimonialView> {
  await connectDB();
  if (!["approved", "pending", "hidden"].includes(status)) {
    throw new Error("Буруу төлөв");
  }
  const doc = await Testimonial.findByIdAndUpdate(
    id,
    { $set: { status } },
    { new: true }
  );
  if (!doc) throw new Error("Сэтгэгдэл олдсонгүй");
  return toView(doc);
}

export async function deleteTestimonial(id: string): Promise<void> {
  await connectDB();
  const doc = await Testimonial.findById(id);
  if (!doc) throw new Error("Сэтгэгдэл олдсонгүй");
  if (doc.isStatic) throw new Error("Суурь сэтгэгдлийг устгах боломжгүй");
  await Testimonial.deleteOne({ _id: id });
}
