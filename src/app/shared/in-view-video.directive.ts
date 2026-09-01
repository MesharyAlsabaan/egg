import { isPlatformBrowser } from '@angular/common';
import {
  Directive,
  ElementRef,
  NgZone,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  inject,
  input,
} from '@angular/core';

/**
 * Loads and plays a clip only while it is on screen.
 *
 * Nothing is fetched until the element approaches the viewport, and only the
 * visible clip ever plays — five looping videos are never in flight at once.
 */
@Directive({
  selector: 'video[appInViewVideo]',
})
export class InViewVideoDirective implements OnInit, OnDestroy {
  /** Source to attach once the clip is worth loading. */
  readonly appInViewVideo = input.required<string>();

  private readonly host = inject(ElementRef<HTMLVideoElement>);
  private readonly zone = inject(NgZone);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private observer?: IntersectionObserver;
  private attached = false;

  ngOnInit(): void {
    // The prerender pass has a video element without load(), and nothing to
    // observe: leaving the source unset there is exactly right, the browser
    // attaches it on hydration.
    if (!this.isBrowser) {
      return;
    }

    const video = this.host.nativeElement;

    if (typeof IntersectionObserver === 'undefined') {
      this.attach();
      return;
    }

    this.zone.runOutsideAngular(() => {
      this.observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              this.attach();
              void video.play().catch(() => {
                /* autoplay refused — the poster stays, which is fine */
              });
            } else if (this.attached) {
              video.pause();
            }
          }
        },
        { rootMargin: '200px 0px', threshold: 0.35 },
      );
      this.observer.observe(video);
    });
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  private attach(): void {
    if (this.attached) {
      return;
    }
    this.attached = true;
    const video = this.host.nativeElement;
    video.src = this.appInViewVideo();
    video.load();
  }
}
