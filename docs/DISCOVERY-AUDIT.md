# Family Eggs — Discovery & Audit (Phase 01)

**Status:** Analysis only. No code, content, styling or assets were modified in this phase.
**Date of audit:** 2026-08-18 (supersedes the 2026-08-17 draft)
**Codebase audited:** commit `314221c` + 6 uncommitted working-tree files.
**Live site audited:** https://familyeggs.sa/ — reachable, HTTP 200, ~1.8 s TTFB.
**Local build audited:** `ng serve` on :4200 and `ng build --configuration production`.

> **Scope note.** The current localhost rendering is the **baseline for analysis only**. Nothing in
> its present visual design is treated here as approved or as a target direction.

---

## 0-A. Client Corrections — 2026-08-18 (BINDING)

Phase 01 was accepted as a technical audit, with the following corrections issued by the client.
**Where this section conflicts with anything below, this section governs.**

| # | Correction | Affects |
|---|---|---|
| C1 | The mark recovered from the video watermark is **NOT the official logo**. A new official logo is **in preparation**. The recovered mark is historical visual evidence only. | §0.3, §5.3, §9.11, §10.1 |
| C2 | `#45B91C` and `#EB3B11` are **NOT official brand colours**. They are a record of what appears on existing signage/footage. No palette may be built on them. | §0.4, §5.3, §9.7, §14.4 |
| C3 | The restored 4K stills are **AI-enhanced derivatives**. Permitted as **temporary placeholders for environments and machinery only**. **Never** as documentary evidence and **never** as authentic staff photography. | §5.4, §7, §11 |
| C4 | **"Solar-Powered Farms" is withdrawn.** The only verified statement is: *"Part of the farm's energy consumption is supported by solar energy."* / *"يسهم استخدام الطاقة الشمسية في تغطية جزء من احتياجات الطاقة في المزرعة."* | §3.3, §3.13, §8 KEEP, §9 |
| C5 | The three product cards and pack sizes in the codebase are **NOT approved product data**. Confirmed direction: **white table eggs in standard market size grades (S, M, L, XL)**. Final sizes, weights, cartons and SKUs **pending**. | §3.5, §4 |
| C6 | **"60+ years"** = the **owner's cumulative sector experience**, including an earlier farm. It must **never** be presented as the legal age of Family Eggs. | New — not in the original audit |
| C7 | Primary audience is **B2B**: wholesale distributors, egg traders, supermarkets, hotels, food-service buyers, regional and international importers. | §14 |
| C8 | This is **not** a consumer e-commerce site. Primary conversions: Request a Quote · Become a Distribution Partner · Export Enquiry · Direct phone/email. | §14 |
| C9 | The brand must **not** look like a conventional farm website. Approved direction: professional and international, clean lines, strong simplicity, restrained premium motion, warm family character, industrial precision, export ambition. **No** generic card grids, **no** excessive rounded rectangles, **no** decorative gradients, **no** generic agricultural icons. | §9 (all) |
| C10 | Preliminary Arabic typography direction is **Alexandria**. **Cairo and El Messiri are withdrawn** as primary brand typography. | §9.5 |
| C11 | Approved hero message: **"من عائلتنا، إلى العالم."** / **"From Our Family to the World."** | §3.2, §8 REFINE |

**Consequence for the audit's central finding (§14.1):** unchanged in direction, strengthened in degree. The brand identity is not merely wrong on the site — it does not yet exist in final form. Visual design remains blocked on the official logo.

---

## 0. Executive Summary

Nine findings drive everything else in this document.

| # | Finding | Severity |
|---|---|---|
| 1 | **The site contains zero photographs.** A live DOM audit returns `img: 0`, `video: 0`, `svg: 46`. Every image slot is a CSS gradient plus a generic line icon. | Critical |
| 2 | **The company owns strong 4K imagery the site does not use.** An unaudited `generated/` folder holds five 4K–5.5K restored stills — two already watermark-free — plus one rejected motion clip. See §5.4. | Critical |
| 3 | **The deployed logo is not the company's logo.** A green + orange-red monogram appears on the company's own buildings and footage (§5.3); the site ships an unrelated nest-of-eggs illustration. **Per C1, neither is official — the official logo is in preparation.** | Critical |
| 4 | **The design palette has no verified basis.** Site tokens are amber `#E39A34` / sage `#6BA368`, derived from an assumption. The colours observed on existing signage are `#45B91C` / `#EB3B11`. **Per C2, neither set is approved.** | Critical |
| 5 | **Four unverified certification claims render publicly** (ISO 22000, HACCP, SFDA, Halal) with no certificates on file. | High (commercial/regulatory) |
| 6 | **The English site is complete but unreachable.** Every string is translated; `initialLang()` hard-returns `'ar'` and no switcher exists. | High |
| 7 | **Live SEO is broken.** JSON-LD carries the placeholder domain `https://familyeggs.example`; no canonical, no `og:image`, no hreflang; `robots.txt` and `sitemap.xml` both return the SPA shell. | High |
| 8 | **The engineering is sound.** Angular 20, standalone + signals + `OnPush`, clean RTL via logical properties, 78 kB initial transfer, production build green in 9.6 s. | — |
| 9 | **Therefore the gap is art direction and content, not code.** Running visual design before assets arrive would produce a second placeholder design. | Sequencing |

---

## 1. Technical Audit

### 1.1 Framework & runtime

| Item | Value |
|---|---|
| Framework | Angular 20 (`^20.0.0`) |
| Component style | Standalone components, no NgModules |
| Change detection | `OnPush` throughout |
| State | Angular signals (`signal`, `computed`, `effect`) |
| Build system | `@angular/build:application` (esbuild) |
| Language | TypeScript `~5.8.0` |
| Node requirement | `>=22 <23` (`.nvmrc` = `22`; local runtime is v24.15.0 — **outside the declared range**) |
| Zone.js | Still enabled (`provideZoneChangeDetection({ eventCoalescing: true })`) — not zoneless |
| Source size | 4,318 lines across 29 files |

### 1.2 Dependencies

**Runtime:** `@angular/{animations,common,compiler,core,forms,platform-browser,router}`, `gsap ^3.15.0`, `lenis ^1.3.23`, `rxjs ~7.8.0`, `serve ^14.2.6`, `tslib`, `zone.js`.

**Dev:** `@angular/build`, `@angular/cli`, `@angular/compiler-cli`, `typescript`.

`serve` is a **runtime** dependency because it is the production web server. `gsap` and `lenis` are the only non-Angular front-end libraries. No CSS framework, no UI component library, no icon package — all icons are hand-written inline SVG.

### 1.3 Routing

`src/app/app.routes.ts` defines a single lazy-loaded route:

```
''    -> LandingComponent (lazy)
'**'  -> redirect to ''
```

Scrolling config: `withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'top' })`.

There is **one page**. All navigation is in-page hash anchors, intercepted by a `@HostListener('click')` on `LandingComponent` which routes anchor clicks through Lenis instead of native smooth scroll.

### 1.4 Component inventory

| Path | Lines | Role |
|---|---|---|
| `app.component.ts` | 11 | Root shell — `<router-outlet />` only |
| `app.config.ts` | 23 | Router + zone config |
| `app.routes.ts` | 14 | Single route + wildcard |
| `core/i18n/i18n.service.ts` | 48 | Language signal, `dir`/`lang` sync, localStorage |
| `core/i18n/translations.ts` | 408 | **All site copy**, both languages |
| `core/motion/motion.service.ts` | 284 | GSAP + Lenis orchestration, RTL-aware |
| `landing/landing.component.ts` | 223 | Page composition, aurora backdrop, back-to-top, anchor interception |
| `sections/navbar.component.ts` + `.scss` | 121 + 217 | Fixed header, desktop links, mobile drawer, scroll-spy |
| `sections/hero.component.ts` + `.scss` | 147 + 378 | Hero |
| `sections/marquee.component.ts` | 61 | Scrolling claims strip |
| `sections/about.component.ts` | 270 | About + CSS illustration + mission/vision/quality |
| `sections/products.component.ts` | 231 | 3 product cards |
| `sections/why.component.ts` | 105 | 5 reason cards |
| `sections/process.component.ts` | 182 | 5-step timeline, pinned horizontal at >=861 px |
| `sections/stats.component.ts` | 142 | Dark stats band with count-up |
| `sections/gallery.component.ts` | 180 | 8 gradient tiles + line icons |
| `sections/contact.component.ts` + `.scss` | 157 + 211 | Contact details, form, map iframe |
| `sections/footer.component.ts` | 154 | Footer |
| `shared/components/logo.component.ts` | 95 | Inline-SVG brand mark |
| `shared/components/section-heading.component.ts` | 47 | Eyebrow / title / description |
| `shared/directives/count-up.directive.ts` | 93 | Number count-up on reveal |
| `shared/directives/reveal.directive.ts` | 58 | Scroll reveal |
| `shared/pipes/safe-html.pipe.ts` | 16 | Bypasses sanitiser for icon markup |

### 1.5 Styling system

- Global `src/styles.scss` (367 lines) declares the CSS custom-property token set.
- Component styles are inline `styles: []` except navbar, hero and contact, which use `.scss` files.
- No CSS framework; SCSS used only for nesting.
- The header comment states the intent explicitly: *"(v2, photo-free) A warm, editorial, light-luxury palette built entirely from CSS + SVG."* — **the absence of photography is a deliberate, documented decision of the current build**, not an oversight.

### 1.6 Localization

- Custom signal-based i18n, not `@angular/localize`.
- One `Dictionary` type, two implementations (`en`, `ar`), exported as `CONTENT`.
- `I18nService` exposes `lang`, `t`, `dir`, `isRtl`, `toggle()`, `setLang()` and persists to `localStorage` under `fe-lang`.
- `initialLang()` **hard-returns `'ar'`** with the comment `// Site is Arabic-only.` — persistence and `toggle()` are dead code in production.

### 1.7 Forms

- Reactive forms (`FormBuilder.nonNullable.group`) in the contact section.
- Validators: `name` required + minLength 2; `email` required + email; `phone` optional; `message` required + minLength 10.
- **No backend.** `submit()` builds a hard-coded **Arabic** message body and opens `https://wa.me/966507488650?text=...` in a new tab.

### 1.8 Integrations

| Integration | Status |
|---|---|
| WhatsApp deep link | Live — `966507488650` |
| OpenStreetMap iframe | Present; **renders blank** (522 x 218 empty box); bbox is a wide approximate region, not a pin |
| Google Fonts | 4 families, render-blocking on the critical path |
| Analytics | **None** |
| Tag manager / pixels | **None** |
| CMS | **None** — all copy in `translations.ts` |
| Backend / API | **None** |
| Cookie consent | **None** |

