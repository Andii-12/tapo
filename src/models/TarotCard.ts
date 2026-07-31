import mongoose, { Schema, models, model } from "mongoose";
import type { YesNoAnswer } from "@/types";

export interface ITarotCard {
  cardId: string;
  number: number;
  slug: string;
  nameMn: string;
  nameEn: string;
  imageUrl: string;
  shortMeaningMn: string;
  detailedMeaningMn: string;
  keywordsMn: string[];
  loveMeaningMn: string;
  careerMeaningMn: string;
  financeMeaningMn: string;
  personalGrowthMeaningMn: string;
  yesNoAnswer: YesNoAnswer;
  yesNoExplanationMn: string;
  shortMeaningEn: string;
  detailedMeaningEn: string;
  keywordsEn: string[];
  loveMeaningEn: string;
  careerMeaningEn: string;
  financeMeaningEn: string;
  personalGrowthMeaningEn: string;
  yesNoExplanationEn: string;
  isActive: boolean;
}

const TarotCardSchema = new Schema<ITarotCard>(
  {
    cardId: { type: String, required: true, unique: true, index: true },
    number: { type: Number, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    nameMn: { type: String, required: true },
    nameEn: { type: String, required: true },
    imageUrl: { type: String, required: true },
    shortMeaningMn: { type: String, required: true },
    detailedMeaningMn: { type: String, required: true },
    keywordsMn: [{ type: String }],
    loveMeaningMn: { type: String, required: true },
    careerMeaningMn: { type: String, required: true },
    financeMeaningMn: { type: String, required: true },
    personalGrowthMeaningMn: { type: String, required: true },
    yesNoAnswer: { type: String, enum: ["yes", "no"], required: true },
    yesNoExplanationMn: { type: String, required: true },
    shortMeaningEn: { type: String, default: "" },
    detailedMeaningEn: { type: String, default: "" },
    keywordsEn: [{ type: String }],
    loveMeaningEn: { type: String, default: "" },
    careerMeaningEn: { type: String, default: "" },
    financeMeaningEn: { type: String, default: "" },
    personalGrowthMeaningEn: { type: String, default: "" },
    yesNoExplanationEn: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const TarotCard =
  models.TarotCard || model<ITarotCard>("TarotCard", TarotCardSchema);
