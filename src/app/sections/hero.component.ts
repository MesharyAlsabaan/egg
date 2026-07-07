import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  inject,
  viewChild,
} from '@angular/core';
import { I18nService } from '../core/i18n/i18n.service';
import { RevealDirective } from '../shared/directives/reveal.directive';
import { MotionService } from '../core/motion/motion.service';
import { SafeHtmlPipe } from '../shared/pipes/safe-html.pipe';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [RevealDirective, SafeHtmlPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section #section id="home" class="hero">
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
          <span class="hero__orb" aria-hidden="true"></span>
          <span class="hero__halo" aria-hidden="true"></span>

          <div class="hero__panel">
            <div class="hero__panel-head">
              <span class="hero__panel-dot"></span>
              <span>{{ i18n.isRtl() ? 'جودة موثوقة' : 'Trusted quality' }}</span>
            </div>
            @for (row of highlights(); track row.title) {
              <div class="hero__row">
                <span class="hero__row-icon" [innerHTML]="row.icon | safeHtml"></span>
                <div>
                  <strong>{{ row.title }}</strong>
                  <small>{{ row.sub }}</small>
                </div>
              </div>
            }
          </div>

          <div class="hero__chip hero__chip--fresh">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v3M4.2 10.2 6 12M2 18h20M18 12l1.8-1.8M5 18a7 7 0 0 1 14 0"/></svg>
            <span>{{ i18n.isRtl() ? 'طازج كل صباح' : 'Fresh every morning' }}</span>
          </div>
          <div class="hero__chip hero__chip--grade">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2 4 5v6c0 5 3.4 8.5 8 11 4.6-2.5 8-6 8-11V5l-8-3Z"/><path d="m9 12 2 2 4-4"/></svg>
            <span>{{ i18n.isRtl() ? 'جودة درجة أ' : 'Grade A quality' }}</span>
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
  private readonly section = viewChild<ElementRef<HTMLElement>>('section');

  private readonly icons = {
    sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v3M4.2 10.2 6 12M2 18h20M18 12l1.8-1.8M5 18a7 7 0 0 1 14 0"/></svg>',
    shield:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2 4 5v6c0 5 3.4 8.5 8 11 4.6-2.5 8-6 8-11V5l-8-3Z"/><path d="m9 12 2 2 4-4"/></svg>',
    truck:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h11v9H3zM14 9h4l3 3v3h-7z"/><circle cx="7" cy="18" r="1.6"/><circle cx="17" cy="18" r="1.6"/></svg>',
  };

  /** Bilingual quality highlights for the glass panel (matches chip pattern). */
  readonly highlights = computed(() =>
    this.i18n.isRtl()
      ? [
          { icon: this.icons.sun, title: 'طازج 100%', sub: 'يُجمع كل صباح' },
          { icon: this.icons.shield, title: 'جودة درجة أ', sub: 'فرز وفحص يومي' },
          { icon: this.icons.truck, title: 'توصيل يومي', sub: 'من المزرعة إلى بابك' },
        ]
      : [
          { icon: this.icons.sun, title: '100% Fresh', sub: 'Collected every morning' },
          { icon: this.icons.shield, title: 'Grade A quality', sub: 'Graded & inspected daily' },
          { icon: this.icons.truck, title: 'Daily delivery', sub: 'Farm to your door' },
        ],
  );

  ngAfterViewInit(): void {
    const title = this.title()?.nativeElement;
    const accent = this.accent()?.nativeElement;
    const cta = this.cta()?.nativeElement;
    const section = this.section()?.nativeElement;
    if (title) this.motion.splitTextIn(title, { delay: 0.15 });
    if (accent) this.motion.reveal(accent, { delay: 0.6, y: 16 });
    if (cta) this.motion.magnetic(cta, 0.3);
    if (section) this.motion.pointerGlide(section);
  }
}
