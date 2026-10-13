import type { DigitalProduct } from "../../src/data/digitalProducts";
import { downloadLinkDays, requireEnv } from "./config";
import { signDownloadToken } from "./tokens";

export interface DeliveryLink {
  title: string;
  url: string;
}

/** Download links that point at our /api/download endpoint, each carrying a signed token. */
export function buildDeliveryLinks(
  sessionId: string,
  items: DigitalProduct[],
  secret: string,
  origin: string,
  nowSeconds: number,
): { links: DeliveryLink[]; expiresAt: Date } {
  const expSeconds = nowSeconds + downloadLinkDays() * 24 * 60 * 60;
  const links = items.map((item) => {
    const token = signDownloadToken({ sid: sessionId, pid: item.id, exp: expSeconds }, secret);
    return { title: item.title, url: `${origin}/api/download?token=${encodeURIComponent(token)}` };
  });
  return { links, expiresAt: new Date(expSeconds * 1000) };
}

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

export function buildDeliveryEmail(links: DeliveryLink[], expiresAt: Date): { subject: string; text: string; html: string } {
  const expiry = expiresAt.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Karachi" });
  const titles = links.map((l) => l.title);
  const subject =
    titles.length === 1 ? `Your GoshBuzz guide: ${titles[0]}` : `Your ${titles.length} GoshBuzz guides are ready`;

  const text = [
    "Thank you for your order from GoshBuzz!",
    "",
    "Download your guide(s) using the links below. Each link works until " + expiry + ". Save the PDFs to your device once downloaded.",
    "",
    ...links.map((l) => `- ${l.title}: ${l.url}`),
    "",
    "Did not receive what you expected? Reply to this email or message us on WhatsApp: +92 312 699 9078.",
    "",
    "GoshBuzz Pakistan",
  ].join("\n");

  const items = links
    .map(
      (l) =>
        `<li style="margin:0 0 12px"><a href="${escapeHtml(l.url)}" style="display:inline-block;padding:10px 16px;background:#f59e0b;color:#111;text-decoration:none;border-radius:8px;font-weight:700">Download: ${escapeHtml(l.title)}</a></li>`,
    )
    .join("");
  const html = `<!doctype html><html><body style="font-family:Arial,Helvetica,sans-serif;color:#111;max-width:560px;margin:0 auto;padding:24px">
<h2 style="margin:0 0 12px">Thank you for your order!</h2>
<p>Download your guide(s) below. Each link works until <strong>${escapeHtml(expiry)}</strong>.</p>
<ul style="list-style:none;padding:0;margin:20px 0">${items}</ul>
<p style="font-size:13px;color:#555">Problems with a download? Reply to this email or WhatsApp us at +92 312 699 9078.</p>
<p style="font-size:13px;color:#555">GoshBuzz Pakistan</p>
</body></html>`;

  return { subject, text, html };
}

/** Sends a transactional email through Resend (https://resend.com). */
export async function sendDeliveryEmail(
  to: string,
  message: { subject: string; text: string; html: string },
  idempotencyKey: string,
): Promise<void> {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${requireEnv("RESEND_API_KEY")}`,
      "Content-Type": "application/json",
      "Idempotency-Key": idempotencyKey,
    },
    body: JSON.stringify({
      from: requireEnv("EMAIL_FROM"),
      to: [to],
      reply_to: process.env.EMAIL_REPLY_TO || undefined,
      subject: message.subject,
      text: message.text,
      html: message.html,
    }),
  });
  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`Resend responded ${response.status}: ${detail.slice(0, 300)}`);
  }
}

