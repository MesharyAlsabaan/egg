# 03 — Technical SEO: Audit and Implementation

What was checked, what was changed, and how it is now enforced. Baseline evidence is in [02](02-BASELINE-SEO-AUDIT.md).

## 1. Indexable URL set (after)

| URL | Purpose | x-default |
|---|---|---|
| `/ar`, `/en` | Home | `/ar` |
| `/ar/wholesale`, `/en/wholesale` | Wholesale supply in Saudi Arabia | `/ar/wholesale` |
| `/ar/international`, `/en/international` | Importers / GCC & international buyers | **`/en/international`** — a buyer whose language we do not serve is far more likely to read English |

All six are prerendered to static HTML. Slugs are identical in both languages, so the language switch keeps you on the same page.

## 2. Changes

### Sitemap — `public/sitemap.xml` [Implemented]
- Six canonical URLs, each with its full `xhtml:link` hreflang set (ar, en, x-default) and a `<lastmod>`.
- The root `/` is no longer listed (it is a 301).

### Production server — `server/server.mjs` [Implemented]
`npm run serve:prod` (the Railway start command) now runs a small Node server in place of `serve`. It reproduces everything `serve` + `public/serve.json` did, and adds the enquiry API ([09](09-B2B-CONVERSION-STRATEGY.md) §2). Verified against `serve` on all 159 built files: identical bytes and status. The only intended differences are listed in [12](12-QA-TEST-RESULTS.md) §1. `public/serve.json` stays, so the rollback start command `npm run serve:static` behaves the same.

### Redirects and URL hygiene [Implemented]

| Request | Before | After |
|---|---|---|
| `/` | 200 meta-refresh stub | **301 → `/ar`** (relative `Location`, so no http hop behind Cloudflare) |
| `/ar/`, `/en/wholesale/` | 200 duplicate | **301 → no trailing slash** |
| `/ar/index.html` | 200 duplicate | **301 → `/ar`** |
| `www.familyeggs.sa/*` reaching the origin | n/a (no DNS) | **301 → `https://familyeggs.sa/*`** (a backstop; the edge should do it) |
| `/serve.json`, `/index.csr.html`, `/404.html` | 200 / 301 | **404** (build internals not served) |
| unknown path | generic `serve` 404 | **404 with a branded, bilingual, `noindex` page** (`public/404.html`) |

`main.ts` still contains the browser-language redirect for the root. In production it never ran (the stub had no scripts), and it now never sees `/` either. It is kept for the GitHub Pages preview, where there is no `serve.json`.

### Head tags — `src/app/core/seo.service.ts` [Implemented]
Per page and language, written during prerender: title, description, `robots` (`index, follow, max-image-preview:large`), canonical, hreflang ×3, `og:*` (type, site_name, title, description, url, image, alt, locale, locale:alternate) and `twitter:*`.

### Structured data [Implemented]
One `@graph` per page, replacing the old static Arabic-only block in `index.html`:

| Node | Where | Notes |
|---|---|---|
| `Organization` | all pages | Arabic name + English `alternateName`; addresses in the page's language; `telephone` is the landline; two `ContactPoint`s (sales = WhatsApp line, customer service = landline). The fax number was dropped: the owner asked for no fax (`docs/DELIVERY-REPORT.md` §7) and it had already been removed from the visible page, but it lingered in the JSON-LD. `areaServed: SA` was dropped because no delivery coverage is confirmed |
| `WebSite` | all pages | per language, `inLanguage` |
| `WebPage` | all pages | linked to WebSite, Organization and (inner pages) breadcrumb |
| `BreadcrumbList` | inner pages | Home → page; matches the visible breadcrumb |
| `FAQPage` | wholesale | mirrors the six visible Q&As exactly; the check script fails if they diverge |