### 1.9 SEO — verified against the live site

| Element | Status |
|---|---|
| `<title>` | Present, Arabic |
| `meta description` | Present, Arabic — **advertises بيض بني (brown) and بيض عضوي (organic)**, which appear nowhere else on the site |
| `meta keywords` | Present — ignored by all major engines; also carries the brown/organic contradiction |
| `canonical` | **MISSING** (verified: 0 matches on live HTML) |
| `og:title` / `og:description` / `og:type` / `og:locale` | Present |
| `og:url` | **MISSING** |
| `og:image` | **MISSING** — every social share renders with no image |
| `twitter:card` | `summary` (not `summary_large_image`) |
| `hreflang` | **MISSING** (0 matches) |
| JSON-LD `Organization` | Present — **`"url": "https://familyeggs.example"` is a placeholder domain, live in production** |
| JSON-LD `email` | Live value is `AL-HOMODI@HOTMAIL.COM` (the `info@familyeggs.sa` fix is uncommitted) |
| `theme-color` | `#E07B26` — matches neither the current token `#E39A34` nor the real brand `#EB3B11` |
| Favicon | Inline SVG data-URI placeholder egg; **`/favicon.ico` returns 404** |
| `robots.txt` | **Returns the SPA shell** (HTTP 200, 32,608 bytes of HTML served as `text/plain`) |
| `sitemap.xml` | **Returns the SPA shell** (HTTP 200, `text/html`) |
| Rendering | **Client-side only.** No SSR, no prerendering. All content depends on JS execution. |
| Heading structure | Valid — exactly one `<h1>`, then `H2`/`H3` in order; no skipped levels |
| Landmarks | `<main>` present; skip link present (**targets `#products`, not `#main`**) |

### 1.10 Deployment

| Item | Value |
|---|---|
| Platform | Railway (Nixpacks) via `railway.json` |
| Build | `npm run build` -> `ng build` (production by default) |
| Start | `npm run serve:prod` -> `serve -s dist/family-eggs-landing/browser -l ${PORT:-8080}` |
| Restart policy | `ON_FAILURE`, max 3 retries |
| Apex domain | `https://familyeggs.sa/` — **works** |
| `www` subdomain | `https://www.familyeggs.sa/` — **fails to connect** (no DNS/cert) |

The `-s` flag rewrites every unmatched path to `index.html`, which is why `robots.txt` and `sitemap.xml` return the SPA shell rather than 404.

### 1.11 Build health & performance baseline

Production build: **green, 9.558 s, no warnings, no errors.**

| Chunk | Raw | Transfer |
|---|---|---|
| `chunk-*.js` (Angular core) | 161.92 kB | 47.70 kB |
| `main-*.js` | 69.35 kB | 17.27 kB |
| `polyfills-*.js` (zone.js) | 34.59 kB | 11.33 kB |
| `styles-*.css` | 6.31 kB | 2.10 kB |
| **Initial total** | **272.16 kB** | **78.40 kB** |
| `chunk-*.js` (lazy `landing-component`) | 277.13 kB | 74.31 kB |
| **Effective first view** | **549.29 kB** | **~152.71 kB** |

Budgets: initial warning 600 kB / error 1.5 MB; per-component style warning 8 kB / error 16 kB. All within budget.

The site is light **only because it has no media**. Introducing the photography and video the brief requires will multiply page weight — this baseline is not a steady state.

### 1.12 Configuration defects found

| Defect | Detail |
|---|---|
| **Missing assets directory** | `angular.json` declares `assets: [{ glob: "**/*", input: "public" }]`, but **`public/` does not exist**. The build silently succeeds and the declaration is inert. This directory must be created before the first real image lands. |
| Node version drift | `.nvmrc` and `engines` pin Node 22; the local machine runs v24.15.0. |
| Dev-server host allowance | Uncommitted `allowedHosts: [".trycloudflare.com"]` added to the `serve` target — a tunnelling convenience, harmless but undocumented. |

### 1.13 Runtime health

Console on load: **3 messages, 0 errors, 0 warnings.**

Accessibility spot-check (live DOM):

| Check | Result |
|---|---|
| `<img>` elements | 0 (so: no missing `alt` — but also no images) |
| Buttons/links without accessible name | 0 |
| Form controls without a label | 0 |
| `<h1>` count | 1 |
| Heading sequence | `H1, H2, H3x3, H2, H3x3, H2, H3x5, H2, H3x5, H2, H2, H2, H4x3` — valid |
| `<main>` landmark | Present |
| Skip link | Present but points at `#products` |
| `dir="ltr"` islands for phone numbers | Correct (2 found) |

**Reveal-animation defect:** after a full programmatic scroll to the bottom and back to the top, **4 elements remain at `opacity: 0`**. Content that never becomes visible is content that does not exist for the user. Full-page screenshot capture confirms large blank regions where reveals had not fired.

### 1.14 Uncommitted working-tree state

Six files are modified and not committed. All of the below is therefore **absent from the live site**.

| File | Change |
|---|---|
| `src/index.html` | JSON-LD email `AL-HOMODI@HOTMAIL.COM` -> `info@familyeggs.sa` |
| `src/app/core/i18n/translations.ts` | Same email fix, both languages |
| `src/app/sections/contact.component.ts` | Same email fix in the `mailto:` href |
| `src/app/sections/footer.component.ts` | Same email fix in the `mailto:` href |
| `angular.json` | Added `allowedHosts` to the dev server |
| `package-lock.json` | Dependency lock drift |

**Risk:** the corrected public email exists only in the working tree. A clean checkout loses it, and the site continues to publish a personal Hotmail address as its commercial contact.

---

## 2. Current Sitemap

```
https://familyeggs.sa/
+-- / ............................ Landing (the only page)
    +-- #home .................... Hero
    |   +-- (marquee — no anchor)
    +-- #about ................... About / mission / vision / quality
    +-- #products ................ Products (3)
    +-- #why ..................... Why choose us (5)
    +-- #process ................. Production process (5 steps)
    |   +-- (stats band — no anchor, not in nav)
    +-- #gallery ................. Gallery (8 tiles)
    +-- #contact ................. Contact + form + map
        +-- (footer)
```

- **Pages:** 1
- **Routes:** 1 (plus a wildcard redirect)
- **Indexable URLs:** 1
- **Language variants:** 0 (English unreachable)
- **Desktop page height:** 8,390 px at 1440 px wide
- **Mobile page height:** 11,035 px at 390 px wide

Consequence: there are no dedicated URLs for Products, Our Farm, Quality, For Business, Recipes or About. Everything competes for one URL's ranking, and nothing can be linked to or shared individually.

---

## 3. Content Inventory

All copy lives in `src/app/core/i18n/translations.ts`. Nothing below has been altered.

### 3.1 Navigation

| Key | Arabic | English |
|---|---|---|
| home | الرئيسية | Home |
| about | من نحن | About |
| products | المنتجات | Products |
| why | لماذا نحن | Why Us |
| process | مراحل الإنتاج | Process |
| gallery | المعرض | Gallery |
| contact | تواصل معنا | Contact |
| cta | اطلب عرض سعر | Get a Quote |

### 3.2 Hero (`#home`)

| Element | Arabic | English |
|---|---|---|
| Badge | طازج من المزرعة • صناعة سعودية | Farm-fresh • Saudi made |
| Title | بيض طازج | Fresh Eggs |
| Title accent | يصلك كل يوم | Delivered Every Day |
| Description | شركة بيض العائلة للتجارة تقدّم لك بيضاً طازجاً وفاخراً من المزرعة — مغذّى طبيعياً، مفروز بعناية، ويصلك يومياً بالجودة والاهتمام الذي تستحقه عائلتك. | Family Eggs For Trading Co. brings you premium, farm-fresh eggs — naturally nourished, carefully graded and delivered daily with the quality and care your family deserves. |
| CTA 1 | تواصل معنا | Contact Us |
| CTA 2 | تصفّح المنتجات | View Products |
| Stat 1 | 100% — بيض سعودي طازج | 100% — Fresh Saudi eggs |
| Stat 2 | 360 — بيضة في الكرتون | 360 — Eggs per box |
| Stat 3 | 3 أشهر — مدة الصلاحية | 3 mo — Shelf life |

**Hard-coded in `hero.component.ts`, not in the dictionary:**

| Element | Arabic | English |
|---|---|---|
| Panel header | جودة موثوقة | Trusted quality |
| Panel row 1 | طازج 100% / يُجمع كل صباح | 100% Fresh / Collected every morning |
| Panel row 2 | جودة درجة أ / فرز وفحص يومي | Grade A quality / Graded & inspected daily |
| Panel row 3 | توصيل يومي / من المزرعة إلى بابك | Daily delivery / Farm to your door |
| Chip 1 | طازج كل صباح | Fresh every morning |
| Chip 2 | جودة درجة أ | Grade A quality |

**Images/video in hero:** none. The visual is CSS gradients, blobs and a glass panel.

### 3.3 Marquee (between hero and about)

| Arabic | English |
|---|---|
| طازج يومياً من المزرعة | Farm Fresh Daily |
| آيزو 22000 | ISO 22000 Certified |
| هاسب | HACCP |
| متوافق مع الغذاء والدواء | SFDA Compliant |
| حلال معتمد | Halal Certified |
| مزارع بالطاقة الشمسية | Solar-Powered Farms |
| بيض سعودي 100% | 100% Saudi Eggs |
| مفروز ومفحوص | Graded & Inspected |

**Warning:** four of these eight are **certification claims** currently displayed publicly. See §8 and §10.

### 3.4 About (`#about`)

