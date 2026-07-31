export type ReadingType = "three-card" | "five-card" | "yes-no";
export type YesNoAnswer = "yes" | "no";
export type Gender = "male" | "female" | "other" | "prefer_not_to_say";
export type PaymentStatus =
  | "unpaid"
  | "not_required"
  | "pending"
  | "paid"
  | "failed"
  | "expired"
  | "refunded";
export type PaymentProviderStatus =
  | "pending"
  | "paid"
  | "failed"
  | "expired"
  | "refunded";

export interface TarotCardData {
  id: string;
  number: number;
  slug: string;
  nameMn: string;
  nameEn: string;
  imageUrl: string;
  shortMeaningMn: string;
  detailedMeaningMn: string;
  keywordsMn: string[];
  loveMeaningMn: string;
  careerMeaningMn: string;
  financeMeaningMn: string;
  personalGrowthMeaningMn: string;
  yesNoAnswer: YesNoAnswer;
  yesNoExplanationMn: string;
  shortMeaningEn?: string;
  detailedMeaningEn?: string;
  keywordsEn?: string[];
  loveMeaningEn?: string;
  careerMeaningEn?: string;
  financeMeaningEn?: string;
  personalGrowthMeaningEn?: string;
  yesNoExplanationEn?: string;
  isActive?: boolean;
}

export interface InterpretationInput {
  readingType: ReadingType;
  userName: string;
  age?: number;
  gender?: Gender;
  email?: string;
  question: string;
  selectedCards: TarotCardData[];
  spreadPositions: string[];
}

export interface InterpretationResult {
  freeCardInterpretations: string[];
  freeOverallInterpretation: string;
  paidCardInterpretations?: string[];
  paidOverallInterpretation?: string;
  advice?: string;
  challenge?: string;
  possibleOutcome?: string;
  cardConnections?: string;
  questionAnswer?: string;
  hiddenInfluence?: string;
  emotionalGuidance?: string;
  yesNoResult?: YesNoAnswer;
  yesNoLabel?: "ТИЙМ" | "ҮГҮЙ";
  /** English counterparts (same order / meaning as MN fields) */
  freeCardInterpretationsEn?: string[];
  freeOverallInterpretationEn?: string;
  paidCardInterpretationsEn?: string[];
  paidOverallInterpretationEn?: string;
  adviceEn?: string;
  challengeEn?: string;
  possibleOutcomeEn?: string;
  cardConnectionsEn?: string;
  questionAnswerEn?: string;
  hiddenInfluenceEn?: string;
  emotionalGuidanceEn?: string;
  yesNoLabelEn?: "YES" | "NO";
}

export interface AppSettings {
  threeCardPrice: number;
  fiveCardPrice: number;
  currency: string;
}

export const THREE_CARD_POSITIONS = [
  "Одоогийн нөхцөл",
  "Нөлөөлж буй хүчин зүйл",
  "Цаашдын чиглэл",
] as const;

export const FIVE_CARD_POSITIONS = [
  "Одоогийн байдал",
  "Гол саад",
  "Үндсэн шалтгаан",
  "Танд өгөх зөвлөгөө",
  "Боломжит үр дүн",
] as const;

export const YES_NO_POSITIONS = ["Хариулт"] as const;

export const GENDER_LABELS: Record<Gender, string> = {
  male: "Эрэгтэй",
  female: "Эмэгтэй",
  other: "Бусад",
  prefer_not_to_say: "Хариулахгүй",
};

export const READING_TYPE_LABELS: Record<ReadingType, string> = {
  "three-card": "3 хөзрийн уншлага",
  "five-card": "5 хөзрийн дэлгэрэнгүй уншлага",
  "yes-no": "Тийм эсвэл Үгүй",
};

export function requiredCardCount(type: ReadingType): number {
  if (type === "three-card") return 3;
  if (type === "five-card") return 5;
  return 1;
}

export function positionsForType(type: ReadingType): readonly string[] {
  if (type === "three-card") return THREE_CARD_POSITIONS;
  if (type === "five-card") return FIVE_CARD_POSITIONS;
  return YES_NO_POSITIONS;
}
