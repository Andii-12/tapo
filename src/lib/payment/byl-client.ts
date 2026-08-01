import crypto from "crypto";
import { config } from "@/lib/config";
import { safeEqual } from "@/lib/security/tokens";

export type BylInvoice = {
  id: string;
  status: string;
  amount: number;
  description: string;
  url: string;
  number?: string;
};

function baseUrl(): string {
  return (
    config.payment.apiUrl ||
    process.env.BYL_API_URL ||
    "https://byl.mn/api/v1"
  ).replace(/\/$/, "");
}

function token(): string {
  const value =
    config.payment.token ||
    process.env.BYL_TOKEN ||
    process.env.PAYMENT_API_KEY ||
    "";
  if (!value) {
    throw new Error("Byl API token тохируулаагүй байна (BYL_TOKEN)");
  }
  return value;
}

function projectId(): string {
  const value =
    config.payment.projectId ||
    process.env.BYL_PROJECT_ID ||
    "";
  if (!value) {
    throw new Error("Byl төслийн ID тохируулаагүй байна (BYL_PROJECT_ID)");
  }
  return value;
}

export function isBylConfigured(): boolean {
  try {
    token();
    projectId();
    return true;
  } catch {
    return false;
  }
}

function pickString(obj: Record<string, unknown>, ...keys: string[]): string {
  for (const key of keys) {
    const val = obj[key];
    if (typeof val === "string" && val.trim()) return val;
    if (typeof val === "number" && Number.isFinite(val)) return String(val);
  }
  return "";
}

function pickNumber(obj: Record<string, unknown>, ...keys: string[]): number {
  for (const key of keys) {
    const val = obj[key];
    if (typeof val === "number" && Number.isFinite(val)) return val;
    if (typeof val === "string" && val.trim()) {
      const n = Number(val);
      if (Number.isFinite(n)) return n;
    }
  }
  return 0;
}

function toInvoice(raw: Record<string, unknown>): BylInvoice {
  const id = pickString(raw, "id");
  const url = pickString(raw, "url");
  if (!id || !url) {
    throw new Error("Byl invoice хариу буруу байна");
  }
  return {
    id,
    status: pickString(raw, "status") || "open",
    amount: pickNumber(raw, "amount"),
    description: pickString(raw, "description"),
    url,
    number: pickString(raw, "number") || undefined,
  };
}

async function bylFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  headers.set("Authorization", `Bearer ${token()}`);
  headers.set("Accept", "application/json");
  if (init.body) headers.set("Content-Type", "application/json");

  const res = await fetch(`${baseUrl()}${path}`, { ...init, headers });
  const text = await res.text();

  let body: Record<string, unknown> = {};
  if (text) {
    try {
      body = JSON.parse(text) as Record<string, unknown>;
    } catch {
      body = { message: text };
    }
  }

  if (!res.ok) {
    const msg =
      pickString(body, "message", "error") ||
      `Byl API алдаа (${res.status})`;
    throw new Error(msg);
  }

  return body as T;
}

export async function createBylInvoice(input: {
  amount: number;
  description: string;
}): Promise<BylInvoice> {
  const data = await bylFetch<{ data?: Record<string, unknown> }>(
    `/projects/${projectId()}/invoices`,
    {
      method: "POST",
      body: JSON.stringify({
        amount: input.amount,
        description: input.description,
      }),
    }
  );

  if (!data.data) throw new Error("Byl invoice үүсгэж чадсангүй");
  return toInvoice(data.data);
}

export async function getBylInvoice(invoiceId: string): Promise<BylInvoice> {
  const data = await bylFetch<{ data?: Record<string, unknown> }>(
    `/projects/${projectId()}/invoices/${invoiceId}`
  );
  if (!data.data) throw new Error("Byl invoice олдсонгүй");
  return toInvoice(data.data);
}

export function verifyBylSignature(
  rawBody: string,
  signature: string,
  secret: string
): boolean {
  if (!signature || !secret) return false;
  const computed = crypto
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex");
  return safeEqual(computed, signature.trim());
}

export function bylWebhookSecret(): string {
  return (
    config.payment.webhookSecret ||
    process.env.BYL_WEBHOOK_SECRET ||
    ""
  );
}
