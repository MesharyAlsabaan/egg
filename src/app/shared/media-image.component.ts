import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { MEDIA_WIDTHS } from '../core/media-manifest';

/**
 * A responsive <picture> for anything produced by tools/build-media.py.
 *
 * Intrinsic width/height are required so the box is reserved before the
 * bytes land — no layout shift. `priority` images are fetched eagerly;
 * everything else is lazy.
 */
@Component({
  selector: 'app-media-image',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <picture>
      <source type="image/avif" [srcset]="set('avif')" [sizes]="sizes()" />
      <source type="image/webp" [srcset]="set('webp')" [sizes]="sizes()" />
      <img
        [src]="'media/' + name() + '-' + fallbackWidth() + '.jpg'"
        [alt]="alt()"
        [width]="width()"
        [height]="height()"
        [loading]="priority() ? 'eager' : 'lazy'"
        [attr.fetchpriority]="priority() ? 'high' : null"
        decoding="async"
      />
    </picture>
  `,
  styles: `
    :host,
    picture,
    img {
      display: block;
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: var(--focus, 50% 50%);
    }
  `,
})
export class MediaImageComponent {
  /** File stem, e.g. `farm-day`. */
  readonly name = input.required<string>();
  readonly alt = input.required<string>();
  readonly width = input.required<number>();
  readonly height = input.required<number>();
  readonly sizes = input('100vw');
  readonly priority = input(false);

  /**
   * Widths actually written by the build. Masters differ in size and the
   * pipeline never upscales, so asking for a width that does not exist is a
   * 404 — hence the generated manifest rather than a hard-coded list.
   */
  protected readonly widths = computed(() => MEDIA_WIDTHS[this.name()] ?? [768]);

  protected readonly fallbackWidth = computed(() => {
    const list = this.widths();
    return list[Math.min(2, list.length - 1)];
  });

  protected set(format: 'avif' | 'webp'): string {
    return this.widths()
      .map((w) => `media/${this.name()}-${w}.${format} ${w}w`)
      .join(', ');
  }
}
