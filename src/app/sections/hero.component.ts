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
      <div class="hero__bg" aria-hidden="true">
        <span class="hero__sun"></span>
        <span class="hero__blob hero__blob--1"></span>
        <span class="hero__blob hero__blob--2"></span>
        <span class="hero__grid"></span>
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
            <a href="#products" class="btn btn--ghost">{{ t().hero.ctaProducts }}</a>
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

        <div class="hero__scene" appReveal="2">
          <div class="hero__chip hero__chip--fresh">
            <span class="hero__chip-egg">🥚</span>
            <div>
              <strong>{{ i18n.isRtl() ? 'طازج 100%' : '100% Fresh' }}</strong>
              <small>{{ i18n.isRtl() ? 'يُجمع كل صباح' : 'Collected daily' }}</small>
            </div>
          </div>
          <div class="hero__chip hero__chip--grade">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M6 13l6 6 6-6"/></svg>
            <span>{{ i18n.isRtl() ? 'مرّر لمشاهدة الكسر' : 'Scroll to watch it crack' }}</span>
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
  readonly i18n = inject(I18nService);
  readonly t = this.i18n.t;

  private readonly title = viewChild<ElementRef<HTMLElement>>('title');
  private readonly accent = viewChild<ElementRef<HTMLElement>>('accent');
  private readonly cta = viewChild<ElementRef<HTMLElement>>('cta');

  ngAfterViewInit(): void {
    const title = this.title()?.nativeElement;
    const accent = this.accent()?.nativeElement;
    const cta = this.cta()?.nativeElement;
    if (title) this.motion.splitTextIn(title, { delay: 0.15 });
    if (accent) this.motion.reveal(accent, { delay: 0.6, y: 16 });
    if (cta) this.motion.magnetic(cta, 0.3);
  }
}
