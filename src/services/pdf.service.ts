import PDFDocument from "pdfkit";
import { existsSync } from "fs";
import { assertReadingAccess, getActiveCards } from "@/services/reading.service";
import { assertNatalAccess } from "@/services/natal.service";
import { computeNatalChart } from "@/lib/astrology/natal";
import { buildNatalFullReport } from "@/lib/astrology/report";
import { DOC } from "@/lib/brand-document";
import { bilingualBlock, positionLabel } from "@/lib/tarot/bilingual";
import { positionsForType } from "@/types";

type PdfFonts = { regular: string; bold: string };

function resolveFonts(): PdfFonts {
  const pairs: Array<[string, string]> = [
    ["C:\\Windows\\Fonts\\arial.ttf", "C:\\Windows\\Fonts\\arialbd.ttf"],
    ["C:\\Windows\\Fonts\\segoeui.ttf", "C:\\Windows\\Fonts\\segoeuib.ttf"],
    [
      "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
      "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
    ],
    [
      "/System/Library/Fonts/Supplemental/Arial Unicode.ttf",
      "/System/Library/Fonts/Supplemental/Arial Unicode.ttf",
    ],
  ];
  for (const [regular, bold] of pairs) {
    if (existsSync(regular)) {
      return { regular, bold: existsSync(bold) ? bold : regular };
    }
  }
  return { regular: "Helvetica", bold: "Helvetica-Bold" };
}

function createDoc() {
  const doc = new PDFDocument({
    margin: 0,
    size: "A4",
    bufferPages: true,
    info: {
      Title: "ТАРО",
      Author: "ТАРО",
    },
  });
  const fonts = resolveFonts();
  const custom = fonts.regular !== "Helvetica" && existsSync(fonts.regular);
  if (custom) {
    try {
      doc.registerFont("Body", fonts.regular);
      doc.registerFont("BodyBold", fonts.bold);
      (doc as PDFKit.PDFDocument & { __body?: string; __bold?: string }).__body =
        "Body";
      (doc as PDFKit.PDFDocument & { __body?: string; __bold?: string }).__bold =
        "BodyBold";
    } catch {
      (doc as PDFKit.PDFDocument & { __body?: string; __bold?: string }).__body =
        "Helvetica";
      (doc as PDFKit.PDFDocument & { __body?: string; __bold?: string }).__bold =
        "Helvetica-Bold";
    }
  } else {
    (doc as PDFKit.PDFDocument & { __body?: string; __bold?: string }).__body =
      "Helvetica";
    (doc as PDFKit.PDFDocument & { __body?: string; __bold?: string }).__bold =
      "Helvetica-Bold";
  }
  return doc;
}

function bodyFont(doc: PDFKit.PDFDocument) {
  return (
    (doc as PDFKit.PDFDocument & { __body?: string }).__body || "Helvetica"
  );
}

function boldFont(doc: PDFKit.PDFDocument) {
  return (
    (doc as PDFKit.PDFDocument & { __bold?: string }).__bold || "Helvetica-Bold"
  );
}

function pageBox(doc: PDFKit.PDFDocument) {
  const margin = 48;
  const width = doc.page.width - margin * 2;
  return { margin, width, left: margin, right: doc.page.width - margin };
}

function ensureSpace(doc: PDFKit.PDFDocument, need: number) {
  if (doc.y + need > doc.page.height - 56) {
    doc.addPage();
    drawPageFrame(doc);
    doc.y = 56;
  }
}

function drawPageFrame(doc: PDFKit.PDFDocument) {
  const { margin, width } = pageBox(doc);
  doc.save();
  doc.rect(0, 0, doc.page.width, doc.page.height).fill(DOC.paper);
  doc
    .strokeColor(DOC.border)
    .lineWidth(0.8)
    .rect(margin - 10, 36, width + 20, doc.page.height - 72)
    .stroke();
  doc.restore();
}

