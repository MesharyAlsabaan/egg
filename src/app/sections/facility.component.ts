import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { I18nService } from '../core/i18n/i18n.service';
import { MediaImageComponent } from '../shared/media-image.component';
import { RevealDirective } from '../shared/reveal.directive';

/**
 * The aerial photography, each frame used exactly once and each carrying one
 * piece of information rather than being decoration.
 *
 * Deliberately not a second statistics section: the birds-per-house figure is
 * attached to the picture of the houses, where it means something.
 */
@Component({
  selector: 'app-facility',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MediaImageComponent, RevealDirective],
  template: `
    <section class="fac" id="facility" aria-labelledby="facility-title">
      <div class="fac__inner">
        <header class="fac__head" appReveal>
          <p class="eyebrow">{{ t().facility.eyebrow }}</p>
          <h2 class="display" id="facility-title">{{ t().facility.title }}</h2>
          <p class="lede">{{ t().facility.body }}</p>
        </header>
      </div>

      <figure class="fac__main">
        <app-media-image
          name="farm-day"
          [alt]="t().facility.mainAlt"
          [width]="1600"
          [height]="893"
          [priority]="false"
          sizes="100vw"
          style="--focus: 42% 55%"
        />
        <figcaption>{{ t().facility.houseNote }}</figcaption>
      </figure>

      <div class="fac__inner">
        <div class="fac__pair">
          <figure>
            <app-media-image
              name="farm-solar"
              [alt]="t().facility.solarAlt"
              [width]="1431"
              [height]="1167"
              sizes="(min-width: 720px) 50vw, 100vw"
              style="--focus: 50% 45%"
            />
            <figcaption>{{ t().facility.solarNote }}</figcaption>
          </figure>

          <figure>
            <app-media-image
              name="logistics-trucks"
              [alt]="t().facility.trucksAlt"
              [width]="2477"
              [height]="1106"
              sizes="(min-width: 720px) 50vw, 100vw"
              style="--focus: 55% 55%"
            />
            <figcaption>{{ t().facility.trucksNote }}</figcaption>
          </figure>
        </div>
      </div>
    </section>
  `,
  styles: `
    .fac {
      background: var(--ivory);
      color: var(--on-ivory);
      padding-block: var(--section-y);
    }

    .fac__inner {
      width: min(100% - (var(--gutter) * 2), var(--container));
      margin-inline: auto;
    }

    .fac__head {
      margin-block-end: clamp(2rem, 6vw, 3rem);
    }

    .fac__head .lede {
      margin-block-start: 1rem;
      max-width: 56ch;
    }

    .fac__main {
      margin: 0;
      position: relative;
    }

    .fac__main app-media-image {
      display: block;
      aspect-ratio: 16 / 9;
    }

    .fac__main figcaption {
      position: absolute;
      inset-block-end: 0;
      inset-inline-start: 0;
      max-width: min(100%, 26rem);
      padding: clamp(0.85rem, 3vw, 1.25rem) clamp(1rem, 4vw, 2rem);
      background: var(--ink);
      color: var(--ivory);
      font-size: var(--step-1);
      font-weight: 600;
      line-height: 1.4;
    }

    .fac__pair {
      display: grid;
      gap: clamp(1.5rem, 5vw, 2.5rem);
      margin-block-start: clamp(2rem, 6vw, 3.5rem);
    }

    .fac__pair figure {
      margin: 0;
    }

    .fac__pair app-media-image {
      display: block;
      aspect-ratio: 4 / 3;
    }

    .fac__pair figcaption {
      margin-block-start: 0.85rem;
      font-size: var(--step-0);
      font-weight: 500;
      color: var(--on-ivory-dim);
      padding-inline-start: 0.85rem;
      border-inline-start: 2px solid var(--orange);
    }

    @media (min-width: 720px) {
      .fac__pair {
        grid-template-columns: 1fr 1fr;
      }
    }
  `,
})
export class FacilityComponent {
  protected readonly t = inject(I18nService).t;
}
