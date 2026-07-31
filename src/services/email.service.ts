import nodemailer from "nodemailer";
import { config } from "@/lib/config";
import { connectDB } from "@/lib/database/connect";
import { EmailLog } from "@/models/EmailLog";
import { Reading } from "@/models/Reading";
import { assertReadingAccess, getActiveCards } from "@/services/reading.service";
import {
  assertNatalAccess,
  updateNatalOrderEmail,
} from "@/services/natal.service";
import { computeNatalChart } from "@/lib/astrology/natal";
import { buildNatalFullReport } from "@/lib/astrology/report";
import {
  emailMetaRow,
  emailSection,
  emailShell,
  emailUnlockNote,
  escapeHtml,
} from "@/lib/brand-document";
import { bilingualBlock, positionLabel } from "@/lib/tarot/bilingual";
import { positionsForType } from "@/types";

function buildReadingEmailHtml(params: {
  userName: string;
  readingId: string;
  question: string;
  readingType: string;
  isPaid: boolean;
  yesNoLabel?: string;
  overall: string;
  cards: Array<{
    position: string;
    name: string;
    body: string;
    index: string;
  }>;
  chapters: Array<{ eyebrow: string; title: string; body: string }>;
}) {
  const badge = params.isPaid ? "PREMIUM · PAID" : "PREVIEW · FREE";
  const title = params.isPaid ? "Бүрэн уншлагын тайлан" : "Уншлагын тайлан";

  const meta = `
    <p style="margin:0 0 18px;font-family:Georgia,serif;font-size:15px;color:#111;">
      Сайн байна уу, <strong>${escapeHtml(params.userName)}</strong>.
    </p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:22px;border:1px solid #d9d9d9;background:#f7f7f5;">
      <tr><td style="padding:12px 16px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          ${emailMetaRow("Дугаар", params.readingId)}
          ${emailMetaRow("Төрөл", params.readingType)}
          ${emailMetaRow("Асуулт", params.question)}
        </table>
      </td></tr>
    </table>
  `;

  const yesNo = params.yesNoLabel
    ? `<div style="margin:0 0 22px;padding:22px;text-align:center;background:#111;border:1px solid #8a7d64;">
        <div style="font-family:Arial,sans-serif;font-size:10px;letter-spacing:0.22em;color:#8a7d64;">ХАРИУЛТ</div>
        <div style="font-family:Georgia,serif;font-size:42px;color:#f2f2f0;margin-top:8px;">${escapeHtml(params.yesNoLabel)}</div>
      </div>`
    : "";

  const cardsHtml = params.cards
    .map((c) =>
      emailSection(c.position, c.name, c.body, { index: c.index })
    )
    .join("");

  const overall = emailSection(
    "SYNTHESIS",
    params.isPaid ? "Overall · Бүрэн дүгнэлт" : "Overall · Богино дүгнэлт",
    params.overall
  );

  const chaptersHtml = params.chapters
    .map((ch, i) =>
      emailSection(ch.eyebrow, ch.title, ch.body, {
        index: `${String(i + 1).padStart(2, "0")} / ${String(params.chapters.length).padStart(2, "0")}`,
      })
    )
    .join("");

  const unlock =
      !params.isPaid && params.readingType !== "yes-no"
      ? emailUnlockNote(
          "This is a preview. Unlock the full reading on the website. / Энэ бол богино тайлбар. Бүрэн дэлгэрэнгүйг вебсайтаас төлбөрөөр нээнэ үү."
        )
      : "";

  return emailShell({
    title,
    badge,
    subtitle: params.userName,
    bodyHtml: `${meta}${yesNo}${cardsHtml}${overall}${chaptersHtml}${unlock}`,
  });
}

function buildNatalEmailHtml(params: {
  orderId: string;
  birthDate: string;
  birthTime?: string | null;
  lifePathTitle: string;
  lifePathBody: string;
  placements: Array<{ eyebrow: string; title: string; body: string }>;
  planets: Array<{ eyebrow: string; title: string; body: string }>;
  synthesis: string;
}) {
  const meta = `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:22px;border:1px solid #d9d9d9;background:#f7f7f5;">
      <tr><td style="padding:12px 16px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          ${emailMetaRow("Дугаар", params.orderId)}
          ${emailMetaRow("Төрсөн огноо", params.birthDate)}
          ${
            params.birthTime
              ? emailMetaRow("Цаг", params.birthTime)
              : ""
          }
        </table>
      </td></tr>
    </table>
  `;

  return emailShell({
    title: "Төрсөн зурхайн тайлан",
    badge: "NATAL · PREMIUM",
    bodyHtml: `
      ${meta}
      ${emailSection("LIFE PATH", params.lifePathTitle, params.lifePathBody)}
      ${params.placements
        .map((p) => emailSection(p.eyebrow, p.title, p.body))
        .join("")}
      ${params.planets
        .map((p, i) =>
          emailSection(p.eyebrow, p.title, p.body, {
            index: `${String(i + 1).padStart(2, "0")} / ${String(params.planets.length).padStart(2, "0")}`,
          })
        )
        .join("")}
      ${emailSection("SYNTHESIS", "Synthesis · Нийлмэл дүгнэлт", params.synthesis)}
    `,
    footerNote:
      "This is reflective astrology for self-reflection only. · Энэхүү үйлчилгээ нь астрологийн тусгал бөгөөд зөвхөн өөрийгөө эргэцүүлэх зориулалттай.",
  });
}

