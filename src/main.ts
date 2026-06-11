import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app.component';

// Stop the browser from restoring the last scroll position on reload —
// the page should always open at the top (hero).
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

bootstrapApplication(App, appConfig).catch((err) => console.error(err));
