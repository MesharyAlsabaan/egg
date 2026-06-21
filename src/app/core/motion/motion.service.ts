import { Injectable } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

export type RevealOpts = {
  y?: number;
  delay?: number;
  duration?: number;
  start?: string;
};

@Injectable({ providedIn: 'root' })
export class MotionService {
  private lenis?: Lenis;
  private rafId = 0;
  private started = false;
  private readonly cleanups: Array<() => void> = [];
  private mm?: ReturnType<typeof gsap.matchMedia>;

  private get isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof document !== 'undefined';
  }

  private get reduced(): boolean {
    return (
      this.isBrowser &&
      typeof matchMedia !== 'undefined' &&
      matchMedia('(prefers-reduced-motion: reduce)').matches
    );
  }

  get enabled(): boolean {
    return this.isBrowser && !this.reduced;
  }

  get dirSign(): 1 | -1 {
    return this.isBrowser && document.documentElement.dir === 'rtl' ? -1 : 1;
  }

  init(): void {
    if (!this.enabled || this.started) return;
    this.started = true;

    gsap.registerPlugin(ScrollTrigger);

    this.lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    this.lenis.on('scroll', () => ScrollTrigger.update());

    const raf = (time: number): void => {
      this.lenis?.raf(time);
      this.rafId = requestAnimationFrame(raf);
    };
    this.rafId = requestAnimationFrame(raf);

    // Triggers (including the Process pin) are created in section components'
    // ngAfterViewInit, which runs after this (the page calls init() in
    // ngOnInit). Recalculate their positions once layout/images settle so the
    // pin measures correctly instead of sticking at progress=1.
    const refresh = (): void => ScrollTrigger.refresh();
    if (document.readyState === 'complete') {
      requestAnimationFrame(refresh);
    } else {
      window.addEventListener('load', refresh, { once: true });
    }
  }

  destroy(): void {
    cancelAnimationFrame(this.rafId);
    this.rafId = 0;
    this.cleanups.forEach((fn) => fn());
    this.cleanups.length = 0;
    this.mm?.revert();
    this.mm = undefined;
    ScrollTrigger.getAll().forEach((t) => t.kill());
    this.lenis?.destroy();
    this.lenis = undefined;
    this.started = false;
  }

  reveal(el: HTMLElement, opts: RevealOpts = {}): void {
    if (!this.enabled || !el) return;
    // fromTo with an explicit visible end state: using from() would read the
    // element's *current* opacity as the end value, which is 0 when a `.reveal`
    // (appReveal) baseline is present — animating 0→0 and leaving it invisible.
    gsap.fromTo(
      el,
      { opacity: 0, y: opts.y ?? 28 },
      {
        opacity: 1,
        y: 0,
        duration: opts.duration ?? 0.8,
        delay: opts.delay ?? 0,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: opts.start ?? 'top 85%' },
      },
    );
  }

  revealStagger(
    els: ArrayLike<HTMLElement>,
    opts: RevealOpts & { stagger?: number } = {},
  ): void {
    if (!this.enabled || !els.length) return;
    // fromTo (explicit end state) so a `.reveal`/appReveal opacity:0 baseline
    // cannot poison the captured end value and leave elements invisible.
    gsap.fromTo(
      Array.from(els),
      { opacity: 0, y: opts.y ?? 28 },
      {
        opacity: 1,
        y: 0,
        duration: opts.duration ?? 0.7,
        ease: 'power3.out',
        stagger: opts.stagger ?? 0.12,
        scrollTrigger: { trigger: els[0], start: opts.start ?? 'top 85%' },
      },
    );
  }

  parallax(el: HTMLElement, opts: { y?: number; x?: number } = {}): void {
    if (!this.enabled || !el) return;
    gsap.to(el, {
      yPercent: opts.y ?? 0,
      xPercent: (opts.x ?? 0) * this.dirSign,
      ease: 'none',
      scrollTrigger: {
        trigger: el,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });
  }

  magnetic(el: HTMLElement, strength = 0.35): void {
    if (!this.enabled || !el) return;
    if (matchMedia('(hover: none)').matches) return; // touch → skip
    const onMove = (e: MouseEvent): void => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - (r.left + r.width / 2)) * strength;
      const y = (e.clientY - (r.top + r.height / 2)) * strength;
      gsap.to(el, { x, y, duration: 0.4, ease: 'power3.out' });
    };
    const onLeave = (): void => {
      gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' });
    };
    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    this.cleanups.push(() => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
    });
  }

  splitTextIn(
    el: HTMLElement,
    opts: { stagger?: number; delay?: number } = {},
  ): void {
    if (!this.enabled || !el) return;
    const words = (el.textContent ?? '').trim().split(/\s+/);
    el.textContent = '';
    const spans = words.map((w) => {
      const outer = document.createElement('span');
      outer.style.display = 'inline-block';
      outer.style.overflow = 'hidden';
      outer.style.verticalAlign = 'top';
      const inner = document.createElement('span');
      inner.style.display = 'inline-block';
      inner.textContent = w;
      outer.appendChild(inner);
      el.appendChild(outer);
      el.appendChild(document.createTextNode(' '));
      return inner;
    });
    gsap.from(spans, {
      yPercent: 110,
      duration: 0.9,
      ease: 'power4.out',
      stagger: opts.stagger ?? 0.08,
      delay: opts.delay ?? 0.2,
    });
  }

  pinHorizontal(opts: {
    pin: HTMLElement;
    track: HTMLElement;
    minWidth?: number;
  }): void {
    if (!this.enabled || !opts.pin || !opts.track) return;
    const minWidth = opts.minWidth ?? 861;
    this.mm = this.mm ?? gsap.matchMedia();
    this.mm.add(`(min-width: ${minWidth}px)`, () => {
      const distance = opts.track.scrollWidth - opts.pin.clientWidth;
      if (distance <= 0) return;
      const tween = gsap.to(opts.track, {
        x: () => -distance * this.dirSign,
        ease: 'none',
        scrollTrigger: {
          trigger: opts.pin,
          start: 'top top',
          end: () => `+=${distance}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });
      return () => tween.kill();
    });
  }

  onScrollProgress(cb: (progress: number) => void): void {
    if (!this.enabled) return;
    ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => cb(self.progress),
    });
  }
}