| Element | Arabic | English |
|---|---|---|
| Eyebrow | من نحن | About Us |
| Title | اسم عائلي بُني على الثقة | A family name built on trust |
| Story | تربّي شركة بيض العائلة للتجارة دجاجاً سليماً في مزارع حديثة بمحافظة مرات في منطقة الرياض بالمملكة العربية السعودية. نجمع بين المرافق العاملة بالطاقة الشمسية واهتمام العائلة الحقيقي لإنتاج بيض سعودي أبيض طازج يصل إلى مائدتك في أفضل درجات طزاجته. | Family Eggs For Trading Co. raises healthy hens on modern farms near Marat in the Riyadh region of Saudi Arabia. We combine solar-powered facilities with genuine family care to produce fresh Saudi white eggs that reach your table at their absolute freshest. |
| Mission | رسالتنا — توصيل بيض طازج وآمن وغني بالعناصر الغذائية إلى كل منزل ومنشأة من خلال تربية مسؤولة وتوزيع يومي موثوق. | Our Mission — To deliver consistently fresh, safe and nutritious eggs to every home and business through responsible farming and reliable daily distribution. |
| Vision | رؤيتنا — أن نكون الاسم الأكثر ثقة في إنتاج البيض في المملكة — نموذجاً للإنتاج الغذائي المحلي المستدام عالي الجودة. | Our Vision — To be the most trusted name in egg production in the Kingdom — a model of sustainable, quality-driven local food production. |
| Quality | التزامنا بالجودة — كل بيضة تُفرز وتُفحص ويمكن تتبّعها. نلتزم بأعلى معايير النظافة وسلامة الغذاء في كل مرحلة، من المزرعة إلى المنزل. | Quality Commitment — Every egg is graded, inspected and traceable. We hold ourselves to strict hygiene and food-safety standards at every stage, from hen house to home. |
| Badge (hard-coded) | 100% بيض سعودي | 100% Saudi eggs |
| Chip (hard-coded) | جودة درجة أ | Grade A quality |

**Images:** none. A CSS "sunrise over rolling hills" illustration with an animated sun, dashed rotating ring and swaying leaf.

### 3.5 Products (`#products`)

| Element | Arabic | English |
|---|---|---|
| Eyebrow | منتجاتنا | Our Products |
| Title | بيض أبيض سعودي طازج | Fresh Saudi white eggs |
| Description | بيض أبيض طازج، متوفّر بعبوات الأفراد، وأطباق 30 بيضة، وكراتين 360 بيضة للمنازل والمنشآت. | Fresh white eggs, available in retail cartons, 30-egg trays and 360-egg boxes for homes and businesses. |
| CTA (per card) | اطلب الأسعار | Request pricing |

See §4 for the per-product breakdown.

### 3.6 Why Choose Us (`#why`)

| Element | Arabic | English |
|---|---|---|
| Eyebrow | لماذا نحن | Why Choose Us |
| Title | جودة تتذوّقها وثقة تعتمد عليها | Quality you can taste, trust you can rely on |
| Description | كل قرار نتخذه مصمّم حول الطزاجة والسلامة والأشخاص الذين نخدمهم. | Every choice we make is designed around freshness, safety and the people we serve. |
| Item 1 | طازج يومياً — يُجمع البيض ويُفرز ويُعبّأ يومياً للحفاظ على طزاجته. | Fresh Daily — Eggs are collected, graded and packed every day to keep them fresh. |
| Item 2 | طاقة شمسية — مزارعنا مزوّدة بأنظمة طاقة شمسية صديقة للبيئة. | Solar-Powered Farms — Our farms run on eco-friendly solar energy systems. |
| Item 3 | فرز وفحص دقيق — فحص بالإضاءة وفرز آلي لكل بيضة على خطوط حديثة. | Careful Grading — Each egg is candled and graded on modern automated lines. |
| Item 4 | مرافق حديثة — حظائر مكيّفة وخطوط تدريج وتعبئة حديثة. | Modern Facilities — Climate-controlled hen houses with modern grading and packing. |
| Item 5 | بيض سعودي طازج — إنتاج محلي سعودي 100% من مزارعنا بمحافظة مرات. | Fresh Saudi Eggs — 100% local Saudi production, from our farms near Marat, Riyadh. |

### 3.7 Process (`#process`)

| Element | Arabic | English |
|---|---|---|
| Eyebrow | مراحل الإنتاج | Production Process |
| Title | من مزرعتنا إلى مائدتك | From our farm to your table |
| Description | خمس مراحل دقيقة الضبط تضمن وصول كل بيضة طازجة ونظيفة وآمنة. | Five carefully controlled steps ensure every egg arrives fresh, clean and safe. |
| Step 1 | رعاية المزرعة — دجاج سليم يُربّى في حظائر نظيفة ومكيّفة تعمل بالطاقة الشمسية. | Farm Care — Healthy hens raised in clean, climate-controlled, solar-powered houses. |
| Step 2 | الجمع — يُجمع البيض بلطف عبر سيور آلية عدة مرات يومياً. | Collection — Eggs are gently collected on automated belts multiple times a day. |
| Step 3 | فحص الجودة — تُفحص كل بيضة بالإضاءة وتُفرز حسب جودة القشرة والطزاجة. | Quality Inspection — Each egg is candled and graded for shell quality and freshness. |
| Step 4 | التعبئة — تُصنّف حسب الحجم وتُغلّف في أطباق وكراتين نظيفة آمنة غذائياً. | Packaging — Sorted by size and sealed in clean, food-grade trays and cartons. |
| Step 5 | التوزيع — يصل في نفس اليوم عبر أسطولنا المبرّد. | Distribution — Delivered same-day through our temperature-controlled fleet. |

### 3.8 Stats band (no anchor, not in nav)

| Element | Arabic | English |
|---|---|---|
| Title | منتجنا بالأرقام | Our product at a glance |
| Values | 30 بيضة في الطبق · 360 بيضة في الكرتون · 3 أشهر مدة الصلاحية · 100% بيض سعودي طازج | 30 Eggs per tray · 360 Eggs per box · 3 mo Shelf life · 100% Fresh Saudi eggs |

### 3.9 Gallery (`#gallery`)

| Element | Arabic | English |
|---|---|---|
| Eyebrow | المعرض | Gallery |
| Title | من داخل مزارعنا ومرافقنا | Inside our farms & facilities |
| Description | نظرة على الأشخاص والأماكن والعمليات وراء كل بيضة طازجة. | A look at the people, places and processes behind every fresh egg. |

Tile captions (hard-coded in `gallery.component.ts`, not in the dictionary):

| Arabic | English |
|---|---|
| حظائر مكيّفة | Climate-controlled houses |
| جمع يومي | Daily collection |
| فرز دقيق | Precision grading |
| تعبئة آلية | Automated packing |
| طاقة شمسية | Solar-powered farm |
| حقول خضراء | Green fields |
| توصيل طازج | Fresh delivery |
| مصدر موثوق | Trusted sourcing |

**Warning:** the section is titled "Inside our farms & facilities" and contains **no photography** — eight CSS gradient tiles with generic line icons (a house, a basket, a magnifier, a box, a sun, a sprout, a truck, a shield). Visually confirmed at 1440 px.

### 3.10 Contact (`#contact`)

| Element | Arabic | English |
|---|---|---|
| Eyebrow | تواصل | Contact |
| Title | لنتحدّث عن البيض الطازج | Let's talk fresh eggs |
| Description | استفسارات، طلبات بالجملة أو شراكات — فريقنا جاهز لمساعدتك. | Questions, bulk orders or partnership enquiries — our team is ready to help. |
| Address | محافظة مرات – طريق لبخة المقتسم – ص.ب 12816، الرياض، المملكة العربية السعودية | Marat — Labkhat Al-Muqtasim Rd, P.O. Box 12816, Riyadh, Kingdom of Saudi Arabia |
| Phone | +966 50 748 8650 | (same) |
| Email | `info@familyeggs.sa` *(uncommitted; **deployed value is `AL-HOMODI@HOTMAIL.COM`**)* | (same) |
| Hours | السبت – الخميس، 8:00 ص – 6:00 م | Sat – Thu, 8:00 AM – 6:00 PM |
| Form labels | الاسم الكامل · البريد الإلكتروني · رقم الهاتف · كيف يمكننا مساعدتك؟ · إرسال الرسالة | Full name · Email address · Phone number · How can we help? · Send message |
| Form success | شكراً لك! سيتم فتح واتساب لإرسال رسالتك إلينا مباشرة. إذا لم يُفتح، راسلنا على +966 50 748 8650. | Thank you! We're opening WhatsApp so you can send us your message directly. If it doesn't open, message us at +966 50 748 8650. |

### 3.11 Footer

| Element | Arabic | English |
|---|---|---|
| About | شركة بيض العائلة للتجارة — بيض سعودي طازج وفاخر يصلك كل يوم بجودة واهتمام. | Family Eggs For Trading Co. — premium Saudi farm-fresh eggs, delivered every day with quality and care. |
| Quick links heading | روابط سريعة | Quick Links |
| Contact heading | تواصل | Contact |
| Social heading | تابعنا | Follow Us |
| Rights | جميع الحقوق محفوظة. | All rights reserved. |
| Tagline | طازج من عائلتنا إلى عائلتك. | Fresh from our family to yours. |
| Copyright line | © {year} شركة بيض العائلة للتجارة. (hard-coded Arabic company name in both languages) | — |

Social links: WhatsApp (`https://wa.me/966507488650`, live) · Twitter/X (`#`) · Instagram (`#`) · LinkedIn (`#`).

### 3.12 Dictionary content that is compiled but never rendered

These blocks exist in `translations.ts`; their components were removed in an earlier commit. They ship in the bundle but appear nowhere on the site. Verified by diffing defined keys against keys referenced in components.

- **`testimonials`** — heading plus 3 quotes attributed to named individuals: خالد العتيبي (صاحب سوبرماركت، الرياض), حلويات سارة (رئيسة الطهاة، جدة), محمد الحربي (مجموعة مطاعم، الدمام).
- **`partners`** — heading, description, and a certification list: متوافق مع الغذاء والدواء · آيزو 22000 · هاسب · حلال معتمد · ممارسات التصنيع الجيدة (SFDA Compliant · ISO 22000 · HACCP · Halal Certified · GMP).

### 3.13 Factual claims currently made on the site

Consolidated for verification. **This is an inventory, not an endorsement.** The "verifiable" column now benefits from the higher-resolution `generated/` stills (§5.4), which resolve several claims that the low-resolution video could not.

