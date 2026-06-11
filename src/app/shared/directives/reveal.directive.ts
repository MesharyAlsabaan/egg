import {
  Directive,
  ElementRef,
  inject,
  input,
  OnInit,
  OnDestroy,
  Renderer2,
} from '@angular/core';

/**
 * Adds `.is-visible` when the host scrolls into view, driving the global
 * `.reveal` CSS transition. Falls back to visible immediately when
 * IntersectionObserver is unavailable (SSR / old browsers).
 */
@Directive({
  selector: '[appReveal]',
  standalone: true,
})
export class RevealDirective implements OnInit, OnDestroy {
  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly renderer = inject(Renderer2);
  private observer?: IntersectionObserver;

  /** Optional stagger index → maps to [data-delay] in the stylesheet. */
  readonly appReveal = input<number | string>('');

  ngOnInit(): void {
    const host = this.el.nativeElement;
    this.renderer.addClass(host, 'reveal');
    const delay = this.appReveal();
    if (delay !== '' && delay != null) {
      this.renderer.setAttribute(host, 'data-delay', String(delay));
    }

    if (typeof IntersectionObserver === 'undefined') {
      this.renderer.addClass(host, 'is-visible');
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            this.renderer.addClass(host, 'is-visible');
            this.observer?.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' },
    );
    this.observer.observe(host);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
