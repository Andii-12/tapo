"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Field, Input } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";

export default function MyReadingPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [readingId, setReadingId] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <section className="container-page py-14">
      <div className="mx-auto max-w-md">
        <h1 className="font-serif text-4xl">Миний уншлага</h1>
        <p className="mt-3 text-sm text-ink-muted">
          Уншлагын дугаар болон и-мэйлээ оруулж хадгалсан тайлбараа үзээрэй.
        </p>

        <form
          className="mt-8 space-y-5"
          onSubmit={async (e) => {
            e.preventDefault();
            setLoading(true);
            setError(null);
            try {
              const res = await fetch("/api/readings/find", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ readingId, email }),
              });
              const json = await res.json();
              if (!res.ok) {
                setError(
                  json.error ||
                    "Таны уншлага олдсонгүй. Оруулсан мэдээллээ шалгана уу."
                );
                return;
              }
              toast("Уншлага олдлоо");
              router.push(
                `/unshlaga/${json.data.readingId}?token=${encodeURIComponent(json.data.accessToken)}`
              );
            } finally {
              setLoading(false);
            }
          }}
        >
          <Field label="Уншлагын дугаар">
            <Input
              value={readingId}
              onChange={(e) => setReadingId(e.target.value)}
              placeholder="TR-XXXXXXXXXX"
              required
            />
          </Field>
          <Field label="И-мэйл хаяг">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Field>
          {error ? (
            <p className="border border-border p-4 text-sm" role="alert">
              {error}
            </p>
          ) : null}
          <Button type="submit" fullWidth loading={loading}>
            Уншлагаа харах
          </Button>
        </form>

        <p className="mt-6 text-xs text-ink-soft">
          Уншлагын дугаараа олоход тусламж хэрэгтэй юу?{" "}
          <a href="/tuslamj" className="underline">
            Тусламж
          </a>
        </p>
      </div>
    </section>
  );
}
