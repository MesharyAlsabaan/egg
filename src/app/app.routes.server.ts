import { RenderMode, ServerRoute } from '@angular/ssr';

/**
 * Every page is written to static HTML at build time. There is no
 * per-request data on this site, so no Node server is needed to serve it.
 */
export const serverRoutes: ServerRoute[] = [{ path: '**', renderMode: RenderMode.Prerender }];
