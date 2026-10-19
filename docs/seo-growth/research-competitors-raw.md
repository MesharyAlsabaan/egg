# Family Eggs (بيض العائلة للتجارة): Competitor Benchmark, Market Context and External Platforms

Research date: 2026-10-19. I fetched the sites directly (raw HTML via curl, plus page summaries). Certifications are recorded only as **"claimed on their site"**. No claim here has been independently verified. Anything I could not verify is marked as such.

---

## 0. Baseline: familyeggs.sa (as observed 2026-10-19)

- **URLs:** `/` meta-refreshes to `/ar`. Separate `/ar` and `/en` URLs exist.
- **hreflang:** ar, en and x-default (→ /ar) are present. Self-canonicals are correct.
- **Structure:** One page with anchors for Production, Products, The farm and Contact. There are no separate product, B2B, export, quality or about URLs.
- **Products:** Six sizes (XX, XL, L1, L2, M, S). Packs are a 30-egg tray and a 360-egg carton (12 trays). Specs: 3-month shelf life, storage at 4–18 °C, 75–80% RH. Capacity claim: 430k eggs and 1,200 cartons per day.
- **Conversion:** A "Request a quote" button opens WhatsApp (+966 50 748 8650). Phone and email are also listed. There is no form.
- **Trust signals:** No certifications are displayed.
- **Structured data:** One `Organization` JSON-LD block with address, farm `location`, a sales `contactPoint`, `areaServed: SA` and languages ar/en. There is no `Product`/`Offer` or `FAQPage` markup.

---

## Part A: Competitor benchmarking

### A1. Verification of the names suggested in the brief

