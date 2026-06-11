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
 * Animates a numeric counter from 0 → [appCountUp] the first time the host
 * enters the viewport. Respects prefers-reduced-motion by snapping instantly.
 */
@Directive({
  selector: '[appCountUp]',
  standalone: true,
})
export class CountUpDirective implements OnInit, OnDestroy {
  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly renderer = inject(Renderer2);
  private observer?: IntersectionObserver;
  private frame = 0;

  readonly appCountUp = input.required<number>();
  readonly suffix = input<string>('');
  readonly duration = input<number>(1800);

  ngOnInit(): void {
    const host = this.el.nativeElement;
    this.render(0);

    const reduced =
      typeof matchMedia !== 'undefined' &&
      matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (typeof IntersectionObserver === 'undefined' || reduced) {
      this.render(this.appCountUp());
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            this.animate();
            this.observer?.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.4 },
    );
    this.observer.observe(host);
  }

  private animate(): void {
    const target = this.appCountUp();
    const dur = this.duration();
    let start: number | null = null;

    const step = (ts: number): void => {
      if (start === null) start = ts;
      const progress = Math.min((ts - start) / dur, 1);
      // easeOutCubic for a lively, decelerating count
      const eased = 1 - Math.pow(1 - progress, 3);
      this.render(target * eased);
      if (progress < 1) {
        this.frame = requestAnimationFrame(step);
      } else {
        this.render(target);
      }
    };
    this.frame = requestAnimationFrame(step);
  }

  private render(value: number): void {
    const target = this.appCountUp();
    // Show decimals only when the target itself is fractional.
    const display = Number.isInteger(target)
      ? Math.round(value).toString()
      : value.toFixed(1);
    this.renderer.setProperty(
      this.el.nativeElement,
      'textContent',
      `${display}${this.suffix()}`,
    );
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.frame);
    this.observer?.disconnect();
  }
}
