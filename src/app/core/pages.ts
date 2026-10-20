import type { Lang } from './i18n/dictionary';

/**
 * Every indexable page on the site. Adding a page means adding it here, to
 * app.routes.ts, to the dictionary's `pageMeta`, and to public/sitemap.xml.
 * tools/check-seo.mjs then verifies every sitemap URL against the built page.
 */
export type PageKey = 'home' | 'wholesale' | 'international' | 'privacy';

export const PAGES: readonly PageKey[] = ['home', 'wholesale', 'international', 'privacy'];

/**
 * Pages kept out of search results and out of the sitemap. The privacy notice
 * is for visitors who look for it, not a landing page.
 */
export function isIndexable(page: PageKey): boolean {
  return page !== 'privacy';
}

export const ORIGIN = 'https://familyeggs.sa';

/** Same slug in both languages, so the language switch is a one-segment swap. */
const SLUGS: Record<PageKey, string> = {
  home: '',
  wholesale: 'wholesale',
  international: 'international',
  privacy: 'privacy',
};

/** Root-relative path, e.g. `/ar` or `/en/wholesale`. No trailing slash. */
export function pagePath(lang: Lang, page: PageKey): string {
  const slug = SLUGS[page];
  return slug ? `/${lang}/${slug}` : `/${lang}`;
}

export function pageUrl(lang: Lang, page: PageKey): string {
  return `${ORIGIN}${pagePath(lang, page)}`;
}

/**
 * The hreflang fallback for languages we do not serve. Arabic for the
 * domestic pages; English for the page written for buyers outside Saudi
 * Arabia, who are far more likely to read English than Arabic.
 */
export function xDefaultLang(page: PageKey): Lang {
  return page === 'international' ? 'en' : 'ar';
}
