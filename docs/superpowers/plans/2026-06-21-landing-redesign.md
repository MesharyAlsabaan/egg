# Landing Page Premium Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the Family Eggs landing page into a premium light & airy experience with GSAP + Lenis scroll animations that wow visitors, fully responsive and accessible.

**Architecture:** A single root `MotionService` owns Lenis smooth-scroll + GSAP ScrollTrigger and exposes declarative helpers (`reveal`, `parallax`, `magnetic`, `pinHorizontal`, `splitTextIn`, `onScrollProgress`). Sections call these helpers from their `ngAfterViewInit` via `@ViewChild` refs. Everything is gated behind `prefers-reduced-motion` (falls back to the existing IntersectionObserver `RevealDirective`) and is RTL-aware.

**Tech Stack:** Angular 20 (standalone, signals, OnPush), SCSS, GSAP + ScrollTrigger, Lenis. Node 20.

## Global Constraints

- Angular `^20.0.0`, standalone components, `ChangeDetectionStrategy.OnPush`, signals. (verbatim from existing codebase)
- **Brand palette unchanged:** `--brand #e07b26`, `--yolk #f4b400`, `--green #4caf50`, warm neutrals. Use existing CSS custom properties only — no new colors.
- **Copy & i18n unchanged:** all strings come from `src/app/core/i18n/translations.ts` via `I18nService.t`. Do not hardcode user-visible copy. Default language is Arabic/RTL.
- **Accessibility preserved:** keep ARIA labels, `:focus-visible` rings, skip link, semantic HTML. All motion must honor `prefers-reduced-motion: reduce` (no Lenis, no GSAP, static content visible).
- **RTL-aware:** horizontal motion direction must flip when `document.documentElement.dir === 'rtl'`.
- **No test runner exists** in this repo. Verification = `npm run build` succeeds (production budgets) + browser checks via the Playwright MCP tools (screenshots, reduced-motion emulation, RTL, responsive widths).
- Frontend-only; contact form stays UI-only.
- New deps loaded only on the lazy landing route; keep them out of the critical boot path.

---

### Task 1: Add GSAP + Lenis dependencies

**Files:**
- Modify: `package.json` (dependencies)
- Modify: `package-lock.json` (via npm)

**Interfaces:**
- Produces: importable modules `gsap`, `gsap/ScrollTrigger`, `lenis` for all later tasks.

- [ ] **Step 1: Install the packages**

Run:
```bash
npm install gsap@^3.12.5 lenis@^1.1.13
```

- [ ] **Step 2: Verify they resolve and the build still passes**

