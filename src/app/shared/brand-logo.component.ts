import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';

import { I18nService } from '../core/i18n/i18n.service';

/**
 * The logo, straight from the brand artwork — never redrawn.
 *
 * `mark` is the brand sheet's "primary icon": it is the variant used on the
 * dark green ground, because the terracotta wordmark does not carry enough
 * contrast against #283C22 to be legible there.
 */
@Component({
  selector: 'app-brand-logo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <picture>
      <source type="image/webp" [srcset]="srcset('webp')" [sizes]="sizes()" />
      <img
        [src]="'brand/' + variant() + '-240.png'"
        [alt]="altText()"
        [width]="box().w"
        [height]="box().h"
        [attr.fetchpriority]="priority() ? 'high' : null"
        [loading]="priority() ? 'eager' : 'lazy'"
        decoding="async"
      />
    </picture>
  `,
  styles: `
    :host,
    picture {
      display: block;
    }

    img {
      width: var(--logo-w, 120px);
      height: auto;
    }
  `,
})
export class BrandLogoComponent {
  readonly variant = input<'logo-lockup' | 'logo-lockup-green' | 'logo-mark'>('logo-lockup');
  readonly priority = input(false);
  readonly sizes = input('240px');
  /** Falls back to the company name in the reading language. */
  readonly alt = input('');
  private readonly i18n = inject(I18nService);
  protected readonly altText = computed(() => this.alt() || this.i18n.t().site.name);

  /** Intrinsic sizes of the trimmed artwork, so the header never shifts. */
  protected readonly box = computed(() =>
    this.variant() === 'logo-mark' ? { w: 480, h: 316 } : { w: 480, h: 205 },
  );

  protected srcset(format: 'webp'): string {
    return [120, 240, 480, 720].map((w) => `brand/${this.variant()}-${w}.${format} ${w}w`).join(', ');
  }
}
