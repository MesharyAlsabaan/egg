# 12 — QA Test Results (release candidate)

Every test below was **executed** on 2026-10-19 against the release build (`ng build`, production, 9 prerendered routes), served by the **new production server** (`node server/server.mjs`), in Chrome via Playwright and Lighthouse. The live site was not changed.

## Summary

| Area | Test | Result |
|---|---|---|
| Build | `ng build` (budgets on) | ✅ 9 routes prerendered, no warnings or errors |
| Types | `tsc -p tsconfig.app.json --noEmit` | ✅ clean |
| SEO | `npm run check:seo` | ✅ 6 indexable pages + 2 noindex pages, 0 failures, 0 warnings |
| Server | `npm run test:server` (with the Turnstile network tests) | ✅ **23 / 23**, three consecutive runs |
| Server parity | `serve` vs the new server, all 159 built files | ✅ identical bytes and status; differences intended (§1) |
| Dependencies | `npm audit --omit=dev` | ✅ **0 vulnerabilities** (was: `serve` → `compression`, high) |
| Rendering | 8 pages × 3 viewports | ✅ 24 / 24 clean (§3) |
| Forms | Three server states × AR/EN (§4) | ✅ |
| Navigation and language | Browser test (§5) | ✅ |
| Lighthouse | 8 pages, mobile + desktop, plus an interleaved A/B (§6) | ✅ a11y / BP / SEO 100; no performance regression vs the original |
| Live hosting | HTTPS, TLS, `www` (§7) | ⚠️ 2 Cloudflare settings for the owner |
| Unit tests (Angular) | — | None exist in the project (no runner configured) |

## 1. Server

**Automated (`server/server.test.mjs`, 23 tests):**

| Group | Covers |
|---|---|
| Static | `/`, `/x/`, `/x/index.html`, query strings → 301 (relative `Location`); 8 pages 200 with HSTS, nosniff, frame options, CSP and `max-age=0`; branded 404; traversal (`/../`, `%2e%2e`, `..%2f`), `.git`, `serve.json`, `index.csr.html`, `404.html` not served; JS immutable, AVIF `image/avif`, fonts, sitemap cache; byte ranges 206 / suffix / 416; ETag 304; brotli + `Vary`; HEAD; 405; `www` → apex 301 |
| Not configured | config `{enabled:false}` with `no-store`; POST 503; half a Turnstile configuration disables delivery |
| Configured (local SMTP sink) | Valid enquiry → exactly one email to `info@familyeggs.sa`, `Reply-To` the visitor; **CR/LF header injection in the company field adds no recipients or headers**; Arabic labels; validation 400 names the fields and sends nothing; honeypot and < 3 s submissions return 200 and send nothing; wrong origin 403, wrong type 415, oversize 413, bad JSON 400, GET 405; per-IP limit (6th → 429); global cap (31st → 429) |
| Mail server down | 502 `{error:"send"}` |
| Turnstile (network) | Cloudflare's always-pass test secret → 200; always-fail → 400; missing token → 400 |

**Parity with `serve` (159 files):** identical bytes and status, except, intentionally: JS served as `text/javascript` (the current standard) rather than `application/javascript`; `serve.json`, `index.csr.html` and `404.html` are no longer publicly reachable.

**Not tested:** delivery through the real Migadu SMTP server (no credentials).

## 2. SEO output

`check-seo`: for all 6 sitemap pages, lang/dir, unique titles and descriptions, `index` robots, canonical = og:url = sitemap `<loc>`, hreflang equal to the sitemap and reciprocal, one `<h1>`, alt on every image, one parseable JSON-LD graph with Organization (+ BreadcrumbList on inner pages, FAQ ↔ visible parity on wholesale), and no broken internal links. robots.txt checked. `/ar/privacy` and `/en/privacy`: present, `noindex, follow`, self-canonical, not in the sitemap.

## 3. Rendering matrix

390×844 (mobile, touch), 820×1180 (tablet, touch), 1440×900 (desktop) × `/ar`, `/en`, `/{ar,en}/wholesale`, `/{ar,en}/international`, `/{ar,en}/privacy`: **24 / 24** with correct `lang`/`dir`, 0 px horizontal overflow, nothing outside the viewport, no control under 44 px and no link under 24 px, one `<h1>`, and no console errors, page errors or HTTP errors.

Found and fixed in this pass: the inline "Privacy notice" link in the form was 13–14 px tall. It's now padded to ≥ 24 px.

Dark mode: the site has no dark theme, so there was nothing to test.

## 4. Enquiry forms (mobile, real server)

