# 02 — Baseline SEO Audit (before any change)

**Captured:** 2026-10-19, against production `https://familyeggs.sa`.
**Method:** `curl` of every URL variant, the served HTML parsed with a script, DNS lookups, and the repository at commit `9a3e82e` (the live JS bundle hash `main-677O6FZ2.js` matches a clean build of that commit, so the live site was exactly the repo HEAD).

Labels: **[Measured]** observed directly · **[Verified]** confirmed from code or config · **[Not available]** data blocked.

## 1. Architecture [Verified]

| Item | Finding |
|---|---|
| Framework | Angular 20.3 standalone, signals, `OnPush`, SCSS |
| Rendering | Static prerender (`outputMode: static`) of `/ar` and `/en`, then client hydration |
| Hosting | Railway (Nixpacks), `serve dist/.../browser`, edge region `cdg1` |
| CDN / DNS | Cloudflare (proxied); nameservers `giancarlo`/`pola.ns.cloudflare.com` |
| Email | Migadu (MX + SPF) |
| Secondary deploy | GitHub Actions → GitHub Pages workflow (project-subpath preview) |
| CMS / database | None. All copy in `src/app/core/i18n/dictionary.ts` |
| Analytics | **None** — no GA4, GTM or other tag in the code or served HTML |
| Forms | **None** — WhatsApp deep link, `tel:` and `mailto:` only |

## 2. URL and response audit [Measured]

| URL | Result |
|---|---|
| `http://familyeggs.sa` | 301 → `https://familyeggs.sa/` (Cloudflare) |
| `https://familyeggs.sa/` | **200** — an HTML stub with `<meta http-equiv="refresh" content="0; url=/ar">`, no scripts |
| `https://www.familyeggs.sa` | **DNS does not resolve** — `www` has no record |
| `/ar`, `/en` | 200, prerendered, ~1.0–1.2 s TTFB |
| `/ar/` (trailing slash) | **200** — duplicate of `/ar` (canonical tag mitigates it) |
| `/nonexistent` | 404, generic `serve` error page |
| `/robots.txt` | 200, `Allow: /`, `Sitemap:` line present |
| `/sitemap.xml` | 200, **one URL only: `https://familyeggs.sa/`** — the redirect stub |

## 3. On-page [Measured]

| Check | `/ar` | `/en` |
|---|---|---|
| `<html lang dir>` | `ar` `rtl` ✅ | `en` `ltr` ✅ |
| Title | unique ✅ | unique ✅ |
| Meta description | ✅ (Arabic) | ✅ but 211 characters (truncated in results) |
| Canonical | self ✅ | self ✅ |
| hreflang | ar / en / x-default→ar ✅ | same ✅ |
| `<h1>` | 1 ✅ | 1 ✅ |
| Headings | 6 × h2, 2 × h3, logical ✅ | same ✅ |
| Images | 7, all with alt ✅ | same ✅ |
| Open Graph / Twitter | complete ✅ | complete ✅ |
| JSON-LD | 1 × Organization (Arabic only, also on `/en`) | same |
| Words of body copy | ~284 | ~312 |
| Content visible without JS | Yes — full copy in prerendered HTML ✅ | ✅ |

## 4. Headers [Measured]

| Asset | Cache-Control | Issue |
|---|---|---|
| HTML | none; Cloudflare `DYNAMIC` | Every request goes to Railway in Paris: TTFB ≈ 1.0–1.9 s |
| Hashed JS/CSS (`main-*.js`) | `max-age=14400` (4 h) | Content-hashed, should be immutable for a year |
| Media, fonts | `max-age=14400` | Re-validated every 4 h |
| `.avif` images | `content-type: application/octet-stream` | **Wrong MIME type** for the LCP image format |
| Security headers | none (no HSTS, nosniff, referrer policy, frame options) | |

Cloudflare's email obfuscation rewrites `mailto:` links to `/cdn-cgi/l/email-protection#…` and injects a decoder script.

## 5. Findings, prioritised

| Pri | Finding | Impact |
|---|---|---|
| **P0** | Sitemap lists only `/`, a redirect stub; neither real page is in it | Search engines are pointed at a non-canonical URL and given no indexable pages |
| **P1** | One page per language; no page targets wholesale, distributor or import intent | The site can rank for little beyond the brand name |
| **P1** | No inquiry form; no conversion tracking of any kind | Leads are not measurable; non-WhatsApp buyers (most importers) have no structured path |
| **P1** | Root `/` served as a 200 meta-refresh page; `/ar/` duplicates `/ar` | Extra hop; duplicate URL variants |
| **P1** | Hashed assets cached 4 h; AVIF served with the wrong MIME type | Repeat-visit performance; LCP image robustness |
| **P1** | No security headers | Best-practice gaps |
| **P1** | `www` does not resolve | Anyone typing `www.familyeggs.sa` gets a DNS error |
| **P2** | Organization JSON-LD Arabic-only on the English page; no WebSite / BreadcrumbList | Weaker entity signals |
| **P2** | HTML not edge-cached; Railway region is Paris | ~1 s TTFB for Saudi visitors |
| **P2** | No certifications, licences or quality page | Competitors (Rahima, Al Jazira) lead on trust signals |

## 6. Search Console, analytics, rankings [Not available]

No Search Console, GA4 or Business Profile access was available, and there is no tracking on the site. Semrush returned `no_api_units`; the PageSpeed Insights API returned a quota error. **There is no organic baseline for impressions, clicks, positions or field Core Web Vitals.** See [13](13-ANALYTICS-AND-SEARCH-CONSOLE.md) for how to establish one.
