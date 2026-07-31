import { SignJWT, jwtVerify } from "jose";
import { config } from "@/lib/config";
import { cookies } from "next/headers";

const encoder = new TextEncoder();

export async function signAdminToken(email: string): Promise<string> {
  return new SignJWT({ role: "admin", email })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("12h")
    .sign(encoder.encode(config.jwtSecret));
}

export async function verifyAdminToken(token: string) {
  const { payload } = await jwtVerify(token, encoder.encode(config.jwtSecret));
  if (payload.role !== "admin") throw new Error("Unauthorized");
  return payload;
}

export async function getAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  if (!token) return null;
  try {
    return await verifyAdminToken(token);
  } catch {
    return null;
  }
}
