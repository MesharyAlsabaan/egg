import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
} from '@angular/core';
import { I18nService } from '../core/i18n/i18n.service';
import { MotionService } from '../core/motion/motion.service';
import { CountUpDirective } from '../shared/directives/count-up.directive';
import { RevealDirective } from '../shared/directives/reveal.directive';

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [CountUpDirective, RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="stats">
      <div class="stats__bg" aria-hidden="true">
        <span class="stats__sheen"></span>
        <span class="stats__egg stats__egg--1"></span>
        <span class="stats__egg stats__egg--2"></span>
        <span class="stats__egg stats__egg--3"></span>
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
        padding-block: clamp(64px, 9vw, 118px);
        color: #fff;
        overflow: hidden;
      }
      .stats__bg {
        position: absolute;
        inset: 0;
        z-index: -2;
        background:
          radial-gradient(90% 120% at 15% 0%, #d0842a 0%, transparent 55%),
          radial-gradient(90% 120% at 90% 100%, #6ba368 0%, transparent 50%),
          linear-gradient(135deg, #3a2a17, #241c14 60%, #2c2013);
      }
      .stats__bg::before {
        content: '';
        position: absolute;
        inset: 0;
        background-image: radial-gradient(rgba(255, 255, 255, 0.08) 1.4px, transparent 1.4px);
        background-size: 26px 26px;
      }
      .stats__sheen {
        position: absolute;
        inset: -40%;
        background: radial-gradient(circle at 50% 50%, rgba(246, 196, 69, 0.25), transparent 55%);
        animation: statsSheen 12s ease-in-out infinite alternate;
      }
      @keyframes statsSheen {
        0% { transform: translate(-8%, -6%) scale(1); }
        100% { transform: translate(8%, 6%) scale(1.15); }
      }
      .stats__egg {
        position: absolute;
        width: 90px;
        height: 116px;
        border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
        background: radial-gradient(circle at 38% 28%, rgba(255,255,255,0.16), rgba(255,255,255,0.04));
        border: 1px solid rgba(255, 255, 255, 0.1);
        animation: statsFloat 9s var(--ease) infinite alternate;
      }
      .stats__egg--1 { top: 12%; inset-inline-start: 6%; }
      .stats__egg--2 { bottom: 8%; inset-inline-end: 12%; width: 64px; height: 82px; animation-delay: 2s; }
      .stats__egg--3 { top: 40%; inset-inline-end: 34%; width: 44px; height: 56px; animation-delay: 4s; opacity: 0.7; }
      @keyframes statsFloat {
        from { transform: translateY(0) rotate(-6deg); }
        to { transform: translateY(-24px) rotate(6deg); }
      }
      @media (prefers-reduced-motion: reduce) {
        .stats__sheen, .stats__egg { animation: none; }
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
        padding: 26px 14px;
        border-radius: var(--radius);
        background: rgba(255, 255, 255, 0.07);
        border: 1px solid rgba(255, 255, 255, 0.16);
        backdrop-filter: blur(6px);
        transition: transform 0.4s var(--ease), background 0.4s var(--ease);
        &:hover { transform: translateY(-8px); background: rgba(255, 255, 255, 0.13); }
      }
      .stats__value {
        display: block;
        font-family: var(--font-display);
        font-size: clamp(2.4rem, 5vw, 3.4rem);
        font-weight: 700;
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
export class StatsComponent implements AfterViewInit {
  readonly t = inject(I18nService).t;
  private readonly motion = inject(MotionService);
  private readonly host = inject(ElementRef) as ElementRef<HTMLElement>;

  ngAfterViewInit(): void {
    const items = this.host.nativeElement.querySelectorAll('.stats__item') as NodeListOf<HTMLElement>;
    this.motion.revealStagger(items, { stagger: 0.12, y: 30 });
  }
}
