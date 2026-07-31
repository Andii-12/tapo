"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Field, Input, Select, Textarea } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { ProgressSteps } from "@/components/ui/ProgressSteps";
import type { ReadingType } from "@/types";
import { getQuestionPolicyViolation } from "@/lib/security/question-policy";

const MN_MONTHS = [
  "1-р сар",
  "2-р сар",
  "3-р сар",
  "4-р сар",
  "5-р сар",
  "6-р сар",
  "7-р сар",
  "8-р сар",
  "9-р сар",
  "10-р сар",
  "11-р сар",
  "12-р сар",
];

function daysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

function calcAge(year: number, month: number, day: number): number {
  const today = new Date();
  let age = today.getFullYear() - year;
  const m = today.getMonth() + 1 - month;
  if (m < 0 || (m === 0 && today.getDate() < day)) age -= 1;
  return age;
}

const formSchema = z
  .object({
    userName: z.string().min(2, "Нэрийг оруулна уу"),
    birthYear: z.coerce.number({ invalid_type_error: "Жилээ сонгоно уу" }),
    birthMonth: z.coerce.number({ invalid_type_error: "Сараа сонгоно уу" }),
    birthDay: z.coerce.number({ invalid_type_error: "Өдрөө сонгоно уу" }),
    email: z.string().email("И-мэйл хаяг буруу байна"),
    gender: z.enum(["male", "female", "other", "prefer_not_to_say"], {
      required_error: "Хүйсээ сонгоно уу",
      invalid_type_error: "Хүйсээ сонгоно уу",
    }),
    question: z
      .string()
      .min(5, "Асуултаа илүү тодорхой бичнэ үү")
      .superRefine((q, ctx) => {
        const policy = getQuestionPolicyViolation(q);
        if (policy) {
          ctx.addIssue({ code: z.ZodIssueCode.custom, message: policy });
        }
      }),
    consent: z.literal(true, {
      errorMap: () => ({ message: "Үйлчилгээний нөхцөлийг зөвшөөрнө үү" }),
    }),
  })
  .superRefine((data, ctx) => {
    const { birthYear, birthMonth, birthDay } = data;
    if (!birthYear || !birthMonth || !birthDay) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["birthDay"],
        message: "Төрсөн он, сар, өдрөө сонгоно уу",
      });
      return;
    }
    const maxDay = daysInMonth(birthYear, birthMonth);
    if (birthDay < 1 || birthDay > maxDay) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["birthDay"],
        message: "Өдөр буруу байна",
      });
      return;
    }
    const born = new Date(birthYear, birthMonth - 1, birthDay);
    if (
      born.getFullYear() !== birthYear ||
      born.getMonth() !== birthMonth - 1 ||
      born.getDate() !== birthDay
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["birthDay"],
        message: "Огноо буруу байна",
      });
      return;
    }
    if (born > new Date()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["birthYear"],
        message: "Ирээдүйн огноо байж болохгүй",
      });
      return;
    }
    const age = calcAge(birthYear, birthMonth, birthDay);
    if (age < 13) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["birthYear"],
        message: "Нас 13-аас дээш байх ёстой",
      });
    }
    if (age > 120) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["birthYear"],
        message: "Огноо буруу байна",
      });
    }
  });

type FormValues = z.infer<typeof formSchema>;

export type ReadingFormSubmit = {
  userName: string;
  age: number;
  email: string;
  gender: FormValues["gender"];
  question: string;
  consent: true;
  readingType: ReadingType;
  birthDate: string;
};

const examples = [
  "Миний одоогийн харилцаа цаашид хэрхэн үргэлжлэх вэ?",
  "Би ажлаа солих нь зөв үү?",
  "Одоогийн нөхцөл байдлаас хэрхэн гарах вэ?",
];

