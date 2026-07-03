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

  /**
   * Smooth-scroll to a target through Lenis so in-page navigation gets the
   * same easing as wheel scrolling (native `scroll-behavior` fights Lenis and
   * lands with a visible snap). Falls back to native smooth scroll when Lenis
   * is off (reduced motion / SSR).
   */
  scrollTo(target: number | HTMLElement, offset = 0): void {
    if (!this.isBrowser) return;
    if (this.lenis) {
      this.lenis.scrollTo(target, {
        offset,
        duration: 1.15,
        easing: (t: number) => 1 - Math.pow(1 - t, 3),
      });
      return;
    }
    const top =
      typeof target === 'number'
        ? target
        : target.getBoundingClientRect().top + window.scrollY + offset;
    window.scrollTo({ top, behavior: this.reduced ? 'auto' : 'smooth' });
  }

  /**
   * Sets `--mx` / `--my` (each -0.5 … 0.5, eased) on the section as the
   * pointer moves, so the stylesheet can drift decorative layers at different
   * depths via the `translate` property (which composes with the layers'
   * existing transform keyframe animations). Desktop pointers only.
   */
  pointerGlide(section: HTMLElement): void {
    if (!this.enabled || !section) return;
    if (matchMedia('(hover: none)').matches) return;
    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };
    const onMove = (e: MouseEvent): void => {
      const r = section.getBoundingClientRect();
      target.x = (e.clientX - r.left) / r.width - 0.5;
      target.y = (e.clientY - r.top) / r.height - 0.5;
    };
    const onLeave = (): void => {
      target.x = 0;
      target.y = 0;
    };
    const tick = (): void => {
      current.x += (target.x - current.x) * 0.07;
      current.y += (target.y - current.y) * 0.07;
      section.style.setProperty('--mx', current.x.toFixed(4));
      section.style.setProperty('--my', current.y.toFixed(4));
    };
    gsap.ticker.add(tick);
    section.addEventListener('mousemove', onMove);
    section.addEventListener('mouseleave', onLeave);
    this.cleanups.push(() => {
      gsap.ticker.remove(tick);
      section.removeEventListener('mousemove', onMove);
      section.removeEventListener('mouseleave', onLeave);
    });
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
    // Per-word rise + fade. No overflow:hidden mask — Arabic glyphs overshoot
    // the line box well beyond any practical padding, so a clip mask cuts off
    // ascenders/dots/descenders. A fade+translate reads just as lively.
    const spans = words.map((w, i) => {
      const span = document.createElement('span');
      span.style.display = 'inline-block';
      span.style.willChange = 'transform, opacity';
      span.textContent = w;
      el.appendChild(span);
      if (i < words.length - 1) el.appendChild(document.createTextNode(' '));
      return span;
    });
    gsap.fromTo(
      spans,
      { opacity: 0, yPercent: 60 },
      {
        opacity: 1,
        yPercent: 0,
        duration: 0.9,
        ease: 'power4.out',
        stagger: opts.stagger ?? 0.08,
        delay: opts.delay ?? 0.2,
      },
    );
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

  /**
   * Signature hero moment: scrub a muted video frame-by-frame as the visitor
   * scrolls through the hero, so real slow-motion footage (an egg cracking)
   * plays under scroll control. On touch/reduced-motion the caller keeps the
   * video on autoplay+loop instead, so it always shows something alive.
   *
   * @returns true if scrubbing was attached (caller should stop autoplay).
   */
  scrubVideo(video: HTMLVideoElement, trigger: HTMLElement): boolean {
    if (!this.enabled || matchMedia('(hover: none)').matches) return false;

    const attach = (): void => {
      const dur = video.duration;
      if (!dur || !isFinite(dur)) return;
      video.pause();
      const state = { t: 0 };
      gsap.to(state, {
        t: dur - 0.05,
        ease: 'none',
        scrollTrigger: {
          trigger,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.5,
        },
        onUpdate: () => {
          // Guard seeks so we never queue faster than the decoder can serve.
          if (video.readyState >= 2 && !video.seeking) {
            try {
              video.currentTime = state.t;
            } catch {
              /* seek not ready — skip this frame */
            }
          }
        },
      });
    };

    if (video.readyState >= 1 && video.duration) attach();
    else video.addEventListener('loadedmetadata', attach, { once: true });
    return true;
  }

  /**
   * Like {@link scrubVideo} but maps the clip across the WHOLE page: the egg is
   * intact at the top of the site and fully cracked at the footer. Used with a
   * fixed backdrop so the crack spans every section.
   *
   * @returns true if scrubbing was attached (caller should stop autoplay).
   */
  scrubVideoPage(video: HTMLVideoElement): boolean {
    if (!this.enabled) return false;

    const attach = (): void => {
      const dur = video.duration;
      if (!dur || !isFinite(dur)) return;
      video.pause();
      const state = { t: 0 };
      gsap.to(state, {
        t: dur - 0.05,
        ease: 'none',
        scrollTrigger: { start: 0, end: 'max', scrub: 0.6 },
        onUpdate: () => {
          if (video.readyState >= 2 && !video.seeking) {
            try {
              video.currentTime = state.t;
            } catch {
              /* seek not ready — skip */
            }
          }
        },
      });
    };

    if (video.readyState >= 1 && video.duration) attach();
    else video.addEventListener('loadedmetadata', attach, { once: true });
    return true;
  }
}
