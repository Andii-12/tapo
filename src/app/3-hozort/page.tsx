"use client";

import { ReadingFlow } from "@/components/tarot/ReadingFlow";

export default function ThreeCardPage() {
  return (
    <ReadingFlow
      readingType="three-card"
      formTitle="Мэдээллээ оруулна уу"
      selectTitle="3 хөзрийн уншлага"
    />
  );
}
