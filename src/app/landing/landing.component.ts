import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

import type { Lang } from '../core/i18n/dictionary';
import { I18nService } from '../core/i18n/i18n.service';
import { SeoService } from '../core/seo.service';
import { AutomationComponent } from '../sections/automation.component';
import { ContactComponent } from '../sections/contact.component';
import { FacilityComponent } from '../sections/facility.component';
import { FiguresComponent } from '../sections/figures.component';
import { FooterComponent } from '../sections/footer.component';
import { HeaderComponent } from '../sections/header.component';
import { HeritageComponent } from '../sections/heritage.component';
import { HeroComponent } from '../sections/hero.component';
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
  private readonly i18n = inject(I18nService);
  private readonly seo = inject(SeoService);
  protected readonly t = this.i18n.t;

  /** 'ar' or 'en', from the route definition. */
  private readonly routeLang = toSignal(
    inject(ActivatedRoute).data.pipe(map((data) => data['lang'] as Lang)),
    { initialValue: 'ar' as Lang },
  );

  constructor() {
    effect(() => this.i18n.apply(this.routeLang()));
    effect(() => this.seo.update(this.i18n.lang()));
  }
}
