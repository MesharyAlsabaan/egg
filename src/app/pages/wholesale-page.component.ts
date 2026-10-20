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
 * Wholesale supply inside Saudi Arabia.
 *
 * Audience: distributors, wholesalers, retail buyers, foodservice and
 * institutional procurement. Search intent: "egg supplier / wholesale eggs in
 * Saudi Arabia" and the Arabic equivalents (توريد بيض بالجملة، مورد بيض).
 *
 * Order follows a buyer's questions: is this for me, what can you supply,
 * how does ordering work, the details, then the form. Product values are read
 * from the same dictionary entries the home page uses — never retyped.
 */
@Component({
  selector: 'app-wholesale-page',
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
    <app-header page="wholesale" />

    <main id="main">
      <app-page-intro [eyebrow]="w().eyebrow" [title]="w().title" [lede]="w().lede" />

      <section class="pg pg--dim" aria-labelledby="buyers-title">
        <div class="shell">
          <h2 class="pg__title" id="buyers-title">{{ w().buyersTitle }}</h2>
          <ul class="pg__cards">
            @for (buyer of w().buyers; track buyer.title) {
              <li>
                <h3>{{ buyer.title }}</h3>
                <p>{{ buyer.body }}</p>
              </li>
            }
          </ul>
        </div>
      </section>

      <section class="pg pg--ink" aria-labelledby="supply-title">
        <div class="shell pg__split">
          <div>
            <h2 class="pg__title" id="supply-title">{{ w().supplyTitle }}</h2>
            <p class="pg__body">{{ w().supplyBody }}</p>
          </div>
          <dl class="pg__facts">
            <div>
              <dt>{{ p().sizesLabel }}</dt>
              <dd dir="ltr">{{ grades() }}</dd>
            </div>
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

      <section class="pg" aria-labelledby="steps-title">
        <div class="shell">
          <h2 class="pg__title" id="steps-title">{{ w().stepsTitle }}</h2>
          <ol class="pg__steps">
            @for (step of w().steps; track step.title) {
              <li>
                <h3>{{ step.title }}</h3>
                <p>{{ step.body }}</p>
              </li>
            }
          </ol>
        </div>
      </section>

      <section class="pg pg--dim" id="enquiry" aria-labelledby="enquiry-title">
        <div class="shell">
          <h2 class="pg__title" id="enquiry-title">{{ w().formTitle }}</h2>
          <p class="pg__body">{{ w().formBody }}</p>
          <app-inquiry-form buyer="distributor" source="wholesale" />
          <a class="pg__cross" [routerLink]="intlPath()">{{ w().intlLink }}</a>
        </div>
      </section>

      <section class="pg" aria-labelledby="faq-title">
        <div class="shell">
          <h2 class="pg__title" id="faq-title">{{ w().faqTitle }}</h2>
          <dl class="pg__faq">
            @for (item of w().faq; track item.q) {
              <div>
                <dt>{{ item.q }}</dt>
                <dd>{{ item.a }}</dd>
              </div>
            }
          </dl>
        </div>
      </section>

      <app-contact />
    </main>

    <app-footer page="wholesale" />
  `,
})
export class WholesalePageComponent {
  private readonly i18n = inject(I18nService);
  protected readonly t = this.i18n.t;
  protected readonly w = computed(() => this.t().wholesale);
  protected readonly p = computed(() => this.t().products);
  protected readonly grades = computed(() =>
    this.p()
      .sizes.map((s) => s.name)
      .join(' · '),
  );
  protected readonly intlPath = computed(() => pagePath(this.i18n.lang(), 'international'));

  constructor() {
    setupPage('wholesale');
  }
}
