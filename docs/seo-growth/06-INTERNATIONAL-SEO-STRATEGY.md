# 06 — International SEO Strategy

## 1. Principles applied

- **Language targeting, not country targeting.** hreflang uses `ar` and `en`, with no region codes. There is no verified country-specific content, so `en-AE`/`ar-KW` variants would be duplicates.
- **One international page, not a page per country.** Twelve near-identical "egg supplier in [country]" pages would be doorway pages. A country page is justified only once there is unique, verified information for that market (approved exporter status, a local partner, specific products or terms).
- **Never claim what isn't confirmed.** The international page says plainly that export is subject to the destination's requirements and that eligibility is checked before any quote. It does not claim export approvals, existing export markets or delivery coverage.

## 2. Market status — four categories

| Category | Markets | Evidence |
|---|---|---|
| **1. Currently served** | Saudi Arabia (domestic B2B) | The site, packaging and owner-confirmed supply to wholesalers and distributors |
| **2. Commercially targeted** | None confirmed | The owner has not confirmed any export target |
| **3. Under evaluation (suggested priority)** | UAE → Bahrain → Qatar → Kuwait → Oman | GCC table-egg imports ≈ 187 kt in 2024, UAE ≈ 57% (IndexBox, Feb 2026). Saudi egg exports in 2023 went mainly to Yemen, **Bahrain** and Iraq, then the **UAE** (OEC). Bahrain imports ≈ 67% of its consumption (GPC CEO interview). |
| **4. Needs regulatory / eligibility checks** | All of the above | SFDA export authorisation (one public case: Naqi Water's licence). MEWA veterinary export certificate (no public procedure found). The destination's agreed health certificate (Kuwait publishes a template; the UAE applies agreed certificates and avian-influenza origin bans). |

Sources are in [research-competitors-raw.md](research-competitors-raw.md), Part B. **No market moves from category 3 to 2 until the owner confirms both the commercial intent and the regulatory route.**

## 3. Implementation

| Element | Implementation |
|---|---|
| URLs | `/ar/...` and `/en/...` subfolders on one domain; identical slugs |
| `<html lang dir>` | `ar`/`rtl`, `en`/`ltr`, set during prerender |
| hreflang | ar, en and x-default on every page, reciprocal, matching the sitemap; checked by `tools/check-seo.mjs` |
| x-default | `/ar/...` for domestic pages; **`/en/international`** for the import page |
| Canonicals | self-referencing per language; never cross-language |
| Language switch | goes to the **same page** in the other language, not to the other home page |
| Sitemap | one sitemap carrying the hreflang annotations. Separate per-language sitemaps add nothing at six URLs |
| Localised metadata | titles and descriptions written per language, not translated literally (e.g. AR "طلبات الاستيراد والمشترين الدوليين" vs EN "Saudi Egg Supplier for GCC & International Buyers") |
| Structured data | `inLanguage` per page; Organization address in the page's language |

## 4. Verification (second pass, 2026-10-19)

| Check | Result |
|---|---|
| AR/EN parity | Same 4 page types in both languages, same sections and the same facts. Every fact comes from one constant, so the languages cannot drift |
| hreflang | Reciprocal ar/en/x-default on all 6 indexable pages, identical to the sitemap (enforced by `check-seo`). Privacy pages carry hreflang too, but are noindex and outside the sitemap |
| Canonicals | Self-referencing on all 8 pages (checked) |
| Localised titles / descriptions | Unique per page and language (checked); written per language, not translated literally |
| Internal links | Nav, footer, home signpost and cross-links reach every page in both languages; the language switch keeps the page (browser-tested) |
| Sitemap | 6 URLs = the 6 indexable pages; no redirects, no noindex pages |
| Country doorway pages | None |

## 5. What would justify a country page later

All of the following:
1. The owner confirms active intent to supply that country.
2. Export eligibility for that destination is confirmed (SFDA/MEWA plus the destination authority).
3. There is something unique to say: the documents provided, shipping route and lead time, local partner, applicable terms.

Until then, international demand goes to `/en/international`. The inquiry form captures the country, so real demand by market becomes visible in the inquiries themselves.
