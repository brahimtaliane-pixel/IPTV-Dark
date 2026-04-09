// ============================================================
// Resend Email Service
// ============================================================

import { Resend } from 'resend';
import { SITE_CONFIG, PRICE_CURRENCY_SYMBOL } from './constants';
import { getSiteContact } from './get-site-contact';

// Lazy init — avoids crash at build time when RESEND_API_KEY is not yet set
let _resend: Resend | null = null;
export function getResend(): Resend {
  if (!_resend) {
    const key = process.env.RESEND_API_KEY;
    if (!key) throw new Error('RESEND_API_KEY is not configured');
    _resend = new Resend(key);
  }
  return _resend;
}

interface LeadEmailData {
  customerName: string;
  email: string;
  phone: string;
  planName: string;
  planPrice: string;
  planDuration: number;
  paymentLink: string;
  locale: string;
  leadId: string;
}

// ─── Payment Link Email to Customer ─────────────────────────
export async function sendPaymentLinkEmail(data: LeadEmailData) {
  const contact = await getSiteContact();
  const paymentUrl = data.paymentLink;

  const subject = `Je betaallink – ${data.planName}`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f5f5f5;">
  <div style="max-width:600px;margin:0 auto;padding:20px;">
    <div style="background:#D52B1E;padding:28px 32px;border-radius:12px 12px 0 0;text-align:center;">
      <h1 style="margin:0;color:#fff;font-size:24px;font-weight:800;letter-spacing:0.5px;">
        IPTV<span style="font-weight:400;"> NEDERLAND</span>
      </h1>
    </div>
    
    <div style="background:#fff;padding:32px;border-radius:0 0 12px 12px;border:1px solid #e5e5e5;border-top:none;">
      <h2 style="margin:0 0 8px;color:#111;font-size:20px;">
        Hallo ${data.customerName} 👋
      </h2>
      <p style="color:#666;font-size:15px;line-height:1.6;margin:0 0 24px;">
        Bedankt voor je interesse! Hier is je beveiligde betaallink om je bestelling af te ronden.
      </p>
      
      <div style="background:#fafafa;border:1px solid #e5e5e5;border-radius:8px;padding:20px;margin:0 0 24px;">
        <div style="font-size:12px;color:#999;text-transform:uppercase;letter-spacing:1px;margin:0 0 8px;">
          Je bestelling
        </div>
        <div style="font-size:18px;font-weight:700;color:#111;margin:0 0 4px;">${data.planName}</div>
        <div style="font-size:14px;color:#666;">
          Looptijd: ${data.planDuration} maanden
        </div>
        <div style="font-size:28px;font-weight:800;color:#D52B1E;margin:12px 0 0;">
          ${data.planPrice} ${PRICE_CURRENCY_SYMBOL}
        </div>
      </div>
      
      <div style="text-align:center;margin:0 0 24px;">
        <a href="${paymentUrl}" style="display:inline-block;background:#D52B1E;color:#fff;text-decoration:none;padding:14px 40px;border-radius:8px;font-size:16px;font-weight:700;letter-spacing:0.5px;">
          NAAR BETALING
        </a>
      </div>
      
      <p style="color:#999;font-size:13px;line-height:1.5;margin:0 0 16px;text-align:center;">
        Na betaling wordt je abonnement meestal binnen 2 uur geactiveerd.
      </p>

      <hr style="border:none;border-top:1px solid #eee;margin:24px 0;">
      
      <div style="text-align:center;">
        <p style="color:#999;font-size:13px;margin:0 0 4px;">
          Hulp nodig? Neem contact op
        </p>
        <p style="margin:0;">
          <a href="mailto:${SITE_CONFIG.email}" style="color:#D52B1E;text-decoration:none;font-size:13px;">${SITE_CONFIG.email}</a>
          <span style="color:#ccc;margin:0 8px;">|</span>
          <a href="${contact.whatsappUrl}" style="color:#D52B1E;text-decoration:none;font-size:13px;">WhatsApp</a>
        </p>
      </div>
    </div>
    
    <div style="text-align:center;padding:16px;color:#999;font-size:11px;">
      © ${new Date().getFullYear()} ${SITE_CONFIG.name}. Alle rechten voorbehouden.
    </div>
  </div>
</body>
</html>`;

  try {
    const result = await getResend().emails.send({
      from: `${SITE_CONFIG.name} <contact@${SITE_CONFIG.domain}>`,
      to: data.email,
      subject,
      html,
    });
    return { success: true, id: result.data?.id };
  } catch (error) {
    console.error('Failed to send payment email:', error);
    return { success: false, error };
  }
}

// ─── Admin Notification Email ────────────────────────────────
export async function sendAdminNotification(data: LeadEmailData) {
  const html = `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:20px;font-family:monospace;background:#f5f5f5;">
  <div style="max-width:500px;margin:0 auto;background:#fff;border:1px solid #ddd;border-radius:8px;padding:24px;">
    <h2 style="margin:0 0 16px;color:#D52B1E;">🔔 Nieuwe lead</h2>
    <table style="width:100%;border-collapse:collapse;font-size:14px;">
      <tr><td style="padding:6px 0;color:#999;">Naam</td><td style="padding:6px 0;font-weight:700;">${data.customerName}</td></tr>
      <tr><td style="padding:6px 0;color:#999;">E-mail</td><td style="padding:6px 0;">${data.email}</td></tr>
      <tr><td style="padding:6px 0;color:#999;">Telefoon</td><td style="padding:6px 0;">${data.phone}</td></tr>
      <tr><td style="padding:6px 0;color:#999;">Pakket</td><td style="padding:6px 0;font-weight:700;">${data.planName}</td></tr>
      <tr><td style="padding:6px 0;color:#999;">Prijs</td><td style="padding:6px 0;color:#D52B1E;font-weight:700;">${data.planPrice} ${PRICE_CURRENCY_SYMBOL}</td></tr>
      <tr><td style="padding:6px 0;color:#999;">Taal</td><td style="padding:6px 0;">${data.locale.toUpperCase()}</td></tr>
      <tr><td style="padding:6px 0;color:#999;">Datum</td><td style="padding:6px 0;">${new Date().toLocaleString('nl-NL')}</td></tr>
    </table>
  </div>
</body>
</html>`;

  try {
    await getResend().emails.send({
      from: `IPTV Nederland Leads <contact@${SITE_CONFIG.domain}>`,
      to: SITE_CONFIG.email,
      subject: `🔔 Nieuwe lead: ${data.customerName} – ${data.planName}`,
      html,
    });
  } catch (error) {
    console.error('Failed to send admin notification:', error);
  }
}
