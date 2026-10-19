import { Routes } from '@angular/router';

import type { Lang } from './core/i18n/dictionary';

/**
 * Static routes, one set per language.
 *
 * The language is plain route data so the prerender pass can enumerate every
 * page and write real HTML for each. Remembering the visitor's last choice
 * happens in main.ts, before bootstrap — it is browser-only and must never
 * influence what gets prerendered.
 *
 * Paths must match core/pages.ts (slugs) and public/sitemap.xml;
 * tools/check-seo.mjs verifies the built output against both.
 */
const home = () => import('./landing/landing.component').then((m) => m.LandingComponent);
const wholesale = () =>
  import('./pages/wholesale-page.component').then((m) => m.WholesalePageComponent);
const international = () =>
  import('./pages/international-page.component').then((m) => m.InternationalPageComponent);
const privacy = () =>
  import('./pages/privacy-page.component').then((m) => m.PrivacyPageComponent);

function forLang(lang: Lang): Routes {
  return [
    { path: lang, data: { lang }, loadComponent: home },
    { path: `${lang}/wholesale`, data: { lang }, loadComponent: wholesale },
    { path: `${lang}/international`, data: { lang }, loadComponent: international },
    { path: `${lang}/privacy`, data: { lang }, loadComponent: privacy },
  ];
}

export const routes: Routes = [
  ...forLang('ar'),
  ...forLang('en'),
  { path: '', pathMatch: 'full', redirectTo: 'ar' },
  { path: '**', redirectTo: 'ar' },
];
