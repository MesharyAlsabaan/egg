# 15 — 90-Day Organic Growth Roadmap

Day 0 = the day the changes are deployed. These are targets for activity, not promised results: rankings and traffic must be read from Search Console as they arrive.

## Days 0–14: launch and instrument

| Task | Owner | Done when |
|---|---|---|
| Deploy; run the smoke test ([14](14-REMAINING-EXTERNAL-ACTIONS.md) §1.2) | Dev | All checks pass on production |
| Cloudflare: `www` redirect, HTML cache rule, Web Analytics | Owner/dev | `www` 301s; repeat HTML TTFB from KSA < 300 ms |
| Search Console domain property, sitemap, request indexing ×4 | Owner | Sitemap "Success", 6 URLs discovered |
| GA4 ID in code, key events, DebugView test | Owner + dev | A test inquiry is visible as a key event |
| Bing Webmaster Tools | Owner | Sitemap submitted |
| Google Business Profile: claim or create (head office) | Owner | Verified listing linking to `/ar` |
| Sign off copy ([08](08-CONTENT-STRATEGY.md) §3) and the form decision | Owner | Confirmed or corrected |
| Record the Day-0 baseline | Dev | Numbers saved in [13](13-ANALYTICS-AND-SEARCH-CONSOLE.md) §5 |

## Days 15–45: trust and listings

| Task | Why |
|---|---|
| **Quality & licences** section or page, from the licences and certificates the owner supplies | The largest gap against Rahima and Al Jazira; it converts B2B buyers |
| Gram range per grade and a spec-sheet PDF (AR/EN) | Procurement teams ask for it; competitors offer downloads |
| Made in Saudi / Saudi Exports application | Official visibility to GCC buyers and a high-trust backlink |
| Riyadh Chamber directory entry checked and updated | Citation consistency |
| Apple Business Connect, Bing Places | Free coverage |
| First Search Console review: indexing of the 4 new URLs; any coverage errors | Fix before content work |

## Days 46–90: learn from data and iterate

| Task | Trigger |
|---|---|
| Export queries per page; fill the keyword table in [04](04-KEYWORD-RESEARCH.md) with real impressions | ≥ 4 weeks of data |
| Rewrite the title or description of any page with impressions but CTR < 1% | Search Console |
| Strengthen the section matching any query at positions 8–20 (heading wording, an FAQ entry) | Search Console |
| Compare inquiry events with inquiries received; decide on server-side delivery | GA4 + sales log |
| Decide on the next page using **demand + verified facts**: e.g. *Quality*, or a *Foodservice* page only if HoReCa queries show real volume and there is distinct content | Data + owner input |
| Decide on Gulfood 2027 / Saudi Food Show participation | Budget |

## Measures of success at day 90

| Measure | Target | Source |
|---|---|---|
| Sitemap URLs indexed | 6 / 6 | Search Console |
| Technical errors (check script, coverage) | 0 | `npm run check:seo`, Search Console |
| Non-brand impressions | A measurable, growing trend (no baseline exists, so no numeric target) | Search Console |
| Pages receiving impressions | `/wholesale` and `/international` in both languages | Search Console |
| Tracked inquiry hand-offs | Being recorded and reconciled with received inquiries | GA4 |
| Field CWV | "Good" at p75, once CrUX has data | Search Console |

## What not to do

- Don't create city or country pages without unique, verified content.
- Don't buy links or directory packages.
- Don't add claims (certifications, export markets, delivery coverage) before they are confirmed.
- Don't judge the new pages before 8–12 weeks.
