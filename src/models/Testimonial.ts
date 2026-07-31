import mongoose, { Schema, models, model } from "mongoose";

export type TestimonialStatus = "approved" | "pending" | "hidden";
export type TestimonialSentiment = "good" | "bad";

export interface ITestimonial {
  slug: string;
  name: string;
  quote: string;
  meta: string;
  tag: string;
  sentiment: TestimonialSentiment;
  status: TestimonialStatus;
  isStatic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TestimonialSchema = new Schema<ITestimonial>(
  {
    slug: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, maxlength: 80 },
    quote: { type: String, required: true, maxlength: 800 },
    meta: { type: String, default: "", maxlength: 120 },
    tag: { type: String, default: "СЭТГЭГДЭЛ", maxlength: 40 },
    sentiment: {
      type: String,
      enum: ["good", "bad"],
      default: "good",
      index: true,
    },
    status: {
      type: String,
      enum: ["approved", "pending", "hidden"],
      default: "approved",
      index: true,
    },
    isStatic: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Testimonial =
  models.Testimonial || model<ITestimonial>("Testimonial", TestimonialSchema);
