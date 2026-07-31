import { connectDB } from "@/lib/database/connect";
import { TarotCard } from "@/models/TarotCard";
import { Reading, asStringIds } from "@/models/Reading";
import { fisherYatesShuffle } from "@/lib/tarot/shuffle";
import {
  generateAccessToken,
  generateReadingId,
  hashToken,
  sanitizeText,
  safeEqual,
} from "@/lib/security/tokens";
import { generateInterpretation, guaranteeEnglishFields } from "@/services/interpretation.service";
import { assertQuestionAllowed } from "@/lib/security/question-policy";
import { teaseText } from "@/lib/tarot/tease-text";
import { computeNatalChart } from "@/lib/astrology/natal";
import {
  buildNatalPreview,
} from "@/lib/astrology/report";
import { getPrices, priceForType } from "@/services/payment.service";
import type { CreateReadingInput } from "@/lib/validation/schemas";
import {
  positionsForType as getPositions,
  requiredCardCount as getRequiredCount,
  type TarotCardData,
  type PaymentStatus,
  type InterpretationResult,
} from "@/types";

function isMostlyCyrillic(text: string): boolean {
  const cyr = (text.match(/[\u0400-\u04FF]/g) || []).length;
  const lat = (text.match(/[A-Za-z]/g) || []).length;
  if (cyr === 0 && lat === 0) return false;
  return cyr >= lat;
}

function needsEnglishEnrichment(
  free?: {
    freeCardInterpretations?: string[];
    freeCardInterpretationsEn?: string[];
  } | null
): boolean {
  const en = free?.freeCardInterpretationsEn;
  const mnLen = free?.freeCardInterpretations?.length || 0;
  if (!en?.length || (mnLen > 0 && en.length !== mnLen)) return true;
  return en.some((t) => !t?.trim() || isMostlyCyrillic(t));
}

