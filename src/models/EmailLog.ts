import mongoose, { Schema, models, model } from "mongoose";

export interface IEmailLog {
  readingId?: string;
  natalOrderId?: string;
  recipient: string;
  resultType: "free" | "paid";
  deliveryStatus: "sent" | "failed" | "pending";
  sentAt?: Date;
  errorMessage?: string;
  subject: string;
}

const EmailLogSchema = new Schema<IEmailLog>(
  {
    readingId: { type: String, index: true },
    natalOrderId: { type: String, index: true },
    recipient: { type: String, required: true },
    resultType: { type: String, enum: ["free", "paid"], required: true },
    deliveryStatus: {
      type: String,
      enum: ["sent", "failed", "pending"],
      default: "pending",
    },
    sentAt: Date,
    errorMessage: String,
    subject: { type: String, required: true },
  },
  { timestamps: true }
);

export const EmailLog =
  models.EmailLog || model<IEmailLog>("EmailLog", EmailLogSchema);
