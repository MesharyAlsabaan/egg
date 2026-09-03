import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  effect,
  inject,
  signal,
  viewChild,
} from '@angular/core';

import { I18nService } from '../core/i18n/i18n.service';
import { MotionService } from '../core/motion.service';

/**
 * No buttons here on purpose. The header carries the single call to action;
 * the hero's job is the farm, the headline and who this site is for.
 */
@Component({
  selector: 'app-hero',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="hero" id="hero">
      <div class="hero__media">
        <!-- Two posters, not one stretched across both. The portrait one is
             a real 9:16 frame from the mobile cut, so nothing is letterboxed
             or blown up. Whichever <source> matches is the LCP element. -->
        <picture class="hero__layer hero__still">
          <source
            media="(max-width: 767px)"
            type="image/avif"
            srcset="media/hero-poster-mobile-720.avif 720w, media/hero-poster-mobile-1080.avif 1080w"
            sizes="100vw"
          />
          <source
            media="(max-width: 767px)"
            type="image/webp"
            srcset="media/hero-poster-mobile-720.webp 720w, media/hero-poster-mobile-1080.webp 1080w"
            sizes="100vw"
          />
          <source
            type="image/avif"
            srcset="
              media/hero-poster-desktop-1280.avif 1280w,
              media/hero-poster-desktop-1600.avif 1600w,
              media/hero-poster-desktop-1920.avif 1920w
            "
            sizes="100vw"
          />
          <source
            type="image/webp"
            srcset="
              media/hero-poster-desktop-1280.webp 1280w,
              media/hero-poster-desktop-1600.webp 1600w,
              media/hero-poster-desktop-1920.webp 1920w
            "
            sizes="100vw"
          />
          <img
            src="media/hero-poster-desktop-1600.jpg"
            [alt]="t().hero.posterAlt"
            width="1920"
            height="1080"
            fetchpriority="high"
            decoding="async"
          />
        </picture>

        <!-- Two independent edits, one per aspect ratio. H.264 only: VP9 was
             measured on this footage and came out larger, so a WebM source
             would have cost a 404 and bought nothing. -->
        <video
          #video
          class="hero__layer hero__video"
          [class.is-ready]="ready() && playing()"
          [attr.autoplay]="autoplay ? '' : null"
          muted
          loop
          playsinline
          [attr.preload]="autoplay ? 'metadata' : 'none'"
          aria-hidden="true"
          tabindex="-1"
          (canplay)="ready.set(true)"
          (play)="playing.set(true)"
          (pause)="playing.set(false)"
        >
          <source src="media/hero-mobile.mp4" type="video/mp4" media="(max-width: 767px)" />
          <source src="media/hero-desktop.mp4" type="video/mp4" />
        </video>
        <div class="hero__scrim"></div>
      </div>

      <div class="hero__body">
        <h1 class="hero__title">{{ t().hero.title }}</h1>
        <p class="hero__lede">{{ t().hero.lede }}</p>
      </div>

      <button
        type="button"
        class="hero__toggle"
        [attr.aria-label]="playing() ? t().hero.pauseLabel : t().hero.playLabel"
        (click)="toggle()"
      >
        @if (playing()) {
          <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
            <rect x="6" y="5" width="4" height="14" rx="1" />
            <rect x="14" y="5" width="4" height="14" rx="1" />
          </svg>
        } @else {
          <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
            <path d="M8 5.5v13l11-6.5z" />
          </svg>
        }
      </button>
    </section>
  `,
  styles: `
    .hero {
      position: relative;
      min-height: 100svh;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      padding-block: calc(var(--header-h) + 3rem) clamp(2.5rem, 9vh, 5rem);
      padding-inline: var(--gutter);
      background: var(--ink);
      color: var(--on-ink);
      --accent: var(--orange);
      --muted: var(--on-ink-dim);
      overflow: hidden;
    }

    .hero__media {
      position: absolute;
      inset: 0;
      z-index: 0;
    }

    .hero__layer {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      /* Both cuts are framed for their own aspect, so no offset is needed. */
      object-position: 50% 50%;
    }

    .hero__still img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .hero__video {
      opacity: 0;
      transition: opacity 700ms var(--ease);
    }

    .hero__video.is-ready {
      opacity: 1;
    }

    /* Weighted to the text block, so the sky still reads as sky. */
    .hero__scrim {
      position: absolute;
      inset: 0;
      background:
        linear-gradient(
          to top,
          rgb(26 39 22 / 0.94) 0%,
          rgb(26 39 22 / 0.86) 20%,
          rgb(26 39 22 / 0.52) 40%,
          rgb(26 39 22 / 0.14) 60%,
          rgb(26 39 22 / 0) 80%
        ),
        linear-gradient(to bottom, rgb(26 39 22 / 0.25) 0%, rgb(26 39 22 / 0) 12%);
    }

    .hero__body {
      position: relative;
      z-index: 1;
      width: min(100%, var(--container));
      margin-inline: auto;
    }

    .hero__title {
      /* 38px to 58px on phones, as specified, then larger from tablet up. */
      font-size: clamp(2.375rem, 9vw, 3.625rem);
      font-weight: 700;
      line-height: var(--lh-hero);
      letter-spacing: var(--track-display);
      color: var(--ivory);
      max-width: 16ch;
      margin-block-end: 1.1rem;
    }

    .hero__lede {
      font-size: var(--step-1);
      line-height: 1.7;
      color: var(--on-ink-dim);
      max-width: 44ch;
    }

    .hero__toggle {
      position: absolute;
      z-index: 2;
      inset-block-start: calc(var(--header-h) + 1rem);
      inset-inline-end: var(--gutter);
      width: var(--tap);
      height: var(--tap);
      display: grid;
      place-items: center;
      border: 1px solid rgb(248 249 246 / 0.4);
      border-radius: 50%;
      background: rgb(26 39 22 / 0.5);
      color: var(--ivory);
      cursor: pointer;
      backdrop-filter: blur(4px);
    }

    .hero__toggle svg {
      width: 18px;
      height: 18px;
    }

    @media (min-width: 900px) {
      .hero__title {
        font-size: clamp(3.5rem, 5.5vw, 5rem);
      }
    }
  `,
})
export class HeroComponent {
  protected readonly t = inject(I18nService).t;
  protected readonly autoplay = inject(MotionService).allowsAutoplay;

  protected readonly ready = signal(false);
  protected readonly playing = signal(this.autoplay);

  private readonly video = viewChild<ElementRef<HTMLVideoElement>>('video');

  constructor() {
    effect(() => {
      const element = this.video()?.nativeElement;
      if (element) {
        element.muted = true;
        element.defaultMuted = true;
      }
    });
  }

  protected toggle(): void {
    const element = this.video()?.nativeElement;
    if (!element) {
      return;
    }
    if (element.paused) {
      // Under reduced motion nothing was preloaded, so ask for it now.
      if (element.preload === 'none') {
        element.preload = 'auto';
        element.load();
      }
      void element.play().catch(() => this.playing.set(false));
    } else {
      element.pause();
    }
  }
}
