import { Routes } from '@angular/router';

/**
 * The landing experience is a single page. It is lazy-loaded so the root
 * shell stays tiny and the heavy section content is split into its own chunk.
 */
export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./landing/landing.component').then((m) => m.LandingComponent),
  },
  { path: '**', redirectTo: '' },
];
