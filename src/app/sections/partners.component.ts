import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { I18nService } from '../core/i18n/i18n.service';
import { type PageKey, pagePath } from '../core/pages';
import { RevealDirective } from '../shared/reveal.directive';

/**
 * Signpost from the home page to the two commercial pages. These are links to
 * further reading, not quote buttons — the header still owns that action.
 * They are also the home page's main internal links into the inner pages.
 */
@Component({
  selector: 'app-partners',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RevealDirective, RouterLink],
  template: `
    <section class="par" id="supply" aria-labelledby="supply-title">
      <div class="par__inner">
        <header class="par__head" appReveal>
          <p class="eyebrow">{{ t().partners.eyebrow }}</p>
          <h2 class="display" id="supply-title">{{ t().partners.title }}</h2>
          <p class="lede">{{ t().partners.body }}</p>
        </header>

        <ul class="par__list">
          @for (item of t().partners.items; track item.page) {
            <li>
              <a class="par__card" [routerLink]="path(item.page)">
                <h3>{{ item.title }}</h3>
                <p>{{ item.body }}</p>
                <span class="par__more">
                  {{ item.link }}
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M5 12h14m-6-6 6 6-6 6" />
                  </svg>
                </span>
              </a>
            </li>
          }
        </ul>
      </div>
    </section>
  `,
  styles: `
    .par {
      background: var(--ivory-dim);
      color: var(--on-ivory);
      --accent: var(--olive-deep);
      padding-block: var(--section-y);
    }

    .par__inner {
      width: min(100% - (var(--gutter) * 2), var(--container));
      margin-inline: auto;
    }

    .par__head {
      margin-block-end: clamp(2rem, 6vw, 3rem);
    }

    .par__head .lede {
      margin-block-start: 1rem;
    }

    .par__list {
      display: grid;
      gap: 1rem;
    }

    .par__card {
      display: grid;
      gap: 0.75rem;
      height: 100%;
      padding: clamp(1.5rem, 4vw, 2.25rem);
      background: var(--ivory);
      border: 1px solid var(--ivory-line);
      border-block-start: 3px solid var(--olive);
      border-radius: var(--radius);
      transition:
        border-color var(--dur-fast) var(--ease),
        transform var(--dur-fast) var(--ease);
    }

    .par__card:hover {
      border-block-start-color: var(--orange);
      transform: translateY(-2px);
    }

    .par__card h3 {
      font-size: var(--step-2);
    }

    .par__card p {
      color: var(--on-ivory-dim);
    }

    .par__more {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      margin-block-start: 0.5rem;
      font-weight: 600;
      color: var(--olive);
    }

    .par__more svg {
      width: 20px;
      height: 20px;
      fill: none;
      stroke: currentcolor;
      stroke-width: 2;
      stroke-linecap: round;
      stroke-linejoin: round;
    }

    :host-context([dir='rtl']) .par__more svg {
      transform: scaleX(-1);
    }

    @media (min-width: 720px) {
      .par__list {
        grid-template-columns: 1fr 1fr;
        gap: 1.5rem;
      }
    }
  `,
})
export class PartnersComponent {
  private readonly i18n = inject(I18nService);
  protected readonly t = this.i18n.t;

  protected path(page: PageKey): string {
    return pagePath(this.i18n.lang(), page);
  }
}