Run:
```bash
npm run build
```
Expected: build completes, `dist/family-eggs-landing` produced, no module-resolution errors. If a CommonJS/optimization budget warning appears for gsap, note it — it is non-fatal; only an *error* fails this step.

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "build: add gsap and lenis for premium scroll animations"
```

---

### Task 2: Create the MotionService (animation engine)

**Files:**
- Create: `src/app/core/motion/motion.service.ts`

**Interfaces:**
- Produces (public API later tasks consume):
  - `init(): void` — registers ScrollTrigger, starts Lenis + RAF loop. No-op if reduced-motion or already started or non-browser.
  - `destroy(): void` — kills all triggers, stops Lenis, cancels RAF, runs cleanups.
  - `get enabled(): boolean` — `true` when motion is active (not reduced, in browser).
  - `get dirSign(): 1 | -1` — `-1` when RTL, else `1`. For flipping x-translations.
  - `reveal(el: HTMLElement, opts?: RevealOpts): void` — fade + rise in on scroll.
  - `revealStagger(els: ArrayLike<HTMLElement>, opts?: RevealOpts & { stagger?: number }): void`.
  - `parallax(el: HTMLElement, opts?: { y?: number; x?: number }): void` — scrub parallax; x auto-flips for RTL.
  - `magnetic(el: HTMLElement, strength?: number): void` — pointer-follow; disabled on touch.
  - `splitTextIn(el: HTMLElement, opts?: { stagger?: number; delay?: number }): void` — word-by-word entrance on load.
  - `pinHorizontal(opts: { pin: HTMLElement; track: HTMLElement; minWidth?: number }): void` — pin + horizontal scrub on desktop only.
  - `onScrollProgress(cb: (progress: number) => void): void` — 0→1 page scroll progress callback.
  - Exported type `RevealOpts = { y?: number; delay?: number; duration?: number; start?: string }`.

- [ ] **Step 1: Write the MotionService**

Create `src/app/core/motion/motion.service.ts`:

```ts
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
  }

  destroy(): void {
    cancelAnimationFrame(this.rafId);
    this.cleanups.forEach((fn) => fn());
    this.cleanups.length = 0;
    ScrollTrigger.getAll().forEach((t) => t.kill());
    this.lenis?.destroy();
    this.lenis = undefined;
    this.started = false;
  }

  reveal(el: HTMLElement, opts: RevealOpts = {}): void {
    if (!this.enabled || !el) return;
    gsap.from(el, {
      opacity: 0,
      y: opts.y ?? 28,
      duration: opts.duration ?? 0.8,
      delay: opts.delay ?? 0,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: opts.start ?? 'top 85%' },
    });
  }

  revealStagger(
    els: ArrayLike<HTMLElement>,
    opts: RevealOpts & { stagger?: number } = {},
  ): void {
    if (!this.enabled || !els.length) return;
    gsap.from(Array.from(els), {
      opacity: 0,
      y: opts.y ?? 28,
      duration: opts.duration ?? 0.7,
      ease: 'power3.out',
      stagger: opts.stagger ?? 0.12,
      scrollTrigger: { trigger: els[0], start: opts.start ?? 'top 85%' },
    });
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
    ScrollTrigger.matchMedia({
      [`(min-width: ${minWidth}px)`]: () => {
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
      },
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
```

- [ ] **Step 2: Verify it compiles**

Run:
```bash
npm run build
```
Expected: build succeeds; no TypeScript errors from `motion.service.ts`.

- [ ] **Step 3: Commit**

```bash
git add src/app/core/motion/motion.service.ts
git commit -m "feat: add MotionService (Lenis + GSAP engine, reduced-motion + RTL aware)"
```

---

### Task 3: Wire MotionService into LandingComponent + scroll-progress ring

**Files:**
- Modify: `src/app/landing/landing.component.ts`

**Interfaces:**
- Consumes: `MotionService.init()`, `MotionService.destroy()`, `MotionService.onScrollProgress(cb)`.
- Produces: motion lifecycle is started for the whole page; back-to-top button shows a scroll-progress ring driven by `--progress` CSS var.

- [ ] **Step 1: Inject MotionService and manage lifecycle**

In `src/app/landing/landing.component.ts`, update the imports and class. Add `AfterViewInit`, `OnDestroy`, `ElementRef`, `inject`, and the service:

```ts
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  inject,
  signal,
} from '@angular/core';
import { MotionService } from '../core/motion/motion.service';
```

Replace the class body with:

```ts
export class LandingComponent implements AfterViewInit, OnDestroy {
  private readonly motion = inject(MotionService);
  private readonly host = inject(ElementRef<HTMLElement>);
  readonly showTop = signal(false);
  readonly progress = signal(0);

  ngAfterViewInit(): void {
    this.motion.init();
    this.motion.onScrollProgress((p) => this.progress.set(p));
  }

  ngOnDestroy(): void {
    this.motion.destroy();
  }

  @HostListener('window:scroll')
  onScroll(): void {
    this.showTop.set(window.scrollY > 600);
  }

  scrollTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
```

- [ ] **Step 2: Bind progress to the back-to-top button and add the ring**

In the template, change the `<button class="to-top" ...>` opening tag to bind the progress as a CSS var, and add a conic-gradient ring element. Replace the button block with:

```html
<button
  class="to-top"
  [class.show]="showTop()"
  [style.--progress]="progress()"
  (click)="scrollTop()"
  aria-label="Back to top"
>
  <span class="to-top__ring" aria-hidden="true"></span>
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m6 14 6-6 6 6"/></svg>
</button>
```

In the component `styles`, add the ring styles inside the existing `.to-top` block (append these rules to the styles string):

```css
.to-top { position: relative; isolation: isolate; }
.to-top__ring {
  position: absolute;
  inset: -4px;
  border-radius: 50%;
  background: conic-gradient(
    var(--yolk) calc(var(--progress, 0) * 360deg),
    rgba(255, 255, 255, 0.35) 0deg
  );
  -webkit-mask: radial-gradient(farthest-side, transparent calc(100% - 4px), #000 calc(100% - 4px));
          mask: radial-gradient(farthest-side, transparent calc(100% - 4px), #000 calc(100% - 4px));
  z-index: -1;
}
```

- [ ] **Step 3: Verify build**

Run:
```bash
npm run build
```
Expected: build succeeds.

- [ ] **Step 4: Browser verification (smooth scroll + ring)**

Using Playwright MCP: navigate to the dev server (`npm start`, http://localhost:4200), scroll the page, confirm (a) scrolling feels smooth (Lenis active), (b) the back-to-top button appears after scrolling and its ring fills as you scroll down. Take a screenshot near the page bottom.

- [ ] **Step 5: Commit**

```bash
git add src/app/landing/landing.component.ts
git commit -m "feat: wire MotionService lifecycle + scroll-progress ring on back-to-top"
```

---

### Task 4: Hero — parallax, gradient blobs, magnetic CTA, split-title entrance

**Files:**
- Modify: `src/app/sections/hero.component.ts`
- Modify: `src/app/sections/hero.component.scss`

**Interfaces:**
- Consumes: `MotionService.parallax`, `MotionService.magnetic`, `MotionService.splitTextIn`.
- Produces: animated hero; no exported API.

- [ ] **Step 1: Add view refs and motion wiring to the component**

In `src/app/sections/hero.component.ts`, update imports/class to add `AfterViewInit`, `viewChild`, `ElementRef`, and the service:

```ts
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  viewChild,
} from '@angular/core';
import { I18nService } from '../core/i18n/i18n.service';
import { RevealDirective } from '../shared/directives/reveal.directive';
import { MotionService } from '../core/motion/motion.service';
```

Add template refs: on the `<img>` add `#bg`, on the `.hero__title` add `#title`, on the first CTA `<a class="btn">` add `#cta`. Add a decorative blobs container as the first child of `.hero` (before `.hero__bg`):

```html
<div class="hero__blobs" aria-hidden="true">
  <span class="hero__blob hero__blob--1"></span>
  <span class="hero__blob hero__blob--2"></span>
</div>
```

Update the class body:

```ts
export class HeroComponent implements AfterViewInit {
  private readonly motion = inject(MotionService);
  readonly t = inject(I18nService).t;

  private readonly bg = viewChild<ElementRef<HTMLElement>>('bg');
  private readonly title = viewChild<ElementRef<HTMLElement>>('title');
  private readonly cta = viewChild<ElementRef<HTMLElement>>('cta');

  ngAfterViewInit(): void {
    const bg = this.bg()?.nativeElement;
    const title = this.title()?.nativeElement;
    const cta = this.cta()?.nativeElement;
    if (bg) this.motion.parallax(bg, { y: 18 });
    if (title) this.motion.splitTextIn(title, { delay: 0.15 });
    if (cta) this.motion.magnetic(cta, 0.3);
  }
}
```

Note: `splitTextIn` flattens to text, so on `.hero__title` keep only the main title text in `#title`; move the gradient accent line to a sibling element animated separately if needed. To keep it simple, apply `#title` to the existing `<h1>` — the accent `<span>`'s text will be included in the word split and still render (it loses the gradient styling). To preserve the gradient accent, instead put `#title` on a wrapping element and apply `splitTextIn` only to a child plain-text `<span class="hero__title-main">`; leave `.text-gradient` untouched and reveal it via `motion.reveal`. Use this structure:

```html
<h1 class="hero__title h-display" appReveal="1">
  <span #title class="hero__title-main">{{ t().hero.title }}</span>
  <span #accent class="text-gradient">{{ t().hero.titleAccent }}</span>
</h1>
```

And add `#accent` handling:

```ts
private readonly accent = viewChild<ElementRef<HTMLElement>>('accent');
// in ngAfterViewInit:
const accent = this.accent()?.nativeElement;
if (accent) this.motion.reveal(accent, { delay: 0.6, y: 16 });
```

- [ ] **Step 2: Add blob styles to hero.component.scss**

Append to `src/app/sections/hero.component.scss`:

```css
.hero__blobs {
  position: absolute;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  overflow: hidden;
}
.hero__blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  opacity: 0.5;
  mix-blend-mode: screen;
  animation: blobdrift 14s var(--ease) infinite alternate;
}
.hero__blob--1 {
  width: 420px; height: 420px;
  top: -80px; inset-inline-end: -60px;
  background: radial-gradient(circle, rgba(244, 180, 0, 0.55), transparent 70%);
}
.hero__blob--2 {
  width: 360px; height: 360px;
  bottom: -100px; inset-inline-start: 10%;
  background: radial-gradient(circle, rgba(224, 123, 38, 0.45), transparent 70%);
  animation-delay: 3s;
}
@keyframes blobdrift {
  from { transform: translate(0, 0) scale(1); }
  to { transform: translate(30px, -24px) scale(1.12); }
}
.hero__title-main { display: block; }
@media (prefers-reduced-motion: reduce) {
  .hero__blob { animation: none; }
}
```

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: success.

- [ ] **Step 4: Browser verification**

Playwright: load the page. Confirm (a) the title animates in word-by-word on load, (b) hovering the primary CTA makes it follow the cursor (magnetic), (c) scrolling moves the hero background at a different rate (parallax), (d) soft gradient blobs are visible behind the copy. Screenshot the hero.

- [ ] **Step 5: Commit**

```bash
git add src/app/sections/hero.component.ts src/app/sections/hero.component.scss
git commit -m "feat: animate hero with parallax, gradient blobs, magnetic CTA, split title"
```

---

### Task 5: Trust marquee strip (new component)

**Files:**
- Create: `src/app/sections/marquee.component.ts`
- Modify: `src/app/core/i18n/translations.ts` (add a `marquee: string[]` to each lang dictionary + the `Dictionary` type)
- Modify: `src/app/landing/landing.component.ts` (place `<app-marquee />` between hero and about)

**Interfaces:**
- Consumes: `I18nService.t().marquee` (array of short strings).
- Produces: `MarqueeComponent` (selector `app-marquee`).

- [ ] **Step 1: Add marquee copy to the i18n dictionary**

In `src/app/core/i18n/translations.ts`, add `marquee: string[];` to the `Dictionary` type, and add to each language's content. For English: `marquee: ['Farm Fresh Daily', 'ISO Certified', '50M+ Eggs / Year', 'Solar Powered Facilities', 'Graded & Inspected', 'Trusted Since 1998']` and Arabic equivalents: `marquee: ['طازج يومياً من المزرعة', 'معتمد ISO', '+50 مليون بيضة سنوياً', 'منشآت تعمل بالطاقة الشمسية', 'مفروز ومفحوص', 'موثوق منذ 1998']`.

(Use values consistent with the existing brand copy in the file; adjust year/numbers to match existing stats if they differ.)

- [ ] **Step 2: Create the marquee component**

Create `src/app/sections/marquee.component.ts`:

```ts
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { I18nService } from '../core/i18n/i18n.service';

@Component({
  selector: 'app-marquee',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="marquee" aria-hidden="true">
      <div class="marquee__row">
        @for (item of loop(); track $index) {
          <span class="marquee__item">{{ item }}</span>
          <span class="marquee__dot">●</span>
        }
      </div>
    </div>
  `,
  styles: [
    `
      .marquee {
        overflow: hidden;
        background: var(--brand-tint);
        border-block: 1px solid var(--line);
        padding-block: 14px;
      }
      .marquee__row {
        display: inline-flex;
        align-items: center;
        gap: 26px;
        white-space: nowrap;
        will-change: transform;
        animation: marquee 28s linear infinite;
      }
      .marquee:hover .marquee__row { animation-play-state: paused; }
      .marquee__item {
        font-weight: 800;
        letter-spacing: 0.02em;
        color: var(--brand-700);
        font-size: clamp(0.95rem, 2vw, 1.15rem);
      }
      .marquee__dot { color: var(--yolk); font-size: 0.6rem; }
      @keyframes marquee {
        from { transform: translateX(0); }
        to { transform: translateX(-50%); }
      }
      html[dir='rtl'] .marquee__row { animation-direction: reverse; }
      @media (prefers-reduced-motion: reduce) {
        .marquee__row { animation: none; flex-wrap: wrap; white-space: normal; justify-content: center; }
      }
    `,
  ],
})
export class MarqueeComponent {
  private readonly t = inject(I18nService).t;
  // Duplicate the list so the -50% translate loops seamlessly.
  readonly loop = computed(() => [...this.t().marquee, ...this.t().marquee]);
}
```

- [ ] **Step 3: Place it in the page**

In `src/app/landing/landing.component.ts`, import `MarqueeComponent`, add it to `imports`, and insert `<app-marquee />` between `<app-hero />` and `<app-about />`.

- [ ] **Step 4: Verify build**

Run: `npm run build`
Expected: success.

- [ ] **Step 5: Browser verification**

Playwright: confirm the marquee scrolls continuously beneath the hero, pauses on hover, and reverses direction in Arabic (RTL is the default). Screenshot.

- [ ] **Step 6: Commit**

```bash
git add src/app/sections/marquee.component.ts src/app/core/i18n/translations.ts src/app/landing/landing.component.ts
git commit -m "feat: add scrolling trust marquee between hero and about"
```

---

### Task 6: About — parallax image + staggered reveal

**Files:**
- Modify: `src/app/sections/about.component.ts`

**Interfaces:**
- Consumes: `MotionService.parallax`, `MotionService.revealStagger`.

- [ ] **Step 1: Read the current component**

Run: `cat src/app/sections/about.component.ts` to see its exact template/structure and class.

- [ ] **Step 2: Wire motion**

Add `AfterViewInit`, inject `MotionService`, add a `#aboutImg` ref to the main image and `#aboutCopy` to the text column wrapper. In `ngAfterViewInit`:

```ts
ngAfterViewInit(): void {
  const img = this.aboutImg()?.nativeElement;
  if (img) this.motion.parallax(img, { y: 12 });
  const items = this.host.nativeElement.querySelectorAll<HTMLElement>('[data-reveal]');
  this.motion.revealStagger(items, { stagger: 0.1 });
}
```

Add `data-reveal` attributes to the eyebrow, heading, paragraph(s), and any stat/feature items in the template. Inject `ElementRef` as `host` and `viewChild` for `aboutImg` (mirror the pattern from Task 4).

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: success.

- [ ] **Step 4: Browser verification**

Playwright: scroll to About; confirm text items stagger in and the image shifts slightly with scroll. Screenshot.

- [ ] **Step 5: Commit**

```bash
git add src/app/sections/about.component.ts
git commit -m "feat: animate about section with parallax image and staggered reveal"
```

---

### Task 7: Products — 3D tilt-on-hover + staggered scroll-in

**Files:**
- Modify: `src/app/sections/products.component.ts`

**Interfaces:**
- Consumes: `MotionService.revealStagger`, `MotionService.enabled`.

- [ ] **Step 1: Add staggered reveal + tilt**

Add `AfterViewInit`, inject `MotionService` and `ElementRef`. Add `#grid` to `.products`. In `ngAfterViewInit`:

```ts
ngAfterViewInit(): void {
  const cards = this.host.nativeElement.querySelectorAll<HTMLElement>('.product');
  this.motion.revealStagger(cards, { stagger: 0.1, y: 36 });
  if (this.motion.enabled && !matchMedia('(hover: none)').matches) {
    cards.forEach((card) => this.attachTilt(card));
  }
}

private attachTilt(card: HTMLElement): void {
  const onMove = (e: MouseEvent): void => {
    const r = card.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    card.style.transform =
      `perspective(800px) rotateY(${px * 8}deg) rotateX(${-py * 8}deg) translateY(-8px)`;
  };
  const onLeave = (): void => { card.style.transform = ''; };
  card.addEventListener('mousemove', onMove);
  card.addEventListener('mouseleave', onLeave);
}
```

Inject `ElementRef` as `host`. Keep the existing `:hover` lift in SCSS but ensure the inline `transform` (tilt) does not fight it — remove `transform: translateY(-8px)` from the `.product:hover` rule since the JS now sets transform (keep the box-shadow/border hover changes).

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: success.

- [ ] **Step 3: Browser verification**

Playwright (desktop viewport): hover a product card; confirm it tilts in 3D toward the cursor and cards stagger in on scroll. Then emulate a touch device and confirm tilt is disabled (cards still lift via CSS). Screenshot.

- [ ] **Step 4: Commit**

```bash
git add src/app/sections/products.component.ts
git commit -m "feat: add 3D tilt-on-hover and staggered reveal to product cards"
```

---

### Task 8: Why — animated icon cards

**Files:**
- Modify: `src/app/sections/why.component.ts`

**Interfaces:**
- Consumes: `MotionService.revealStagger`.

- [ ] **Step 1: Read and wire**

Run: `cat src/app/sections/why.component.ts`. Add `AfterViewInit`, inject `MotionService` + `ElementRef`. In `ngAfterViewInit` select the feature cards and call `this.motion.revealStagger(cards, { stagger: 0.09, y: 30 })`. Add a CSS hover float/scale on the icon (e.g. `.why__icon` `transition: transform .4s var(--ease)` and on card hover `transform: translateY(-4px) scale(1.08)`).

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: success.

- [ ] **Step 3: Browser verification**

Playwright: scroll to Why; confirm cards stagger in and icons animate on hover. Screenshot.

- [ ] **Step 4: Commit**

```bash
git add src/app/sections/why.component.ts
git commit -m "feat: animate why-choose-us cards with stagger and icon hover"
```

---

### Task 9: Process — pinned horizontal timeline (desktop) + vertical fallback

**Files:**
- Modify: `src/app/sections/process.component.ts`

**Interfaces:**
- Consumes: `MotionService.pinHorizontal`, `MotionService.enabled`.

- [ ] **Step 1: Restructure the timeline for horizontal pinning**

Wrap the `<ol class="timeline">` in a pin container and make the list a horizontal track on desktop. Update the template:

```html
<div class="process__pin" #pin>
  <ol class="timeline" #track>
    <span class="timeline__track" aria-hidden="true"></span>
    @for (step of steps(); track step.title; let i = $index) {
      <li class="timeline__step" appReveal [appReveal]="i + 1"> ... existing inner ... </li>
    }
  </ol>
</div>
```

Add refs and wiring to the class:

```ts
export class ProcessComponent implements AfterViewInit {
  private readonly motion = inject(MotionService);
  private readonly pin = viewChild<ElementRef<HTMLElement>>('pin');
  private readonly track = viewChild<ElementRef<HTMLElement>>('track');
  // ...existing i18n + icons + steps...

  ngAfterViewInit(): void {
    const pin = this.pin()?.nativeElement;
    const track = this.track()?.nativeElement;
    if (pin && track) this.motion.pinHorizontal({ pin, track, minWidth: 861 });
  }
}
```

Add `AfterViewInit, viewChild, ElementRef` to imports.

- [ ] **Step 2: Adjust styles for horizontal desktop / vertical mobile**

In the component `styles`, for desktop (default / `min-width: 861px`): make `.timeline` `display: flex`, `flex-wrap: nowrap`, each `.timeline__step` `flex: 0 0 clamp(240px, 28vw, 320px)`, and `.process__pin` `overflow: hidden`. Keep the existing `@media (max-width: 860px)` vertical-stack rules so mobile/tablet degrade to the current vertical timeline (no pin). Ensure the horizontal `.timeline__track` connector spans the flex row.

Concretely, replace the desktop `.timeline` grid rule with:

```css
.process__pin { overflow: hidden; }
.timeline {
  position: relative;
  display: flex;
  flex-wrap: nowrap;
  gap: 16px;
  width: max-content;
}
.timeline__step { flex: 0 0 clamp(240px, 28vw, 320px); }
.timeline__track {
  position: absolute;
  top: 36px;
  inset-inline: 36px;
  height: 3px;
  background: repeating-linear-gradient(90deg, var(--brand) 0 14px, transparent 14px 24px);
  opacity: 0.4;
}
```

Keep the entire existing `@media (max-width: 860px)` block unchanged (it resets to a vertical grid). Add inside that media block: `.timeline { display: grid; width: auto; }` to override the flex layout on mobile.

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: success.

- [ ] **Step 4: Browser verification (the showpiece)**

Playwright at desktop width (≥1024px): scroll into the Process section; confirm the section pins and the 5 steps scroll horizontally as you scroll vertically, then unpins. Verify it works in RTL (default Arabic) — horizontal motion goes right-to-left. Then at mobile width (375px): confirm it falls back to a normal vertical stacked timeline with no pin/horizontal scroll. Also emulate reduced-motion and confirm steps are visible and static. Screenshots at desktop + mobile.

- [ ] **Step 5: Commit**

```bash
git add src/app/sections/process.component.ts
git commit -m "feat: pinned horizontal process timeline on desktop, vertical on mobile"
```

---

### Task 10: Stats — animated backdrop + ScrollTrigger-synced count-up

**Files:**
- Modify: `src/app/sections/stats.component.ts`

**Interfaces:**
- Consumes: `MotionService.parallax`, `MotionService.revealStagger`. Keeps the existing `CountUpDirective`.

- [ ] **Step 1: Wire motion**

Add `AfterViewInit`, inject `MotionService` + `ElementRef`. Add `#statsBg` to the `.stats__bg img`. In `ngAfterViewInit`:

```ts
ngAfterViewInit(): void {
  const bg = this.statsBg()?.nativeElement;
  if (bg) this.motion.parallax(bg, { y: 14 });
  const items = this.host.nativeElement.querySelectorAll<HTMLElement>('.stats__item');
  this.motion.revealStagger(items, { stagger: 0.12, y: 30 });
}
```

The existing `CountUpDirective` already triggers on viewport entry — keep it (it independently honors reduced-motion). Add a subtle animated sheen to `.stats__bg::after` via a slow gradient-position keyframe (decorative, disabled under reduced-motion).

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: success.

- [ ] **Step 3: Browser verification**

Playwright: scroll to Stats; confirm numbers count up, cards stagger in, background parallaxes. Screenshot.

- [ ] **Step 4: Commit**

```bash
git add src/app/sections/stats.component.ts
git commit -m "feat: animate stats backdrop parallax and staggered cards"
```

---

### Task 11: Gallery — staggered reveal + parallax hover

**Files:**
- Modify: `src/app/sections/gallery.component.ts`

**Interfaces:**
- Consumes: `MotionService.revealStagger`. Must NOT break the existing lightbox click behavior.

- [ ] **Step 1: Read and wire**

Run: `cat src/app/sections/gallery.component.ts` to learn the exact grid/lightbox structure and existing click handlers. Add `AfterViewInit`, inject `MotionService` + `ElementRef`. In `ngAfterViewInit` select the gallery figure/items and call `this.motion.revealStagger(items, { stagger: 0.07, y: 24 })`. Add a CSS-only image zoom on hover (`transform: scale(1.06)` with transition) — do NOT add JS pointer handlers that could swallow the lightbox click.

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: success.

- [ ] **Step 3: Browser verification**

Playwright: scroll to Gallery; confirm tiles stagger in and zoom on hover, AND clicking a tile still opens the lightbox. Screenshot the open lightbox.

- [ ] **Step 4: Commit**

```bash
git add src/app/sections/gallery.component.ts
git commit -m "feat: animate gallery reveal and hover zoom, keep lightbox"
```

---

### Task 12: Contact + Footer — reveals and refined focus states

**Files:**
- Modify: `src/app/sections/contact.component.ts`
- Modify: `src/app/sections/contact.component.scss`
- Modify: `src/app/sections/footer.component.ts`

**Interfaces:**
- Consumes: `MotionService.reveal`, `MotionService.revealStagger`.

- [ ] **Step 1: Wire contact**

Run: `cat src/app/sections/contact.component.ts`. Add `AfterViewInit` + `MotionService` + `ElementRef`. Stagger-reveal the form fields and the contact info items. In `contact.component.scss`, refine input focus: animated label/border (e.g. border-color transition to `--brand` + soft `--ring` shadow on `:focus-visible`). Preserve the existing UI-only submit success behavior.

- [ ] **Step 2: Wire footer**

Run: `cat src/app/sections/footer.component.ts`. Add `AfterViewInit` + `MotionService` + `ElementRef`; stagger-reveal footer columns.

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: success.

- [ ] **Step 4: Browser verification**

Playwright: scroll to Contact/Footer; confirm fields and columns reveal in, focus states animate, and the form still shows its success state on submit. Screenshot.

- [ ] **Step 5: Commit**

```bash
git add src/app/sections/contact.component.ts src/app/sections/contact.component.scss src/app/sections/footer.component.ts
git commit -m "feat: animate contact and footer reveals with refined focus states"
```

---

### Task 13: Final pass — responsive, RTL, reduced-motion, build

**Files:**
- Modify: any section file needing breakpoint/RTL fixes found during verification.

**Interfaces:**
- Consumes: all prior tasks.

- [ ] **Step 1: Production build**

Run: `npm run build`
Expected: success, within budgets. If a budget *error* (not warning) appears, raise the relevant budget in `angular.json` only if necessary and note it in the commit.

- [ ] **Step 2: Responsive sweep (Playwright)**

Load the page at widths 375, 768, 1024, 1440. At each width confirm: no horizontal overflow/scrollbar, hero readable, marquee fits, products grid reflows (3→2→1), process is horizontal-pinned only ≥861px else vertical, stats grid reflows (4→2), gallery reflows, footer stacks. Screenshot each width.

- [ ] **Step 3: RTL check**

Default is Arabic (RTL). Confirm all parallax/horizontal motion direction is mirrored correctly and no layout breaks. Toggle to English (LTR) via the navbar and confirm both directions look correct. Screenshot both.

- [ ] **Step 4: Reduced-motion check**

Playwright: emulate `prefers-reduced-motion: reduce`. Confirm Lenis is off (native scroll), no GSAP entrance animations, marquee/blobs static, and ALL content is visible (nothing stuck at opacity 0). Screenshot.

- [ ] **Step 5: Accessibility check**

Confirm keyboard tab order works, focus rings visible, skip link works, the to-top button has its aria-label. Use the a11y-debugging skill or Playwright snapshot to verify semantic structure intact.

- [ ] **Step 6: Fix any issues found, then final commit**

```bash
git add -A
git commit -m "fix: responsive, RTL, and reduced-motion polish for landing redesign"
```

---

## Self-Review

**Spec coverage:**
- Motion engine (MotionService, Lenis+GSAP, reduced-motion gate, RTL, lifecycle) → Tasks 2, 3. ✓
- Hero (parallax, blobs, drifting eggs, split title, magnetic CTA, count-up) → Task 4 (count-up hero stats already exist via template values; hero uses static stat numbers — acceptable, the animated count-up lives in Stats Task 10). ✓
- Trust marquee → Task 5. ✓
- About → Task 6. ✓
- Products 3D tilt → Task 7. ✓
- Why → Task 8. ✓
- Process pinned horizontal + mobile fallback → Task 9. ✓
- Stats → Task 10. ✓
- Gallery (keep lightbox) → Task 11. ✓
- Contact/Footer → Task 12. ✓
- Global polish (smooth scroll, progress ring, gradient accents) → Tasks 3, 4. ✓
- Responsive / a11y / RTL / reduced-motion / build → Task 13 + per-task verification. ✓
- Dependencies gsap + lenis → Task 1. ✓

**Placeholder scan:** Tasks 6, 8, 11, 12 instruct reading the current file first because their exact inner markup is needed to attach refs; the motion calls and patterns are fully specified. This is a deliberate "follow the established pattern from Task 4" reference with the pattern spelled out, not a vague placeholder.

**Type consistency:** `MotionService` method names (`init`, `destroy`, `enabled`, `dirSign`, `reveal`, `revealStagger`, `parallax`, `magnetic`, `splitTextIn`, `pinHorizontal`, `onScrollProgress`) defined in Task 2 are used consistently in Tasks 3–12. ✓
