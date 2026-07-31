"use client";

import { useState } from "react";
import { SitePage, SiteSection } from "@/components/content/SitePage";
import { Button } from "@/components/ui/Button";
import { Field, Input, Textarea } from "@/components/ui/Field";
import { useToast } from "@/components/ui/Toast";

export default function ContactPage() {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast("Бүх талбарыг бөглөнө үү");
      return;
    }
    const subject = encodeURIComponent(`ТАРО холбоо — ${name.trim()}`);
    const body = encodeURIComponent(
      `Нэр: ${name.trim()}\nИ-мэйл: ${email.trim()}\n\n${message.trim()}`
    );
    window.location.href = `mailto:hello@tarot.mn?subject=${subject}&body=${body}`;
    toast("И-мэйл апп нээгдэж байна…");
  }

  return (
    <SitePage
      eyebrow="✦ CONTACT ✦"
      title="Холбоо барих"
      lead="Асуулт, санал хүсэлт, төлбөр/буцаан олголтын хүсэлтээ бидэнтэй хуваалцаарай."
    >
      <SiteSection title="Шууд холбоо">
        <p>
          И-мэйл:{" "}
          <a href="mailto:hello@tarot.mn" className="underline">
            hello@tarot.mn
          </a>
        </p>
        <p className="mt-2 text-ink-soft">
          Ажлын өдрүүдэд ихэвчлэн 1–2 хоногийн дотор хариу өгнө.
        </p>
      </SiteSection>

      <SiteSection title="Зурвас илгээх">
        <form className="space-y-4" onSubmit={onSubmit}>
          <Field label="Нэр">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
            />
          </Field>
          <Field label="И-мэйл">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </Field>
          <Field label="Зурвас">
            <Textarea
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Уншлагын дугаар, асуудлын тайлбар гэх мэт…"
            />
          </Field>
          <Button type="submit">И-мэйл илгээх</Button>
        </form>
      </SiteSection>
    </SitePage>
  );
}
