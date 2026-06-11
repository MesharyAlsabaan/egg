import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  signal,
} from '@angular/core';
import { NavbarComponent } from '../sections/navbar.component';
import { HeroComponent } from '../sections/hero.component';
import { AboutComponent } from '../sections/about.component';
import { ProductsComponent } from '../sections/products.component';
import { WhyComponent } from '../sections/why.component';
import { ProcessComponent } from '../sections/process.component';
import { StatsComponent } from '../sections/stats.component';
import { GalleryComponent } from '../sections/gallery.component';
import { ContactComponent } from '../sections/contact.component';
import { FooterComponent } from '../sections/footer.component';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    NavbarComponent,
    HeroComponent,
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
    <app-navbar />
    <main id="main">
      <app-hero />
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
      (click)="scrollTop()"
      aria-label="Back to top"
    >
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
        svg { width: 24px; height: 24px; }
        &.show {
          opacity: 1;
          transform: none;
          pointer-events: auto;
        }
        &:hover { transform: translateY(-3px); }
      }
    `,
  ],
})
export class LandingComponent {
  readonly showTop = signal(false);

  @HostListener('window:scroll')
  onScroll(): void {
    this.showTop.set(window.scrollY > 600);
  }

  scrollTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
