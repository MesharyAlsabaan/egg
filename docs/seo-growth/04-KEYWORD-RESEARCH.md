# 04 — Keyword Research and Keyword-to-Page Map

## Data status — read first

**No keyword volumes, difficulty scores or rankings in this file are measured.**

| Source | Result (2026-10-19) |
|---|---|
| Semrush (connected account) | Every call failed: `no_api_units`, "active subscription, but not enough API units". No data returned for any database. Trace IDs are kept in `research-keywords-semrush-attempt.md` |
| Google Search Console | No access |
| Google Keyword Planner | No access |
| PageSpeed / CrUX API | Daily quota exhausted |

So the clusters below are **hypotheses ranked by commercial relevance**, not by volume. Each is mapped to one page so that no two pages target the same intent. Section 4 is the plan to replace these hypotheses with measured data.

## 1. Clusters and page mapping

| # | Cluster | Representative queries (AR / EN) | Intent | Audience | Market | Page |
|---|---|---|---|---|---|---|
| 1 | **Wholesale supply** | توريد بيض بالجملة · مورد بيض بالجملة · بيض بالجملة · شراء بيض بالجملة / wholesale eggs Saudi Arabia · bulk egg supplier · fresh eggs wholesale | Commercial / transactional | Wholesalers, retailers | KSA | `/ar/wholesale` · `/en/wholesale` |
| 2 | **Distributor sourcing** | موزع بيض · توريد بيض للموزعين / egg distributor Saudi Arabia | Commercial | Distributors | KSA | `/ar/wholesale` (distributor card, carton supply, form preset to distributor) |
| 3 | **Foodservice supply** | توريد بيض للمطاعم · توريد بيض للفنادق / egg supplier for hotels · restaurants | Commercial | HoReCa, caterers | KSA | `/ar/wholesale` (HoReCa card). **No separate page** — same offer, same facts, would be thin |
| 4 | **Producer / manufacturer** | مصنع بيض في السعودية · شركات إنتاج البيض في السعودية · مزرعة بيض · مزارع البيض في الرياض / egg manufacturer Saudi Arabia · Saudi egg producer · egg farm Riyadh | Commercial investigation | All B2B buyers | KSA | Home `/ar` · `/en` (production, figures, farm) |
| 5 | **Table eggs, specs** | بيض مائدة · بيض طازج · بيض كرتون 360 · طبق 30 بيضة / table eggs supplier · egg grades XL L M | Informational → commercial | Procurement | KSA | Home (products) and wholesale (specs, FAQ) |
| 6 | **Import / export** | تصدير البيض من السعودية · مورد بيض سعودي / Saudi egg exporter · egg supplier GCC · egg supplier UAE / Dubai · egg supplier Middle East | Commercial | Importers, GCC distributors | GCC, intl | `/en/international` (primary) · `/ar/international` |
| 7 | **Brand** | بيض العائلة · Family Eggs | Navigational | Everyone | All | Home |

**Not targeted, on purpose:**
- Price queries (سعر كرتون البيض، سعر طبق البيض). No prices are published, and a page that ranks for a price without giving one disappoints the searcher.
- Recipes, health and nutrition. Consumer traffic with no B2B value.
- Per-city pages ("مورد بيض جدة") and per-country pages ("egg supplier Kuwait"). There is no verified city coverage or country-specific information, so these would be doorway pages.

## 2. How each target page carries its cluster

| Page | Title | H1 | Supporting copy |
|---|---|---|---|
| `/ar/wholesale` | توريد بيض بالجملة في السعودية \| بيض العائلة للتجارة | توريد بيض المائدة بالجملة في السعودية | الموزعون وتجار الجملة · الأسواق · المطاعم والفنادق وشركات التموين · المشتريات المؤسسية; FAQ |
| `/en/wholesale` | Wholesale Egg Supplier in Saudi Arabia \| Family Eggs | Wholesale table eggs, supplied from a Saudi farm | distributors, supermarkets, restaurants, hotels, caterers, institutional |
| `/en/international` | Saudi Egg Supplier for GCC & International Buyers \| Family Eggs | Saudi table eggs for importers and distributors abroad | GCC, importers, Incoterms, documents |
| `/ar/international` | طلبات الاستيراد والمشترين الدوليين \| بيض العائلة للتجارة | بيض مائدة سعودي للمستوردين والموزعين في الخارج | دول الخليج، المستوردين |
| `/ar`, `/en` | unchanged (owner-approved) | unchanged | figures, production, products, farm |

Phrases are worked into headings and copy where a buyer would naturally use them. There is no keyword repetition for its own sake.

## 3. Competitive picture (qualitative)

From [05](05-COMPETITOR-ANALYSIS.md): no Saudi or GCC egg producer reviewed has a dedicated wholesale, distributor or export page. Competitor sites are consumer- and brand-led. That means the B2B intents in clusters 1, 2, 3 and 6 are probably contested mainly by directories and marketplaces rather than by producers. **This is an inference from site structure, not a measured SERP.** Confirm it with the plan below.

## 4. Measurement plan to replace hypotheses with data

1. **Week 1:** verify Search Console for the domain property, submit the sitemap, and request indexing of the four new URLs. ([13](13-ANALYTICS-AND-SEARCH-CONSOLE.md))
2. **Week 1, if budget allows:** top up Semrush API units, then re-run the seed list in `research-keywords-semrush-attempt.md` against the `sa` and `ae` databases. Record volume, KD and intent, and fill the table above. Alternatively, Google Keyword Planner is free with a Google Ads account (no spend needed).
3. **Weeks 4–8:** in Search Console → Performance, filter by page (`/wholesale`, `/international`) and export queries. Real impressions replace the hypotheses. Look for:
   - queries at positions 4–20 with impressions (improve the matching section);
   - queries mapping to two pages (cannibalisation: tighten one page's wording);
   - high-impression, low-CTR queries (rewrite the title or description).
4. **Quarterly:** re-check the map and add a page only when a cluster shows real demand **and** there is verified content to put on it (see the roadmap in [15](15-90-DAY-GROWTH-ROADMAP.md)).
