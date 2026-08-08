import type { ReadingType } from "@/types";

/** Display-only list prices for the free sale (actual charge may be 0). */
export const LIST_PRICES = {
  "three-card": 4900,
  "five-card": 5900,
  natal: 3900,
} as const;

export function listPriceForReading(type: ReadingType): number | null {
  if (type === "three-card") return LIST_PRICES["three-card"];
  if (type === "five-card") return LIST_PRICES["five-card"];
  return null;
}

export function formatMnt(amount: number): string {
  return `${amount.toLocaleString("mn-MN")}₮`;
}
