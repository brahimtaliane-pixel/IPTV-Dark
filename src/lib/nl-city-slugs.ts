/**
 * Dutch city page slugs — isolated module so Client Components never depend on
 * `@/lib/cities` (huge) or on barrel exports from `@/lib/constants` (very large PLANS array),
 * which can leave named exports undefined in the client bundle.
 */
export const CITIES = [
  'amsterdam',
  'rotterdam',
  'den-haag',
  'utrecht',
  'eindhoven',
  'groningen',
  'tilburg',
  'almere',
  'maastricht',
  'haarlem',
  'arnhem',
  'zwolle',
  'breda',
] as const;

export const NL_CITY_SLUGS_ORDERED = CITIES;

export const NL_CITY_SLUGS = new Set<string>([...CITIES]);
