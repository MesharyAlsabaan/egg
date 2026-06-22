import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  viewChild,
} from '@angular/core';
import { I18nService } from '../core/i18n/i18n.service';
import { RevealDirective } from '../shared/directives/reveal.directive';
import { MotionService } from '../core/motion/motion.service';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [RevealDirective],
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
                <span class="about__card-icon" [innerHTML]="card.icon"></span>
                <h3>{{ card.title }}</h3>
                <p>{{ card.text }}</p>
              </article>
            }
          </div>
        </div>

        <div class="about__media" appReveal>
          <figure class="about__img about__img--main" #aboutImg>
            <img src="assets/images/farm-overview.jpg" alt="Aerial view of Family Eggs farm and facilities" loading="lazy" />
          </figure>
          <figure class="about__img about__img--sub">
            <img src="assets/images/green-fields.jpg" alt="Green irrigated fields surrounding the farm" loading="lazy" />
          </figure>
          <div class="about__badge">
            <strong>100%</strong>
            <span>{{ i18n.isRtl() ? 'بيض سعودي' : 'Saudi eggs' }}</span>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      .about {
        display: grid;
        grid-template-columns: 1.1fr 0.9fr;
        gap: clamp(32px, 5vw, 64px);
        align-items: center;
      }
      .about__media {
        position: relative;
        min-height: 460px;
      }
      .about__img {
        position: absolute;
        border-radius: var(--radius-lg);
        overflow: hidden;
        box-shadow: var(--shadow-lg);
        img { width: 100%; height: 100%; object-fit: cover; }
      }
      .about__img--main {
        inset-inline-start: 0;
        top: 0;
        width: 78%;
        height: 78%;
      }
      .about__img--sub {
        inset-inline-end: 0;
        bottom: 0;
        width: 52%;
        height: 50%;
        border: 6px solid var(--cream);
      }
      .about__badge {
        position: absolute;
        inset-inline-start: 8%;
        bottom: 6%;
        background: var(--grad-warm);
        color: #fff;
        border-radius: var(--radius);
        padding: 14px 20px;
        text-align: center;
        box-shadow: var(--shadow);
        z-index: 2;
        strong { display: block; font-size: 1.7rem; line-height: 1; }
        span { font-size: 0.8rem; opacity: 0.95; }
      }
      .about__body .lead { margin-top: 18px; }
      .about__cards {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 16px;
        margin-top: 32px;
      }
      .about__card {
        background: var(--cream);
        border: 1px solid var(--line);
        border-radius: var(--radius);
        padding: 22px;
        transition: transform 0.3s var(--ease), box-shadow 0.3s var(--ease);
        &:hover { transform: translateY(-4px); box-shadow: var(--shadow); }
        &:first-child { grid-column: 1 / -1; }
        h3 { font-size: 1.1rem; margin-bottom: 6px; }
        p { font-size: 0.92rem; color: var(--ink-2); }
      }
      .about__card-icon {
        display: grid;
        place-items: center;
        width: 44px;
        height: 44px;
        border-radius: 12px;
        background: var(--brand-soft);
        color: var(--brand-700);
        margin-bottom: 14px;
        ::ng-deep svg { width: 22px; height: 22px; }
      }
      @media (max-width: 880px) {
        .about { grid-template-columns: 1fr; }
        .about__media { min-height: 380px; max-width: 520px; margin-inline: auto; width: 100%; }
      }
      @media (max-width: 460px) {
        .about__cards { grid-template-columns: 1fr; }
        .about__card:first-child { grid-column: auto; }
      }
    `,
  ],
})
export class AboutComponent implements AfterViewInit {
  readonly i18n = inject(I18nService);
  readonly t = this.i18n.t;

  private readonly motion = inject(MotionService);
  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly aboutImg = viewChild<ElementRef<HTMLElement>>('aboutImg');

  ngAfterViewInit(): void {
    const img = this.aboutImg()?.nativeElement;
    if (img) this.motion.parallax(img, { y: 12 });
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
