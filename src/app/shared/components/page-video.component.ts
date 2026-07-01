import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  viewChild,
} from '@angular/core';
import { MotionService } from '../../core/motion/motion.service';

/**
 * Fixed, full-viewport cinematic backdrop: real slow-motion egg-crack footage
 * that scrubs across the ENTIRE page — intact at the top of the site, fully
 * cracked at the footer. A warm cream scrim keeps every section readable while
 * the crack progresses behind the content. On touch / reduced-motion it falls
 * back to a gentle autoplay loop.
 */
@Component({
  selector: 'app-page-video',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="pv" aria-hidden="true">
      <video
        #vid
        class="pv__video"
        src="hero-egg-crack.mp4"
        muted
        loop
        autoplay
        playsinline
        preload="auto"
      ></video>
      <span class="pv__scrim"></span>
    </div>
  `,
  styles: [
    `
      .pv {
        position: fixed;
        inset: 0;
        z-index: -1;
        background: var(--cream);
        overflow: hidden;
      }
      .pv__video {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        opacity: 0;
        transform: scale(1.04);
        filter: saturate(0.92) contrast(1.02);
        transition: opacity 1.2s var(--ease);
      }
      .pv__video.is-ready { opacity: 0.6; }
      /* Warm cream veil so text over any section stays legible. */
      .pv__scrim {
        position: absolute;
        inset: 0;
        background:
          radial-gradient(120% 90% at 50% 0%, rgba(255, 251, 243, 0.55), transparent 60%),
          linear-gradient(180deg, rgba(251, 248, 242, 0.82) 0%, rgba(251, 248, 242, 0.86) 100%);
      }
    `,
  ],
})
export class PageVideoComponent implements AfterViewInit {
  private readonly motion = inject(MotionService);
  private readonly vid = viewChild<ElementRef<HTMLVideoElement>>('vid');

  ngAfterViewInit(): void {
    const video = this.vid()?.nativeElement;
    if (!video) return;

    const reveal = (): void => video.classList.add('is-ready');
    if (video.readyState >= 2) reveal();
    else video.addEventListener('loadeddata', reveal, { once: true });

    // Desktop → scrub across the whole page. Touch/reduced → keep looping.
    const scrubbing = this.motion.scrubVideoPage(video);
    if (scrubbing) {
      video.removeAttribute('autoplay');
      video.removeAttribute('loop');
    }
  }
}
