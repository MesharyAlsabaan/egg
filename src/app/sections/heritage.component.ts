import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { I18nService } from '../core/i18n/i18n.service';
import { MediaImageComponent } from '../shared/media-image.component';
import { RevealDirective } from '../shared/reveal.directive';

/**
 * Short, and the only place the family history is told. The dusk aerial is
 * used here and nowhere else on the page.
 */
@Component({
  selector: 'app-heritage',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MediaImageComponent, RevealDirective],
  template: `
    <section class="her" id="heritage" aria-labelledby="heritage-title">
      <div class="her__copy" appReveal>
        <p class="eyebrow">{{ t().heritage.eyebrow }}</p>
        <h2 class="display" id="heritage-title">{{ t().heritage.title }}</h2>
        <p class="lede">{{ t().heritage.body }}</p>
      </div>

      <figure class="her__figure">
        <app-media-image
          name="farm-dusk"
          [alt]="t().heritage.imageAlt"
          [width]="1600"
          [height]="893"
          sizes="(min-width: 900px) 50vw, 100vw"
          style="--focus: 50% 62%"
        />
      </figure>
    </section>
  `,
  styles: `
    .her {
      background: var(--ink);
      color: var(--on-ink);
      --accent: var(--orange);
      --muted: var(--on-ink-dim);
      display: grid;
    }

    .her__copy {
      padding: var(--section-y) var(--gutter);
      align-self: center;
    }

    .her__copy .lede {
      margin-block-start: 1rem;
      max-width: 48ch;
    }

    .her__figure {
      margin: 0;
      aspect-ratio: 16 / 10;
    }

    .her__figure app-media-image {
      display: block;
      width: 100%;
      height: 100%;
    }

    @media (min-width: 900px) {
      .her {
        grid-template-columns: 1fr 1fr;
        align-items: stretch;
      }

      .her__copy {
        width: min(100%, calc(var(--container) / 2));
        margin-inline-start: auto;
        padding-inline: clamp(2rem, 5vw, 4rem);
      }

      html[dir='ltr'] .her__copy {
        margin-inline: 0 auto;
      }

      .her__figure {
        aspect-ratio: auto;
      }
    }
  `,
})
export class HeritageComponent {
  protected readonly t = inject(I18nService).t;
}
