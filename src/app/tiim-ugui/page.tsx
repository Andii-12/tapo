"use client";

import { useCallback, useEffect, useState } from "react";
import { YesNoForm } from "@/components/forms/YesNoForm";
import { CardSelector } from "@/components/tarot/CardSelector";
import {
  ReadingResult,
  RevealStage,
  type ReadingView,
} from "@/components/result/ReadingResult";
import { LoadingState } from "@/components/ui/States";
import { ProgressSteps } from "@/components/ui/ProgressSteps";
import { useToast } from "@/components/ui/Toast";

type Step = "form" | "select" | "reveal" | "result";

export default function YesNoPage() {
  const { toast } = useToast();
  const [step, setStep] = useState<Step>("form");
  const [reading, setReading] = useState<ReadingView | null>(null);
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!reading?.readingId || !token) return;
    const res = await fetch(
      `/api/readings/${reading.readingId}?token=${encodeURIComponent(token)}`
    );
    const json = await res.json();
    if (res.ok) setReading({ ...json.data, accessToken: token });
  }, [reading?.readingId, token]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const forceNew = params.get("new") === "1";

    if (forceNew) {
      sessionStorage.removeItem("tarot-session-yes-no");
      // Clean URL without reloading again
      window.history.replaceState({}, "", "/tiim-ugui");
      setStep("form");
      setReading(null);
      setToken("");
      return;
    }

    const raw = sessionStorage.getItem("tarot-session-yes-no");
    if (!raw) return;
    (async () => {
      try {
        const saved = JSON.parse(raw) as { readingId: string; token: string };
        setLoading(true);
        const res = await fetch(
          `/api/readings/${saved.readingId}?token=${encodeURIComponent(saved.token)}`
        );
        const json = await res.json();
        if (!res.ok) return;
        setToken(saved.token);
        setReading({ ...json.data, accessToken: saved.token });
        if (json.data.freeResult) setStep("result");
        else if (json.data.selectedCardIds?.length) setStep("reveal");
        else setStep("select");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <LoadingState message="Уншлагыг бэлтгэж байна…" />;

  if (step === "form") {
    return (
      <YesNoForm
        onSubmit={async (values) => {
          setLoading(true);
          try {
            const res = await fetch("/api/readings", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                readingType: "yes-no",
                userName: values.userName,
                question: values.question,
                email: values.email || undefined,
              }),
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json.error || "Алдаа");
            const accessToken = json.data.accessToken as string;
            setToken(accessToken);
            sessionStorage.setItem(
              "tarot-session-yes-no",
              JSON.stringify({
                readingId: json.data.readingId,
                token: accessToken,
              })
            );
            const detail = await fetch(
              `/api/readings/${json.data.readingId}?token=${encodeURIComponent(accessToken)}`
            );
            const detailJson = await detail.json();
            setReading({ ...detailJson.data, accessToken });
            setStep("select");
            toast("Хөзрүүдийг хольж байна…");
          } finally {
            setLoading(false);
          }
        }}
      />
    );
  }

  if (!reading) return <LoadingState message="Уншлагыг бэлтгэж байна…" />;

  if (step === "select") {
    return (
      <>
        <div className="container-page pt-8">
          <ProgressSteps steps={["Мэдээлэл", "Хөзөр", "Хариу"]} current={1} />
        </div>
        <CardSelector
          cardIds={
            reading.shuffledCardIds ||
            reading.cards?.map((c) => c.id) ||
            []
          }
          requiredCount={1}
          readingTitle="Тийм эсвэл Үгүй"
          onComplete={async (cardIds) => {
            const res = await fetch(
              `/api/readings/${reading.readingId}/select-cards`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, cardIds }),
              }
            );
            const json = await res.json();
            if (!res.ok) throw new Error(json.error || "Алдаа");
            const gen = await fetch(
              `/api/readings/${reading.readingId}/generate`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token }),
              }
            );
            const genJson = await gen.json();
            if (!gen.ok) throw new Error(genJson.error || "Алдаа");
            setReading({ ...genJson.data, accessToken: token });
            setStep("reveal");
          }}
        />
      </>
    );
  }

  if (step === "reveal") {
    return (
      <RevealStage
        reading={reading}
        onContinue={() => {
          setStep("result");
          window.history.replaceState(
            {},
            "",
            `/unshlaga/${reading.readingId}?token=${encodeURIComponent(token)}`
          );
        }}
      />
    );
  }

  return <ReadingResult reading={reading} onRefresh={refresh} />;
}
