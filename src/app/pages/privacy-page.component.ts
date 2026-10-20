import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { ANALYTICS_ENABLED } from '../core/analytics.service';
import { I18nService } from '../core/i18n/i18n.service';
import { setupPage } from '../core/page';
import { FooterComponent } from '../sections/footer.component';
import { HeaderComponent } from '../sections/header.component';
import { PageIntroComponent } from '../shared/page-intro.component';

/**
 * Privacy notice. `noindex` (see core/pages.ts) and not in the sitemap.
 *
 * It describes only what this website actually does. The analytics paragraph
 * is chosen from ANALYTICS_ENABLED, so switching GA4 on changes the notice in
 * the same build. Wording is pending owner/legal review — see
 * docs/seo-growth/08-CONTENT-STRATEGY.md.
 */
@Component({
  selector: 'app-privacy-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FooterComponent, HeaderComponent, PageIntroComponent],
  template: `
    <a class="skip-link" href="#main">{{ t().site.skip }}</a>
    <app-header page="privacy" />

    <main id="main">
      <app-page-intro [eyebrow]="p().eyebrow" [title]="p().title" [lede]="p().lede" />

      <section class="pg" aria-label="{{ p().title }}">
        <div class="shell pg__prose">
          @for (section of p().sections; track section.title; let i = $index) {
            <h2>{{ section.title }}</h2>
            @for (para of section.body; track para) {
              <p>{{ para }}</p>
            }
            @if (i === 2) {
              <h2>{{ p().analytics.title }}</h2>
              <p>{{ analytics ? p().analytics.on : p().analytics.off }}</p>
            }
          }
          <p class="pg__updated">{{ p().updated }}</p>
        </div>
      </section>
    </main>

    <app-footer page="privacy" />
  `,
})
export class PrivacyPageComponent {
  protected readonly t = inject(I18nService).t;
  protected readonly p = computed(() => this.t().privacy);
  protected readonly analytics = ANALYTICS_ENABLED;

  constructor() {
    setupPage('privacy');
  }
}
