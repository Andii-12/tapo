import { jsonError, jsonOk } from "@/lib/api/response";
import { getActiveCards } from "@/services/reading.service";

export async function GET() {
  try {
    const cards = await getActiveCards();
    return jsonOk(
      cards.map((c) => ({
        id: c.id,
        number: c.number,
        slug: c.slug,
        nameMn: c.nameMn,
        nameEn: c.nameEn,
        imageUrl: c.imageUrl,
        keywordsMn: c.keywordsMn,
        keywordsEn: c.keywordsEn || [],
        shortMeaningMn: c.shortMeaningMn,
        detailedMeaningMn: c.detailedMeaningMn,
        loveMeaningMn: c.loveMeaningMn,
        careerMeaningMn: c.careerMeaningMn,
        financeMeaningMn: c.financeMeaningMn,
        personalGrowthMeaningMn: c.personalGrowthMeaningMn,
        yesNoAnswer: c.yesNoAnswer,
        yesNoExplanationMn: c.yesNoExplanationMn,
        shortMeaningEn: c.shortMeaningEn || "",
        detailedMeaningEn: c.detailedMeaningEn || "",
        loveMeaningEn: c.loveMeaningEn || "",
        careerMeaningEn: c.careerMeaningEn || "",
        financeMeaningEn: c.financeMeaningEn || "",
        personalGrowthMeaningEn: c.personalGrowthMeaningEn || "",
        yesNoExplanationEn: c.yesNoExplanationEn || "",
      }))
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Алдаа гарлаа";
    return jsonError(message, 500);
  }
}
