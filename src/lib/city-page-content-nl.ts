/**
 * Unieke sectieteksten per stadspagina (NL) — los van meta (titles/intro in cities.ts).
 * Gebruikt door CityPageClient + FAQ-schema op de server.
 */

export type CityHighlightNl = { title: string; desc: string };

export type CityFaqItemNl = { q: string; a: string };

export type CityPageSectionsNl = {
  /** H2 boven de bulletlijst */
  whyHeading: string;
  /** Precies 5 punten — elk uniek per stad */
  bullets: [string, string, string, string, string];
  /** 3 kaarten rechts naast bullets */
  highlights: [CityHighlightNl, CityHighlightNl, CityHighlightNl];
  /** H2 boven prijskaarten */
  plansTitle: string;
  plansLead: string;
  /** Internet / provider-blok */
  internet: { title: string; body: string };
  /** Dekking / wijken-blok */
  coverage: { title: string; body: string };
  /** H2 boven FAQ */
  faqSectionTitle: string;
  /** 5 vragen — volledig andere formulering dan eerdere generieke FAQ */
  faq: [CityFaqItemNl, CityFaqItemNl, CityFaqItemNl, CityFaqItemNl, CityFaqItemNl];
  /** H2 boven steden-chips */
  nearbyTitle: string;
};

