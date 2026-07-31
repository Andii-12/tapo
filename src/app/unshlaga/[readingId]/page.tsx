"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import {
  ReadingResult,
  type ReadingView,
} from "@/components/result/ReadingResult";
import { LoadingState, ErrorState } from "@/components/ui/States";

function ReadingInner() {
  const params = useParams<{ readingId: string }>();
  const search = useSearchParams();
  const token = search.get("token") || "";
  const [reading, setReading] = useState<ReadingView | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      if (!token) throw new Error("Хандах эрх буруу байна");
      const res = await fetch(
        `/api/readings/${params.readingId}?token=${encodeURIComponent(token)}`
      );
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Уншлага олдсонгүй");
      setReading({ ...json.data, accessToken: token });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Алдаа гарлаа");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.readingId, token]);

  if (loading) return <LoadingState message="Уншлагыг бэлтгэж байна…" />;
  if (error || !reading) {
    return (
      <div className="container-page py-16">
        <ErrorState
          title="Уншлага олдсонгүй"
          message={error || "Алдаа гарлаа"}
          onRetry={load}
        />
      </div>
    );
  }

  return (
    <ReadingResult
      reading={reading}
      onRefresh={async () => {
        await load();
      }}
    />
  );
}

export default function ReadingPage() {
  return (
    <Suspense fallback={<LoadingState message="Уншлагыг бэлтгэж байна…" />}>
      <ReadingInner />
    </Suspense>
  );
}
