import mongoose, { Schema, models, model } from "mongoose";
import type { PaymentProviderStatus } from "@/types";

export type PaymentProductType = "reading" | "natal";

export interface IPayment {
  paymentRef: string;
  productType: PaymentProductType;
  readingId?: string;
  natalOrderId?: string;
  amount: number;
  currency: string;
  provider: "mock" | "byl" | "qpay";
  status: PaymentProviderStatus;
  providerTransactionId?: string;
  qrPayload?: string;
  checkoutUrl?: string;
  paidAt?: Date;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment>(
  {
    paymentRef: { type: String, required: true, unique: true, index: true },
    productType: {
      type: String,
      enum: ["reading", "natal"],
      default: "reading",
      index: true,
    },
    // Optional: reading payments only. Natal uses natalOrderId.
    readingId: { type: String, required: false, index: true },
    natalOrderId: { type: String, required: false, index: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true, default: "MNT" },
    provider: { type: String, enum: ["mock", "qpay"], required: true },
    status: {
      type: String,
      enum: ["pending", "paid", "failed", "expired", "refunded"],
      default: "pending",
    },
    providerTransactionId: String,
    qrPayload: String,
    checkoutUrl: String,
    paidAt: Date,
    metadata: Schema.Types.Mixed,
  },
  { timestamps: true }
);

// Next.js hot-reload keeps the first compiled schema; drop stale model so
// readingId is no longer required after schema changes.
const existing = models.Payment as mongoose.Model<IPayment> | undefined;
if (existing) {
  const path = existing.schema.path("readingId") as
    | { isRequired?: boolean }
    | undefined;
  if (path?.isRequired || !existing.schema.path("natalOrderId")) {
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete (mongoose.models as Record<string, unknown>).Payment;
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete (mongoose.connection.models as Record<string, unknown>).Payment;
  }
}

export const Payment =
  (models.Payment as mongoose.Model<IPayment>) ||
  model<IPayment>("Payment", PaymentSchema);
