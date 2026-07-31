import mongoose, { Schema, models, model } from "mongoose";
import type { PaymentStatus } from "@/types";

export interface INatalOrder {
  orderId: string;
  accessTokenHash: string;
  birthDate: string;
  birthTime?: string;
  email?: string;
  paymentStatus: PaymentStatus;
  price: number;
  currency: string;
  paidAt?: Date;
  pdfGeneratedAt?: Date;
  emailHistory: Array<{
    sentAt: Date;
    recipient: string;
    resultType: "free" | "paid";
    status: "sent" | "failed";
    error?: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const NatalOrderSchema = new Schema<INatalOrder>(
  {
    orderId: { type: String, required: true, unique: true, index: true },
    accessTokenHash: { type: String, required: true },
    birthDate: { type: String, required: true },
    birthTime: String,
    email: { type: String, index: true },
    paymentStatus: {
      type: String,
      enum: ["unpaid", "pending", "paid", "failed", "refunded", "not_required"],
      default: "unpaid",
    },
    price: { type: Number, required: true },
    currency: { type: String, default: "MNT" },
    paidAt: Date,
    pdfGeneratedAt: Date,
    emailHistory: [
      {
        sentAt: Date,
        recipient: String,
        resultType: { type: String, enum: ["free", "paid"] },
        status: { type: String, enum: ["sent", "failed"] },
        error: String,
      },
    ],
  },
  { timestamps: true }
);

export const NatalOrder =
  models.NatalOrder || model<INatalOrder>("NatalOrder", NatalOrderSchema);
