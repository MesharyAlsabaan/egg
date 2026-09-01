import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  inject,
  viewChild,
} from '@angular/core';

import { I18nService } from '../core/i18n/i18n.service';
import { MotionService } from '../core/motion.service';
import { SupplyLineService } from '../core/supply-line.service';
import { InViewVideoDirective } from '../shared/in-view-video.directive';
import { MediaImageComponent } from '../shared/media-image.component';
import { RevealDirective } from '../shared/reveal.directive';

/**
 * The site's one strong motion moment, and it is tied to the production line
 * itself: the grading footage plays wide, and the orange rule beneath it
 * fills across the four stages as the visitor scrolls through the section.
 *
 * The step model carries a `no` and a `label` only. When the illustrated
 * characters are approved they slot in per step here — nothing else in this
 * component needs to change for that.
 */
@Component({
  selector: 'app-automation',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [InViewVideoDirective, MediaImageComponent, RevealDirective],
  template: `
    <section class="auto" id="automation" aria-labelledby="automation-title" #section>
      <div class="auto__inner">
        <header class="auto__head" appReveal>
          <p class="eyebrow">{{ t().automation.eyebrow }}</p>
          <h2 class="display" id="automation-title">{{ t().automation.title }}</h2>
          <p class="lede">{{ t().automation.body }}</p>
        </header>
      </div>

      <figure class="auto__figure">
        @if (motion) {
          <video
            appInViewVideo="media/automation.mp4"
            poster="media/automation-poster-1280.webp"
            [attr.aria-label]="t().automation.videoAlt"
            muted
            loop
            playsinline
            preload="none"
            width="1920"
            height="1080"
          ></video>
        } @else {
          <app-media-image
            name="automation-poster"
            [alt]="t().automation.videoAlt"
            [width]="1920"
            [height]="1080"
            sizes="100vw"
          />
        }
      </figure>

      <div class="auto__inner">
        <ol class="line">
          @for (step of t().automation.steps; track step.no) {
            <li class="line__step">
              <span class="line__no">{{ step.no }}</span>
              <span class="line__label">{{ step.label }}</span>
            </li>
          }
          <span class="line__track" aria-hidden="true"><span class="line__fill"></span></span>
        </ol>
      </div>
    </section>
  `,
  styles: `
    .auto {
      background: var(--ivory);
      color: var(--on-ivory);
      padding-block: var(--section-y);
    }

    .auto__inner {
      width: min(100% - (var(--gutter) * 2), var(--container));
      margin-inline: auto;
    }

    .auto__head {
      margin-block-end: clamp(2rem, 6vw, 3rem);
    }

    .auto__head .lede {
      margin-block-start: 1rem;
      max-width: 58ch;
    }

    /* Wide, not a small card: edge to edge on a phone, and capped on large
       screens so the 848x478 clip is never blown up past what it can carry. */
    .auto__figure {
      margin: 0 auto;
      width: 100%;
      aspect-ratio: 16 / 9;
      overflow: hidden;
      background: var(--ivory-dim);
    }

    @media (min-width: 720px) {
      .auto__figure {
        width: min(100% - (var(--gutter) * 2), 1320px);
      }
    }

    .auto__figure video,
    .auto__figure app-media-image {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    /* Phone: a vertical timeline. Four columns at this width split
       "Collection" and "Inspection" mid-word, so the row layout only starts
       once there is room for it. */
    .line {
      position: relative;
      display: grid;
      gap: 0;
      margin-block-start: clamp(2rem, 6vw, 3rem);
      padding-inline-start: 2.25rem;
    }

    .line__track {
      position: absolute;
      inset-block: 0.75rem 1.5rem;
      inset-inline-start: 4px;
      width: 2px;
      background: color-mix(in srgb, var(--orange) 22%, transparent);
      overflow: hidden;
    }

    .line__fill {
      position: absolute;
      inset-inline: 0;
      inset-block-start: 0;
      height: calc(var(--fill, 0) * 100%);
      background: var(--orange);
    }

    .line__step {
      position: relative;
      display: flex;
      flex-direction: column;
      gap: 0.15rem;
      /* Room reserved for the illustrated characters, once they are approved. */
      min-height: 68px;
      padding-block: 0.35rem;
      min-width: 0;
    }

    .line__step::before {
      content: '';
      position: absolute;
      inset-block-start: 0.75rem;
      inset-inline-start: -2.25rem;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: var(--orange);
    }

    .line__no {
      font-size: var(--step--1);
      font-weight: 700;
      letter-spacing: 0.1em;
      color: var(--olive);
      font-variant-numeric: tabular-nums;
    }

    .line__label {
      font-size: var(--step-1);
      font-weight: 600;
      line-height: 1.35;
      /* English step names are single words and must never be hyphenated. */
      word-break: normal;
      overflow-wrap: normal;
      hyphens: none;
    }

    @media (min-width: 768px) {
      .line {
        grid-template-columns: repeat(4, 1fr);
        gap: 0.75rem;
        padding-inline-start: 0;
        padding-block-start: 1.75rem;
      }

      .line__track {
        inset-block: 0 auto;
        inset-inline: 0;
        height: 2px;
        width: auto;
      }

      .line__fill {
        inset-block: 0;
        height: auto;
        width: calc(var(--fill, 0) * 100%);
      }

      .line__step {
        min-height: 0;
        padding-block: 0.25rem 0;
      }

      .line__step::before {
        inset-block-start: -1.85rem;
        inset-inline-start: 0;
        width: 9px;
        height: 9px;
      }

      .line__label {
        font-size: var(--step-2);
      }
    }
  `,
})
export class AutomationComponent implements OnInit, OnDestroy {
  protected readonly t = inject(I18nService).t;
  protected readonly motion = inject(MotionService).allowsAutoplay;

  private readonly section = viewChild.required<ElementRef<HTMLElement>>('section');
  private readonly supplyLine = inject(SupplyLineService);
  private stop?: () => void;

  ngOnInit(): void {
    this.stop = this.supplyLine.register(this.section().nativeElement);
  }

  ngOnDestroy(): void {
    this.stop?.();
  }
}
