import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { I18nService } from '../core/i18n/i18n.service';
import { RevealDirective } from '../shared/reveal.directive';

/**
 * The one place operating figures appear. Deliberately not a row of stat
 * cards: a wide editorial band, the number carrying the weight and the label
 * sitting quietly under it. No count-up animation — it fires on every scroll
 * pass and adds nothing.
 */
@Component({
  selector: 'app-figures',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RevealDirective],
  template: `
    <section class="figures" id="figures" aria-labelledby="figures-title">
      <div class="figures__inner">
        <header class="figures__head" appReveal>
          <p class="eyebrow">{{ t().figures.eyebrow }}</p>
          <h2 class="display" id="figures-title">{{ t().figures.title }}</h2>
        </header>

        <dl class="figures__list">
          @for (item of t().figures.items; track item.label) {
            <div class="figure">
              <dt class="figure__value">
                <span dir="ltr">{{ item.value }}</span>
                @if (item.unit) {
                  <span class="figure__unit">{{ item.unit }}</span>
                }
              </dt>
              <dd class="figure__label">{{ item.label }}</dd>
            </div>
          }
        </dl>
      </div>
    </section>
  `,
  styles: `
    .figures {
      background: var(--ink);
      color: var(--on-ink);
      --accent: var(--orange);
      --muted: var(--on-ink-dim);
      padding-block: var(--section-y);
    }

    .figures__inner {
      width: min(100% - (var(--gutter) * 2), var(--container));
      margin-inline: auto;
    }

    .figures__head {
      margin-block-end: clamp(2rem, 6vw, 3.5rem);
    }

    .figures__list {
      margin: 0;
      display: grid;
      /* A stack of full-width rows on a phone, so nothing is squeezed. */
      border-block-start: 1px solid rgb(248 249 246 / 0.18);
    }

    .figure {
      display: flex;
      flex-wrap: wrap;
      align-items: baseline;
      gap: 0.25rem 0.9rem;
      padding-block: clamp(1.1rem, 3.5vw, 1.6rem);
      border-block-end: 1px solid rgb(248 249 246 / 0.18);
    }

    .figure__value {
      display: flex;
      align-items: baseline;
      gap: 0.4rem;
      font-size: clamp(2.5rem, 11vw, 4.5rem);
      font-weight: 700;
      line-height: var(--lh-figure);
      letter-spacing: var(--track-figure);
      color: var(--orange);
      font-variant-numeric: tabular-nums;
    }

    .figure__unit {
      font-size: 0.4em;
      font-weight: 600;
      letter-spacing: 0;
      color: var(--sage);
    }

    .figure__label {
      margin: 0;
      font-size: var(--step-1);
      color: var(--on-ink-dim);
    }

    @media (min-width: 720px) {
      .figure {
        display: grid;
        /* max-content, not a fixed cap: "430,000" is wider than 7.5rem and
           a fixed column pushed it past the viewport edge. */
        grid-template-columns: max-content 1fr;
        align-items: baseline;
        gap: clamp(1.5rem, 4vw, 3rem);
      }

      .figure__value {
        justify-content: flex-end;
        font-size: clamp(2.75rem, 4.5vw, 4rem);
      }

      .figure__label {
        font-size: var(--step-2);
        font-weight: 500;
        color: var(--ivory);
      }
    }

    @media (min-width: 720px) {
      html[dir='ltr'] .figure__value {
        justify-content: flex-start;
      }
    }
  `,
})
export class FiguresComponent {
  protected readonly t = inject(I18nService).t;
}
