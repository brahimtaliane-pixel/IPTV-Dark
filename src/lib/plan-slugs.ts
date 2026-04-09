/**
 * Plan URL slugs (Dutch). Legacy French-style slugs redirect in next.config.
 * Image paths in constants may still use older filenames on disk/CDN.
 */
export const LEGACY_PLAN_SLUG_TO_NL: Record<string, string> = {
  'abonnement-iptv-3-mois': 'abonnement-iptv-3-maanden',
  'abonnement-iptv-6-mois': 'abonnement-iptv-6-maanden',
  'abonnement-iptv-12-mois': 'abonnement-iptv-12-maanden',
  '2-ecrans-3-mois': '2-schermen-3-maanden',
  '2-ecrans-6-mois': '2-schermen-6-maanden',
  '2-ecrans-12-mois': '2-schermen-12-maanden',
  '3-ecrans-3-mois': '3-schermen-3-maanden',
  '3-ecrans-6-mois': '3-schermen-6-maanden',
  '3-ecrans-12-mois': '3-schermen-12-maanden',
  '4-ecrans-3-mois': '4-schermen-3-maanden',
  '4-ecrans-6-mois': '4-schermen-6-maanden',
  '4-ecrans-12-mois': '4-schermen-12-maanden',
};

export function legacyPlanSlugRedirects(): {
  source: string;
  destination: string;
  permanent: boolean;
}[] {
  return Object.entries(LEGACY_PLAN_SLUG_TO_NL).map(([legacy, nl]) => ({
    source: `/plans/${legacy}`,
    destination: `/plans/${nl}`,
    permanent: true,
  }));
}