| Claim | Where | Verifiable from available assets? |
|---|---|---|
| Farms located in Marat, Riyadh Region | About, Why, Contact | Yes — address + drone footage |
| ~~Solar-powered facilities~~ **WITHDRAWN (C4)** | Marquee, About, Why, Process, Gallery | Solar arrays are visible in `04_farm-dusk` and in the video, which evidences **presence**, not **proportion**. The overstated claim must be replaced everywhere with: *"Part of the farm's energy consumption is supported by solar energy."* |
| Climate-controlled hen houses | Why, Process, Gallery | Partially — hen houses visible; climate control not provable from imagery |
| Automated collection belts | Process | **Yes** — visible at ~1:20 |
| Candling / light inspection of each egg | Why, Process | **Yes** — candling unit clearly visible in `02` / `05` / `06` and at ~2:20–2:45 |
| Automated grading line | Why, Process, Gallery | **Yes** — the machine is legible in `03` as a **MOBA Omnia XF 220** |
| Own distribution fleet | Gallery | **Yes** — refrigerated trailers visible ~0:00–0:20 |
| Hygiene protocols (hairnets, uniforms, food-grade hall) | Quality (implied) | **Yes** — staff in full hairnets and uniforms, sanitised hall, UV insect units visible in `02`/`03`/`05`/`06` |
| Same-day delivery, temperature-controlled fleet | Process step 5 | **No** — "same-day" is unverifiable from assets |
| 100% Saudi production | Marquee, Hero, Stats, Why | Company statement — not independently verifiable |
| 30 eggs per tray | Stats, Products | Standard; needs company confirmation |
| 360 eggs per box (12 trays) | Hero, Stats, Products | Needs company confirmation |
| 3 months shelf life | Hero, Stats | **Needs verification** — a food-safety claim |
| Grade A quality | Hero panel, About chip | **Needs verification** — a grading classification claim |
| ISO 22000 | Marquee, partners block | **Needs certificate** |
| HACCP | Marquee, partners block | **Needs certificate** |
| SFDA compliant | Marquee, partners block | **Needs certificate** |
| Halal certified | Marquee, partners block | **Needs certificate** |
| GMP | partners block (not rendered) | **Needs certificate** |
| Traceability of every egg | About | **Needs verification** |
| 3 named customer testimonials | dictionary only (not rendered) | **Appear to be fabricated** |

---

## 4. Product Inventory

Three products are defined. There are **no product images, no packaging images, no SKUs, no nutritional data and no pricing** anywhere in the project.

### Product 1

| Field | Value |
|---|---|
| Arabic name | عبوة أفراد |
| English name | Retail Carton |
| Category | Retail / consumer |
| Tag | للأفراد / Retail |
| Pack size | **MISSING** (not stated — "small cartons") |
| Arabic description | عبوات صغيرة من البيض الأبيض الطازج، مناسبة للاستهلاك المنزلي اليومي. |
| English description | Small cartons of fresh white eggs — convenient for everyday family use at home. |
| Product image | **MISSING** — rendered as a CSS gradient with a generic "sun" line icon |
| Packaging image | **MISSING** |
| Nutritional info | **MISSING** |
| Egg grade/size | **MISSING** |
| Price | **MISSING** |

### Product 2

| Field | Value |
|---|---|
| Arabic name | طبق 30 بيضة |
| English name | Tray of 30 Eggs |
| Category | Retail / food service |
| Tag | الأكثر طلباً / Most popular |
| Pack size | 30 eggs |
| Arabic description | طبق كامل من 30 بيضة بيضاء طازجة، الخيار الأمثل للعائلات والمخابز والمطاعم. |
| English description | A full tray of 30 fresh white eggs — ideal for families, bakeries and restaurants. |
| Product image | **MISSING** — CSS gradient + generic "leaf" line icon |
| Packaging image | **MISSING** |
| Nutritional info | **MISSING** |
| Egg grade/size | **MISSING** |
| Price | **MISSING** |

### Product 3

| Field | Value |
|---|---|
| Arabic name | كرتون 360 بيضة |
| English name | Box of 360 Eggs |
| Category | Wholesale / B2B |
| Tag | جملة / Wholesale |
| Pack size | 360 eggs (12 trays x 30) |
| Arabic description | كرتون يضم 12 طبقاً (360 بيضة) للبيع بالجملة والمنشآت الغذائية. |
| English description | A box of 12 trays (360 eggs) for wholesale orders and food businesses. |
| Product image | **MISSING** — CSS gradient + generic "crown" line icon |
| Packaging image | **MISSING** |
| Nutritional info | **MISSING** |
| Egg grade/size | **MISSING** |
| Price | **MISSING** |

### Product-range observations

- Only **white eggs** are offered. The live site's meta description and keywords advertise **بيض بني** (brown) and **بيض عضوي** (organic). Whether those lines actually exist is **unknown and must be confirmed** — today the site's own metadata contradicts its own product section.
- No egg size classification (S/M/L/XL or Saudi equivalent) anywhere.
- The generic icons (sun, leaf, crown) carry no relationship to the actual products; they are decorative placeholders.
- **Observed in the imagery but absent from the site:** the `generated/` stills show at least two distinct retail pack formats — orange/red-printed pulp trays and white printed cartons stacked at the end of the grading line. The real packaging exists and is photographable; the site simply does not show it.

---

## 5. Image & Brand Asset Audit

### 5.1 Assets inside the project

**None.** There is no `public/` directory, no `assets/` directory, and no image file of any kind in `src/`. A search across the source tree for `.jpg`, `.jpeg`, `.png`, `.webp`, `.avif`, `.svg`, `.mp4`, `.webm` returns **zero matches**.

Live DOM confirms: **`img: 0`, `video: 0`, `svg: 46`.** Every visual on the site is generated at runtime from CSS gradients and inline SVG line art.

### 5.2 Asset locations outside the project

All company media sits outside the repository, in the parent folder:

```
02_FamilyEggs-Website/
+-- egg/ ............... the Angular project (no media)
+-- videos/ ............ 1 source video + 3 source stills
+-- generated/ ......... 5 restored/upscaled stills + 1 rejected clip
+-- BARNDING/ .......... EMPTY (0 files) — intended for brand assets
```

**`BARNDING/` is empty.** No logo files, no brand guidelines, no colour reference, no typography specification. This is the single most consequential gap in the asset set.

### 5.3 Brand assets — including the mark observed on company property

> **CORRECTION C1 / C2 APPLIES TO THIS ENTIRE SECTION.** The mark and colours documented below are
> **historical visual evidence only** — a record of what currently appears on the company's buildings
> and footage. They are **not** the official identity. **A new official logo is in preparation**, and
> no palette, mark or design decision may be derived from the values below.

A monogram was **observed during this audit** in the burned-in watermark on the company's own footage and on the facility ceiling, cropped and colour-sampled at source resolution.

**The observed mark:** an abstract geometric monogram reading as **"FS"** — a bright green squared "F" form (three geometric bars) overlaid by a sweeping orange-red "S" curve that cuts diagonally across it. Flat colour, no gradient, hard edges, thin white keyline separating the two colours. It is a modern corporate-industrial mark, not an agricultural or decorative one.

**Sampled colours — HISTORICAL EVIDENCE ONLY, NOT A BRAND PALETTE (C2):**

| Role | Sampled RGB | Hex |
|---|---|---|
| Observed green | rgb(69, 185, 28) | `#45B91C` |
| Observed orange-red | rgb(235, 59, 17) | `#EB3B11` |

**Comparison against the site as built:**

| | Observed on company property | Site tokens (`styles.scss`) |
|---|---|---|
| Primary | `#EB3B11` orange-red | `#E39A34` honey/amber |
| Secondary | `#45B91C` bright green | `#6BA368` muted sage |
| Character | High-saturation, industrial, high contrast | Low-saturation, warm, "light-luxury" |
| Status | **Unofficial — historical record** | **Unofficial — derived from an assumption** |

The two sets do not overlap, and **neither is approved**. The site's stated design intent ("warm, editorial, light-luxury") was derived from an assumption about the brand. The observed values merely document what exists physically today. The official palette will arrive with the new logo.

| Asset | Status | Verdict |
|---|---|---|
| Logo (as implemented) | Inline SVG in `logo.component.ts` — a nest of eggs with a green leaf, in `#E07B26` / `#F4D58A` / `#4CAF50` | **WRONG MARK — REPLACE.** It bears no resemblance to the company's actual logo in form or colour. The site is publishing a logo that is not the company's. |
| Logo source file (AI/EPS/SVG) | Not present anywhere | **MISSING — CRITICAL** |
| Wordmark | Arabic only, set in Cairo: بيض العائلة / للتجارة | **WEAK** — no English lockup, no official typography |
| Brand colour reference | Reconstructed here by sampling a video watermark | **UNOFFICIAL** — must be confirmed against the real brand files |
| Favicon | Inline SVG data-URI placeholder egg; `/favicon.ico` 404s | **WEAK** — placeholder |
| Brand guidelines | Not present | **MISSING** |

### 5.4 The `generated/` folder — high-resolution assets not previously audited

Six files, **~104 MB total**, absent from every earlier audit and unused by the site. This is the most valuable finding of the asset review.

| File | Dimensions | Size | Watermark | Content | Verdict |
|---|---|---|---|---|---|
| `02_candling-hall_restored_5504px.png` | 5504 x 3072 | 20.1 MB | **Yes** (logo top-left) | Wide view of the grading hall: candling unit glowing orange/blue, conveyors of white eggs, staff in blue, stacked blue crates, orange retail trays | **STRONG** — needs watermark removal |
| `03_grading-line_restored_5504px.png` | 5504 x 3072 | 19.8 MB | **Yes** | Symmetrical wide of the full **MOBA Omnia XF 220** grading line, six packing lanes of white eggs, four staff in purple uniforms and hairnets | **STRONGEST COMPOSITION** — needs watermark removal |
| `04_farm-dusk_restored_4K.png` | 5504 x 3072 | 18.9 MB | **No** | Dusk aerial of the whole complex: hen-house rows, feed silos, large solar array, pink-lit cloud bank, desert horizon | **HERO-GRADE, READY TO USE** |
| `05_candling-line_NOWATERMARK_notouch_4K.png` | 3840 x 2160 | 10.5 MB | **No** | Candling and conveyor hall, clean and bright, retail trays in foreground | **READY TO USE** |
| `06_candling-hall_NOWATERMARK_wide_4K.png` | 3840 x 2160 | 10.5 MB | **No** | Wider variant of the same hall, deeper perspective | **READY TO USE** |
| `_rejected/01_grading-hall-pushin_4K_6s.mp4` | 3840 x 2160, 6.0 s | 24.2 MB | **Yes** | AI-generated slow push-in animating still `02` | **REJECTED** (by prior decision) — retains watermark; motion is a mechanical zoom |

**Significance.** These are AI-restored/upscaled derivatives of the low-resolution video, and they are dramatically better than anything the site currently has:

- **Three are already watermark-free and 4K.** They can carry a full-bleed desktop background today.
- They resolve the §7 caveat that "none of these moments can carry a full-bleed desktop background at acceptable quality" — for the candling hall, grading line and dusk aerial, that constraint no longer applies.
- `04_farm-dusk` is the single best brand image the company possesses: real golden-hour light, genuine scale, no watermark, no people to clear.

