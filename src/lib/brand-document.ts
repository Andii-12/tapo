/** Shared visual language for PDF + email (free & paid). */

export const DOC = {
  ink: "#111111",
  inkMuted: "#4a4a4a",
  inkSoft: "#707070",
  paper: "#f7f7f5",
  white: "#ffffff",
  border: "#d9d9d9",
  gold: "#8a7d64",
  dark: "#0c0c0c",
  darkPanel: "#161616",
} as const;

export function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function emailShell(params: {
  title: string;
  badge: string;
  subtitle?: string;
  bodyHtml: string;
  footerNote?: string;
}): string {
  const footer =
    params.footerNote ||
    "Энэхүү үйлчилгээ нь зөвхөн зугаа цэнгэл, өөрийгөө эргэцүүлэх зориулалттай.";

  return `<!DOCTYPE html>
<html lang="mn">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(params.title)}</title>
</head>
<body style="margin:0;padding:0;background:${DOC.dark};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${DOC.dark};padding:32px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;background:${DOC.white};border:1px solid ${DOC.border};">
          <tr>
            <td style="background:${DOC.ink};padding:28px 28px 22px;text-align:center;">
              <div style="font-family:Georgia,'Times New Roman',serif;font-size:11px;letter-spacing:0.32em;color:${DOC.gold};">✦ ТАРО ✦</div>
              <div style="font-family:Georgia,'Times New Roman',serif;font-size:28px;font-weight:400;color:${DOC.white};margin-top:10px;letter-spacing:0.04em;">
                ${escapeHtml(params.title)}
              </div>
              <div style="display:inline-block;margin-top:14px;padding:6px 14px;border:1px solid ${DOC.gold};font-family:Arial,Helvetica,sans-serif;font-size:10px;letter-spacing:0.2em;color:${DOC.gold};">
                ${escapeHtml(params.badge)}
              </div>
              ${
                params.subtitle
                  ? `<div style="font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#bdbdb8;margin-top:14px;line-height:1.5;">${escapeHtml(params.subtitle)}</div>`
                  : ""
              }
            </td>
          </tr>
          <tr>
            <td style="height:3px;background:${DOC.gold};font-size:0;line-height:0;">&nbsp;</td>
          </tr>
          <tr>
            <td style="padding:28px;font-family:Georgia,'Times New Roman',serif;color:${DOC.ink};">
              ${params.bodyHtml}
            </td>
          </tr>
          <tr>
            <td style="padding:18px 28px 28px;border-top:1px solid ${DOC.border};background:${DOC.paper};">
              <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:11px;line-height:1.6;color:${DOC.inkSoft};text-align:center;">
                ${escapeHtml(footer)}
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function emailMetaRow(label: string, value: string): string {
  return `<tr>
    <td style="padding:6px 0;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:0.12em;color:${DOC.inkSoft};width:120px;vertical-align:top;">${escapeHtml(label)}</td>
    <td style="padding:6px 0;font-family:Georgia,'Times New Roman',serif;font-size:14px;color:${DOC.ink};">${escapeHtml(value)}</td>
  </tr>`;
}

export function emailSection(
  eyebrow: string,
  title: string,
  body: string,
  opts?: { index?: string }
): string {
  return `<div style="margin:0 0 22px;padding:18px 18px 18px 16px;border:1px solid ${DOC.border};border-left:3px solid ${DOC.gold};background:${DOC.paper};">
    <div style="display:flex;justify-content:space-between;gap:12px;align-items:flex-start;">
      <div style="font-family:Arial,Helvetica,sans-serif;font-size:10px;letter-spacing:0.2em;color:${DOC.inkSoft};">${escapeHtml(eyebrow)}</div>
      ${
        opts?.index
          ? `<div style="font-family:Georgia,serif;font-size:12px;color:${DOC.inkSoft};">${escapeHtml(opts.index)}</div>`
          : ""
      }
    </div>
    <div style="font-family:Georgia,'Times New Roman',serif;font-size:20px;color:${DOC.ink};margin-top:6px;font-weight:400;">${escapeHtml(title)}</div>
    <div style="width:40px;height:1px;background:${DOC.gold};margin:12px 0;"></div>
    <div style="font-family:Georgia,'Times New Roman',serif;font-size:14px;line-height:1.7;color:${DOC.inkMuted};white-space:pre-line;">${escapeHtml(body)}</div>
  </div>`;
}

export function emailUnlockNote(text: string): string {
  return `<div style="margin:8px 0 0;padding:16px 18px;border:1px solid ${DOC.gold};background:${DOC.dark};">
    <div style="font-family:Arial,Helvetica,sans-serif;font-size:10px;letter-spacing:0.2em;color:${DOC.gold};">PREMIUM</div>
    <div style="font-family:Georgia,serif;font-size:14px;line-height:1.6;color:#f2f2f0;margin-top:8px;">${escapeHtml(text)}</div>
  </div>`;
}
