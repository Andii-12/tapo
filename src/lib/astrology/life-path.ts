import { LIFE_PATH_MEANINGS } from "./signs";

function digitSum(n: number): number {
  return String(Math.abs(n))
    .split("")
    .reduce((a, d) => a + Number(d), 0);
}

function reduceLifePath(n: number): number {
  while (n > 9 && n !== 11 && n !== 22 && n !== 33) {
    n = digitSum(n);
  }
  return n;
}

/** Classic Pythagorean life-path from YYYY-MM-DD */
export function calcLifePath(birthDate: string): {
  number: number;
  titleEn: string;
  titleMn: string;
  shortEn: string;
  shortMn: string;
  keywordsEn: string[];
  keywordsMn: string[];
} {
  const m = birthDate.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) throw new Error("Төрсөн огноо буруу байна");
  const [, y, mo, d] = m;
  const total =
    digitSum(Number(y)) + digitSum(Number(mo)) + digitSum(Number(d));
  const number = reduceLifePath(total);
  const meaning = LIFE_PATH_MEANINGS[number] || LIFE_PATH_MEANINGS[9];
  return { number, ...meaning };
}