**Caveats that must be resolved before use:**

1. **They are AI reconstructions, not photographs.** Fine detail (faces, text on cartons, machine labels) is interpolated, not real. They must not be presented as documentary evidence, and they should be inspected at 100% for artefacts before publication.
2. Two of the five still carry the burned-in logo watermark and need clean versions.
3. Provenance should be recorded so nobody later mistakes them for original camera files.
4. They are **not a substitute for the original 4K camera files**, which remain the highest-value request in §11.

### 5.5 Source photography supplied (in `/videos`)

Three JPEG stills, all **1280 x 720**, no watermarks:

| File | Content | Verdict |
|---|---|---|
| `WhatsApp Image 2026-08-16 at 6.45.43 PM.jpeg` (65 KB) | Dusk aerial of the full complex — the source frame behind `04_farm-dusk` | **STRONG** but low-resolution |
| `WhatsApp Image 2026-08-16 at 6.45.57 PM.jpeg` (118 KB) | Daytime aerial: hen houses, feed silos, solar array, tree line | **USABLE** — flat midday light |
| `WhatsApp Image 2026-08-16 at 6.45.57 PM (1).jpeg` (98 KB) | Entrance / logistics yard: gatehouse, canopies, refrigerated trailers, ARASCO feed tanker, olive grove | **USABLE** — documentary, proves scale and operations |

### 5.6 Photography coverage by category

| Category | Available | Verdict |
|---|---|---|
| Product packshots (carton, tray, 360-box) | **None** | COMMISSION — blocks the Products section |
| Loose eggs, macro, shell texture | **None** | COMMISSION |
| Egg cracked / yolk / food styling | **None** | COMMISSION |
| Farm exterior / aerial | 4K restored + 3 stills + video | **STRONG** |
| Grading & packing facility | 4x 4K restored + video | **STRONG** |
| Candling / inspection | 3x 4K restored + video | **STRONG** |
| Hen house interior | Video only (~1:20), dim, tungsten cast | **WEAK** |
| People / staff | Visible in 4K restored stills but distant, faces not readable; AI-reconstructed | **WEAK** — needs a real shoot with consent |
| Logistics / fleet | Video + 1 still, distant | **WEAK** |
| Solar installation | Wide aerial only, no detail shots | **PARTIAL** |
| Lifestyle / family / kitchen | **None** | MISSING |
| Founder / family portrait | **None** | MISSING |
| Certificates / documents | **None** | MISSING |
| Retail / in-store presence | **None** | MISSING |

### 5.7 Third-party asset in the repository

`egg/YTDown_Shorts_Egg-Drop-Slow-Motion-Shell-Cracks-_-Yolk_Media_1bnlS7xmBSk_001_1080p.mp4` — 1080 x 1920 vertical, 8.08 s, 497 KB. The filename indicates a downloaded YouTube Short. It is **unused**, **third-party**, of **unknown licence**, and sits in the repository root. Not deleted (per instruction); flagged for a decision.

---

## 6. Farm Video Audit

**Location:** `02_FamilyEggs-Website/videos/`
**Count:** 1 company video (plus the 3 stills in §5.5 and the stray third-party clip in §5.7).

### `WhatsApp Video 2026-08-16 at 6.45.57 PM.mp4`

Technical specification, verified by `ffprobe`:

| Property | Value |
|---|---|
| Duration | 321.05 s (5 min 21 s) |
| Resolution | **848 x 478** |
| Aspect ratio | ~16:9 (1.774:1) |
| Frame rate | 30 fps (constant) |
| Total frames | 9,631 |
| Video codec | H.264, High profile |
| Video bitrate | 930 kbps |
| Audio | AAC-LC, 48 kHz, stereo, 257 kbps |
| Overall bitrate | 1.19 Mbps |
| File size | 47.75 MB (47,751,077 bytes) |
| Source camera | DJI Phantom 4 Pro V2.0 (per burned-in watermark) |

### Technical quality — **WEAK**

- **Resolution is the blocking problem.** 848 x 478 is below SD. A Phantom 4 Pro records 4K (3840 x 2160); this file has been re-encoded by WhatsApp to roughly **one-fifth** of the original linear resolution — about **4% of the original pixel count**.
- **Two burned-in watermarks:** the company mark top-left (roughly the top 15% of frame) and `PHANTOM 4 PRO V2.0` bottom-right (~6%). Removing both by cropping costs ~21% of frame height.
- Compression artefacts are visible in sky gradients and in the dim hen-house interior.
- Audio is present at a high bitrate but carries no usable content for web (ambient/incidental).

### Visual quality — **MIXED**

- **Camera stability:** good. Drone footage is smooth; no jitter, no gimbal wobble.
- **Lighting:** exteriors are shot in flat, hazy midday light with a dusty atmospheric veil — low contrast, desaturated. Interiors are correctly exposed under fluorescent lighting, apart from the hen house which is under-lit with a heavy tungsten cast.
- **Composition:** aerial establishing shots are competently framed but repetitive. The interior facility shots are the strongest material — clean lines, receding perspective, genuine subject interest, and real human activity.
- **Editing:** 10 detected shot changes across 5:21. Long, slow takes; no cutting rhythm.

### Shot map

| Segment | Content |
|---|---|
| 0:00 – 0:16 | Yard, refrigerated trucks, red-roof buildings |
| 0:16 – 1:06 | Gate/entrance, admin buildings, access road, desert |
| 1:06 – 1:16 | Date-palm grove rows |
| 1:16 – 1:33 | Facility with solar array; **hen-house interior** |
| 1:33 – 1:43 | Grading hall — workers at packing stations |
| 1:43 – 2:01 | Grading hall — MOBA line, blue crates |
| 2:01 – 2:45 | Egg conveyors, candling unit |
| 2:45 – 3:25 | Aerial — hen houses + solar |
| 3:25 – 4:03 | Aerial — desert, roads (increasingly hazy) |
| 4:03 – 4:28 | Aerial — buildings, solar |
| 4:28 – 5:21 | Aerial — groves, roads, distant sheds |

**Overall:** the last ~2 minutes (3:25 – 5:21) is repetitive aerial B-roll of declining quality. **The usable material is concentrated in 0:00 – 2:45** — roughly half the runtime.

---

## 7. Strongest Video Timecodes

Timecodes are approximate. Frames were sampled at 10 s intervals with targeted extraction at each candidate.

| Timecode | Content | Quality | Recommended use |
|---|---|---|---|
| **0:00 – 0:16** | Yard with refrigerated trailers, red-roof buildings, desert beyond | Good | **BRAND STORY**, distribution/logistics context |
| 0:16 – 0:35 | Entrance gate, signage, electrical plant | Fair | **NOT RECOMMENDED** — utilitarian, no emotional value |
| 0:35 – 0:50 | Long access road cutting through open desert, tree lines | Good | **TRANSITION** — strong directional movement; good section-to-section wipe |
| **0:50 – 1:06** | Date-palm grove rows receding into the desert; buildings on the horizon | **Strong** | **OUR FARM**, **BRAND STORY** — the "place" shot; conveys location and cultivation |
| **1:06 – 1:16** | Full facility from above: hen houses, feed silos, solar array entering frame right | **Strong** | **OUR FARM**, **HERO** (secondary) — best single "scale of operation" shot |
| 1:16 – 1:33 | **Hen-house interior** — cage rows, feed augers, egg belt at frame right | Fair (dim, tungsten cast, cluttered) | **PRODUCTION** — content is valuable (origin of the egg) but needs grading; not hero material |
| **1:33 – 1:50** | Grading hall — staff in uniforms and hairnets at packing stations, stacked cartons, polished floor | **Strong** | **QUALITY**, **PRODUCTION** — the "people and care" shot; the only usable human presence |
| **1:50 – 2:05** | MOBA Omnia XF 220 grading line in full, long conveyor, blue crates, hall depth | **Strong** | **PRODUCTION**, **QUALITY** — proves automated grading; machine model is legible |
| **2:05 – 2:20** | White eggs travelling on a curved conveyor through the bright hall | **Strongest in the file** | **HERO**, **PRODUCTION** — clean composition, high contrast, unmistakably eggs |
| **2:20 – 2:45** | Candling / inspection unit glowing amber and blue, eggs passing through, operator at frame left | **Strong** | **QUALITY**, **HERO** — the most distinctive image the company owns: literally light passing through eggs |
| 2:45 – 3:25 | Aerial — hen-house rows with solar array | Good | **OUR FARM**, **MOBILE** (crops well to portrait) |
| 3:25 – 4:03 | Aerial — flat desert, roads, distant structures | Weak (hazy, low contrast) | **NOT RECOMMENDED** |
| 4:03 – 4:28 | Aerial — solar panels, red-roof buildings | Fair | **TRANSITION** (short cut only) |
| 4:28 – 5:00 | Aerial — close pass over a white hen-house roof | Fair | **TRANSITION** — the low pass has usable motion |
| 5:00 – 5:21 | Aerial — groves and roads receding | Weak (haziest in the file) | **NOT RECOMMENDED** |

### Classification summary

- **HERO:** 2:05 – 2:20 (conveyor), 2:20 – 2:45 (candling), 1:06 – 1:16 (facility scale)
- **OUR FARM:** 0:50 – 1:06, 1:06 – 1:16, 2:45 – 3:25
- **QUALITY:** 1:33 – 1:50, 1:50 – 2:05, 2:20 – 2:45
- **PRODUCTION:** 1:16 – 1:33, 1:50 – 2:05, 2:05 – 2:20
- **BRAND STORY:** 0:00 – 0:16, 0:50 – 1:06
- **TRANSITION:** 0:35 – 0:50, 4:03 – 4:28, 4:28 – 5:00
- **MOBILE (crops to portrait):** 2:45 – 3:25, 2:05 – 2:20
- **NOT RECOMMENDED:** 0:16 – 0:35, 3:25 – 4:03, 5:00 – 5:21

### Resolution caveat — and where it no longer applies

Every recommendation above is constrained by the 848 x 478 source. At that resolution none of these moments can carry a full-bleed desktop background at acceptable quality; they can carry small-to-medium framed video, heavily graded backgrounds, or mobile-width playback.

**Exception:** the three strongest interior moments (1:50 – 2:05, 2:05 – 2:20, 2:20 – 2:45) already exist as **4K watermark-free stills** in `generated/` (§5.4). For those frames the resolution constraint is already solved — as stills, not as motion.

