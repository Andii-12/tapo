import mongoose, { Schema, models, model } from "mongoose";

export interface ISettings {
  key: string;
  threeCardPrice: number;
  fiveCardPrice: number;
  natalPrice: number;
  currency: string;
}

const SettingsSchema = new Schema<ISettings>(
  {
    key: { type: String, default: "global", unique: true },
    threeCardPrice: { type: Number, default: 19900 },
    fiveCardPrice: { type: Number, default: 29900 },
    natalPrice: { type: Number, default: 14900 },
    currency: { type: String, default: "MNT" },
  },
  { timestamps: true }
);

export const Settings =
  models.Settings || model<ISettings>("Settings", SettingsSchema);
