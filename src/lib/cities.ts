// ============================================================
// City data for local SEO landing pages
// ============================================================

export interface CityData {
  name: string;
  canton: string;
  population: string;
  /** Wijknamen / regio voor NL-pagina (dekking-sectie) */
  neighborhoods_nl: string[];
  neighborhoods_de: string[];
  /** Dutch — primary locale for IPTV Dark (pages + JSON-LD). */
  meta_nl: { title: string; description: string; h1: string; intro: string };
  meta_de: { title: string; description: string; h1: string; intro: string };
}

/** Netherlands cities only — IPTV Dark (no legacy CH pages). */
export const CITIES_DATA: Record<string, CityData> = {
  amsterdam: {
    name: 'Amsterdam',
    canton: 'Noord-Holland',
    population: '900,000+',
    neighborhoods_nl: ['Centrum', 'Noord', 'Zuid', 'Oost', 'West'],
    neighborhoods_de: ['Centrum', 'Noord', 'Zuid', 'Oost', 'West'],
    meta_nl: {
      title: 'IPTV Amsterdam | IPTV Dark — 32.000+ zenders HD/4K',
      description:
        'IPTV Dark Amsterdam: 32.000+ zenders, meer dan 175.000 films en meer dan 175.000 series on demand, 7 dagen replay. KPN, Ziggo, glasvezel. Activering binnen 2 uur, support 24/7.',
      h1: 'IPTV Amsterdam — IPTV Dark op elk scherm',
      intro:
        'Van het centrum tot Amsterdam-Noord en -Zuid: premium IPTV Dark met het volledige aanbod — 32.000+ zenders, enorme VOD en replay. Perfect voor snel glasvezel en kabel; activering meestal binnen 2 uur, hulp in het Nederlands.',
    },
    meta_de: {
      title: 'IPTV Amsterdam | IPTV Niederlande 2026',
      description: 'IPTV in Amsterdam: 32.000+ Sender, grosse VOD-Bibliothek, schnelle Aktivierung.',
      h1: 'IPTV Amsterdam',
      intro: 'Premium-IPTV für Amsterdam mit deutschsprachigem Infomaterial und EU-weitem Service.',
    },
  },
  rotterdam: {
    name: 'Rotterdam',
    canton: 'Zuid-Holland',
    population: '650,000+',
    neighborhoods_nl: ['Centrum', 'Kralingen', 'Feijenoord', 'Hillegersberg', 'Schiedam'],
    neighborhoods_de: ['Centrum', 'Kralingen', 'Feijenoord', 'Hillegersberg', 'Schiedam'],
    meta_nl: {
      title: 'IPTV Rotterdam | IPTV Dark — Zuid-Holland 4K',
      description:
        'IPTV Dark Rotterdam: 32.000+ zenders HD/4K, meer dan 175.000 films en series on demand, replay. Ziggo, KPN, glasvezel. Activering binnen 2 uur.',
      h1: 'IPTV Rotterdam — havenstad, thuis scherp beeld',
      intro:
        'Rotterdam en regio: IPTV Dark levert stabiele streams voor sport, nieuws en series — hetzelfde pakket als landelijk, lokaal geoptimaliseerd voor jouw verbinding. Multi-scherm mogelijk; support 24/7.',
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
    neighborhoods_nl: ['Centrum', 'Scheveningen', 'Loosduinen', 'Escamp', 'Laak'],
    neighborhoods_de: ['Centrum', 'Scheveningen', 'Loosduinen', 'Escamp', 'Laak'],
    meta_nl: {
      title: 'IPTV Den Haag | IPTV Dark — Haaglanden & Scheveningen',
      description:
        'IPTV Dark Den Haag: 32.000+ zenders, 175.000+ films en series on demand, replay. Werkt in de hele regio Haaglanden. Activering binnen 2 uur.',
      h1: 'IPTV Den Haag — regeringsstad, soepele streams',
      intro:
        'Van Scheveningen tot Escamp: IPTV Dark met volledig Nederlands en internationaal aanbod. Geen aparte provider-box nodig — werkt op KPN, Ziggo en glasvezel. Zelfde premiumdienst als op iptvdark4k.nl.',
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
    neighborhoods_nl: ['Binnenstad', 'Overvecht', 'Leidsche Rijn', 'Vleuten', 'Nieuwegein'],
    neighborhoods_de: ['Binnenstad', 'Overvecht', 'Leidsche Rijn', 'Vleuten', 'Nieuwegein'],
    meta_nl: {
      title: 'IPTV Utrecht | IPTV Dark — centraal Nederland',
      description:
        'IPTV Dark Utrecht: 32.000+ zenders HD/4K, meer dan 175.000 films en series on demand, replay. Glasvezel & kabel. Activering binnen 2 uur.',
      h1: 'IPTV Utrecht — het hart van NL in 4K',
      intro:
        'Utrecht en regio: centraal gelegen, centraal hetzelfde IPTV Dark-aanbod — sport, film, kids en nieuws. Ideaal voor studenten en gezinnen; snelle activatie en duidelijke instructies in het Nederlands.',
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
    neighborhoods_nl: ['Centrum', 'Woensel', 'Stratum', 'Gestel', 'Veldhoven'],
    neighborhoods_de: ['Centrum', 'Woensel', 'Stratum', 'Gestel', 'Veldhoven'],
    meta_nl: {
      title: 'IPTV Eindhoven | IPTV Dark — Brainport 4K',
      description:
        'IPTV Dark Eindhoven: 32.000+ zenders, enorme VOD (175.000+ films & series), replay. Ziggo, KPN, glasvezel in Noord-Brabant.',
      h1: 'IPTV Eindhoven — Brainport, scherp beeld',
      intro:
        'High-tech stad, high-bitrate streams: IPTV Dark voor Eindhoven en Brainport-regio. Formule 1, voetbal, series en 4K op je Smart TV of stick — zonder ingewikkelde hardware van je provider.',
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
    neighborhoods_nl: ['Centrum', 'Helpman', 'Vinkhuizen', 'Hoogkerk', 'Haren'],
    neighborhoods_de: ['Centrum', 'Helpman', 'Vinkhuizen', 'Hoogkerk', 'Haren'],
    meta_nl: {
      title: 'IPTV Groningen | IPTV Dark — noorden van NL',
      description:
        'IPTV Dark Groningen: 32.000+ zenders, 175.000+ films en series on demand, replay. Studenten & expats welkom. Activering binnen 2 uur.',
      h1: 'IPTV Groningen — noordelijk, volledig aanbod',
      intro:
        'Stad en provincie Groningen: hetzelfde zwarte IPTV Dark-label als landelijk — stabiel op snelle studenten-wifi en thuisglasvezel. Nederlands en internationaal; support bereikbaar wanneer jij kijkt.',
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
    neighborhoods_nl: ['Centrum', 'Reeshof', 'Udenhout', 'Berkel-Enschot'],
    neighborhoods_de: ['Centrum', 'Reeshof', 'Udenhout', 'Berkel-Enschot'],
    meta_nl: {
      title: 'IPTV Tilburg | IPTV Dark — Noord-Brabant',
      description:
        'IPTV Dark Tilburg: 32.000+ zenders HD/4K, meer dan 175.000 films en series, replay & multi-scherm. Activering binnen 2 uur.',
      h1: 'IPTV Tilburg — Brabants kijken met IPTV Dark',
      intro:
        'Tilburg en omliggende dorpen: premium IPTV Dark met lokaal en landelijk nieuws, sport en VOD. Geen gedoe — één abonnement, alle zenders, Nederlandstalige helpdesk.',
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
    neighborhoods_nl: ['Centrum', 'Almere Stad', 'Almere Buiten', 'Poort'],
    neighborhoods_de: ['Centrum', 'Almere Stad', 'Almere Buiten', 'Poort'],
    meta_nl: {
      title: 'IPTV Almere | IPTV Dark — Flevoland glasvezel',
      description:
        'IPTV Dark Almere: 32.000+ zenders, enorme VOD-bibliotheek, replay. Ideaal op snel glasvezel. Activering binnen 2 uur.',
      h1: 'IPTV Almere — nieuwe stad, snelle IPTV Dark',
      intro:
        'Almere Stad tot Almere Buiten: moderne woningen verdienen moderne TV. IPTV Dark profiteert van snelle verbindingen in Flevoland — 4K-ready, geen oude kabeldecoder nodig.',
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
    neighborhoods_nl: ['Centrum', 'Wyck', 'Heer', 'Randwyck'],
    neighborhoods_de: ['Centrum', 'Wyck', 'Heer', 'Randwyck'],
    meta_nl: {
      title: 'IPTV Maastricht | IPTV Dark — Zuid-Limburg & grens',
      description:
        'IPTV Dark Maastricht: NL + BE zenders, 32.000+ kanalen, 175.000+ films en series, replay. Perfect voor de Euregio.',
      h1: 'IPTV Maastricht — grensstad, dubbel aanbod',
      intro:
        'Zuid-Limburg: IPTV Dark combineert Nederlands en Belgisch kijkplezier met internationaal sport en film. Handig voor wie in de Euregio woont — zelfde premiumdienst als op iptvdark4k.nl.',
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
    neighborhoods_nl: ['Centrum', 'Schalkwijk', 'Overveen', 'Spaarndam'],
    neighborhoods_de: ['Centrum', 'Schalkwijk', 'Overveen', 'Spaarndam'],
    meta_nl: {
      title: 'IPTV Haarlem | IPTV Dark — Kennemerland',
      description:
        'IPTV Dark Haarlem: 32.000+ zenders HD/4K, meer dan 175.000 films en series on demand, replay. Strand & stad.',
      h1: 'IPTV Haarlem — Kennemerland in kleur',
      intro:
        'Tussen Amsterdam en zee: IPTV Dark voor Haarlem en omgeving — regionale omroepen, RTL, NPO en wereldwijd sport. Stabiel op Ziggo en KPN; snelle activatie en heldere Nederlandse support.',
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
    neighborhoods_nl: ['Centrum', 'Velp', 'Duiven', 'Elst'],
    neighborhoods_de: ['Centrum', 'Velp', 'Duiven', 'Elst'],
    meta_nl: {
      title: 'IPTV Arnhem | IPTV Dark — Gelderland & Veluwe',
      description:
        'IPTV Dark Arnhem: 32.000+ zenders, grote VOD, replay tot 7 dagen. Veluwe, stad en regio. Activering binnen 2 uur.',
      h1: 'IPTV Arnhem — Veluwezoom, scherp thuis',
      intro:
        'Arnhem en de regio: IPTV Dark levert voetbal, NPO, internationale zenders en kindercontent — op glasvezel en kabel. Geen wachten op monteurs: digitaal geactiveerd, direct kijken.',
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
    neighborhoods_nl: ['Centrum', 'Assendorp', 'Diezerpoort', 'Hattem'],
    neighborhoods_de: ['Centrum', 'Assendorp', 'Diezerpoort', 'Hattem'],
    meta_nl: {
      title: 'IPTV Zwolle | IPTV Dark — Overijssel & IJsselstad',
      description:
        'IPTV Dark Zwolle: 32.000+ zenders HD/4K, 175.000+ films en series, replay. Noordoost-Nederland. Support 24/7.',
      h1: 'IPTV Zwolle — IJsselstad, landelijk aanbod',
      intro:
        'Zwolle en omliggende gemeenten: het volledige IPTV Dark-pakket — van lokale streekzenders tot wereldvoetbal. Betrouwbaar streamen op elk apparaat; activering meestal dezelfde dag.',
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
    neighborhoods_nl: ['Centrum', 'Princenhage', 'Teteringen', 'Oosterhout'],
    neighborhoods_de: ['Centrum', 'Princenhage', 'Teteringen', 'Oosterhout'],
    meta_nl: {
      title: 'IPTV Breda | IPTV Dark — West-Brabant',
      description:
        'IPTV Dark Breda: 32.000+ zenders, meer dan 175.000 films en series on demand, replay. Multi-scherm voor gezinnen. Activering binnen 2 uur.',
      h1: 'IPTV Breda — baronie-stad, premium stream',
      intro:
        'Breda en West-Brabant: IPTV Dark met regionaal en landelijk nieuws, sport, film en series — alles in één premium merk. Geschikt voor Ziggo & KPN; geen extra TV-pakket bij je provider nodig.',
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