**Sourcing the original 4K camera files would upgrade every entry in this table and is the single highest-leverage asset request in this document.**

*The original video file was not modified during this audit.*

---

## 8. Current Content Evaluation

Classification only — no rewriting has been performed. Reasons given for each.

### KEEP

| Content | Why |
|---|---|
| Company name, address, phone, working hours | Factual, company-supplied, correct |
| Product names and pack structures (عبوة أفراد / طبق 30 / كرتون 360) | Concrete, verifiable, commercially meaningful |
| Nav labels | Clear, conventional, work in both languages |
| Mission / Vision / Quality Commitment statements | Reasonable corporate statements; company should confirm they are official |
| ~~Solar-power claims~~ **MOVED TO REWRITE (C4)** | Imagery evidences that solar arrays exist, not that the farms are "solar-powered". Use only the approved wording. |
| Location claims (Marat, Riyadh Region) | Evidenced and consistent |
| Footer tagline (طازج من عائلتنا إلى عائلتك.) | The single best line of copy on the site — on-brand, warm, ownable |

### REFINE

| Content | Why |
|---|---|
| Hero headline (بيض طازج / يصلك كل يوم) | Accurate and on-message but generic; it could describe any egg producer. The *positioning* is sound; the *distinctiveness* is not. Refinement belongs in the content phase with the company, not to AI. |
| Hero description | Adjective-heavy ("premium", "farm-fresh", "naturally nourished"). The underlying facts are fine; the density of unsupported superlatives is the issue. |
| Process step descriptions | Mostly good and evidenced. Step 5 ("same-day", "temperature-controlled fleet") makes two claims not evidenced by available assets. |
| "Why Choose Us" items | Substantively fine; overlaps heavily with the Process section, creating repetition. |
| Footer tagline placement | Good line, currently used twice in the footer (column heading and bottom bar), which dilutes it. |
| Gallery captions | Accurate descriptions of things the company does — but the section promises photographs and shows icons, so the captions currently over-promise. |

### REWRITE (in the controlled content phase — not now)

| Content | Why |
|---|---|
| SEO title, description, keywords | The meta description and keywords advertise بيض بني (brown) and بيض عضوي (organic) — product lines that appear nowhere else on the site and may not exist. `keywords` is also ignored by all major search engines. |
| Contact form WhatsApp message body | Hard-coded Arabic; an English-speaking user sends an Arabic-labelled message. This is a bilingual defect, not a style preference. |
| Form success "reset" button label | A bare `+` character is not a label. |
| Footer copyright line | Hard-codes the Arabic company name in both languages. |

### REMOVE (subject to company decision)

| Content | Why |
|---|---|
| Testimonials block (3 named individuals with quotes) | Not rendered, but present in the shipped bundle. The names, businesses and cities appear to be invented. If these are not real, consenting customers they should not exist in the codebase at all. |
| Partners & certifications block | Not rendered; asserts five certifications. |
| Certification claims in the marquee (آيزو 22000 · هاسب · متوافق مع الغذاء والدواء · حلال معتمد) | **These render live on the public site today.** They are the highest-risk content on the site — unverified regulatory and food-safety claims. Either substantiate with certificates or remove. This is a decision for the company, not a design decision. |
| Dead social links (X, Instagram, LinkedIn -> `#`) | Non-functional links damage credibility. Supply real profile URLs or remove the icons. |
| `AL-HOMODI@HOTMAIL.COM` as the public commercial contact | A personal Hotmail address undermines every premium claim on the page. The fix exists but is uncommitted. |

### MISSING

| Content | Why it matters |
|---|---|
| Founding story / who the family is | The brand is called "Family Eggs" and there is no family in the content. The single biggest missed emotional opportunity. |
| Any real number about scale | No hen count, no daily output, no number of houses, no years operating, no delivery coverage. "Professional scale" is claimed but never demonstrated — while the imagery proves it plainly. |
| Product specifications | No egg sizes, no weights, no shelf-life basis, no storage guidance. |
| Nutritional information | Nothing. |
| B2B content | The site has a "Get a Quote" CTA with no supply capability, MOQ, lead time or trade terms behind it. |
| Where to buy | No retail presence, no distributor list, no coverage map. |
| Sustainability narrative | Solar power is mentioned as a bullet but never developed, despite being genuinely differentiating and photographically evidenced. |
| Recipes / usage / consumer content | None — and it is the main organic-search growth lever for a food brand. |
| Privacy policy / terms | None. The form collects name, email and phone. |

---

## 9. Current Design Diagnosis

Diagnosis of the site as it currently stands. **No redesign is proposed here.** Observations are from live rendering at 1440 x 900 and 390 x 844.

### 9.1 Imagery — the root problem

**The site contains no photographs.** Verified: `img: 0`, `video: 0`. Every image slot is a CSS gradient with a generic line icon. This single fact causes most of the problems below:

- The Gallery is titled *"من داخل مزارعنا ومرافقنا"* (Inside our farms & facilities) and shows **eight pastel gradient rectangles with clip-art icons** — a house, a basket, a magnifier, a box, a sun, a sprout, a truck, a shield. A section that explicitly promises to show inside the farm shows nothing of the farm.
- The About section's "farm" is a cartoon sunrise-over-hills illustration with an animated sun and a swaying leaf — closer to a children's app than a food brand.
- Products are represented by a sun, a leaf and a crown. **None depicts an egg, a carton or a tray.**
- Meanwhile the company owns 4K watermark-free imagery of its own candling hall, grading line and farm at dusk (§5.4), sitting unused one directory above the project.

For a food brand this is disqualifying. No amount of layout refinement compensates for the absence of the product.

### 9.2 Product presentation

- Three identical rounded cards with abstract gradient headers.
- No packaging, no scale reference, no egg visible, no specifications.
- The cards are visually interchangeable; only the text distinguishes them.
- Product is not the hero anywhere on the page.

### 9.3 Compositional rhythm

The page repeats a single template — **centred eyebrow -> centred heading -> centred paragraph -> row of cards** — in About, Products, Why, Process, Gallery and Stats. Six consecutive sections share one layout idea. There is no variation in scale, no asymmetry, no full-bleed moment, no change of pace. The result reads as a list of blocks rather than a narrative.

### 9.4 Hierarchy

- Within sections, hierarchy is competent (eyebrow / H2 / lead / cards).
- Across the page it is flat: every section announces itself with the same weight, so nothing is primary. The hero and the Gallery carry equal visual authority.
- The "Why Us" row compresses five cards into a single row, making each small and low-impact — five items of equal weight is five items of no weight.

### 9.5 Typography

- **Four font families** (Plus Jakarta Sans, Cairo, Fraunces, El Messiri) for one small site — heavy and inconsistent, and all four are render-blocking from Google Fonts.
- **Arabic and English use entirely different display faces** (El Messiri vs Fraunces), so the two language versions read as two different brands rather than one brand in two scripts.
- Cairo is among the most widely used Arabic web fonts, which works against distinctiveness.
- No type scale exists; sizes are ad-hoc `clamp()` values declared per component.
- Arabic display line-height inherits Latin metrics (`line-height: 1.12` on headings). Commit `b9b0c50` exists specifically to fix Arabic glyph clipping in the hero — evidence that Arabic typography was retrofitted rather than designed.

### 9.6 Spacing & layout

- No spacing scale. Values are literal per component (`22px`, `34px`, `16px`, `26px`), so vertical rhythm drifts between sections.
- **The Process section leaves several hundred pixels of empty background below its track.** The pinned horizontal timeline occupies roughly the top third of its own height. This is the most visible layout defect on the page and is clearly legible in a full-page capture.
- The Stats band's brown-to-green gradient reads muddy rather than premium.
- Desktop page height is 8,390 px; mobile is 11,035 px. Long even for a one-page site.

### 9.7 Visual language & consistency

- Very large corner radii (`--radius: 22px`, `--radius-lg: 32px`) plus fully-rounded pill buttons on everything — the dominant "friendly SaaS" idiom, not a premium food idiom.
- The rounded-square icon tile appears in at least four sections with different colour treatments.
- Colour usage is inconsistent: the primary CTA is orange, but the footer CTA is green — the only green button on the site.
- Three fixed, blurred, animated gradient blobs composite behind every section on every frame.
- Heavy reliance on decorative effects (button sheen sweep, glass panels, glow, dashed rotating ring, floating chips) rather than on content.
- **The whole palette is wrong at the root** (§5.3): warm amber and sage where the brand is high-saturation green and orange-red.

### 9.8 Navigation

- Seven top-level items for a one-page site, all of equal weight.
- The Stats section has no `id` and no anchor — unreachable by navigation.
- The skip link targets `#products`, not `#main`.
- The mobile drawer is a collapsed version of the desktop menu rather than a designed mobile experience.

### 9.9 Mobile

- 11,035 px tall; every section stacks in full with no shortening.
- **No horizontal overflow** — verified: `scrollWidth` 375 = `clientWidth` 375. Correct. Eight decorative elements (aurora blobs, hero sun, marquee row, about hills, stats sheen) exceed viewport width but are correctly contained by `overflow-x: hidden`.
- The pinned horizontal Process timeline is disabled below 861 px and falls back to vertical — a sensible decision, correctly implemented.
- Because there is no photography, mobile has nothing visually anchoring it; it becomes a very long column of text cards.

### 9.10 RTL

- Technically the strongest part of the implementation. Logical properties are used consistently; `MotionService.dirSign` correctly inverts parallax and the horizontal pin for RTL; `:host-context([dir='rtl'])` is used correctly inside components.
- `<html lang="ar" dir="rtl">` verified live; `dir="ltr"` islands correctly applied to phone numbers.
- Remaining issue: RTL is the *only* mode ever exercised in production, so LTR is effectively untested in the wild.

### 9.11 Brand recognition

- **The logo displayed is not the company's mark** (§5.3).
- **The palette is not the company's palette** (§5.3).
- Nothing about the typography or imagery is specific to Family Eggs. Replace the wordmark and the site could belong to any regional food producer.
- The brand name promises *family*; the site shows no people, no founder, no story.

### 9.12 Perceived quality

- Craft at the code level is high — the motion service, RTL handling and component architecture are well built.
- Perceived quality at the surface is mid-market: gradient placeholders, generic icons, stock layout patterns and heavy decoration read as a template, not as a premium brand.
- **The gap between "well engineered" and "looks premium" is almost entirely an art-direction and asset gap, not a technical one.**

### 9.13 Functional defects observed

