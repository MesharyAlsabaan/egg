# 10 — Performance Report

> **Release-candidate update (2026-10-19, second pass).** The release now runs on the new production server, which adds brotli/gzip, ETag and byte ranges. It was re-measured against the original build **interleaved under identical conditions**: mobile performance 49 vs 49 (`/ar`) and 50 vs 50 (`/en`), LCP equal within 0.04 s, FCP 0.1 s better. **No regression.** The absolute numbers in that session were depressed by an unrelated build hogging the CPU; see [12](12-QA-TEST-RESULTS.md) §6. The figures below are from the first, normal-load session and remain the reference.

## 1. Method

- **Field data (real users): not available.** The PageSpeed Insights / CrUX API returned a daily-quota error, and a site with low traffic usually has no CrUX record anyway. Field LCP / INP / CLS at p75 must come from Search Console once traffic accrues ([13](13-ANALYTICS-AND-SEARCH-CONSOLE.md)).
- **Lab data:** Lighthouse 12.2.1 in headless Chrome on the same machine, same conditions:
  - **base** = a clean build of the original commit `9a3e82e`;
  - **new** = this work;
  - both served locally by the same `serve`, so the comparison isolates code changes from network and hosting;
  - mobile = Lighthouse default (simulated slow 4G, 4× CPU), **median of 3 runs**; desktop = `--preset=desktop`, 1 run.
- **Live** runs against `https://familyeggs.sa` (1 run each) show the real network cost of hosting.
- Every run is in [lighthouse-runs.csv](lighthouse-runs.csv).

## 2. Results — home page

| | Perf | A11y | BP | SEO | LCP | FCP | TBT | CLS | Weight |
|---|---|---|---|---|---|---|---|---|---|
| base `/ar` mobile (median 3) | 92 | 100 | 100 | 100 | 3.16 s | 1.96 s | 20 ms | 0.000 | 3,891 KB |
| **new `/ar` mobile (median 3)** | **93** | 100 | 100 | 100 | **3.01 s** | 1.95 s | 27 ms | 0.000 | 3,910 KB |
| base `/en` mobile | 92 | 100 | 100 | 100 | 3.16 s | 1.96 s | 20 ms | 0.032 | 3,891 KB |
| **new `/en` mobile** | **93** | 100 | 100 | 100 | **3.02 s** | 1.95 s | 26 ms | 0.032 | 3,910 KB |
| base / new `/ar`, `/en` desktop | 100 / 100 | 100 / 100 | 100 | 100 | 0.65 s | 0.44 s | 0 | ≤ 0.015 | 5.2 MB |
| live `/ar` mobile (1 run) | 99 | 100 | 100 | 100 | 1.85 s | 1.20 s | 18 ms | 0.000 | — |
| live `/en` mobile (1 run) | 81 | 100 | 100 | 100 | 3.86 s | 2.51 s | 20 ms | 0.000 | — |
| live server response (all live runs) | | | | | | | | | **316–366 ms** TTFB |

The two live mobile runs differ widely (LCP 1.85 s vs 3.86 s) for the same code. That is network and server variance. One run each is not a reliable measure; it shows why edge-caching HTML matters.

## 3. Results — new pages

| Page | Mobile perf | LCP | Desktop perf | Weight (mobile) |
|---|---|---|---|---|
| `/ar/wholesale` | 90 | 3.36 s | 100 | 347 KB |
| `/en/wholesale` | 95 | 2.71 s | 100 | 347 KB |
| `/ar/international` | 95 | 2.72 s | 100 | 347 KB |
| `/en/international` | 95 | 2.71 s | 100 | 346 KB |

The inner pages weigh about 350 KB, with no video. Their LCP is the shared hero poster, which `index.html` already preloads. A11y, Best Practices and SEO are 100 on every page after the contrast fix (§4).

## 4. Changes that affect performance

| Change | Effect | Evidence |
|---|---|---|
| **Hero film starts after `load`** instead of from `autoplay` in the prerendered HTML | The 3.5 MB (mobile) / 4.9 MB (desktop) clip no longer downloads alongside the poster (the LCP image), fonts and JS | Request waterfall: the `.mp4` previously started at 65 ms, in parallel with the poster; now it starts after the load event. Observed (unthrottled) load event 391 ms → 91 ms. Still autoplays for visitors without reduced-motion or data-saver (tested); reduced-motion still gets a paused film with a play button. The simulated LCP barely moves (3.16 → 3.01 s) because Lighthouse's simulation doesn't charge the film to LCP, but on a real constrained connection it was taking bandwidth from the poster |
| Hashed JS/CSS `immutable` for 1 year (was 4 h) | Repeat visits skip revalidation of ~110 KB of JS/CSS | `serve.json`; headers verified locally |
| Media/fonts 7 days + SWR (was 4 h) | Fewer revalidations | Same |
| `.avif` served as `image/avif` | Correct MIME type for the LCP format; avoids content sniffing (now disabled by `nosniff`) | Same |
| `/` → `/ar` as a server 301 (was a 200 HTML meta refresh) | One fewer HTML document and parse for root visitors | `curl` |
| Colour contrast `--olive-deep` on the dim surface | A11y 96 → 100 on the English pages | Lighthouse re-run |

## 5. Against Core Web Vitals targets

| Metric (p75 target) | Lab status | Comment |
|---|---|---|
| LCP ≤ 2.5 s | Desktop 0.65 s ✅. Mobile simulated slow 4G ≈ 2.7–3.0 s ⚠️ | The simulated critical path is ~250 KB: HTML 14 KB, two fonts 51 KB, poster 85 KB, logo 14 KB, JS ~100 KB. Further cuts would mean a lower-quality poster or dropping the brand font, which the brief rules out for a synthetic score. **The biggest real-world lever is TTFB** (§6) |
| INP ≤ 200 ms | TBT 14–27 ms (lab proxy) ✅ | Field INP needs real users |
| CLS ≤ 0.1 | 0.000–0.032 ✅ | |

## 6. Recommended next steps (not code)

1. **Cloudflare cache rule for HTML.** Live TTFB is 316–366 ms in these runs and up to 1–1.9 s in `curl` from this location, because HTML is `DYNAMIC` (uncached) and served from Railway in Paris. Edge caching serves KSA visitors from a nearby PoP. This is likely the single largest real-user LCP gain.
2. Move the Railway service closer to KSA, if the plan allows.
3. Re-check field CWV in Search Console 4–8 weeks after deploy.

Media files (`hero-*.mp4`, posters) were **not** re-encoded: they are owner-approved masters from `tools/build-hero.py` / the supplied package, and the pipeline's documented settings already target size.
