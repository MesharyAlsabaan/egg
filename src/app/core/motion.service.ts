import { isPlatformBrowser } from '@angular/common';
import { DOCUMENT, Injectable, PLATFORM_ID, inject } from '@angular/core';

/**
 * One place decides whether the site is allowed to move.
 *
 * `html.js-motion` is what unlocks the reveal styles in styles.scss. It is
 * added only when JS is running AND the visitor has not asked for reduced
 * motion — so with JS disabled, or with the OS setting on, every element
 * renders in its final, visible state and nothing can strand content at
 * opacity 0.
 */
@Injectable({ providedIn: 'root' })
export class MotionService {
  private readonly doc = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly win = this.isBrowser ? this.doc.defaultView : null;

  readonly reducedMotion =
    this.win?.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

  /** Respect the visitor's data-saver preference for autoplaying video. */
  readonly saveData =
    (this.win?.navigator as Navigator & { connection?: { saveData?: boolean } })?.connection
      ?.saveData ?? false;

  /** True when we may autoplay background video at all. */
  readonly allowsAutoplay = !this.reducedMotion && !this.saveData;

  private observer?: IntersectionObserver;

  enable(): void {
    if (!this.isBrowser || this.reducedMotion || !this.win) {
      return;
    }
    this.doc.documentElement.classList.add('js-motion');
  }

  /**
   * Reveal-on-scroll, sharing a single observer across the page. Elements are
   * unobserved once shown — this never re-hides anything.
   */
  observe(element: Element): () => void {
    if (!this.isBrowser || this.reducedMotion || !this.win || !('IntersectionObserver' in this.win)) {
      element.classList.add('is-in');
      return () => {};
    }

    this.observer ??= new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in');
            this.observer?.unobserve(entry.target);
          }
        }
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.05 },
    );

    this.observer.observe(element);
    return () => this.observer?.unobserve(element);
  }
}
