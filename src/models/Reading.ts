import mongoose, { Schema, models, model } from "mongoose";
import type { Gender, PaymentStatus, ReadingType } from "@/types";

export interface IReadingInterpretation {
  freeCardInterpretations: string[];
  freeOverallInterpretation: string;
  paidCardInterpretations?: string[];
  paidOverallInterpretation?: string;
  advice?: string;
  challenge?: string;
  possibleOutcome?: string;
  cardConnections?: string;
  questionAnswer?: string;
  hiddenInfluence?: string;
  emotionalGuidance?: string;
  yesNoResult?: "yes" | "no";
  yesNoLabel?: "ТИЙМ" | "ҮГҮЙ";
  freeCardInterpretationsEn?: string[];
  freeOverallInterpretationEn?: string;
  paidCardInterpretationsEn?: string[];
  paidOverallInterpretationEn?: string;
  adviceEn?: string;
  challengeEn?: string;
  possibleOutcomeEn?: string;
  cardConnectionsEn?: string;
  questionAnswerEn?: string;
  hiddenInfluenceEn?: string;
  emotionalGuidanceEn?: string;
  yesNoLabelEn?: "YES" | "NO";
}

export interface IReading {
  readingId: string;
  accessTokenHash: string;
  readingType: ReadingType;
  userName: string;
  age?: number;
  birthDate?: string;
  birthTime?: string;
  gender?: Gender;
  email?: string;
  question: string;
  shuffledCardIds: string[];
  selectedCardIds: string[];
  freeResult?: IReadingInterpretation;
  paidResult?: IReadingInterpretation;
  paymentStatus: PaymentStatus;
  price?: number;
  currency?: string;
  pdfGeneratedAt?: Date;
  emailHistory: Array<{
    sentAt: Date;
    recipient: string;
    resultType: "free" | "paid";
    status: "sent" | "failed";
    error?: string;
  }>;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const InterpretationSchema = new Schema(
  {
    freeCardInterpretations: [String],
    freeOverallInterpretation: String,
    paidCardInterpretations: [String],
    paidOverallInterpretation: String,
    advice: String,
    challenge: String,
    possibleOutcome: String,
    cardConnections: String,
    questionAnswer: String,
    hiddenInfluence: String,
    emotionalGuidance: String,
    yesNoResult: { type: String, enum: ["yes", "no"] },
    yesNoLabel: { type: String, enum: ["ТИЙМ", "ҮГҮЙ"] },
    freeCardInterpretationsEn: [String],
    freeOverallInterpretationEn: String,
    paidCardInterpretationsEn: [String],
    paidOverallInterpretationEn: String,
    adviceEn: String,
    challengeEn: String,
    possibleOutcomeEn: String,
    cardConnectionsEn: String,
    questionAnswerEn: String,
    hiddenInfluenceEn: String,
    emotionalGuidanceEn: String,
    yesNoLabelEn: { type: String, enum: ["YES", "NO"] },
  },
  { _id: false }
);

const ReadingSchema = new Schema<IReading>(
  {
    readingId: { type: String, required: true, unique: true, index: true },
    accessTokenHash: { type: String, required: true },
    readingType: {
      type: String,
      enum: ["three-card", "five-card", "yes-no"],
      required: true,
    },
    userName: { type: String, required: true },
    age: Number,
    birthDate: String,
    birthTime: String,
    gender: {
      type: String,
      enum: ["male", "female", "other", "prefer_not_to_say"],
    },
    email: { type: String, index: true },
    question: { type: String, required: true },
    shuffledCardIds: [{ type: String, required: true }],
    selectedCardIds: [{ type: String }],
    freeResult: InterpretationSchema,
    paidResult: InterpretationSchema,
    paymentStatus: {
      type: String,
      enum: ["not_required", "pending", "paid", "failed", "expired", "refunded"],
      default: "pending",
    },
    price: Number,
    currency: { type: String, default: "MNT" },
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
    expiresAt: Date,
  },
  { timestamps: true }
);

ReadingSchema.index({ email: 1, readingId: 1 });

// Hot-reload may keep an old schema without English fields — force refresh.
const existingReading = models.Reading as
  | mongoose.Model<IReading>
  | undefined;
if (existingReading) {
  const enPath = existingReading.schema.path(
    "freeResult.freeCardInterpretationsEn"
  );
  if (!enPath) {
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete (mongoose.models as Record<string, unknown>).Reading;
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete (mongoose.connection.models as Record<string, unknown>).Reading;
  }
}

export const Reading =
  (models.Reading as mongoose.Model<IReading>) ||
  model<IReading>("Reading", ReadingSchema);

export type ReadingDocument = import("mongoose").HydratedDocument<IReading>;

export function asStringIds(ids: unknown): string[] {
  return Array.isArray(ids) ? (ids as string[]) : [];
}