| Defect | Detail |
|---|---|
| Reveal animations strand content | 4 elements remain at `opacity: 0` after a full scroll cycle. Full-page capture shows large blank regions. |
| Map renders blank | The OpenStreetMap iframe renders as an empty white box (522 x 218). Its bbox is a wide approximate region, not a precise pin. |
| Dead social links | 3 of 4 (`href="#"`). |
| JSON-LD placeholder URL | `https://familyeggs.example` live in production. |
| Personal email published | `AL-HOMODI@HOTMAIL.COM` live in production as the commercial contact. |
| `robots.txt` / `sitemap.xml` | Both return the SPA shell instead of the expected files. |
| `/favicon.ico` 404 | No favicon file; only an inline data-URI. |
| `www` subdomain dead | `https://www.familyeggs.sa/` fails to connect. |
| `public/` declared but absent | `angular.json` points at a non-existent assets directory. |
| Hard-coded Arabic in WhatsApp payload | English users send Arabic-labelled messages. |
| Latent i18n bug | `MotionService.splitTextIn()` replaces the `<h1>`'s DOM with generated spans, breaking the Angular binding. Invisible today (language never changes at runtime) but **the hero headline will go stale the moment a language switcher is added**. |

---

## 10. Content Required From Family Eggs

Nothing in this list has been invented or assumed. These are the gaps the company must fill.

### 10.1 Critical — blocks credible content

1. **The new official logo** — currently in preparation (C1). Required in vector (AI / EPS / SVG) plus high-resolution PNG, in colour, mono and reversed variants, with an Arabic/English lockup. All visual design is blocked on this. `BARNDING/` is empty.
2. **Official brand colours** — to be delivered with the new logo. The values sampled in §5.3 are historical evidence only and must not be used (C2).
3. **Certification status** — which of SFDA, ISO 22000, HACCP, Halal and GMP do you actually hold? Certificate scans, issuing bodies, certificate numbers, expiry dates. These claims are live on the site today.
4. **Confirmation of the "Grade A" claim** — is this an official grading classification you are certified to use?
5. **Basis for the "3 months shelf life" claim** — how is it determined, and under what storage conditions?
6. **Product specifications** — per product: egg size classification, egg weight range, tray/carton dimensions, gross weight, barcode/SKU, storage temperature, recommended shelf life.
7. **Whether brown and organic egg lines exist** — the live meta description and keywords advertise both.

### 10.2 Company & story

8. **The founding story** — who founded Family Eggs, when, and why. The brand is built on the word "family" and the family is currently absent.
9. **Year of establishment.**
10. **Ownership / leadership** — names and roles of anyone you want represented publicly.
11. **Official company registration details** — CR number, VAT number (usually required in the footer for Saudi commercial sites).

### 10.3 Operations & scale

12. **Number of farms and their locations.**
13. **Number of hen houses.**
14. **Flock size.**
15. **Daily / annual egg production.**
16. **Number of employees.**
17. **Grading line confirmation** — the imagery shows a **MOBA Omnia XF 220**; confirm the model and its throughput (eggs/hour).
18. **Solar installation details** — capacity, share of energy needs met, install date.
19. **Cold-chain and fleet details** — number of vehicles, refrigeration specification.
20. **Delivery coverage** — which cities and regions, and delivery frequency.
21. **Verification of the "same-day delivery" claim.**

### 10.4 Commercial

22. **Retail presence** — which supermarkets or chains stock Family Eggs (only if you have permission to name them).
23. **B2B capability** — minimum order quantities, lead times, contract terms, supply capacity.
24. **Distributor / wholesale contacts.**
25. **Pricing policy** — whether prices are shown publicly or by quotation only.

### 10.5 Quality & compliance

26. **Documented quality process** — the real, internal version of the five-step story currently on the site.
27. **Food-safety protocols and testing regime.**
28. **Traceability system** — the site claims every egg is traceable; how?
29. **Animal welfare standards.**
30. **Feed supplier and feed composition** (an ARASCO tanker appears in the imagery).

### 10.6 Nutrition & consumer

31. **Nutritional panel per egg** — energy, protein, fat, cholesterol.
32. **Storage and handling guidance for consumers.**
33. **Any allergen or dietary statements required by SFDA labelling rules.**

### 10.7 Digital & legal

34. **Correct public contact email** — confirm `info@familyeggs.sa` is live and monitored; the deployed site currently publishes `AL-HOMODI@HOTMAIL.COM`.
35. **Real social media profile URLs** (X, Instagram, LinkedIn) — or confirmation that they do not exist.
36. **Exact farm coordinates** for an accurate map pin.
37. **Privacy policy and terms** — the contact form collects personal data.
38. **Whether the three testimonials in the codebase correspond to real, consenting customers.**
39. **DNS decision for `www.familyeggs.sa`** — currently dead.
40. **Consent status for staff appearing in photography.**

---

## 11. Creative Asset Gaps

Assets that would materially improve the site, in priority order. Each entry states what it unlocks.

### Priority 0 — free, immediate, already half-done

| Asset | Detail | Unlocks |
|---|---|---|
| **Clean versions of the two watermarked `generated/` stills** | `02_candling-hall` and `03_grading-line` are the two strongest compositions the company has, and both still carry the burned-in logo. Watermark-free variants already exist for the other three, so the workflow is proven. | The Quality and Production sections, immediately |
| **Provenance record for the `generated/` set** | Document that these are AI restorations, when they were made, and from which source frames | Prevents them from later being mistaken for camera originals; required before any documentary use |

### Priority 1 — cannot build a premium product experience without these

| Asset | Detail | Unlocks |
|---|---|---|
| **Original 4K drone footage** | The uncompressed DJI card files behind the 848 x 478 WhatsApp copy — watermark-free | Every video use on the site. **The highest-leverage single request in this document:** it upgrades every entry in §7 at zero shooting cost. |
| **Professional product packshots** | All three packs (individual carton, 30-tray, 360-box), studio-lit, on white and on a styled surface, multiple angles, high resolution, with clipping paths | The entire Products experience. Currently represented by a sun, a leaf and a crown. |
| **Packaging close-ups** | Label detail, branding, date stamps, material texture | Trust, "product as hero" treatment, quality storytelling |
| **Macro egg photography** | Shell texture, a single egg lit to show form, eggs in a tray, cracked egg with yolk | Hero imagery, freshness storytelling, texture across the site |

### Priority 2 — required for the emotional half of the brief

| Asset | Detail | Unlocks |
|---|---|---|
| **People photography** | Staff at the grading line and in the hen houses; faces, hands, care — with consent | The "family", "care" and "trust" pillars. Current imagery shows people only as distant coloured shapes, and in the AI restorations their faces are interpolated, not real. |
| **Founder / family portrait** | The people behind the name | The brand story the site's own name promises |
| **Food photography** | Eggs prepared — breakfast scenes, baking, a cracked yolk | Consumer relevance, recipe content, warmth |
| **Hen house interior, properly lit** | The existing footage at ~1:20 is dim, tungsten-cast and cluttered | "Modern production" and animal-welfare storytelling |

### Priority 3 — strengthens specific sections

| Asset | Detail | Unlocks |
|---|---|---|
| **Golden-hour farm photography** | `04_farm-dusk` proves this location photographs beautifully at that hour — shoot it properly | Hero and Our Farm sections |
| **Solar installation photography** | Close and wide, ideally at low sun | Sustainability narrative, currently one bullet point |
| **Cold-chain / fleet photography** | Branded vehicles, loading, cold room | Distribution and B2B credibility |
| **Production detail macro** | Eggs on the conveyor, the candling light, grading in action | Quality section; partially available but not at native resolution |
| **Certificate scans** | Clean, legible | The trust section — cannot exist without them |
| **Brand guidelines document** | Colour values, typography, logo usage, clear space | Ends the current guesswork about brand identity |
| **`og:image` social card** | 1200 x 630, branded | Every social share; currently shares render with no image |
| **Proper favicon set** | `.ico`, PNG sizes, `apple-touch-icon`, `site.webmanifest` | Browser tab, bookmarks, mobile home screen |

### Notes on what is *not* recommended

- **Stock photography** of generic farms or eggs. The company's own imagery, even at low resolution, is more credible than stock — and the positioning depends on authenticity.
- **The third-party YouTube clip** currently in the repository (§5.7) should not be used.
- **The rejected AI push-in clip** (`generated/_rejected/`) should stay rejected: it retains the watermark and its motion is a mechanical zoom, not a camera move.
- **Further AI generation of people.** The AI-restored stills are acceptable for environments and machinery. Using AI-reconstructed faces to represent "our team" on a brand built on family authenticity is a credibility risk that is not worth taking.

---

## 12. Bilingual / RTL / LTR Status

### Arabic (RTL) — **Live and complete**

| Aspect | Status |
|---|---|
| Content coverage | Complete — every string has an Arabic value |
| Reachability | Default and only language served |
| `dir` handling | Correct — `<html lang="ar" dir="rtl">` set via signal effect, verified live |
| Layout mirroring | Correct — logical properties used consistently |
| Motion direction | Correct — `dirSign` inverts parallax and the horizontal pin |
| Numeral direction | Correct — `dir="ltr"` islands on phone numbers |
| Typography | Cairo (body) + El Messiri (display) |
| Known issues | Display line-height inherits Latin metrics; commit `b9b0c50` exists specifically to fix Arabic glyph clipping in the hero. Numerals are Western (0-9), conventional for Saudi commercial sites. |
| Copy quality | Reads as natively written Arabic, not machine-translated |

### English (LTR) — **Complete but unreachable**

| Aspect | Status |
|---|---|
| Content coverage | Complete — every string has an English value |
| Reachability | **None.** `initialLang()` returns `'ar'` unconditionally; no switcher exists anywhere in the UI (verified: no language control in `navbar.component.ts`) |
| `dir` handling | Correct when forced |
| Layout mirroring | Correct — nav, hero, panel and stats all mirror properly |
| Typography | Plus Jakarta Sans (body) + Fraunces (display) |
| Copy quality | Reads as natively written English, not machine-translated from Arabic |

**English-specific defects:**

1. **No switcher.** The English site exists in every shipped bundle and cannot be reached by any user. It is dead weight in the payload today.
2. **No English URL.** Both languages would share `/`, so correct `hreflang` and canonical tags are impossible without a URL strategy decision.
3. **Contact form sends Arabic.** The WhatsApp message body is hard-coded Arabic regardless of active language.
4. **Footer copyright** hard-codes the Arabic company name in both languages.
5. **Latent runtime-switch bug** — `splitTextIn()` (§9.13) will leave the hero headline stale on language switch. This must be fixed *before* a switcher is added, not after.
6. **Different display typeface** from Arabic (Fraunces vs El Messiri), so the two versions do not read as one brand in two scripts.

