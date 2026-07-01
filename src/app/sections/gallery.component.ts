import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  inject,
} from '@angular/core';
import { I18nService } from '../core/i18n/i18n.service';
import { MotionService } from '../core/motion/motion.service';
import { SectionHeadingComponent } from '../shared/components/section-heading.component';
import { RevealDirective } from '../shared/directives/reveal.directive';
import { SafeHtmlPipe } from '../shared/pipes/safe-html.pipe';

interface Tile {
  en: string;
  ar: string;
  span: string;
  grad: string;
  icon: string;
}

/**
 * Visual showcase built entirely from CSS gradients + inline SVG line art
 * (no photography). A bento grid of "farm moments" with a hover lift + zoom.
 */
@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [SectionHeadingComponent, RevealDirective, SafeHtmlPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="gallery" class="section section--tint">
      <div class="container">
        <app-section-heading
          [eyebrow]="t().gallery.eyebrow"
          [title]="t().gallery.title"
          [desc]="t().gallery.desc"
        />

        <div class="gallery">
          @for (tile of tiles; track tile.en; let i = $index) {
            <figure
              class="gtile"
              [class]="tile.span"
              [style.--grad]="tile.grad"
              appReveal
              [appReveal]="(i % 4) + 1"
            >
              <span class="gtile__art" [innerHTML]="tile.icon | safeHtml"></span>
              <span class="gtile__dots" aria-hidden="true"></span>
              <figcaption>{{ i18n.isRtl() ? tile.ar : tile.en }}</figcaption>
            </figure>
          }
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      .gallery {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        grid-auto-rows: 200px;
        gap: 16px;
      }
      .gtile {
        position: relative;
        overflow: hidden;
        border-radius: var(--radius);
        background: var(--grad);
        box-shadow: var(--shadow-sm);
        border: 1px solid rgba(255, 255, 255, 0.5);
        display: grid;
        place-items: center;
        transition: transform 0.45s var(--ease), box-shadow 0.45s var(--ease);
      }
      .gtile:hover { transform: translateY(-6px); box-shadow: var(--shadow-lg); }
      .gtile__dots {
        position: absolute;
        inset: 0;
        background-image: radial-gradient(rgba(255, 255, 255, 0.45) 1.3px, transparent 1.3px);
        background-size: 20px 20px;
        opacity: 0.5;
      }
      .gtile__art {
        position: relative;
        z-index: 1;
        width: 46%;
        max-width: 118px;
        color: rgba(60, 42, 22, 0.82);
        transition: transform 0.5s var(--ease);
        ::ng-deep svg { width: 100%; height: auto; }
      }
      .gtile:hover .gtile__art { transform: scale(1.12) rotate(-3deg); }
      figcaption {
        position: absolute;
        inset-inline: 16px;
        bottom: 14px;
        z-index: 2;
        font-family: var(--font-display);
        font-weight: 600;
        font-size: 1rem;
        color: #3a2a16;
        text-shadow: 0 1px 8px rgba(255, 255, 255, 0.5);
      }

      .wide { grid-column: span 2; }
      .tall { grid-row: span 2; }

      @media (max-width: 880px) {
        .gallery { grid-template-columns: repeat(2, 1fr); grid-auto-rows: 170px; }
        .wide { grid-column: span 2; }
        .tall { grid-row: span 1; }
      }
      @media (max-width: 520px) {
        .gallery { grid-template-columns: 1fr 1fr; grid-auto-rows: 140px; }
        .gtile__art { width: 40%; }
        figcaption { font-size: 0.85rem; }
      }
    `,
  ],
})
export class GalleryComponent implements AfterViewInit {
  readonly i18n = inject(I18nService);
  private readonly motion = inject(MotionService);
  private readonly host = inject(ElementRef<HTMLElement>);
  readonly t = this.i18n.t;

  private s = (d: string) =>
    `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;

  readonly tiles: Tile[] = [
    {
      en: 'Climate-controlled houses', ar: 'حظائر مكيّفة', span: 'wide tall',
      grad: 'linear-gradient(150deg,#fce9c8,#f4d59a)',
      icon: this.s('<path d="M10 30 32 14l22 16"/><path d="M16 30v20h32V30"/><path d="M28 50V38h8v12"/>'),
    },
    {
      en: 'Daily collection', ar: 'جمع يومي', span: '',
      grad: 'linear-gradient(150deg,#e9f2df,#cfe4be)',
      icon: this.s('<ellipse cx="24" cy="34" rx="8" ry="11"/><ellipse cx="40" cy="34" rx="8" ry="11"/><path d="M12 48h40"/>'),
    },
    {
      en: 'Precision grading', ar: 'فرز دقيق', span: '',
      grad: 'linear-gradient(150deg,#fbe6d0,#f3cba6)',
      icon: this.s('<circle cx="28" cy="28" r="14"/><path d="m40 40 10 10"/><path d="m22 28 4 4 8-8"/>'),
    },
    {
      en: 'Automated packing', ar: 'تعبئة آلية', span: 'wide',
      grad: 'linear-gradient(150deg,#fdeecb,#f7dca0)',
      icon: this.s('<path d="M12 22h40v10H12z"/><path d="M16 32v18h32V32"/><path d="M26 22v-6h12v6"/><path d="M28 40h8"/>'),
    },
    {
      en: 'Solar-powered farm', ar: 'طاقة شمسية', span: '',
      grad: 'linear-gradient(150deg,#e9f2df,#cbe1bb)',
      icon: this.s('<circle cx="32" cy="24" r="8"/><path d="M32 8v4M32 36v4M16 24h4M44 24h4M20 12l3 3M44 12l-3 3"/><path d="M18 52 24 42h16l6 10z"/>'),
    },
    {
      en: 'Green fields', ar: 'حقول خضراء', span: '',
      grad: 'linear-gradient(150deg,#e3efd8,#c4dcae)',
      icon: this.s('<path d="M32 50V26"/><path d="M32 34c-6-2-10-8-10-14 6 0 10 4 10 10"/><path d="M32 30c6-2 10-8 10-14-6 0-10 4-10 10"/><path d="M14 50h36"/>'),
    },
    {
      en: 'Fresh delivery', ar: 'توصيل طازج', span: 'wide',
      grad: 'linear-gradient(150deg,#fbe6d0,#f2c9a2)',
      icon: this.s('<path d="M8 20h26v22H8z"/><path d="M34 26h10l8 8v8H34z"/><circle cx="18" cy="46" r="4"/><circle cx="44" cy="46" r="4"/>'),
    },
    {
      en: 'Trusted sourcing', ar: 'مصدر موثوق', span: '',
      grad: 'linear-gradient(150deg,#fdeecb,#f6d89b)',
      icon: this.s('<path d="M32 10 16 16v12c0 12 8 18 16 22 8-4 16-10 16-22V16z"/><path d="m24 30 5 5 11-11"/>'),
    },
  ];

  ngAfterViewInit(): void {
    const tiles = this.host.nativeElement.querySelectorAll('.gtile') as NodeListOf<HTMLElement>;
    this.motion.revealStagger(tiles, { stagger: 0.07, y: 24 });
  }
}
