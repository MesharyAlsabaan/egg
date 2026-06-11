import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { I18nService } from '../core/i18n/i18n.service';
import { SectionHeadingComponent } from '../shared/components/section-heading.component';
import { RevealDirective } from '../shared/directives/reveal.directive';

@Component({
  selector: 'app-process',
  standalone: true,
  imports: [SectionHeadingComponent, RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="process" class="section section--brand-tint">
      <div class="container">
        <app-section-heading
          [eyebrow]="t().process.eyebrow"
          [title]="t().process.title"
          [desc]="t().process.desc"
        />

        <ol class="timeline">
          <span class="timeline__track" aria-hidden="true"></span>
          @for (step of steps(); track step.title; let i = $index) {
            <li class="timeline__step" appReveal [appReveal]="i + 1">
              <span class="timeline__node">
                <span class="timeline__num">{{ i + 1 }}</span>
                <span class="timeline__icon" [innerHTML]="step.icon"></span>
              </span>
              <h3>{{ step.title }}</h3>
              <p>{{ step.desc }}</p>
            </li>
          }
        </ol>
      </div>
    </section>
  `,
  styles: [
    `
      .timeline {
        position: relative;
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        gap: 16px;
        counter-reset: step;
      }
      .timeline__track {
        position: absolute;
        top: 36px;
        inset-inline: 10%;
        height: 3px;
        background: repeating-linear-gradient(
          90deg,
          var(--brand) 0 14px,
          transparent 14px 24px
        );
        opacity: 0.4;
      }
      .timeline__step {
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
        .timeline { grid-template-columns: 1fr; gap: 8px; max-width: 460px; margin-inline: auto; }
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
    `,
  ],
})
export class ProcessComponent {
  private readonly i18n = inject(I18nService);
  readonly t = this.i18n.t;

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
}
