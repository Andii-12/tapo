import type { ZodiacSignId } from "./signs";
import type { PlanetId } from "./natal";

export const SIGN_DETAILED_MN: Record<ZodiacSignId, string> = {
  aries:
    "Хонь ордын энерги шууд үйлдэл, зориг, шинэ эхлэлийг авчирна. Та эрсдэлтэй ч урагш тэмүүлэх, өөрийн замыг өөрөө нээх хандлагатай. Тэвчээр дутмаг байж болох тул эхлэлээ бодитой алхам болгох нь чухал.",
  taurus:
    "Үхэр ордын энерги тогтвортой байдал, үнэ цэнэ, мэдрэхүйн тав тухыг чухалчилна. Та удаан боловч баттай бүтээнэ. Өөрчлөлтөөс болгоомжилдог тул уян хатан байдлыг тэнцвэржүүлбэл илүү их боломж нээгдэнэ.",
  gemini:
    "Ихэр ордын энерги оюун ухаан, харилцаа, сониуч байдлыг идэвхжүүлнэ. Та мэдээлэл хурдан шингээж, олон сонирхолтой байж болно. Гүнзгий нэг чиглэлд төвлөрөхөд анхаарвал үр дүн тогтвортой болно.",
  cancer:
    "Мэлхий ордын энерги гэр, мэдрэмж, хамгаалах хүслийг хүчтэй болгоно. Та бусдын сэтгэлийг мэдэрч, ойр дотно холбоог эрхэмлэнэ. Хэт хамгаалалт эсвэл өнгөрсөнд наалдахаас болгоомжилж, өөрийгөө ч тэжээх хэрэгтэй.",
  leo:
    "Арслан ордын энерги бүтээлч илэрхийлэл, дулаан зүрх, өөрийгөө харуулах хүчийг өгнө. Та урам зориг өгч, манлайлах чадвартай. Хэт бахархал эсвэл хүлээн зөвшөөрөл хүсэхээс илүү жинхэнэ бүтээлд төвлөрвөл хүч нь цэвэр илэрнэ.",
  virgo:
    "Охин ордын энерги нарийвчлал, үйлчлэл, сайжруулах хүслийг авчирна. Та практик, ашигтай шийдэл олж чадна. Хэт шүүмжлэл, төгс байдлын дарамтыг зөөлрүүлж, «хангалттай сайн»-ыг хүлээн зөвшөөрөх нь чухал.",
  libra:
    "Жинлүүр ордын энерги тэнцвэр, гоо үзэсгэлэн, харилцааны эвийг эрхэмлэнэ. Та дипломат, шударга байхыг эрмэлзэнэ. Шийдвэр гаргахад удаашрал гарвал өөрийн хэрэгцээг ч тэнцүү жинлэх хэрэгтэй.",
  scorpio:
    "Хилэнц ордын энерги гүнзгий мэдрэмж, өөрчлөлт, нуугдмал хүчийг илэрхийлнэ. Та гадаргууг биш мөн чанарыг хардаг. Хяналт, сэжиг, хуучин шархыг суллаж чадвал хүч нь эдгээх, шинэчлэх чиглэлд ажиллана.",
  sagittarius:
    "Нум ордын энерги эрх чөлөө, итгэл, өргөн харааг өгнө. Та суралцах, аялах, утга учир хайхыг хүснэ. Хэт амлалт, сарнин байдлыг багасгаж, нэг том зорилгод чиглүүлбэл өсөлт тод болно.",
  capricorn:
    "Матар ордын энерги хариуцлага, бүтэц, урт хугацааны амжилтыг дэмжинэ. Та зорилгодоо тууштай. Хэт хатуу шаардлага, ажлын дарамтыг зөөлрүүлж, амьдралын баяр баясгаланг оруулбал тогтвортой байдал илүү эрүүл болно.",
  aquarius:
    "Бумба ордын энерги шинэчлэл, өвөрмөц бодол, нийгмийн харааг авчирна. Та хэвшмэл замаас өөрөөр сэтгэнэ. Хэт хол байдал эсвэл зөвхөн оюун ухаанаар амьдрахаас илүү зүрхний холбоог тэнцвэржүүлбэл нөлөө чинь хүчтэй болно.",
  pisces:
    "Загас ордын энерги зөн совин, энэрэл, уран сэтгэмжийг нээж өгнө. Та бусдын мэдрэмжийг шингээх чадвартай. Хил хязгаар тогтоож, бодит байдалтай холбоогоо хадгалбал зөн совин чинь төөрөгдөл биш удирдамж болно.",
};

