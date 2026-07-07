import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, OnDestroy, computed, inject } from '@angular/core';
import { I18nService } from '../core/i18n/i18n.service';
import { MotionService } from '../core/motion/motion.service';
import { SectionHeadingComponent } from '../shared/components/section-heading.component';
import { RevealDirective } from '../shared/directives/reveal.directive';
import { SafeHtmlPipe } from '../shared/pipes/safe-html.pipe';

type ProductTone = 'white' | 'brown' | 'golden';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [SectionHeadingComponent, RevealDirective, SafeHtmlPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="products" class="section section--tint">
      <div class="container">
        <app-section-heading
          [eyebrow]="t().products.eyebrow"
          [title]="t().products.title"
          [desc]="t().products.desc"
        />

        <div class="products">
          @for (p of products(); track p.name; let i = $index) {
            <article class="product card" appReveal [appReveal]="i + 1">
              <div class="product__media" [attr.data-tone]="p.tone">
                <span class="product__glow"></span>
                <span class="product__icon" [innerHTML]="p.icon | safeHtml"></span>
                <span class="product__tag">{{ p.tag }}</span>
              </div>
              <div class="product__body">
                <h3>{{ p.name }}</h3>
                <p>{{ p.desc }}</p>
                <a href="#contact" class="product__link">
                  {{ t().products.cta }}
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </a>
              </div>
            </article>
          }
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      .products {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: clamp(16px, 2vw, 26px);
        max-width: 1040px;
        margin-inline: auto;
      }
      .product {
        overflow: hidden;
        display: flex;
        flex-direction: column;
      }
      .product:hover {
        box-shadow: var(--shadow-lg);
        border-color: transparent;
      }
      .product__media {
        position: relative;
        aspect-ratio: 4 / 3;
        overflow: hidden;
        display: grid;
        place-items: center;
        background: linear-gradient(160deg, #fffaf0, #f3e6cd);
      }
      .product__media[data-tone='brown'] { background: linear-gradient(160deg, #f7ecda, #eeddc0); }
      .product__media[data-tone='golden'] { background: linear-gradient(160deg, #fff5d8, #f6e6b4); }
      /* Light sheen that sweeps across the media panel on hover. */
      .product__media::before {
        content: '';
        position: absolute;
        inset: 0;
        z-index: 2;
        pointer-events: none;
        background: linear-gradient(115deg, transparent 35%, rgba(255, 255, 255, 0.5) 50%, transparent 65%);
        transform: translateX(-130%);
        opacity: 0;
      }
      .product:hover .product__media::before {
        transform: translateX(130%);
        opacity: 1;
        transition: transform 0.9s var(--ease), opacity 0.2s;
      }
      .product__media::after {
        content: '';
        position: absolute;
        inset: 0;
        background-image: radial-gradient(rgba(107, 74, 43, 0.08) 1.2px, transparent 1.2px);
        background-size: 22px 22px;
      }
      .product__glow {
        position: absolute;
        width: 62%;
        aspect-ratio: 1;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(246, 196, 69, 0.5), transparent 68%);
        filter: blur(6px);
        transition: transform 0.6s var(--ease), opacity 0.6s var(--ease);
      }
      /* Glass medallion with a line icon per product line. */
      .product__icon {
        position: relative;
        z-index: 1;
        display: grid;
        place-items: center;
        width: 104px;
        height: 104px;
        border-radius: 32px;
        background: rgba(255, 255, 255, 0.6);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.85);
        box-shadow: 0 22px 34px -20px rgba(107, 74, 43, 0.45);
        color: var(--brand-700);
        transition: transform 0.6s var(--ease), box-shadow 0.6s var(--ease);
        ::ng-deep svg { width: 46px; height: 46px; }
      }
      .product:hover .product__icon {
        transform: translateY(-8px) rotate(-4deg) scale(1.06);
        box-shadow: 0 30px 44px -22px rgba(107, 74, 43, 0.55);
      }
      .product:hover .product__glow { transform: scale(1.15); opacity: 0.85; }
      .product__tag {
        position: absolute;
        top: 14px;
        inset-inline-start: 14px;
        z-index: 2;
        background: rgba(255, 255, 255, 0.96);
        color: var(--brand-700);
        font-size: 0.72rem;
        font-weight: 800;
        letter-spacing: 0.04em;
        text-transform: uppercase;
        padding: 6px 13px;
        border-radius: var(--radius-pill);
        box-shadow: var(--shadow-sm);
      }
      .product__body {
        padding: 22px 24px 26px;
        display: flex;
        flex-direction: column;
        flex: 1;
        h3 { font-size: 1.25rem; }
        p { margin: 8px 0 18px; font-size: 0.92rem; color: var(--ink-2); flex: 1; }
      }
      .product__link {
        display: inline-flex;
        align-items: center;
        gap: 7px;
        font-weight: 700;
        font-size: 0.9rem;
        color: var(--brand-700);
        svg { width: 16px; height: 16px; transition: transform 0.3s var(--ease); }
        &:hover svg { transform: translateX(3px); }
      }
      :host-context([dir='rtl']) .product__link svg { transform: scaleX(-1); }
      :host-context([dir='rtl']) .product__link:hover svg { transform: scaleX(-1) translateX(3px); }

      @media (max-width: 860px) { .products { grid-template-columns: repeat(2, 1fr); max-width: 640px; } }
      @media (max-width: 520px) { .products { grid-template-columns: 1fr; max-width: 360px; } }
      @media (prefers-reduced-motion: reduce) {
        .product:hover .product__icon { transform: none; }
        .product__media::before { display: none; }
      }
    `,
  ],
})
export class ProductsComponent implements AfterViewInit, OnDestroy {
  private readonly i18n = inject(I18nService);
  private readonly motion = inject(MotionService);
  private readonly host = inject(ElementRef) as ElementRef<HTMLElement>;
  readonly t = this.i18n.t;
  private readonly tiltCleanups: Array<() => void> = [];

  ngAfterViewInit(): void {
    const cards = this.host.nativeElement.querySelectorAll('.product') as NodeListOf<HTMLElement>;
    this.motion.revealStagger(cards, { stagger: 0.1, y: 36 });
    if (this.motion.enabled && !matchMedia('(hover: none)').matches) {
      cards.forEach((card) => this.attachTilt(card));
    }
  }

  ngOnDestroy(): void {
    this.tiltCleanups.forEach((fn) => fn());
    this.tiltCleanups.length = 0;
  }

  private attachTilt(card: HTMLElement): void {
    const onMove = (e: MouseEvent): void => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform =
        `perspective(800px) rotateY(${px * 8}deg) rotateX(${-py * 8}deg) translateY(-8px)`;
    };
    const onLeave = (): void => { card.style.transform = ''; };
    card.addEventListener('mousemove', onMove);
    card.addEventListener('mouseleave', onLeave);
    this.tiltCleanups.push(() => {
      card.removeEventListener('mousemove', onMove);
      card.removeEventListener('mouseleave', onLeave);
    });
  }

  /** Tinted media + line icon per product slot (white / brown / golden premium). */
  private readonly meta: { tone: ProductTone; icon: string }[] = [
    {
      tone: 'white',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4"/><circle cx="12" cy="12" r="4"/></svg>',
    },
    {
      tone: 'brown',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M20 4s1 10-6 12c-4-6 6-12 6-12Z"/><path d="M17 8c-3 2-4.5 5-5 8.5"/><path d="M4 20c0-4 3-7 8-7"/></svg>',
    },
    {
      tone: 'golden',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="m3 8 4 4 5-6 5 6 4-4v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/></svg>',
    },
  ];

  readonly products = computed(() =>
    this.t().products.items.map((item, i) => ({ ...item, ...this.meta[i % this.meta.length] })),
  );
}
