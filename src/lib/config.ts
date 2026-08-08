export const config = {
  appUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  mongodbUri: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/tarot",
  jwtSecret: process.env.JWT_SECRET || "dev-jwt-secret-change-me",
  adminEmail: process.env.ADMIN_EMAIL || "admin",
  adminPasswordHash: process.env.ADMIN_PASSWORD_HASH || "",
  /** Local/dev fallback — avoid relying only on bcrypt hashes in .env ($ expansion). */
  adminPassword: process.env.ADMIN_PASSWORD || "",
  ai: {
    apiKey: process.env.AI_API_KEY || "",
    model: process.env.AI_MODEL || "gpt-4.1",
    apiUrl:
      process.env.AI_API_URL ||
      "https://api.openai.com/v1/chat/completions",
  },
  payment: {
    provider: (process.env.PAYMENT_PROVIDER || "mock") as
      | "mock"
      | "byl"
      | "qpay",
    apiUrl:
      process.env.BYL_API_URL ||
      process.env.PAYMENT_API_URL ||
      "https://byl.mn/api/v1",
    token: process.env.BYL_TOKEN || process.env.PAYMENT_API_KEY || "",
    projectId: process.env.BYL_PROJECT_ID || "",
    /** QPay direct (legacy) — only when PAYMENT_PROVIDER=qpay */
    username:
      process.env.PAYMENT_USERNAME || process.env.QPAY_USERNAME || "",
    password:
      process.env.PAYMENT_PASSWORD || process.env.QPAY_PASSWORD || "",
    invoiceCode:
      process.env.QPAY_INVOICE_CODE ||
      process.env.PAYMENT_INVOICE_CODE ||
      "",
    callbackUrl:
      process.env.QPAY_CALLBACK_URL ||
      `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/payments/qpay/callback`,
    webhookSecret:
      process.env.BYL_WEBHOOK_SECRET ||
      process.env.PAYMENT_WEBHOOK_SECRET ||
      "dev-webhook-secret",
    threeCardPrice: Number(process.env.THREE_CARD_PRICE || 0),
    fiveCardPrice: Number(process.env.FIVE_CARD_PRICE || 0),
    natalPrice: Number(process.env.NATAL_PRICE || 0),
    currency: process.env.PAYMENT_CURRENCY || "MNT",
  },
  email: {
    provider: (process.env.EMAIL_PROVIDER || "smtp") as "smtp" | "resend" | "console",
    resendApiKey: process.env.RESEND_API_KEY || "",
    smtpHost: process.env.SMTP_HOST || "",
    smtpPort: Number(process.env.SMTP_PORT || 587),
    smtpUser: process.env.SMTP_USER || "",
    smtpPassword: process.env.SMTP_PASSWORD || "",
    from: process.env.EMAIL_FROM || "TARO <onboarding@resend.dev>",
  },
  rateLimit: {
    windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS || 60000),
    max: Number(process.env.RATE_LIMIT_MAX || 20),
  },
  isDev: process.env.NODE_ENV !== "production",
};