function drawHeaderBand(
  doc: PDFKit.PDFDocument,
  opts: { title: string; badge: string; subtitle?: string }
) {
  const { margin, width, left } = pageBox(doc);
  doc.save();
  doc.rect(0, 0, doc.page.width, 118).fill(DOC.ink);
  doc.fillColor(DOC.gold).font(bodyFont(doc)).fontSize(9);
  doc.text("✦  Т А Р О  ✦", left, 28, {
    width,
    align: "center",
  });
  doc.fillColor(DOC.white).font(bodyFont(doc)).fontSize(22);
  doc.text(opts.title, left, 48, { width, align: "center" });

  const badgeW = Math.min(180, width * 0.4);
  const badgeX = (doc.page.width - badgeW) / 2;
  doc
    .strokeColor(DOC.gold)
    .lineWidth(1)
    .rect(badgeX, 80, badgeW, 20)
    .stroke();
  doc.fillColor(DOC.gold).fontSize(8);
  doc.text(opts.badge, badgeX, 85, {
    width: badgeW,
    align: "center",
  });

  doc.rect(0, 118, doc.page.width, 3).fill(DOC.gold);
  doc.restore();
  doc.y = 140;

  if (opts.subtitle) {
    doc.fillColor(DOC.inkSoft).font(bodyFont(doc)).fontSize(10);
    doc.text(opts.subtitle, left, doc.y, { width, align: "center" });
    doc.moveDown(0.8);
  }
}

function drawMeta(
  doc: PDFKit.PDFDocument,
  rows: Array<[string, string]>
) {
  const { left, width } = pageBox(doc);
  ensureSpace(doc, 24 + rows.length * 16);
  const startY = doc.y;
  doc
    .save()
    .rect(left, startY, width, rows.length * 16 + 16)
    .fill(DOC.white)
    .strokeColor(DOC.border)
    .lineWidth(0.8)
    .rect(left, startY, width, rows.length * 16 + 16)
    .stroke()
    .restore();

  let y = startY + 10;
  for (const [label, value] of rows) {
    doc.fillColor(DOC.inkSoft).font(bodyFont(doc)).fontSize(8);
    doc.text(label.toUpperCase(), left + 12, y, { width: 110, continued: false });
    doc.fillColor(DOC.ink).font(bodyFont(doc)).fontSize(10);
    doc.text(value, left + 120, y - 1, { width: width - 140 });
    y += 16;
  }
  doc.y = startY + rows.length * 16 + 28;
}

function drawDivider(doc: PDFKit.PDFDocument) {
  const { left, width } = pageBox(doc);
  ensureSpace(doc, 16);
  doc
    .strokeColor(DOC.gold)
    .lineWidth(1)
    .moveTo(left, doc.y)
    .lineTo(left + 48, doc.y)
    .stroke();
  doc.moveDown(0.8);
}

function drawSectionTitle(
  doc: PDFKit.PDFDocument,
  eyebrow: string,
  title: string,
  index?: string
) {
  const { left, width } = pageBox(doc);
  ensureSpace(doc, 48);
  doc.fillColor(DOC.inkSoft).font(bodyFont(doc)).fontSize(8);
  doc.text(eyebrow, left, doc.y, {
    width: index ? width - 60 : width,
  });
  if (index) {
    doc.fillColor(DOC.inkSoft).fontSize(9);
    doc.text(index, left, doc.y - 11, { width, align: "right" });
  }
  doc.moveDown(0.25);
  doc.fillColor(DOC.ink).font(boldFont(doc)).fontSize(14);
  doc.text(title, left, doc.y, { width });
  drawDivider(doc);
}

function drawBody(doc: PDFKit.PDFDocument, text: string) {
  const { left, width } = pageBox(doc);
  ensureSpace(doc, 40);
  doc.fillColor(DOC.inkMuted).font(bodyFont(doc)).fontSize(10);
  doc.text(text, left, doc.y, { width, align: "left", lineGap: 3 });
  doc.moveDown(0.9);
}

