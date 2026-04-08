// ============================================================
// Resend Email Service
// ============================================================

import { Resend } from 'resend';
import { SITE_CONFIG } from './constants';

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
  const isFr = data.locale === 'fr';
  const trackingUrl = `${SITE_CONFIG.url}/api/track-click?lead=${data.leadId}&redirect=${encodeURIComponent(data.paymentLink)}`;

  const subject = isFr
    ? `Votre lien de paiement – ${data.planName}`
    : `Ihr Zahlungslink – ${data.planName}`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f5f5f5;">
  <div style="max-width:600px;margin:0 auto;padding:20px;">
    <!-- Header -->
    <div style="background:#D52B1E;padding:28px 32px;border-radius:12px 12px 0 0;text-align:center;">
      <h1 style="margin:0;color:#fff;font-size:24px;font-weight:800;letter-spacing:0.5px;">
        IPTV<span style="font-weight:400;">SUISSE</span>
      </h1>
    </div>
    
    <!-- Content -->
    <div style="background:#fff;padding:32px;border-radius:0 0 12px 12px;border:1px solid #e5e5e5;border-top:none;">
      <h2 style="margin:0 0 8px;color:#111;font-size:20px;">
        ${isFr ? `Bonjour ${data.customerName} 👋` : `Hallo ${data.customerName} 👋`}
      </h2>
      <p style="color:#666;font-size:15px;line-height:1.6;margin:0 0 24px;">
        ${isFr
          ? 'Merci pour votre intérêt ! Voici votre lien de paiement sécurisé pour finaliser votre commande.'
          : 'Vielen Dank für Ihr Interesse! Hier ist Ihr sicherer Zahlungslink, um Ihre Bestellung abzuschliessen.'
        }
      </p>
      
      <!-- Plan details -->
      <div style="background:#fafafa;border:1px solid #e5e5e5;border-radius:8px;padding:20px;margin:0 0 24px;">
        <div style="font-size:12px;color:#999;text-transform:uppercase;letter-spacing:1px;margin:0 0 8px;">
          ${isFr ? 'Votre commande' : 'Ihre Bestellung'}
        </div>
        <div style="font-size:18px;font-weight:700;color:#111;margin:0 0 4px;">${data.planName}</div>
        <div style="font-size:14px;color:#666;">
          ${isFr ? `Durée : ${data.planDuration} mois` : `Dauer: ${data.planDuration} Monate`}
        </div>
        <div style="font-size:28px;font-weight:800;color:#D52B1E;margin:12px 0 0;">
          ${data.planPrice} CHF
        </div>
      </div>
      
      <!-- CTA Button -->
      <div style="text-align:center;margin:0 0 24px;">
        <a href="${trackingUrl}" style="display:inline-block;background:#D52B1E;color:#fff;text-decoration:none;padding:14px 40px;border-radius:8px;font-size:16px;font-weight:700;letter-spacing:0.5px;">
          ${isFr ? 'PROCÉDER AU PAIEMENT' : 'JETZT BEZAHLEN'}
        </a>
      </div>
      
      <p style="color:#999;font-size:13px;line-height:1.5;margin:0 0 16px;text-align:center;">
        ${isFr
          ? 'Après le paiement, votre abonnement sera activé en moins de 2 heures.'
          : 'Nach der Zahlung wird Ihr Abonnement in weniger als 2 Stunden aktiviert.'
        }
      </p>

      <hr style="border:none;border-top:1px solid #eee;margin:24px 0;">
      
      <!-- Support info -->
      <div style="text-align:center;">
        <p style="color:#999;font-size:13px;margin:0 0 4px;">
          ${isFr ? 'Besoin d\'aide ? Contactez-nous' : 'Brauchen Sie Hilfe? Kontaktieren Sie uns'}
        </p>
        <p style="margin:0;">
          <a href="mailto:${SITE_CONFIG.email}" style="color:#D52B1E;text-decoration:none;font-size:13px;">${SITE_CONFIG.email}</a>
          <span style="color:#ccc;margin:0 8px;">|</span>
          <a href="${SITE_CONFIG.whatsapp}" style="color:#D52B1E;text-decoration:none;font-size:13px;">WhatsApp</a>
        </p>
      </div>
    </div>
    
    <!-- Footer -->
    <div style="text-align:center;padding:16px;color:#999;font-size:11px;">
      © ${new Date().getFullYear()} ${SITE_CONFIG.name}. ${isFr ? 'Tous droits réservés.' : 'Alle Rechte vorbehalten.'}
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
    <h2 style="margin:0 0 16px;color:#D52B1E;">🔔 Nouveau Lead</h2>
    <table style="width:100%;border-collapse:collapse;font-size:14px;">
      <tr><td style="padding:6px 0;color:#999;">Nom</td><td style="padding:6px 0;font-weight:700;">${data.customerName}</td></tr>
      <tr><td style="padding:6px 0;color:#999;">Email</td><td style="padding:6px 0;">${data.email}</td></tr>
      <tr><td style="padding:6px 0;color:#999;">Téléphone</td><td style="padding:6px 0;">${data.phone}</td></tr>
      <tr><td style="padding:6px 0;color:#999;">Plan</td><td style="padding:6px 0;font-weight:700;">${data.planName}</td></tr>
      <tr><td style="padding:6px 0;color:#999;">Prix</td><td style="padding:6px 0;color:#D52B1E;font-weight:700;">${data.planPrice} CHF</td></tr>
      <tr><td style="padding:6px 0;color:#999;">Langue</td><td style="padding:6px 0;">${data.locale.toUpperCase()}</td></tr>
      <tr><td style="padding:6px 0;color:#999;">Date</td><td style="padding:6px 0;">${new Date().toLocaleString('fr-CH')}</td></tr>
    </table>
  </div>
</body>
</html>`;

  try {
    await getResend().emails.send({
      from: `IPTV Suisse Leads <contact@${SITE_CONFIG.domain}>`,
      to: SITE_CONFIG.email,
      subject: `🔔 Nouveau Lead: ${data.customerName} – ${data.planName}`,
      html,
    });
  } catch (error) {
    console.error('Failed to send admin notification:', error);
  }
}
