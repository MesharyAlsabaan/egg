# 07 — Website Architecture

## 1. Before → after

```
Before                      After
/        (meta refresh)     /                     301 → /ar
/ar      one long page      /ar                   home (unchanged sections + new "commercial supply" signpost)
/en      one long page      /en
                            /ar/wholesale         wholesale supply in KSA          ← new
                            /en/wholesale
                            /ar/international     importers / GCC & international  ← new
                            /en/international
                            /ar/privacy           privacy notice (noindex, not in sitemap) ← new
                            /en/privacy
```

## 2. Candidate sections from the brief: decisions

| Candidate | Decision | Reason |
|---|---|---|
| Homepage | Kept, plus a signpost section | Owner-approved design preserved |
| About Family Eggs | **Not a separate page** | The verified "about" content is three facts (60 years, family, Marat), already in the heritage and facility sections. A standalone page would be thin |
| Products | **Not a separate page** | Six grades, two packs and four specs fit on the home page. Without gram weights or photos per grade, a separate page would just repeat them. Revisit when weights or a spec PDF exist |
| Production & facilities | Home sections (automation, facility) | Same reason |
| Quality & food safety | **Deferred, blocked on facts** | The highest-value next page ([05](05-COMPETITOR-ANALYSIS.md)), but it needs confirmed licences or certifications. Nothing can be written without them |
| Wholesale supply | ✅ **`/wholesale`** | Distinct commercial intent; enough verified facts for a useful page |
| Distributors & partners | Merged into `/wholesale` | Same offer (cartons, grades, delivery). Separate pages would cannibalise each other |
| International inquiries | ✅ **`/international`** | Distinct audience, language preference and information needs |
| Contact | Home section, repeated on both inner pages | One-tap channels everywhere |
| FAQ | On `/wholesale` | Answers come from verified facts. A standalone FAQ page would duplicate them |

## 3. Every new page: required elements

| | `/wholesale` | `/international` |
|---|---|---|
| Audience | Distributors, wholesalers, retail, HoReCa, institutional (KSA) | Importers and distributors outside KSA |
| Search intent | Find a wholesale egg supplier in KSA | Find a Saudi egg supplier for import |
| Unique content | Buyer segments, supply facts, ordering steps, FAQ | Eligibility note, producer facts, what to send |
| Internal links | nav, footer, home signpost, cross-link to `/international` | nav, footer, home signpost, cross-link to `/wholesale` |
| Metadata | unique title, description, canonical, hreflang, OG | same |
| Conversion | Inquiry form (preset: distributor) + WhatsApp, phone, email | Inquiry form (preset: importer; country required) + channels |
| Structured data | WebPage, BreadcrumbList, FAQPage | WebPage, BreadcrumbList |

## 4. Navigation

Header and footer: **Production · Products · Wholesale · International buyers · Contact**.
- "Production", "Products" and "Contact" are home-page anchors. On the home page they scroll in place; on inner pages they are plain links to `/{lang}#section`, so they work without JavaScript.
- "The farm" was dropped from the nav to make room; the section is still on the home page, between heritage and the new signpost.
- The desktop nav now appears from **1100px** (was 900px). Five Arabic labels need the width; below that the existing burger menu is used. Tested: no wrapping at 1100px.
- The current page is marked with `aria-current="page"` and the existing orange underline.
- A visible breadcrumb (Home / page) opens each inner page, mirrored in BreadcrumbList.

## 5. Code structure

```
src/app/
  core/pages.ts               page registry: keys, slugs, URLs, x-default rule
  core/page.ts                setupPage(): language + SEO wiring for any routed page
  core/seo.service.ts         head tags + JSON-LD per page
  core/analytics.service.ts   event tracking (inert until a GA4 ID is set)
  pages/wholesale-page.component.ts
  pages/international-page.component.ts
  pages/privacy-page.component.ts
server/server.mjs  server/inquiry.mjs  server/server.test.mjs
  sections/partners.component.ts      home signpost
  shared/page-intro.component.ts      inner-page opening band + breadcrumb
  shared/inquiry-form.component.ts
public/serve.json  public/sitemap.xml  public/404.html
tools/check-seo.mjs
```

To add a page: add it to `core/pages.ts`, `app.routes.ts`, the dictionary's `pageMeta` (plus its copy), and `public/sitemap.xml`. `npm run check:seo` then fails if a sitemap URL has no prerendered page, or if that page's canonical or hreflang disagree with the sitemap. It cannot detect a routed page that was left out of the sitemap, so do that step by hand.
