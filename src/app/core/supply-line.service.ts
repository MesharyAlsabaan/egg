import { isPlatformBrowser } from '@angular/common';
import { DOCUMENT, Injectable, NgZone, PLATFORM_ID, inject } from '@angular/core';

import { MotionService } from './motion.service';

/**
 * Drives the orange supply line.
 *
 * Every registered element gets a `--fill` custom property between 0 and 1,
 * describing how far the reading position has travelled through that section.
 * One passive scroll listener and one rAF frame serve the whole page, and the
 * work happens outside Angular so it never triggers change detection.
 *
 * With reduced motion the line is simply drawn complete.
 */
@Injectable({ providedIn: 'root' })
export class SupplyLineService {
  private readonly doc = inject(DOCUMENT);
  private readonly zone = inject(NgZone);
  private readonly motion = inject(MotionService);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  private readonly elements = new Set<HTMLElement>();
  private frame = 0;
  private listening = false;

  register(element: HTMLElement): () => void {
    if (!this.isBrowser) {
      return () => {};
    }
    if (this.motion.reducedMotion) {
      element.style.setProperty('--fill', '1');
      return () => {};
    }

    this.elements.add(element);
    this.listen();
    this.schedule();

    return () => {
      this.elements.delete(element);
      if (!this.elements.size) {
        this.stop();
      }
    };
  }

  private listen(): void {
    if (this.listening) {
      return;
    }
    this.listening = true;
    this.zone.runOutsideAngular(() => {
      this.doc.defaultView?.addEventListener('scroll', this.schedule, { passive: true });
      this.doc.defaultView?.addEventListener('resize', this.schedule, { passive: true });
    });
  }

  private stop(): void {
    if (!this.isBrowser) {
      return;
    }
    this.listening = false;
    this.doc.defaultView?.removeEventListener('scroll', this.schedule);
    this.doc.defaultView?.removeEventListener('resize', this.schedule);
    cancelAnimationFrame(this.frame);
  }

  private readonly schedule = (): void => {
    cancelAnimationFrame(this.frame);
    this.frame = requestAnimationFrame(this.measure);
  };

  private readonly measure = (): void => {
    const viewport = this.doc.defaultView?.innerHeight ?? 0;
    // The reading line sits a little above centre — the point a visitor is
    // actually looking at while scrolling.
    const readLine = viewport * 0.62;

    for (const element of this.elements) {
      const rect = element.getBoundingClientRect();
      const travelled = (readLine - rect.top) / Math.max(rect.height, 1);
      const fill = Math.min(1, Math.max(0, travelled));
      element.style.setProperty('--fill', fill.toFixed(4));
    }
  };
}