async function sendMail(to: string, subject: string, html: string) {
  if (config.email.provider === "console" || !config.email.smtpHost) {
    console.log("[email:console]", { to, subject, html: html.slice(0, 280) });
    return { messageId: `console-${Date.now()}` };
  }

  const transporter = nodemailer.createTransport({
    host: config.email.smtpHost,
    port: config.email.smtpPort,
    secure: config.email.smtpPort === 465,
    auth: config.email.smtpUser
      ? { user: config.email.smtpUser, pass: config.email.smtpPassword }
      : undefined,
  });

  return transporter.sendMail({
    from: config.email.from,
    to,
    subject,
    html,
  });
}

async function composeReadingEmailHtml(
  reading: Awaited<ReturnType<typeof assertReadingAccess>>
) {
  const isPaid =
    reading.paymentStatus === "paid" || reading.paymentStatus === "not_required";

  const allCards = await getActiveCards();
  const byId = new Map(allCards.map((c) => [c.id, c]));
  const selectedIds = (reading.selectedCardIds as string[]) || [];
  const positions = positionsForType(reading.readingType);

  const cards = selectedIds.map((id, i) => {
    const card = byId.get(id);
    const bodyMn =
      (isPaid && reading.paidResult?.paidCardInterpretations?.[i]) ||
      reading.freeResult?.freeCardInterpretations?.[i] ||
      "";
    const bodyEn =
      (isPaid && reading.paidResult?.paidCardInterpretationsEn?.[i]) ||
      reading.freeResult?.freeCardInterpretationsEn?.[i] ||
      "";
    return {
      position: positionLabel(positions[i] || `Байрлал ${i + 1}`),
      name: card?.nameEn || card?.nameMn || `Card ${i + 1}`,
      body: bilingualBlock(bodyEn, bodyMn),
      index: `${String(i + 1).padStart(2, "0")} / ${String(selectedIds.length).padStart(2, "0")}`,
    };
  });

  const chapters: Array<{ eyebrow: string; title: string; body: string }> = [];
  if (isPaid && reading.paidResult) {
    const list: Array<[string, string, string | undefined, string | undefined]> =
      [
        [
          "CONNECTIONS",
          "How the cards connect · Холбоо",
          reading.paidResult.cardConnectionsEn,
          reading.paidResult.cardConnections,
        ],
        [
          "ANSWER",
          "Answer · Хариу",
          reading.paidResult.questionAnswerEn,
          reading.paidResult.questionAnswer,
        ],
        [
          "CHALLENGE",
          "Challenge · Саад",
          reading.paidResult.challengeEn,
          reading.paidResult.challenge,
        ],
        [
          "HIDDEN",
          "Hidden · Нуугдмал",
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
    for (const [eyebrow, title, en, mn] of list) {
      if (en || mn) chapters.push({ eyebrow, title, body: bilingualBlock(en, mn) });
    }
  }

  return buildReadingEmailHtml({
    userName: reading.userName,
    readingId: reading.readingId,
    question: reading.question,
    readingType: reading.readingType,
    isPaid,
    yesNoLabel:
      reading.freeResult?.yesNoLabelEn && reading.freeResult?.yesNoLabel
        ? `${reading.freeResult.yesNoLabelEn} / ${reading.freeResult.yesNoLabel}`
        : reading.freeResult?.yesNoLabel,
    overall: bilingualBlock(
      isPaid
        ? reading.paidResult?.paidOverallInterpretationEn ||
            reading.freeResult?.freeOverallInterpretationEn
        : reading.freeResult?.freeOverallInterpretationEn,
      isPaid
        ? reading.paidResult?.paidOverallInterpretation ||
            reading.freeResult!.freeOverallInterpretation
        : reading.freeResult!.freeOverallInterpretation
    ),
    cards,
    chapters,
  });
}

export async function sendReadingEmail(readingId: string, token: string) {
  const reading = await assertReadingAccess(readingId, token);
  if (!reading.email) {
    throw new Error("И-мэйл хаяг бүртгэгдээгүй байна");
  }
  if (!reading.freeResult) {
    throw new Error("Эхлээд тайлбар үүсгэнэ үү");
  }

  const isPaid =
    reading.paymentStatus === "paid" || reading.paymentStatus === "not_required";
  const subject = isPaid
    ? "Таны бүрэн таро уншлагын тайлан"
    : "Таны таро уншлагын богино тайлан";
  const html = await composeReadingEmailHtml(reading);

  await connectDB();
  try {
    await sendMail(reading.email, subject, html);
    await EmailLog.create({
      readingId,
      recipient: reading.email,
      resultType: isPaid ? "paid" : "free",
      deliveryStatus: "sent",
      sentAt: new Date(),
      subject,
    });
    reading.emailHistory.push({
      sentAt: new Date(),
      recipient: reading.email,
      resultType: isPaid ? "paid" : "free",
      status: "sent",
    });
    await reading.save();
    return { sent: true, recipient: reading.email };
  } catch (err) {
    const message = err instanceof Error ? err.message : "И-мэйл илгээж чадсангүй";
    await EmailLog.create({
      readingId,
      recipient: reading.email,
      resultType: isPaid ? "paid" : "free",
      deliveryStatus: "failed",
      errorMessage: message,
      subject,
    });
    throw new Error("И-мэйл илгээж чадсангүй");
  }
}

export async function sendNatalEmail(
  orderId: string,
  token: string,
  email: string
) {
  let order = await assertNatalAccess(orderId, token);
  if (order.paymentStatus !== "paid") {
    throw new Error("Бүрэн тайлан зөвхөн төлбөрийн дараа илгээнэ");
  }

  order = await updateNatalOrderEmail(orderId, token, email);

  const chart = computeNatalChart(order.birthDate, order.birthTime || null);
  const report = buildNatalFullReport(chart);

  const subject =
    "Your natal chart report · Таны төрсөн зурхайн дэлгэрэнгүй тайлан";
  const html = buildNatalEmailHtml({
    orderId: order.orderId,
    birthDate: order.birthDate,
    birthTime: order.birthTime,
    lifePathTitle: `Life Path ${report.lifePath.number} — ${report.lifePath.titleEn} · ${report.lifePath.titleMn}`,
    lifePathBody: bilingualBlock(
      report.lifePathDetailedEn,
      report.lifePathDetailedMn
    ),
    placements: [
      {
        eyebrow: "SUN",
        title: `${report.sun.sign.nameEn} · ${report.sun.degree}°`,
        body: bilingualBlock(report.sunDetailedEn, report.sunDetailedMn),
      },
      {
        eyebrow: "MOON",
        title: `${report.moon.sign.nameEn} · ${report.moon.degree}°`,
        body: bilingualBlock(report.moonDetailedEn, report.moonDetailedMn),
      },
      {
        eyebrow: "VENUS",
        title: `${report.venus.sign.nameEn} · ${report.venus.degree}°`,
        body: bilingualBlock(report.venusDetailedEn, report.venusDetailedMn),
      },
    ],
    planets: report.planetDetails.map((p) => ({
      eyebrow: p.nameEn.toUpperCase(),
      title: `${p.nameEn} in ${p.sign.nameEn} · ${p.degree}°`,
      body: bilingualBlock(p.detailedEn, p.detailedMn),
    })),
    synthesis: bilingualBlock(report.synthesisEn, report.synthesisMn),
  });

  await connectDB();
  try {
    await sendMail(order.email!, subject, html);
    await EmailLog.create({
      natalOrderId: orderId,
      recipient: order.email!,
      resultType: "paid",
      deliveryStatus: "sent",
      sentAt: new Date(),
      subject,
    });
    if (!order.emailHistory) order.emailHistory = [];
    order.emailHistory.push({
      sentAt: new Date(),
      recipient: order.email!,
      resultType: "paid",
      status: "sent",
    });
    await order.save();
    return { sent: true, recipient: order.email };
  } catch (err) {
    const message = err instanceof Error ? err.message : "И-мэйл илгээж чадсангүй";
    await EmailLog.create({
      natalOrderId: orderId,
      recipient: order.email || email,
      resultType: "paid",
      deliveryStatus: "failed",
      errorMessage: message,
      subject,
    });
    throw new Error("И-мэйл илгээж чадсангүй");
  }
}

export async function resendEmailByAdmin(readingId: string) {
  await connectDB();
  const reading = await Reading.findOne({ readingId });
  if (!reading?.email) throw new Error("И-мэйл олдсонгүй");
  if (!reading.freeResult) throw new Error("Тайлбар байхгүй");

  const isPaid =
    reading.paymentStatus === "paid" || reading.paymentStatus === "not_required";
  const subject = isPaid
    ? "Таны бүрэн таро уншлагын тайлан"
    : "Таны таро уншлагын богино тайлан";
  const html = await composeReadingEmailHtml(reading as never);
  await sendMail(reading.email, subject, html);
  return { sent: true };
}
