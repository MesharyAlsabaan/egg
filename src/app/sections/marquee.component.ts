import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { I18nService } from '../core/i18n/i18n.service';

@Component({
  selector: 'app-marquee',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="marquee" aria-hidden="true">
      <div class="marquee__row">
        @for (item of loop(); track $index) {
          <span class="marquee__item">{{ item }}</span>
          <span class="marquee__dot">●</span>
        }
      </div>
    </div>
  `,
  styles: [
    `
      .marquee {
        overflow: hidden;
        background: rgba(253, 245, 234, 0.66);
        border-block: 1px solid var(--line);
        padding-block: 14px;
      }
      .marquee__row {
        display: inline-flex;
        align-items: center;
        gap: 26px;
        white-space: nowrap;
        will-change: transform;
        animation: marquee 28s linear infinite;
      }
      .marquee:hover .marquee__row { animation-play-state: paused; }
      .marquee__item {
        font-weight: 800;
        letter-spacing: 0.02em;
        color: var(--brand-700);
        font-size: clamp(0.95rem, 2vw, 1.15rem);
      }
      .marquee__dot { color: var(--yolk); font-size: 0.6rem; }
      @keyframes marquee {
        from { transform: translateX(0); }
        to { transform: translateX(-50%); }
      }
      :host-context([dir='rtl']) .marquee__row { animation-direction: reverse; }
      @media (prefers-reduced-motion: reduce) {
        .marquee__row { animation: none; flex-wrap: wrap; white-space: normal; justify-content: center; }
      }
    `,
  ],
})
export class MarqueeComponent {
  private readonly t = inject(I18nService).t;
  // Duplicate the list so the -50% translate loops seamlessly.
  readonly loop = computed(() => [...this.t().marquee, ...this.t().marquee]);
}