async function enrichReadingEnglish(
  reading: InstanceType<typeof Reading>
): Promise<void> {
  if (!reading.freeResult || !needsEnglishEnrichment(reading.freeResult)) {
    return;
  }

  const all = await getActiveCards();
  const byId = new Map(all.map((c) => [c.id, c]));
  const selectedIds = asStringIds(reading.selectedCardIds);
  const selectedCards = selectedIds
    .map((id) => byId.get(id))
    .filter(Boolean) as TarotCardData[];
  if (!selectedCards.length) return;

  const seed: InterpretationResult = {
    freeCardInterpretations: reading.freeResult.freeCardInterpretations || [],
    freeOverallInterpretation:
      reading.freeResult.freeOverallInterpretation || "",
    freeCardInterpretationsEn: reading.freeResult.freeCardInterpretationsEn,
    freeOverallInterpretationEn: reading.freeResult.freeOverallInterpretationEn,
    paidCardInterpretations: reading.paidResult?.paidCardInterpretations,
    paidOverallInterpretation: reading.paidResult?.paidOverallInterpretation,
    paidCardInterpretationsEn: reading.paidResult?.paidCardInterpretationsEn,
    paidOverallInterpretationEn:
      reading.paidResult?.paidOverallInterpretationEn,
    advice: reading.freeResult.advice || reading.paidResult?.advice,
    adviceEn: reading.freeResult.adviceEn || reading.paidResult?.adviceEn,
    challenge: reading.paidResult?.challenge,
    challengeEn: reading.paidResult?.challengeEn,
    possibleOutcome: reading.paidResult?.possibleOutcome,
    possibleOutcomeEn: reading.paidResult?.possibleOutcomeEn,
    cardConnections: reading.paidResult?.cardConnections,
    cardConnectionsEn: reading.paidResult?.cardConnectionsEn,
    questionAnswer: reading.paidResult?.questionAnswer,
    questionAnswerEn: reading.paidResult?.questionAnswerEn,
    hiddenInfluence: reading.paidResult?.hiddenInfluence,
    hiddenInfluenceEn: reading.paidResult?.hiddenInfluenceEn,
    emotionalGuidance: reading.paidResult?.emotionalGuidance,
    emotionalGuidanceEn: reading.paidResult?.emotionalGuidanceEn,
    yesNoResult: reading.freeResult.yesNoResult,
    yesNoLabel: reading.freeResult.yesNoLabel,
    yesNoLabelEn: reading.freeResult.yesNoLabelEn,
  };

  const bilingual = guaranteeEnglishFields(seed, {
    readingType: reading.readingType,
    userName: reading.userName,
    age: reading.age,
    gender: reading.gender,
    email: reading.email,
    question: reading.question,
    selectedCards,
    spreadPositions: [...getPositions(reading.readingType)],
  });

  const paywalled = reading.readingType !== "yes-no";
  const paid = reading.paymentStatus === "paid";

  reading.freeResult.freeCardInterpretationsEn =
    paywalled && !paid
      ? (bilingual.freeCardInterpretationsEn || []).map((t) =>
          teaseText(t, 155)
        )
      : bilingual.freeCardInterpretationsEn;
  reading.freeResult.freeOverallInterpretationEn =
    paywalled && !paid
      ? teaseText(
          bilingual.freeOverallInterpretationEn ||
            bilingual.questionAnswerEn ||
            "",
          180
        )
      : bilingual.freeOverallInterpretationEn;
  reading.freeResult.adviceEn =
    paywalled && !paid
      ? teaseText(bilingual.adviceEn || "", 110)
      : bilingual.adviceEn;
  reading.freeResult.yesNoLabelEn = bilingual.yesNoLabelEn;
  reading.markModified("freeResult");

  if (reading.paidResult) {
    reading.paidResult.freeCardInterpretationsEn =
      bilingual.freeCardInterpretationsEn;
    reading.paidResult.freeOverallInterpretationEn =
      bilingual.freeOverallInterpretationEn;
    reading.paidResult.paidCardInterpretationsEn =
      bilingual.paidCardInterpretationsEn;
    reading.paidResult.paidOverallInterpretationEn =
      bilingual.paidOverallInterpretationEn;
    reading.paidResult.adviceEn = bilingual.adviceEn;
    reading.paidResult.challengeEn = bilingual.challengeEn;
    reading.paidResult.possibleOutcomeEn = bilingual.possibleOutcomeEn;
    reading.paidResult.cardConnectionsEn = bilingual.cardConnectionsEn;
    reading.paidResult.questionAnswerEn = bilingual.questionAnswerEn;
    reading.paidResult.hiddenInfluenceEn = bilingual.hiddenInfluenceEn;
    reading.paidResult.emotionalGuidanceEn = bilingual.emotionalGuidanceEn;
    reading.markModified("paidResult");
  }

  await reading.save();
}

function toCardData(doc: {
  cardId: string;
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
  yesNoAnswer: "yes" | "no";
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
}): TarotCardData {
  return {
    id: doc.cardId,
    number: doc.number,
    slug: doc.slug,
    nameMn: doc.nameMn,
    nameEn: doc.nameEn,
    imageUrl: doc.imageUrl,
    shortMeaningMn: doc.shortMeaningMn,
    detailedMeaningMn: doc.detailedMeaningMn,
    keywordsMn: doc.keywordsMn,
    loveMeaningMn: doc.loveMeaningMn,
    careerMeaningMn: doc.careerMeaningMn,
    financeMeaningMn: doc.financeMeaningMn,
    personalGrowthMeaningMn: doc.personalGrowthMeaningMn,
    yesNoAnswer: doc.yesNoAnswer,
    yesNoExplanationMn: doc.yesNoExplanationMn,
    shortMeaningEn: doc.shortMeaningEn,
    detailedMeaningEn: doc.detailedMeaningEn,
    keywordsEn: doc.keywordsEn,
    loveMeaningEn: doc.loveMeaningEn,
    careerMeaningEn: doc.careerMeaningEn,
    financeMeaningEn: doc.financeMeaningEn,
    personalGrowthMeaningEn: doc.personalGrowthMeaningEn,
    yesNoExplanationEn: doc.yesNoExplanationEn,
    isActive: doc.isActive,
  };
}