export const CITY_PAGE_SECTIONS_NL: Record<string, CityPageSectionsNl> = {
  amsterdam: {
    whyHeading: 'Waarom kiest de hoofdstad voor IPTV Dark?',
    bullets: [
      'Grachten of hoogbouw: overal hetzelfde zwarte premiummerk — geen aparte “TV-pakketten” meer stapelen.',
      'Live-kanalen en on-demand vullen elkaar aan: sport kijk je live, series wanneer jij wilt.',
      'KPN, Ziggo of glasvezel: je router blijft gewoon je router; wij leveren de stream.',
      'Vraag of storing? Onze helpdesk praat Nederlands en denkt mee met typische Amsterdamse setups (WiFi in oud bouw, enz.).',
      'Geen monteur aan de deur: na betaling volgt digitale activatie — meestal binnen twee uur mail.',
    ],
    highlights: [
      { title: 'Stadsbreed dezelfde catalogus', desc: 'Van Noord tot Zuidoost: 32.000+ zenders plus enorme film- en seriebibliotheek.' },
      { title: '4K waar je scherm het aankan', desc: 'Van OLED in de woonkamer tot tablet op het balkon — kwaliteit schaalt mee.' },
      { title: 'Geen verborgen “tv-verplichting”', desc: 'Je betaalt IPTV Dark voor de gekozen looptijd — geen stilzwijgende verlenging via je energieleverancier.' },
    ],
    plansTitle: 'Prijzen in Amsterdam — zelfde pakketten als landelijk',
    plansLead:
      'Hieronder zie je dezelfde looptijden en scherm-opties als op onze abonnementenpagina. Kies wat bij jouw huishouden past; je ontvangt credentials per mail.',
    internet: {
      title: 'Internetsnelheid in Amsterdam — ruim voldoende voor IPTV Dark',
      body:
        'In veel wijken is glasvezel of kabel al snel genoeg voor 4K. Reken op minimaal ~10 Mbps voor stabiele HD en ~25 Mbps als meerdere schermen tegelijk 4K willen. We werken met gangbare providers; er is geen speciale “IPTV-router” nodig.',
    },
    coverage: {
      title: 'Gebieden rond Amsterdam die we benoemen',
      body:
        'Onderstaande namen zijn voorbeelden van wijken en buurten — het signaal is niet geografisch beperkt zolang je internet stabiel is.',
    },
    faqSectionTitle: 'Antwoorden voor kijkers in Amsterdam',
    faq: [
      { q: 'Moet ik in Amsterdam een andere app installeren dan elders in NL?', a: 'Nee. Dezelfde IPTV Dark-setup geldt in heel Nederland; alleen jouw netwerk thuis kan verschillen.' },
      { q: 'Werkt dit op een studenten-wifi in een gedeelde flat?', a: 'Zolang de verbinding stabiel genoeg is en geen harde blokkades heeft, meestal wel. Bij twijfel: test eerst op mobiel 4G/5G of vraag ons om advies.' },
      { q: 'Zijn er extra kosten voor 4K in de binnenstad?', a: 'Nee — 4K zit in het aanbod. Wel heb je thuis voldoende bandbreedte nodig; dat is geen extra tarief bij ons.' },
      { q: 'Kan ik tijdelijk pauzeren als ik op reis ga?', a: 'Je abonnement loopt door tot de einddatum van je gekozen periode; pauzeren zit niet standaard in elk pakket. Vraag support naar de opties.' },
      { q: 'Hoe snel na betaling kan ik kijken?', a: 'In de regel binnen twee uur, vaak sneller. Je krijgt een mail met login en korte installatiestappen.' },
    ],
    nearbyTitle: 'IPTV Dark vergelijken met andere steden',
  },

  rotterdam: {
    whyHeading: 'Wat levert IPTV Dark jou in Rotterdam?',
    bullets: [
      'Havenstad of woonwijk: één login, alle competities en talkshows die je gewend bent — plus internationaal aanbod.',
      'Geen afhankelijkheid van één kabelpakket: jij kiest zenders en VOD, niet omgekeerd.',
      'Multi-scherm handig voor gezinnen: iemand Feyenoord, een ander een serie — tegelijk mogelijk met het juiste pakket.',
      'Replay vangt late diensten: tot zeven dagen terug als je net van de Maas komt.',
      'Support begrijpt dat Rotterdam breed uitgestrekt is; we helpen remote, zonder wachttijd bij een fysieke winkel.',
    ],
    highlights: [
      { title: 'Zuid-Holland op scherp', desc: 'Regionale omroepen naast wereldwijde sport — ideaal voor wie tussen haven en platteland woont.' },
      { title: 'Vlot geactiveerd', desc: 'Geen pasjes of winkelbezoek: alles digitaal na je betaling.' },
      { title: 'VOD als bufferloze buffer', desc: 'Geen wachten op uitzendtijd: kies uit meer dan 175.000 films en series.' },
    ],
    plansTitle: 'Abonnementen voor Rotterdam — helder overzicht',
    plansLead:
      'De getoonde bedragen zijn dezelfde als op iptvdark4k.nl. Vergelijk looptijd (3 / 6 / 12 maanden) en het aantal gelijktijdige schermen.',
    internet: {
      title: 'Provider in Rotterdam — wat je moet weten',
      body:
        'Ziggo en KPN komen veel voor; glasvezel groeit snel. IPTV Dark vraagt geen speciale modemmodus — stabiele ping en voldoende Mbps zijn genoeg voor HD of 4K.',
    },
    coverage: {
      title: 'Wijken als oriëntatie — niet als harde grens',
      body:
        'De tags hieronder zijn herkenbare plekken; IPTV werkt overal waar jij stabiel internet hebt, ook buiten deze namen.',
    },
    faqSectionTitle: 'Rotterdammers vragen vaak dit',
    faq: [
      { q: 'Kan ik Feyenoord-wedstrijden via IPTV Dark zien?', a: 'Je krijgt toegang tot de zenders die in het pakket zitten — check het actuele zenderoverzicht na activatie. Aanbod kan per zender wijzigen.' },
      { q: 'Ik woon in een nieuwbouwwijk met alleen glasvezel — probleem?', a: 'Juist vaak ideaal: hoge snelheid. Installeer de app op je TV of stick volgens de gids in de mail.' },
      { q: 'Is een VPN nodig in Rotterdam?', a: 'Meestal niet. Alleen als jouw netwerk extreem streng filtert (zeldzaam), kan support een alternatief voorstellen.' },
      { q: 'Hoe zit het met kinderzenders?', a: 'Het aanbod omvat ook familie- en kindercontent; exacte zenders zie je in de gids na login.' },
      { q: 'Kan ik overstappen van een andere IPTV-aanbieder?', a: 'Ja. Stop je oude dienst volgens hun voorwaarden en start bij ons met een nieuw account — we sturen je een schone startmail.' },
    ],
    nearbyTitle: 'Andere plekken in NL met hetzelfde merk',
  },

  'den-haag': {
    whyHeading: 'IPTV Dark in Den Haag en Haaglanden — waarom het werkt',
    bullets: [
      'Van Scheveningen tot Ypenburg: dezelfde zwarte huisstijl en dezelfde catalogus — geen regionale “light-versie”.',
      'Internationale zenders sluiten aan bij een stad met veel diplomatieke gemeenschappen.',
      'Replay helpt als je in de file op de A12 zat en het journaal miste.',
      'Geen winkelafspraak: alles regel je online, inclusief betaling en mail met logins.',
      'Support reageert in het Nederlands — helder voor wie niet alleen Engels wil.',
    ],
    highlights: [
      { title: 'Haaglanden, één account', desc: 'Thuis in Escamp of kantoor in het centrum: zelfde login op meerdere devices (volgens pakket).' },
      { title: 'Belgisch én Nederlands mee', desc: 'Handig voor wie vaak over de grens kijkt of familie in Vlaanderen heeft.' },
      { title: 'EPG overzichtelijk', desc: 'Terugkijken tot zeven dagen met een duidelijke tv-gids.' },
    ],
    plansTitle: 'Kies je pakket voor Den Haag',
    plansLead:
      'Prijzen zijn identiek aan de landelijke site. Let op het aantal schermen als meerdere mensen tegelijk streamen.',
    internet: {
      title: 'Internet rond Den Haag — geschikt voor streaming',
      body:
        'KPN, Ziggo en andere spelers leveren vaak ruim genoeg voor 4K. Controleer vooral upload bij WiFi-mesh thuis — dat helpt bij meerdere streams.',
    },
    coverage: {
      title: 'Voorbeelden van gebieden in de regio',
      body:
        'De genoemde wijken zijn illustratief; je hoeft niet in die postcode te wonen om de dienst te gebruiken.',
    },
    faqSectionTitle: 'Veelgestelde vragen — Den Haag',
    faq: [
      { q: 'Werkt IPTV Dark ook in Scheveningen met veel toeristen-wifi?', a: 'Thuis op je eigen abonnement: ja. Openbare wifi is ongeschikt — te onstabiel en onveilig voor streaming.' },
      { q: 'Kan ik een tweede adres gebruiken (tweede huis)?', a: 'Inloggen delen buiten je pakket is niet toegestaan. Kies een multi-scherm pakket of neem contact op voor gezinsoplossingen.' },
      { q: 'Zijn er kinderblokkades?', a: 'Ouderlijk toezicht stel je lokaal in op je apparaat; wij leveren het aanbod, jij bepaalt wat kinderen zien.' },
      { q: 'Hoe zit het met BTW op de factuur?', a: 'Prijzen op de site zijn in euro zoals getoond; facturatie volgt je betaalmethode en onze voorwaarden.' },
      { q: 'Support in het weekend?', a: 'Ja — 24/7 staat aangegeven; reactietijd kan in piekuren iets oplopen.' },
    ],
    nearbyTitle: 'Meer steden met lokale pagina’s',
  },

  utrecht: {
    whyHeading: 'Centraal Nederland — waarom Utrecht kiest voor IPTV Dark',
    bullets: [
      'Studentenstad en forenzenstad: flexibel kijken op laptop, TV of telefoon zonder dubbele abonnementen.',
      'OV onderweg? Download waar mogelijk; thuis stream je in 4K op de bank.',
      'Geen wachttijd bij een balie: activatie gaat via mail, ook op zondagavond.',
      'Provincie Utrecht en stad delen dezelfde dienst — geen “alleen binnen de singels”-truc.',
      'VOD vult gaten in je agenda: college, werk, sport — kijk later terug.',
    ],
    highlights: [
      { title: 'Snelle trein, snelle mail', desc: 'Na betaling meestal binnen twee uur je gegevens — handig als je weinig thuis bent.' },
      { title: 'Eén stack, veel schermen', desc: 'Kies het juiste multi-scherm pakket als huisgenoten tegelijk kijken.' },
      { title: 'Geen legacy decoder', desc: 'Fire Stick, Smart TV of app — wat jij al hebt, gebruik je verder.' },
    ],
    plansTitle: 'Beschikbare abonnementen voor Utrecht',
    plansLead:
      'Vergelijk hieronder looptijd en prijs. Alles wat je op de landelijke abonnementenpagina ziet, geldt ook voor Utrecht.',
    internet: {
      title: 'Glasvezel en kabel in Utrecht — genoeg voor 4K',
      body:
        'Veel adressen hebben inmiddels 100 Mbps of meer — ruim voldoende. Let op stabiele WiFi op zolderkamers; soms helpt een kabel naar de TV.' },
    coverage: {
      title: 'Stadsdelen en buurten (indicatief)',
      body:
        'Deze lijst helpt zoekmachines begrijpen waar je vandaan komt; technisch geldt de dienst op elke stabiele verbinding.',
    },
    faqSectionTitle: 'Utrecht — korte antwoorden',
    faq: [
      { q: 'Kan ik IPTV Dark op de campus-wifi gebruiken?', a: 'Vaak blokkeren universiteitsnetwerken streaming. Thuis of mobiele data werkt betrouwbaarder.' },
      { q: 'Is er een app voor Apple TV?', a: 'Compatibiliteit hangt van je exacte model en app-store regels af; in de startmail staan aanbevolen apps per platform.' },
      { q: 'Kan ik maandelijks opzeggen?', a: 'Je koopt een vaste periode (3/6/12 maanden). Verlengen is niet automatisch — je verlengt zelf als je wilt.' },
      { q: 'Wat als mijn stream hapert?', a: 'Check eerst snelheid en WiFi. Daarna helpt support met concrete instellingen.' },
      { q: 'Zijn er proefperiodes?', a: 'Vraag via WhatsApp of mail naar beschikbaarheid; niet altijd gegarandeerd.' },
    ],
    nearbyTitle: 'Vergelijk met andere steden',
  },

  eindhoven: {
    whyHeading: 'Brainport en IPTV Dark — de match',
    bullets: [
      'Tech-savvy publiek wil 4K zonder handleiding van honderd pagina’s — wij houden instructies kort.',
      'Sport en gaming cultuur: lage latency thuis helpt; wij leveren de stream, jij de verbinding.',
      'Internationale arbeiders vinden vaak Engels op support; bij ons primair Nederlands, met Engels op aanvraag.',
      'VOD-bibliotheek als “netflix-achtige” aanvulling naast live voetbal en race.',
      'Geen vendor-lock bij één TV-merk: kies hardware die jij vertrouwt.',
    ],
    highlights: [
      { title: 'Brainport-scherpte', desc: 'Hoge resolutie waar je scherm en internet het toelaten.' },
      { title: 'Snel geactiveerd', desc: 'Geen wachten op een monteur in Brabant — alles digitaal.' },
      { title: 'Multi-device', desc: 'TV in de woonkamer, tablet op de slaapkamer — volgens je pakket.' },
    ],
    plansTitle: 'Pakketten voor Eindhoven en omgeving',
    plansLead:
      'Zelfde prijzen als landelijk. Kijk naar het aantal schermen als je huisgenoten tegelijk Formule 1 en series willen.',
    internet: {
      title: 'Providers rond Eindhoven',
      body:
        'Ziggo, KPN en glasvezelprojecten zijn gangbaar. Voor 4K: check je WiFi 6-router en plaats die centraal in huis.',
    },
    coverage: {
      title: 'Regio en buurten (voorbeelden)',
      body:
        'Onderstaande plaatsen zijn voorbeelden; technisch is er geen verschil tussen Veldhoven centrum en een buitenwijk zolang internet goed is.',
    },
    faqSectionTitle: 'Eindhoven — veelgestelde vragen',
    faq: [
      { q: 'Kan ik Formule 1 in 4K streamen?', a: 'Als de zender in het aanbod 4K aanbiedt en jouw verbinding het trekt, wel. Anders krijg je HD.' },
      { q: 'Ik heb alleen WiFi 5 — probleem?', a: 'HD meestal prima. Voor stabiele 4K op meerdere TV’s is moderne WiFi of bekabeling aan te raden.' },
      { q: 'Werkt dit op een Philips TV uit de fabriek?', a: 'Vaak via een IPTV-app of externe stick; exacte stappen staan in je startmail.' },
      { q: 'Kan ik zakelijk afnemen?', a: 'Standaard is consumentengebruik. Voor B2B: neem contact op voor mogelijkheden.' },
      { q: 'Hoe vaak updaten jullie de app-lijst?', a: 'Regelmatig; grote wijzigingen communiceren we via mail of site.' },
    ],
    nearbyTitle: 'Andere Brabantse en NL-steden',
  },

  groningen: {
    whyHeading: 'Noorden — waarom Groningen IPTV Dark pakt',
    bullets: [
      'Studentenflat of rijtjeshuis: dezelfde zwarte branding, geen regionale “budgetversie”.',
      'Lange avonden: VOD houdt je bezig als het buiten stormt.',
      'Support snapt dat het noorden soms andere piekuren heeft — we zijn 24/7 bereikbaar.',
      'Geen fysieke winkel in de stad nodig: alles online.',
      'Internationaal aanbod sluit aan bij een diverse studentenpopulatie.',
    ],
    highlights: [
      { title: 'Stad + provincie', desc: 'Ook buiten de ring werkt het, mits je internet stabiel is.' },
      { title: 'Replay voor drukke roosters', desc: 'College gemist? Nieuws alsnog terugkijken.' },
      { title: 'Geen kou aan de deur', desc: 'Activatie digitaal — geen monteur in de regen.' },
    ],
    plansTitle: 'Abonnementen voor Groningen',
    plansLead:
      'Prijzen gelijk aan de rest van Nederland. Let op het aantal schermen in studentenhuizen.',
    internet: {
      title: 'Internet in het noorden',
      body:
        'Glasvezel groeit; oude DSL kan krapper zijn voor 4K. Twijfel je? Test snelheid wired naar je router.',
    },
    coverage: {
      title: 'Buurten (voorbeeld)',
      body:
        'Namen zijn illustratief — technisch niet beperkt tot deze wijken.',
    },
    faqSectionTitle: 'Groningen — vragen',
    faq: [
      { q: 'Werkt IPTV op trage DSL?', a: 'HD kan nog net; 4K wordt lastig. Overweeg upgrade bij je provider of bekabeling.' },
      { q: 'Kan ik met huisgenoten één account delen?', a: 'Alleen binnen wat je pakket aan gelijktijdige streams toestaat. Meer nodig? Kies multi-scherm.' },
      { q: 'Winterstormen — uitval?', a: 'Onze servers zijn elders gehost; lokaal kan alleen jouw internet wegvallen. Router opnieuw opstarten helpt vaak.' },
      { q: 'Engelstalige support?', a: 'Primair Nederlands; voor Engels kun je het verzoeken in je bericht.' },
      { q: 'Proefdag?', a: 'Niet standaard; vraag support naar mogelijkheden.' },
    ],
    nearbyTitle: 'Meer noordelijke en NL-steden',
  },

  tilburg: {
    whyHeading: 'Brabantse roots — IPTV Dark in Tilburg',
    bullets: [
      'Geen gedoe met losse sport-abonnementen: bundel live en on-demand op één plek.',
      'Gezinnen met kinderen: kinderzenders en films in dezelfde subscription.',
      'Winkelstraat of uitwijk: thuis hetzelfde aanbod.',
      'Support helpt bij veelvoorkomende smart-tv merken zonder jargon.',
      'Geen verborgen “activatiekosten per device” — je betaalt het abonnement zoals getoond.',
    ],
    highlights: [
      { title: 'Heldere structuur', desc: 'Pakketten met vaste looptijd — geen verrassingen op je rekening.' },
      { title: 'Sport + series', desc: 'Live wedstrijden en binge op één stack.' },
      { title: 'Snel starten', desc: 'Mail met stappen — meestal dezelfde dag kijken.' },
    ],
    plansTitle: 'Tarieven voor Tilburg',
    plansLead:
      'Vergelijk 3, 6 of 12 maanden en het aantal schermen. Identiek aan de landelijke site.',
    internet: {
      title: 'Internet in Tilburg en omstreken',
      body:
        'Kabel en glasvezel komen veel voor. Voor meerdere 4K-streams: zorg voor voldoende bandbreedte en goede WiFi.',
    },
    coverage: {
      title: 'Gebiedsnamen (indicatief)',
      body:
        'Tags zijn voorbeelden van plekken rond Tilburg; geen technische grens.',
    },
    faqSectionTitle: 'Tilburg — FAQ',
    faq: [
      { q: 'Kan ik betalen met iDEAL?', a: 'Volg de betaallink in je mail — gangbare NL-methoden worden ondersteund waar beschikbaar.' },
      { q: 'Moet ik mijn Ziggo-box wegdoen?', a: 'Je hebt geen provider-IPTV-box nodig voor onze stream; je eigen app/stream-speler volstaat.' },
      { q: 'Kan ik op vakantie in Spanje kijken?', a: 'Gebruik buiten NL kan tegen onze voorwaarden ingaan; vraag support naar reisregels.' },
      { q: 'Hoe update ik de app?', a: 'Updates via de app store van je device; wij sturen geen fysieke dongles.' },
      { q: 'Is er een handleiding in PDF?', a: 'Ja, vaak bijgevoegd in de welkomstmail met screenshots per platform.' },
    ],
    nearbyTitle: 'Andere steden',
  },

  almere: {
    whyHeading: 'Nieuwbouwstad — moderne IPTV Dark',
    bullets: [
      'Vaak snel glasvezel — ideaal voor 4K op meerdere TV’s.',
      'Geen oude coax-gewoontes: je start fris met apps en sticks.',
      'Jonge gezinnen: veel kindercontent in VOD.',
      'Geen winkel in het stadscentrum nodig — 100% digitaal.',
      'Zelfde merk als landelijk — geen “Almere-only” beperkingen.',
    ],
    highlights: [
      { title: 'Snel netwerk = scherp beeld', desc: 'Profiteer van moderne infrastructuur in Flevoland.' },
      { title: 'Heldere pakketten', desc: 'Kies schermen en maanden die bij je gezin passen.' },
      { title: 'Replay als planner', desc: 'Gemist? Tot een week terug.' },
    ],
    plansTitle: 'Pakketten voor Almere',
    plansLead:
      'Zelfde prijzen als elders. Kijk naar multi-scherm als kinderen tegelijk iets anders willen.',
    internet: {
      title: 'Glasvezel in Almere — tip',
      body:
        'Test op de TV-poort (ethernet) als WiFi traag voelt; soms is één kabel genoeg voor stabiele 4K.',
    },
    coverage: {
      title: 'Wijken (voorbeeld)',
      body:
        'Namen helpen zoeken; technisch werkt het overal met goed internet.',
    },
    faqSectionTitle: 'Almere — veelgestelde vragen',
    faq: [
      { q: 'Is IPTV Dark duurder in nieuwbouw?', a: 'Nee — prijzen zijn landelijk gelijk.' },
      { q: 'Kan ik een mesh-router gebruiken?', a: 'Ja, zet de TV waar mogelijk op de hoofdknoop of bekabeld.' },
      { q: 'Hoe lang duurt installatie?', a: 'Software: minuten. Wachten op mail met login: meestal binnen twee uur na betaling.' },
      { q: 'Kan ik overstappen van Netflix-only?', a: 'IPTV Dark is breder (live + VOD). Je kunt beide naast elkaar houden.' },
      { q: 'Privacy?', a: 'Zie ons privacybeleid; we verkopen je data niet.' },
    ],
    nearbyTitle: 'Meer steden',
  },

  maastricht: {
    whyHeading: 'Limburg en de grens — IPTV Dark',
    bullets: [
      'Nederlands én Belgisch aanbod in één stack — handig voor de Euregio.',
      'Cultuur en sport: live en on-demand naast elkaar.',
      'Geen grens bij support: wij helpen remote, jij kiest je device.',
      'Geen dubbele tv-belasting: één IPTV Dark-abonnement volgens je pakket.',
      'Voor wie pendelt: replay vangt gemiste uitzendingen.',
    ],
    highlights: [
      { title: 'Euregio-proof', desc: 'Mix van zenders die in de regio populair zijn.' },
      { title: 'Meertalig kijken', desc: 'Veel internationaal aanbod; interface support in het Nederlands.' },
      { title: 'Flexibele devices', desc: 'TV, tablet, telefoon — volgens je abonnement.' },
    ],
    plansTitle: 'Abonnementen voor Maastricht',
    plansLead:
      'Prijzen zijn gelijk aan de landelijke site. Let op multi-scherm als meerdere talen tegelijk op TV staan.',
    internet: {
      title: 'Internet in Zuid-Limburg',
      body:
        'DSL, kabel of glasvezel — controleer je snelheid voor 4K. WiFi door dikke muren kan lastig zijn in oud bouw.',
    },
    coverage: {
      title: 'Buurten (voorbeeld)',
      body:
        'Tags zijn herkenbare plekken; geen harde kaartgrenzen voor de stream.',
    },
    faqSectionTitle: 'Maastricht — antwoorden',
    faq: [
      { q: 'Kan ik Vlaamse zenders bekijken?', a: 'Het aanbod bevat ook Belgische opties waar beschikbaar; exacte lijst zie je na login.' },
      { q: 'Werkt dit in België?', a: 'Onze focus is NL; gebruik buiten NL kan beperkt zijn — vraag support.' },
      { q: 'Hoe zit het met ondertiteling?', a: 'Hangt van zender en app af; veel apps ondersteunen CC/ondertiteling.' },
      { q: 'Kan ik een tweede huis in het buitenland koppelen?', a: 'Niet zonder aparte afspraak; standaard één huishouden volgens voorwaarden.' },
      { q: 'Snellere activatie mogelijk?', a: 'Meestal al binnen twee uur; piekdagen kunnen iets langer zijn.' },
    ],
    nearbyTitle: 'Andere steden',
  },

  haarlem: {
    whyHeading: 'Kennemerland — IPTV Dark',
    bullets: [
      'Tussen Amsterdam en zee: hetzelfde aanbod als de hoofdstad, zonder drukte in de app.',
      'Regionale omroepen naast landelijke ketens — nieuws dichtbij huis.',
      'Ouderwetse kabel? Geen probleem — streaming loopt via je internet.',
      'VOD voor lange avonden na het werk in de Randstad.',
      'Support begrijpt drukke pendelaars: korte, duidelijke antwoorden.',
    ],
    highlights: [
      { title: 'Randstad-kwaliteit', desc: 'Hoge bitrate waar je verbinding het toelaat.' },
      { title: 'Strand en serie', desc: 'Replay als je de zon mee pakt en het journaal mist.' },
      { title: 'Geen winkelrit', desc: 'Alles digitaal na betaling.' },
    ],
    plansTitle: 'Prijzen voor Haarlem',
    plansLead:
      'Vergelijk looptijd en schermen — identiek aan iptvdark4k.nl.',
    internet: {
      title: 'Internet Kennemerland',
      body:
        'KPN en Ziggo zijn gangbaar; glasvezel neemt toe. Voor 4K: bekabel je TV waar mogelijk.',
    },
    coverage: {
      title: 'Voorbeeldgebieden',
      body:
        'Namen zijn illustratief voor SEO; technisch geen restrictie tot deze lijst.',
    },
    faqSectionTitle: 'Haarlem — FAQ',
    faq: [
      { q: 'Verschil met Amsterdam-pagina?', a: 'Alleen deze teksten en lokale SEO — het product is hetzelfde.' },
      { q: 'Kan ik regionieuws vinden?', a: 'Ja, binnen het zenderaanbod; gebruik de gids na login.' },
      { q: 'Parkeren en installeren?', a: 'Geen monteur nodig — jij installeert de app met onze gids.' },
      { q: 'Kindvriendelijk?', a: 'Ruim aanbod; ouderlijk toezicht stel je lokaal in.' },
      { q: 'Hoe annuleer ik na afloop?', a: 'Geen automatische verlenging — je koopt per periode opnieuw als je wilt.' },
    ],
    nearbyTitle: 'Meer Randstad-steden',
  },

  arnhem: {
    whyHeading: 'Veluwezoom — IPTV Dark in Arnhem',
    bullets: [
      'Natuur en stad: thuis stream je na een wandeling verder met je serie.',
      'Sport en regionieuws naast internationale zenders.',
      'Geen wachtrij bij een lokale shop — digitale levering.',
      'Glasvezel en kabel: beide geschikt als de snelheid klopt.',
      'VOD als bibliotheek voor regenachtige weekenden.',
    ],
    highlights: [
      { title: 'Stabiel kijken', desc: 'Premium infrastructuur — 99,8% beschikbaarheid als doel.' },
      { title: 'Heldere pakketten', desc: 'Geen verborgen toeslagen per zender.' },
      { title: 'Snel aan de slag', desc: 'Mail binnen twee uur in veel gevallen.' },
    ],
    plansTitle: 'Abonnementen Arnhem',
    plansLead:
      'Zelfde tarieven als landelijk. Kijk naar schermen als het hele gezin kijkt.',
    internet: {
      title: 'Providers rond Arnhem',
      body:
        'KPN, Ziggo en regionale glasvezel — kies stabiel internet; wij leveren de rest.',
    },
    coverage: {
      title: 'Regio (voorbeeldnamen)',
      body:
        'Tags zijn voor herkenning; technisch werkt IPTV overal met goede verbinding.',
    },
    faqSectionTitle: 'Arnhem — vragen',
    faq: [
      { q: 'Kan ik op de Veluwe in een vakantiehuis kijken?', a: 'Als het internet daar stabiel is, vaak wel. Gebruik eigen account volgens voorwaarden.' },
      { q: 'Is er 4K op oude TV’s?', a: 'Als de TV 4K ondersteunt en je app dit aankan. Anders krijg je HD.' },
      { q: 'Hoe vraag ik support?', a: 'WhatsApp, mail of telefoon — zie contactpagina.' },
      { q: 'Kan ik zenders favorieten maken?', a: 'Hangt van de app af; veel apps hebben een favorietenlijst.' },
      { q: 'Zijn er kinderprofielen?', a: 'Stel dit in op je apparaat of app waar beschikbaar.' },
    ],
    nearbyTitle: 'Andere Gelderse en NL-steden',
  },

  zwolle: {
    whyHeading: 'IJsselstad — IPTV Dark',
    bullets: [
      'Noordoost-Nederland: dezelfde dienst als Randstad — geen tweederangs catalogus.',
      'Ondernemers en gezinnen: flexibel kijken na werk of school.',
      'Regionieuws en landelijke ketens in één omgeving.',
      'Replay als je langs de IJssel was in plaats van op de bank.',
      'Digitale levering — geen vestiging in de stad nodig.',
    ],
    highlights: [
      { title: 'Landelijk aanbod', desc: 'Geen “alleen west”-beperking.' },
      { title: 'Snel geactiveerd', desc: 'Mail volgt meestal binnen twee uur.' },
      { title: 'Transparante prijzen', desc: 'Wat je ziet op de kaarten is wat je betaalt voor de periode.' },
    ],
    plansTitle: 'Pakketten Zwolle',
    plansLead:
      'Vergelijk hieronder — identiek aan de abonnementenpagina.',
    internet: {
      title: 'Internet Overijssel',
      body:
        'Glasvezel en kabel verschillen per wijk. Test snelheid op piekuren als je 4K wilt.',
    },
    coverage: {
      title: 'Voorbeeldgebieden',
      body:
        'Namen helpen zoeken; technisch niet beperkt tot deze tags.',
    },
    faqSectionTitle: 'Zwolle — veelgestelde vragen',
    faq: [
      { q: 'Is er verschil met Amsterdam qua snelheid?', a: 'Product hetzelfde; alleen jouw lokale ISP bepaalt max bitrate thuis.' },
      { q: 'Kan ik factuur zakelijk?', a: 'Standaard consument; mail voor B2B-mogelijkheden.' },
      { q: 'Hoe vaak wisselt het zenderaanbod?', a: 'Kan periodiek; grote wijzigingen proberen we te communiceren.' },
      { q: 'Mag ik delen met buren?', a: 'Nee — account is voor jouw huishouden volgens voorwaarden.' },
      { q: 'Problemen op oude tablet?', a: 'Probeer een recente app of gebruik een Fire Stick als tussenoplossing.' },
    ],
    nearbyTitle: 'Meer steden',
  },

  breda: {
    whyHeading: 'West-Brabant — IPTV Dark',
    bullets: [
      'Geen gedoe met losse sport- en filmabonnementen — bundel het.',
      'Gezinnen: meerdere schermen mogelijk met het juiste pakket.',
      'Brabantse evenementen live, series daarna op VOD.',
      'Geen fysieke pasjes — online regelen.',
      'Nederlandstalige support zonder corporate tone.',
    ],
    highlights: [
      { title: 'Eén merk', desc: 'IPTV Dark door en door — geen wit-label verwarring.' },
      { title: 'Multi-scherm', desc: 'Kies het juiste pakket voor gelijktijdig kijken.' },
      { title: 'Replay + VOD', desc: 'Terugkijken en bingewatchen in dezelfde stack.' },
    ],
    plansTitle: 'Tarieven Breda',
    plansLead:
      'Zelfde als landelijk. Controleer schermen als het hele huis tegelijk streamt.',
    internet: {
      title: 'Internet Breda en omgeving',
      body:
        'Ziggo en KPN zijn breed beschikbaar; glasvezel groeit. Voor 4K: voldoende Mbps en stabiele WiFi.',
    },
    coverage: {
      title: 'Buurten (indicatief)',
      body:
        'Tags zijn voorbeelden; geen technische grens.',
    },
    faqSectionTitle: 'Breda — FAQ',
    faq: [
      { q: 'Is er een winkel in Breda?', a: 'Nee — we zijn online-first; support helpt remote.' },
      { q: 'Kan ik met familie in België delen?', a: 'Account delen buiten je huishouden is niet toegestaan. Vraag naar multi-scherm.' },
      { q: 'Hoe zit het met voetbalrechten?', a: 'Zenders volgen uitzendrechten; check het actuele aanbod na login.' },
      { q: 'Kan ik betalen in termijnen?', a: 'Zie betaalopties in de checkout; niet altijd gespreid mogelijk.' },
      { q: 'Upgrade tijdens looptijd?', a: 'Neem contact op — niet altijd automatisch mogelijk.' },
    ],
    nearbyTitle: 'Andere steden',
  },
};