function drawCardBlock(
  doc: PDFKit.PDFDocument,
  opts: {
    index: string;
    position: string;
    name: string;
    body: string;
  }
) {
  const { left, width } = pageBox(doc);
  doc.font(bodyFont(doc)).fontSize(10);
  const textHeight = doc.heightOfString(opts.body, {
    width: width - 28,
    lineGap: 3,
  });
  const blockH = Math.max(72, textHeight + 58);
  ensureSpace(doc, blockH + 12);

  const y = doc.y;
  doc.save();
  doc.rect(left, y, width, blockH).fill(DOC.white);
  doc.rect(left, y, 3, blockH).fill(DOC.gold);
  doc
    .strokeColor(DOC.border)
    .lineWidth(0.8)
    .rect(left, y, width, blockH)
    .stroke();
  doc.restore();

  doc.fillColor(DOC.inkSoft).font(bodyFont(doc)).fontSize(8);
  doc.text(opts.position.toUpperCase(), left + 14, y + 12, {
    width: width - 80,
  });
  doc.fillColor(DOC.inkSoft).fontSize(9);
  doc.text(opts.index, left + 14, y + 12, { width: width - 28, align: "right" });

  doc.fillColor(DOC.ink).font(boldFont(doc)).fontSize(13);
  doc.text(opts.name, left + 14, y + 26, { width: width - 28 });

  doc.fillColor(DOC.inkMuted).font(bodyFont(doc)).fontSize(10);
  doc.text(opts.body, left + 14, y + 46, {
    width: width - 28,
    lineGap: 3,
  });

  doc.y = y + blockH + 14;
}

function drawNotice(doc: PDFKit.PDFDocument, text: string) {
  const { left, width } = pageBox(doc);
  ensureSpace(doc, 56);
  const y = doc.y;
  doc.save();
  doc.rect(left, y, width, 48).fill(DOC.ink);
  doc
    .strokeColor(DOC.gold)
    .lineWidth(1)
    .rect(left, y, width, 48)
    .stroke();
  doc.restore();
  doc.fillColor(DOC.gold).font(bodyFont(doc)).fontSize(8);
  doc.text("PREMIUM UNLOCK", left + 14, y + 10);
  doc.fillColor(DOC.white).fontSize(9);
  doc.text(text, left + 14, y + 24, { width: width - 28 });
  doc.y = y + 60;
}

function drawFooter(doc: PDFKit.PDFDocument, note: string) {
  const pages = doc.bufferedPageRange();
  for (let i = 0; i < pages.count; i++) {
    doc.switchToPage(pages.start + i);
    const { left, width } = pageBox(doc);
    doc
      .fillColor(DOC.inkSoft)
      .font(bodyFont(doc))
      .fontSize(7)
      .text(note, left, doc.page.height - 42, {
        width,
        align: "center",
      });
    doc
      .fillColor(DOC.inkSoft)
      .text(`${i + 1} / ${pages.count}`, left, doc.page.height - 28, {
        width,
        align: "right",
      });
  }
}

function endPdf(doc: PDFKit.PDFDocument): Promise<Buffer> {
  const chunks: Buffer[] = [];
  doc.on("data", (c) => chunks.push(c as Buffer));
  return new Promise((resolve, reject) => {
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);
    doc.end();
  });
}

