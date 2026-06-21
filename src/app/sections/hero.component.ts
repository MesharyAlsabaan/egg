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
  selector: 'app-hero',
  standalone: true,
  imports: [RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="home" class="hero">
      <div class="hero__blobs" aria-hidden="true">
        <span class="hero__blob hero__blob--1"></span>
        <span class="hero__blob hero__blob--2"></span>
      </div>

      <div class="hero__bg">
        <img
          #bg
          src="assets/images/hero-candling.jpg"
          alt="Fresh eggs being quality-inspected under golden light on the production line"
          fetchpriority="high"
        />
        <div class="hero__scrim"></div>
      </div>

      <div class="container hero__inner">
        <div class="hero__copy">
          <span class="hero__badge" appReveal>
            <span class="dot"></span>{{ t().hero.badge }}
          </span>
          <h1 class="hero__title h-display" appReveal="1">
            <span #title class="hero__title-main">{{ t().hero.title }}</span>
            <span #accent class="text-gradient">{{ t().hero.titleAccent }}</span>
          </h1>
          <p class="hero__desc" appReveal="2">{{ t().hero.desc }}</p>

          <div class="hero__actions" appReveal="3">
            <a #cta href="#contact" class="btn">
              {{ t().hero.ctaContact }}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path class="arrow" d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </a>
            <a href="#products" class="btn btn--light">{{ t().hero.ctaProducts }}</a>
          </div>

          <dl class="hero__stats" appReveal="4">
            <div>
              <dt>{{ t().hero.stat1 }}</dt>
              <dd>{{ t().hero.stat1Label }}</dd>
            </div>
            <div>
              <dt>{{ t().hero.stat2 }}</dt>
              <dd>{{ t().hero.stat2Label }}</dd>
            </div>
            <div>
              <dt>{{ t().hero.stat3 }}</dt>
              <dd>{{ t().hero.stat3Label }}</dd>
            </div>
          </dl>
        </div>

        <div class="hero__card" appReveal="3">
          <span class="hero__card-egg">🥚</span>
          <div>
            <strong>طازج 100% من المزرعة</strong>
            <small>يُجمع ويُفرز يومياً</small>
          </div>
        </div>
      </div>

      <a href="#about" class="hero__scroll" aria-label="Scroll to content">
        <span></span>
      </a>
    </section>
  `,
  styleUrl: './hero.component.scss',
})
export class HeroComponent implements AfterViewInit {
  private readonly motion = inject(MotionService);
  readonly t = inject(I18nService).t;

  private readonly bg = viewChild<ElementRef<HTMLElement>>('bg');
  private readonly title = viewChild<ElementRef<HTMLElement>>('title');
  private readonly accent = viewChild<ElementRef<HTMLElement>>('accent');
  private readonly cta = viewChild<ElementRef<HTMLElement>>('cta');

  ngAfterViewInit(): void {
    const bg = this.bg()?.nativeElement;
    const title = this.title()?.nativeElement;
    const accent = this.accent()?.nativeElement;
    const cta = this.cta()?.nativeElement;
    if (bg) this.motion.parallax(bg, { y: 18 });
    if (title) this.motion.splitTextIn(title, { delay: 0.15 });
    if (accent) this.motion.reveal(accent, { delay: 0.6, y: 16 });
    if (cta) this.motion.magnetic(cta, 0.3);
  }
}
