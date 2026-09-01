import { BootstrapContext, bootstrapApplication } from '@angular/platform-browser';

import { App } from './app/app.component';
import { config } from './app/app.config.server';

/**
 * Angular 20.3 requires the BootstrapContext to be handed through on the
 * server; without it the prerender pass fails with "Missing Platform".
 */
const bootstrap = (context: BootstrapContext) => bootstrapApplication(App, config, context);

export default bootstrap;