export async function generateReadingPdf(
  readingId: string,
  token: string
): Promise<Buffer> {
  const reading = await assertReadingAccess(readingId, token);
  if (!reading.freeResult) {
    throw new Error("Эхлээд тайлбар үүсгэнэ үү");
  }

  const isPaid =
    reading.paymentStatus === "paid" || reading.paymentStatus === "not_required";

  const allCards = await getActiveCards();
  const byId = new Map(allCards.map((c) => [c.id, c]));
  const selectedIds = reading.selectedCardIds as string[];
  const selected = selectedIds
    .map((id: string) => byId.get(id))
    .filter((c): c is NonNullable<typeof c> => Boolean(c));
  const positions = positionsForType(reading.readingType);

  const doc = createDoc();
  drawPageFrame(doc);
  drawHeaderBand(doc, {
    title: isPaid ? "Бүрэн уншлагын тайлан" : "Уншлагын тайлан",
    badge: isPaid ? "PREMIUM · PAID" : "PREVIEW · FREE",
    subtitle: reading.userName,
  });

  const meta: Array<[string, string]> = [
    ["Дугаар", reading.readingId],
    ["Огноо", new Date(reading.createdAt).toLocaleDateString("mn-MN")],
    ["Төрөл", reading.readingType],
  ];
  if (reading.age) meta.splice(1, 0, ["Нас", String(reading.age)]);
  meta.push(["Асуулт", reading.question]);
  drawMeta(doc, meta);

  drawSectionTitle(doc, "SPREAD", "Хөзрүүдийн тайлбар");

  selected.forEach((card, i) => {
    const bodyMn =
      (isPaid && reading.paidResult?.paidCardInterpretations?.[i]) ||
      reading.freeResult?.freeCardInterpretations?.[i] ||
      "";
    const bodyEn =
      (isPaid && reading.paidResult?.paidCardInterpretationsEn?.[i]) ||
      reading.freeResult?.freeCardInterpretationsEn?.[i] ||
      "";
    drawCardBlock(doc, {
      index: `${String(i + 1).padStart(2, "0")} / ${String(selected.length).padStart(2, "0")}`,
      position: positionLabel(positions[i] || `Байрлал ${i + 1}`),
      name: card.nameEn || card.nameMn,
      body: bilingualBlock(bodyEn, bodyMn),
    });
  });

  drawSectionTitle(
    doc,
    "SYNTHESIS",
    isPaid ? "Overall · Бүрэн дүгнэлт" : "Overall · Богино дүгнэлт"
  );
  drawBody(
    doc,
    bilingualBlock(
      isPaid
        ? reading.paidResult?.paidOverallInterpretationEn ||
            reading.freeResult?.freeOverallInterpretationEn
        : reading.freeResult?.freeOverallInterpretationEn,
      isPaid
        ? reading.paidResult?.paidOverallInterpretation ||
            reading.freeResult.freeOverallInterpretation
        : reading.freeResult.freeOverallInterpretation
    )
  );

  if (isPaid && reading.paidResult) {
    const chapters: Array<[string, string, string | undefined, string | undefined]> = [
      [
        "CONNECTIONS",
        "How the cards connect · Хөзрүүдийн холбоо",
        reading.paidResult.cardConnectionsEn,
        reading.paidResult.cardConnections,
      ],
      [
        "ANSWER",
        "Answer · Асуултын хариу",
        reading.paidResult.questionAnswerEn,
        reading.paidResult.questionAnswer,
      ],
      [
        "CHALLENGE",
        "Challenge · Гол саад",
        reading.paidResult.challengeEn,
        reading.paidResult.challenge,
      ],
      [
        "HIDDEN",
        "Hidden · Нуугдмал нөлөө",
        reading.paidResult.hiddenInfluenceEn,
        reading.paidResult.hiddenInfluence,
      ],
      [
        "ADVICE",
        "Advice · Зөвлөгөө",
        reading.paidResult.adviceEn,
        reading.paidResult.advice,
      ],
      [
        "EMOTION",
        "Emotion · Сэтгэл хөдлөл",
        reading.paidResult.emotionalGuidanceEn,
        reading.paidResult.emotionalGuidance,
      ],
      [
        "OUTCOME",
        "Outcome · Үр дүн",
        reading.paidResult.possibleOutcomeEn,
        reading.paidResult.possibleOutcome,
      ],
    ];
    const present = chapters.filter(([, , en, mn]) => Boolean(en || mn));
    present.forEach(([eyebrow, title, en, mn], i) => {
      drawSectionTitle(
        doc,
        eyebrow,
        title,
        `${String(i + 1).padStart(2, "0")} / ${String(present.length).padStart(2, "0")}`
      );
      drawBody(doc, bilingualBlock(en, mn));
    });
  } else if (reading.readingType !== "yes-no") {
    drawNotice(
      doc,
      "This is a preview. Unlock the full reading on the website. / Энэ бол богино тайлбар. Бүрэн дэлгэрэнгүйг вебсайтаас нээнэ үү."
    );
  }

  if (reading.freeResult.yesNoLabel) {
    drawSectionTitle(doc, "YES / NO", "Answer · Хариулт");
    drawBody(
      doc,
      bilingualBlock(
        reading.freeResult.yesNoLabelEn || reading.freeResult.yesNoLabel,
        reading.freeResult.yesNoLabel
      )
    );
  }

  drawFooter(
    doc,
    "Энэхүү үйлчилгээ нь зөвхөн зугаа цэнгэл, өөрийгөө эргэцүүлэх зориулалттай."
  );

  reading.pdfGeneratedAt = new Date();
  await reading.save();

  return endPdf(doc);
}

