import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, Scroll } from '@angular/router';
import { filter, take } from 'rxjs';

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
    // with anchor scrolling off, the router answers its own Scroll event by
    // scrolling to the top, undoing the browser's jump to the fragment. That
    // event carries the fragment. `Router.events` re-emits the internal
    // stream, so this subscriber runs BEFORE the router's own scroll handler
    // within the same synchronous emission; a microtask puts our scroll after
    // it, every time — no timers to race.
    const scroller = inject(ScrollToService);
    inject(Router)
      .events.pipe(
        filter((e): e is Scroll => e instanceof Scroll && !!e.anchor),
        take(1),
        takeUntilDestroyed(),
      )
      .subscribe((e) =>
        queueMicrotask(() => scroller.go(decodeURIComponent(e.anchor!), { instant: true })),
      );
  }
}
