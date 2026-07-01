import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { NavbarComponent } from '../sections/navbar.component';
import { HeroComponent } from '../sections/hero.component';
import { MarqueeComponent } from '../sections/marquee.component';
import { AboutComponent } from '../sections/about.component';
import { ProductsComponent } from '../sections/products.component';
import { WhyComponent } from '../sections/why.component';
import { ProcessComponent } from '../sections/process.component';
import { StatsComponent } from '../sections/stats.component';
import { GalleryComponent } from '../sections/gallery.component';
import { ContactComponent } from '../sections/contact.component';
import { FooterComponent } from '../sections/footer.component';
import { MotionService } from '../core/motion/motion.service';
import { EggComponent } from '../shared/components/egg.component';
import { PageVideoComponent } from '../shared/components/page-video.component';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    NavbarComponent,
    HeroComponent,
    MarqueeComponent,
    AboutComponent,
    ProductsComponent,
    WhyComponent,
    ProcessComponent,
    StatsComponent,
    GalleryComponent,
    ContactComponent,
    FooterComponent,
    EggComponent,
    PageVideoComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-page-video />
    <app-navbar />

    <!-- Egg that rolls down the page edge as you scroll top → bottom -->
    <div
      class="roller"
      [style.--p]="progress()"
      [style.--dir]="dirSign"
      aria-hidden="true"
    >
      <span class="roller__track"></span>
      <span class="roller__egg"><app-egg tone="golden" /></span>
    </div>

    <main id="main">
      <app-hero />
      <app-marquee />
      <app-about />
      <app-products />
      <app-why />
      <app-process />
      <app-stats />
      <app-gallery />
      <app-contact />
    </main>
    <app-footer />

    <button
      class="to-top"
      [class.show]="showTop()"
      [style.--progress]="progress()"
      (click)="scrollTop()"
      aria-label="Back to top"
    >
      <span class="to-top__ring" aria-hidden="true"></span>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m6 14 6-6 6 6"/></svg>
    </button>
  `,
  styles: [
    `
      .to-top {
        position: fixed;
        inset-inline-end: 22px;
        bottom: 22px;
        z-index: 90;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: var(--grad-warm);
        color: #fff;
        display: grid;
        place-items: center;
        box-shadow: var(--shadow-lg);
        opacity: 0;
        transform: translateY(20px) scale(0.8);
        pointer-events: none;
        transition: opacity 0.3s var(--ease), transform 0.3s var(--ease);
        isolation: isolate;
        svg { width: 24px; height: 24px; }
        &.show {
          opacity: 1;
          transform: none;
          pointer-events: auto;
        }
        &:hover { transform: translateY(-3px); }
      }
      .to-top__ring {
        position: absolute;
        inset: -4px;
        border-radius: 50%;
        background: conic-gradient(
          var(--yolk) calc(var(--progress, 0) * 360deg),
          rgba(255, 255, 255, 0.35) 0deg
        );
        -webkit-mask: radial-gradient(farthest-side, transparent calc(100% - 4px), #000 calc(100% - 4px));
                mask: radial-gradient(farthest-side, transparent calc(100% - 4px), #000 calc(100% - 4px));
        z-index: -1;
      }

      /* -------------------- Rolling egg (page-wide) ------------------ */
      .roller {
        position: fixed;
        top: calc(var(--header-h) + 6px);
        inset-inline-start: clamp(6px, 1.6vw, 22px);
        z-index: 70;
        width: clamp(34px, 4vw, 48px);
        height: clamp(43px, 5vw, 60px);
        pointer-events: none;
        /* Travel from just under the header to just above the viewport floor,
           mapped 1:1 to whole-page scroll progress (0 → 1). */
        transform: translateY(calc(var(--p, 0) * (100svh - var(--header-h) - 96px)));
        will-change: transform;
      }
      .roller__egg {
        display: block;
        width: 100%;
        height: 100%;
        /* Spin many turns over the full page so it reads as "rolling". */
        transform: rotate(calc(var(--p, 0) * 1800deg * var(--dir, 1)));
        filter: drop-shadow(0 6px 10px rgba(178, 110, 32, 0.35));
      }
      .roller__track {
        position: absolute;
        inset-inline-start: 50%;
        top: -6px;
        transform: translateX(-50%);
        width: 3px;
        height: calc(100svh - var(--header-h) - 40px);
        border-radius: 3px;
        background: repeating-linear-gradient(
          to bottom,
          rgba(227, 154, 52, 0.35) 0 6px,
          transparent 6px 14px
        );
        z-index: -1;
        opacity: 0.5;
      }
      @media (max-width: 600px) {
        .roller__track { display: none; }
        .roller { inset-inline-start: 4px; }
      }
      @media (prefers-reduced-motion: reduce) {
        .roller__egg { transform: none; }
      }
    `,
  ],
})
export class LandingComponent implements OnInit, OnDestroy {
  private readonly motion = inject(MotionService);
  private readonly host = inject(ElementRef<HTMLElement>);
  readonly showTop = signal(false);
  readonly progress = signal(0);

  /** Roll the egg the "natural" way for the current writing direction. */
  get dirSign(): number {
    return typeof document !== 'undefined' && document.documentElement.dir === 'rtl' ? -1 : 1;
  }

  // init() runs in ngOnInit (not ngAfterViewInit) so the GSAP plugin is
  // registered and Lenis is running BEFORE child section components wire their
  // ScrollTriggers in their own ngAfterViewInit (children run before parent's).
  ngOnInit(): void {
    this.motion.init();
    this.motion.onScrollProgress((p) => this.progress.set(p));
  }

  ngOnDestroy(): void {
    this.motion.destroy();
  }

  @HostListener('window:scroll')
  onScroll(): void {
    this.showTop.set(window.scrollY > 600);
    // Fallback progress when smooth-scroll/GSAP is off (e.g. reduced motion),
    // so the rolling egg still tracks the whole page top → bottom.
    if (!this.motion.enabled) {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      this.progress.set(max > 0 ? window.scrollY / max : 0);
    }
  }

  scrollTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
