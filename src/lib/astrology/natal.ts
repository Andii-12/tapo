import {
  Body,
  Ecliptic,
  GeoVector,
  MakeTime,
} from "astronomy-engine";
import {
  degreeInSign,
  signFromLongitude,
  type ZodiacSign,
} from "./signs";
import { calcLifePath } from "./life-path";

export type PlanetId =
  | "sun"
  | "moon"
  | "mercury"
  | "venus"
  | "mars"
  | "jupiter"
  | "saturn";

export type PlanetPlacement = {
  id: PlanetId;
  nameEn: string;
  nameMn: string;
  glyph: string;
  longitude: number;
  degree: number;
  sign: ZodiacSign;
  roleEn: string;
  roleMn: string;
};

export type NatalChartResult = {
  birthDate: string;
  birthTime: string | null;
  timeNoteEn: string;
  timeNoteMn: string;
  lifePath: ReturnType<typeof calcLifePath>;
  sun: PlanetPlacement;
  moon: PlanetPlacement;
  venus: PlanetPlacement;
  planets: PlanetPlacement[];
};

const PLANETS: Array<{
  id: PlanetId;
  body: Body;
  nameEn: string;
  nameMn: string;
  glyph: string;
  roleEn: string;
  roleMn: string;
}> = [
  {
    id: "sun",
    body: Body.Sun,
    nameEn: "Sun",
    nameMn: "Нар",
    glyph: "☉",
    roleEn: "Core nature, self-expression",
    roleMn: "Үндсэн мөн чанар, өөрийн илэрхийлэл",
  },
  {
    id: "moon",
    body: Body.Moon,
    nameEn: "Moon",
    nameMn: "Сар",
    glyph: "☽",
    roleEn: "Feeling, inner needs, safety",
    roleMn: "Мэдрэмж, дотоод хэрэгцээ, аюулгүй байдал",
  },
  {
    id: "mercury",
    body: Body.Mercury,
    nameEn: "Mercury",
    nameMn: "Буд",
    glyph: "☿",
    roleEn: "Thought, communication, learning style",
    roleMn: "Бодол, харилцаа, суралцах арга",
  },
  {
    id: "venus",
    body: Body.Venus,
    nameEn: "Venus",
    nameMn: "Сугар",
    glyph: "♀",
    roleEn: "Love, attraction, values, beauty",
    roleMn: "Хайр, татагдал, үнэ цэнэ, гоо үзэсгэлэн",
  },
  {
    id: "mars",
    body: Body.Mars,
    nameEn: "Mars",
    nameMn: "Ангараг",
    glyph: "♂",
    roleEn: "Drive, action, energy",
    roleMn: "Хүсэл зориг, үйлдэл, энерги",
  },
  {
    id: "jupiter",
    body: Body.Jupiter,
    nameEn: "Jupiter",
    nameMn: "Бархасбадь",
    glyph: "♃",
    roleEn: "Growth, faith, opportunity",
    roleMn: "Өсөлт, итгэл, боломж",
  },
  {
    id: "saturn",
    body: Body.Saturn,
    nameEn: "Saturn",
    nameMn: "Санчир",
    glyph: "♄",
    roleEn: "Responsibility, boundaries, maturation",
    roleMn: "Хариуцлага, хил хязгаар, боловсрох",
  },
];

function parseBirthDateTime(
  birthDate: string,
  birthTime?: string | null
): { date: Date; usedDefaultTime: boolean } {
  const m = birthDate.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) throw new Error("Төрсөн огноо буруу байна");
  const year = Number(m[1]);
  const month = Number(m[2]);
  const day = Number(m[3]);

  let hour = 12;
  let minute = 0;
  let usedDefaultTime = true;

  if (birthTime && /^\d{1,2}:\d{2}$/.test(birthTime)) {
    const [h, min] = birthTime.split(":").map(Number);
    if (h >= 0 && h <= 23 && min >= 0 && min <= 59) {
      hour = h;
      minute = min;
      usedDefaultTime = false;
    }
  }

  // Asia/Ulaanbaatar ≈ UTC+8
  const utcMs = Date.UTC(year, month - 1, day, hour - 8, minute, 0);
  return { date: new Date(utcMs), usedDefaultTime };
}

function geocentricLongitude(body: Body, date: Date): number {
  const time = MakeTime(date);
  const vec = GeoVector(body, time, true);
  return Ecliptic(vec).elon;
}

function placement(
  meta: (typeof PLANETS)[number],
  date: Date
): PlanetPlacement {
  const longitude = geocentricLongitude(meta.body, date);
  const sign = signFromLongitude(longitude);
  return {
    id: meta.id,
    nameEn: meta.nameEn,
    nameMn: meta.nameMn,
    glyph: meta.glyph,
    longitude,
    degree: Math.round(degreeInSign(longitude) * 10) / 10,
    sign,
    roleEn: meta.roleEn,
    roleMn: meta.roleMn,
  };
}

export function computeNatalChart(
  birthDate: string,
  birthTime?: string | null
): NatalChartResult {
  const { date, usedDefaultTime } = parseBirthDateTime(birthDate, birthTime);
  const planets = PLANETS.map((p) => placement(p, date));
  const byId = Object.fromEntries(planets.map((p) => [p.id, p])) as Record<
    PlanetId,
    PlanetPlacement
  >;

  return {
    birthDate,
    birthTime: usedDefaultTime ? null : birthTime || null,
    timeNoteEn: usedDefaultTime
      ? "Birth time was not provided, so the Moon sign is estimated around midday. Add your time for finer accuracy."
      : "Birth time is calculated in the Ulaanbaatar time zone (UTC+8).",
    timeNoteMn: usedDefaultTime
      ? "Төрсөн цаг оруулаагүй тул Сарны ордыг өдрийн дунд үеэр (ойролцоогоор) тооцов. Илүү нарийвчлалтай бол цагаа нэмнэ үү."
      : "Төрсөн цагийг Улаанбаатарын цагийн бүсээр (UTC+8) тооцов.",
    lifePath: calcLifePath(birthDate),
    sun: byId.sun,
    moon: byId.moon,
    venus: byId.venus,
    planets,
  };
}