export const SIGN_DETAILED_EN: Record<ZodiacSignId, string> = {
  aries:
    "Aries energy brings direct action, courage, and fresh starts. You tend to push forward and open your own path, even when risk is involved. Patience may run thin, so turn beginnings into concrete steps.",
  taurus:
    "Taurus energy prioritizes stability, value, and sensory comfort. You build slowly but solidly. Because change can feel threatening, balancing steadiness with flexibility opens more opportunity.",
  gemini:
    "Gemini energy activates mind, conversation, and curiosity. You absorb information quickly and may juggle many interests. Focusing one thread more deeply makes results more lasting.",
  cancer:
    "Cancer energy strengthens home, feeling, and the wish to protect. You sense others deeply and prize close bonds. Soften over-guarding or clinging to the past, and nourish yourself too.",
  leo:
    "Leo energy offers creative expression, warm heart, and presence. You can inspire and lead. Channel pride into authentic creation rather than chasing approval alone.",
  virgo:
    "Virgo energy brings precision, service, and the urge to improve. You find practical, useful solutions. Ease harsh self-critique and perfection pressure — “good enough” can be wise.",
  libra:
    "Libra energy seeks balance, beauty, and relational harmony. You aim for fairness and diplomacy. When decisions stall, weigh your own needs as carefully as others’.",
  scorpio:
    "Scorpio energy reveals deep feeling, transformation, and hidden power. You look past surfaces to essence. When control, suspicion, or old wounds loosen, the force heals and renews.",
  sagittarius:
    "Sagittarius energy gives freedom, faith, and wide vision. You want to learn, travel, and seek meaning. Fewer scattered promises and one clear aim make growth vivid.",
  capricorn:
    "Capricorn energy supports responsibility, structure, and long-term achievement. You stay with goals. Soften rigid standards and work pressure, and let joy into the structure.",
  aquarius:
    "Aquarius energy brings innovation, originality, and social vision. You think outside default paths. Balance cool distance with heart connection so your influence lands more fully.",
  pisces:
    "Pisces energy opens intuition, compassion, and imagination. You absorb others’ feelings easily. Clear boundaries and a link to reality turn intuition into guidance, not fog.",
};

export const LIFE_PATH_DETAILED_MN: Record<number, string> = {
  1: "Амьдралын зам 1 танд манлайлагчийн зам мөрийг өгчээ. Та бие даан шийдвэр гаргаж, шинэ зүйл эхлүүлэхээр төрсөн. Бусдын зөвшөөрлийг хүлээхээс илүү өөрийн дуу хоолойг олж, жижиг алхамаар ч гэсэн удирдах нь таны гол сургамж. Эго биш зоригоор манлайлаарай.",
  2: "Амьдралын зам 2 танд хамтын ажиллагаа, мэдрэмж, эвийн энергийг өгчээ. Та ганцаараа ялах биш хамтдаа бүтээхэд төрсөн. Гэхдээ бусдын төлөө өөрийгөө алдахгүй байх, хил хязгаараа мэдэх нь чухал. Таны хүч — зөөлөн боловч баттай холбоо үүсгэхэд оршино.",
  3: "Амьдралын зам 3 танд бүтээлч илэрхийлэл, баяр баясгалан, харилцааны авьяасыг өгчээ. Та үг, урлаг, санаагаараа бусдыг урамшуулна. Өөрийгөө жижигрүүлэх эсвэл зөвхөн зугаацуулагч болох гэсэн хязгаараас гарч, жинхэнэ бүтээлээ дэлхийд гаргаарай.",
  4: "Амьдралын зам 4 танд суурь тавих, сахилга бат, бодитой бүтцийн замыг өгчээ. Та удаан ч баттай байгуулна. Хэт хатуу дэглэм эсвэл аюулгүй байдлын төлөө мөрөөдлөө хориглохоос зайлсхийж, бүтэц дээрээ уян хатан байдлыг нэмээрэй.",
  5: "Амьдралын зам 5 танд өөрчлөлт, эрх чөлөө, туршлагын замыг өгчээ. Та нэг хэвээр байхыг тэсвэрлэдэггүй. Гэхдээ эрх чөлөөг хариуцлагатай сонголттой хослуулж чадвал адал явдал чинь сарнил биш өсөлт болно. Өөрчлөлтийг ухамсартайгаар удирдаарай.",
  6: "Амьдралын зам 6 танд халамж, хариуцлага, гэр бүл/харилцааны үйлчлэлийн замыг өгчээ. Та бусдыг тэжээх чадвартай. Харин зөвхөн бусдын төлөө амьдарч, өөрийн баяр баясгаланг мартахгүйн тулд өөртөө ч зай үлдээгээрэй. Жинхэнэ халамж хоёр талтай.",
  7: "Амьдралын зам 7 танд гүн шинжилгээ, оюун санаа, дотоод мэргэн ухааны замыг өгчээ. Та ганцаардалд суралцаж, үнэнийг хайна. Хэт тусгаарлагдах эсвэл зөвхөн оюунаар амьдрахаас илүү зөн совин ба бодит туршлагыг холбоорой. Таны хүч — гүн ойлголтод оршино.",
  8: "Амьдралын зам 8 танд хүч, амжилт, нөөцийг удирдах замыг өгчээ. Та материаллаг болон нөлөөллийн ертөнцөд суралцахаар төрсөн. Хүчийг хяналт биш хариуцлагаар ашиглах, мөнгө ба утга учирыг тэнцвэржүүлэх нь гол сорилт. Амжилт чинь зөвхөн тоо биш байх ёстой.",
  9: "Амьдралын зам 9 танд төгсгөл, энэрэл, өргөн зүрхний замыг өгчээ. Та хуучин бүлгүүдийг хааж, бусдад өгөхөөр төрсөн. Хэт өгөөмөр эсвэл дэлхийн зовлонг ганцаараа үүрэх гэснээс илүү хил хязгаартай энэрэл чухал. Таны төгсгөлүүд шинэ эхлэлүүдийг нээнэ.",
  11: "Мастер тоо 11 — гэрэлтүүлэгч. Та зөн совин, урам зориг, дээд мэдрэмжийн сувгаар төрсөн. Энэ зам хүчтэй боловч мэдрэмтгий. Өөрийгөө газардуулж, зөн совиноо бодитой алхам болгож сурах нь чухал. Та бусдыг гэрэлтүүлэхээр ирсэн, гэхдээ эхлээд өөрийн гэрлийг тэжээ.",
  22: "Мастер тоо 22 — их барилгачин. Та том мөрөөдлийг практик бүтэц болгох авьяастай. Энэ нь жижиг зорилго биш, нийтэд нөлөөлөх төсөл байж болно. Дарамт их тул алхам алхмаар явж, бие махбод, түншлэлээ тэжээх хэрэгтэй. Таны мөрөөдөл бодитой байж чадна.",
  33: "Мастер тоо 33 — мастер багш. Та энэрэл, заах, эдгээх энергийн өндөр давтамжтай. Бусдыг тэжээх хүсэл хүчтэй тул өөрийгөө хоослох эрсдэлтэй. Өөрийн хил хязгаар, амралт, баяр баясгаланг хамгаалснаар таны үйлчлэл жинхэнэ эдгээх хүч болно.",
};

