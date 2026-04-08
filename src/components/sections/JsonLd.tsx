import { SITE_CONFIG, PLANS } from '@/lib/constants';
import { localeUrl } from '@/lib/utils';

interface JsonLdProps {
  locale: string;
}

export default function JsonLd({ locale }: JsonLdProps) {
  const isFr = locale === 'fr';

  // Organization Schema
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    logo: `${SITE_CONFIG.url}/logo.svg`,
    description: isFr
      ? 'Service IPTV en Suisse — 37 000 chaînes HD/4K, VOD illimité et replay 7 jours sur tous vos appareils.'
      : 'IPTV-Service in der Schweiz — 37 000 HD/4K-Kanäle, unbegrenztes VOD und 7 Tage Replay auf allen Geräten.',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: SITE_CONFIG.phone,
      contactType: 'customer service',
      availableLanguage: ['French', 'German'],
      areaServed: 'CH',
    },
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'CH',
    },
    sameAs: [],
  };

  // WebSite Schema for sitelinks searchbox
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    inLanguage: isFr ? 'fr-CH' : 'de-CH',
  };

  // Product schemas for each plan.
  // priceValidUntil is hardcoded (not Date.now()-based) so the SSR output is
  // deterministic — non-deterministic JSON-LD breaks Vercel's edge cache and
  // can cause Google "Temporary processing error" on the structured data.
  // Bump this date manually each quarter.
  const priceValidUntil = '2026-12-31';

  const productSchemas = PLANS.map((plan) => ({
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: isFr ? plan.name_fr : plan.name_de,
    description: isFr ? plan.description_fr : plan.description_de,
    image: `${SITE_CONFIG.url}${plan.image}`,
    brand: {
      '@type': 'Brand',
      name: SITE_CONFIG.name,
    },
    offers: {
      '@type': 'Offer',
      price: plan.price,
      priceCurrency: 'CHF',
      availability: 'https://schema.org/InStock',
      priceValidUntil,
      seller: {
        '@type': 'Organization',
        name: SITE_CONFIG.name,
      },
      url: localeUrl(locale, `/plans/${plan.slug}`),
    },
  }));

  // FAQ Schema
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: (isFr
      ? [
          { q: 'Qu\'est-ce que IPTV Suisse ?', a: 'IPTV Suisse est un service de télévision par internet qui vous donne accès à plus de 37\'000 chaînes TV en direct, 40\'000+ films et 17\'000+ séries en streaming HD et 4K.' },
          { q: 'Quels appareils sont compatibles ?', a: 'Notre service est compatible avec tous les appareils : Smart TV, Android, iOS, Windows, Mac, Fire Stick et MAG.' },
          { q: 'Combien de temps prend l\'activation ?', a: 'L\'activation se fait en moins de 2 heures après confirmation du paiement.' },
          { q: 'Est-ce que le replay est inclus ?', a: 'Oui, la fonction replay est incluse dans tous nos abonnements jusqu\'à 7 jours en arrière.' },
          { q: 'Comment contacter le support ?', a: 'Notre équipe est disponible 24/7 par WhatsApp, email et téléphone avec réponse garantie en moins de 2 heures.' },
          { q: 'Puis-je utiliser le service sur plusieurs appareils ?', a: 'Les abonnements standard permettent l\'utilisation sur 1 appareil à la fois. Pour un usage sur plusieurs écrans simultanés, consultez nos offres multi-écrans.' },
          { q: 'L\'IPTV est-il légal en Suisse ?', a: 'En Suisse, la réception de contenus IPTV est autorisée pour un usage privé. Notre service respecte les réglementations en vigueur et propose un accès à des chaînes légitimes.' },
          { q: 'Ai-je besoin d\'un VPN pour IPTV ?', a: 'Non, notre service fonctionne parfaitement sans VPN en Suisse. Un VPN est optionnel pour plus de confidentialité.' },
          { q: 'Quelles chaînes suisses sont disponibles ?', a: 'Accédez à toutes les principales chaînes suisses francophones et germanophones, ainsi que des chaînes sportives, de divertissement et internationales de plus de 50 pays — soit 37\'000+ chaînes au total.' },
          { q: 'Puis-je regarder le football en direct ?', a: 'Oui ! Accédez aux principales chaînes sportives pour regarder le football, le hockey, le tennis et bien d\'autres sports en direct. Les plus grandes compétitions européennes et suisses sont couvertes.' },
          { q: 'Quelle vitesse internet est nécessaire ?', a: 'Une connexion de 10 Mbps suffit pour le streaming HD. Pour la 4K, nous recommandons 25 Mbps. Compatible avec Swisscom, Sunrise, Salt et tous les FAI suisses.' },
          { q: 'Y a-t-il un essai gratuit ?', a: 'Contactez notre support par WhatsApp pour demander un test gratuit de 24h et découvrir la qualité de notre service avant de vous engager.' },
        ]
      : [
          { q: 'Was ist IPTV Schweiz?', a: 'IPTV Schweiz ist ein Internet-TV-Service mit über 37\'000 Live-Kanälen, 40\'000+ Filmen und 17\'000+ Serien in HD und 4K.' },
          { q: 'Welche Geräte sind kompatibel?', a: 'Unser Service ist mit allen Geräten kompatibel: Smart TV, Android, iOS, Windows, Mac, Fire Stick und MAG.' },
          { q: 'Wie lange dauert die Aktivierung?', a: 'Die Aktivierung erfolgt in weniger als 2 Stunden nach Zahlungsbestätigung.' },
          { q: 'Ist Replay enthalten?', a: 'Ja, die Replay-Funktion ist in allen Abonnements bis zu 7 Tage zurück enthalten.' },
          { q: 'Wie erreiche ich den Support?', a: 'Unser Team ist 24/7 per WhatsApp, E-Mail und Telefon erreichbar mit garantierter Antwort in 2 Stunden.' },
          { q: 'Kann ich den Service auf mehreren Geräten nutzen?', a: 'Standard-Abonnements ermöglichen die Nutzung auf 1 Gerät gleichzeitig. Für die gleichzeitige Nutzung auf mehreren Bildschirmen, schauen Sie sich unsere Multi-Screen-Angebote an.' },
          { q: 'Ist IPTV in der Schweiz legal?', a: 'In der Schweiz ist der Empfang von IPTV-Inhalten für den privaten Gebrauch erlaubt. Unser Service hält sich an geltende Vorschriften und bietet Zugang zu legitimen Kanälen.' },
          { q: 'Brauche ich ein VPN für IPTV?', a: 'Nein, unser Service funktioniert in der Schweiz perfekt ohne VPN. Ein VPN ist optional für mehr Privatsphäre.' },
          { q: 'Welche Schweizer Kanäle sind verfügbar?', a: 'Zugang zu allen wichtigen Schweizer deutsch- und französischsprachigen Kanälen sowie Sport-, Unterhaltungs- und internationale Kanäle aus über 50 Ländern — insgesamt 37\'000+ Kanäle.' },
          { q: 'Kann ich Fussball live schauen?', a: 'Ja! Zugang zu den wichtigsten Sportkanälen für Fussball, Hockey, Tennis und viele weitere Sportarten live. Die grössten europäischen und Schweizer Wettbewerbe sind abgedeckt.' },
          { q: 'Welche Internetgeschwindigkeit wird benötigt?', a: 'Eine Verbindung von 10 Mbit/s reicht für HD-Streaming. Für 4K empfehlen wir 25 Mbit/s. Kompatibel mit Swisscom, Sunrise, Salt und allen Schweizer ISPs.' },
          { q: 'Gibt es einen kostenlosen Test?', a: 'Kontaktieren Sie unseren Support per WhatsApp für einen kostenlosen 24h-Test und entdecken Sie die Qualität unseres Services bevor Sie sich entscheiden.' },
        ]
    ).map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: a,
      },
    })),
  };

  // Service Schema — describes what we actually do (IPTV streaming subscription).
  // Helps Google classify the business correctly vs. assuming we're an
  // e-commerce shop selling physical goods.
  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: isFr ? 'Service IPTV' : 'IPTV-Dienst',
    provider: {
      '@type': 'Organization',
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.url,
    },
    areaServed: {
      '@type': 'Country',
      name: 'Switzerland',
    },
    name: isFr
      ? 'Abonnement IPTV Suisse — chaînes HD/4K, VOD et replay'
      : 'IPTV-Abonnement Schweiz — HD/4K-Kanäle, VOD und Replay',
    description: isFr
      ? 'Service de télévision par internet en Suisse : 37 000+ chaînes HD et 4K, VOD avec films et séries, replay 7 jours. Compatible Smart TV, mobile, ordinateur, Fire Stick et MAG.'
      : 'Internet-TV-Service in der Schweiz: 37 000+ HD- und 4K-Kanäle, VOD mit Filmen und Serien, 7 Tage Replay. Kompatibel mit Smart TV, Mobile, Computer, Fire Stick und MAG.',
    offers: PLANS.map((plan) => ({
      '@type': 'Offer',
      name: isFr ? plan.name_fr : plan.name_de,
      price: plan.price,
      priceCurrency: 'CHF',
      availability: 'https://schema.org/InStock',
      url: localeUrl(locale, `/plans/${plan.slug}`),
    })),
    availableChannel: {
      '@type': 'ServiceChannel',
      serviceUrl: SITE_CONFIG.url,
      availableLanguage: ['fr-CH', 'de-CH'],
    },
  };

  // LocalBusiness Schema
  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    telephone: SITE_CONFIG.phone,
    email: SITE_CONFIG.email,
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'CH',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '46.9480',
      longitude: '7.4474',
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '00:00',
      closes: '23:59',
    },
    priceRange: 'CHF 35.99 - CHF 179.99',
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      {productSchemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
    </>
  );
}
