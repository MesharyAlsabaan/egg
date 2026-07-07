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
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Fixed, slowly-drifting aurora wash behind every section. -->
    <div class="aurora" aria-hidden="true">
      <span class="aurora__blob aurora__blob--1"></span>
      <span class="aurora__blob aurora__blob--2"></span>
      <span class="aurora__blob aurora__blob--3"></span>
    </div>

    <app-navbar />

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

      /* ----------------------- Aurora backdrop ----------------------- */
      .aurora {
        position: fixed;
        inset: 0;
        z-index: -1;
        overflow: hidden;
        background: var(--cream);
      }
      .aurora__blob {
        position: absolute;
        border-radius: 50%;
        filter: blur(90px);
        opacity: 0.5;
        will-change: transform;
        animation: auroraDrift 26s var(--ease-soft) infinite alternate;
      }
      .aurora__blob--1 {
        width: 56vmax;
        height: 56vmax;
        top: -22vmax;
        inset-inline-start: -14vmax;
        background: radial-gradient(circle, rgba(246, 196, 69, 0.4), transparent 65%);
      }
      .aurora__blob--2 {
        width: 46vmax;
        height: 46vmax;
        bottom: -18vmax;
        inset-inline-end: -12vmax;
        background: radial-gradient(circle, rgba(107, 163, 104, 0.32), transparent 65%);
        animation-delay: -9s;
      }
      .aurora__blob--3 {
        width: 38vmax;
        height: 38vmax;
        top: 34%;
        inset-inline-start: 30%;
        background: radial-gradient(circle, rgba(227, 154, 52, 0.22), transparent 65%);
        animation-delay: -18s;
      }
      @keyframes auroraDrift {
        from { transform: translate(-3%, -2%) scale(1); }
        to { transform: translate(3%, 3%) scale(1.1); }
      }
      @media (prefers-reduced-motion: reduce) {
        .aurora__blob { animation: none; }
      }
    `,
  ],
})
export class LandingComponent implements OnInit, OnDestroy {
  private readonly motion = inject(MotionService);
  private readonly host = inject(ElementRef<HTMLElement>);
  readonly showTop = signal(false);
  readonly progress = signal(0);

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

  /**
   * Route every in-page anchor click (navbar, hero CTAs, footer…) through
   * Lenis so navigation glides with the same easing as wheel scrolling —
   * native `scroll-behavior: smooth` fights Lenis and lands with a snap.
   */
  @HostListener('click', ['$event'])
  onAnchorClick(event: MouseEvent): void {
    if (event.defaultPrevented || event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const anchor = (event.target as HTMLElement).closest?.('a[href^="#"]');
    const id = anchor?.getAttribute('href')?.slice(1);
    if (!id) return;
    const el = document.getElementById(id);
    if (!el) return;
    event.preventDefault();
    history.pushState(null, '', `#${id}`);
    const headerH =
      parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 78;
    if (id === 'home') this.motion.scrollTo(0);
    else this.motion.scrollTo(el, -headerH - 8);
    // Keep keyboard/screen-reader position in sync with the visual jump.
    el.setAttribute('tabindex', '-1');
    el.focus({ preventScroll: true });
  }

  @HostListener('window:scroll')
  onScroll(): void {
    this.showTop.set(window.scrollY > 600);
    // Fallback progress when smooth-scroll/GSAP is off (e.g. reduced motion),
    // so the to-top progress ring still tracks the whole page.
    if (!this.motion.enabled) {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      this.progress.set(max > 0 ? window.scrollY / max : 0);
    }
  }

  scrollTop(): void {
    this.motion.scrollTo(0);
  }
}