export async function generateNatalPdf(
  orderId: string,
  token: string
): Promise<Buffer> {
  const order = await assertNatalAccess(orderId, token);
  if (order.paymentStatus !== "paid") {
    throw new Error("Бүрэн PDF зөвхөн төлбөрийн дараа боломжтой");
  }

  const chart = computeNatalChart(order.birthDate, order.birthTime || null);
  const report = buildNatalFullReport(chart);

  const doc = createDoc();
  drawPageFrame(doc);
  drawHeaderBand(doc, {
    title: "Төрсөн зурхайн тайлан",
    badge: "NATAL · PREMIUM",
    subtitle: `Life Path ${report.lifePath.number}`,
  });

  drawMeta(doc, [
    ["Дугаар", order.orderId],
    ["Төрсөн огноо", order.birthDate],
    ...(order.birthTime ? [["Цаг", order.birthTime] as [string, string]] : []),
    ["Огноо", new Date().toLocaleDateString("mn-MN")],
  ]);

  drawSectionTitle(
    doc,
    "LIFE PATH",
    `Life Path ${report.lifePath.number} — ${report.lifePath.titleEn} · ${report.lifePath.titleMn}`
  );
  drawBody(
    doc,
    bilingualBlock(report.lifePathDetailedEn, report.lifePathDetailedMn)
  );

  drawCardBlock(doc, {
    index: "01",
    position: "SUN",
    name: `${report.sun.sign.nameEn} · ${report.sun.sign.nameMn} · ${report.sun.degree}°`,
    body: bilingualBlock(report.sunDetailedEn, report.sunDetailedMn),
  });
  drawCardBlock(doc, {
    index: "02",
    position: "MOON",
    name: `${report.moon.sign.nameEn} · ${report.moon.sign.nameMn} · ${report.moon.degree}°`,
    body: bilingualBlock(report.moonDetailedEn, report.moonDetailedMn),
  });
  drawCardBlock(doc, {
    index: "03",
    position: "VENUS",
    name: `${report.venus.sign.nameEn} · ${report.venus.sign.nameMn} · ${report.venus.degree}°`,
    body: bilingualBlock(report.venusDetailedEn, report.venusDetailedMn),
  });

  drawSectionTitle(doc, "PLANETS", "Planet details · Гариг бүрийн дэлгэрэнгүй");
  report.planetDetails.forEach((p, i) => {
    drawCardBlock(doc, {
      index: `${String(i + 1).padStart(2, "0")} / ${String(report.planetDetails.length).padStart(2, "0")}`,
      position: p.nameEn,
      name: `${p.nameEn} in ${p.sign.nameEn} · ${p.degree}°`,
      body: bilingualBlock(p.detailedEn, p.detailedMn),
    });
  });

  drawSectionTitle(doc, "SYNTHESIS", "Synthesis · Нийлмэл дүгнэлт");
  drawBody(doc, bilingualBlock(report.synthesisEn, report.synthesisMn));

  drawFooter(
    doc,
    "Энэхүү үйлчилгээ нь астрологийн тусгал бөгөөд зөвхөн өөрийгөө эргэцүүлэх зориулалттай."
  );

  order.pdfGeneratedAt = new Date();
  await order.save();

  return endPdf(doc);
}