export async function getActiveCards(): Promise<TarotCardData[]> {
  await connectDB();
  const cards = await TarotCard.find({ isActive: true }).sort({ number: 1 }).lean();
  if (cards.length !== 72 && cards.length > 0) {
    // still usable if some disabled
  }
  if (cards.length === 0) {
    throw new Error("Хөзөр олдсонгүй. Seed скрипт ажиллуулна уу.");
  }
  return cards.map((c) => toCardData(c as unknown as Parameters<typeof toCardData>[0]));
}

export async function createReading(input: CreateReadingInput) {
  assertQuestionAllowed(input.question);
  await connectDB();
  const cards = await getActiveCards();
  const shuffled = fisherYatesShuffle(cards);
  const accessToken = generateAccessToken();
  const readingId = generateReadingId();
  const prices = await getPrices();

  const paymentStatus: PaymentStatus =
    input.readingType === "yes-no" ? "not_required" : "pending";

  const reading = await Reading.create({
    readingId,
    accessTokenHash: hashToken(accessToken),
    readingType: input.readingType,
    userName: sanitizeText(input.userName, 80),
    age: input.age,
    birthDate: input.birthDate || undefined,
    birthTime: input.birthTime || undefined,
    gender: input.gender,
    email: input.email ? sanitizeText(input.email, 120).toLowerCase() : undefined,
    question: sanitizeText(input.question, 500),
    shuffledCardIds: shuffled.map((c) => c.id),
    selectedCardIds: [],
    paymentStatus,
    price: priceForType(input.readingType, prices),
    currency: prices.currency,
    emailHistory: [],
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
  });

  return {
    readingId: reading.readingId,
    accessToken,
    readingType: reading.readingType,
    shuffledCardIds: reading.shuffledCardIds,
    requiredCount: getRequiredCount(reading.readingType),
    positions: getPositions(reading.readingType),
  };
}

export async function assertReadingAccess(readingId: string, token: string) {
  await connectDB();
  const reading = await Reading.findOne({ readingId });
  if (!reading) throw new Error("Уншлага олдсонгүй");
  const hash = hashToken(token);
  if (!safeEqual(hash, reading.accessTokenHash)) {
    throw new Error("Хандах эрх буруу байна");
  }
  return reading;
}

export async function selectCards(
  readingId: string,
  token: string,
  cardIds: string[]
) {
  const reading = await assertReadingAccess(readingId, token);
  const needed = getRequiredCount(reading.readingType);

  const selectedIds = asStringIds(reading.selectedCardIds);
  const shuffledIds = asStringIds(reading.shuffledCardIds);
  if (selectedIds.length === needed && reading.freeResult) {
    return serializeReading(reading, token, false);
  }

  if (cardIds.length !== needed) {
    throw new Error(`Яг ${needed} хөзөр сонгоно уу`);
  }

  const unique = new Set(cardIds);
  if (unique.size !== cardIds.length) {
    throw new Error("Нэг хөзрийг дахин сонгох боломжгүй");
  }

  for (const id of cardIds) {
    if (!shuffledIds.includes(id)) {
      throw new Error("Буруу хөзөр сонгосон байна");
    }
  }

  reading.selectedCardIds = cardIds;
  await reading.save();
  return serializeReading(reading, token, false);
}

