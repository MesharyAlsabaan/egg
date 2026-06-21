# Landing Page Redesign — "Premium Light & Airy" with GSAP + Lenis

**Date:** 2026-06-21
**Project:** Family Eggs For Trading Co. landing page (Angular 20, standalone components)

## Goal

Redesign the existing landing page so it feels markedly more premium and makes
first-time visitors say "wow", while staying fully responsive and accessible.
The visual direction is **premium light & airy** (bright, editorial, soft
shadows, generous whitespace, brand-orange accents). Motion is upgraded with
**GSAP + Lenis** for buttery smooth scroll and advanced scroll-driven
animations. The redesign spans **every section** (full-page).

## Non-goals / constraints

- **Keep the brand palette** exactly (`--brand`, `--yolk`, `--green`, neutrals).
  Only motion and layout get fancier.
- **Keep all copy and i18n** — no string changes; EN/AR + RTL preserved.
- **No custom cursor** (hurts accessibility/mobile, gimmicky).
- Frontend-only; contact form stays UI-only.
- Must pass through Angular production build budgets.

## Architecture

### Motion engine — `MotionService` (new, injectable, root)

A single Angular `@Injectable({ providedIn: 'root' })` service owns all
animation infrastructure so sections stay declarative.

Responsibilities:
- **Lenis** smooth scroll: instantiate on init, drive its RAF loop, and call
  `ScrollTrigger.update()` from it; tear down on destroy.
- **GSAP + ScrollTrigger** registration (once).
- Helper methods sections call, each returning cleanup handles:
  - `reveal(el, opts)` — fade/translate-in on scroll (GSAP).
  - `revealStagger(els, opts)` — staggered batch reveal.
  - `parallax(el, opts)` — y/x parallax tied to scroll, **RTL-flips x**.
  - `pin(trigger, opts)` — pin + horizontal scrub (used by Process).
  - `magnetic(el)` — pointer-follow magnetic effect for CTAs.
  - `splitTextIn(el)` — word-by-word entrance for hero title.
  - `countUp(el, to)` — number count-up triggered on enter.
- **`prefers-reduced-motion` gate:** when set, the service is a no-op — Lenis is
  not started and helpers return immediately. Sections fall back to the existing
  IntersectionObserver `RevealDirective` so content is always visible and the
  page remains fully functional.
- **RTL awareness:** reads `document.documentElement.dir`; horizontal motion
  directions invert for `rtl`.
- **SSR/non-browser safe:** guards on `typeof window`.

Lifecycle: initialized and destroyed by `LandingComponent` (the page shell).

### Section-by-section plan

1. **Hero** — layered parallax (background image scrubs slower than copy),
   soft animated gradient "yolk" blobs behind content, gently drifting egg
   accents, word-by-word title entrance timeline on load, **magnetic primary
   CTA**, count-up hero stats. Scroll indicator retained.
2. **Trust marquee (new)** — slim, slow auto-scrolling ticker of
   certifications/keywords between hero and about. CSS-driven; pauses on hover;
   hidden from screen readers as decorative or labeled appropriately.
3. **About** — parallax on the image, decorative blobs, staggered text reveal.
4. **Products** — cards gain **3D tilt-on-hover** (pointer-driven, disabled on
   touch), image zoom, staggered scroll-in.
5. **Why** — animated icon cards with staggered reveal.
6. **Process** — ⭐ showpiece: **pinned horizontal scroll timeline** on desktop
   (GSAP pin + scrub). On tablet/mobile it degrades to a normal **vertical
   stacked** animated timeline. Step numbers animate in.
7. **Stats** — ScrollTrigger-driven count-up with an animated gradient backdrop.
8. **Gallery** — staggered reveal + subtle parallax hover; **keeps existing
   lightbox** behavior.
9. **Contact** — reveal + refined animated input focus states.
10. **Footer** — reveal.

### Global polish

- Lenis smooth scroll site-wide.
- Back-to-top button upgraded with a **scroll-progress ring**.
- Subtle animated gradient-mesh accents built only from existing palette tokens.

## Responsive behavior

- All animations degrade cleanly. The pinned horizontal Process timeline becomes
  a vertical stack at tablet/mobile breakpoints.
- Parallax magnitude reduced (or disabled) on touch and small screens.
- 3D tilt disabled on touch devices.
- Existing responsive layout rules retained and extended.

## Accessibility

- Full `prefers-reduced-motion` path: no smooth-scroll hijack, no GSAP, static
  reveals via the existing directive.
- Preserve current ARIA labels, focus-visible rings, skip link, semantic HTML.
- RTL/LTR mirroring preserved across all new motion.
- Marquee and decorative motion marked `aria-hidden` where purely decorative.

## Dependencies added

- `gsap` (includes ScrollTrigger)
- `lenis`

Both are small, tree-shakeable, and loaded only on the (lazy) landing route.

## Testing / verification

- Build passes Angular production budgets.
- Manual verification in browser at desktop / tablet / mobile widths.
- Verify EN and AR (RTL) both animate correctly.
- Verify `prefers-reduced-motion` disables motion and content is visible.
- Verify keyboard nav and focus states still work.

## Risks

- Pinned horizontal scroll can be finicky with Lenis — mitigate by syncing
  ScrollTrigger to Lenis and testing the desktop↔mobile breakpoint switch.
- GSAP + Lenis added weight — kept off the critical path; lazy-loaded route.
