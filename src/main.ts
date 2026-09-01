import { bootstrapApplication } from '@angular/platform-browser';

import { App } from './app/app.component';
import { appConfig } from './app/app.config';

// The page should always open at the top, not where it was left.
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

// Language preference, applied before the router sees the URL. This is
// deliberately outside the routing config: it is browser-only state, and
// putting it in a guard is what stopped the prerender pass from walking the
// routes. Only a bare "/" is redirected, so a shared /ar or /en link always
// opens in the language it names.
if (location.pathname === '/' || location.pathname === '') {
  try {
    const stored = localStorage.getItem('familyeggs.lang');
    const preferred = stored ?? (navigator.language?.startsWith('en') ? 'en' : 'ar');
    if (preferred === 'ar' || preferred === 'en') {
      history.replaceState(null, '', `/${preferred}${location.search}${location.hash}`);
    }
  } catch {
    // Storage blocked: the router's own redirect to /ar takes over.
  }
}

bootstrapApplication(App, appConfig).catch((err) => console.error(err));
