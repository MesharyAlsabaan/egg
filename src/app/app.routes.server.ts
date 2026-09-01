import { RenderMode, ServerRoute } from '@angular/ssr';

/**
 * Both language pages are written to static HTML at build time. There is no
 * per-request data on this site, so no Node server is needed to serve it.
 */
export const serverRoutes: ServerRoute[] = [
  { path: 'ar', renderMode: RenderMode.Prerender },
  { path: 'en', renderMode: RenderMode.Prerender },
  { path: '**', renderMode: RenderMode.Prerender },
];
