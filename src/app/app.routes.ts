import { Routes } from '@angular/router';

import type { Lang } from './core/i18n/dictionary';

/**
 * Two static routes, one per language.
 *
 * The language used to be resolved in a `canActivate` guard, which the
 * prerender pass could not walk through — route extraction failed outright.
 * The language is plain route data now, so the build can enumerate both pages
 * and write real HTML for each. Remembering the visitor's last choice happens
 * in main.ts, before bootstrap, where it belongs: it is browser-only and must
 * never influence what gets prerendered.
 */
export const routes: Routes = [
  {
    path: 'ar',
    data: { lang: 'ar' satisfies Lang },
    loadComponent: () => import('./landing/landing.component').then((m) => m.LandingComponent),
  },
  {
    path: 'en',
    data: { lang: 'en' satisfies Lang },
    loadComponent: () => import('./landing/landing.component').then((m) => m.LandingComponent),
  },
  { path: '', pathMatch: 'full', redirectTo: 'ar' },
  { path: '**', redirectTo: 'ar' },
];
