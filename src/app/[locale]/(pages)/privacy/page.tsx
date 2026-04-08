import { setRequestLocale } from 'next-intl/server';
import { SITE_CONFIG } from '@/lib/constants';
import type { Metadata } from 'next';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return { title: locale === 'fr' ? 'Politique de confidentialité' : 'Datenschutz', alternates: { canonical: locale === 'fr' ? `${SITE_CONFIG.url}/privacy` : `${SITE_CONFIG.url}/de/privacy`, languages: { 'fr-CH': `${SITE_CONFIG.url}/privacy`, 'de-CH': `${SITE_CONFIG.url}/de/privacy`, 'x-default': `${SITE_CONFIG.url}/privacy` } } };
}

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isFr = locale === 'fr';

  const sections = isFr ? [
    { title: '1. Collecte des données', content: 'Nous collectons les informations que vous nous fournissez directement : nom, adresse email, numéro de téléphone. Ces données sont nécessaires pour traiter votre commande et activer votre abonnement.' },
    { title: '2. Utilisation des données', content: 'Vos données sont utilisées exclusivement pour : le traitement de vos commandes, l\'activation de votre service, le support client et les communications relatives à votre abonnement.' },
    { title: '3. Protection des données', content: 'Nous prenons la sécurité de vos données au sérieux. Toutes les données sont chiffrées et stockées de manière sécurisée conformément aux normes suisses de protection des données.' },
    { title: '4. Contact', content: `Pour toute question concernant vos données, contactez-nous à ${SITE_CONFIG.email}.` },
  ] : [
    { title: '1. Datenerhebung', content: 'Wir erheben die Informationen, die Sie uns direkt zur Verfügung stellen: Name, E-Mail-Adresse, Telefonnummer. Diese Daten sind für die Bearbeitung Ihrer Bestellung und die Aktivierung Ihres Abonnements erforderlich.' },
    { title: '2. Verwendung der Daten', content: 'Ihre Daten werden ausschliesslich verwendet für: die Verarbeitung Ihrer Bestellungen, die Aktivierung Ihres Services, den Kundensupport und Mitteilungen zu Ihrem Abonnement.' },
    { title: '3. Datenschutz', content: 'Wir nehmen die Sicherheit Ihrer Daten ernst. Alle Daten werden verschlüsselt und gemäss den schweizerischen Datenschutzstandards sicher gespeichert.' },
    { title: '4. Kontakt', content: `Bei Fragen zu Ihren Daten kontaktieren Sie uns unter ${SITE_CONFIG.email}.` },
  ];

  return (
    <div className="pt-28 pb-20 bg-white">
      <div className="max-w-2xl mx-auto px-5 sm:px-8">
        <h1 className="text-3xl font-extrabold text-text tracking-tight mb-8">{isFr ? 'Politique de confidentialité' : 'Datenschutzerklärung'}</h1>
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
