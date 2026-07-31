import type { NatalChartResult, PlanetPlacement } from "./natal";
import {
  LIFE_PATH_DETAILED_EN,
  LIFE_PATH_DETAILED_MN,
  SIGN_DETAILED_EN,
  SIGN_DETAILED_MN,
  buildNatalSynthesis,
  buildNatalSynthesisEn,
  planetInSignDetailed,
  planetInSignDetailedEn,
} from "./meanings-detailed";
import { teaseText } from "@/lib/tarot/tease-text";

export type NatalPlanetDetail = PlanetPlacement & {
  detailedEn: string;
  detailedMn: string;
  signDetailedEn: string;
  signDetailedMn: string;
};

export type NatalFullReport = NatalChartResult & {
  lifePathDetailedEn: string;
  lifePathDetailedMn: string;
  sunDetailedEn: string;
  sunDetailedMn: string;
  moonDetailedEn: string;
  moonDetailedMn: string;
  venusDetailedEn: string;
  venusDetailedMn: string;
  planetDetails: NatalPlanetDetail[];
  synthesisEn: string;
  synthesisMn: string;
};

export type NatalPreviewReport = {
  birthDate: string;
  birthTime: string | null;
  timeNoteEn: string;
  timeNoteMn: string;
  lifePath: NatalChartResult["lifePath"];
  sun: Pick<
    PlanetPlacement,
    "glyph" | "nameEn" | "nameMn" | "degree" | "sign" | "roleEn" | "roleMn"
  >;
  moon: Pick<
    PlanetPlacement,
    "glyph" | "nameEn" | "nameMn" | "degree" | "sign" | "roleEn" | "roleMn"
  >;
  venus: Pick<
    PlanetPlacement,
    "glyph" | "nameEn" | "nameMn" | "degree" | "sign" | "roleEn" | "roleMn"
  >;
  previewTexts: {
    lifePathEn: string;
    lifePathMn: string;
    sunEn: string;
    sunMn: string;
    moonEn: string;
    moonMn: string;
    venusEn: string;
    venusMn: string;
  };
  locked: true;
};

export function buildNatalFullReport(natal: NatalChartResult): NatalFullReport {
  const planetDetails: NatalPlanetDetail[] = natal.planets.map((p) => ({
    ...p,
    signDetailedEn: SIGN_DETAILED_EN[p.sign.id],
    signDetailedMn: SIGN_DETAILED_MN[p.sign.id],
    detailedEn: planetInSignDetailedEn(
      p.id,
      p.sign.id,
      p.sign.nameEn,
      p.sign.nameMn
    ),
    detailedMn: planetInSignDetailed(
      p.id,
      p.sign.id,
      p.sign.nameEn,
      p.sign.nameMn
    ),
  }));

  const lifePathDetailedMn =
    LIFE_PATH_DETAILED_MN[natal.lifePath.number] ||
    LIFE_PATH_DETAILED_MN[9];
  const lifePathDetailedEn =
    LIFE_PATH_DETAILED_EN[natal.lifePath.number] ||
    LIFE_PATH_DETAILED_EN[9];

  return {
    ...natal,
    lifePathDetailedEn,
    lifePathDetailedMn,
    sunDetailedEn: planetDetails.find((p) => p.id === "sun")!.detailedEn,
    sunDetailedMn: planetDetails.find((p) => p.id === "sun")!.detailedMn,
    moonDetailedEn: planetDetails.find((p) => p.id === "moon")!.detailedEn,
    moonDetailedMn: planetDetails.find((p) => p.id === "moon")!.detailedMn,
    venusDetailedEn: planetDetails.find((p) => p.id === "venus")!.detailedEn,
    venusDetailedMn: planetDetails.find((p) => p.id === "venus")!.detailedMn,
    planetDetails,
    synthesisEn: buildNatalSynthesisEn({
      sunSign: natal.sun.sign.nameEn,
      moonSign: natal.moon.sign.nameEn,
      venusSign: natal.venus.sign.nameEn,
      lifePath: natal.lifePath.number,
      lifePathTitle: natal.lifePath.titleEn,
    }),
    synthesisMn: buildNatalSynthesis({
      sunSign: natal.sun.sign.nameEn,
      moonSign: natal.moon.sign.nameEn,
      venusSign: natal.venus.sign.nameEn,
      lifePath: natal.lifePath.number,
      lifePathTitle: natal.lifePath.titleMn,
    }),
  };
}

export function buildNatalPreview(natal: NatalChartResult): NatalPreviewReport {
  const full = buildNatalFullReport(natal);
  const slim = (p: PlanetPlacement) => ({
    glyph: p.glyph,
    nameEn: p.nameEn,
    nameMn: p.nameMn,
    degree: p.degree,
    sign: p.sign,
    roleEn: p.roleEn,
    roleMn: p.roleMn,
  });

  return {
    birthDate: natal.birthDate,
    birthTime: natal.birthTime,
    timeNoteEn: natal.timeNoteEn,
    timeNoteMn: natal.timeNoteMn,
    lifePath: natal.lifePath,
    sun: slim(natal.sun),
    moon: slim(natal.moon),
    venus: slim(natal.venus),
    previewTexts: {
      lifePathEn: teaseText(full.lifePathDetailedEn, 140),
      lifePathMn: teaseText(full.lifePathDetailedMn, 140),
      sunEn: teaseText(full.sunDetailedEn, 140),
      sunMn: teaseText(full.sunDetailedMn, 140),
      moonEn: teaseText(full.moonDetailedEn, 140),
      moonMn: teaseText(full.moonDetailedMn, 140),
      venusEn: teaseText(full.venusDetailedEn, 140),
      venusMn: teaseText(full.venusDetailedMn, 140),
    },
    locked: true,
  };
}

export { PLANET_VOICE_EN, PLANET_VOICE_MN } from "./meanings-detailed";
