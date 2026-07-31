import type { TarotCardData } from "@/types";

export type Topic = "love" | "career" | "finance" | "growth";

function isMostlyCyrillic(text: string): boolean {
  const cyr = (text.match(/[\u0400-\u04FF]/g) || []).length;
  const lat = (text.match(/[A-Za-z]/g) || []).length;
  if (cyr === 0 && lat === 0) return false;
  return cyr >= lat;
}

function usableEn(text?: string | null): string {
  const t = (text || "").trim();
  if (!t || isMostlyCyrillic(t)) return "";
  return t;
}

function keywordPhrase(card: TarotCardData): string {
  const keys =
    card.keywordsEn?.filter(Boolean).length
      ? card.keywordsEn
      : card.keywordsMn;
  return (keys || []).slice(0, 3).join(", ") || "change and awareness";
}

/** Always returns English — never falls back to Mongolian copy. */
export function meaningForTopicEn(card: TarotCardData, topic: Topic): string {
  if (topic === "love") {
    const fromCard = usableEn(card.loveMeaningEn);
    if (fromCard) return fromCard;
    return `In love and relationships, ${card.nameEn} highlights ${keywordPhrase(card)}. It invites honesty about what you need, what you are ready to release, and how you connect.`;
  }
  if (topic === "career") {
    const fromCard = usableEn(card.careerMeaningEn);
    if (fromCard) return fromCard;
    return `At work, ${card.nameEn} points to ${keywordPhrase(card)}. It suggests noticing where effort, boundaries, or direction need a clearer move.`;
  }
  if (topic === "finance") {
    const fromCard = usableEn(card.financeMeaningEn);
    if (fromCard) return fromCard;
    return `Financially, ${card.nameEn} speaks to ${keywordPhrase(card)}. It encourages steady choices rather than rushed risk.`;
  }
  const fromCard = usableEn(card.personalGrowthMeaningEn);
  if (fromCard) return fromCard;
  const short = usableEn(card.shortMeaningEn) || usableEn(card.detailedMeaningEn);
  if (short) return short;
  return `For personal growth, ${card.nameEn} emphasizes ${keywordPhrase(card)}. Use it as a mirror for your next grounded step.`;
}

export function meaningForTopicMn(card: TarotCardData, topic: Topic): string {
  if (topic === "love") return card.loveMeaningMn;
  if (topic === "career") return card.careerMeaningMn;
  if (topic === "finance") return card.financeMeaningMn;
  return card.personalGrowthMeaningMn;
}

/** Format EN + MN block for PDF/email plain text */
export function bilingualBlock(en?: string | null, mn?: string | null): string {
  const e = (en || "").trim();
  const m = (mn || "").trim();
  if (e && m && e !== m) return `${e}\n\n${m}`;
  return e || m;
}

export const POSITION_EN: Record<string, string> = {
  "Одоогийн нөхцөл": "Present situation",
  "Нөлөөлж буй хүчин зүйл": "Influencing factor",
  "Цаашдын чиглэл": "Likely direction",
  "Одоогийн байдал": "Current state",
  "Гол саад": "Main obstacle",
  "Үндсэн шалтгаан": "Root cause",
  "Танд өгөх зөвлөгөө": "Advice for you",
  "Боломжит үр дүн": "Possible outcome",
  Хариулт: "Answer",
};

export function positionEn(positionMn: string): string {
  return POSITION_EN[positionMn] || positionMn;
}

export function positionLabel(positionMn: string): string {
  const en = positionEn(positionMn);
  if (en === positionMn) return positionMn;
  return `${en} · ${positionMn}`;
}
