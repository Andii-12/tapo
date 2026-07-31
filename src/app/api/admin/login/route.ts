import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { jsonError, jsonOk } from "@/lib/api/response";
import { adminLoginSchema } from "@/lib/validation/schemas";
import { config } from "@/lib/config";
import { signAdminToken } from "@/lib/security/admin-auth";

async function passwordMatches(password: string): Promise<boolean> {
  if (config.adminPassword && password === config.adminPassword) {
    return true;
  }
  if (config.adminPasswordHash) {
    try {
      return await bcrypt.compare(password, config.adminPasswordHash);
    } catch {
      return false;
    }
  }
  return false;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = adminLoginSchema.safeParse(body);
    if (!parsed.success) return jsonError("Нэвтрэх нэр эсвэл нууц үг буруу", 400);

    const email = parsed.data.email.trim().toLowerCase();
    if (email !== config.adminEmail.trim().toLowerCase()) {
      return jsonError("Нэвтрэх эрхгүй", 401);
    }

    if (!config.adminPassword && !config.adminPasswordHash) {
      return jsonError("Админ тохиргоо дутуу. npm run seed:admin ажиллуулна уу.", 500);
    }

    const ok = await passwordMatches(parsed.data.password);
    if (!ok) return jsonError("Нэвтрэх эрхгүй", 401);

    const token = await signAdminToken(email);
    const cookieStore = await cookies();
    cookieStore.set("admin_token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 12,
    });

    return jsonOk({ email });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Алдаа гарлаа";
    return jsonError(message, 500);
  }
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_token");
  return jsonOk({ loggedOut: true });
}
