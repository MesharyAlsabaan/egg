import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
} from '@angular/core';
import { I18nService } from '../core/i18n/i18n.service';
import { RevealDirective } from '../shared/directives/reveal.directive';
import { MotionService } from '../core/motion/motion.service';
import { SafeHtmlPipe } from '../shared/pipes/safe-html.pipe';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [RevealDirective, SafeHtmlPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="about" class="section">
      <div class="container about">
        <div class="about__body">
          <span class="eyebrow" appReveal data-reveal>{{ t().about.eyebrow }}</span>
          <h2 class="h-section" appReveal="1" data-reveal>{{ t().about.title }}</h2>
          <p class="lead" appReveal="2" data-reveal>{{ t().about.story }}</p>

          <div class="about__cards">
            @for (card of cards(); track card.title; let i = $index) {
              <article class="about__card" appReveal [appReveal]="i + 1" data-reveal>
                <span class="about__card-icon" [innerHTML]="card.icon | safeHtml"></span>
                <h3>{{ card.title }}</h3>
                <p>{{ card.text }}</p>
              </article>
            }
          </div>
        </div>

        <div class="about__media" appReveal>
          <div class="about__scene" aria-label="Sunrise over green farm fields">
            <span class="about__leaf" aria-hidden="true">
              <svg viewBox="0 0 48 48" fill="none"><path d="M40 8s2 20-12 24C22 20 40 8 40 8Z" fill="#6ba368"/><path d="M34 15c-6 4-9 10-10 17" stroke="#4f7d4d" stroke-width="1.6" stroke-linecap="round"/></svg>
            </span>

            <span class="about__sunrise" aria-hidden="true"></span>
            <span class="about__ring" aria-hidden="true"></span>
            <span class="about__hill about__hill--back" aria-hidden="true"></span>
            <span class="about__hill about__hill--front" aria-hidden="true"></span>
          </div>

          <div class="about__badge">
            <strong>100%</strong>
            <span>{{ i18n.isRtl() ? 'بيض سعودي' : 'Saudi eggs' }}</span>
          </div>

          <div class="about__chip">
            <span class="about__chip-dot"></span>
            {{ i18n.isRtl() ? 'جودة درجة أ' : 'Grade A quality' }}
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      .about {
        display: grid;
        grid-template-columns: 1.05fr 0.95fr;
        gap: clamp(32px, 5vw, 72px);
        align-items: center;
      }
      .about__body .lead { margin-top: 18px; }
      .about__cards {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 16px;
        margin-top: 34px;
      }
      .about__card {
        background: var(--paper);
        border: 1px solid var(--line);
        border-radius: var(--radius);
        padding: 24px;
        transition: transform 0.35s var(--ease), box-shadow 0.35s var(--ease);
        &:hover { transform: translateY(-6px); box-shadow: var(--shadow); }
        &:first-child { grid-column: 1 / -1; }
        h3 { font-size: 1.15rem; margin-bottom: 6px; }
        p { font-size: 0.92rem; color: var(--ink-2); }
      }
      .about__card-icon {
        display: grid;
        place-items: center;
        width: 46px;
        height: 46px;
        border-radius: 13px;
        background: var(--brand-soft);
        color: var(--brand-700);
        margin-bottom: 14px;
        ::ng-deep svg { width: 22px; height: 22px; }
      }

      /* ------------------------ Illustration ------------------------ */
      .about__media {
        position: relative;
        min-height: 440px;
        display: grid;
        place-items: center;
      }
      .about__scene {
        position: relative;
        width: min(100%, 460px);
        aspect-ratio: 1 / 0.92;
        border-radius: var(--radius-lg);
        background:
          radial-gradient(120% 90% at 30% 15%, #fff6e4 0%, transparent 55%),
          linear-gradient(150deg, #fbeccf 0%, #f4dfb4 55%, #ecd39a 100%);
        box-shadow: var(--shadow-lg);
        overflow: hidden;
        display: grid;
        place-items: center;
      }
      .about__scene::before {
        content: '';
        position: absolute;
        inset: 0;
        background-image: radial-gradient(rgba(107, 74, 43, 0.1) 1.4px, transparent 1.4px);
        background-size: 26px 26px;
        opacity: 0.5;
      }
      /* Sunrise disc rising over two rolling hills — pure CSS scenery. */
      .about__sunrise {
        position: absolute;
        top: 16%;
        inset-inline-start: 50%;
        transform: translateX(-50%);
        width: 46%;
        aspect-ratio: 1;
        border-radius: 50%;
        background: var(--grad-sun);
        box-shadow: 0 0 90px 24px rgba(246, 196, 69, 0.55);
        animation: sunriseGlow 7s var(--ease) infinite alternate;
      }
      @keyframes sunriseGlow {
        from { box-shadow: 0 0 70px 18px rgba(246, 196, 69, 0.45); }
        to { box-shadow: 0 0 110px 34px rgba(246, 196, 69, 0.65); }
      }
      .about__ring {
        position: absolute;
        top: 8%;
        inset-inline-start: 50%;
        transform: translateX(-50%);
        width: 64%;
        aspect-ratio: 1;
        border-radius: 50%;
        border: 1.5px dashed rgba(178, 110, 32, 0.3);
        animation: ringSpin 50s linear infinite;
      }
      @keyframes ringSpin {
        to { transform: translateX(-50%) rotate(360deg); }
      }
      .about__hill {
        position: absolute;
        bottom: -18%;
        width: 120%;
        aspect-ratio: 2.4 / 1;
        border-radius: 50% 50% 0 0 / 100% 100% 0 0;
      }
      .about__hill--back {
        inset-inline-start: -34%;
        background: linear-gradient(180deg, #86b183, #6ba368 70%);
        opacity: 0.85;
        bottom: -12%;
      }
      .about__hill--front {
        inset-inline-end: -38%;
        background: linear-gradient(180deg, #6ba368, #558a52 70%);
      }
      .about__leaf {
        position: absolute;
        top: 6%;
        inset-inline-end: 8%;
        width: 58px;
        z-index: 2;
        animation: leafSway 5s var(--ease) infinite alternate;
        transform-origin: top center;
      }
      @keyframes leafSway {
        from { transform: rotate(-6deg); }
        to { transform: rotate(8deg); }
      }
      .about__badge {
        position: absolute;
        inset-inline-start: 2%;
        bottom: 8%;
        background: var(--grad-warm);
        color: #fff;
        border-radius: var(--radius);
        padding: 16px 22px;
        text-align: center;
        box-shadow: var(--shadow);
        z-index: 3;
        strong { display: block; font-family: var(--font-display); font-size: 1.8rem; line-height: 1; }
        span { font-size: 0.8rem; opacity: 0.95; }
      }
      .about__chip {
        position: absolute;
        inset-inline-end: 0;
        top: 12%;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        background: var(--white);
        border: 1px solid var(--line);
        color: var(--ink);
        font-size: 0.85rem;
        font-weight: 600;
        padding: 10px 16px;
        border-radius: var(--radius-pill);
        box-shadow: var(--shadow);
        z-index: 3;
        animation: floaty 4.5s var(--ease) infinite alternate;
      }
      .about__chip-dot {
        width: 8px; height: 8px; border-radius: 50%;
        background: var(--green);
      }
      @keyframes floaty {
        from { transform: translateY(0); }
        to { transform: translateY(-12px); }
      }

      @media (max-width: 880px) {
        .about { grid-template-columns: 1fr; }
        .about__media { min-height: 360px; max-width: 520px; margin-inline: auto; width: 100%; }
      }
      @media (max-width: 460px) {
        .about__cards { grid-template-columns: 1fr; }
        .about__card:first-child { grid-column: auto; }
      }
      @media (prefers-reduced-motion: reduce) {
        .about__sunrise, .about__ring, .about__leaf, .about__chip { animation: none; }
      }
    `,
  ],
})
export class AboutComponent implements AfterViewInit {
  readonly i18n = inject(I18nService);
  readonly t = this.i18n.t;

  private readonly motion = inject(MotionService);
  private readonly host = inject(ElementRef<HTMLElement>);

  ngAfterViewInit(): void {
    const items = this.host.nativeElement.querySelectorAll('[data-reveal]') as NodeListOf<HTMLElement>;
    this.motion.revealStagger(items, { stagger: 0.1 });
  }

  private readonly icons = {
    mission:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="1"/></svg>',
    vision:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>',
    quality:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2 4 5v6c0 5 3.4 8.5 8 11 4.6-2.5 8-6 8-11V5l-8-3Z"/><path d="m9 12 2 2 4-4"/></svg>',
  };

  readonly cards = () => [
    { title: this.t().about.mission, text: this.t().about.missionText, icon: this.icons.mission },
    { title: this.t().about.vision, text: this.t().about.visionText, icon: this.icons.vision },
    { title: this.t().about.quality, text: this.t().about.qualityText, icon: this.icons.quality },
  ];
}
