import type {
  InterpretationInput,
  InterpretationResult,
  TarotCardData,
  YesNoAnswer,
} from "@/types";
import { config } from "@/lib/config";
import {
  meaningForTopicEn,
  meaningForTopicMn,
  positionEn,
  type Topic,
} from "@/lib/tarot/bilingual";

function pickTopicHint(question: string): Topic {
  const q = question.toLowerCase();
  if (
    /хайр|харилцаа|гэрлэлт|жинхэнэ|хань|дурлал|найз охин|найз залуу|охинтой|залуутэй|хос|үнэнч|салсан|салах|эвлэр|dating|girlfriend|boyfriend|crush|love|relationship/.test(
      q
    )
  ) {
    return "love";
  }
  if (
    /ажил|карьера|мэргэжил|бизнес|ажил төрөл|албан|төсөл|цалин|ажилд|компани|career|job|work/.test(
      q
    )
  ) {
    return "career";
  }
  if (
    /мөнгө|санхүү|орлого|өртэй|хөрөнгө|зээл|өр|хуримтлал|money|finance|debt/.test(
      q
    )
  ) {
    return "finance";
  }
  return "growth";
}

function topicLabelMn(topic: Topic): string {
  if (topic === "love") return "хайр дурлал / харилцаа";
  if (topic === "career") return "ажил төрөл / карьер";
  if (topic === "finance") return "санхүү / мөнгө";
  return "хувийн өсөлт / ерөнхий чиглэл";
}

function topicLabelEn(topic: Topic): string {
  if (topic === "love") return "love / relationships";
  if (topic === "career") return "career / work";
  if (topic === "finance") return "money / finances";
  return "personal growth / general path";
}

function cardRef(card: TarotCardData): string {
  return `«${card.nameEn}»`;
}

function usableOrSyntheticYesNo(card: TarotCardData): string {
  const en = (card.yesNoExplanationEn || "").trim();
  const cyr = (en.match(/[\u0400-\u04FF]/g) || []).length;
  const lat = (en.match(/[A-Za-z]/g) || []).length;
  if (en && lat > cyr) return en;
  return `${card.nameEn} offers a clear lean on this yes/no question — read it as guidance, not an absolute decree.`;
}

function cardLeadInMn(
  card: TarotCardData,
  position: string,
  topic: Topic
): string {
  const p = position.toLowerCase();
  const name = cardRef(card);

  if (topic === "love") {
    if (/одоо|байдал|нөхцөл/.test(p))
      return `Одоо хайр сэтгэл / харилцааны байдал ${name}-аар илэрхийлэгдэж байна.`;
    if (/саад|нөлөө|хүчин/.test(p))
      return `${name} хайр сэтгэлд нөлөөлж буй гол саад эсвэл хүчин зүйлийг харуулж байна.`;
    if (/шалтгаан/.test(p))
      return `${name} энэ нөхцөлийн үндсэн шалтгааныг сануулж байна.`;
    if (/зөвлөг/.test(p))
      return `${name} хайр сэтгэлийн талаар танд өгөх зөвлөмж болж байна.`;
    if (/үр дүн|чиглэл|цааш/.test(p))
      return `Цаашдын чиглэлд ${name} гарсан.`;
  }
  if (topic === "career") {
    if (/одоо|байдал|нөхцөл/.test(p))
      return `Одоо ажил төрлийн байдал ${name}-аар илэрхийлэгдэж байна.`;
    if (/саад|нөлөө|хүчин/.test(p))
      return `${name} ажил дээрх гол саадыг харуулж байна.`;
    if (/шалтгаан/.test(p))
      return `${name} асуудлын үндсэн шалтгааныг сануулж байна.`;
    if (/зөвлөг/.test(p)) return `${name} ажил төрлийн зөвлөмж болж байна.`;
    if (/үр дүн|чиглэл|цааш/.test(p))
      return `Цаашдын чиглэлд ${name} гарсан.`;
  }
  if (topic === "finance") {
    if (/одоо|байдал|нөхцөл/.test(p))
      return `Одоо санхүүгийн байдал ${name}-аар илэрхийлэгдэж байна.`;
    if (/саад|нөлөө|хүчин/.test(p))
      return `${name} санхүүгийн саад эсвэл эрсдэлийг харуулж байна.`;
    if (/үр дүн|чиглэл|цааш/.test(p))
      return `Цаашдын чиглэлд ${name} гарсан.`;
  }
  return `${name} «${position}» байрлалд гарсан.`;
}

