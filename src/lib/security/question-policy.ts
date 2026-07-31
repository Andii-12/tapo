/**
 * Soft policy gate for questions we should not answer via tarot.
 * Returns a polite Mongolian refusal message, or null if OK.
 */

export const POLICY_REFUSAL_MN =
  "Уучлаарай, таны асуултад хариулж чадахгүй ээ. Энэ асуулт манай үйлчилгээний бодлогод нийцэхгүй, эсвэл эндээс зөвлөгөө өгөхөд тохиромжгүй байна. Та өөр зүйл асуугаарай — жишээ нь хайр сэтгэл, ажил төрөл, хувийн өсөлт гэх мэт.";

const DISALLOWED_PATTERNS: RegExp[] = [
  // Self-harm / suicide
  /амиа\s*хорих|өөрийгөө\s*алах|suicide|kill\s*myself|self[-\s]?harm|өөртөө\s*гэмтээ/,
  // Violence / crime how-to
  /хүн\s*алах|алах\s*арга|бомб|дэлбэрэх|зэвсэг\s*хийх|howto\s*kill|murder|assassinate/,
  /хулгай\s*хийх|хулгайлах\s*арга|хуурамч\s*баримт|мөнгө\s*угаах|money\s*launder/,
  // Illegal drugs production
  /мансууруулах\s*бодис\s*хийх|хар\s*тамхи\s*хийнэ|cook\s*meth|make\s*drugs/,
  // Sexual content involving minors
  /насанд\s*хүрээгүй.*(секс|порн|нүцгэн)|хүүхэд.*(секс|порн)|child\s*porn|underage\s*sex|csam/,
  // Explicit sexual requests (hardcore how-to / graphic) — keep light love Qs allowed
  /порн\s*хийх|секс\s*видео\s*авах|rape|бүлээн\s*хүчирхийлэл|хүчин\s*хийх/,
  // Medical diagnosis / emergency
  /онош\s*тавих|ямар\s*өвчинтэй|эмчилгээний\s*жор|үхэх\s*гэж\s*байна\s*уу|cancer\s*diagnose|prescribe\s*medicine/,
  /амиа\s*аврах|яаралтай\s*тусламж|зүрхний\s*ороолт|overdose/,
  // Strict legal representation
  /шүүхэд\s*ялах\s*арга|хуульчын\s*оронд|гэрээ\s*хуурамч|evidence\s*forge/,
  // Hate / extremism
  /үндэстэн\s*устгах|геноцид|terrorist\s*attack|террор\s*халдлага/,
  // Scam / fraud instruction
  /залилах\s*арга|скам\s*хийх|phishing|карт\s*хулгайлах/,
];

export function getQuestionPolicyViolation(question: string): string | null {
  const q = question.trim().toLowerCase();
  if (!q) return null;
  for (const re of DISALLOWED_PATTERNS) {
    if (re.test(q)) return POLICY_REFUSAL_MN;
  }
  return null;
}

export function assertQuestionAllowed(question: string): void {
  const msg = getQuestionPolicyViolation(question);
  if (msg) throw new Error(msg);
}