### Bilingual readiness summary

| Requirement for a true bilingual site | Status |
|---|---|
| Both dictionaries complete | **Done** |
| `dir`/`lang` switching mechanism | **Done** (service level) |
| RTL-aware layout | **Done** |
| RTL-aware motion | **Done** |
| Language switcher UI | **Missing** |
| Per-language URLs | **Missing** |
| `hreflang` + canonical | **Missing** |
| Per-language metadata | **Missing** |
| Language-aware form payload | **Missing** |
| Unified bilingual type system | **Missing** |
| DOM-safe headline rendering | **Broken** (`splitTextIn`) |

Roughly half the bilingual work is done and the remaining half is blocked on one decision (URL strategy) and one bug fix.

---

## 13. Technical Risks

| # | Risk | Severity | Detail |
|---|---|---|---|
| 1 | **Client-side rendering and SEO** | High | Client-rendered SPA, no SSR or prerendering. All metadata and content depend on JS execution. Adding a second language makes this materially worse. Angular 20 supports prerendering via `@angular/ssr`; adopting it changes build output and the production start command, so it needs its own deployment test. |
| 2 | **Unverified public claims** | High | Four certification claims render live. Commercial and regulatory exposure, not technical, but it lives in the codebase. |
| 3 | **Wrong logo and wrong palette in production** | High | The site displays a mark and a colour system that are not the company's. |
| 4 | **Broken production metadata** | High | Placeholder JSON-LD domain, personal Hotmail as public contact, no canonical, no `og:image`, `robots.txt`/`sitemap.xml` serving HTML. |
| 5 | **Uncommitted fixes will be lost** | Medium-High | The corrected public email exists only in the working tree across 4 files. A clean checkout reverts to publishing a personal Hotmail address. |
| 6 | **No CMS** | Medium | All content is in a TypeScript file. Every copy change requires a developer, a commit and a redeploy. As the site grows to multiple pages and a recipe section, this becomes the main bottleneck. |
| 7 | **Contact form has no backend** | Medium | Submissions depend on WhatsApp deep-linking succeeding. No delivery guarantee, no record of enquiries, no spam protection, no fallback if the popup is blocked. |
| 8 | **No analytics** | Medium | No way to measure whether any redesign succeeds. Baseline data should be collected **before** Phase 02 ships, or the "before" is lost permanently. |
| 9 | **Asset weight ahead** | Medium | 78 kB today because there is no media. The `generated/` stills alone are ~104 MB of PNG. Responsive formats (AVIF/WebP), a loading strategy, and possibly a CDN or image service must be planned, not retrofitted. `public/` does not even exist yet. |
| 10 | **Reveal animations strand content** | Medium | 4 elements never reach `opacity: 1`. Any content that fails to reveal is invisible to users and to screenshot-based QA. |
| 11 | **Latent i18n/DOM bug** | Medium | `splitTextIn()` breaks Angular's binding on the hero `<h1>`. Must be resolved before any language switcher ships. |
| 12 | **AI-asset provenance** | Medium | The `generated/` stills are AI reconstructions with interpolated detail, including human figures. Using them as documentary proof, or generating faces, is a credibility risk. Provenance must be recorded. |
| 13 | **Third-party fonts render-blocking** | Low-Medium | Four families from Google Fonts on the critical path. Reducing family count and self-hosting are both straightforward wins. |
| 14 | **Scroll library coupling** | Low-Medium | Lenis + GSAP ScrollTrigger + a pinned horizontal section is fragile; git history shows two commits fixing pin measurement and reveal-opacity interactions. Additional pinned sections will need care. |
| 15 | **No test suite** | Low-Medium | No unit or e2e tests. A large redesign with no regression safety net is a risk that grows with scope. |
| 16 | **Node version drift** | Low | `engines` pins `>=22 <23`; local runtime is v24.15.0. Railway may resolve differently from local. |
| 17 | **Unlicensed third-party media in repo** | Low | §5.7. |
| 18 | **`www` subdomain dead** | Low | Users typing `www.familyeggs.sa` get a connection failure. |
| 19 | **Zone.js still enabled** | Low | The app already uses signals and `OnPush` throughout; close to zoneless-ready. Not urgent. |

---

## 14. Recommendations for Phase 02

Phase 01 is complete. Recommendations only — **nothing below has been started.**

### 14.1 The central finding

The engineering is not the problem. The component architecture, RTL implementation, motion service and i18n structure are competently built and worth keeping. **The gap between the current site and the target is almost entirely a content, brand-identity and art-direction gap.**

Two things changed that assessment during this audit:

1. The company's **real brand identity** was recovered (§5.3) and it is nothing like what the site displays. The current design is not merely under-art-directed — it is art-directed to the wrong brand.
2. The company already owns **4K, watermark-free, genuinely good imagery** (§5.4) that nobody has put on the site. The "we have no assets" premise behind the photo-free design decision is no longer true.

Sequencing consequence: **a visual design phase run before the brand files arrive would produce a second wrong-brand design.** The most valuable next action is not design — it is brand and asset acquisition, which has a lead time the design work does not.

### 14.2 Recommended parallel tracks

**Track A — Company inputs (start immediately, longest lead time)**

Send §10 and §11 to Family Eggs. The four highest-leverage items, in order:

1. **Official logo and brand files** — everything visual is blocked on this.
2. **The original 4K drone footage** — zero cost, upgrades every entry in §7.
3. **Product packshots** — without these there is no product experience.
4. **Certification status** — determines whether a trust section can exist at all.

**Track B — Decisions needed before design can begin**

These are choices, not tasks, and each materially changes the design work:

1. **Site architecture** — does this remain one page, or become a multi-page site (Home / Our Story / Products / Quality / Our Farm / For Business / Contact)? The brief's ambitions (B2B journey, recipes, per-product depth) cannot fit on one page.
2. **Bilingual URL strategy** — required before any SEO or routing work. Options: `/` + `/en`, `/ar` + `/en`, or subdomains. This also determines whether prerendering is required.
3. **Brand identity scope** — is the recovered mark fixed and to be used as supplied, or is a brand refresh in scope? The current mark is wrong either way.
4. **CMS or no CMS** — decide before components are built around a TypeScript dictionary.
5. **Photography direction** — agree art direction *before* the shoot brief is written, so the shoot produces the images the design needs rather than the design adapting to whatever was shot.
6. **AI-asset policy** — how far AI restoration may be used, and where it must not be (recommendation: environments and machinery yes, human faces no).

**Track C — Zero-risk technical groundwork (can proceed during Track A)**

None of these touch visible design or copy:

1. **Commit the email fix** — it is a one-line correction currently at risk of being lost, and it is publishing a personal Hotmail address in the meantime.
2. Install analytics to capture a **pre-redesign baseline** — this window closes permanently once the redesign ships.
3. Create the `public/` directory that `angular.json` already points at.
4. Fix the `splitTextIn()` DOM/binding bug before any language-switcher work.
5. Add real `robots.txt` and `sitemap.xml` (and confirm `serve -s` will serve them rather than rewriting).
6. Fix the JSON-LD placeholder URL.
7. Investigate the 4 elements stranded at `opacity: 0`.
8. Prototype and deployment-test `@angular/ssr` prerendering on a branch, so the SEO decision in Track B rests on a working proof rather than an assumption.
9. Fix or remove the blank map embed and the dead social links.
10. Point `www.familyeggs.sa` at the apex.
11. Decide on the unlicensed third-party clip in the repository.

### 14.3 Suggested Phase 02 scope

Following the brief's stated sequence (RESEARCH -> CONTENT -> IA -> WIREFRAME -> DESIGN SYSTEM -> VISUAL -> MOTION -> IMPLEMENTATION), the natural next phase is **Information Architecture and Content Strategy** — not visual design:

- Agree the page map and what each page is for
- Define the homepage narrative order and what each section must prove
- Define the content model per section (what fields exist, what is required)
- Produce a shoot brief derived from that content model
- Produce a copy brief — for humans, listing what needs writing and why, without writing it
- Produce an asset-treatment plan for the `generated/` stills (which are usable where, at what crop, with what grading)

Wireframes should follow the IA; visual design should follow the wireframes, the brand files and the arrival of real assets.

### 14.4 Explicit non-recommendations

- Do not begin visual design until the official brand files arrive and the IA is agreed.
- Do not build a palette on the colours sampled in §5.3 until the company confirms them.
- Do not commission photography until the art direction is agreed.
- Do not add a language switcher until the URL strategy is decided and the `splitTextIn()` bug is fixed.
- Do not restore the certification claims anywhere until certificates are supplied.
- Do not use AI-generated or AI-reconstructed human faces to represent staff or family.

---

## Appendix A — Verification Method

Every factual claim in this document was verified during the audit rather than inferred.

| Area | Method |
|---|---|
| Framework, dependencies, routing, components | Direct file reads across all 29 source files |
| Line counts | `wc -l` per file |
| Build health & bundle sizes | `ng build --configuration production` — full output captured |
| Live site status | `curl` against `https://familyeggs.sa/` and `https://www.familyeggs.sa/` |
| Live SEO tags | Fetched and grepped the live HTML |
| `robots.txt` / `sitemap.xml` | `curl` with content-type and size inspection |
| Video specification | `ffprobe` — codec, resolution, bitrate, frame count, duration |
| Image dimensions | `ffprobe` across all `generated/` and `videos/` assets |
| Generated-asset content | Downscaled and visually inspected every file |
| Brand logo & colours | Cropped the watermark at source resolution; sampled RGB via `ffmpeg` raw-pixel extraction |
| Rejected clip | Extracted a 3-frame strip and inspected |
| Rendered design | Playwright at 1440 x 900 and 390 x 844; full-page capture sliced and inspected |
| DOM/accessibility audit | In-page JS evaluation — image counts, heading sequence, landmarks, labels, `dir` islands |
| Reveal-animation defect | Programmatic full-page scroll followed by an `opacity` sweep |
| Mobile overflow | `scrollWidth` vs `clientWidth` comparison plus per-element width scan |
| Unused dictionary keys | Diffed defined keys against keys referenced in components |
| Uncommitted state | `git status` and `git diff` across all modified files |

**Nothing in the project, the media folders, or the live site was modified.** The three screenshots taken during the audit were written to a scratch directory outside the repository.

---

*End of Phase 01. Awaiting Phase 02 instructions.*
