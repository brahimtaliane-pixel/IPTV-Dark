// ============================================================
// City data for local SEO landing pages
// ============================================================

export interface CityData {
  name: string;
  canton: string;
  population: string;
  neighborhoods_fr: string[];
  neighborhoods_de: string[];
  /** Dutch — primary locale for IPTV Nederland (pages + JSON-LD). */
  meta_nl: { title: string; description: string; h1: string; intro: string };
  meta_de: { title: string; description: string; h1: string; intro: string };
}

export const CITIES_DATA: Record<string, CityData> = {
  geneve: {
    name: 'Genève',
    canton: 'GE',
    population: '200,000+',
    neighborhoods_fr: ['Carouge', 'Lancy', 'Vernier', 'Meyrin', 'Onex', 'Thônex'],
    neighborhoods_de: ['Carouge', 'Lancy', 'Vernier', 'Meyrin', 'Onex', 'Thônex'],
    meta_nl: {
      title: 'IPTV Genève | IPTV Nederland — 30.000+ zenders HD/4K 2026 | Vanaf 35,99 EUR',
      description:
        'Premium IPTV in Genève en Zwitserland: 30.000+ HD/4K-zenders, films en series on demand. Activatie binnen 2 uur, support 24/7. Werkt met Swisscom, Sunrise, Salt en andere providers.',
      h1: 'IPTV Genève — premium tv streamen',
      intro:
        'Het beste IPTV-aanbod voor Genève en het kanton: meer dan 30.000 zenders in HD en 4K, snelle activering en betrouwbare streams. Ideaal voor kijkers in Carouge, Lancy, Vernier en Meyrin — IPTV Nederland sluit aan op jouw internetverbinding.',
    },
    meta_de: {
      title: 'IPTV Genf - Bestes IPTV-Abo in Genf 2026 | Ab 35.99 EUR',
      description: 'Premium IPTV-Service in Genf. +30\'000 HD/4K-Kanäle, Filme und Serien. Aktivierung in 2h, 24/7 Support. Bestes IPTV-Abo Genf ab 35.99 EUR. Kompatibel mit Swisscom, Sunrise, Salt.',
      h1: 'IPTV Genf — Ihr Premium IPTV-Service',
      intro: 'Geniessen Sie den besten IPTV-Service in Genf mit über 30\'000 Kanälen in HD und 4K. Unser in der Schweiz ansässiges Team bietet reaktionsschnellen Kundensupport und schnelle Aktivierung für alle Einwohner von Genf und dem Kanton. Ob in Carouge, Lancy, Vernier oder Meyrin — unser IPTV Nederland Abo funktioniert einwandfrei mit allen lokalen Internetanbietern.',
    },
  },
  zurich: {
    name: 'Zürich',
    canton: 'ZH',
    population: '430,000+',
    neighborhoods_fr: ['Zurich-Ville', 'Winterthur', 'Oerlikon', 'Altstetten', 'Seebach'],
    neighborhoods_de: ['Zürich-Stadt', 'Winterthur', 'Oerlikon', 'Altstetten', 'Seebach'],
    meta_nl: {
      title: 'IPTV Zürich | IPTV Nederland — beste IPTV Zürich 2026 | Vanaf 35,99 EUR',
      description:
        'Premium IPTV in Zürich: 30.000+ HD/4K-zenders, grote VOD-bibliotheek, activatie binnen 2 uur. Compatibel met Swisscom, Sunrise, UPC en andere Zwitserse providers.',
      h1: 'IPTV Zürich — jouw premium IPTV-service',
      intro:
        'IPTV Nederland voor Zürich en omgeving: meer dan 30.000 zenders in HD/4K, vloeiend streamen en 24/7 ondersteuning. Werkt in de stad, Winterthur, Oerlikon en heel kanton Zürich met alle grote internetproviders.',
    },
    meta_de: {
      title: 'IPTV Zürich - Bestes IPTV-Abo in Zürich 2026 | Ab 35.99 EUR',
      description: 'Premium IPTV-Service in Zürich. +30\'000 HD/4K-Kanäle, Filme und Serien. Aktivierung in 2h, 24/7 Support. Bestes IPTV-Abo Zürich ab 35.99 EUR. Kompatibel mit Swisscom, Sunrise, UPC.',
      h1: 'IPTV Zürich — Ihr Premium IPTV-Service',
      intro: 'Entdecken Sie den besten IPTV-Service in Zürich mit über 30\'000 Kanälen in HD und 4K. Ob in der Stadt Zürich, Winterthur, Oerlikon oder im Kanton — geniessen Sie flüssiges Streaming und 24/7 Kundensupport. Unser IPTV Nederland Abo ist kompatibel mit Swisscom, Sunrise, UPC und allen ISPs der Region Zürich.',
    },
  },
  lausanne: {
    name: 'Lausanne',
    canton: 'VD',
    population: '140,000+',
    neighborhoods_fr: ['Ouchy', 'Flon', 'Pully', 'Renens', 'Morges', 'Vevey'],
    neighborhoods_de: ['Ouchy', 'Flon', 'Pully', 'Renens', 'Morges', 'Vevey'],
    meta_nl: {
      title: 'IPTV Lausanne | IPTV Nederland — Vaud & Lausanne 2026 | Vanaf 35,99 EUR',
      description:
        'IPTV in Lausanne: 30.000+ zenders HD/4K, 170.000+ films en series on demand. Snelle activatie, support 24/7. Werkt met Swisscom, Sunrise, Salt en andere providers.',
      h1: 'IPTV Lausanne — premium entertainment',
      intro:
        'IPTV Nederland voor Lausanne en kanton Vaud: volledig aanbod live tv, VOD en replay in HD/4K. Snel geactiveerd; geschikt voor Ouchy, Flon, Pully, Renens, Morges en omgeving.',
    },
    meta_de: {
      title: 'IPTV Lausanne - Bestes IPTV-Abo in Lausanne 2026 | Ab 35.99 EUR',
      description: 'Premium IPTV-Service in Lausanne. +30\'000 HD/4K-Kanäle, Filme und Serien. Aktivierung in 2h, 24/7 Support. Bestes IPTV-Abo Lausanne ab 35.99 EUR. Kompatibel mit allen ISPs.',
      h1: 'IPTV Lausanne — Ihr Premium IPTV-Service',
      intro: 'Der beste IPTV-Service in Lausanne und im gesamten Kanton Waadt. Über 30\'000 TV-Kanäle, 170\'000+ Filme und Serien on demand in HD/4K-Streaming mit schneller Aktivierung und französischsprachigem Support. Ob in Ouchy, Flon, Pully, Renens oder Morges — geniessen Sie ein hochwertiges IPTV Nederland Abo, kompatibel mit Swisscom, Sunrise und Salt.',
    },
  },
  bern: {
    name: 'Bern',
    canton: 'BE',
    population: '135,000+',
    neighborhoods_fr: ['Berne-Ville', 'Köniz', 'Ostermundigen', 'Muri bei Bern', 'Bümpliz'],
    neighborhoods_de: ['Bern-Stadt', 'Köniz', 'Ostermundigen', 'Muri bei Bern', 'Bümpliz'],
    meta_nl: {
      title: 'IPTV Bern | IPTV Nederland — IPTV in de bondsstad 2026 | Vanaf 35,99 EUR',
      description:
        'Premium IPTV in Bern: 30.000+ zenders HD/4K, VOD en replay. Activatie binnen 2 uur, 24/7 support. Compatibel met Swisscom, Sunrise en andere providers in kanton Bern.',
      h1: 'IPTV Bern — streamen in hart van Zwitserland',
      intro:
        'IPTV Nederland voor Bern en heel kanton Bern: meer dan 30.000 zenders, meertalige support en snelle activering. Werkt in Köniz, Ostermundigen, Muri bei Bern, Bümpliz en elders met alle gangbare internetproviders.',
    },
    meta_de: {
      title: 'IPTV Bern - Bestes IPTV-Abo in Bern 2026 | Ab 35.99 EUR',
      description: 'Premium IPTV-Service in Bern. +30\'000 HD/4K-Kanäle, Filme und Serien. Aktivierung in 2h, 24/7 Support. Bestes IPTV-Abo Bern ab 35.99 EUR. Kompatibel mit Swisscom, Sunrise.',
      h1: 'IPTV Bern — Ihr Premium IPTV-Service',
      intro: 'Geniessen Sie den besten IPTV-Service in Bern, der Schweizer Hauptstadt. Über 30\'000 HD/4K-Kanäle mit zweisprachigem Deutsch-Französisch-Support und schneller Aktivierung im gesamten Kanton Bern. Ob in Köniz, Ostermundigen, Muri bei Bern oder Bümpliz — unser IPTV Nederland Abo funktioniert mit allen Internetanbietern der Region Bern.',
    },
  },
  basel: {
    name: 'Basel',
    canton: 'BS',
    population: '180,000+',
    neighborhoods_fr: ['Bâle-Ville', 'Riehen', 'Binningen', 'Allschwil', 'Reinach'],
    neighborhoods_de: ['Basel-Stadt', 'Riehen', 'Binningen', 'Allschwil', 'Reinach'],
    meta_nl: {
      title: 'IPTV Basel | IPTV Nederland — drielandenregio 2026 | Vanaf 35,99 EUR',
      description:
        'IPTV in Basel: 30.000+ zenders (Zwitsers, Duits, Frans, internationaal) in HD/4K. Snel geactiveerd, 24/7 support. Geschikt voor Swisscom, Sunrise, Salt, UPC.',
      h1: 'IPTV Basel — premium streaming',
      intro:
        'IPTV Nederland voor Basel en de regio: groot zenderaanbod en stabiele streams. Werkt in Riehen, Binningen, Allschwil, Reinach en elders met alle grote providers.',
    },
    meta_de: {
      title: 'IPTV Basel - Bestes IPTV-Abo in Basel 2026 | Ab 35.99 EUR',
      description: 'Premium IPTV-Service in Basel. +30\'000 HD/4K-Kanäle, Filme und Serien. Aktivierung in 2h, 24/7 Support. Bestes IPTV-Abo Basel ab 35.99 EUR. Kompatibel mit allen ISPs.',
      h1: 'IPTV Basel — Ihr Premium IPTV-Service',
      intro: 'Der beste IPTV-Service in Basel und der Dreiländerregion. Über 30\'000 Schweizer, deutsche, französische und internationale Kanäle in HD/4K. Ob in Riehen, Binningen, Allschwil oder Reinach — geniessen Sie ein Premium IPTV Nederland Abo, kompatibel mit Swisscom, Sunrise, Salt und UPC.',
    },
  },
  // ── New cities for long-tail SEO ────────────────────────
  winterthur: {
    name: 'Winterthur',
    canton: 'ZH',
    population: '137,000+',
    neighborhoods_fr: ['Winterthour-Ville', 'Töss', 'Wülflingen', 'Seen'],
    neighborhoods_de: ['Winterthur-Stadt', 'Töss', 'Wülflingen', 'Seen'],
    meta_nl: {
      title: 'IPTV Winterthur | IPTV Nederland — kanton Zürich 2026 | Vanaf 35,99 EUR',
      description:
        'Premium IPTV in Winterthur: 30.000+ HD/4K-zenders, grote VOD. Activatie binnen 2 uur, 24/7 support. Werkt met alle providers in Winterthur en omgeving.',
      h1: 'IPTV Winterthur — jouw IPTV in het kanton Zürich',
      intro:
        'IPTV Nederland voor Winterthur, de tweede stad van kanton Zürich: meer dan 30.000 zenders, 170.000+ titels on demand en snelle activering. Compatibel met alle internetproviders ter plaatse.',
    },
    meta_de: {
      title: 'IPTV Winterthur - IPTV-Abo in Winterthur 2026 | Ab 35.99 EUR',
      description: 'Premium IPTV-Service in Winterthur. +30\'000 HD/4K-Kanäle. Aktivierung in 2h, 24/7 Support. IPTV-Abo Winterthur ab 35.99 EUR.',
      h1: 'IPTV Winterthur — Ihr Premium IPTV-Service',
      intro: 'Geniessen Sie den besten IPTV-Service in Winterthur, der zweitgrössten Stadt im Kanton Zürich. Über 30\'000 Kanäle in HD und 4K, VOD mit 170\'000+ Filmen und Serien on demand. Unser IPTV Nederland Abo wird in weniger als 2 Stunden aktiviert und funktioniert mit allen ISPs in Winterthur.',
    },
  },
  'st-gallen': {
    name: 'St. Gallen',
    canton: 'SG',
    population: '80,000+',
    neighborhoods_fr: ['Saint-Gall-Ville', 'Rorschach', 'Gossau', 'Herisau'],
    neighborhoods_de: ['St. Gallen-Stadt', 'Rorschach', 'Gossau', 'Herisau'],
    meta_nl: {
      title: 'IPTV St. Gallen | IPTV Nederland — Oost-Zwitserland 2026 | Vanaf 35,99 EUR',
      description:
        'IPTV in St. Gallen: 30.000+ zenders HD/4K, onbeperkte films en series. Activatie in ca. 2 uur, 24/7 support voor St. Gallen, Rorschach, Gossau en Herisau.',
      h1: 'IPTV St. Gallen — premium in Oost-Zwitserland',
      intro:
        'IPTV Nederland voor St. Gallen en de regio: groot zenderaanbod, snelle levering en betrouwbare streams voor heel de Oost-Zwitserse markt.',
    },
    meta_de: {
      title: 'IPTV St. Gallen - IPTV-Abo in St. Gallen 2026 | Ab 35.99 EUR',
      description: 'Premium IPTV-Service in St. Gallen. +30\'000 HD/4K-Kanäle. Aktivierung in 2h, 24/7 Support. IPTV-Abo St. Gallen ab 35.99 EUR.',
      h1: 'IPTV St. Gallen — Ihr Premium IPTV-Service',
      intro: 'Entdecken Sie den besten IPTV-Service in St. Gallen und der Ostschweiz. Über 30\'000 Kanäle in HD und 4K, unbegrenzte Filme und Serien. Schnelle Aktivierung in 2 Stunden und 24/7 Support für alle Einwohner von St. Gallen, Rorschach, Gossau und Herisau.',
    },
  },
  lugano: {
    name: 'Lugano',
    canton: 'TI',
    population: '65,000+',
    neighborhoods_fr: ['Lugano-Ville', 'Paradiso', 'Massagno', 'Viganello'],
    neighborhoods_de: ['Lugano-Stadt', 'Paradiso', 'Massagno', 'Viganello'],
    meta_nl: {
      title: 'IPTV Lugano | IPTV Nederland — Ticino & Italië 2026 | Vanaf 35,99 EUR',
      description:
        'IPTV in Lugano: Zwitsers, Italiaans en internationaal aanbod in HD/4K. Activatie binnen 2 uur. Ideaal voor Tessin en Italiaanse zenders.',
      h1: 'IPTV Lugano — streamen in het Tessin',
      intro:
        'IPTV Nederland voor Lugano en omgeving: meer dan 30.000 zenders, waaronder Zwitsers en Italiaans aanbod. Snel actief in Lugano, Paradiso en Massagno.',
    },
    meta_de: {
      title: 'IPTV Lugano - IPTV-Abo in Lugano 2026 | Ab 35.99 EUR',
      description: 'Premium IPTV-Service in Lugano. +30\'000 HD/4K-Kanäle, italienische Kanäle inklusive. Aktivierung in 2h. IPTV-Abo Lugano ab 35.99 EUR.',
      h1: 'IPTV Lugano — Ihr Premium IPTV-Service',
      intro: 'Der beste IPTV-Service in Lugano und im Tessin. Über 30\'000 Kanäle inklusive aller Schweizer, italienischer und internationaler Kanäle in HD und 4K. Aktivierung in 2 Stunden für alle Einwohner von Lugano, Paradiso und Massagno.',
    },
  },
  biel: {
    name: 'Biel/Bienne',
    canton: 'BE',
    population: '55,000+',
    neighborhoods_fr: ['Bienne-Ville', 'Nidau', 'Brügg', 'Port'],
    neighborhoods_de: ['Biel-Stadt', 'Nidau', 'Brügg', 'Port'],
    meta_nl: {
      title: 'IPTV Biel/Bienne | IPTV Nederland — tweetalig FR/DE 2026 | Vanaf 35,99 EUR',
      description:
        'IPTV in Biel/Bienne: 30.000+ zenders HD/4K, Franstalig en Duitstalig aanbod. Snelle activatie, meertalige support. Regio Biel, Nidau en omstreken.',
      h1: 'IPTV Biel — premium in tweetalig Zwitserland',
      intro:
        'IPTV Nederland voor de grootste tweetalige stad van Zwitserland: Frans- en Duitstalige zenders in HD/4K, snelle setup voor Biel, Nidau en de regio.',
    },
    meta_de: {
      title: 'IPTV Biel - IPTV-Abo in Biel 2026 | Ab 35.99 EUR',
      description: 'Premium IPTV-Service in Biel. +30\'000 HD/4K-Kanäle, zweisprachiger Support FR/DE. Aktivierung in 2h. IPTV-Abo Biel ab 35.99 EUR.',
      h1: 'IPTV Biel — Ihr Premium IPTV-Service',
      intro: 'Geniessen Sie den besten IPTV-Service in Biel, der grössten zweisprachigen Stadt der Schweiz. Über 30\'000 französisch- und deutschsprachige Kanäle in HD/4K. Zweisprachiger Support und schnelle Aktivierung für Biel, Nidau und die Region.',
    },
  },
  luzern: {
    name: 'Luzern',
    canton: 'LU',
    population: '82,000+',
    neighborhoods_fr: ['Lucerne-Ville', 'Emmen', 'Horw', 'Kriens'],
    neighborhoods_de: ['Luzern-Stadt', 'Emmen', 'Horw', 'Kriens'],
    meta_nl: {
      title: 'IPTV Luzern | IPTV Nederland — Centraal-Zwitserland 2026 | Vanaf 35,99 EUR',
      description:
        'IPTV in Luzern: 30.000+ HD/4K-zenders, 170.000+ films en series on demand. Activatie binnen 2 uur, 24/7 support in Luzern, Emmen, Horw en Kriens.',
      h1: 'IPTV Luzern — jouw IPTV in het Vierwoudstedenmeer',
      intro:
        'IPTV Nederland voor Luzern en Midden-Zwitserland: volledig pakket live tv en VOD, snelle activering en ondersteuning voor stad en regio.',
    },
    meta_de: {
      title: 'IPTV Luzern - IPTV-Abo in Luzern 2026 | Ab 35.99 EUR',
      description: 'Premium IPTV-Service in Luzern. +30\'000 HD/4K-Kanäle. Aktivierung in 2h, 24/7 Support. IPTV-Abo Luzern ab 35.99 EUR.',
      h1: 'IPTV Luzern — Ihr Premium IPTV-Service',
      intro: 'Entdecken Sie den besten IPTV-Service in Luzern und der Zentralschweiz. Über 30\'000 HD/4K-Kanäle, 170\'000+ Filme und Serien on demand. Schnelle Aktivierung und 24/7 Support für Luzern, Emmen, Horw und Kriens.',
    },
  },
  fribourg: {
    name: 'Fribourg',
    canton: 'FR',
    population: '40,000+',
    neighborhoods_fr: ['Fribourg-Ville', 'Villars-sur-Glâne', 'Givisiez', 'Granges-Paccot'],
    neighborhoods_de: ['Freiburg-Stadt', 'Villars-sur-Glâne', 'Givisiez', 'Granges-Paccot'],
    meta_nl: {
      title: 'IPTV Fribourg | IPTV Nederland — tweetalig FR/DE 2026 | Vanaf 35,99 EUR',
      description:
        'IPTV in Fribourg: 30.000+ zenders HD/4K, Franstalig en Duitstalig aanbod. Activatie binnen 2 uur, 24/7 meertalige support.',
      h1: 'IPTV Fribourg — premium in het hart van Zwitserland',
      intro:
        'IPTV Nederland voor Fribourg en regio: Frans- en Duitstalige zenders, snelle activering voor Fribourg, Villars-sur-Glâne en heel het kanton.',
    },
    meta_de: {
      title: 'IPTV Freiburg - IPTV-Abo in Freiburg 2026 | Ab 35.99 EUR',
      description: 'Premium IPTV-Service in Freiburg. +30\'000 HD/4K-Kanäle, zweisprachiger Support. Aktivierung in 2h. IPTV-Abo Freiburg ab 35.99 EUR.',
      h1: 'IPTV Freiburg — Ihr Premium IPTV-Service',
      intro: 'Der beste IPTV-Service in Freiburg, der zweisprachigen Stadt im Herzen der Schweiz. Über 30\'000 französisch- und deutschsprachige Kanäle in HD/4K. Zweisprachiger 24/7-Support, Aktivierung in 2 Stunden für Freiburg, Villars-sur-Glâne und die gesamte Region.',
    },
  },
  neuchatel: {
    name: 'Neuchâtel',
    canton: 'NE',
    population: '35,000+',
    neighborhoods_fr: ['Neuchâtel-Ville', 'La Chaux-de-Fonds', 'Le Locle', 'Peseux'],
    neighborhoods_de: ['Neuenburg-Stadt', 'La Chaux-de-Fonds', 'Le Locle', 'Peseux'],
    meta_nl: {
      title: 'IPTV Neuchâtel | IPTV Nederland — kanton Neuchâtel 2026 | Vanaf 35,99 EUR',
      description:
        'IPTV in Neuchâtel: 30.000+ zenders HD/4K, 170.000+ films en series, replay. Snel geactiveerd; 24/7 support voor Neuchâtel, La Chaux-de-Fonds en Le Locle.',
      h1: 'IPTV Neuchâtel — Franstalig Zwitserland',
      intro:
        'IPTV Nederland voor Neuchâtel en heel het kanton: volledig aanbod, Franstalige ondersteuning en snelle installatie in de belangrijkste steden.',
    },
    meta_de: {
      title: 'IPTV Neuenburg - IPTV-Abo in Neuenburg 2026 | Ab 35.99 EUR',
      description: 'Premium IPTV-Service in Neuenburg. +30\'000 HD/4K-Kanäle. Aktivierung in 2h, 24/7 Support. IPTV-Abo Neuenburg ab 35.99 EUR.',
      h1: 'IPTV Neuenburg — Ihr Premium IPTV-Service',
      intro: 'Geniessen Sie den besten IPTV-Service in Neuenburg und im gesamten Kanton. Über 30\'000 Kanäle in HD/4K, 170\'000+ Filme und Serien on demand und integriertes Replay. Schnelle Aktivierung für Neuenburg, La Chaux-de-Fonds und Le Locle. Französischsprachiger 24/7-Support.',
    },
  },
  thun: {
    name: 'Thun',
    canton: 'BE',
    population: '45,000+',
    neighborhoods_fr: ['Thoune-Ville', 'Steffisburg', 'Spiez', 'Heimberg'],
    neighborhoods_de: ['Thun-Stadt', 'Steffisburg', 'Spiez', 'Heimberg'],
    meta_nl: {
      title: 'IPTV Thun | IPTV Nederland — Berner Oberland 2026 | Vanaf 35,99 EUR',
      description:
        'IPTV in Thun: 30.000+ HD/4K-zenders. Activatie binnen 2 uur, 24/7 support. Geschikt voor Thun, Steffisburg, Spiez, Heimberg en Berner Oberland.',
      h1: 'IPTV Thun — streamen in het Berner Oberland',
      intro:
        'IPTV Nederland voor Thun en de regio: stabiele streams en snelle activering met alle gangbare internetproviders in het Oberland.',
    },
    meta_de: {
      title: 'IPTV Thun - IPTV-Abo in Thun 2026 | Ab 35.99 EUR',
      description: 'Premium IPTV-Service in Thun. +30\'000 HD/4K-Kanäle. Aktivierung in 2h, 24/7 Support. IPTV-Abo Thun ab 35.99 EUR.',
      h1: 'IPTV Thun — Ihr Premium IPTV-Service',
      intro: 'Der beste IPTV-Service in Thun und im Berner Oberland. Über 30\'000 Kanäle in HD/4K mit schneller Aktivierung. Kompatibel mit allen ISPs der Region Thun, Steffisburg, Spiez und Heimberg.',
    },
  },
  // ── Nederland (IPTV Nederland) ───────────────────────────
  amsterdam: {
    name: 'Amsterdam',
    canton: 'Noord-Holland',
    population: '900,000+',
    neighborhoods_fr: ['Centrum', 'Noord', 'Zuid', 'Oost', 'West'],
    neighborhoods_de: ['Centrum', 'Noord', 'Zuid', 'Oost', 'West'],
    meta_nl: {
      title: 'IPTV Amsterdam | IPTV Nederland — 30.000+ zenders HD/4K 2026',
      description: 'IPTV in Amsterdam: 30.000+ zenders, 170.000+ films en series on demand, replay. Activatie binnen 2 uur. KPN, Ziggo, T-Mobile, glasvezel. Nederlandstalige support.',
      h1: 'IPTV Amsterdam — premium TV op elk apparaat',
      intro: 'IPTV Nederland voor Amsterdam en regio: stabiele streams, 30.000+ zenders HD/4K, ruim 170.000 films en series on demand, sport en entertainment. Werkt op glasvezel en kabel. Support 24/7 in het Nederlands.',
    },
    meta_de: {
      title: 'IPTV Amsterdam | IPTV Niederlande 2026',
      description: 'IPTV in Amsterdam: 30.000+ Sender, grosse VOD-Bibliothek, schnelle Aktivierung.',
      h1: 'IPTV Amsterdam',
      intro: 'Premium-IPTV für Amsterdam mit deutschsprachigem Infomaterial und EU-weitem Service.',
    },
  },
  rotterdam: {
    name: 'Rotterdam',
    canton: 'Zuid-Holland',
    population: '650,000+',
    neighborhoods_fr: ['Centrum', 'Kralingen', 'Feijenoord', 'Hillegersberg', 'Schiedam'],
    neighborhoods_de: ['Centrum', 'Kralingen', 'Feijenoord', 'Hillegersberg', 'Schiedam'],
    meta_nl: {
      title: 'IPTV Rotterdam | IPTV Nederland — streaming Zuid-Holland',
      description: 'IPTV Rotterdam: duizenden zenders HD/4K, replay, VOD. Ziggo, KPN, glasvezel. Activering snel geregeld.',
      h1: 'IPTV Rotterdam — jouw entertainment',
      intro: 'Kijk IPTV in Rotterdam en omgeving met volledige Eredivisie, internationale sport en VOD. Ideaal voor KPN- en Ziggo-verbindingen.',
    },
    meta_de: {
      title: 'IPTV Rotterdam | IPTV Niederlande',
      description: 'IPTV Rotterdam mit HD/4K und schneller Aktivierung.',
      h1: 'IPTV Rotterdam',
      intro: 'IPTV-Service für Rotterdam und die Region Zuid-Holland.',
    },
  },
  'den-haag': {
    name: 'Den Haag',
    canton: 'Zuid-Holland',
    population: '550,000+',
    neighborhoods_fr: ['Centrum', 'Scheveningen', 'Loosduinen', 'Escamp', 'Laak'],
    neighborhoods_de: ['Centrum', 'Scheveningen', 'Loosduinen', 'Escamp', 'Laak'],
    meta_nl: {
      title: 'IPTV Den Haag | IPTV Nederland — Scheveningen & regio',
      description: 'IPTV Den Haag: premium TV, 30.000+ zenders, 170.000+ films en series, replay. Werkt overal in de regio Haaglanden.',
      h1: 'IPTV Den Haag — thuis en onderweg',
      intro: 'IPTV Nederland in Den Haag: nieuws, sport, internationale zenders en kinderzenders. Snelle setup en lokale ondersteuning.',
    },
    meta_de: {
      title: 'IPTV Den Haag | IPTV Niederlande',
      description: 'IPTV im Haag mit HD/4K und Replay.',
      h1: 'IPTV Den Haag',
      intro: 'IPTV für Den Haag und die Region Haaglanden.',
    },
  },
  utrecht: {
    name: 'Utrecht',
    canton: 'Utrecht',
    population: '360,000+',
    neighborhoods_fr: ['Binnenstad', 'Overvecht', 'Leidsche Rijn', 'Vleuten', 'Nieuwegein'],
    neighborhoods_de: ['Binnenstad', 'Overvecht', 'Leidsche Rijn', 'Vleuten', 'Nieuwegein'],
    meta_nl: {
      title: 'IPTV Utrecht | IPTV Nederland — centraal Nederland',
      description: 'IPTV Utrecht: glasvezel en kabel, 30.000+ zenders, grote VOD. Activering binnen 2 uur.',
      h1: 'IPTV Utrecht — midden in het land',
      intro: 'Van Utrecht stad tot de regio: dezelfde betrouwbare IPTV-service met Nederlandstalige helpdesk.',
    },
    meta_de: {
      title: 'IPTV Utrecht | IPTV Niederlande',
      description: 'IPTV Utrecht mit schneller Aktivierung.',
      h1: 'IPTV Utrecht',
      intro: 'IPTV für Utrecht und Umgebung.',
    },
  },
  eindhoven: {
    name: 'Eindhoven',
    canton: 'Noord-Brabant',
    population: '240,000+',
    neighborhoods_fr: ['Centrum', 'Woensel', 'Stratum', 'Gestel', 'Veldhoven'],
    neighborhoods_de: ['Centrum', 'Woensel', 'Stratum', 'Gestel', 'Veldhoven'],
    meta_nl: {
      title: 'IPTV Eindhoven | IPTV Nederland — Brainport regio',
      description: 'IPTV Eindhoven: HD/4K, sport, films. Ziggo, KPN, glasvezel in Brabant.',
      h1: 'IPTV Eindhoven — Brainport kijkt mee',
      intro: 'Premium IPTV voor Eindhoven en omstreken: technische sportzenders, internationaal aanbod en stabiele streams.',
    },
    meta_de: {
      title: 'IPTV Eindhoven | IPTV Niederlande',
      description: 'IPTV Eindhoven Brainport Region.',
      h1: 'IPTV Eindhoven',
      intro: 'IPTV für Eindhoven und Noord-Brabant.',
    },
  },
  groningen: {
    name: 'Groningen',
    canton: 'Groningen',
    population: '235,000+',
    neighborhoods_fr: ['Centrum', 'Helpman', 'Vinkhuizen', 'Hoogkerk', 'Haren'],
    neighborhoods_de: ['Centrum', 'Helpman', 'Vinkhuizen', 'Hoogkerk', 'Haren'],
    meta_nl: {
      title: 'IPTV Groningen | IPTV Nederland — noorden',
      description: 'IPTV Groningen: volledig aanbod, ook voor studenten en expats. Snelle levering.',
      h1: 'IPTV Groningen — het noorden online',
      intro: 'IPTV Nederland in Groningen: stabiele verbindingen voor stad en provincie, met alle Nederlandse en internationale zenders.',
    },
    meta_de: {
      title: 'IPTV Groningen | IPTV Niederlande',
      description: 'IPTV Groningen Nordniederlande.',
      h1: 'IPTV Groningen',
      intro: 'IPTV für Groningen Stadt und Provinz.',
    },
  },
  tilburg: {
    name: 'Tilburg',
    canton: 'Noord-Brabant',
    population: '225,000+',
    neighborhoods_fr: ['Centrum', 'Reeshof', 'Udenhout', 'Berkel-Enschot'],
    neighborhoods_de: ['Centrum', 'Reeshof', 'Udenhout', 'Berkel-Enschot'],
    meta_nl: {
      title: 'IPTV Tilburg | IPTV Nederland — Brabant',
      description: 'IPTV Tilburg: premium pakketten, multi-scherm, VOD.',
      h1: 'IPTV Tilburg',
      intro: 'Kijk IPTV in Tilburg met volledige dekking en Nederlandstalige support.',
    },
    meta_de: {
      title: 'IPTV Tilburg | IPTV Niederlande',
      description: 'IPTV Tilburg Brabant.',
      h1: 'IPTV Tilburg',
      intro: 'IPTV für Tilburg.',
    },
  },
  almere: {
    name: 'Almere',
    canton: 'Flevoland',
    population: '220,000+',
    neighborhoods_fr: ['Centrum', 'Almere Stad', 'Almere Buiten', 'Poort'],
    neighborhoods_de: ['Centrum', 'Almere Stad', 'Almere Buiten', 'Poort'],
    meta_nl: {
      title: 'IPTV Almere | IPTV Nederland — Flevoland',
      description: 'IPTV Almere: glasvezelvriendelijk, snelle activatie, alle zenders.',
      h1: 'IPTV Almere',
      intro: 'Nieuwbouw en snel internet: IPTV Nederland sluit naadloos aan op jouw verbinding in Almere.',
    },
    meta_de: {
      title: 'IPTV Almere | IPTV Niederlande',
      description: 'IPTV Almere Flevoland.',
      h1: 'IPTV Almere',
      intro: 'IPTV für Almere.',
    },
  },
  maastricht: {
    name: 'Maastricht',
    canton: 'Limburg',
    population: '120,000+',
    neighborhoods_fr: ['Centrum', 'Wyck', 'Heer', 'Randwyck'],
    neighborhoods_de: ['Centrum', 'Wyck', 'Heer', 'Randwyck'],
    meta_nl: {
      title: 'IPTV Maastricht | IPTV Nederland — Zuid-Limburg',
      description: 'IPTV Maastricht: Belgische en Nederlandse zenders, sport, cultuur.',
      h1: 'IPTV Maastricht',
      intro: 'In het zuiden van Limburg: IPTV met Nederlands en Belgisch aanbod, ideaal voor de grensregio.',
    },
    meta_de: {
      title: 'IPTV Maastricht | IPTV Niederlande',
      description: 'IPTV Maastricht Limburg.',
      h1: 'IPTV Maastricht',
      intro: 'IPTV für Maastricht.',
    },
  },
  haarlem: {
    name: 'Haarlem',
    canton: 'Noord-Holland',
    population: '165,000+',
    neighborhoods_fr: ['Centrum', 'Schalkwijk', 'Overveen', 'Spaarndam'],
    neighborhoods_de: ['Centrum', 'Schalkwijk', 'Overveen', 'Spaarndam'],
    meta_nl: {
      title: 'IPTV Haarlem | IPTV Nederland — Kennemerland',
      description: 'IPTV Haarlem: regionale en landelijke zenders in HD/4K.',
      h1: 'IPTV Haarlem',
      intro: 'IPTV Nederland in Haarlem en Kennemerland: betrouwbaar streamen met lokale en internationale content.',
    },
    meta_de: {
      title: 'IPTV Haarlem | IPTV Niederlande',
      description: 'IPTV Haarlem Kennemerland.',
      h1: 'IPTV Haarlem',
      intro: 'IPTV für Haarlem.',
    },
  },
  arnhem: {
    name: 'Arnhem',
    canton: 'Gelderland',
    population: '165,000+',
    neighborhoods_fr: ['Centrum', 'Velp', 'Duiven', 'Elst'],
    neighborhoods_de: ['Centrum', 'Velp', 'Duiven', 'Elst'],
    meta_nl: {
      title: 'IPTV Arnhem | IPTV Nederland — Gelderland',
      description: 'IPTV Arnhem: Veluwe en regio, sport en nieuws.',
      h1: 'IPTV Arnhem',
      intro: 'Premium IPTV voor Arnhem en de regio: stabiele service voor kabel en glasvezel.',
    },
    meta_de: {
      title: 'IPTV Arnhem | IPTV Niederlande',
      description: 'IPTV Arnhem Gelderland.',
      h1: 'IPTV Arnhem',
      intro: 'IPTV für Arnhem.',
    },
  },
  zwolle: {
    name: 'Zwolle',
    canton: 'Overijssel',
    population: '130,000+',
    neighborhoods_fr: ['Centrum', 'Assendorp', 'Diezerpoort', 'Hattem'],
    neighborhoods_de: ['Centrum', 'Assendorp', 'Diezerpoort', 'Hattem'],
    meta_nl: {
      title: 'IPTV Zwolle | IPTV Nederland — Overijssel',
      description: 'IPTV Zwolle: noordoost Nederland, snelle support.',
      h1: 'IPTV Zwolle',
      intro: 'IPTV Nederland in Zwolle: volledig pakket voor stad en omliggende gemeenten.',
    },
    meta_de: {
      title: 'IPTV Zwolle | IPTV Niederlande',
      description: 'IPTV Zwolle Overijssel.',
      h1: 'IPTV Zwolle',
      intro: 'IPTV für Zwolle.',
    },
  },
  breda: {
    name: 'Breda',
    canton: 'Noord-Brabant',
    population: '185,000+',
    neighborhoods_fr: ['Centrum', 'Princenhage', 'Teteringen', 'Oosterhout'],
    neighborhoods_de: ['Centrum', 'Princenhage', 'Teteringen', 'Oosterhout'],
    meta_nl: {
      title: 'IPTV Breda | IPTV Nederland — West-Brabant',
      description: 'IPTV Breda: grote stad, volledig IPTV-aanbod.',
      h1: 'IPTV Breda',
      intro: 'In Breda en West-Brabant: IPTV Nederland met alle populaire zenders en multi-scherm opties.',
    },
    meta_de: {
      title: 'IPTV Breda | IPTV Niederlande',
      description: 'IPTV Breda West-Brabant.',
      h1: 'IPTV Breda',
      intro: 'IPTV für Breda.',
    },
  },
};

// All city slugs for sitemap generation and static params
export const ALL_CITY_SLUGS = Object.keys(CITIES_DATA);

// NL city slug list: @/lib/nl-city-slugs — do not import this file only for slugs in Client Components
