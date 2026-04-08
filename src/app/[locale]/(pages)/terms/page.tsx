import { setRequestLocale } from 'next-intl/server';
import { SITE_CONFIG } from '@/lib/constants';
import type { Metadata } from 'next';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return { title: locale === 'fr' ? 'Conditions d\'utilisation' : 'Nutzungsbedingungen', alternates: { canonical: locale === 'fr' ? `${SITE_CONFIG.url}/terms` : `${SITE_CONFIG.url}/de/terms`, languages: { 'fr-CH': `${SITE_CONFIG.url}/terms`, 'de-CH': `${SITE_CONFIG.url}/de/terms`, 'x-default': `${SITE_CONFIG.url}/terms` } } };
}

export default async function TermsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isFr = locale === 'fr';

  const sections = isFr ? [
    { title: '1. Acceptation des conditions', content: 'En utilisant nos services, vous acceptez les présentes conditions d\'utilisation. Si vous n\'acceptez pas ces conditions, veuillez ne pas utiliser notre service.' },
    { title: '2. Description du service', content: 'IPTV Suisse fournit un service de streaming TV par internet comprenant des chaînes en direct, du contenu à la demande et des fonctionnalités de replay.' },
    { title: '3. Abonnement et paiement', content: 'Les prix sont indiqués en francs suisses (CHF). L\'abonnement est activé dans les 2 heures suivant la confirmation du paiement.' },
    { title: '4. Contact', content: `Pour toute question, contactez-nous à ${SITE_CONFIG.email}.` },
  ] : [
    { title: '1. Annahme der Bedingungen', content: 'Durch die Nutzung unserer Dienste akzeptieren Sie diese Nutzungsbedingungen. Wenn Sie diese Bedingungen nicht akzeptieren, nutzen Sie bitte unseren Service nicht.' },
    { title: '2. Beschreibung des Services', content: 'IPTV Schweiz bietet einen Internet-TV-Streaming-Service mit Live-Kanälen, On-Demand-Inhalten und Replay-Funktionen.' },
    { title: '3. Abonnement und Zahlung', content: 'Die Preise sind in Schweizer Franken (CHF) angegeben. Das Abonnement wird innerhalb von 2 Stunden nach Zahlungsbestätigung aktiviert.' },
    { title: '4. Kontakt', content: `Bei Fragen kontaktieren Sie uns unter ${SITE_CONFIG.email}.` },
  ];

  return (
    <div className="pt-28 pb-20 bg-white">
      <div className="max-w-2xl mx-auto px-5 sm:px-8">
        <h1 className="text-3xl font-extrabold text-text tracking-tight mb-8">{isFr ? 'Conditions d\'utilisation' : 'Nutzungsbedingungen'}</h1>
        <div className="bg-bg rounded-xl border border-border p-6 sm:p-8 space-y-6">
          {sections.map((s) => (
            <section key={s.title}>
              <h2 className="text-base font-bold text-text mb-2">{s.title}</h2>
              <p className="text-sm text-text-muted leading-relaxed">{s.content}</p>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
