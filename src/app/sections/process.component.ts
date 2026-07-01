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
import { MotionService } from '../core/motion/motion.service';
import { SectionHeadingComponent } from '../shared/components/section-heading.component';
import { RevealDirective } from '../shared/directives/reveal.directive';
import { SafeHtmlPipe } from '../shared/pipes/safe-html.pipe';

@Component({
  selector: 'app-process',
  standalone: true,
  imports: [SectionHeadingComponent, RevealDirective, SafeHtmlPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="process" class="section section--brand-tint">
      <div class="container">
        <app-section-heading
          [eyebrow]="t().process.eyebrow"
          [title]="t().process.title"
          [desc]="t().process.desc"
        />

        <div class="process__pin" #pin>
          <ol class="timeline" #track>
            <span class="timeline__track" aria-hidden="true"></span>
            @for (step of steps(); track step.title; let i = $index) {
              <li class="timeline__step" appReveal [appReveal]="i + 1">
                <span class="timeline__node">
                  <span class="timeline__num">{{ i + 1 }}</span>
                  <span class="timeline__icon" [innerHTML]="step.icon | safeHtml"></span>
                </span>
                <h3>{{ step.title }}</h3>
                <p>{{ step.desc }}</p>
              </li>
            }
          </ol>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      /* Desktop: the pin holds a tall, vertically-centred band so the timeline
         nodes sit comfortably in the viewport while scrubbing horizontally
         (instead of being clipped at the top edge). */
      .process__pin {
        overflow: hidden;
        min-height: min(64vh, 520px);
        display: flex;
        align-items: center;
        padding-block: 24px;
      }

      .timeline {
        position: relative;
        display: flex;
        flex-wrap: nowrap;
        gap: 16px;
        width: max-content;
        counter-reset: step;
      }
      .timeline__track {
        position: absolute;
        top: 36px;
        inset-inline: 36px;
        height: 3px;
        background: repeating-linear-gradient(
          90deg,
          var(--brand) 0 14px,
          transparent 14px 24px
        );
        opacity: 0.4;
      }
      .timeline__step {
        flex: 0 0 clamp(240px, 28vw, 320px);
        position: relative;
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding-inline: 8px;
        h3 { font-size: 1.05rem; margin-top: 16px; }
        p { font-size: 0.88rem; color: var(--ink-2); margin-top: 6px; }
      }
      .timeline__node {
        position: relative;
        width: 72px;
        height: 72px;
        border-radius: 50%;
        background: #fff;
        display: grid;
        place-items: center;
        box-shadow: var(--shadow);
        border: 2px solid var(--brand-soft);
        transition: transform 0.4s var(--ease), border-color 0.4s var(--ease);
        ::ng-deep svg { width: 30px; height: 30px; stroke: var(--brand-700); }
      }
      .timeline__step:hover .timeline__node {
        transform: translateY(-6px) scale(1.05);
        border-color: var(--brand);
      }
      .timeline__num {
        position: absolute;
        top: -8px;
        inset-inline-end: -6px;
        width: 26px;
        height: 26px;
        border-radius: 50%;
        background: var(--grad-warm);
        color: #fff;
        font-size: 0.8rem;
        font-weight: 800;
        display: grid;
        place-items: center;
        box-shadow: 0 6px 14px -6px rgba(224, 123, 38, 0.8);
      }
      @media (max-width: 860px) {
        .process__pin { overflow: visible; min-height: 0; display: block; padding-block: 0; }
        .timeline { display: grid; width: auto; grid-template-columns: 1fr; gap: 8px; max-width: 460px; margin-inline: auto; }
        .timeline__step { flex: none; }
        .timeline__track {
          inset-inline-start: 35px;
          inset-inline-end: auto;
          top: 40px;
          bottom: 40px;
          width: 3px;
          height: auto;
          background: repeating-linear-gradient(180deg, var(--brand) 0 14px, transparent 14px 24px);
        }
        .timeline__step {
          flex-direction: row;
          text-align: start;
          gap: 20px;
          align-items: flex-start;
          padding-block: 14px;
        }
        .timeline__node { flex: none; }
        .timeline__step h3 { margin-top: 6px; }
      }
      /* Desktop + reduced motion: pin never scrolls, so wrap the steps
         instead of clipping them behind overflow:hidden. */
      @media (prefers-reduced-motion: reduce) and (min-width: 861px) {
        .process__pin { overflow: visible; min-height: 0; display: block; padding-block: 0; }
        .timeline { flex-wrap: wrap; width: auto; justify-content: center; row-gap: 40px; }
        .timeline__track { display: none; }
      }
    `,
  ],
})
export class ProcessComponent implements AfterViewInit {
  private readonly i18n = inject(I18nService);
  private readonly motion = inject(MotionService);
  readonly t = this.i18n.t;

  private readonly pin = viewChild<ElementRef<HTMLElement>>('pin');
  private readonly track = viewChild<ElementRef<HTMLElement>>('track');

  private readonly icons = [
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21V10l9-7 9 7v11"/><path d="M9 21v-6h6v6"/></svg>',
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7h13l5 5v5H3z"/><path d="M3 12h13"/><circle cx="7" cy="9" r="1"/></svg>',
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="m21 21-4-4"/><path d="m8.5 11 2 2 3.5-3.5"/></svg>',
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="m3 8 9-5 9 5-9 5Z"/><path d="M3 8v8l9 5 9-5V8"/><path d="M12 13v8"/></svg>',
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h11v9H3zM14 9h4l3 3v3h-7z"/><circle cx="7" cy="18" r="1.6"/><circle cx="17" cy="18" r="1.6"/></svg>',
  ];

  readonly steps = computed(() =>
    this.t().process.steps.map((step, i) => ({ ...step, icon: this.icons[i] })),
  );

  ngAfterViewInit(): void {
    const pin = this.pin()?.nativeElement;
    const track = this.track()?.nativeElement;
    if (pin && track) this.motion.pinHorizontal({ pin, track, minWidth: 861 });
  }
}
