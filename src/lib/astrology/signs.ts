export type ZodiacSignId =
  | "aries"
  | "taurus"
  | "gemini"
  | "cancer"
  | "leo"
  | "virgo"
  | "libra"
  | "scorpio"
  | "sagittarius"
  | "capricorn"
  | "aquarius"
  | "pisces";

export type ZodiacSign = {
  id: ZodiacSignId;
  nameEn: string;
  nameMn: string;
  symbol: string;
  elementEn: string;
  elementMn: string;
  keywordsEn: string[];
  keywordsMn: string[];
  shortEn: string;
  shortMn: string;
};

export const ZODIAC_SIGNS: ZodiacSign[] = [
  {
    id: "aries",
    nameEn: "Aries",
    nameMn: "Хонь",
    symbol: "♈",
    elementEn: "Fire",
    elementMn: "Гал",
    keywordsEn: ["courage", "beginnings", "impulse"],
    keywordsMn: ["зориг", "эхлэл", "импульс"],
    shortEn: "Bold beginnings, direct action, self-trust.",
    shortMn: "Зоригтой эхлэл, шууд үйлдэл, өөртөө итгэх итгэл.",
  },
  {
    id: "taurus",
    nameEn: "Taurus",
    nameMn: "Үхэр",
    symbol: "♉",
    elementEn: "Earth",
    elementMn: "Шороо",
    keywordsEn: ["stability", "value", "patience"],
    keywordsMn: ["тогтвортой", "үнэ цэнэ", "тэвчээр"],
    shortEn: "Stability, the senses, material security.",
    shortMn: "Тогтвортой байдал, мэдрэхүй, материаллаг аюулгүй байдал.",
  },
  {
    id: "gemini",
    nameEn: "Gemini",
    nameMn: "Ихэр",
    symbol: "♊",
    elementEn: "Air",
    elementMn: "Агаар",
    keywordsEn: ["communication", "curiosity", "flexibility"],
    keywordsMn: ["харилцаа", "сониуч", "уян хатан"],
    shortEn: "Ideas, conversation, quick learning.",
    shortMn: "Бодол санаа, харилцаа, хурдан суралцах чадвар.",
  },
  {
    id: "cancer",
    nameEn: "Cancer",
    nameMn: "Мэлхий",
    symbol: "♋",
    elementEn: "Water",
    elementMn: "Ус",
    keywordsEn: ["home", "care", "feeling"],
    keywordsMn: ["гэр", "халамж", "мэдрэмж"],
    shortEn: "Deep feeling, family, the urge to protect.",
    shortMn: "Гүн мэдрэмж, гэр бүл, хамгаалах хүсэл.",
  },
  {
    id: "leo",
    nameEn: "Leo",
    nameMn: "Арслан",
    symbol: "♌",
    elementEn: "Fire",
    elementMn: "Гал",
    keywordsEn: ["creative", "pride", "expression"],
    keywordsMn: ["бүтээлч", "бахархал", "илэрхийлэл"],
    shortEn: "Creative expression, warm heart, being seen.",
    shortMn: "Бүтээлч илэрхийлэл, дулаан зүрх, өөрийгөө харуулах.",
  },
  {
    id: "virgo",
    nameEn: "Virgo",
    nameMn: "Охин",
    symbol: "♍",
    elementEn: "Earth",
    elementMn: "Шороо",
    keywordsEn: ["precision", "service", "analysis"],
    keywordsMn: ["нарийвчлал", "үйлчлэл", "анализ"],
    shortEn: "Precision, practical help, the wish to improve.",
    shortMn: "Нарийвчлал, практик тусламж, сайжруулах хүсэл.",
  },
  {
    id: "libra",
    nameEn: "Libra",
    nameMn: "Жинлүүр",
    symbol: "♎",
    elementEn: "Air",
    elementMn: "Агаар",
    keywordsEn: ["balance", "beauty", "relationship"],
    keywordsMn: ["тэнцвэр", "гоо үзэсгэлэн", "харилцаа"],
    shortEn: "Balance, fairness, harmonious relating.",
    shortMn: "Тэнцвэр, шударга ёс, эв найрамдалтай харилцаа.",
  },
  {
    id: "scorpio",
    nameEn: "Scorpio",
    nameMn: "Хилэнц",
    symbol: "♏",
    elementEn: "Water",
    elementMn: "Ус",
    keywordsEn: ["depth", "transformation", "intensity"],
    keywordsMn: ["гүнзгий", "өөрчлөлт", "эрчим"],
    shortEn: "Deep bonds, transformation, hidden power.",
    shortMn: "Гүн холбоо, өөрчлөлт, нуугдмал хүч.",
  },
  {
    id: "sagittarius",
    nameEn: "Sagittarius",
    nameMn: "Нум",
    symbol: "♐",
    elementEn: "Fire",
    elementMn: "Гал",
    keywordsEn: ["freedom", "faith", "journey"],
    keywordsMn: ["эрх чөлөө", "итгэл", "аялал"],
    shortEn: "Wide vision, learning, free thinking.",
    shortMn: "Өргөн хараа, суралцах, эрх чөлөөтэй сэтгэх.",
  },
  {
    id: "capricorn",
    nameEn: "Capricorn",
    nameMn: "Матар",
    symbol: "♑",
    elementEn: "Earth",
    elementMn: "Шороо",
    keywordsEn: ["responsibility", "ambition", "structure"],
    keywordsMn: ["хариуцлага", "зорилго", "бүтэц"],
    shortEn: "Responsibility, long goals, discipline.",
    shortMn: "Хариуцлага, урт хугацааны зорилго, сахилга бат.",
  },
  {
    id: "aquarius",
    nameEn: "Aquarius",
    nameMn: "Бумба",
    symbol: "♒",
    elementEn: "Air",
    elementMn: "Агаар",
    keywordsEn: ["innovation", "originality", "community"],
    keywordsMn: ["шинэчлэл", "биеийн бус", "нийгэм"],
    shortEn: "Original thought, future-facing innovation.",
    shortMn: "Өвөрмөц бодол, ирээдүй рүү харсан шинэчлэл.",
  },
  {
    id: "pisces",
    nameEn: "Pisces",
    nameMn: "Загас",
    symbol: "♓",
    elementEn: "Water",
    elementMn: "Ус",
    keywordsEn: ["intuition", "unity", "dreams"],
    keywordsMn: ["зөн совин", "эв нэгдэл", "мөрөөдөл"],
    shortEn: "Intuition, compassion, imagination.",
    shortMn: "Зөн совин, энэрэл, уран сэтгэмж.",
  },
];

