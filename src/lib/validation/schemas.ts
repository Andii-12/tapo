import { z } from "zod";
import { getQuestionPolicyViolation } from "@/lib/security/question-policy";

export const genderSchema = z.enum([
  "male",
  "female",
  "other",
  "prefer_not_to_say",
]);

export const readingTypeSchema = z.enum([
  "three-card",
  "five-card",
  "yes-no",
]);

export const createReadingSchema = z
  .object({
    readingType: readingTypeSchema,
    userName: z
      .string()
      .trim()
      .min(2, "Нэрийг оруулна уу")
      .max(80, "Нэр хэт урт байна"),
    age: z.coerce
      .number()
      .int("Нас бүхэл тоо байх ёстой")
      .min(13, "Нас 13-аас дээш байх ёстой")
      .max(120, "Нас буруу байна")
      .optional(),
    email: z
      .string()
      .trim()
      .email("И-мэйл хаяг буруу байна")
      .optional()
      .or(z.literal("")),
    gender: genderSchema.optional(),
    question: z
      .string()
      .trim()
      .min(5, "Асуултаа илүү тодорхой бичнэ үү")
      .max(500, "Асуулт хэт урт байна"),
    consent: z.boolean().optional(),
    birthDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Төрсөн огноо буруу байна")
      .optional(),
    birthTime: z
      .string()
      .regex(/^\d{1,2}:\d{2}$/, "Цаг буруу байна")
      .optional()
      .or(z.literal("")),
  })
  .superRefine((data, ctx) => {
    const policy = getQuestionPolicyViolation(data.question);
    if (policy) {
      ctx.addIssue({
        code: "custom",
        path: ["question"],
        message: policy,
      });
    }
    if (data.readingType !== "yes-no") {
      if (!data.age) {
        ctx.addIssue({
          code: "custom",
          path: ["age"],
          message: "Насаа оруулна уу",
        });
      }
      if (!data.birthDate) {
        ctx.addIssue({
          code: "custom",
          path: ["birthDate"],
          message: "Төрсөн огноогоо оруулна уу",
        });
      }
      if (!data.email) {
        ctx.addIssue({
          code: "custom",
          path: ["email"],
          message: "И-мэйл хаягаа оруулна уу",
        });
      }
      if (!data.gender) {
        ctx.addIssue({
          code: "custom",
          path: ["gender"],
          message: "Хүйсээ сонгоно уу",
        });
      }
      if (!data.consent) {
        ctx.addIssue({
          code: "custom",
          path: ["consent"],
          message: "Үйлчилгээний нөхцөлийг зөвшөөрнө үү",
        });
      }
    }
  });

export const selectCardsSchema = z.object({
  token: z.string().min(20, "Хандах эрх буруу байна"),
  cardIds: z
    .array(z.string().min(1))
    .min(1, "Хөзөр сонгоно уу")
    .max(5, "Хэт олон хөзөр сонгосон байна"),
});

export const tokenQuerySchema = z.object({
  token: z.string().min(20, "Хандах эрх буруу байна"),
});

export const findReadingSchema = z.object({
  readingId: z.string().min(5, "Уншлагын дугаар оруулна уу"),
  email: z.string().email("И-мэйл хаяг буруу байна"),
});

export const emailRequestSchema = z.object({
  token: z.string().min(20),
  confirm: z.literal(true, {
    errorMap: () => ({ message: "Илгээхийг баталгаажуулна уу" }),
  }),
  email: z.string().email("И-мэйл хаяг буруу байна").optional(),
});

export const natalEmailRequestSchema = z.object({
  token: z.string().min(20),
  confirm: z.literal(true, {
    errorMap: () => ({ message: "Илгээхийг баталгаажуулна уу" }),
  }),
  email: z.string().email("И-мэйл хаяг буруу байна"),
});

export const paymentCreateSchema = z.object({
  token: z.string().min(20),
});

export const adminLoginSchema = z.object({
  email: z.string().trim().min(1).max(120),
  password: z.string().min(6),
});

export const cardUpdateSchema = z.object({
  shortMeaningMn: z.string().optional(),
  detailedMeaningMn: z.string().optional(),
  keywordsMn: z.array(z.string()).optional(),
  loveMeaningMn: z.string().optional(),
  careerMeaningMn: z.string().optional(),
  financeMeaningMn: z.string().optional(),
  personalGrowthMeaningMn: z.string().optional(),
  yesNoAnswer: z.enum(["yes", "no"]).optional(),
  yesNoExplanationMn: z.string().optional(),
  isActive: z.boolean().optional(),
});

export const pricesUpdateSchema = z.object({
  threeCardPrice: z.number().int().positive(),
  fiveCardPrice: z.number().int().positive(),
  natalPrice: z.number().int().positive(),
  currency: z.string().default("MNT"),
});

export type CreateReadingInput = z.infer<typeof createReadingSchema>;
