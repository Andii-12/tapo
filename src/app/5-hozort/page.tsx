"use client";

import { ReadingFlow } from "@/components/tarot/ReadingFlow";

export default function FiveCardPage() {
  return (
    <ReadingFlow
      readingType="five-card"
      formTitle="Мэдээллээ оруулна уу"
      selectTitle="5 хөзрийн дэлгэрэнгүй уншлага"
    />
  );
}
