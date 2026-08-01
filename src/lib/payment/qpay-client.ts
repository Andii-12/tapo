import { config } from "@/lib/config";

export type QPayBankUrl = {
  name: string;
  description?: string;
  logo?: string;
  link: string;
};

export type QPayInvoice = {
  invoiceId: string;
  qrText: string;
  qrImage: string;
  shortUrl: string;
  bankUrls: QPayBankUrl[];
};

export type QPayPaymentCheck = {
  count: number;
  paidAmount: number;
  paymentId?: string;
};

type TokenBundle = {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
};

declare global {
  // eslint-disable-next-line no-var
  var qpayTokenCache: TokenBundle | undefined;
  // eslint-disable-next-line no-var
  var qpayAuthPromise: Promise<TokenBundle> | undefined;
}

function baseUrl(): string {
  return (
    config.payment.apiUrl ||
    process.env.QPAY_BASE_URL ||
    "https://merchant.qpay.mn"
  ).replace(/\/$/, "");
}

function credentials(): { username: string; password: string } {
  const username =
    config.payment.username || process.env.QPAY_USERNAME || "";
  const password =
    config.payment.password || process.env.QPAY_PASSWORD || "";
  if (!username || !password) {
    throw new Error("QPay нэвтрэх мэдээлэл тохируулаагүй байна");
  }
  return { username, password };
}

function invoiceCode(): string {
  const code =
    config.payment.invoiceCode ||
    process.env.QPAY_INVOICE_CODE ||
    process.env.PAYMENT_INVOICE_CODE ||
    "";
  if (!code) {
    throw new Error("QPay invoice code тохируулаагүй байна");
  }
  return code;
}

function callbackUrl(): string {
  return (
    config.payment.callbackUrl ||
    process.env.QPAY_CALLBACK_URL ||
    `${config.appUrl}/api/payments/qpay/callback`
  );
}

export function isQPayConfigured(): boolean {
  try {
    credentials();
    invoiceCode();
    return true;
  } catch {
    return false;
  }
}

function pickString(obj: Record<string, unknown>, ...keys: string[]): string {
  for (const key of keys) {
    const val = obj[key];
    if (typeof val === "string" && val.trim()) return val;
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

async function qpayFetch<T>(
  path: string,
  init: RequestInit & { auth?: boolean } = {}
): Promise<T> {
  const headers = new Headers(init.headers);
  headers.set("Content-Type", "application/json");

  if (init.auth !== false) {
    const token = await getAccessToken();
    headers.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(`${baseUrl()}${path}`, {
    ...init,
    headers,
  });

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
      pickString(body, "message", "error", "error_message") ||
      `QPay API алдаа (${res.status})`;
    throw new Error(msg);
  }

  return body as T;
}

async function authenticate(): Promise<TokenBundle> {
  const { username, password } = credentials();
  const basic = Buffer.from(`${username}:${password}`).toString("base64");

  const data = await qpayFetch<Record<string, unknown>>("/v2/auth/token", {
    method: "POST",
    auth: false,
    headers: { Authorization: `Basic ${basic}` },
  });

  const accessToken = pickString(data, "access_token", "accessToken");
  const refreshToken = pickString(data, "refresh_token", "refreshToken");
  const expiresIn = pickNumber(data, "expires_in", "expiresIn") || 600;

  if (!accessToken) {
    throw new Error("QPay access token авахад алдаа гарлаа");
  }

  return {
    accessToken,
    refreshToken,
    expiresAt: Date.now() + Math.max(expiresIn - 30, 60) * 1000,
  };
}

async function refreshTokens(refreshToken: string): Promise<TokenBundle> {
  const data = await qpayFetch<Record<string, unknown>>("/v2/auth/refresh", {
    method: "POST",
    auth: false,
    headers: { Authorization: `Bearer ${refreshToken}` },
  });

  const accessToken = pickString(data, "access_token", "accessToken");
  const nextRefresh = pickString(data, "refresh_token", "refreshToken");
  const expiresIn = pickNumber(data, "expires_in", "expiresIn") || 600;

  if (!accessToken) {
    throw new Error("QPay token шинэчлэхэд алдаа гарлаа");
  }

  return {
    accessToken,
    refreshToken: nextRefresh || refreshToken,
    expiresAt: Date.now() + Math.max(expiresIn - 30, 60) * 1000,
  };
}

async function getAccessToken(): Promise<string> {
  const cached = global.qpayTokenCache;
  if (cached && cached.expiresAt > Date.now()) {
    return cached.accessToken;
  }

  if (!global.qpayAuthPromise) {
    global.qpayAuthPromise = (async () => {
      try {
        if (cached?.refreshToken) {
          try {
            return await refreshTokens(cached.refreshToken);
          } catch {
            // fall through to full auth
          }
        }
        return await authenticate();
      } finally {
        global.qpayAuthPromise = undefined;
      }
    })();
  }

  const bundle = await global.qpayAuthPromise;
  global.qpayTokenCache = bundle;
  return bundle.accessToken;
}

export async function createQPayInvoice(input: {
  senderInvoiceNo: string;
  description: string;
  amount: number;
}): Promise<QPayInvoice> {
  const data = await qpayFetch<Record<string, unknown>>("/v2/invoice", {
    method: "POST",
    body: JSON.stringify({
      invoice_code: invoiceCode(),
      sender_invoice_no: input.senderInvoiceNo,
      invoice_receiver_code: "terminal",
      invoice_description: input.description,
      amount: input.amount,
      callback_url: callbackUrl(),
    }),
  });

  const invoiceId = pickString(data, "invoice_id", "invoiceId");
  if (!invoiceId) {
    throw new Error("QPay invoice үүсгэж чадсангүй");
  }

  const rawUrls = data.urls;
  const bankUrls: QPayBankUrl[] = Array.isArray(rawUrls)
    ? rawUrls
        .map((row) => {
          const item = row as Record<string, unknown>;
          const link = pickString(item, "link");
          const name = pickString(item, "name");
          if (!link || !name) return null;
          return {
            name,
            link,
            description: pickString(item, "description") || undefined,
            logo: pickString(item, "logo") || undefined,
          };
        })
        .filter(Boolean) as QPayBankUrl[]
    : [];

  return {
    invoiceId,
    qrText: pickString(data, "qr_text", "qrText"),
    qrImage: pickString(data, "qr_image", "qrImage"),
    shortUrl: pickString(
      data,
      "qPay_shortUrl",
      "qpay_shortUrl",
      "qPayShortUrl",
      "qpayShortUrl"
    ),
    bankUrls,
  };
}

export async function checkQPayInvoice(invoiceId: string): Promise<QPayPaymentCheck> {
  const data = await qpayFetch<Record<string, unknown>>("/v2/invoice/check", {
    method: "POST",
    body: JSON.stringify({
      object_type: "INVOICE",
      object_id: invoiceId,
      offset: { page_number: 1, page_limit: 10 },
    }),
  });

  const rows = data.rows;
  const first =
    Array.isArray(rows) && rows.length
      ? (rows[0] as Record<string, unknown>)
      : null;

  return {
    count: pickNumber(data, "count"),
    paidAmount: pickNumber(data, "paid_amount", "paidAmount"),
    paymentId: first
      ? pickString(first, "payment_id", "paymentId") || undefined
      : undefined,
  };
}