function cardLeadInEn(
  card: TarotCardData,
  position: string,
  topic: Topic
): string {
  const p = position.toLowerCase();
  const name = cardRef(card);
  const posEn = positionEn(position);

  if (topic === "love") {
    if (/одоо|байдал|нөхцөл|current|present/.test(p) || /current|present/i.test(posEn))
      return `Right now, ${name} reflects the state of love or relationship.`;
    if (/саад|нөлөө|хүчин|obstacle|factor/.test(p))
      return `${name} points to a main obstacle or influence in matters of the heart.`;
    if (/шалтгаан|root|cause/.test(p))
      return `${name} highlights the deeper cause behind this situation.`;
    if (/зөвлөг|advice/.test(p))
      return `${name} offers guidance for your love life.`;
    if (/үр дүн|чиглэл|цааш|outcome|direction/.test(p))
      return `${name} speaks to the direction ahead.`;
  }
  if (topic === "career") {
    if (/одоо|байдал|нөхцөл/.test(p))
      return `Right now, ${name} reflects your work or career situation.`;
    if (/саад|нөлөө|хүчин/.test(p))
      return `${name} shows a key obstacle at work.`;
    if (/шалтгаан/.test(p))
      return `${name} points to the root of the issue.`;
    if (/зөвлөг/.test(p)) return `${name} offers career guidance.`;
    if (/үр дүн|чиглэл|цааш/.test(p))
      return `${name} speaks to the path ahead.`;
  }
  if (topic === "finance") {
    if (/одоо|байдал|нөхцөл/.test(p))
      return `Right now, ${name} reflects your financial situation.`;
    if (/саад|нөлөө|хүчин/.test(p))
      return `${name} highlights a financial obstacle or risk.`;
    if (/үр дүн|чиглэл|цааш/.test(p))
      return `${name} speaks to the direction ahead.`;
  }
  return `${name} appears in the “${posEn}” position.`;
}

type PositionRole =
  | "present"
  | "obstacle"
  | "cause"
  | "advice"
  | "outcome"
  | "influence"
  | "other";

function roleFromPosition(position: string): PositionRole {
  const p = position.toLowerCase();
  if (/одоо|байдал|нөхцөл|current|present/.test(p)) return "present";
  if (/саад|сорилт|obstacle|challenge/.test(p)) return "obstacle";
  if (/шалтгаан|root|cause/.test(p)) return "cause";
  if (/зөвлөг|advice/.test(p)) return "advice";
  if (/үр дүн|outcome|цааш|чиглэл|direction|ahead/.test(p)) return "outcome";
  if (/нуугдмал|hidden|нөлөө|хүчин|influence|factor/.test(p)) return "influence";
  return "other";
}

function firstSentences(text: string, max = 2): string {
  const t = text.replace(/\s+/g, " ").trim();
  if (!t) return "";
  const parts = t.split(/(?<=[.!?…])\s+/).filter(Boolean);
  return parts.slice(0, max).join(" ").trim();
}

/** Position-framed meaning so the same card does not read identically in every slot. */
function framedMeaningMn(
  card: TarotCardData,
  position: string,
  topic: Topic
): string {
  const core = firstSentences(meaningForTopicMn(card, topic), 2);
  const role = roleFromPosition(position);
  if (role === "present")
    return `${core} Энэ нь яг одоогийн нөхцөлийг нэрлэхэд тусална — буруутгахаас илүү бодитой зураглал.`;
  if (role === "obstacle")
    return `Саад тал: ${core} Шууд давахаас өмнө энэ хүчин зүйлийг тодорхойлох нь чухал.`;
  if (role === "cause")
    return `Үндсэн шалтгааны тал: ${core} Гадаргуу дээрх шинж тэмдгээс илүү гүн хэв маяг байж болно.`;
  if (role === "advice")
    return `Практик чиглэл: ${core} Одоо нэг жижиг, бодитой алхам сонгоорой.`;
  if (role === "outcome")
    return `Цаашдын хандлага: ${core} Үр дүн баталгаатай биш — чиглэл өөрчлөгдөж болно.`;
  if (role === "influence")
    return `Нөлөөллийн тал: ${core} Энэ хүчин зүйл шийдвэрт чимээгүй нөлөөлж байж болно.`;
  return core;
}

function framedMeaningEn(
  card: TarotCardData,
  position: string,
  topic: Topic
): string {
  const core = firstSentences(meaningForTopicEn(card, topic), 2);
  const role = roleFromPosition(position);
  if (role === "present")
    return `${core} Name the present clearly — a map, not a verdict.`;
  if (role === "obstacle")
    return `As an obstacle: ${core} Identify this factor before trying to push past it.`;
  if (role === "cause")
    return `As a deeper cause: ${core} Look beneath the surface pattern.`;
  if (role === "advice")
    return `As guidance: ${core} Choose one small, concrete next step.`;
  if (role === "outcome")
    return `Looking ahead: ${core} Direction, not a guaranteed result.`;
  if (role === "influence")
    return `As an influence: ${core} It may shape choices quietly.`;
  return core;
}

function syncedCardMn(
  card: TarotCardData,
  position: string,
  topic: Topic
): string {
  return `${cardLeadInMn(card, position, topic)} ${framedMeaningMn(card, position, topic)}`;
}

function syncedCardEn(
  card: TarotCardData,
  position: string,
  topic: Topic
): string {
  return `${cardLeadInEn(card, position, topic)} ${framedMeaningEn(card, position, topic)}`;
}

