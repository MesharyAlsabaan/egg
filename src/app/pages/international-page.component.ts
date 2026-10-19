import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { I18nService } from '../core/i18n/i18n.service';
import { setupPage } from '../core/page';
import { pagePath } from '../core/pages';
import { ContactComponent } from '../sections/contact.component';
import { FooterComponent } from '../sections/footer.component';
import { HeaderComponent } from '../sections/header.component';
import { InquiryFormComponent } from '../shared/inquiry-form.component';
import { PageIntroComponent } from '../shared/page-intro.component';

/**
 * Enquiries from importers and distributors outside Saudi Arabia.
 *
 * What this page must NOT do: claim export approval, existing export
 * markets, or coverage of any country. None of that is confirmed. It states
 * the producer's verified facts, says plainly that every market is checked
 * before a quote, and asks for the information needed to check it. One page
 * for all markets — no per-country copies.
 */
@Component({
  selector: 'app-international-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ContactComponent,
    FooterComponent,
    HeaderComponent,
    InquiryFormComponent,
    PageIntroComponent,
    RouterLink,
  ],
  template: `
    <a class="skip-link" href="#main">{{ t().site.skip }}</a>
    <app-header page="international" />

    <main id="main">
      <app-page-intro [eyebrow]="x().eyebrow" [title]="x().title" [lede]="x().lede" />

      <section class="pg pg--dim" aria-labelledby="note-title">
        <div class="shell">
          <div class="pg__note">
            <h2 id="note-title">{{ x().noteTitle }}</h2>
            <p>{{ x().note }}</p>
          </div>
        </div>
      </section>

      <section class="pg pg--ink" aria-labelledby="about-title">
        <div class="shell pg__split">
          <h2 class="pg__title" id="about-title">{{ x().aboutTitle }}</h2>
          <dl class="pg__facts">
            @for (row of x().about; track row.label) {
              <div>
                <dt>{{ row.label }}</dt>
                <dd>{{ row.value }}</dd>
              </div>
            }
            @for (pack of p().packs; track pack.name) {
              <div>
                <dt>{{ pack.name }}</dt>
                <dd>{{ pack.unit }}</dd>
              </div>
            }
            @for (spec of p().specs; track spec.label) {
              <div>
                <dt>{{ spec.label }}</dt>
                <dd>{{ spec.value }}</dd>
              </div>
            }
          </dl>
        </div>
      </section>

      <section class="pg" aria-labelledby="ask-title">
        <div class="shell">
          <h2 class="pg__title" id="ask-title">{{ x().askTitle }}</h2>
          <ul class="pg__ask">
            @for (item of x().ask; track item) {
              <li>{{ item }}</li>
            }
          </ul>
        </div>
      </section>

      <section class="pg pg--dim" id="enquiry" aria-labelledby="enquiry-title">
        <div class="shell">
          <h2 class="pg__title" id="enquiry-title">{{ x().formTitle }}</h2>
          <p class="pg__body">{{ x().formBody }}</p>
          <app-inquiry-form buyer="importer" source="international" [international]="true" />
          <a class="pg__cross" [routerLink]="wholesalePath()">{{ x().wholesaleLink }}</a>
        </div>
      </section>

      <app-contact />
    </main>

    <app-footer page="international" />
  `,
})
export class InternationalPageComponent {
  private readonly i18n = inject(I18nService);
  protected readonly t = this.i18n.t;
  protected readonly x = computed(() => this.t().international);
  protected readonly p = computed(() => this.t().products);
  protected readonly wholesalePath = computed(() => pagePath(this.i18n.lang(), 'wholesale'));

  constructor() {
    setupPage('international');
  }
}
