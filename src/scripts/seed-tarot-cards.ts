import "dotenv/config";
import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import { config } from "../lib/config";
import { TarotCard } from "../models/TarotCard";
import { Settings } from "../models/Settings";
import { getCardIconSvg } from "../lib/tarot/card-icons";
import cards from "../data/tarot-cards.mn.json";
import meaningsEn from "../data/tarot-meanings.en.json";

type EnMeaning = {
  shortMeaningEn: string;
  detailedMeaningEn: string;
  keywordsEn: string[];
  loveMeaningEn: string;
  careerMeaningEn: string;
  financeMeaningEn: string;
  personalGrowthMeaningEn: string;
  yesNoExplanationEn: string;
};

function cardSvg(number: number, nameEn: string, slug: string): string {
  const safeEn = nameEn.replace(/[<>&]/g, "");
  const icon = getCardIconSvg(slug)
    .replace(/currentColor/g, "#111111")
    .trim();

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="300" height="480" viewBox="0 0 300 480">
  <rect width="300" height="480" fill="#FAFAF8"/>
  <rect x="12" y="12" width="276" height="456" fill="none" stroke="#111" stroke-width="1.5"/>
  <rect x="20" y="20" width="260" height="440" fill="none" stroke="#111" stroke-width="0.5"/>
  <g transform="translate(75, 70) scale(1.5)">
    ${icon}
  </g>
  <text x="150" y="310" text-anchor="middle" font-family="Georgia, serif" font-size="14" fill="#111">${String(number).padStart(2, "0")}</text>
  <text x="150" y="345" text-anchor="middle" font-family="Georgia, serif" font-size="18" fill="#111">${safeEn}</text>
  <line x1="60" y1="400" x2="240" y2="400" stroke="#D8D8D8" stroke-width="1"/>
  <circle cx="150" cy="420" r="3" fill="#111"/>
</svg>`;
}

async function seed() {
  await mongoose.connect(config.mongodbUri);
  console.log("Connected to MongoDB");

  const cardsDir = path.join(process.cwd(), "public", "cards");
  fs.mkdirSync(cardsDir, { recursive: true });
  const enMap = meaningsEn as Record<string, EnMeaning>;

  let svgCount = 0;
  for (const card of cards) {
    const pad = String(card.number).padStart(3, "0");
    const pngPath = path.join(cardsDir, `card-${pad}.png`);
    // Keep hand-drawn / uploaded PNGs; only generate SVG fallbacks when no PNG exists
    if (fs.existsSync(pngPath)) continue;
    const svg = cardSvg(card.number, card.nameEn, card.slug);
    const file = path.join(cardsDir, `card-${pad}.svg`);
    fs.writeFileSync(file, svg, "utf8");
    svgCount += 1;
  }
  console.log(`Wrote ${svgCount} SVG card images (skipped existing PNGs)`);

  await TarotCard.deleteMany({});
  await TarotCard.insertMany(
    cards.map((c) => {
      const en = enMap[c.slug];
      return {
        cardId: c.id,
        number: c.number,
        slug: c.slug,
        nameMn: c.nameMn,
        nameEn: c.nameEn,
        imageUrl: c.imageUrl,
        shortMeaningMn: c.shortMeaningMn,
        detailedMeaningMn: c.detailedMeaningMn,
        keywordsMn: c.keywordsMn,
        loveMeaningMn: c.loveMeaningMn,
        careerMeaningMn: c.careerMeaningMn,
        financeMeaningMn: c.financeMeaningMn,
        personalGrowthMeaningMn: c.personalGrowthMeaningMn,
        yesNoAnswer: c.yesNoAnswer,
        yesNoExplanationMn: c.yesNoExplanationMn,
        shortMeaningEn: en?.shortMeaningEn || "",
        detailedMeaningEn: en?.detailedMeaningEn || "",
        keywordsEn: en?.keywordsEn || [],
        loveMeaningEn: en?.loveMeaningEn || "",
        careerMeaningEn: en?.careerMeaningEn || "",
        financeMeaningEn: en?.financeMeaningEn || "",
        personalGrowthMeaningEn: en?.personalGrowthMeaningEn || "",
        yesNoExplanationEn: en?.yesNoExplanationEn || "",
        isActive: true,
      };
    })
  );
  console.log(`Seeded ${cards.length} cards with EN+MN meanings`);

  await Settings.findOneAndUpdate(
    { key: "global" },
    {
      key: "global",
      threeCardPrice: config.payment.threeCardPrice,
      fiveCardPrice: config.payment.fiveCardPrice,
      currency: config.payment.currency,
    },
    { upsert: true }
  );

  await mongoose.disconnect();
  console.log("Done");
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