export const LIFE_PATH_DETAILED_EN: Record<number, string> = {
  1: "Life Path 1 gives you a leader’s path. You were born to decide independently and start new things. Finding your voice — and leading even in small steps — matters more than waiting for permission. Lead with courage, not ego.",
  2: "Life Path 2 gives cooperation, sensitivity, and harmony. You were born to create with others, not only alone. Keep your boundaries so care does not erase you. Your strength is soft but steady connection.",
  3: "Life Path 3 gifts creative expression, joy, and communicative talent. You inspire through words, art, and ideas. Step past shrinking yourself or playing only entertainer — bring real work into the world.",
  4: "Life Path 4 offers foundation-building, discipline, and practical structure. You build slowly and solidly. Avoid rigid routine or blocking dreams for safety alone — add flexibility to your structure.",
  5: "Life Path 5 brings change, freedom, and experience. Staying identical forever rarely suits you. Pair freedom with responsible choice so adventure becomes growth, not scatter. Steer change consciously.",
  6: "Life Path 6 offers care, responsibility, and service in home and relating. You can nourish others well. Leave room for your own joy — true care has two sides.",
  7: "Life Path 7 gives deep study, spirit, and inner wisdom. You learn in solitude and seek truth. Connect intuition with lived experience rather than living only in the mind. Your power is deep understanding.",
  8: "Life Path 8 brings power, achievement, and stewardship of resources. You came to learn the material and influence worlds. Use power as responsibility, not control, and balance money with meaning. Success is more than numbers.",
  9: "Life Path 9 offers endings, compassion, and a wide heart. You came to close chapters and give outward. Boundaried compassion beats carrying the world’s weight alone. Your endings open new beginnings.",
  11: "Master number 11 — the illuminator. You were born as a channel of intuition, inspiration, and higher sensitivity. The path is strong and tender. Ground yourself and turn intuition into concrete steps. You came to light others — first feed your own light.",
  22: "Master number 22 — the master builder. You can turn large dreams into practical structure, often with public impact. Pressure is high, so move step by step and care for body and partnership. Your dream can become real.",
  33: "Master number 33 — the master teacher. You carry a high frequency of compassion, teaching, and healing. The urge to nourish others is strong, so emptiness is a risk. Protect boundaries, rest, and joy so service becomes true healing.",
};