| Company | Table eggs? | Evidence |
|---|---|---|
| Al Watania Poultry (KSA) | **Yes** | Site states 1,500,000 eggs/day ([alwatania.sa/en/home](https://alwatania.sa/en/home/)). Market share 19% by volume ([Argaam, 30 Jan 2025, citing Euromonitor via Entaj prospectus](https://www.argaam.com/en/article/articledetail/id/1786172)) |
| Rahima Eggs / Rahima Poultry Farms (KSA, Eastern Province) | **Yes** | 18.5% share ([Argaam](https://www.argaam.com/en/article/articledetail/id/1786172)). [rahimaeggs.com](https://www.rahimaeggs.com/) |
| AlGharbia Farms (KSA) | **Yes** | 4% share ([Argaam](https://www.argaam.com/en/article/articledetail/id/1786172)). Retail listing "Algharbia White Eggs Large x30" ([Carrefour KSA](https://www.carrefourksa.com/mafsau/en/c/FKSA1630402)) |
| Al Kadi Agri & Poultry (KSA, Taif) | **Yes** | 3.5% share ([Argaam](https://www.argaam.com/en/article/articledetail/id/1786172)). No official website found |
| Fakieh Poultry Farms (KSA) | **Yes** | 3.5% share. Table eggs listed at [fakiehfarms.com/products](https://fakiehfarms.com/products/) |
| Qaryah / Al-Qaryah (KSA, est. 2022) | **Yes** | Table eggs and liquid eggs ([Gulfood exhibitor page](https://www.gulfood.com/exhibitors/qaryah)). [qaryah.sa](https://qaryah.sa/en/products/) |
| Arabian Farms, "SAHA" brand (UAE HQ, Al Kharj KSA office) | **Yes** | Egg range at [arabianfarms.com/our-product-eggs.php](https://arabianfarms.com/our-product-eggs.php). Contact page lists Dubai, Al Ain and Al Kharj (KSA) |
| Naqi Water (KSA) | Reported SFDA licence to export table eggs | [Decypha/Mubasher](https://www.decypha.com/en/news/details/Naqi-Water-fuels-regional-expansion-plans-via-new-license/21563829?L=EN). Only one source; check the Tadawul disclosure |
| Tanmiah Food Co. (KSA) | **No evidence of table eggs** | Broiler meat, feed, day-old chicks and hatching eggs ([WATTPoultry profile](https://www.wattagnet.com/top-poultry-companies/company/tanmiah-food-group)) |
| Golden Chicken Farms / Arasco (KSA) | **Not verified** | Appears only in poultry-meat share data. arasco.com returned HTTP 403. The goldenchicken.com.sa homepage HTML contained many unrelated gambling outbound links (observed 2026-10-19) |
| HADCO (KSA) | **Not verified** | hadco.sa resolves to a hosting "suspended" page |
| Al Ghadeer, Al Wadi, Ovo (KSA) | **Not verified** | No credible source found. Excluded |
| Al Jazira Poultry Farm (UAE) | **Yes** | [aljazirapoultry.com](https://aljazirapoultry.com/) |
| Al Rawdah (UAE) | Broiler-integrated; **table eggs not verified** | [Food Business MEA](https://www.foodbusinessmea.com/al-rawdah-expands-integrated-poultry-operations-in-uae/) |
| Modern Poultry Farms / Dana Eggs (Oman) | **Yes** | Described as Oman's largest egg producer ([GulfTalent](https://www.gulftalent.com/companies/modern-poultry-farms-saoc-mpf)). **No official website found** |
| Gulf International Poultry Farm (Oman, Ibri) | **Yes** | 1.2M layers, about 350M eggs/yr, inaugurated Dec 2022 ([Times of Oman](https://timesofoman.com/article/124082-gulf-international-poultry-farm-to-open-in-ibri-on-thursday)). No brand site found |
| A'Saffa (Oman) | Mainly broilers. A table-egg project was only studied (2012) | [Gulfbase](https://gulfbase.com/news/a-saffa-foods-in-major-expansion-spree/196577) |
| Kuwait United Poultry (KUPCO) | **Yes** | Fresh eggs page at [kupco.net/fresh-eggs](https://kupco.net/fresh-eggs/) |
| Arab Qatari Co. for Poultry Production, "Al Waha" (Qatar) | **Yes** | Table eggs; layer expansion to about 110M eggs/yr ([Hassad](https://www.hassad.com/?p=5892), [WATTPoultry](https://www.wattagnet.com/top-poultry-companies/company/the-arab-qatari-co-for-poultry-production)). Note: alwaha.qa is a **different** company (fruit and vegetables). No official poultry site found |
| Delmon Poultry (Bahrain) | Broilers; **no table eggs found** | [WATTPoultry](https://www.wattagnet.com/top-poultry-companies/company/delmon-poultry-co) |
| General Poultry Company, GPC (Bahrain) | **Yes**, the main local table-egg producer | [gpc.bh](https://www.gpc.bh/). [Ghitha](https://www.ghitha.bh/generalpoultrycompany) (owner) |

### A2. Website benchmark (8 most relevant, fetched 2026-10-19)

| | Rahima (KSA) | Al Watania (KSA) | Fakieh (KSA) | Qaryah (KSA) | Arabian Farms (UAE/KSA) | Al Jazira (UAE) | KUPCO (Kuwait) | GPC (Bahrain) |
|---|---|---|---|---|---|---|---|---|
| URL | rahimaeggs.com | alwatania.sa | fakiehfarms.com | qaryah.sa | arabianfarms.com | aljazirapoultry.com | kupco.net | gpc.bh |
| AR/EN | EN main; AR on a **separate subdomain** (arabic.rahimaeggs.com) | AR default `/`; EN at `/en/` | EN `/`; AR `/ar/` | `/ar/` and `/en/` | EN; "ARB" toggle | EN `/`; AR `/ar/` | EN `/`; AR `/ar/` | EN; AR homepage |
| hreflang | **None** | ar + en | ar + en | ar + en + en-US | **None** | ar + en | ar + en + en-US | (not checked in raw HTML) |
| JSON-LD | `LocalBusiness` + `WebSite` | Yoast graph: `Organization`, `WebSite`, `BreadcrumbList` | Yoast `WebPage`/`WebSite` (no Organization) | Yoast `WebSite`/`WebPage` | **None** | Yoast `WebPage`/`WebSite` | **None** | (not checked) |
| Main pages | About, Products, Liquid Eggs, Quality, Customers, News, FAQ, Contact | Products, Recipes, Production, About (Vision, Facts & figures), CSR, News, Online store | About, Facilities, Products, Feeds, Locations, Recipes, Careers, Contact | Who we are, Farms, Products, Branches, Careers | Eggs, Chicken, Farm, Store locator, Contact | Our Story, Products (Regular, Enriched, Organic, Pasteurized & Smoked), About Eggs, Food Safety Accreditations, Blog, Events, Contact | About, Fresh Eggs, Fresh/Frozen products, Our Farm, News, Gallery, Order online | About (incl. Food Safety Policy), Products, Healthy Living (FAQ, myths), News, Contact, Careers |
| B2B / export page | None dedicated; says "other packing options and sizes available for industrial use" plus a Liquid Eggs page | None; has a consumer online store (order.alwatania.sa) | None for eggs (feed-sales contact only) | None; liquid eggs and powder framed for "food industry and commercial kitchens" (liquid page says "soon") | None; B2B-style contact form with "business type" and "product interest" fields | None | None; consumer ordering site (orderkupco.net) | None |
| Product presentation | Shell eggs (packs shown only as images: "30", "2x6"); liquid eggs chilled/frozen | No egg SKUs listed | Loose eggs Jumbo, XL, L, M, S; 30-tray L/M; 12-tray L | White: Jumbo, XL, L, M, 30x12, 24x15, 60x6. Brown: 30x12, 30x15, 60x6 | 7 functional lines (Vit E, Vit D, Lutein, Pasteurized, Selenium, Omega-3, Fresh); spec-sheet PDF | 4 lines plus catalogue PDF | Brown and white by weight band: 40/50, 50/60, 60/70, 70+ g; Omega-3 | Fresh 6/15/30 packs; Vit D; Omega-3 |
| Certs (claimed on their site) | Saudi GAP, Saudi Quality Mark (Grade A), ISO 9001, ISO 22000, McDonald's on-farm laying-hen welfare Grade A, MEWA award (best layer project, Eastern Province) | "Saudi Made" logo only | "Four ISO certifications" (logos, standards not named); "BRC" and "Halal" text in HTML | None stated | None on egg page | Emirates Quality Mark, ISO 22000, HACCP, Halal (GSO 2055-1), ISO 9001, ISO 45001, ISO 14001, ISO 10002, Organic (distributor) | None | HACCP |
| Inquiry method | Contact form + sales email | Contact page; social links; online store | Email ecare@…; toll-free number (feed) | Contact form; branch list (HQ, Dammam, Jeddah, Hafar Al-Batin) | Detailed form + phone + regional sales reps | WhatsApp + phone + email | WhatsApp + phone + online order | Form + phone + email |

**Other observations (factual):**
- The arabianfarms.com homepage HTML contains outbound links to unrelated domains (for example, a bare IP address and unrelated .id and .mx sites). This looks like link injection.
- algharbiafarms.com is a client-rendered app. Its raw HTML contains only a title and description (no hreflang, no JSON-LD), and it returns no content to a basic fetch.
- I found no official website for Al Kadi, Dana/MPF (Oman) or the Arab Qatari Co. (Qatar).

### A3. Gaps and differentiation for Family Eggs

1. **Competitors win on proof of trust.** Rahima (Saudi GAP, Quality Mark, ISO 9001/22000, McDonald's welfare) and Al Jazira (nine certificates on a dedicated page) put certificates up front. Family Eggs shows none. If it holds SFDA/MEWA licences, Saudi GAP or ISO, a "Quality & Licences" page is the biggest gap to close.
2. **Family Eggs' spec sheet is already better than most.** Six grades, pack counts, shelf life and storage temperature/RH are more detailed than Rahima, Al Watania or Al Jazira, and only KUPCO publishes weight bands. Family Eggs could add gram ranges per grade (KUPCO-style), pallet/carton dimensions and a downloadable PDF spec sheet. Arabian Farms and Al Jazira already offer downloads.
3. **No competitor has a real B2B or export page.** A dedicated wholesale/distributor page (MOQ, delivery regions, lead times, payment terms) and an export page for GCC buyers would set Family Eggs apart. Qaryah and Rahima only hint at industrial/food-service supply.
4. **Single-page structure limits search coverage.** Competitors have separate pages for products, quality, farm and FAQ. Family Eggs has a single anchor page per language, so it can rank for few queries (for example "توريد بيض جملة الرياض", "egg supplier Saudi Arabia", "بيض كرتون 360"). Splitting into indexable pages, with hreflang kept as it is now, would widen that.
5. **Technical SEO and conversion are a relative strength.** Family Eggs already has correct hreflang/x-default and Organization JSON-LD, which Rahima, Arabian Farms and KUPCO lack. Next steps would be `Product`/`Offer`, `FAQPage` and a two-path conversion: a short RFQ form (volume, size, city) alongside WhatsApp. Arabian Farms' form fields ("business type", "product interest", "location") are a good model.

---

## Part B: Market context

- **Production:** GASTAT puts 2024 table-egg output at **8.42 billion eggs**, up 6% from 7.91 billion in 2023 ([Argaam](https://www.argaam.com/en/article/articledetail/id/1860912); [GASTAT Livestock Statistics 2023](https://stats.gov.sa/sites/default/files/Livestock%20Statistics%202023%20EN.pdf)). MEWA-reported figures say "≈8 billion" ([Poultry India](https://www.poultryindia.co.in/articles/saudi-arabias-table-egg-production-exceeds-8-billion-eggs-in-2024)).
- **Self-sufficiency:** Table eggs were **100% in 2023 and 103% in 2024** (GASTAT food-security statistics, via [Argaam, 18 Dec 2025](https://www.argaam.com/en/article/articledetail/id/1867020)). Per-capita consumption fell from 246 to 235 eggs/yr. Saudipedia cites 117% for egg production in the 2022 Statistical Yearbook ([Saudipedia](https://saudipedia.com/en/article/2377/economy-and-business/economic-affairs/poultry-farming-in-saudi-arabia)); that figure likely uses a different basis.
- **Market structure:** More than 100 producers. Al Watania 19%, Rahima 18.5%, unbranded small farms 16%, AlGharbia 4%, Al Kadi 3.5%, Fakieh 3.5% ([Argaam, Jan 2025](https://www.argaam.com/en/article/articledetail/id/1786172)).
- **Saudi egg exports:** OEC reports **US$11.5M of egg exports in 2023**: Yemen $3.86M, **Bahrain $3.38M**, Iraq $2.33M, **UAE $1.51M**, Djibouti $0.36M. HS "eggs" may include hatching eggs ([OEC](https://oec.world/profile/bilateral-product/eggs/reporter/sau)).
- **GCC import demand:** IndexBox (19 Feb 2026) reports GCC table-egg imports of about 187k t / $266M in 2024. The **UAE imports about 107k t (57%)**, followed by Qatar 38k t, Oman 25k t, Bahrain 9.5k t and Kuwait 7.4k t. Saudi Arabia holds 66% of GCC production and ranks among the top exporters (about $20M) ([IndexBox](https://www.indexbox.io/blog/table-egg-gcc-market-overview-2024-5/)). This is a commercial analyst source.
- **Bahrain:** About 67% of table eggs consumed are imported (GPC CEO, [The CEO Magazine](https://theceomagazine.com/executive-interviews/agriculture-farming/wael-itani)). GPC phase 2 aims to raise domestic share to 63% (Nov 2025, [Ghitha](https://www.ghitha.bh/general-poultry-company)).
- **Kuwait:** An informal source says about 40% of demand is produced locally, with imports from KSA, Jordan, Syria and India ([248am](https://248am.com/nibaq/kuwait/the-local-egg-crisis/); low reliability). Kuwait banned fresh-egg exports from Oct 2022 to May 2023 ([Global Trade Alert](https://globaltradealert.org/state-act/71082-kuwait-temporary-export-ban-on-fresh-eggs)).
- **Regional competition building:** Oman's Gulf International Poultry Farm (about 350M eggs/yr) targets "local and Gulf demand" ([Times of Oman](https://timesofoman.com/article/124082-gulf-international-poultry-farm-to-open-in-ibri-on-thursday)). Qatar is adding layer capacity ([Hassad](https://www.hassad.com/?p=5892)).

### Export regulation (what reputable sources state, plus gaps)
- **SFDA export licence for table eggs:** Naqi Water's reported SFDA licence to export table eggs shows that SFDA issues an export authorisation for this product ([Decypha](https://www.decypha.com/en/news/details/Naqi-Water-fuels-regional-expansion-plans-via-new-license/21563829?L=EN)). I did not find the procedure itself on sfda.gov.sa; check SFDA e-services.
- **SFDA health certificates and certificates of free sale:** SFDA publishes guidance on export health certificates and free-sale certificates. The document I found covers **feed**, where a health certificate is valid for four months ([SFDA PDF](https://www.sfda.gov.sa/sites/default/files/2024-05/ExportingFeedProductsHealthCertificateCertificateFreeSale.pdf)). The food equivalent should be confirmed with SFDA.
- **MEWA:** MEWA runs Saudi GAP, which includes poultry-farm standards ([Saudipedia](https://saudipedia.com/en/article/2377/economy-and-business/economic-affairs/poultry-farming-in-saudi-arabia)). I found **no public MEWA page** describing veterinary export certificates for table eggs. Treat that as something to confirm with MEWA's animal-health department.
- **Destination requirements:** Importing GCC states generally require an agreed **export health certificate** signed by the origin's competent authority. Kuwait publishes a health-certificate template for table eggs ([PAAF/PAFN PDF](https://pafn.gov.kw/assets/images/Uploads/2021429151139.pdf)). The UAE (MOCCAE) applies agreed certificates and avian-influenza origin bans ([Australia DAFF notice 2020-05](https://www.agriculture.gov.au/export/controlled-goods/eggs/egg-notices/2020-05); [UK 8060NFG, revised Mar 2026](https://assets.publishing.service.gov.uk/media/69b7f096ba47c264e6c8cfbd/8060NFG.pdf)). Typical attestations are eggs processed in a facility under competent-authority control with HACCP-based food safety, and the exporter must confirm import-permit needs with the importer.
- **Avian-influenza risk:** In Feb 2026 SFDA banned poultry and table-egg imports from 40 countries, with partial bans on 16 more, and reviews the list regularly ([Gulf News](https://gulfnews.com/world/gulf/saudi/saudi-arabia-bans-poultry-and-egg-imports-from-40-countries-to-safeguard-public-health-1.500454299)). GCC importers apply similar origin-based bans, so KSA's disease-free status and farm biosecurity records matter for exports.
- **Not found:** A GCC-wide single approval for intra-GCC egg trade, and current fees or timelines.

---

## Part C: External visibility platforms

Ranked by relevance and effort for a Saudi B2B egg producer. "Cost" is shown only where a source states it; otherwise it is "verify".

| # | Platform | What it is | URL | Cost | Relevance | Effort | Notes |
|---|---|---|---|---|---|---|---|
| 1 | Google Business Profile (two profiles: HQ Al Rabwah and farm in Marat) | Maps and local pack | business.google.com | Free | Very high: "مزرعة بيض" / "بيض جملة" local searches | Low | Use Arabic and English names, the "Egg supplier" / "Poultry farm" categories, photos and WhatsApp |
| 2 | Made in Saudi / Saudi Exports (SEDA) | Official national-product programme with a member and product listing, logo rights and campaigns; registering with SEDA also opens export incentives and "Import from Saudi" buyer matchmaking | madeinsaudi.sa; saudiexports.gov.sa | Fee not stated in sources found | Very high for GCC buyers | Medium (eligibility criteria per sector; fresh produce is a listed category) | [Saudipedia](https://saudipedia.com/en/made-in-saudi-program); [Gulf News on Import from Saudi](https://gulfnews.com/business/markets/saudi-arabia-introduces-import-from-saudi-service-1.1730195522455) |
| 3 | Riyadh Chamber / Federation of Saudi Chambers | Membership is tied to the CR; the chamber offers a subscriber database searchable by activity | chamber.org.sa; fsc.org.sa | Membership fee by tier (verify) | High (credibility, certificates of origin) | Low | [Amlak](https://amlak.net.sa/en/5700/) |
| 4 | Gulfood (Dubai, 15–19 Mar 2027) | Largest regional F&B trade show; exhibitor pages rank well (Al Watania and Qaryah have them) | gulfood.com | Paid stand. SEDA/national pavilion may subsidise (verify) | High for UAE, the largest GCC importer | High | [Austrade](https://www.austrade.gov.au/en/events/gulfood-2027) |
| 5 | Middle East Poultry Expo (Riyadh, annual; Oct 2026 edition) / Foodex Saudi / Saudi Food Show | Domestic sector shows with exhibitor directories | — | Paid | High (domestic distributors) | Med–High | [JETRO](https://www.jetro.go.jp/en/database/j-messe/tradefair/detail/158409); [Foodex profile of Al Watania](https://www.foodexsaudiexpo.com/en/exhibitors/profile/3358) |
| 6 | Apple Business Connect + Bing Places | Maps listings on iOS, Bing and Copilot | businessconnect.apple.com; bingplaces.com | Free | Medium | Low | Can import from Google Business Profile |
| 7 | Tridge | Agri-food B2B sourcing platform that lists suppliers by country | tridge.com | Not verified (free and paid tiers exist) | Medium for export leads | Medium | Verify terms |
| 8 | Kompass / Europages | Global B2B directories | kompass.com; europages.com | Basic listing free; paid upgrades sold aggressively | Low–Med (backlink and citation) | Low | Skip the paid tiers |
| 9 | SIAL Middle East (Abu Dhabi, Sep 2026, already passed) | F&B show | sialmiddleeast.com | Paid | Medium | High | Consider for the next edition |
| 10 | Saudi Business Center | Government business-registration portal | business.sa | — | Low for visibility (it is a licensing tool, not a directory) | — | Keep CR data consistent |
| 11 | SFDA / MEWA licence registers | Regulatory registration | sfda.gov.sa; mewa.gov.sa | — | Compliance, not marketing | — | Display licence numbers on site instead |
| 12 | Monsha'at / MODON | SME authority / industrial cities | monshaat.gov.sa; modon.gov.sa | — | Low (Marat farm is not in a MODON city) | — | Monsha'at programmes may help with export readiness |
| 13 | Alibaba.com | Global B2B marketplace | alibaba.com | Paid Gold Supplier membership | Low: perishable, short-haul GCC trade; attracts low-quality inquiries | Medium | **Pay-to-play**; not recommended |
| — | Saudi poultry association | A Saudi poultry society (est. 2000) was reported in 2010 ([The Poultry Site](https://www.thepoultrysite.com/news/2010/07/investments-in-saudi-poultry-reach-sr32bn)) | — | — | — | — | **Current status not verified** |

**Spam and pay-to-play warnings:** Alibaba (paid membership), paid upgrades on Kompass and Europages, and generic "Saudi business directory" sites such as eyeofriyadh-style listings and D&B lead-gen pages offer little value. Avoid any paid backlink or directory bundles.