export async function generateReadingResult(readingId: string, token: string) {
  const reading = await assertReadingAccess(readingId, token);
  assertQuestionAllowed(reading.question);
  const needed = getRequiredCount(reading.readingType);
  const selectedIds = asStringIds(reading.selectedCardIds);

  if (selectedIds.length !== needed) {
    throw new Error("Эхлээд хөзрөө бүрэн сонгоно уу");
  }

  if (reading.freeResult) {
    return serializeReading(reading, token, true);
  }

  const allCards = await getActiveCards();
  const byId = new Map(allCards.map((c) => [c.id, c]));
  const selectedCards = selectedIds.map((id: string) => {
    const card = byId.get(id);
    if (!card) throw new Error("Хөзөр олдсонгүй");
    return card;
  });

  const result = await generateInterpretation({
    readingType: reading.readingType,
    userName: reading.userName,
    age: reading.age,
    gender: reading.gender,
    email: reading.email,
    question: reading.question,
    selectedCards,
    spreadPositions: [...getPositions(reading.readingType)],
  });

  const paywalled = reading.readingType !== "yes-no";
  const fullCardTexts =
    result.paidCardInterpretations?.length === selectedCards.length
      ? result.paidCardInterpretations
      : result.freeCardInterpretations;
  const fullCardTextsEn =
    result.paidCardInterpretationsEn?.length === selectedCards.length
      ? result.paidCardInterpretationsEn
      : result.freeCardInterpretationsEn || fullCardTexts;
  const fullOverall =
    result.questionAnswer || result.freeOverallInterpretation;
  const fullOverallEn =
    result.questionAnswerEn ||
    result.freeOverallInterpretationEn ||
    fullOverall;

  reading.freeResult = {
    freeCardInterpretations: paywalled
      ? fullCardTexts.map((t) => teaseText(t, 155))
      : result.freeCardInterpretations,
    freeCardInterpretationsEn: paywalled
      ? fullCardTextsEn.map((t) => teaseText(t, 155))
      : result.freeCardInterpretationsEn || result.freeCardInterpretations,
    freeOverallInterpretation: paywalled
      ? teaseText(fullOverall, 180)
      : result.freeOverallInterpretation,
    freeOverallInterpretationEn: paywalled
      ? teaseText(fullOverallEn, 180)
      : result.freeOverallInterpretationEn || result.freeOverallInterpretation,
    advice: paywalled
      ? teaseText(
          result.advice ||
            "Асуултаа дахин эргэцүүлж, нэг жижиг бодитой алхам хий.",
          110
        )
      : result.advice ||
        "Асуултаа дахин эргэцүүлж, нэг жижиг бодитой алхам хий. Яарахгүйгээр сонголтоо бодит нөхцөлтэйгээ нийцүүлээрэй.",
    adviceEn: paywalled
      ? teaseText(
          result.adviceEn ||
            "Sit with your question again, then take one small concrete step.",
          110
        )
      : result.adviceEn ||
        "Sit with your question again, then take one small concrete step. Align your choice with real conditions — no rush.",
    yesNoResult: result.yesNoResult,
    yesNoLabel: result.yesNoLabel,
    yesNoLabelEn: result.yesNoLabelEn,
  };

  if (paywalled) {
    reading.paidResult = {
      freeCardInterpretations: result.freeCardInterpretations,
      freeCardInterpretationsEn:
        result.freeCardInterpretationsEn || result.freeCardInterpretations,
      freeOverallInterpretation: result.freeOverallInterpretation,
      freeOverallInterpretationEn:
        result.freeOverallInterpretationEn ||
        result.freeOverallInterpretation,
      paidCardInterpretations: fullCardTexts,
      paidCardInterpretationsEn: fullCardTextsEn,
      paidOverallInterpretation:
        result.paidOverallInterpretation || fullOverall,
      paidOverallInterpretationEn:
        result.paidOverallInterpretationEn || fullOverallEn,
      advice: result.advice,
      adviceEn: result.adviceEn,
      challenge: result.challenge,
      challengeEn: result.challengeEn,
      possibleOutcome: result.possibleOutcome,
      possibleOutcomeEn: result.possibleOutcomeEn,
      cardConnections: result.cardConnections,
      cardConnectionsEn: result.cardConnectionsEn,
      questionAnswer: result.questionAnswer || fullOverall,
      questionAnswerEn: result.questionAnswerEn || fullOverallEn,
      hiddenInfluence: result.hiddenInfluence,
      hiddenInfluenceEn: result.hiddenInfluenceEn,
      emotionalGuidance: result.emotionalGuidance,
      emotionalGuidanceEn: result.emotionalGuidanceEn,
    };
  } else {
    reading.paymentStatus = "not_required";
  }

  await reading.save();
  return serializeReading(reading, token, true);
}