function stripKeywordTrailers(text: string): string {
  return text
    .replace(/\s*Түлхүүр үгс\s*[:：][^\n]*/gi, "")
    .replace(/\s*Keywords\s*[:：][^\n]*/gi, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function dedupeInterpretation(result: InterpretationResult): InterpretationResult {
  const stripArr = (arr?: string[]) =>
    arr?.map((t) => stripKeywordTrailers(t));
  return {
    ...result,
    freeCardInterpretations: stripArr(result.freeCardInterpretations) || [],
    freeCardInterpretationsEn: stripArr(result.freeCardInterpretationsEn),
    paidCardInterpretations: stripArr(result.paidCardInterpretations),
    paidCardInterpretationsEn: stripArr(result.paidCardInterpretationsEn),
    freeOverallInterpretation: stripKeywordTrailers(
      result.freeOverallInterpretation || ""
    ),
    freeOverallInterpretationEn: result.freeOverallInterpretationEn
      ? stripKeywordTrailers(result.freeOverallInterpretationEn)
      : result.freeOverallInterpretationEn,
    paidOverallInterpretation: result.paidOverallInterpretation
      ? stripKeywordTrailers(result.paidOverallInterpretation)
      : result.paidOverallInterpretation,
    paidOverallInterpretationEn: result.paidOverallInterpretationEn
      ? stripKeywordTrailers(result.paidOverallInterpretationEn)
      : result.paidOverallInterpretationEn,
    questionAnswer: result.questionAnswer
      ? stripKeywordTrailers(result.questionAnswer)
      : result.questionAnswer,
    questionAnswerEn: result.questionAnswerEn
      ? stripKeywordTrailers(result.questionAnswerEn)
      : result.questionAnswerEn,
    advice: result.advice ? stripKeywordTrailers(result.advice) : result.advice,
    adviceEn: result.adviceEn
      ? stripKeywordTrailers(result.adviceEn)
      : result.adviceEn,
    challenge: result.challenge
      ? stripKeywordTrailers(result.challenge)
      : result.challenge,
    challengeEn: result.challengeEn
      ? stripKeywordTrailers(result.challengeEn)
      : result.challengeEn,
    hiddenInfluence: result.hiddenInfluence
      ? stripKeywordTrailers(result.hiddenInfluence)
      : result.hiddenInfluence,
    hiddenInfluenceEn: result.hiddenInfluenceEn
      ? stripKeywordTrailers(result.hiddenInfluenceEn)
      : result.hiddenInfluenceEn,
  };
}

function buildDirectConclusionMn(input: InterpretationInput): string {
  const topic = pickTopicHint(input.question);
  const { selectedCards, question } = input;
  const first = selectedCards[0];
  const mid = selectedCards[1];
  const last = selectedCards[selectedCards.length - 1];
  const obstacle = selectedCards.length >= 5 ? selectedCards[1] : mid;
  const adviceCard =
    selectedCards.length >= 5 ? selectedCards[3] || last : last;
  const causeCard =
    selectedCards.length >= 5 ? selectedCards[2] : undefined;

  if (topic === "love") {
    return [
      `Шууд дүгнэлт: одоо ${cardRef(first)} харилцааны байдлыг,${obstacle ? ` ${cardRef(obstacle)} хаагдах ёстой бүлэг/саадыг,` : ""} ${cardRef(last)} цаашдын чиглэлийг илэрхийлнэ.`,
      causeCard
        ? `Гүнд ${cardRef(causeCard)} үндсэн шалтгааныг сануулна — гадаргуугийн зөрчилдөөнийг давтан шийдэхээс илүү үндсийг ойлгох хэрэгтэй.`
        : "",
      adviceCard && adviceCard !== last
        ? `Зөвлөмжийн гол цэг — ${cardRef(adviceCard)}: яарахгүйгээр мэдрэмжээ сонсож, нэг цэвэр алхам хий.`
        : "",
      `Тиймээс «${question}» гэдэгт: боломж бий, гэхдээ яг одоогийн бөглөөг ардаа орхисны дараа. Хугацаа баталгаатай биш. Энэ бол эргэцүүлэл, таамаглал биш.`,
    ]
      .filter(Boolean)
      .join("\n\n");
  }

  if (topic === "career") {
    return [
      `Шууд дүгнэлт: ажил төрөлд одоо ${cardRef(first)},${obstacle ? ` саад ${cardRef(obstacle)},` : ""}${causeCard ? ` үндэс ${cardRef(causeCard)},` : ""} цааш ${cardRef(last)}.`,
      adviceCard && adviceCard !== last
        ? `Зөвлөмж — ${cardRef(adviceCard)}: мэдээлэл цуглуулж, шууд шийдвэрээс илүү судалгаа хий.`
        : "",
      `«${question}» гэдэгт: ${cardRef(first)} → ${cardRef(last)} чиглэлээр шилжихийн тулд нэг бодитой төлөвлөгөө хэрэгтэй. Энэ бол баталгаатай таамаг биш.`,
    ]
      .filter(Boolean)
      .join("\n\n");
  }

  if (topic === "finance") {
    return [
      `Шууд дүгнэлт: одоо ${cardRef(first)},${obstacle ? ` анхаарах цэг ${cardRef(obstacle)},` : ""} цааш ${cardRef(last)}.`,
      `«${question}» гэдэгт болгоомжтой, төлөвлөгөөтэй алхахыг сануулж байна. Энэ нь мэргэжлийн санхүүгийн зөвлөгөө биш.`,
    ].join("\n\n");
  }

  return [
    `Шууд дүгнэлт: одоо ${cardRef(first)},${obstacle ? ` саад ${cardRef(obstacle)},` : ""} цаашдын чиглэл ${cardRef(last)}.`,
    `«${question}» асуултад эдгээр хөзөр бодитой чиглэл өгч байна — баталгаатай ирээдүй биш.`,
  ].join("\n\n");
}

function buildDirectConclusionEn(input: InterpretationInput): string {
  const topic = pickTopicHint(input.question);
  const { selectedCards, question } = input;
  const first = selectedCards[0];
  const mid = selectedCards[1];
  const last = selectedCards[selectedCards.length - 1];
  const obstacle = selectedCards.length >= 5 ? selectedCards[1] : mid;
  const adviceCard =
    selectedCards.length >= 5 ? selectedCards[3] || last : last;
  const causeCard =
    selectedCards.length >= 5 ? selectedCards[2] : undefined;

  if (topic === "love") {
    return [
      `Direct take: ${cardRef(first)} names the present in love,${obstacle ? ` ${cardRef(obstacle)} the chapter or block to face,` : ""} and ${cardRef(last)} the direction ahead.`,
      causeCard
        ? `Underneath, ${cardRef(causeCard)} points to a deeper cause — understand the root rather than only reacting to the surface.`
        : "",
      adviceCard && adviceCard !== last
        ? `Guidance — ${cardRef(adviceCard)}: listen calmly and take one clear step without forcing.`
        : "",
      `For “${question}”: possible, but after you release what is stuck now. Timing is not a calendar promise. Reflection, not a guaranteed prediction.`,
    ]
      .filter(Boolean)
      .join("\n\n");
  }

  if (topic === "career") {
    return [
      `Direct take: at work, ${cardRef(first)} is the present,${obstacle ? ` ${cardRef(obstacle)} the obstacle,` : ""}${causeCard ? ` ${cardRef(causeCard)} the deeper driver,` : ""} and ${cardRef(last)} the arc ahead.`,
      adviceCard && adviceCard !== last
        ? `Guidance — ${cardRef(adviceCard)}: gather information; research before a hard push.`
        : "",
      `For “${question}”: move from ${cardRef(first)} toward ${cardRef(last)} with one concrete plan. Not a guaranteed forecast.`,
    ]
      .filter(Boolean)
      .join("\n\n");
  }

  if (topic === "finance") {
    return [
      `Direct take: ${cardRef(first)} shows the present,${obstacle ? ` ${cardRef(obstacle)} what to watch,` : ""} and ${cardRef(last)} the direction ahead.`,
      `For “${question}”: move carefully and with a plan. This is not professional financial advice.`,
    ].join("\n\n");
  }

  return [
    `Direct take: present ${cardRef(first)},${obstacle ? ` obstacle ${cardRef(obstacle)},` : ""} direction ${cardRef(last)}.`,
    `These cards offer grounded guidance for “${question}” — not a guaranteed future.`,
  ].join("\n\n");
}

function buildQuestionAnswerMn(input: InterpretationInput): string {
  const { selectedCards, spreadPositions, userName, question } = input;
  const roles = selectedCards
    .map((card, i) => {
      const position = spreadPositions[i] || "Байрлал";
      return `${cardRef(card)} — ${position}`;
    })
    .join("; ");
  return [
    `${userName}, таны асуулт: «${question}».`,
    `Гарсан хөзрүүд: ${roles}.`,
    buildDirectConclusionMn(input),
  ].join("\n\n");
}

function buildQuestionAnswerEn(input: InterpretationInput): string {
  const { selectedCards, spreadPositions, userName, question } = input;
  const roles = selectedCards
    .map((card, i) => {
      const position = spreadPositions[i] || "Position";
      return `${cardRef(card)} — ${positionEn(position)}`;
    })
    .join("; ");
  return [
    `${userName}, your question: “${question}”.`,
    `Cards drawn: ${roles}.`,
    buildDirectConclusionEn(input),
  ].join("\n\n");
}

function buildFallback(input: InterpretationInput): InterpretationResult {
  const topic = pickTopicHint(input.question);
  const { selectedCards, spreadPositions, userName, question } = input;

  const freeCardInterpretations = selectedCards.map((card, i) =>
    syncedCardMn(card, spreadPositions[i] || "Байрлал", topic)
  );
  const freeCardInterpretationsEn = selectedCards.map((card, i) =>
    syncedCardEn(card, spreadPositions[i] || "Байрлал", topic)
  );

  const freeAdviceMn =
    "Асуултаа дахин эргэцүүлж, нэг жижиг бодитой алхам хий. Яарахгүйгээр сонголтоо бодит нөхцөлтэйгээ нийцүүлээрэй.";
  const freeAdviceEn =
    "Sit with your question again, then take one small concrete step. Align your choice with real conditions — no rush.";

  if (input.readingType === "yes-no") {
    const card = selectedCards[0];
    const answer: YesNoAnswer = card.yesNoAnswer;
    const explanationMn = [
      `${cardRef(card)} гарсан тул хариу: ${answer === "yes" ? "ТИЙМ" : "ҮГҮЙ"}.`,
      card.yesNoExplanationMn,
      firstSentences(meaningForTopicMn(card, topic), 1),
    ].join(" ");
    const explanationEn = [
      `${cardRef(card)} appears, so the answer leans ${answer === "yes" ? "YES" : "NO"}.`,
      usableOrSyntheticYesNo(card),
      firstSentences(meaningForTopicEn(card, topic), 1),
    ].join(" ");
    return {
      freeCardInterpretations: [explanationMn],
      freeCardInterpretationsEn: [explanationEn],
      freeOverallInterpretation: explanationMn,
      freeOverallInterpretationEn: explanationEn,
      advice: freeAdviceMn,
      adviceEn: freeAdviceEn,
      yesNoResult: answer,
      yesNoLabel: answer === "yes" ? "ТИЙМ" : "ҮГҮЙ",
      yesNoLabelEn: answer === "yes" ? "YES" : "NO",
      questionAnswer: `«${question}» — ${explanationMn}`,
      questionAnswerEn: `“${question}” — ${explanationEn}`,
    };
  }

  const first = selectedCards[0];
  const obstacleCard = selectedCards[1] || first;
  const causeCard =
    selectedCards.length >= 5 ? selectedCards[2] : selectedCards[0];
  const adviceCard =
    selectedCards.length >= 5
      ? selectedCards[3] || selectedCards[selectedCards.length - 1]
      : selectedCards[selectedCards.length - 1];
  const outcomeCard = selectedCards[selectedCards.length - 1];
  const last = outcomeCard;

  const questionAnswer = buildQuestionAnswerMn(input);
  const questionAnswerEn = buildQuestionAnswerEn(input);

  // Overall: synthesis only — do not re-list every card meaning (shown in card chapters)
  const freeOverallInterpretation = [
    `${userName}, «${question}» асуултад ${selectedCards.map((c) => cardRef(c)).join(", ")} гарлаа.`,
    buildDirectConclusionMn(input),
  ].join("\n\n");

  const freeOverallInterpretationEn = [
    `${userName}, for “${question}” the cards are ${selectedCards.map((c) => cardRef(c)).join(", ")}.`,
    buildDirectConclusionEn(input),
  ].join("\n\n");

  const paidCardInterpretations = selectedCards.map((card, i) => {
    const position = spreadPositions[i] || "Байрлал";
    return [
      syncedCardMn(card, position, topic),
      firstSentences(card.detailedMeaningMn.trim(), 3),
    ]
      .filter(Boolean)
      .join(" ");
  });

  const paidCardInterpretationsEn = selectedCards.map((card, i) => {
    const position = spreadPositions[i] || "Байрлал";
    const detailEn = (card.detailedMeaningEn || "").trim();
    const detailOk =
      detailEn &&
      (detailEn.match(/[A-Za-z]/g) || []).length >
        (detailEn.match(/[\u0400-\u04FF]/g) || []).length;
    return [
      syncedCardEn(card, position, topic),
      detailOk
        ? firstSentences(detailEn, 3)
        : `${card.nameEn} deepens the message: stay present with what is shifting and choose one honest next step.`,
    ].join(" ");
  });

  const names = selectedCards.map((c) => cardRef(c)).join(", ");
  const cardConnections = `${names} хамтдаа таны асуултын өөр өөр талыг гэрэлтүүлж байна. ${cardRef(first)} одоогийн байдлыг, ${cardRef(obstacleCard)} саад эсвэл нөлөөг,${selectedCards.length >= 5 ? ` ${cardRef(causeCard)} үндсэн шалтгааныг,` : ""} ${cardRef(last)} цаашдын чиглэлийг илэрхийлнэ. Нэг хөзрийн утгыг бүх байрлалд хуулахгүй — байрлал бүр өөр үүрэгтэй.`;
  const cardConnectionsEn = `Together, ${names} illuminate different sides of your question. ${cardRef(first)} shows the present, ${cardRef(obstacleCard)} the obstacle or influence,${selectedCards.length >= 5 ? ` ${cardRef(causeCard)} the deeper cause,` : ""} and ${cardRef(last)} the direction ahead. Do not treat every position as the same message — each role asks a different question.`;

  const challenge = `Гол сорилт — ${cardRef(obstacleCard)}. ${framedMeaningMn(obstacleCard, "Гол саад", topic)} Энэ саадыг нэрлэсний дараа л дараагийн алхам тодорхой болно.`;
  const challengeEn = `Main challenge — ${cardRef(obstacleCard)}. ${framedMeaningEn(obstacleCard, "Гол саад", topic)} Name the block first; clarity follows.`;

  const hiddenInfluence = `Нуугдмал нөлөө — ${cardRef(causeCard)}. ${framedMeaningMn(causeCard, selectedCards.length >= 5 ? "Үндсэн шалтгаан" : "Нөлөөлж буй хүчин зүйл", topic)} Энэ нь илт биш байж болох ч шийдвэрт чимээгүй нөлөөлнө.`;
  const hiddenInfluenceEn = `Hidden influence — ${cardRef(causeCard)}. ${framedMeaningEn(causeCard, selectedCards.length >= 5 ? "Үндсэн шалтгаан" : "Нөлөөлж буй хүчин зүйл", topic)} Quiet patterns can steer choices even when they are not obvious.`;

  const advice = `Зөвлөгөө — ${cardRef(adviceCard)}. ${framedMeaningMn(adviceCard, "Танд өгөх зөвлөгөө", topic)} Яг одоо нэг жижиг, бодитой алхам хий.`;
  const adviceEn = `Advice — ${cardRef(adviceCard)}. ${framedMeaningEn(adviceCard, "Танд өгөх зөвлөгөө", topic)} Take one small, concrete action now.`;

  const possibleOutcome = `Боломжит үр дүн — ${cardRef(outcomeCard)}. Хэрэв ${cardRef(first)}-ийн одоогийн нөхцөлийг ухамсарлаж, ${cardRef(obstacleCard)}-ийн саадтай нүүр тулж, ${cardRef(adviceCard)}-ийн зөвлөмжийг дагавал илүү тодорхой байдал руу шилжих боломжтой. Ирээдүй баталгаатай биш.`;
  const possibleOutcomeEn = `Possible outcome — ${cardRef(outcomeCard)}. If you acknowledge ${cardRef(first)}, face what ${cardRef(obstacleCard)} shows, and follow ${cardRef(adviceCard)}, clearer ground becomes more available. The future is not guaranteed.`;

  const paidOverallInterpretation = [
    questionAnswer,
    cardConnections,
    `Дүгнэлт: ${cardRef(first)} → ${cardRef(last)} чиглэлийг баримталж, нэг алхам сонго.`,
  ].join("\n\n");
  const paidOverallInterpretationEn = [
    questionAnswerEn,
    cardConnectionsEn,
    `Closing note: stay with the arc from ${cardRef(first)} toward ${cardRef(last)}, and choose one next step.`,
  ].join("\n\n");

  return {
    freeCardInterpretations,
    freeCardInterpretationsEn,
    freeOverallInterpretation,
    freeOverallInterpretationEn,
    paidCardInterpretations,
    paidCardInterpretationsEn,
    paidOverallInterpretation,
    paidOverallInterpretationEn,
    advice,
    adviceEn,
    challenge,
    challengeEn,
    possibleOutcome,
    possibleOutcomeEn,
    cardConnections,
    cardConnectionsEn,
    questionAnswer,
    questionAnswerEn,
    hiddenInfluence,
    hiddenInfluenceEn,
    emotionalGuidance: `Сэтгэл хөдлөлийн хувьд тайван байж, өөртөө эелдэг хандаарай. ${cardRef(last)} чиглэлийг дагахдаа яарах хэрэггүй.`,
    emotionalGuidanceEn: `Emotionally, stay steady and kind to yourself. There is no need to rush the path ${cardRef(last)} suggests.`,
  };
}

async function tryAiInterpretation(
  input: InterpretationInput
): Promise<InterpretationResult | null> {
  if (!config.ai.apiKey) return null;

  const topic = pickTopicHint(input.question);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 55_000);

  try {
    const prompt = {
      readingType: input.readingType,
      userName: input.userName,
      age: input.age,
      gender: input.gender,
      question: input.question,
      detectedTopic: topic,
      topicLabelMn: topicLabelMn(topic),
      topicLabelEn: topicLabelEn(topic),
      positions: input.spreadPositions,
      positionsEn: input.spreadPositions.map(positionEn),
      cards: input.selectedCards.map((c, i) => ({
        position: input.spreadPositions[i],
        positionEn: positionEn(input.spreadPositions[i] || ""),
        nameEn: c.nameEn,
        nameMn: c.nameMn,
        shortMeaningMn: c.shortMeaningMn,
        shortMeaningEn: c.shortMeaningEn || c.shortMeaningMn,
        detailedMeaningMn: c.detailedMeaningMn,
        detailedMeaningEn: c.detailedMeaningEn || c.detailedMeaningMn,
        keywordsMn: c.keywordsMn,
        keywordsEn: c.keywordsEn || c.keywordsMn,
        topicMeaningMn: meaningForTopicMn(c, topic),
        topicMeaningEn: meaningForTopicEn(c, topic),
        yesNoAnswer: c.yesNoAnswer,
        yesNoExplanationMn: c.yesNoExplanationMn,
        yesNoExplanationEn: c.yesNoExplanationEn || c.yesNoExplanationMn,
      })),
    };

    const system = [
      "You are a professional tarot interpreter writing BOTH English and Mongolian.",
      "Return ONLY JSON with these fields:",
      "MN: freeCardInterpretations (string[]), freeOverallInterpretation, paidCardInterpretations (string[]), paidOverallInterpretation, advice, challenge, possibleOutcome, cardConnections, questionAnswer, hiddenInfluence, emotionalGuidance, yesNoResult (yes|no optional), yesNoLabel (ТИЙМ|ҮГҮЙ optional).",
      "EN: freeCardInterpretationsEn (string[]), freeOverallInterpretationEn, paidCardInterpretationsEn (string[]), paidOverallInterpretationEn, adviceEn, challengeEn, possibleOutcomeEn, cardConnectionsEn, questionAnswerEn, hiddenInfluenceEn, emotionalGuidanceEn, yesNoLabelEn (YES|NO optional).",
      "",
      "BILINGUAL RULES:",
      "- Every MN field MUST have a matching EN field with the same meaning (not a machine-literal calque — natural English + natural Mongolian).",
      "- Arrays must be the same length.",
      "- Card names ALWAYS in English («Death», «Six of Cups»).",
      "",
      "SYNC TO THE QUESTION:",
      "- Interpret each card through the user's question topic (love/career/finance/growth).",
      "- Do NOT repeat the full question at the start of every card.",
      "- Mention the question mainly in overall / questionAnswer.",
      "",
      "NO REPETITION (critical):",
      "- Never append Keywords / Түлхүүр үгс lists — the UI already shows keywords.",
      "- freeOverall / paidOverall / questionAnswer must SYNTHESIZE — do NOT copy-paste the same sentences from freeCard* or paidCard*.",
      "- challenge, hiddenInfluence, advice, possibleOutcome must each use a DIFFERENT angle and preferably DIFFERENT cards from the spread (5-card: obstacle=pos2, cause=pos3, advice=pos4, outcome=pos5).",
      "- If the same card appears in two sections, rewrite the meaning for that ROLE (obstacle ≠ hidden cause ≠ advice). Never paste identical paragraphs.",
      "- Do not restate the full per-card interpretations inside the overall summary.",
      "",
      "LENGTH:",
      "- freeCard*: 3–5 sentences each language.",
      "- paidCard*: 6–10 sentences each language.",
      "- overall / questionAnswer: 5–9 sentences each language (synthesis only).",
      "",
      "Do not claim 100% future certainty. No medical/legal/dangerous financial advice.",
      "If the question violates safety policy, refuse politely in BOTH languages.",
    ].join("\n");

    const res = await fetch(config.ai.apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.ai.apiKey}`,
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: config.ai.model,
        temperature: 0.7,
        max_tokens: 8000,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: system },
          {
            role: "user",
            content:
              "Interpret this reading in English AND Mongolian. Return bilingual JSON.\n\n" +
              JSON.stringify(prompt),
          },
        ],
      }),
    });

    if (!res.ok) return null;
    const data = await res.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) return null;
    const parsed = JSON.parse(content) as InterpretationResult;
    if (
      !parsed.freeCardInterpretations?.length ||
      !parsed.freeOverallInterpretation
    ) {
      return null;
    }

    const fallback = buildFallback(input);

    // Fill missing EN from fallback so UI always has both languages
    if (!parsed.freeCardInterpretationsEn?.length) {
      parsed.freeCardInterpretationsEn = fallback.freeCardInterpretationsEn;
    }
    if (!parsed.freeOverallInterpretationEn?.trim()) {
      parsed.freeOverallInterpretationEn = fallback.freeOverallInterpretationEn;
    }
    if (!parsed.paidCardInterpretationsEn?.length) {
      parsed.paidCardInterpretationsEn =
        fallback.paidCardInterpretationsEn ||
        parsed.freeCardInterpretationsEn;
    }
    if (!parsed.paidOverallInterpretationEn?.trim()) {
      parsed.paidOverallInterpretationEn =
        fallback.paidOverallInterpretationEn ||
        parsed.freeOverallInterpretationEn;
    }
    parsed.adviceEn = parsed.adviceEn || fallback.adviceEn;
    parsed.challengeEn = parsed.challengeEn || fallback.challengeEn;
    parsed.possibleOutcomeEn =
      parsed.possibleOutcomeEn || fallback.possibleOutcomeEn;
    parsed.cardConnectionsEn =
      parsed.cardConnectionsEn || fallback.cardConnectionsEn;
    parsed.questionAnswerEn =
      parsed.questionAnswerEn || fallback.questionAnswerEn;
    parsed.hiddenInfluenceEn =
      parsed.hiddenInfluenceEn || fallback.hiddenInfluenceEn;
    parsed.emotionalGuidanceEn =
      parsed.emotionalGuidanceEn || fallback.emotionalGuidanceEn;

    if (!parsed.questionAnswer?.trim()) {
      parsed.questionAnswer = buildQuestionAnswerMn(input);
    }
    if (!parsed.questionAnswerEn?.trim()) {
      parsed.questionAnswerEn = buildQuestionAnswerEn(input);
    }

    const overallText = `${parsed.freeOverallInterpretation || ""} ${parsed.questionAnswer || ""}`;
    const loveAsk = topic === "love";
    const driftedToGrowth =
      loveAsk &&
      /хувийн өсөлт|ерөнхий чиглэл/.test(overallText) &&
      !/хайр|найз охин|найз залуу|харилцаа|дурлал/.test(overallText);
    if (driftedToGrowth || (loveAsk && overallText.length < 120)) {
      parsed.questionAnswer = buildQuestionAnswerMn(input);
      parsed.questionAnswerEn = buildQuestionAnswerEn(input);
      parsed.freeOverallInterpretation = parsed.questionAnswer;
      parsed.freeOverallInterpretationEn = parsed.questionAnswerEn;
      if (!parsed.paidOverallInterpretation?.trim()) {
        parsed.paidOverallInterpretation = parsed.questionAnswer;
      }
      if (!parsed.paidOverallInterpretationEn?.trim()) {
        parsed.paidOverallInterpretationEn = parsed.questionAnswerEn;
      }
    }

    return dedupeInterpretation(parsed);
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

function isMostlyCyrillic(text: string): boolean {
  const s = text || "";
  const cyr = (s.match(/[\u0400-\u04FF]/g) || []).length;
  const lat = (s.match(/[A-Za-z]/g) || []).length;
  if (cyr === 0 && lat === 0) return false;
  return cyr >= lat;
}

function hasUsableEnglish(text?: string | null): boolean {
  const t = (text || "").trim();
  if (t.length < 12) return false;
  return !isMostlyCyrillic(t);
}

function hasUsableEnglishList(
  list?: string[] | null,
  expectedLen?: number
): boolean {
  if (!list?.length) return false;
  if (expectedLen != null && list.length !== expectedLen) return false;
  return list.every((t) => hasUsableEnglish(t));
}

/** Always guarantee English fields exist (AI often returns MN-only). */
export function guaranteeEnglishFields(
  result: InterpretationResult,
  input: InterpretationInput
): InterpretationResult {
  const fallback = buildFallback(input);
  const n = input.selectedCards.length;

  const freeEn = hasUsableEnglishList(result.freeCardInterpretationsEn, n)
    ? result.freeCardInterpretationsEn!
    : fallback.freeCardInterpretationsEn!;

  const paidEn = hasUsableEnglishList(result.paidCardInterpretationsEn, n)
    ? result.paidCardInterpretationsEn!
    : fallback.paidCardInterpretationsEn || freeEn;

  return dedupeInterpretation({
    ...result,
    freeCardInterpretationsEn: freeEn,
    freeOverallInterpretationEn: hasUsableEnglish(
      result.freeOverallInterpretationEn
    )
      ? result.freeOverallInterpretationEn
      : fallback.freeOverallInterpretationEn,
    paidCardInterpretationsEn: paidEn,
    paidOverallInterpretationEn: hasUsableEnglish(
      result.paidOverallInterpretationEn
    )
      ? result.paidOverallInterpretationEn
      : fallback.paidOverallInterpretationEn ||
        fallback.freeOverallInterpretationEn,
    adviceEn: hasUsableEnglish(result.adviceEn)
      ? result.adviceEn
      : fallback.adviceEn,
    challengeEn: hasUsableEnglish(result.challengeEn)
      ? result.challengeEn
      : fallback.challengeEn,
    possibleOutcomeEn: hasUsableEnglish(result.possibleOutcomeEn)
      ? result.possibleOutcomeEn
      : fallback.possibleOutcomeEn,
    cardConnectionsEn: hasUsableEnglish(result.cardConnectionsEn)
      ? result.cardConnectionsEn
      : fallback.cardConnectionsEn,
    questionAnswerEn: hasUsableEnglish(result.questionAnswerEn)
      ? result.questionAnswerEn
      : fallback.questionAnswerEn,
    hiddenInfluenceEn: hasUsableEnglish(result.hiddenInfluenceEn)
      ? result.hiddenInfluenceEn
      : fallback.hiddenInfluenceEn,
    emotionalGuidanceEn: hasUsableEnglish(result.emotionalGuidanceEn)
      ? result.emotionalGuidanceEn
      : fallback.emotionalGuidanceEn,
    yesNoLabelEn:
      result.yesNoLabelEn ||
      (result.yesNoResult === "yes"
        ? "YES"
        : result.yesNoResult === "no"
          ? "NO"
          : fallback.yesNoLabelEn),
  });
}

export async function generateInterpretation(
  input: InterpretationInput
): Promise<InterpretationResult> {
  const ai = await tryAiInterpretation(input);
  let result = ai || buildFallback(input);

  if (input.readingType === "yes-no" && input.selectedCards[0]) {
    const answer = input.selectedCards[0].yesNoAnswer;
    result.yesNoResult = answer;
    result.yesNoLabel = answer === "yes" ? "ТИЙМ" : "ҮГҮЙ";
    result.yesNoLabelEn = answer === "yes" ? "YES" : "NO";
  }

  return dedupeInterpretation(guaranteeEnglishFields(result, input));
}
