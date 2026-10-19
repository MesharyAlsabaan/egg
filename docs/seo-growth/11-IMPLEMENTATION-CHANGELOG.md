# 11 — Implementation Changelog

Branch **`release/seo-growth`**, based on `master` @ `9a3e82e` (= `origin/master`). Commits are listed in [16](16-RELEASE-CHECKLIST.md) and with `git log --oneline master..release/seo-growth`.

> **Line endings.** The Google Drive working tree has every tracked file checked out with CRLF, while the repository stores LF. 25 files differ from `HEAD` **only** in line endings. They were **not committed** and are left as they were in the working tree. Every committed file is LF, matching the repository. `git diff -w` hides the noise locally.

## New files

| File | Purpose |
|---|---|
| `server/server.mjs` | Production server: static build, redirects, headers, MIME types, ranges, ETag, compression, `www` → apex, `/api/*` |
| `server/inquiry.mjs` | Enquiry endpoint: origin / size / type checks, rate limits, honeypot, minimum fill time, optional Turnstile, validation, email via SMTP; off until configured; no storage |
| `server/server.test.mjs` | 23 tests (`npm run test:server`), with a local SMTP sink |
| `src/app/core/pages.ts` | Page registry: keys, slugs, URLs, x-default rule, `isIndexable` |
| `src/app/core/page.ts` | `setupPage()`: language + SEO wiring for routed pages |
| `src/app/core/analytics.service.ts` | Events to `dataLayer`; GA4 when an ID is set; conversion / hand-off / error split |
| `src/app/pages/wholesale-page.component.ts` | `/ar/wholesale`, `/en/wholesale` |
| `src/app/pages/international-page.component.ts` | `/ar/international`, `/en/international` |
| `src/app/pages/privacy-page.component.ts` | `/ar/privacy`, `/en/privacy` (noindex) |
| `src/app/sections/partners.component.ts` | Home signpost to the two commercial pages |
| `src/app/shared/page-intro.component.ts` | Inner-page band: breadcrumb, `<h1>`, lede |
| `src/app/shared/inquiry-form.component.ts` | Enquiry form: server mode, hand-off mode, no-JS mailto fallback |
| `public/serve.json` | Redirects and headers for the `serve` rollback path |
| `public/404.html` | Branded bilingual 404, noindex |
| `tools/check-seo.mjs` | Build-output SEO check (`npm run check:seo`) |
| `docs/seo-growth/*` | Documentation, research, Lighthouse CSV, screenshots |

## Modified files

| File | Change |
|---|---|
| `src/app/core/i18n/dictionary.ts` | Copy for all new pages, form (two modes), privacy notice, signpost, breadcrumb, page meta. `SPEC` constant; `CONTACT` moved above the dictionaries so the address is derived, never retyped. Unsupported claims neutralised ([08](08-CONTENT-STRATEGY.md) §3). Nav gains Wholesale / International buyers ("The farm" anchor dropped from the nav, section kept). EN home description 211 → 181 chars |
| `src/app/core/seo.service.ts` | Per-page meta, robots (index / noindex), OG, hreflang, JSON-LD `@graph` |
| `src/app/app.routes.ts`, `app.routes.server.ts` | 4 page types × 2 languages, all prerendered |
| `src/app/app.component.ts` | Starts analytics (browser only) |
| `src/app/landing/landing.component.ts` | `setupPage('home')`; signpost section; scrolls to `#fragment` on arrival |
| `src/app/sections/header.component.ts` | Page-aware links, same-page language switch, `aria-current`, desktop nav from 1100px |
| `src/app/sections/footer.component.ts` | Page-aware links, privacy link, same-page language switch |
| `src/app/sections/contact.component.ts` | Analytics area tag |
| `src/app/sections/hero.component.ts` | Film starts after `load`, not from `autoplay` in the HTML |
| `src/styles.scss` | `--olive-deep`; shared inner-page and prose styles |
| `src/index.html` | Static JSON-LD removed (generated per page) |
| `public/sitemap.xml` | 6 canonical URLs with hreflang; root removed |
| `package.json` | `serve:prod` → `node server/server.mjs`; `serve:static` (rollback); `check:seo`; `test:server`; `nodemailer@10.0.14`; Angular 20.3.33 / 20.3.38; `serve` → devDependencies |
| `package-lock.json` | Regenerated with npm 10.9 (Node 22's npm, which Railway uses). Besides the version changes, npm 10 omits the `libc` / adds `peer` metadata that the previous npm 11 lockfile carried; this has no effect on what is installed |
| `railway.json` | `healthcheckPath: /ar`, `healthcheckTimeout: 60` |
| `README.md` | Pages, analytics, SEO check, production server, tests, rollback |

## Unchanged on purpose

Home-page design, section order and owner copy; the single header CTA; brand colours, type, logo and media; the media pipeline; the GitHub Pages workflow.

## Rollback

See [16](16-RELEASE-CHECKLIST.md) §7. In short: redeploy the previous Railway deployment (instant), or set the start command to `npm run serve:static`, or unset `SMTP_HOST` to switch off delivery only.
