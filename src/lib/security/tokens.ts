import { customAlphabet } from "nanoid";
import { randomBytes, createHmac, timingSafeEqual } from "crypto";

const readingIdAlphabet = customAlphabet("ABCDEFGHJKLMNPQRSTUVWXYZ23456789", 10);
const tokenAlphabet = customAlphabet(
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
  48
);

export function generateReadingId(): string {
  return `TR-${readingIdAlphabet()}`;
}

export function generateNatalOrderId(): string {
  return `NAT-${readingIdAlphabet()}`;
}

export function generateAccessToken(): string {
  return tokenAlphabet();
}

export function generatePaymentRef(): string {
  return `PAY-${readingIdAlphabet()}`;
}

export function hashToken(token: string): string {
  return createHmac("sha256", process.env.JWT_SECRET || "dev").update(token).digest("hex");
}

export function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

export function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const expected = createHmac("sha256", secret).update(payload).digest("hex");
  return safeEqual(expected, signature);
}

export function sanitizeText(input: string, max = 2000): string {
  return input.replace(/[<>]/g, "").trim().slice(0, max);
}

export function randomSecureString(bytes = 32): string {
  return randomBytes(bytes).toString("hex");
}
