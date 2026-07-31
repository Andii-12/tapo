"use client";

import { useCallback, useEffect, useState } from "react";
import { ReadingForm } from "@/components/forms/ReadingForm";
import { CardSelector } from "@/components/tarot/CardSelector";
import {
  ReadingResult,
  RevealStage,
  type ReadingView,
} from "@/components/result/ReadingResult";
import { LoadingState, ErrorState } from "@/components/ui/States";
import { ProgressSteps } from "@/components/ui/ProgressSteps";
import { useToast } from "@/components/ui/Toast";
import type { ReadingType } from "@/types";

type Step = "form" | "select" | "reveal" | "result";

export function ReadingFlow({
  readingType,
  formTitle,
  selectTitle,
}: {
  readingType: Exclude<ReadingType, "yes-no">;
  formTitle: string;
  selectTitle: string;
}) {
  const { toast } = useToast();
  const [step, setStep] = useState<Step>("form");
  const [reading, setReading] = useState<ReadingView | null>(null);
  const [token, setToken] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!reading?.readingId || !token) return;
    const res = await fetch(
      `/api/readings/${reading.readingId}?token=${encodeURIComponent(token)}`
    );
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Алдаа");
    setReading({ ...json.data, accessToken: token });
  }, [reading?.readingId, token]);

  useEffect(() => {
    const key = `tarot-session-${readingType}`;
    const params = new URLSearchParams(window.location.search);
    if (params.get("new") === "1") {
      sessionStorage.removeItem(key);
      window.history.replaceState(
        {},
        "",
        readingType === "five-card" ? "/5-hozort" : "/3-hozort"
      );
      setStep("form");
      setReading(null);
      setToken("");
      return;
    }

    const raw = sessionStorage.getItem(key);
    if (!raw) return;
    (async () => {
      try {
        const saved = JSON.parse(raw) as {
          readingId: string;
          token: string;
        };
        setLoading(true);
        const res = await fetch(
          `/api/readings/${saved.readingId}?token=${encodeURIComponent(saved.token)}`
        );
        const json = await res.json();
        if (!res.ok) return;
        setToken(saved.token);
        setReading({ ...json.data, accessToken: saved.token });
        if (json.data.freeResult) setStep("result");
        else if (json.data.selectedCardIds?.length === json.data.requiredCount)
          setStep("reveal");
        else setStep("select");
      } finally {
        setLoading(false);
      }
    })();
  }, [readingType]);

  if (loading) {
    return <LoadingState message="Уншлагыг бэлтгэж байна…" />;
  }

  if (error) {
    return (
      <div className="container-page py-16">
        <ErrorState message={error} onRetry={() => setError(null)} />
      </div>
    );
  }

  if (step === "form") {
    return (
      <ReadingForm
        readingType={readingType}
        title={formTitle}
        onSubmit={async (values) => {
          setLoading(true);
          try {
            const res = await fetch("/api/readings", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(values),
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json.error || "Алдаа гарлаа");
            const accessToken = json.data.accessToken as string;
            setToken(accessToken);
            sessionStorage.setItem(
              `tarot-session-${readingType}`,
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
          } catch (e) {
            setError(e instanceof Error ? e.message : "Алдаа гарлаа");
          } finally {
            setLoading(false);
          }
        }}
      />
    );
  }

  if (!reading) {
    return <LoadingState message="Уншлагыг бэлтгэж байна…" />;
  }

  if (step === "select") {
    return (
      <>
        <div className="container-page pt-8">
          <ProgressSteps
            steps={["Мэдээлэл", "Хөзөр сонгох", "Тайлбар"]}
            current={1}
          />
        </div>
        <CardSelector
          cardIds={reading.shuffledCardIds || reading.cards?.map((c: { id: string }) => c.id) || []}
          requiredCount={readingType === "three-card" ? 3 : 5}
          readingTitle={selectTitle}
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

            toast("Таны тайлбарыг боловсруулж байна…");
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
          // Shareable URL — without leaving the flow mid-reveal
          window.history.replaceState(
            {},
            "",
            `/unshlaga/${reading.readingId}?token=${encodeURIComponent(token)}`
          );
        }}
      />
    );
  }

  return (
    <ReadingResult
      reading={reading}
      onRefresh={async () => {
        await refresh();
      }}
    />
  );
}