**Deliberately not added:**
- `Product` — Google requires `offers`, `review` or `aggregateRating` for product rich results, and no prices, ratings or reviews are published. Adding Product without them only produces Search Console warnings.
- `LocalBusiness` — the office and farm addresses are verified, but opening hours and public-facing visit details are not. Revisit when the Business Profile is set up ([14](14-REMAINING-EXTERNAL-ACTIONS.md)).
- Ratings, reviews, certifications, awards — none exist in approved sources.

**Rich-result expectation:** Since 2023 Google shows FAQ rich results only for well-known government and health sites, so `FAQPage` is not expected to produce a visual result. It still describes the page accurately for search and answer engines. Breadcrumb rich results are eligible.

### Headers — `public/serve.json` [Implemented]
| Asset | Cache-Control |
|---|---|
| Hashed `*.js` / `*.css` | `public, max-age=31536000, immutable` |
| `fonts/`, `media/`, `brand/` (stable names, not hashed) | `public, max-age=604800, stale-while-revalidate=86400` |
| HTML | `public, max-age=0, must-revalidate` |
| `/api/*` | `no-store` |
| Text assets | gzip / brotli, `Vary: Accept-Encoding`; ETag + 304; byte ranges (206) for video |
| `sitemap.xml`, `robots.txt` | `public, max-age=3600` |

Also: `Content-Type: image/avif` for `.avif` (was `application/octet-stream`); `Content-Security-Policy: frame-ancestors 'self'; base-uri 'self'; object-src 'none'; form-action 'self' mailto:` (only directives that cannot break scripts or styles; a script CSP would need `'unsafe-inline'` for Angular's inlined critical CSS and event replay, which would add little); `X-Content-Type-Options: nosniff`; `Referrer-Policy: strict-origin-when-cross-origin`; `X-Frame-Options: SAMEORIGIN`; `Permissions-Policy` denying camera, mic, geolocation and payment; `Strict-Transport-Security: max-age=31536000` (no `includeSubDomains`, no preload; reversible).

> **Media caching caveat:** media file names are not content-hashed. If `tools/build-media.py` regenerates a file under the same name, returning visitors may see the old one for up to 7 days. If that matters, purge the Cloudflare cache after a media rebuild.

### Robots — `public/robots.txt` [Verified, unchanged]
`Allow: /` plus the Sitemap line. All JS, CSS, fonts and media needed for rendering are crawlable.

### Rendering [Verified]
All copy, headings, links, meta and JSON-LD are present in the prerendered HTML before any JavaScript runs. A crawler that never executes JS gets the complete page. No framework change was needed.

## 3. Enforcement — `tools/check-seo.mjs` [Implemented]

`npm run build && npm run check:seo`. For every sitemap URL it fails on: missing file; wrong `lang`/`dir`; missing or duplicate title/description; missing or `noindex` robots; canonical or `og:url` ≠ the sitemap `<loc>`; an hreflang set that differs from the sitemap or isn't self-referencing; hreflang targets outside the sitemap; ≠ 1 `<h1>`; `<img>` without `alt`; ≠ 1 JSON-LD block, JSON that doesn't parse, no Organization, inner pages without BreadcrumbList, FAQ questions not visible on the page; broken internal links. robots.txt is checked too. It warns on titles over 70 characters and descriptions over 200.

Result on the new build: **6 pages, 0 failures, 0 warnings** ([12](12-QA-TEST-RESULTS.md)).

## 4. Still open (outside the codebase)

| Item | Owner action |
|---|---|
| `www.familyeggs.sa` doesn't resolve | Cloudflare: add a proxied `www` record plus a 301 Redirect Rule to the apex |
| HTML TTFB ≈ 1 s (Railway region `cdg1`, HTML not edge-cached) | Cloudflare Cache Rule for HTML with a short edge TTL, and/or move the Railway service to a region closer to KSA |
| Cloudflare email obfuscation | Optional; it works, but the injected script and rewritten links are noise. Leave it unless it causes problems |

Details in [14](14-REMAINING-EXTERNAL-ACTIONS.md).