export function ReadingForm({
  readingType,
  title,
  onSubmit,
}: {
  readingType: Exclude<ReadingType, "yes-no">;
  title: string;
  onSubmit: (values: ReadingFormSubmit) => Promise<void>;
}) {
  const [loading, setLoading] = useState(false);
  const currentYear = new Date().getFullYear();
  const years = useMemo(
    () =>
      Array.from({ length: 108 }, (_, i) => currentYear - 13 - i),
    [currentYear]
  );

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userName: "",
      email: "",
      question: "",
    },
  });

  const birthYear = watch("birthYear");
  const birthMonth = watch("birthMonth");
  const birthDay = watch("birthDay");

  const maxDay =
    birthYear && birthMonth
      ? daysInMonth(Number(birthYear), Number(birthMonth))
      : 31;

  const days = useMemo(
    () => Array.from({ length: maxDay }, (_, i) => i + 1),
    [maxDay]
  );

  useEffect(() => {
    if (birthDay && Number(birthDay) > maxDay) {
      setValue("birthDay", maxDay, { shouldValidate: true });
    }
  }, [birthDay, maxDay, setValue]);

  const agePreview =
    birthYear && birthMonth && birthDay
      ? calcAge(Number(birthYear), Number(birthMonth), Number(birthDay))
      : null;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const birthError =
    errors.birthYear?.message ||
    errors.birthMonth?.message ||
    errors.birthDay?.message;

  return (
    <section className="container-page py-10 md:py-14">
      <ProgressSteps
        steps={["Мэдээлэл", "Хөзөр сонгох", "Тайлбар"]}
        current={0}
      />
      <div className="mx-auto mt-10 max-w-2xl">
        <h1 className="font-serif text-3xl md:text-4xl">{title}</h1>
        <p className="mt-2 text-sm text-ink-muted">
          Бид таны асуултад илүү сайн хариулахад тань тусална.
        </p>
        <p className="mt-1 text-xs text-ink-soft">
          Таны мэдээллийг зөвхөн уншлага бэлтгэх, хүргэхэд ашиглана.
        </p>

        <form
          className="mt-8 space-y-5"
          onSubmit={handleSubmit(async (values) => {
            setLoading(true);
            try {
              const age = calcAge(
                values.birthYear,
                values.birthMonth,
                values.birthDay
              );
              const birthDate = `${values.birthYear}-${String(values.birthMonth).padStart(2, "0")}-${String(values.birthDay).padStart(2, "0")}`;
              await onSubmit({
                userName: values.userName,
                age,
                email: values.email,
                gender: values.gender,
                question: values.question,
                consent: values.consent,
                readingType,
                birthDate,
              });
            } finally {
              setLoading(false);
            }
          })}
        >
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Нэр" error={errors.userName?.message}>
              <Input {...register("userName")} autoComplete="name" />
            </Field>
            <Field label="Төрсөн огноо" error={birthError}>
              <div className="grid grid-cols-3 gap-2">
                <Select {...register("birthYear")} defaultValue="">
                  <option value="" disabled>
                    Он
                  </option>
                  {years.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </Select>
                <Select {...register("birthMonth")} defaultValue="">
                  <option value="" disabled>
                    Сар
                  </option>
                  {MN_MONTHS.map((label, i) => (
                    <option key={label} value={i + 1}>
                      {label}
                    </option>
                  ))}
                </Select>
                <Select {...register("birthDay")} defaultValue="">
                  <option value="" disabled>
                    Өдөр
                  </option>
                  {days.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </Select>
              </div>
              {agePreview != null && agePreview >= 0 ? (
                <p className="mt-2 text-xs text-ink-soft">
                  Тооцоолсон нас: <span className="text-ink">{agePreview}</span>
                </p>
              ) : null}
            </Field>
            <Field label="И-мэйл" error={errors.email?.message}>
              <Input type="email" {...register("email")} autoComplete="email" />
            </Field>
            <Field label="Хүйс" error={errors.gender?.message}>
              <Select {...register("gender")} defaultValue="">
                <option value="" disabled>
                  Сонгох
                </option>
                <option value="male">Эрэгтэй</option>
                <option value="female">Эмэгтэй</option>
                <option value="other">Бусад</option>
                <option value="prefer_not_to_say">Хариулахгүй</option>
              </Select>
            </Field>
          </div>

          <Field
            label="Асуух зүйл"
            error={
              errors.question?.message?.includes("хариулж чадахгүй")
                ? undefined
                : errors.question?.message
            }
          >
            <Textarea
              {...register("question")}
              placeholder="Та юуны талаар асуухыг хүсэж байна вэ?"
            />
          </Field>
          {errors.question?.message?.includes("хариулж чадахгүй") ? (
            <p className="rounded-sm border border-border bg-bg-white p-3 text-sm leading-relaxed text-ink-muted">
              {errors.question.message}
            </p>
          ) : null}

          <div className="flex flex-wrap gap-2">
            {examples.map((ex) => (
              <button
                key={ex}
                type="button"
                className="border border-border px-3 py-2 text-left text-xs text-ink-muted hover:border-ink hover:text-ink"
                onClick={() => setValue("question", ex, { shouldValidate: true })}
              >
                {ex}
              </button>
            ))}
          </div>

          <label className="flex items-start gap-3 text-sm text-ink-muted">
            <input
              type="checkbox"
              className="mt-1"
              {...register("consent")}
            />
            <span>
              Би{" "}
              <Link href="/uilchilgeenii-nuhtsul" className="underline">
                үйлчилгээний нөхцөл
              </Link>{" "}
              болон{" "}
              <Link href="/nuutslalyn-bodlogo" className="underline">
                нууцлалын бодлого
              </Link>
              -ыг зөвшөөрч байна.
            </span>
          </label>
          {errors.consent ? (
            <p className="text-xs text-ink" role="alert">
              {errors.consent.message}
            </p>
          ) : null}

          <Button type="submit" fullWidth loading={loading}>
            Хөзрөө сонгох
          </Button>
        </form>
      </div>
    </section>
  );
}
