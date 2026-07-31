/**
 * Unique monochrome icon SVG markup for each tarot card (viewBox 0 0 100 100).
 * Each slug has its own geometric composition.
 */
export const CARD_ICON_PATHS: Record<string, string> = {
  "the-fool": `
    <circle cx="50" cy="42" r="14" fill="none" stroke="currentColor" stroke-width="1.5"/>
    <circle cx="50" cy="42" r="3" fill="currentColor"/>
    <path d="M35 70 Q50 55 65 70" fill="none" stroke="currentColor" stroke-width="1.5"/>
    <circle cx="72" cy="28" r="3" fill="none" stroke="currentColor"/>
    <path d="M28 28 l4 8 -8 0 z" fill="currentColor"/>`,
  "the-magician": `
    <rect x="30" y="22" width="40" height="8" fill="none" stroke="currentColor" stroke-width="1.5"/>
    <line x1="50" y1="30" x2="50" y2="72" stroke="currentColor" stroke-width="1.5"/>
    <circle cx="50" cy="48" r="10" fill="none" stroke="currentColor"/>
    <path d="M38 72 h24" stroke="currentColor" stroke-width="1.5"/>
    <circle cx="36" cy="40" r="2" fill="currentColor"/><circle cx="64" cy="40" r="2" fill="currentColor"/>`,
  "the-high-priestess": `
    <path d="M35 78 V30 Q50 18 65 30 V78" fill="none" stroke="currentColor" stroke-width="1.5"/>
    <circle cx="50" cy="42" r="8" fill="none" stroke="currentColor"/>
    <path d="M42 42 h16" stroke="currentColor"/>
    <circle cx="50" cy="22" r="4" fill="currentColor"/>
    <line x1="28" y1="78" x2="72" y2="78" stroke="currentColor"/>`,
  "the-empress": `
    <path d="M50 20 L58 38 H42 Z" fill="currentColor"/>
    <circle cx="50" cy="48" r="12" fill="none" stroke="currentColor" stroke-width="1.5"/>
    <path d="M32 78 Q50 58 68 78" fill="none" stroke="currentColor" stroke-width="1.5"/>
    <circle cx="50" cy="48" r="3" fill="currentColor"/>`,
  "the-emperor": `
    <rect x="34" y="28" width="32" height="40" fill="none" stroke="currentColor" stroke-width="1.5"/>
    <path d="M34 28 L50 16 L66 28" fill="none" stroke="currentColor" stroke-width="1.5"/>
    <line x1="42" y1="44" x2="58" y2="44" stroke="currentColor"/>
    <line x1="42" y1="54" x2="58" y2="54" stroke="currentColor"/>
    <rect x="28" y="68" width="44" height="6" fill="currentColor"/>`,
  "the-hierophant": `
    <path d="M50 18 L62 34 H38 Z" fill="none" stroke="currentColor" stroke-width="1.5"/>
    <rect x="40" y="34" width="20" height="28" fill="none" stroke="currentColor"/>
    <circle cx="50" cy="48" r="5" fill="currentColor"/>
    <path d="M30 78 L50 62 L70 78" fill="none" stroke="currentColor" stroke-width="1.5"/>
    <line x1="50" y1="18" x2="50" y2="12" stroke="currentColor"/>`,
  "the-lovers": `
    <circle cx="38" cy="40" r="10" fill="none" stroke="currentColor" stroke-width="1.5"/>
    <circle cx="62" cy="40" r="10" fill="none" stroke="currentColor" stroke-width="1.5"/>
    <path d="M38 52 Q50 68 62 52" fill="none" stroke="currentColor" stroke-width="1.5"/>
    <path d="M50 22 l2 6 6 1 -4 4 1 6 -5 -3 -5 3 1 -6 -4 -4 6 -1 z" fill="currentColor"/>`,
  "the-chariot": `
    <rect x="28" y="38" width="44" height="24" fill="none" stroke="currentColor" stroke-width="1.5"/>
    <circle cx="38" cy="68" r="8" fill="none" stroke="currentColor"/>
    <circle cx="62" cy="68" r="8" fill="none" stroke="currentColor"/>
    <path d="M50 20 V38" stroke="currentColor" stroke-width="1.5"/>
    <path d="M42 28 h16" stroke="currentColor"/>
    <circle cx="50" cy="50" r="4" fill="currentColor"/>`,
  strength: `
    <circle cx="50" cy="46" r="18" fill="none" stroke="currentColor" stroke-width="1.5"/>
    <path d="M38 46 Q50 30 62 46 Q50 62 38 46" fill="none" stroke="currentColor" stroke-width="1.5"/>
    <circle cx="50" cy="46" r="4" fill="currentColor"/>
    <path d="M50 22 V28 M50 64 V70" stroke="currentColor"/>`,
  "the-hermit": `
    <path d="M50 22 L50 55" stroke="currentColor" stroke-width="1.5"/>
    <circle cx="50" cy="30" r="6" fill="none" stroke="currentColor"/>
    <path d="M36 78 Q50 58 50 55 Q50 58 64 78" fill="none" stroke="currentColor" stroke-width="1.5"/>
    <circle cx="62" cy="38" r="5" fill="none" stroke="currentColor"/>
    <path d="M62 33 v10 M57 38 h10" stroke="currentColor"/>`,
  "wheel-of-fortune": `
    <circle cx="50" cy="50" r="28" fill="none" stroke="currentColor" stroke-width="1.5"/>
    <circle cx="50" cy="50" r="12" fill="none" stroke="currentColor"/>
    <line x1="50" y1="22" x2="50" y2="78" stroke="currentColor"/>
    <line x1="22" y1="50" x2="78" y2="50" stroke="currentColor"/>
    <line x1="30" y1="30" x2="70" y2="70" stroke="currentColor"/>
    <line x1="70" y1="30" x2="30" y2="70" stroke="currentColor"/>`,
  justice: `
    <line x1="50" y1="18" x2="50" y2="78" stroke="currentColor" stroke-width="1.5"/>
    <line x1="28" y1="36" x2="72" y2="36" stroke="currentColor" stroke-width="1.5"/>
    <circle cx="32" cy="48" r="8" fill="none" stroke="currentColor"/>
    <circle cx="68" cy="48" r="8" fill="none" stroke="currentColor"/>
    <path d="M42 78 h16" stroke="currentColor" stroke-width="1.5"/>`,
  "the-hanged-man": `
    <line x1="28" y1="22" x2="72" y2="22" stroke="currentColor" stroke-width="1.5"/>
    <line x1="50" y1="22" x2="50" y2="40" stroke="currentColor"/>
    <circle cx="50" cy="58" r="10" fill="none" stroke="currentColor" stroke-width="1.5"/>
    <path d="M50 68 V82" stroke="currentColor"/>
    <path d="M42 48 L50 40 L58 48" fill="none" stroke="currentColor"/>`,
  death: `
    <path d="M50 20 L58 42 H42 Z" fill="currentColor"/>
    <rect x="46" y="42" width="8" height="28" fill="currentColor"/>
    <path d="M30 50 H70" stroke="currentColor" stroke-width="1.5"/>
    <path d="M28 78 Q50 62 72 78" fill="none" stroke="currentColor"/>`,
  temperance: `
    <path d="M38 28 L50 48 L62 28" fill="none" stroke="currentColor" stroke-width="1.5"/>
    <path d="M38 72 L50 52 L62 72" fill="none" stroke="currentColor" stroke-width="1.5"/>
    <circle cx="50" cy="50" r="6" fill="currentColor"/>
    <line x1="28" y1="50" x2="42" y2="50" stroke="currentColor"/>
    <line x1="58" y1="50" x2="72" y2="50" stroke="currentColor"/>`,
  "the-devil": `
    <path d="M35 30 L50 18 L65 30" fill="none" stroke="currentColor" stroke-width="1.5"/>
    <circle cx="50" cy="42" r="12" fill="none" stroke="currentColor" stroke-width="1.5"/>
    <circle cx="45" cy="40" r="2" fill="currentColor"/><circle cx="55" cy="40" r="2" fill="currentColor"/>
    <path d="M44 48 Q50 52 56 48" fill="none" stroke="currentColor"/>
    <path d="M36 70 L50 54 L64 70" fill="none" stroke="currentColor" stroke-width="1.5"/>`,
  "the-tower": `
    <rect x="40" y="28" width="20" height="50" fill="none" stroke="currentColor" stroke-width="1.5"/>
    <path d="M36 28 H64" stroke="currentColor" stroke-width="1.5"/>
    <path d="M28 22 L50 36 L40 20" fill="none" stroke="currentColor"/>
    <path d="M72 24 L50 40 L62 18" fill="none" stroke="currentColor"/>
    <line x1="44" y1="42" x2="56" y2="42" stroke="currentColor"/>
    <line x1="44" y1="52" x2="56" y2="52" stroke="currentColor"/>`,
  "the-star": `
    <path d="M50 18 l4 12 12 2 -9 8 3 12 -10 -6 -10 6 3 -12 -9 -8 12 -2 z" fill="none" stroke="currentColor" stroke-width="1.5"/>
    <circle cx="28" cy="70" r="2" fill="currentColor"/>
    <circle cx="50" cy="78" r="2" fill="currentColor"/>
    <circle cx="72" cy="70" r="2" fill="currentColor"/>
    <path d="M30 62 Q50 72 70 62" fill="none" stroke="currentColor"/>`,
  "the-moon": `
    <path d="M58 22 A22 22 0 1 0 58 78 A16 16 0 1 1 58 22" fill="none" stroke="currentColor" stroke-width="1.5"/>
    <circle cx="62" cy="40" r="2" fill="currentColor"/>
    <circle cx="68" cy="55" r="1.5" fill="currentColor"/>
    <path d="M30 78 Q50 68 70 78" fill="none" stroke="currentColor"/>`,
  "the-sun": `
    <circle cx="50" cy="48" r="14" fill="none" stroke="currentColor" stroke-width="1.5"/>
    <circle cx="50" cy="48" r="5" fill="currentColor"/>
    <g stroke="currentColor" stroke-width="1.5">
      <line x1="50" y1="18" x2="50" y2="28"/><line x1="50" y1="68" x2="50" y2="78"/>
      <line x1="20" y1="48" x2="30" y2="48"/><line x1="70" y1="48" x2="80" y2="48"/>
      <line x1="28" y1="26" x2="35" y2="33"/><line x1="65" y1="63" x2="72" y2="70"/>
      <line x1="72" y1="26" x2="65" y2="33"/><line x1="35" y1="63" x2="28" y2="70"/>
    </g>`,
  judgement: `
    <path d="M50 18 L50 40" stroke="currentColor" stroke-width="1.5"/>
    <ellipse cx="50" cy="28" rx="16" ry="8" fill="none" stroke="currentColor"/>
    <circle cx="36" cy="62" r="7" fill="none" stroke="currentColor"/>
    <circle cx="50" cy="68" r="7" fill="none" stroke="currentColor"/>
    <circle cx="64" cy="62" r="7" fill="none" stroke="currentColor"/>
    <path d="M28 78 H72" stroke="currentColor"/>`,
  "the-world": `
    <circle cx="50" cy="50" r="26" fill="none" stroke="currentColor" stroke-width="1.5"/>
    <ellipse cx="50" cy="50" rx="12" ry="26" fill="none" stroke="currentColor"/>
    <ellipse cx="50" cy="50" rx="26" ry="10" fill="none" stroke="currentColor"/>
    <circle cx="50" cy="50" r="3" fill="currentColor"/>
    <circle cx="50" cy="20" r="3" fill="none" stroke="currentColor"/>
    <circle cx="50" cy="80" r="3" fill="none" stroke="currentColor"/>`,

  // Cups — clean U-shaped cup glyphs only
  "ace-of-cups": `
    <path d="M38 32 H62 V48 Q62 62 50 68 Q38 62 38 48 Z" fill="none" stroke="currentColor" stroke-width="1.5"/>
    <line x1="50" y1="68" x2="50" y2="78" stroke="currentColor" stroke-width="1.5"/>
    <line x1="40" y1="78" x2="60" y2="78" stroke="currentColor" stroke-width="1.5"/>
    <path d="M50 18 l3 8 8 1 -6 5 2 8 -7 -4 -7 4 2 -8 -6 -5 8 -1 z" fill="currentColor"/>`,
  "two-of-cups": `
    <path d="M26 34 H44 V48 Q44 58 35 62 Q26 58 26 48 Z" fill="none" stroke="currentColor" stroke-width="1.5"/>
    <path d="M56 34 H74 V48 Q74 58 65 62 Q56 58 56 48 Z" fill="none" stroke="currentColor" stroke-width="1.5"/>
    <path d="M35 72 Q50 82 65 72" fill="none" stroke="currentColor" stroke-width="1.5"/>
    <circle cx="50" cy="26" r="4" fill="currentColor"/>`,
  "three-of-cups": `
    <path d="M18 38 H34 V50 Q34 58 26 62 Q18 58 18 50 Z" fill="none" stroke="currentColor" stroke-width="1.4"/>
    <path d="M42 28 H58 V42 Q58 52 50 56 Q42 52 42 42 Z" fill="none" stroke="currentColor" stroke-width="1.4"/>
    <path d="M66 38 H82 V50 Q82 58 74 62 Q66 58 66 50 Z" fill="none" stroke="currentColor" stroke-width="1.4"/>
    <path d="M30 74 Q50 84 70 74" fill="none" stroke="currentColor" stroke-width="1.5"/>`,
  "four-of-cups": `
    <path d="M26 22 H44 V36 Q44 44 35 48 Q26 44 26 36 Z" fill="none" stroke="currentColor" stroke-width="1.4"/>
    <path d="M56 22 H74 V36 Q74 44 65 48 Q56 44 56 36 Z" fill="none" stroke="currentColor" stroke-width="1.4"/>
    <path d="M26 56 H44 V70 Q44 78 35 82 Q26 78 26 70 Z" fill="none" stroke="currentColor" stroke-width="1.4"/>
    <path d="M56 56 H74 V70 Q74 78 65 82 Q56 78 56 70 Z" fill="none" stroke="currentColor" stroke-width="1.4"/>`,
  "five-of-cups": `
    <path d="M18 24 H34 V36 Q34 44 26 48 Q18 44 18 36 Z" fill="none" stroke="currentColor" stroke-width="1.3" opacity="0.4" transform="rotate(-18 26 36)"/>
    <path d="M66 24 H82 V36 Q82 44 74 48 Q66 44 66 36 Z" fill="none" stroke="currentColor" stroke-width="1.3" opacity="0.4" transform="rotate(18 74 36)"/>
    <path d="M26 54 H44 V68 Q44 76 35 80 Q26 76 26 68 Z" fill="none" stroke="currentColor" stroke-width="1.4"/>
    <path d="M41 46 H59 V60 Q59 68 50 72 Q41 68 41 60 Z" fill="none" stroke="currentColor" stroke-width="1.4"/>
    <path d="M56 54 H74 V68 Q74 76 65 80 Q56 76 56 68 Z" fill="none" stroke="currentColor" stroke-width="1.4"/>`,
  "six-of-cups": `
    <path d="M20 26 H36 V38 Q36 46 28 50 Q20 46 20 38 Z" fill="none" stroke="currentColor" stroke-width="1.3"/>
    <path d="M42 18 H58 V30 Q58 38 50 42 Q42 38 42 30 Z" fill="none" stroke="currentColor" stroke-width="1.3"/>
    <path d="M64 26 H80 V38 Q80 46 72 50 Q64 46 64 38 Z" fill="none" stroke="currentColor" stroke-width="1.3"/>
    <path d="M20 56 H36 V68 Q36 76 28 80 Q20 76 20 68 Z" fill="none" stroke="currentColor" stroke-width="1.3"/>
    <path d="M42 50 H58 V62 Q58 70 50 74 Q42 70 42 62 Z" fill="none" stroke="currentColor" stroke-width="1.3"/>
    <path d="M64 56 H80 V68 Q80 76 72 80 Q64 76 64 68 Z" fill="none" stroke="currentColor" stroke-width="1.3"/>`,
  "seven-of-cups": `
    <path d="M18 22 H32 V32 Q32 40 25 43 Q18 40 18 32 Z" fill="none" stroke="currentColor" stroke-width="1.2"/>
    <path d="M36 16 H50 V26 Q50 34 43 37 Q36 34 36 26 Z" fill="none" stroke="currentColor" stroke-width="1.2"/>
    <path d="M54 16 H68 V26 Q68 34 61 37 Q54 34 54 26 Z" fill="none" stroke="currentColor" stroke-width="1.2"/>
    <path d="M72 22 H86 V32 Q86 40 79 43 Q72 40 72 32 Z" fill="none" stroke="currentColor" stroke-width="1.2"/>
    <path d="M26 50 H40 V60 Q40 68 33 71 Q26 68 26 60 Z" fill="none" stroke="currentColor" stroke-width="1.2"/>
    <path d="M44 46 H58 V56 Q58 64 51 67 Q44 64 44 56 Z" fill="none" stroke="currentColor" stroke-width="1.2"/>
    <path d="M62 50 H76 V60 Q76 68 69 71 Q62 68 62 60 Z" fill="none" stroke="currentColor" stroke-width="1.2"/>`,
  "eight-of-cups": `
    <path d="M22 20 H36 V30 Q36 38 29 41 Q22 38 22 30 Z" fill="none" stroke="currentColor" stroke-width="1.3"/>
    <path d="M40 20 H54 V30 Q54 38 47 41 Q40 38 40 30 Z" fill="none" stroke="currentColor" stroke-width="1.3"/>
    <path d="M58 20 H72 V30 Q72 38 65 41 Q58 38 58 30 Z" fill="none" stroke="currentColor" stroke-width="1.3"/>
    <path d="M22 46 H36 V56 Q36 64 29 67 Q22 64 22 56 Z" fill="none" stroke="currentColor" stroke-width="1.3"/>
    <path d="M40 46 H54 V56 Q54 64 47 67 Q40 64 40 56 Z" fill="none" stroke="currentColor" stroke-width="1.3"/>
    <path d="M58 46 H72 V56 Q72 64 65 67 Q58 64 58 56 Z" fill="none" stroke="currentColor" stroke-width="1.3"/>
    <path d="M40 70 H54 V80 Q54 88 47 91 Q40 88 40 80 Z" fill="none" stroke="currentColor" stroke-width="1.3"/>
    <path d="M74 42 L82 28" stroke="currentColor" stroke-width="1.5"/>
    <circle cx="84" cy="24" r="3.5" fill="none" stroke="currentColor" stroke-width="1.3"/>`,
  "nine-of-cups": `
    <path d="M16 26 H30 V36 Q30 44 23 47 Q16 44 16 36 Z" fill="none" stroke="currentColor" stroke-width="1.2"/>
    <path d="M34 20 H48 V30 Q48 38 41 41 Q34 38 34 30 Z" fill="none" stroke="currentColor" stroke-width="1.2"/>
    <path d="M52 16 H66 V26 Q66 34 59 37 Q52 34 52 26 Z" fill="none" stroke="currentColor" stroke-width="1.2"/>
    <path d="M70 20 H84 V30 Q84 38 77 41 Q70 38 70 30 Z" fill="none" stroke="currentColor" stroke-width="1.2"/>
    <path d="M24 50 H38 V60 Q38 68 31 71 Q24 68 24 60 Z" fill="none" stroke="currentColor" stroke-width="1.2"/>
    <path d="M42 46 H56 V56 Q56 64 49 67 Q42 64 42 56 Z" fill="none" stroke="currentColor" stroke-width="1.2"/>
    <path d="M60 50 H74 V60 Q74 68 67 71 Q60 68 60 60 Z" fill="none" stroke="currentColor" stroke-width="1.2"/>
    <path d="M34 72 H48 V82 Q48 90 41 93 Q34 90 34 82 Z" fill="none" stroke="currentColor" stroke-width="1.2"/>
    <path d="M52 70 H66 V80 Q66 88 59 91 Q52 88 52 80 Z" fill="none" stroke="currentColor" stroke-width="1.2"/>`,
  "ten-of-cups": `
    <path d="M50 14 l3 7 7 1 -5 4 1 7 -6 -3.5 -6 3.5 1 -7 -5 -4 7 -1 z" fill="currentColor"/>
    <path d="M18 40 H32 V50 Q32 58 25 61 Q18 58 18 50 Z" fill="none" stroke="currentColor" stroke-width="1.2"/>
    <path d="M36 34 H50 V44 Q50 52 43 55 Q36 52 36 44 Z" fill="none" stroke="currentColor" stroke-width="1.2"/>
    <path d="M54 34 H68 V44 Q68 52 61 55 Q54 52 54 44 Z" fill="none" stroke="currentColor" stroke-width="1.2"/>
    <path d="M72 40 H86 V50 Q86 58 79 61 Q72 58 72 50 Z" fill="none" stroke="currentColor" stroke-width="1.2"/>
    <path d="M26 64 H40 V74 Q40 82 33 85 Q26 82 26 74 Z" fill="none" stroke="currentColor" stroke-width="1.2"/>
    <path d="M44 60 H58 V70 Q58 78 51 81 Q44 78 44 70 Z" fill="none" stroke="currentColor" stroke-width="1.2"/>
    <path d="M62 64 H76 V74 Q76 82 69 85 Q62 82 62 74 Z" fill="none" stroke="currentColor" stroke-width="1.2"/>`,
  "page-of-cups": `
    <circle cx="50" cy="30" r="10" fill="none" stroke="currentColor" stroke-width="1.5"/>
    <path d="M42 42 L50 78 L58 42" fill="none" stroke="currentColor" stroke-width="1.5"/>
    <path d="M42 28 H58 V38 Q58 46 50 50 Q42 46 42 38 Z" fill="none" stroke="currentColor" stroke-width="1.3"/>`,
  "knight-of-cups": `
    <path d="M28 72 L50 32 L72 72" fill="none" stroke="currentColor" stroke-width="1.5"/>
    <circle cx="50" cy="28" r="8" fill="none" stroke="currentColor" stroke-width="1.5"/>
    <path d="M42 24 H58 V34 Q58 42 50 46 Q42 42 42 34 Z" fill="none" stroke="currentColor" stroke-width="1.3"/>
    <line x1="36" y1="56" x2="64" y2="56" stroke="currentColor"/>`,
  "queen-of-cups": `
    <path d="M34 78 V40 Q50 26 66 40 V78" fill="none" stroke="currentColor" stroke-width="1.5"/>
    <circle cx="50" cy="34" r="8" fill="none" stroke="currentColor" stroke-width="1.5"/>
    <path d="M42 30 H58 V40 Q58 48 50 52 Q42 48 42 40 Z" fill="none" stroke="currentColor" stroke-width="1.3"/>
    <path d="M50 16 l2 5 5 .5 -3.5 3 .8 5 -4.3 -2.5 -4.3 2.5 .8 -5 -3.5 -3 5 -.5 z" fill="currentColor"/>`,
  "king-of-cups": `
    <rect x="34" y="40" width="32" height="34" fill="none" stroke="currentColor" stroke-width="1.5"/>
    <path d="M34 40 L50 24 L66 40" fill="none" stroke="currentColor" stroke-width="1.5"/>
    <path d="M42 48 H58 V58 Q58 66 50 70 Q42 66 42 58 Z" fill="none" stroke="currentColor" stroke-width="1.3"/>
    <circle cx="50" cy="28" r="3" fill="currentColor"/>`,

  // Wands
  "ace-of-wands": `
    <line x1="50" y1="20" x2="50" y2="78" stroke="currentColor" stroke-width="2"/>
    <path d="M50 20 l6 10 -6 -3 -6 3 z" fill="currentColor"/>
    <path d="M42 36 l8 4 8 -4" fill="none" stroke="currentColor"/>
    <path d="M42 48 l8 4 8 -4" fill="none" stroke="currentColor"/>
    <circle cx="50" cy="64" r="4" fill="none" stroke="currentColor"/>`,
  "two-of-wands": `
    <line x1="36" y1="22" x2="36" y2="78" stroke="currentColor" stroke-width="1.5"/>
    <line x1="64" y1="22" x2="64" y2="78" stroke="currentColor" stroke-width="1.5"/>
    <circle cx="50" cy="48" r="10" fill="none" stroke="currentColor"/>
    <path d="M36 28 l4 6 -4 -2 -4 2 z" fill="currentColor"/>
    <path d="M64 28 l4 6 -4 -2 -4 2 z" fill="currentColor"/>`,
  "three-of-wands": `
    <line x1="30" y1="24" x2="30" y2="78" stroke="currentColor" stroke-width="1.5"/>
    <line x1="50" y1="18" x2="50" y2="78" stroke="currentColor" stroke-width="1.5"/>
    <line x1="70" y1="24" x2="70" y2="78" stroke="currentColor" stroke-width="1.5"/>
    <path d="M28 40 H72" stroke="currentColor"/>
    <circle cx="50" cy="40" r="3" fill="currentColor"/>`,
  "four-of-wands": `
    <line x1="30" y1="30" x2="30" y2="78" stroke="currentColor" stroke-width="1.5"/>
    <line x1="70" y1="30" x2="70" y2="78" stroke="currentColor" stroke-width="1.5"/>
    <line x1="40" y1="22" x2="40" y2="60" stroke="currentColor"/>
    <line x1="60" y1="22" x2="60" y2="60" stroke="currentColor"/>
    <path d="M30 36 H70 M30 48 H70" stroke="currentColor"/>
    <path d="M40 22 L50 14 L60 22" fill="none" stroke="currentColor"/>`,
  "five-of-wands": `
    <line x1="28" y1="70" x2="45" y2="25" stroke="currentColor" stroke-width="1.5"/>
    <line x1="40" y1="75" x2="70" y2="30" stroke="currentColor" stroke-width="1.5"/>
    <line x1="55" y1="78" x2="35" y2="28" stroke="currentColor" stroke-width="1.5"/>
    <line x1="65" y1="72" x2="50" y2="22" stroke="currentColor" stroke-width="1.5"/>
    <line x1="75" y1="68" x2="55" y2="25" stroke="currentColor" stroke-width="1.5"/>`,
  "six-of-wands": `
    <line x1="50" y1="18" x2="50" y2="78" stroke="currentColor" stroke-width="2"/>
    <circle cx="50" cy="32" r="10" fill="none" stroke="currentColor" stroke-width="1.5"/>
    <path d="M50 22 l3 7 7 1 -5 4 1 7 -6 -3.5 -6 3.5 1 -7 -5 -4 7 -1 z" fill="currentColor"/>
    <line x1="28" y1="55" x2="42" y2="45" stroke="currentColor"/>
    <line x1="72" y1="55" x2="58" y2="45" stroke="currentColor"/>
    <line x1="30" y1="70" x2="44" y2="58" stroke="currentColor"/>
    <line x1="70" y1="70" x2="56" y2="58" stroke="currentColor"/>`,
  "seven-of-wands": `
    <line x1="50" y1="18" x2="50" y2="55" stroke="currentColor" stroke-width="2"/>
    <line x1="28" y1="78" x2="42" y2="48" stroke="currentColor"/>
    <line x1="38" y1="80" x2="48" y2="52" stroke="currentColor"/>
    <line x1="48" y1="82" x2="50" y2="55" stroke="currentColor"/>
    <line x1="58" y1="80" x2="52" y2="52" stroke="currentColor"/>
    <line x1="68" y1="78" x2="58" y2="48" stroke="currentColor"/>
    <line x1="72" y1="70" x2="60" y2="45" stroke="currentColor"/>
    <path d="M50 18 l4 7 -4 -2 -4 2 z" fill="currentColor"/>`,
  "eight-of-wands": `
    <g stroke="currentColor" stroke-width="1.5">
      <line x1="20" y1="30" x2="80" y2="22"/><line x1="20" y1="38" x2="80" y2="30"/>
      <line x1="20" y1="46" x2="80" y2="38"/><line x1="20" y1="54" x2="80" y2="46"/>
      <line x1="20" y1="62" x2="80" y2="54"/><line x1="20" y1="70" x2="80" y2="62"/>
      <line x1="22" y1="78" x2="78" y2="70"/><line x1="24" y1="26" x2="76" y2="18"/>
    </g>`,
  "nine-of-wands": `
    <g stroke="currentColor" stroke-width="1.5">
      <line x1="22" y1="20" x2="22" y2="78"/><line x1="30" y1="20" x2="30" y2="78"/>
      <line x1="38" y1="20" x2="38" y2="78"/><line x1="46" y1="20" x2="46" y2="78"/>
      <line x1="54" y1="20" x2="54" y2="78"/><line x1="62" y1="20" x2="62" y2="78"/>
      <line x1="70" y1="20" x2="70" y2="78"/><line x1="78" y1="20" x2="78" y2="78"/>
    </g>
    <line x1="50" y1="35" x2="50" y2="65" stroke="currentColor" stroke-width="2.5"/>`,
  "ten-of-wands": `
    <g stroke="currentColor" stroke-width="1.4">
      <line x1="30" y1="78" x2="55" y2="20"/><line x1="34" y1="80" x2="58" y2="22"/>
      <line x1="38" y1="80" x2="60" y2="24"/><line x1="42" y1="82" x2="62" y2="26"/>
      <line x1="46" y1="82" x2="64" y2="28"/><line x1="50" y1="84" x2="66" y2="30"/>
      <line x1="54" y1="84" x2="68" y2="32"/><line x1="58" y1="84" x2="70" y2="34"/>
      <line x1="62" y1="82" x2="72" y2="36"/><line x1="66" y1="80" x2="74" y2="38"/>
    </g>`,
  "page-of-wands": `
    <circle cx="50" cy="30" r="10" fill="none" stroke="currentColor" stroke-width="1.5"/>
    <line x1="50" y1="40" x2="50" y2="78" stroke="currentColor" stroke-width="2"/>
    <path d="M50 48 l5 8 -5 -2 -5 2 z" fill="currentColor"/>
    <path d="M40 78 H60" stroke="currentColor"/>`,
  "knight-of-wands": `
    <path d="M25 72 L50 28 L75 72" fill="none" stroke="currentColor" stroke-width="1.5"/>
    <line x1="50" y1="28" x2="50" y2="18" stroke="currentColor" stroke-width="2"/>
    <path d="M50 18 l5 8 -5 -2 -5 2 z" fill="currentColor"/>
    <circle cx="50" cy="42" r="5" fill="none" stroke="currentColor"/>`,
  "queen-of-wands": `
    <path d="M34 78 V38 Q50 24 66 38 V78" fill="none" stroke="currentColor" stroke-width="1.5"/>
    <line x1="50" y1="38" x2="50" y2="70" stroke="currentColor" stroke-width="1.5"/>
    <path d="M50 24 l4 7 -4 -2 -4 2 z" fill="currentColor"/>
    <circle cx="50" cy="48" r="4" fill="none" stroke="currentColor"/>`,
  "king-of-wands": `
    <rect x="34" y="40" width="32" height="34" fill="none" stroke="currentColor" stroke-width="1.5"/>
    <path d="M34 40 L50 24 L66 40" fill="none" stroke="currentColor" stroke-width="1.5"/>
    <line x1="50" y1="44" x2="50" y2="68" stroke="currentColor" stroke-width="2"/>
    <path d="M50 28 l3 5 -3 -1.5 -3 1.5 z" fill="currentColor"/>`,

  // Swords
  "ace-of-swords": `
    <line x1="50" y1="18" x2="50" y2="72" stroke="currentColor" stroke-width="2"/>
    <path d="M42 28 L50 18 L58 28" fill="none" stroke="currentColor"/>
    <path d="M40 72 H60" stroke="currentColor" stroke-width="2"/>
    <circle cx="50" cy="48" r="8" fill="none" stroke="currentColor"/>
    <path d="M50 40 l2 5 5 .7 -3.5 3 .8 5 -4.3 -2.6 -4.3 2.6 .8 -5 -3.5 -3 5 -.7 z" fill="currentColor"/>`,
  "two-of-swords": `
    <line x1="22" y1="55" x2="78" y2="35" stroke="currentColor" stroke-width="1.5"/>
    <line x1="22" y1="35" x2="78" y2="55" stroke="currentColor" stroke-width="1.5"/>
    <circle cx="50" cy="45" r="12" fill="none" stroke="currentColor" stroke-width="1.5"/>
    <path d="M42 45 H58" stroke="currentColor"/>`,
  "three-of-swords": `
    <path d="M50 28 C62 28 70 42 50 68 C30 42 38 28 50 28 Z" fill="none" stroke="currentColor" stroke-width="1.5"/>
    <line x1="35" y1="22" x2="50" y2="72" stroke="currentColor" stroke-width="1.5"/>
    <line x1="50" y1="18" x2="50" y2="72" stroke="currentColor" stroke-width="1.5"/>
    <line x1="65" y1="22" x2="50" y2="72" stroke="currentColor" stroke-width="1.5"/>`,
  "four-of-swords": `
    <rect x="28" y="30" width="44" height="40" fill="none" stroke="currentColor" stroke-width="1.5"/>
    <line x1="36" y1="22" x2="50" y2="50" stroke="currentColor"/>
    <line x1="50" y1="18" x2="50" y2="50" stroke="currentColor"/>
    <line x1="64" y1="22" x2="50" y2="50" stroke="currentColor"/>
    <line x1="42" y1="78" x2="50" y2="58" stroke="currentColor"/>
    <circle cx="50" cy="50" r="3" fill="currentColor"/>`,
  "five-of-swords": `
    <line x1="50" y1="18" x2="50" y2="70" stroke="currentColor" stroke-width="2"/>
    <line x1="32" y1="28" x2="50" y2="55" stroke="currentColor" stroke-width="1.5"/>
    <line x1="68" y1="28" x2="50" y2="55" stroke="currentColor" stroke-width="1.5"/>
    <line x1="24" y1="75" x2="40" y2="55" stroke="currentColor" opacity="0.5"/>
    <line x1="76" y1="75" x2="60" y2="55" stroke="currentColor" opacity="0.5"/>
    <path d="M42 70 H58" stroke="currentColor" stroke-width="2"/>`,
  "six-of-swords": `
    <path d="M20 62 Q50 48 80 62" fill="none" stroke="currentColor" stroke-width="1.5"/>
    <path d="M28 62 L50 30 L72 62" fill="none" stroke="currentColor"/>
    <g stroke="currentColor">
      <line x1="38" y1="40" x2="38" y2="58"/><line x1="44" y1="36" x2="44" y2="58"/>
      <line x1="50" y1="32" x2="50" y2="58"/><line x1="56" y1="36" x2="56" y2="58"/>
      <line x1="62" y1="40" x2="62" y2="58"/><line x1="68" y1="44" x2="68" y2="58"/>
    </g>`,
  "seven-of-swords": `
    <g stroke="currentColor" stroke-width="1.4">
      <line x1="30" y1="75" x2="48" y2="25"/><line x1="36" y1="78" x2="52" y2="28"/>
      <line x1="42" y1="80" x2="55" y2="30"/><line x1="48" y1="80" x2="58" y2="32"/>
      <line x1="55" y1="78" x2="68" y2="35"/><line x1="62" y1="75" x2="74" y2="40"/>
      <line x1="70" y1="72" x2="80" y2="48"/>
    </g>
    <circle cx="50" cy="55" r="4" fill="currentColor"/>`,
  "eight-of-swords": `
    <circle cx="50" cy="48" r="12" fill="none" stroke="currentColor" stroke-width="1.5"/>
    <g stroke="currentColor">
      <line x1="22" y1="20" x2="40" y2="78"/><line x1="30" y1="18" x2="45" y2="80"/>
      <line x1="38" y1="16" x2="48" y2="82"/><line x1="46" y1="15" x2="50" y2="82"/>
      <line x1="54" y1="15" x2="50" y2="82"/><line x1="62" y1="16" x2="52" y2="82"/>
      <line x1="70" y1="18" x2="55" y2="80"/><line x1="78" y1="20" x2="60" y2="78"/>
    </g>`,
  "nine-of-swords": `
    <g stroke="currentColor">
      <line x1="20" y1="22" x2="80" y2="22"/><line x1="20" y1="30" x2="80" y2="30"/>
      <line x1="20" y1="38" x2="80" y2="38"/><line x1="20" y1="46" x2="80" y2="46"/>
      <line x1="20" y1="54" x2="80" y2="54"/><line x1="20" y1="62" x2="80" y2="62"/>
      <line x1="20" y1="70" x2="80" y2="70"/><line x1="20" y1="78" x2="80" y2="78"/>
      <line x1="50" y1="18" x2="50" y2="82" stroke-width="1.5"/>
    </g>`,
  "ten-of-swords": `
    <line x1="22" y1="62" x2="78" y2="62" stroke="currentColor" stroke-width="1.5"/>
    <g stroke="currentColor">
      <line x1="26" y1="20" x2="40" y2="62"/><line x1="32" y1="18" x2="44" y2="62"/>
      <line x1="38" y1="16" x2="48" y2="62"/><line x1="44" y1="15" x2="50" y2="62"/>
      <line x1="50" y1="14" x2="52" y2="62"/><line x1="56" y1="15" x2="54" y2="62"/>
      <line x1="62" y1="16" x2="56" y2="62"/><line x1="68" y1="18" x2="60" y2="62"/>
      <line x1="74" y1="20" x2="64" y2="62"/><line x1="78" y1="24" x2="68" y2="62"/>
    </g>`,
  "page-of-swords": `
    <circle cx="50" cy="30" r="10" fill="none" stroke="currentColor" stroke-width="1.5"/>
    <line x1="50" y1="40" x2="50" y2="72" stroke="currentColor" stroke-width="2"/>
    <path d="M42 48 L50 40 L58 48" fill="none" stroke="currentColor"/>
    <path d="M40 72 H60" stroke="currentColor" stroke-width="2"/>`,
  "knight-of-swords": `
    <path d="M22 72 L50 26 L78 72" fill="none" stroke="currentColor" stroke-width="1.5"/>
    <line x1="50" y1="26" x2="68" y2="18" stroke="currentColor" stroke-width="1.5"/>
    <path d="M68 18 L72 28 L62 24 Z" fill="currentColor"/>
    <line x1="35" y1="55" x2="65" y2="55" stroke="currentColor"/>`,
  "queen-of-swords": `
    <path d="M34 78 V38 Q50 24 66 38 V78" fill="none" stroke="currentColor" stroke-width="1.5"/>
    <line x1="50" y1="34" x2="50" y2="68" stroke="currentColor" stroke-width="1.5"/>
    <path d="M42 48 L50 38 L58 48" fill="none" stroke="currentColor"/>
    <circle cx="50" cy="26" r="4" fill="currentColor"/>`,
  "king-of-swords": `
    <rect x="34" y="40" width="32" height="34" fill="none" stroke="currentColor" stroke-width="1.5"/>
    <path d="M34 40 L50 24 L66 40" fill="none" stroke="currentColor" stroke-width="1.5"/>
    <line x1="50" y1="44" x2="50" y2="66" stroke="currentColor" stroke-width="2"/>
    <path d="M42 52 L50 44 L58 52" fill="none" stroke="currentColor"/>`,

  // Pentacles
  "ace-of-pentacles": `
    <circle cx="50" cy="42" r="20" fill="none" stroke="currentColor" stroke-width="1.5"/>
    <circle cx="50" cy="42" r="12" fill="none" stroke="currentColor"/>
    <path d="M50 34 l3 6 7 1 -5 4 1 7 -6 -3.5 -6 3.5 1 -7 -5 -4 7 -1 z" fill="currentColor"/>
    <line x1="50" y1="62" x2="50" y2="78" stroke="currentColor"/>
    <path d="M40 78 H60" stroke="currentColor"/>`,
  "two-of-pentacles": `
    <circle cx="36" cy="40" r="14" fill="none" stroke="currentColor" stroke-width="1.5"/>
    <circle cx="64" cy="60" r="14" fill="none" stroke="currentColor" stroke-width="1.5"/>
    <path d="M48 40 Q55 50 52 60" fill="none" stroke="currentColor" stroke-width="1.5"/>
    <circle cx="36" cy="40" r="4" fill="currentColor"/>
    <circle cx="64" cy="60" r="4" fill="currentColor"/>`,
  "three-of-pentacles": `
    <circle cx="50" cy="28" r="12" fill="none" stroke="currentColor"/>
    <circle cx="32" cy="62" r="12" fill="none" stroke="currentColor"/>
    <circle cx="68" cy="62" r="12" fill="none" stroke="currentColor"/>
    <path d="M50 40 L32 50 L68 50 Z" fill="none" stroke="currentColor" stroke-width="1.5"/>
    <circle cx="50" cy="28" r="3" fill="currentColor"/>`,
  "four-of-pentacles": `
    <circle cx="50" cy="28" r="11" fill="none" stroke="currentColor"/>
    <circle cx="28" cy="55" r="11" fill="none" stroke="currentColor"/>
    <circle cx="72" cy="55" r="11" fill="none" stroke="currentColor"/>
    <circle cx="50" cy="78" r="11" fill="none" stroke="currentColor"/>
    <rect x="42" y="42" width="16" height="20" fill="none" stroke="currentColor"/>
    <circle cx="50" cy="28" r="3" fill="currentColor"/>`,
  "five-of-pentacles": `
    <path d="M30 78 L50 30 L70 78" fill="none" stroke="currentColor" stroke-width="1.5"/>
    <circle cx="38" cy="48" r="8" fill="none" stroke="currentColor" opacity="0.5"/>
    <circle cx="62" cy="48" r="8" fill="none" stroke="currentColor" opacity="0.5"/>
    <circle cx="32" cy="68" r="7" fill="none" stroke="currentColor"/>
    <circle cx="50" cy="72" r="7" fill="none" stroke="currentColor"/>
    <circle cx="68" cy="68" r="7" fill="none" stroke="currentColor"/>`,
  "six-of-pentacles": `
    <circle cx="50" cy="28" r="10" fill="none" stroke="currentColor"/>
    <circle cx="28" cy="50" r="10" fill="none" stroke="currentColor"/>
    <circle cx="72" cy="50" r="10" fill="none" stroke="currentColor"/>
    <circle cx="36" cy="74" r="9" fill="none" stroke="currentColor"/>
    <circle cx="64" cy="74" r="9" fill="none" stroke="currentColor"/>
    <circle cx="50" cy="52" r="9" fill="none" stroke="currentColor"/>
    <line x1="50" y1="38" x2="50" y2="43" stroke="currentColor"/>
    <circle cx="50" cy="28" r="3" fill="currentColor"/>`,
  "seven-of-pentacles": `
    <line x1="30" y1="80" x2="50" y2="30" stroke="currentColor" stroke-width="1.5"/>
    <circle cx="50" cy="24" r="8" fill="none" stroke="currentColor"/>
    <circle cx="62" cy="36" r="8" fill="none" stroke="currentColor"/>
    <circle cx="70" cy="50" r="8" fill="none" stroke="currentColor"/>
    <circle cx="64" cy="66" r="8" fill="none" stroke="currentColor"/>
    <circle cx="40" cy="42" r="7" fill="none" stroke="currentColor"/>
    <circle cx="36" cy="58" r="7" fill="none" stroke="currentColor"/>
    <circle cx="42" cy="74" r="7" fill="none" stroke="currentColor"/>`,
  "eight-of-pentacles": `
    <g fill="none" stroke="currentColor">
      <circle cx="32" cy="28" r="9"/><circle cx="68" cy="28" r="9"/>
      <circle cx="32" cy="50" r="9"/><circle cx="68" cy="50" r="9"/>
      <circle cx="32" cy="72" r="9"/><circle cx="68" cy="72" r="9"/>
      <circle cx="50" cy="39" r="9"/><circle cx="50" cy="61" r="9"/>
    </g>
    <circle cx="50" cy="50" r="3" fill="currentColor"/>`,
};

export function getCardIconSvg(slug: string): string {
  return CARD_ICON_PATHS[slug] || CARD_ICON_PATHS["the-fool"];
}
