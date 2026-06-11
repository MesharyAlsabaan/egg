import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { I18nService } from '../core/i18n/i18n.service';
import { SectionHeadingComponent } from '../shared/components/section-heading.component';
import { RevealDirective } from '../shared/directives/reveal.directive';

@Component({
  selector: 'app-why',
  standalone: true,
  imports: [SectionHeadingComponent, RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="why" class="section">
      <div class="container">
        <app-section-heading
          [eyebrow]="t().why.eyebrow"
          [title]="t().why.title"
          [desc]="t().why.desc"
        />

        <div class="why">
          @for (item of items(); track item.title; let i = $index) {
            <article class="why__card card" appReveal [appReveal]="(i % 3) + 1">
              <span class="why__icon" [innerHTML]="item.icon"></span>
              <h3>{{ item.title }}</h3>
              <p>{{ item.desc }}</p>
            </article>
          }
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      .why {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        gap: clamp(16px, 1.8vw, 22px);
      }
      .why__card {
        padding: 28px 22px;
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 6px;
        &:hover {
          transform: translateY(-8px);
          box-shadow: var(--shadow);
          border-color: transparent;
        }
        h3 { font-size: 1.05rem; }
        p { font-size: 0.88rem; color: var(--ink-2); }
      }
      .why__icon {
        display: grid;
        place-items: center;
        width: 64px;
        height: 64px;
        border-radius: 18px;
        margin-bottom: 10px;
        background: var(--grad-warm);
        color: #fff;
        box-shadow: 0 10px 22px -10px rgba(224, 123, 38, 0.7);
        transition: transform 0.4s var(--ease);
        ::ng-deep svg { width: 30px; height: 30px; }
      }
      .why__card:hover .why__icon {
        transform: rotate(-6deg) scale(1.06);
      }
      @media (max-width: 1040px) { .why { grid-template-columns: repeat(3, 1fr); } }
      @media (max-width: 680px) { .why { grid-template-columns: repeat(2, 1fr); } }
      @media (max-width: 420px) { .why { grid-template-columns: 1fr; } }
    `,
  ],
})
export class WhyComponent {
  private readonly i18n = inject(I18nService);
  readonly t = this.i18n.t;

  private readonly icons = [
    // Fresh daily — sun/sunrise
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v3M4.2 10.2 6 12M2 18h20M18 12l1.8-1.8M5 18a7 7 0 0 1 14 0"/></svg>',
    // Quality — badge check
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m9 12 2 2 4-4"/><path d="M12 2 4 5v6c0 5 3.4 8.5 8 11 4.6-2.5 8-6 8-11V5l-8-3Z"/></svg>',
    // Certified — rosette
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="9" r="6"/><path d="m9 14-2 7 5-3 5 3-2-7"/></svg>',
    // Fast delivery — truck
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h11v9H3zM14 9h4l3 3v3h-7z"/><circle cx="7" cy="18" r="1.6"/><circle cx="17" cy="18" r="1.6"/></svg>',
    // Trusted — heart hand
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s-7-4.3-9.3-8.5C1 9.5 2.6 6 6 6c2 0 3 1.2 4 2.5C11 7.2 12 6 14 6c3.4 0 5 3.5 3.3 6.5C19 16.7 12 21 12 21Z"/></svg>',
  ];

  readonly items = computed(() =>
    this.t().why.items.map((item, i) => ({ ...item, icon: this.icons[i] })),
  );
}