export async function getReading(readingId: string, token: string) {
  const reading = await assertReadingAccess(readingId, token);
  return serializeReading(reading, token, true);
}

export async function findReadingByRef(readingId: string, email: string) {
  await connectDB();
  const reading = await Reading.findOne({
    readingId: readingId.trim().toUpperCase(),
    email: email.trim().toLowerCase(),
  });
  if (!reading) {
    // try exact readingId without uppercasing fully
    const alt = await Reading.findOne({
      readingId: readingId.trim(),
      email: email.trim().toLowerCase(),
    });
    if (!alt) throw new Error("Таны уншлага олдсонгүй. Оруулсан мэдээллээ шалгана уу.");
    return alt;
  }
  return reading;
}

export async function serializeReading(
  reading: InstanceType<typeof Reading>,
  token?: string,
  includeCards = true
) {
  await enrichReadingEnglish(reading);

  const isPaid =
    reading.paymentStatus === "paid" || reading.paymentStatus === "not_required";

  let cards: TarotCardData[] = [];
  let selected: TarotCardData[] = [];

  if (includeCards) {
    const all = await getActiveCards();
    const byId = new Map(all.map((c) => [c.id, c]));
    const shuffledIds = asStringIds(reading.shuffledCardIds);
    const selectedIds = asStringIds(reading.selectedCardIds);

    cards = shuffledIds
      .map((id: string) => byId.get(id))
      .filter(Boolean) as TarotCardData[];

    // Public card list for selection: only backs needed — strip meanings for unpaid browse
    cards = cards.map((c) => ({
      id: c.id,
      number: c.number,
      slug: c.slug,
      nameMn: selectedIds.includes(c.id) ? c.nameMn : "",
      nameEn: selectedIds.includes(c.id) ? c.nameEn : "",
      imageUrl: selectedIds.includes(c.id) ? c.imageUrl : "",
      shortMeaningMn: "",
      detailedMeaningMn: "",
      keywordsMn: selectedIds.includes(c.id) ? c.keywordsMn : [],
      loveMeaningMn: "",
      careerMeaningMn: "",
      financeMeaningMn: "",
      personalGrowthMeaningMn: "",
      yesNoAnswer: "yes" as const,
      yesNoExplanationMn: "",
    }));

    selected = selectedIds
      .map((id: string) => byId.get(id))
      .filter(Boolean) as TarotCardData[];
  }

  const natalPayload = (() => {
    if (!reading.birthDate) {
      return { natal: null, natalReport: null };
    }
    try {
      const chart = computeNatalChart(reading.birthDate, reading.birthTime);
      return {
        natal: chart,
        // Natal is a separate paid product — never unlock via tarot payment
        natalReport: buildNatalPreview(chart),
      };
    } catch {
      return { natal: null, natalReport: null };
    }
  })();

  return {
    readingId: reading.readingId,
    accessToken: token,
    readingType: reading.readingType,
    userName: reading.userName,
    age: reading.age,
    birthDate: reading.birthDate || null,
    birthTime: reading.birthTime || null,
    natal: natalPayload.natal,
    natalReport: natalPayload.natalReport,
    gender: reading.gender,
    email: reading.email,
    question: reading.question,
    shuffledCardIds: asStringIds(reading.shuffledCardIds),
    selectedCardIds: asStringIds(reading.selectedCardIds),
    positions: getPositions(reading.readingType),
    requiredCount: getRequiredCount(reading.readingType),
    paymentStatus: reading.paymentStatus,
    price: reading.price,
    currency: reading.currency,
    createdAt: reading.createdAt,
    cards,
    selectedCards: selected.map((c) => ({
      id: c.id,
      number: c.number,
      slug: c.slug,
      nameMn: c.nameMn,
      nameEn: c.nameEn,
      imageUrl: c.imageUrl,
      keywordsMn: c.keywordsMn,
      // meanings only after selection for display of free short text via freeResult
      shortMeaningMn: c.shortMeaningMn,
    })),
    freeResult: reading.freeResult || null,
    paidResult:
      isPaid && reading.paidResult
        ? reading.paidResult
        : null,
    isPaid,
  };
}