| State | Page | Result |
|---|---|---|
| **A. Delivery not configured** | `/en/wholesale`, `/ar/international` | The button reads "Continue in WhatsApp" / «المتابعة عبر واتساب» and follows the chosen channel; empty submit → 5 / 6 errors, focus to the first; valid → `wa.me/966507488650` opened; confirmation "Your message is ready — not sent yet" / «رسالتك جاهزة — لم تُرسَل بعد»; focus to it; **event `inquiry_handoff` only, no conversion**; privacy link correct |
| **B. Delivery configured** | `/en/wholesale`, `/ar/international` | The button reads "Send enquiry"; no channel picker; server privacy text; valid → **"Your enquiry has been sent" / «تم إرسال طلبك»**; **exactly 1 email received, to `info@familyeggs.sa`**; event `wholesale_inquiry_submit` / `international_inquiry_submit` with `delivery: server`; "Send another" clears the form and restores the country default |
| **C. Mail server down** | `/en/wholesale` | "Your enquiry was not sent" (`role=alert`); **input kept**; event `inquiry_error` (`reason: server`), no conversion; the "send by WhatsApp" alternative works and is labelled "not sent yet" |
| No JavaScript | all | `<form action="mailto:info@familyeggs.sa">` in the prerendered HTML |

## 5. Navigation and language

From `/en/wholesale`, the language switch → `/ar/wholesale` (`ar`/`rtl`, Arabic title). The nav → `/ar/international` (correct `<h1>` and canonical). The "Products" anchor from an inner page → `/ar#products`, landing on the section.

Found and fixed in this pass: arriving at a `#fragment` URL left the page at the top, because the router's scroll-to-top ran after the browser's jump. Now verified at 1440 and 390 px for `#products`, `#contact` and `#automation`: the heading lands 71–72 px from the top, just under the sticky header.

The footer privacy link and its language switch work.

## 6. Lighthouse (new server, final build)

Two measurement sessions, because this machine's conditions changed between them.

**Session 1 (earlier, normal load; served by `serve`):** home page mobile performance 93 (median of 3, LCP 3.01 s, TBT 26 ms, CLS ≤ 0.032), desktop 100; inner pages mobile 90–95, desktop 100. Details in [10](10-PERFORMANCE-REPORT.md).

**Session 2 (release candidate on the new server):** another project's build (`nest build` in an unrelated repository) kept the load average at ~9–11 throughout. Lighthouse's total blocking time rose to 5–53 *seconds* on every page, including desktop runs, which have no CPU throttling. That is a property of the machine, not the site, so **absolute performance scores from this session are not meaningful.** To still detect regressions, the original build (on `serve`) and the release (on the new server) were measured **interleaved, under the same load**:

| Mobile, median | Original `9a3e82e` on `serve` | Release on the new server |
|---|---|---|
| `/ar` performance · LCP · FCP | 49 · 3.65 s · 2.75 s | 49 · 3.69 s · 2.65 s |
| `/en` performance · LCP · FCP | 50 · 3.55 s · 2.74 s | 50 · 3.57 s · 2.65 s |
| CLS | 0.000 | 0.000 |

**No regression.** FCP is ~0.1 s better, consistent with brotli compression from the new server.

Categories that do not depend on CPU (session 2, all 8 pages, mobile and desktop): **accessibility 100, best practices 100, SEO 100** on every indexable page. The privacy pages score SEO 69 because Lighthouse flags `noindex` as "not crawlable". That is intended.

Re-measure on an idle machine, or with PageSpeed Insights once the release is live, for publishable absolute numbers.

## 7. Live hosting checks (production, read-only)

| Check | Result |
|---|---|
| `http://` → `https://` | ✅ 301 (Cloudflare) |
| Certificate | ✅ Google Trust Services, valid to 2027-01-06, covers `familyeggs.sa` and `*.familyeggs.sa` |
| HTTP/2, HTTP/3 | ✅ |
| HSTS | ❌ not sent today. **The new server adds it** |
| `www.familyeggs.sa` | ❌ no DNS record. Owner: Cloudflare ([16](16-RELEASE-CHECKLIST.md) §6) |
| Minimum TLS | ⚠️ TLS 1.0 accepted. Owner: set 1.2 |
| HTML edge caching | `cf-cache-status: DYNAMIC`. Owner: cache rule with purge-on-deploy |

## 9. Every commit builds on its own

Each commit was exported with `git archive` into a clean directory and built and tested there:

| Commit | Build | Types | `check:seo` | `test:server` |
|---|---|---|---|---|
| `e91a394` chore(deps) | ✅ 3 routes | ✅ | — | — |
| `5dcf9e0` perf(hero) | ✅ 3 routes | ✅ | — | — |
| `7bfae19` fix(hosting) | ✅ 3 routes | ✅ | — | — |
| `f2661ea` feat: pages | ✅ 9 routes | ✅ | — | — |
| `a0e6a86` test(seo) | ✅ 9 routes | ✅ | ✅ 0 failures | — |
| `fdfa120` feat(server) | ✅ 9 routes | ✅ | ✅ 0 failures | ✅ 21 / 21 (+ 2 Turnstile network tests, run separately: ✅) |

"—" = not yet present at that commit.

## 8. Not tested

- The real SMTP provider, and production after deploy (smoke test in [16](16-RELEASE-CHECKLIST.md) §5).
- Safari / Firefox engines (Chrome only on this machine). Byte ranges, which Safari needs for video, are covered by the server tests.
- Google's Rich Results Test (needs a public URL). Run it on the deployed pages.
