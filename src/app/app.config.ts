import {
  ApplicationConfig,
  provideZoneChangeDetection,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideClientHydration(withEventReplay()),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes,
      withInMemoryScrolling({
        // Anchor scrolling stays OFF: ScrollToService already scrolls the
        // element, and the router's own pass ran afterwards with a zero
        // offset, undoing the scroll-margin-top that clears the sticky header.
        anchorScrolling: 'disabled',
        // Always land at the top on (re)load instead of restoring the
        // previously saved scroll position.
        scrollPositionRestoration: 'top',
      }),
    ),
  ],
};
