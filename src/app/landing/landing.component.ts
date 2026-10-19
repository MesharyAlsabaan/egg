import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, afterNextRender, inject } from '@angular/core';

import { I18nService } from '../core/i18n/i18n.service';
import { setupPage } from '../core/page';
import { ScrollToService } from '../core/scroll-to.service';
import { AutomationComponent } from '../sections/automation.component';
import { ContactComponent } from '../sections/contact.component';
import { FacilityComponent } from '../sections/facility.component';
import { FiguresComponent } from '../sections/figures.component';
import { FooterComponent } from '../sections/footer.component';
import { HeaderComponent } from '../sections/header.component';
import { HeritageComponent } from '../sections/heritage.component';
import { HeroComponent } from '../sections/hero.component';
import { PartnersComponent } from '../sections/partners.component';
import { ProductsComponent } from '../sections/products.component';

/**
 * Page order, and the reason for it:
 *
 *   header    the single call to action
 *   hero      who this is and who it is for
 *   figures   every operating number, once
 *   automation the production line, and the one motion moment
 *   products  sizes and pack contents, once
 *   heritage  the family history, once
 *   facility  the aerials, each carrying one fact
 *   partners  signposts to the wholesale and international pages
 *   contact   direct channels, no button
 *   footer    links and identity
 */
@Component({
  selector: 'app-landing',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AutomationComponent,
    ContactComponent,
    FacilityComponent,
    FiguresComponent,
    FooterComponent,
    HeaderComponent,
    HeritageComponent,
    HeroComponent,
    PartnersComponent,
    ProductsComponent,
  ],
  template: `
    <a class="skip-link" href="#main">{{ t().site.skip }}</a>
    <app-header />

    <main id="main">
      <app-hero />
      <app-figures />
      <app-automation />
      <app-products />
      <app-heritage />
      <app-facility />
      <app-partners />
      <app-contact />
    </main>

    <app-footer />
  `,
  styles: `
    :host {
      display: block;
    }
  `,
})
export class LandingComponent {
  protected readonly t = inject(I18nService).t;

  constructor() {
    setupPage('home');

    // Arriving at `/ar#products` (from an inner page's nav, or a shared link):
    // the router's scroll-to-top runs after the browser's own jump to the
    // fragment and undoes it. The router schedules that in a timeout, so a
    // timeout queued after the first render runs after it and wins.
    const doc = inject(DOCUMENT);
    const scroller = inject(ScrollToService);
    afterNextRender(() => {
      const id = decodeURIComponent(doc.defaultView?.location.hash.slice(1) ?? '');
      if (id) setTimeout(() => scroller.go(id), 0);
    });
  }
}
