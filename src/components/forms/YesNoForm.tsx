"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Field, Input, Textarea } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { ProgressSteps } from "@/components/ui/ProgressSteps";
import { getQuestionPolicyViolation } from "@/lib/security/question-policy";

const schema = z.object({
  userName: z.string().min(2, "Нэрийг оруулна уу"),
  question: z
    .string()
    .min(5, "Асуултаа илүү тодорхой бичнэ үү")
    .superRefine((q, ctx) => {
      const policy = getQuestionPolicyViolation(q);
      if (policy) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: policy });
      }
    }),
  email: z
    .string()
    .email("И-мэйл хаяг буруу байна")
    .optional()
    .or(z.literal("")),
});

type FormValues = z.infer<typeof schema>;

export function YesNoForm({
  onSubmit,
}: {
  onSubmit: (values: FormValues) => Promise<void>;
}) {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  return (
    <section className="container-page py-10 md:py-14">
      <ProgressSteps steps={["Мэдээлэл", "Хөзөр", "Хариу"]} current={0} />
      <div className="mx-auto mt-10 max-w-xl">
        <p className="mb-2 text-xs tracking-[0.2em] text-ink-soft">ҮНЭГҮЙ</p>
        <h1 className="font-serif text-3xl md:text-4xl">Тийм эсвэл Үгүй</h1>
        <p className="mt-2 text-sm text-ink-muted">
          Нэг хөзөр сонгож, асуултдаа хурдан хариулт аваарай.
        </p>

        <form
          className="mt-8 space-y-5"
          onSubmit={handleSubmit(async (values) => {
            setLoading(true);
            try {
              await onSubmit(values);
            } finally {
              setLoading(false);
            }
          })}
        >
          <Field label="Нэр" error={errors.userName?.message}>
            <Input {...register("userName")} />
          </Field>
          <Field
            label="Асуулт"
            error={
              errors.question?.message?.includes("хариулж чадахгүй")
                ? undefined
                : errors.question?.message
            }
          >
            <Textarea
              {...register("question")}
              placeholder="Тийм эсвэл Үгүй гэж хариулж болох асуултаа бичнэ үү."
            />
          </Field>
          {errors.question?.message?.includes("хариулж чадахгүй") ? (
            <p className="rounded-sm border border-border bg-bg-white p-3 text-sm leading-relaxed text-ink-muted">
              {errors.question.message}
            </p>
          ) : null}
          <Field label="И-мэйл (заавал биш)" error={errors.email?.message}>
            <Input type="email" {...register("email")} />
          </Field>
          <Button type="submit" fullWidth loading={loading}>
            Хөзрөө сонгох
          </Button>
        </form>
      </div>
    </section>
  );
}