export function signFromLongitude(lonDeg: number): ZodiacSign {
  const normalized = ((lonDeg % 360) + 360) % 360;
  const index = Math.floor(normalized / 30) % 12;
  return ZODIAC_SIGNS[index];
}

export function degreeInSign(lonDeg: number): number {
  const normalized = ((lonDeg % 360) + 360) % 360;
  return normalized % 30;
}

export const LIFE_PATH_MEANINGS: Record<
  number,
  {
    titleEn: string;
    titleMn: string;
    shortEn: string;
    shortMn: string;
    keywordsEn: string[];
    keywordsMn: string[];
  }
> = {
  1: {
    titleEn: "The Leader",
    titleMn: "Манлайлагч",
    shortEn: "Independence, new beginnings, opening your own path.",
    shortMn: "Бие даасан байдал, шинэ эхлэл, өөрийн замыг нээх.",
    keywordsEn: ["leadership", "initiative", "confidence"],
    keywordsMn: ["манлайлал", "санаачилга", "итгэл"],
  },
  2: {
    titleEn: "The Diplomat",
    titleMn: "Дипломатч",
    shortEn: "Cooperation, sensitivity, balanced relating.",
    shortMn: "Хамтын ажиллагаа, мэдрэмж, тэнцвэртэй харилцаа.",
    keywordsEn: ["harmony", "partnership", "sensitivity"],
    keywordsMn: ["эв нэгдэл", "түншлэл", "эмзэглэл"],
  },
  3: {
    titleEn: "The Creator",
    titleMn: "Бүтээгч",
    shortEn: "Expression, creative joy, communication.",
    shortMn: "Илэрхийлэл, бүтээлч баяр баясгалан, харилцаа.",
    keywordsEn: ["art", "joy", "speech"],
    keywordsMn: ["урлаг", "баяр баясгалан", "яриа"],
  },
  4: {
    titleEn: "The Builder",
    titleMn: "Барилгачин",
    shortEn: "Laying foundations, discipline, practical structure.",
    shortMn: "Суурь тавих, сахилга бат, бодитой бүтэц.",
    keywordsEn: ["stability", "work", "order"],
    keywordsMn: ["тогтвортой", "хөдөлмөр", "дэг журам"],
  },
  5: {
    titleEn: "The Explorer",
    titleMn: "Судлаач",
    shortEn: "Change, freedom, new experience.",
    shortMn: "Өөрчлөлт, эрх чөлөө, шинэ туршлага.",
    keywordsEn: ["freedom", "adventure", "flexibility"],
    keywordsMn: ["эрх чөлөө", "адал явдал", "уян хатан"],
  },
  6: {
    titleEn: "The Guardian",
    titleMn: "Асран хамгаалагч",
    shortEn: "Responsibility, love, family, service.",
    shortMn: "Хариуцлага, хайр, гэр бүл, үйлчлэл.",
    keywordsEn: ["care", "home", "duty"],
    keywordsMn: ["халамж", "гэр", "үүрэг"],
  },
  7: {
    titleEn: "The Seeker",
    titleMn: "Мэргэн",
    shortEn: "Deep study, spirit, inner knowing.",
    shortMn: "Гүн шинжилгээ, оюун санаа, дотоод мэдлэг.",
    keywordsEn: ["reflection", "wisdom", "mystery"],
    keywordsMn: ["эргэцүүлэл", "мэргэн ухаан", "нууц"],
  },
  8: {
    titleEn: "The Power Holder",
    titleMn: "Хүчний эзэн",
    shortEn: "Achievement, resource stewardship, material power.",
    shortMn: "Амжилт, нөөц удирдлага, материаллаг хүч.",
    keywordsEn: ["authority", "success", "responsibility"],
    keywordsMn: ["эрх мэдэл", "амжилт", "хариуцлага"],
  },
  9: {
    titleEn: "The Humanitarian",
    titleMn: "Хүмүүнлэгч",
    shortEn: "Endings and beginnings, compassion, wide heart.",
    shortMn: "Төгсгөл ба эхлэл, энэрэл, өргөн зүрх.",
    keywordsEn: ["compassion", "completion", "vision"],
    keywordsMn: ["энэрэл", "төгсгөл", "өргөн хараа"],
  },
  11: {
    titleEn: "The Illuminator (Master 11)",
    titleMn: "Гэрэлтүүлэгч (Мастер 11)",
    shortEn: "Intuition, inspiration, higher sensitivity.",
    shortMn: "Зөн совин, урам зориг, дээд мэдрэмж.",
    keywordsEn: ["intuition", "inspiration", "light"],
    keywordsMn: ["зөн совин", "урам зориг", "гэрэл"],
  },
  22: {
    titleEn: "The Master Builder (Master 22)",
    titleMn: "Их барилгачин (Мастер 22)",
    shortEn: "Large vision, practical dreams, public impact.",
    shortMn: "Том зорилго, практик мөрөөдөл, нийтийн нөлөө.",
    keywordsEn: ["big projects", "structure", "influence"],
    keywordsMn: ["том төсөл", "бүтэц", "нөлөө"],
  },
  33: {
    titleEn: "The Master Teacher (Master 33)",
    titleMn: "Мастер багш (Мастер 33)",
    shortEn: "Teaching through compassion, service, healing energy.",
    shortMn: "Энэрэлээр заах, үйлчлэх, эдгээх энерги.",
    keywordsEn: ["teaching", "healing", "compassion"],
    keywordsMn: ["заах", "эдгээх", "энэрэл"],
  },
};
