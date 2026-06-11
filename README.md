# Family Eggs For Trading Co. — Landing Page

A premium, fully responsive, bilingual (English / Arabic, RTL-ready) landing page
for **Family Eggs For Trading Co. — شركة بيض العائلة للتجارة**, built with the latest
**Angular** using standalone components and a clean, component-based architecture.

## ✨ Highlights

- **Brand-accurate palette** extracted directly from the company logo & carton:
  - Family Eggs Orange `#E07B26` (primary) · Yolk Gold `#F4B400` · Fresh Green `#4CAF50`
- **Real farm imagery** — hero uses the golden egg-candling shot; gallery shows the
  actual farms, grading halls, conveyor lines and solar facilities.
- **Bilingual EN/AR** with instant language toggle and full RTL/LTR layout mirroring.
- **Standalone components**, `OnPush` change detection, signals, and a lazy-loaded page.
- **Custom directives**: scroll-reveal (`appReveal`) and animated counters (`appCountUp`).
- **Accessible**: skip link, focus rings, ARIA labels, reduced-motion support, semantic HTML.
- **SEO-ready**: meta + Open Graph + Twitter tags and JSON-LD Organization schema.

## 🧱 Sections

Hero · About · Products · Why Choose Us · Production Process · Statistics ·
Testimonials (carousel) · Partners & Certifications · Gallery (lightbox) · Contact · Footer

## 🚀 Getting started

```bash
npm install
npm start        # dev server → http://localhost:4200
npm run build    # production build → dist/family-eggs-landing
```

> Requires Node 20+.

## 📁 Structure

```
src/
  index.html              # SEO meta, fonts, JSON-LD, boot loader
  styles.scss             # global design system & brand tokens
  app/
    app.config.ts         # router + zone config
    app.routes.ts         # lazy-loaded landing route
    app.component.ts      # root shell
    core/i18n/            # i18n service + EN/AR translations
    shared/
      components/          # Logo, SectionHeading
      directives/          # RevealDirective, CountUpDirective
    landing/              # page composition + back-to-top
    sections/             # one standalone component per section
public/assets/
  images/                 # optimized farm & product photography
  brand/                  # logo assets
```

## 🌍 Internationalization

All copy lives in `src/app/core/i18n/translations.ts` as a strongly-typed EN/AR
dictionary. `I18nService` exposes signals (`t`, `lang`, `dir`, `isRtl`) and keeps
`<html lang dir>` in sync; the choice is persisted to `localStorage`.

## 📝 Notes

- Frontend only — the contact form is UI-only and shows a success state without a backend.
- The map uses an OpenStreetMap embed placeholder; swap for Google Maps if preferred.
- Brown / organic product imagery reuses the white-egg photography with subtle CSS
  filtering as a placeholder until dedicated shots are available.
