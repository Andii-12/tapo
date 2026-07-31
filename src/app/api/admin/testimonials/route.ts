import { z } from "zod";
import { jsonError, jsonOk } from "@/lib/api/response";
import { getAdminSession } from "@/lib/security/admin-auth";
import {
  deleteTestimonial,
  listAdminTestimonials,
  updateTestimonialStatus,
} from "@/services/testimonial.service";

export async function GET() {
  const session = await getAdminSession();
  if (!session) return jsonError("Нэвтрээгүй", 401);
  try {
    const data = await listAdminTestimonials();
    return jsonOk(data);
  } catch (e) {
    return jsonError(e instanceof Error ? e.message : "Алдаа", 500);
  }
}

const patchSchema = z.object({
  id: z.string().min(1),
  status: z.enum(["approved", "pending", "hidden"]),
});

export async function PATCH(request: Request) {
  const session = await getAdminSession();
  if (!session) return jsonError("Нэвтрээгүй", 401);
  try {
    const body = await request.json();
    const parsed = patchSchema.safeParse(body);
    if (!parsed.success) return jsonError("Буруу өгөгдөл", 400);
    const data = await updateTestimonialStatus(
      parsed.data.id,
      parsed.data.status
    );
    return jsonOk(data);
  } catch (e) {
    return jsonError(e instanceof Error ? e.message : "Алдаа", 400);
  }
}

const deleteSchema = z.object({
  id: z.string().min(1),
});

export async function DELETE(request: Request) {
  const session = await getAdminSession();
  if (!session) return jsonError("Нэвтрээгүй", 401);
  try {
    const body = await request.json();
    const parsed = deleteSchema.safeParse(body);
    if (!parsed.success) return jsonError("Буруу өгөгдөл", 400);
    await deleteTestimonial(parsed.data.id);
    return jsonOk({ deleted: true });
  } catch (e) {
    return jsonError(e instanceof Error ? e.message : "Алдаа", 400);
  }
}
