import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { I18nService } from '../core/i18n/i18n.service';
import { RevealDirective } from '../shared/reveal.directive';

/**
 * The only place sizes and pack contents appear.
 *
 * There is no photograph of the six grades side by side, so the scale is
 * drawn: one ellipse per grade, stepping about 6% each. That is an honest
 * "this one is bigger than that one" cue and nothing more — the steps are not
 * a weight ratio, because no gram weights exist in the approved data.
 */
@Component({
  selector: 'app-products',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RevealDirective],
  template: `
    <section class="prod" id="products" aria-labelledby="products-title">
      <div class="prod__inner">
        <header class="prod__head" appReveal>
          <p class="eyebrow">{{ t().products.eyebrow }}</p>
          <h2 class="display" id="products-title">{{ t().products.title }}</h2>
          <p class="lede">{{ t().products.body }}</p>
        </header>

        <h3 class="prod__label">{{ t().products.sizesLabel }}</h3>
        <ul class="sizes">
          @for (size of t().products.sizes; track size.id; let i = $index) {
            <li class="size">
              <span class="size__art" aria-hidden="true">
                <svg viewBox="0 0 60 76" [style.--s]="scale[i]">
                  <ellipse cx="30" cy="40" rx="21" ry="27" />
                </svg>
              </span>
              <span class="size__name">{{ size.name }}</span>
            </li>
          }
        </ul>

        <h3 class="prod__label prod__label--gap">{{ t().products.packLabel }}</h3>
        <div class="packs">
          <ul class="packs__list">
            @for (pack of t().products.packs; track pack.name) {
              <li>
                <span class="packs__name">{{ pack.name }}</span>
                <span class="packs__unit">{{ pack.unit }}</span>
              </li>
            }
          </ul>

          <dl class="specs">
            @for (spec of t().products.specs; track spec.label) {
              <div>
                <dt>{{ spec.label }}</dt>
                <dd>{{ spec.value }}</dd>
              </div>
            }
          </dl>
        </div>
      </div>
    </section>
  `,
  styles: `
    .prod {
      background: var(--ivory);
      color: var(--on-ivory);
      padding-block: var(--section-y);
    }

    .prod__inner {
      width: min(100% - (var(--gutter) * 2), var(--container));
      margin-inline: auto;
    }

    .prod__head {
      margin-block-end: clamp(2rem, 6vw, 3rem);
    }

    .prod__head .lede {
      margin-block-start: 1rem;
    }

    .prod__label {
      font-size: var(--step--1);
      font-weight: 600;
      letter-spacing: 0.08em;
      color: var(--olive);
      padding-block-end: 0.85rem;
      border-block-end: 1px solid var(--ivory-line);
      margin-block-end: 1.5rem;
    }

    .prod__label--gap {
      margin-block-start: clamp(3rem, 8vw, 4.5rem);
    }

    .sizes {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: clamp(1.25rem, 5vw, 2rem) clamp(0.75rem, 3vw, 1.5rem);
    }

    .size {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.35rem;
      text-align: center;
    }

    .size__art {
      display: grid;
      place-items: end center;
      height: clamp(72px, 18vw, 104px);
    }

    .size__art svg {
      height: calc(var(--s) * 100%);
      width: auto;
      fill: var(--sage-soft);
      stroke: var(--olive);
      stroke-width: 1.5;
    }

    .size__name {
      font-size: var(--step-1);
      font-weight: 700;
      letter-spacing: 0.02em;
      font-variant-numeric: tabular-nums;
      margin-block-start: 0.6rem;
    }

    .packs__list {
      display: grid;
      gap: 1px;
      background: var(--ivory-line);
      border-block: 1px solid var(--ivory-line);
    }

    .packs__list li {
      background: var(--ivory);
      display: flex;
      flex-wrap: wrap;
      align-items: baseline;
      justify-content: space-between;
      gap: 0.35rem 1rem;
      padding-block: 1.1rem;
    }

    .packs__name {
      font-size: var(--step-1);
      font-weight: 500;
      color: var(--olive);
    }

    .packs__unit {
      font-size: var(--step-2);
      font-weight: 700;
      letter-spacing: var(--track-heading);
    }

    .specs {
      margin: 1.75rem 0 0;
      display: grid;
      gap: 0.9rem;
    }

    .specs > div {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      gap: 1rem;
      font-size: var(--step--1);
    }

    .specs dt {
      color: var(--on-ivory-dim);
    }

    .specs dd {
      margin: 0;
      font-weight: 600;
    }

    @media (min-width: 720px) {
      .sizes {
        grid-template-columns: repeat(6, 1fr);
      }
    }

    @media (min-width: 820px) {
      .specs {
        grid-template-columns: repeat(2, 1fr);
        gap: 0.9rem clamp(1.5rem, 4vw, 3rem);
      }
    }
  `,
})
export class ProductsComponent {
  protected readonly t = inject(I18nService).t;
  /** Relative heights, largest first, matching the order of `sizes`. */
  protected readonly scale = [1.12, 1.06, 1.0, 0.94, 0.88, 0.82];
}
