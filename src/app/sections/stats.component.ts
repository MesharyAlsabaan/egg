import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { I18nService } from '../core/i18n/i18n.service';
import { CountUpDirective } from '../shared/directives/count-up.directive';
import { RevealDirective } from '../shared/directives/reveal.directive';

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [CountUpDirective, RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="stats">
      <div class="stats__bg">
        <img src="assets/images/facility-aerial.jpg" alt="" aria-hidden="true" loading="lazy" />
      </div>
      <div class="container">
        <h2 class="stats__title h-section" appReveal>{{ t().stats.title }}</h2>
        <div class="stats__grid">
          @for (item of t().stats.items; track item.label; let i = $index) {
            <div class="stats__item" appReveal [appReveal]="i + 1">
              <span
                class="stats__value"
                [appCountUp]="item.value"
                [suffix]="item.suffix"
              >0{{ item.suffix }}</span>
              <span class="stats__label">{{ item.label }}</span>
            </div>
          }
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      .stats {
        position: relative;
        isolation: isolate;
        padding-block: clamp(64px, 9vw, 110px);
        color: #fff;
        overflow: hidden;
      }
      .stats__bg {
        position: absolute;
        inset: 0;
        z-index: -2;
        img { width: 100%; height: 100%; object-fit: cover; }
        &::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(178, 90, 22, 0.94), rgba(33, 26, 19, 0.9));
        }
      }
      .stats__title {
        text-align: center;
        color: #fff;
        margin-bottom: clamp(36px, 5vw, 56px);
      }
      .stats__grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: clamp(20px, 3vw, 40px);
      }
      .stats__item {
        text-align: center;
        padding: 22px 12px;
        border-radius: var(--radius);
        background: rgba(255, 255, 255, 0.08);
        border: 1px solid rgba(255, 255, 255, 0.16);
        backdrop-filter: blur(4px);
        transition: transform 0.4s var(--ease), background 0.4s var(--ease);
        &:hover { transform: translateY(-6px); background: rgba(255, 255, 255, 0.14); }
      }
      .stats__value {
        display: block;
        font-size: clamp(2.4rem, 5vw, 3.4rem);
        font-weight: 800;
        line-height: 1;
        color: var(--yolk);
        text-shadow: 0 6px 24px rgba(0, 0, 0, 0.25);
      }
      .stats__label {
        display: block;
        margin-top: 12px;
        font-size: 0.95rem;
        color: rgba(255, 255, 255, 0.9);
        font-weight: 500;
      }
      @media (max-width: 720px) { .stats__grid { grid-template-columns: repeat(2, 1fr); } }
    `,
  ],
})
export class StatsComponent {
  readonly t = inject(I18nService).t;
}
