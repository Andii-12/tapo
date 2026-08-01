/**
 * Generate lightweight WebP thumbnails from full-size PNG card art.
 * Run: npm run optimize:cards
 */
import fs from "fs";
import path from "path";
import sharp from "sharp";
import { CARD_THUMB_WIDTH } from "../lib/tarot/card-image";

const cardsDir = path.join(process.cwd(), "public", "cards");
const thumbsDir = path.join(cardsDir, "thumbs");

async function main() {
  fs.mkdirSync(thumbsDir, { recursive: true });

  const pngs = fs
    .readdirSync(cardsDir)
    .filter((f) => /^card-\d{3}\.png$/i.test(f))
    .sort();

  if (!pngs.length) {
    console.error("No card-*.png files found in public/cards");
    process.exit(1);
  }

  let totalIn = 0;
  let totalOut = 0;

  for (const file of pngs) {
    const input = path.join(cardsDir, file);
    const id = file.replace(/\.png$/i, "");
    const output = path.join(thumbsDir, `${id}.webp`);

    const inStat = fs.statSync(input);
    totalIn += inStat.size;

    await sharp(input)
      .rotate()
      .resize(CARD_THUMB_WIDTH, null, {
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: 78, effort: 4 })
      .toFile(output);

    totalOut += fs.statSync(output).size;
  }

  console.log(
    `Optimized ${pngs.length} cards → public/cards/thumbs/*.webp\n` +
      `  Before: ${(totalIn / 1024 / 1024).toFixed(1)} MB\n` +
      `  After:  ${(totalOut / 1024 / 1024).toFixed(1)} MB (${Math.round((1 - totalOut / totalIn) * 100)}% smaller)`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
