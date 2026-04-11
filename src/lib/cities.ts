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

/** Netherlands cities only — IPTV Nederland (no legacy CH pages). */
export const CITIES_DATA: Record<string, CityData> = {
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