export const PLANET_VOICE_MN: Record<PlanetId, string> = {
  sun: "Нар таны үндсэн мөн чанар, амьдралын гол чиглэл, өөрийгөө хэрхэн илэрхийлэхийг харуулна.",
  moon: "Сар таны мэдрэмж, дотоод хүүхэд, аюулгүй байдлын хэрэгцээ, өдөр тутмын сэтгэл хөдлөлийг илэрхийлнэ.",
  mercury: "Буд таны бодох, ярих, суралцах, мэдээлэл боловсруулах арга барилыг харуулна.",
  venus: "Сугар таны хайрлах арга, татагдал, гоо үзэсгэлэн, үнэ цэнэ, мөнгөнд хандах хандлагыг илэрхийлнэ.",
  mars: "Ангараг таны хүсэл зориг, уур хилэн, бэлгийн энерги, зорилгодоо хэрхэн тэмүүлэхийг харуулна.",
  jupiter: "Бархасбадь таны өсөлт, итгэл, аз, суралцах өргөн хараа, амьдралын утга учрыг илэрхийлнэ.",
  saturn: "Санчир таны хариуцлага, хил хязгаар, айдас, боловсрох сорилт, урт хугацааны бүтцийг харуулна.",
};

export const PLANET_VOICE_EN: Record<PlanetId, string> = {
  sun: "The Sun shows your core nature, life direction, and how you express yourself.",
  moon: "The Moon reveals feeling, the inner child, safety needs, and daily emotion.",
  mercury: "Mercury shows how you think, speak, learn, and process information.",
  venus: "Venus speaks to how you love, attraction, beauty, values, and money attitudes.",
  mars: "Mars shows drive, anger, sexual energy, and how you pursue goals.",
  jupiter: "Jupiter reveals growth, faith, luck, wide learning, and meaning.",
  saturn: "Saturn shows responsibility, boundaries, fear, maturing tests, and long structure.",
};

export function planetInSignDetailed(
  planetId: PlanetId,
  signId: ZodiacSignId,
  signNameEn: string,
  signNameMn: string
): string {
  const voice = PLANET_VOICE_MN[planetId];
  const signText = SIGN_DETAILED_MN[signId];
  return `${voice} ${signNameEn} (${signNameMn}) ордод байгаа нь дараах утгатай: ${signText}`;
}

export function planetInSignDetailedEn(
  planetId: PlanetId,
  signId: ZodiacSignId,
  signNameEn: string,
  signNameMn: string
): string {
  const voice = PLANET_VOICE_EN[planetId];
  const signText = SIGN_DETAILED_EN[signId];
  return `${voice} In ${signNameEn} (${signNameMn}), it carries this tone: ${signText}`;
}

export function buildNatalSynthesis(input: {
  sunSign: string;
  moonSign: string;
  venusSign: string;
  lifePath: number;
  lifePathTitle: string;
}): string {
  return [
    `Таны төрсөн зурхайн гол гурвал: Нар ${input.sunSign}, Сар ${input.moonSign}, Сугар ${input.venusSign}.`,
    `Нар таны гаднах илэрхийлэл, Сар дотоод мэдрэмж, Сугар хайр ба үнэ цэнийн хэлбэрийг харуулна. Эдгээр гурав хоорондоо нийцэж байвал амьдрал илүү урсгалтай, зөрчилтэй байвал дотоод ба гадаад хэрэгцээгээ ухамсарлан тэнцвэржүүлэх шаардлагатай.`,
    `Амьдралын зам ${input.lifePath} (${input.lifePathTitle}) нь таны урт хугацааны хичээл, зорилгын чиглэлийг нэмж өгнө. Зурхай «хэрхэн», амьдралын зам «ямар чиглэлээр өсөх»-ийг хамтдаа уншвал илүү бүрэн зураг гарна.`,
    `Энэ тайлбар нь астрологийн тусгал бөгөөд ирээдүйн баталгаатай таамаг биш. Эцсийн шийдвэрийг өөрийн бодит нөхцөл, ухамсарт сонголтод тулгуурлан гаргаарай.`,
  ].join("\n\n");
}

export function buildNatalSynthesisEn(input: {
  sunSign: string;
  moonSign: string;
  venusSign: string;
  lifePath: number;
  lifePathTitle: string;
}): string {
  return [
    `Your natal core trio: Sun in ${input.sunSign}, Moon in ${input.moonSign}, Venus in ${input.venusSign}.`,
    `The Sun is outer expression, the Moon is inner feeling, and Venus shapes love and values. When these agree, life can feel more fluid; when they tension, notice and balance inner and outer needs.`,
    `Life Path ${input.lifePath} (${input.lifePathTitle}) adds your longer lesson and growth direction. Read the chart as “how,” and life path as “toward what,” for a fuller picture.`,
    `This is reflective astrology, not a guaranteed forecast. Choose from your real conditions and conscious judgment.`,
  ].join("\n\n");
}
