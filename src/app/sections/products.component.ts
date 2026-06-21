import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { I18nService } from '../core/i18n/i18n.service';
import { SectionHeadingComponent } from '../shared/components/section-heading.component';
import { RevealDirective } from '../shared/directives/reveal.directive';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [SectionHeadingComponent, RevealDirective],
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
              <div class="product__media">
                <img [src]="p.img" [alt]="p.name" loading="lazy" [class]="p.filter" />
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
        gap: clamp(16px, 2vw, 24px);
        max-width: 1000px;
        margin-inline: auto;
      }
      .product {
        overflow: hidden;
        display: flex;
        flex-direction: column;
      }
      .product:hover {
        transform: translateY(-8px);
        box-shadow: var(--shadow-lg);
        border-color: transparent;
      }
      .product__media {
        position: relative;
        aspect-ratio: 4 / 3;
        overflow: hidden;
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s var(--ease);
        }
        img.is-brown { filter: sepia(0.45) saturate(1.5) hue-rotate(-12deg) brightness(0.92); }
        img.is-golden { filter: saturate(1.15) brightness(1.05); }
      }
      .product:hover .product__media img {
        transform: scale(1.08);
      }
      .product__tag {
        position: absolute;
        top: 12px;
        inset-inline-start: 12px;
        background: rgba(255, 255, 255, 0.95);
        color: var(--brand-700);
        font-size: 0.72rem;
        font-weight: 800;
        letter-spacing: 0.04em;
        text-transform: uppercase;
        padding: 6px 12px;
        border-radius: var(--radius-pill);
        box-shadow: var(--shadow-sm);
      }
      .product__body {
        padding: 20px 22px 24px;
        display: flex;
        flex-direction: column;
        flex: 1;
        h3 { font-size: 1.2rem; }
        p { margin: 8px 0 16px; font-size: 0.92rem; color: var(--ink-2); flex: 1; }
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

      @media (max-width: 860px) { .products { grid-template-columns: repeat(2, 1fr); max-width: 620px; } }
      @media (max-width: 520px) { .products { grid-template-columns: 1fr; max-width: 360px; } }
    `,
  ],
})
export class ProductsComponent {
  private readonly i18n = inject(I18nService);
  readonly t = this.i18n.t;

  private readonly meta = [
    { img: 'assets/images/product-white-cartons.jpg', filter: '' },
    { img: 'assets/images/product-blue-tray.jpg', filter: '' },
    { img: 'assets/images/product-mixed-pack.jpg', filter: '' },
  ];

  readonly products = computed(() =>
    this.t().products.items.map((item, i) => ({ ...item, ...this.meta[i] })),
  );
}
