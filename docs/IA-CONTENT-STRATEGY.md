# Family Eggs — Information Architecture & Content Strategy (Phase 02)

**Status:** Strategy and structure only. **No code, styles, components or copy have been written or modified.**
**Date:** 2026-08-18
**Supersedes:** nothing. **Depends on:** `DISCOVERY-AUDIT.md` (Phase 01) as corrected by client corrections C1–C11.
**Governing constraint:** every corrected item in Phase 01 §0-A is binding here.

---

## How to read this document

| Label | Meaning |
|---|---|
| **CONFIRMED** | Verified in Phase 01, or explicitly confirmed by the client |
| **PENDING** | Required, not yet supplied — must not be published until confirmed |
| **PROPOSED** | A recommendation from this phase, awaiting your approval |
| **BLOCKED** | Cannot proceed until a named dependency arrives |

**Nothing in this document invents statistics, certifications, customers, testimonials, production capacity, delivery times or export markets.** Every number-shaped slot is marked PENDING with the question that fills it.

---

## 0. Strategic Frame

### 0.1 What changed between Phase 01 and Phase 02

Phase 01 audited a **consumer-flavoured, single-page, Arabic-only brochure**. The corrections redefine the brief:

| Dimension | Phase 01 assumption | Corrected direction (C7–C9) |
|---|---|---|
| Audience | Saudi consumers | **B2B buyers** — distributors, traders, supermarkets, hotels, food-service, regional & international importers |
| Conversion | Browse products, WhatsApp | **Request a Quote · Distribution Partner · Export Enquiry · Direct contact** |
| Geography | Riyadh region | **Saudi Arabia -> GCC -> regional export** |
| Category signal | Farm website | **Food-industry supplier with export ambition** |
| Language priority | Arabic-only | **Bilingual, English carries the export half** |

**Consequence:** English stops being a translation and becomes a **commercial requirement**. An importer in Amman, Dubai or Doha will not read an Arabic-only site. The unreachable English build documented in Phase 01 §12 is no longer a technical debt item — it is a revenue blocker.

### 0.2 The positioning line this structure serves

> **"من عائلتنا، إلى العالم." / "From Our Family to the World."** — CONFIRMED (C11)

The line does specific structural work, and the IA is built to pay it off:

- **"من عائلتنا"** — the human, generational half. Carried by the owner's 60+ years of sector experience (C6), the family ownership, and the care visible in the facility.
- **"إلى العالم"** — the industrial, export half. Carried by automation, grading standards, compliance evidence and distribution capability.

Every page below is assigned to one half or the other. A page that serves neither does not belong in the sitemap.

### 0.3 The credibility problem this strategy must solve

A B2B importer evaluating a new egg supplier asks four questions, in this order:

1. **Can you actually supply?** — volume, consistency, grades, packaging
2. **Can I trust your quality?** — certifications, grading equipment, traceability, hygiene
3. **Can you get it to me?** — cold chain, logistics, export documentation, Incoterms
4. **Who am I dealing with?** — ownership, track record, longevity

The current site answers **none** of these. Phase 01 found no scale figures, no specifications, no verified certifications, no logistics detail and no company story. **This is the content gap that Phase 02 exists to structure and Phase 03 must fill.**

---

## 1. Recommended Bilingual Sitemap — PROPOSED

Nine pages plus two utility pages. Every page exists in both languages.

```
/  (ar)                                   /en  (en)
│
├── من نحن ......................... /about ................. Our Story
│     └── (owner's 60+ years, family ownership, timeline)
│
├── منتجاتنا ....................... /products .............. Our Products
│     └── بيض المائدة الأبيض ....... /products/white-table-eggs
│           (size grades S / M / L / XL)
│
├── الجودة والمطابقة ............... /quality ............... Quality & Compliance
│     └── (grading, candling, traceability, certifications)
│
├── الإنتاج والمرافق ............... /production ............ Production & Facilities
│     └── (automation, MOBA line, hen houses, responsible production)
│
├── التوزيع والتصدير ............... /distribution .......... Distribution & Export
│     └── (coverage, cold chain, export process, documentation)
│
├── للشركاء التجاريين .............. /partners .............. For Business Partners
│     └── (distributor / wholesale / food-service propositions)
│
├── اطلب عرض سعر .................. /request-a-quote ....... Request a Quote
│
├── استفسار تصدير .................. /export-enquiry ........ Export Enquiry
│
└── تواصل معنا ..................... /contact ............... Contact

Utility (both languages):
├── سياسة الخصوصية ................ /privacy ............... Privacy Policy
└── الشروط والأحكام ............... /terms ................. Terms
```

### 1.1 What was deliberately excluded, and why

| Excluded | Reason |
|---|---|
| Recipes / consumer content hub | Contradicts C8. It is an excellent organic-growth lever for a **consumer** brand; here it would dilute the B2B signal and consume budget that belongs to export content. **Revisit only if a consumer line launches.** |
| Blog / news | Only add when there is a committed publishing cadence. An abandoned news page dated 18 months ago actively damages supplier credibility. **PENDING a content-ownership decision.** |
| E-commerce / cart / prices | Contradicts C8. Pricing is by quotation. |
| Testimonials page | Phase 01 found the existing testimonials appear fabricated. A testimonials page cannot exist until real, consenting, named customers are supplied. **BLOCKED.** |
| Separate "Sustainability" page | Insufficient verified material. C4 reduces the solar claim to one honest sentence — that is a **section** inside `/production`, not a page. Promote later if real data arrives. |
| "Our Farm" as its own page | Overlaps `/production` almost entirely. Merged to avoid two thin pages competing for the same queries. |
| Careers | No stated need. Add on request. |

### 1.2 Why nine pages rather than one

Phase 01 §2 established the cost of the single-page structure: one indexable URL, no linkable sub-topics, everything competing for one page's ranking. For an export-seeking B2B supplier this is disqualifying — an importer searching *"egg exporter Saudi Arabia"* and an importer searching *"white eggs size grades wholesale"* need different landing pages, and neither should land on a hero.

Nine pages is also the **minimum** that lets each of the four buyer questions in §0.3 own a URL.

---

## 2. Page Purpose & Primary Audience

| Page | Primary audience | Single job | Success = |
|---|---|---|---|
| `/` Home | All segments, first touch | Establish scale, seriousness and export readiness in one screen; route each segment onward | Visitor reaches the correct segment page or converts |
| `/about` | Importers, large distributors | Answer *"who am I dealing with?"* — family ownership + 60+ years of sector experience (C6) | Trust established; visitor proceeds to `/quality` or `/production` |
| `/products` | All buyers | Present the white table-egg range and the size-grade system | Visitor identifies the grade they need, then requests a quote |
| `/products/white-table-eggs` | Procurement / technical buyers | Full specification detail per grade | Specification satisfied; quote requested |
| `/quality` | Supermarket QA, hotel procurement, importers | Answer *"can I trust your quality?"* with **evidence, not adjectives** | QA gate passed |
| `/production` | Importers, large distributors | Answer *"can you actually supply?"* — automation and facility capability | Capability believed |
| `/distribution` | Traders, importers, food-service | Answer *"can you get it to me?"* — coverage, cold chain, export process | Logistics feasibility confirmed |
| `/partners` | Distributors, wholesalers, food-service | Convert interest into a commercial relationship | Partner enquiry submitted |
| `/request-a-quote` | Domestic buyers | Capture a qualified, specification-complete quote request | Complete, actionable enquiry received |
| `/export-enquiry` | International importers | Capture an export enquiry with destination and volume | Complete export enquiry received |
| `/contact` | Everyone | Direct human contact, location, hours | Call, email or WhatsApp initiated |

### 2.1 Audience segments and their entry points

| Segment | Likely entry | Path to conversion |
|---|---|---|
| Wholesale distributor (KSA) | `/` or `/partners` | `/partners` -> `/products` -> `/request-a-quote` |
| Egg trader | Search -> `/products` | `/products` -> `/distribution` -> `/request-a-quote` |
| Supermarket buyer | Search -> `/quality` | `/quality` -> `/products` -> `/request-a-quote` |
| Hotel / food-service | Search -> `/products` | `/products` -> `/distribution` -> `/request-a-quote` |
| Regional importer (GCC) | Search -> `/en/distribution` | `/distribution` -> `/quality` -> `/export-enquiry` |
| International importer | Search -> `/en` or `/en/about` | `/about` -> `/quality` -> `/production` -> `/export-enquiry` |

**Note the asymmetry:** domestic buyers convert fast and shallow; importers traverse three or four pages before converting. The IA must support **both** a two-click path and a four-page evidence trail. This is why `/quality` and `/production` are separate pages rather than sections.

---

## 3. Arabic / English URL Strategy — PROPOSED

### 3.1 Recommendation: unprefixed Arabic root + `/en` prefix

| | Structure |
|---|---|
| Arabic (default) | `https://familyeggs.sa/` · `/about` · `/products` · … |
| English | `https://familyeggs.sa/en` · `/en/about` · `/en/products` · … |

### 3.2 Why this over the alternatives

| Option | Verdict | Reasoning |
|---|---|---|
| **`/` + `/en`** — RECOMMENDED | **Adopt** | Preserves all existing equity on the live Arabic root (Phase 01 confirmed `familyeggs.sa/` is live and indexed). No redirect of the homepage. Single domain, single certificate, single deployment. Cheapest correct answer. |
| `/ar` + `/en` | Reject | Cleaner in theory, but forces a redirect on the one URL that already has equity, and adds a root-routing decision with no commercial upside. |
| `ar.` / `en.` subdomains | Reject | Splits domain authority across two hostnames — actively harmful for a site with little authority to begin with. Extra DNS and certificate surface. |
| ccTLDs per market | Reject | Wildly premature. Revisit only if a specific export market becomes material. |

### 3.3 Mandatory implementation rules

1. **Self-referencing canonical on every page**, in both languages.
2. **Reciprocal `hreflang`** on every page — `ar-SA`, `en`, and `x-default` -> the Arabic root.
   > `x-default` points to Arabic because Saudi Arabia is the primary market. If export becomes dominant, revisit.
3. **URL slugs stay in English/Latin characters in both trees.** `/en/products` and `/products` — the Arabic tree uses the same slugs, not Arabic-script slugs. Rationale: Arabic-script URLs become percent-encoded, break in emails and WhatsApp, and are hostile to international partners pasting links. **The page content is Arabic; the address is Latin.**
4. **No auto-redirect by IP or `Accept-Language`.** Detect, suggest via a dismissible banner, never force. Auto-redirect breaks crawlers and traps bilingual users.
5. **Language switch preserves the current page** — `/quality` <-> `/en/quality`, never dumping the user at the homepage.
6. **Per-language metadata** — title, description, `og:*` and JSON-LD must all be language-specific. Phase 01 found a single hard-coded Arabic head; that cannot survive.
7. **One `sitemap.xml`** containing both trees with `hreflang` annotations, plus a real `robots.txt`. Phase 01 confirmed both currently return the SPA shell — see §15.

### 3.4 Blocking prerequisite

Per Phase 01 §12, `MotionService.splitTextIn()` destroys Angular's binding on the hero `<h1>`. **The language switcher cannot ship until this is fixed**, or the hero headline will freeze in whichever language loaded first. This is now on the critical path, because bilingual is no longer optional.

---

## 4. B2B & Export User Journeys

### 4.1 Journey A — Domestic wholesale distributor

| Stage | Question in their head | Page | What must be present |
|---|---|---|---|
| Discover | "Who supplies eggs in Riyadh at volume?" | Search -> `/` | Immediate scale and seriousness signal; no consumer framing |
| Qualify | "Are they big enough for my volume?" | `/production` | Automation, facility scale, grading throughput **[PENDING]** |
| Verify | "Will my retail customers accept this?" | `/quality` | Grading standards, certifications **[PENDING]** |
| Specify | "What grades and packs?" | `/products` | Size grades S/M/L/XL, pack formats **[PENDING final]** |
| Commit | "What are the terms?" | `/partners` -> `/request-a-quote` | MOQ, lead time, delivery frequency **[PENDING]** |

**Friction risk:** this buyer abandons at *Qualify* if there is no number anywhere. **Highest-value PENDING item for this journey: daily production capacity.**

### 4.2 Journey B — International importer (the export journey)

| Stage | Question | Page | What must be present |
|---|---|---|---|
| Discover | "Saudi egg exporters?" | Search -> `/en` | English-first, export-explicit, credible at a glance |
| Screen | "Is this a real operation or a broker?" | `/en/about` + `/en/production` | Owned facility, automation, 60+ years sector experience (C6) |
| Compliance | "Can this clear my customs and my QA?" | `/en/quality` | Certifications, export documentation, lab testing **[PENDING]** |
| Logistics | "Can they physically get it to me?" | `/en/distribution` | Cold chain, port access, Incoterms, packaging for export **[PENDING]** |
| Enquire | "Let me test them with a real enquiry" | `/en/export-enquiry` | Destination, volume, grade, Incoterm, frequency |
| Validate | "Do they answer like professionals?" | Off-site — your reply | **Response time and quality is the actual conversion event** |

**Two structural notes:**

- The importer journey is **four pages deep before conversion**. Every one of those pages must load fast and read as English-native, not translated. Phase 01 confirmed the English copy already reads natively — that asset is worth keeping.
- **The final conversion happens in your inbox, not on the site.** A slow or unprofessional reply destroys the value of everything upstream. The form spec in §9 is designed so your first reply can be substantive.

### 4.3 Journey C — Supermarket / hotel procurement

Shortest journey, hardest gate. Enters at `/quality` from a compliance-shaped search, checks certification evidence, and **leaves immediately if the evidence is not documented**.

| Stage | Page | Requirement |
|---|---|---|
| Compliance gate | `/quality` | Named certifications with issuing body, number, validity **[PENDING — BLOCKING]** |
| Specification | `/products/white-table-eggs` | Grade weights and pack formats **[PENDING]** |
| Supply reliability | `/distribution` | Delivery frequency and coverage **[PENDING]** |
| Convert | `/request-a-quote` | Quote request |

> **This journey is currently 100% blocked.** Phase 01 established that four certification claims render publicly with no certificates on file. Until certificates arrive, `/quality` cannot make a single certification claim, and this segment cannot be served. **This is the single highest-value PENDING item in the entire project.**

---

## 5. Final Homepage Narrative Order — PROPOSED

Built on the eight sections you specified, with the structural rationale for each and one addition flagged for approval.

| # | Section | Narrative job | Which half of "من عائلتنا، إلى العالم" |
|---|---|---|---|
| 1 | **Hero** — "من عائلتنا، إلى العالم." / "From Our Family to the World." | State the positioning and the category in one screen. Primary CTA: Request a Quote. Secondary: Export Enquiry. | Both — this is the thesis |
| 2 | **60+ years of cumulative sector experience** (C6) | Establish depth before capability. Answers "who am I dealing with?" first, because a B2B buyer trusts people before machines. | Family |
| 3 | **Fully automated production and grading** | Convert trust into capability. The single strongest visual asset the company owns lives here. | World |
| 4 | **White egg range and size grades** | Make the offer concrete and specifiable. S / M / L / XL. | World |
| 5 | **Verified quality and compliance evidence** | Pass the procurement gate. **Evidence only — no adjectives.** | World |
| 6 | **Responsible production and partial solar-energy use** (C4) | Modern-operator signal, stated honestly and briefly. | World |
| 7 | **Distribution and export capability** | Prove reach. The "إلى العالم" payoff. | World |
| 8 | **B2B partnership / request-a-quote conversion** | Convert. Segment-aware: distributor / food-service / importer. | Both |

### 5.1 Why this order works

The sequence is **person -> capability -> offer -> proof -> conscience -> reach -> commitment**. It front-loads the human differentiator (which competitors cannot copy) and back-loads the commercial ask (after every objection has been answered).

Critically, it **does not open with the farm**. Opening with hen houses signals "farm supplier". Opening with the family and immediately proving industrial capability signals "food-industry partner" — which is the C9 direction.

### 5.2 One addition, for your approval — PROPOSED

**A quiet credibility strip between sections 1 and 2** — three or four hard facts, no icons, no cards, no gradients (C9). For example: *founded / grades produced / delivery coverage / export status*.

**Rationale:** the importer in Journey B screens for legitimacy within seconds. A restrained factual strip does that work before they scroll. **BLOCKED on PENDING data** — if no verified figures arrive, this section must not ship rather than ship with soft claims.

### 5.3 What must NOT appear on the homepage

| Excluded | Reason |
|---|---|
| Testimonials | No real, consenting customers confirmed (Phase 01) |
| Certification logos | Not until certificates are supplied |
| A card grid of "why choose us" | C9 explicitly excludes generic card-grid design |
| Decorative gradient panels, rounded-square icon tiles, agricultural clip-art | C9 |
| A gallery of environment shots posing as a portfolio | C3 — AI-enhanced imagery is placeholder only |
| Consumer/recipe content | C8 |
| Any unqualified "solar-powered" claim | C4 |

---

## 6. Section-by-Section Content Model

The content model per section: what fields exist, which are required, and the confirmation status of each. **This is a schema, not copy.** Copy is written in Phase 03 by humans.

### 6.1 Global / shared

| Field | Type | Required | Status |
|---|---|---|---|
| `logo` | vector asset, colour + mono + reversed | Yes | **BLOCKED — C1, new logo in preparation** |
| `company_name_ar` / `_en` | string | Yes | CONFIRMED |
| `positioning_line_ar` / `_en` | string | Yes | CONFIRMED (C11) |
| `phone` | E.164 | Yes | CONFIRMED — `+966 50 748 8650` |
| `email` | string | Yes | **PENDING** — confirm `info@familyeggs.sa` is live and monitored |
| `address_ar` / `_en` | string | Yes | CONFIRMED |
| `coordinates` | lat/lng | Yes | **PENDING** — needed for an accurate map pin |
| `hours` | string | Yes | CONFIRMED |
| `cr_number`, `vat_number` | string | Yes (Saudi commercial norm) | **PENDING** |
| `social_urls` | array | Optional | **PENDING** — supply real URLs or omit; 3 of 4 are dead links today |

### 6.2 Hero (Home §1)

| Field | Required | Status |
|---|---|---|
| `headline_ar` / `_en` | Yes | **CONFIRMED (C11)** |
| `subline_ar` / `_en` | Yes | PENDING — must state category + market position in one line, written in Phase 03 |
| `primary_cta` -> `/request-a-quote` | Yes | PROPOSED |
| `secondary_cta` -> `/export-enquiry` | Yes | PROPOSED |
| `background_asset` | Yes | Placeholder available — see §12 |
| `eyebrow` | No | Only if it carries a verified fact |

### 6.3 Heritage — 60+ years (Home §2, `/about`)

| Field | Required | Status |
|---|---|---|
| `experience_years` | Yes | **CONFIRMED as 60+ — but strictly as the owner's cumulative sector experience (C6)** |
| `experience_framing_ar` / `_en` | Yes | **CRITICAL** — wording must make the attribution unambiguous. Suggested frame: *"more than 60 years of the owner's experience in egg production, including an earlier farm"* — never *"Family Eggs, established 19xx"* |
| `company_established_year` | Yes | **PENDING — must be separately confirmed (C6)** |
| `earlier_farm_name` / `years` | No | PENDING — strengthens the story if it can be named |
| `owner_name` | No | PENDING — requires consent to publish |
| `family_ownership_statement` | Yes | PENDING |
| `timeline[]` (`year`, `event_ar`, `event_en`) | No | PENDING — only real, dated milestones |
| `portrait_asset` | No | **MISSING — cannot be AI-generated (C3)** |

> **Compliance guard.** This section carries the project's highest misrepresentation risk. Two different facts — the owner's 60+ years and the company's legal age — must never be visually or grammatically merged.

### 6.4 Automated production & grading (Home §3, `/production`)

| Field | Required | Status |
|---|---|---|
| `automation_summary_ar` / `_en` | Yes | PENDING copy |
| `grading_line_make_model` | Yes | Observed as **MOBA Omnia XF 220** — **PENDING company confirmation** |
| `grading_throughput_eggs_hour` | Yes | **PENDING** |
| `candling_description` | Yes | CONFIRMED as a process (visually evidenced) |
| `collection_method` | Yes | CONFIRMED as automated belts (visually evidenced) |
| `hen_house_count` | Yes | **PENDING** |
| `flock_size` | No | **PENDING** — powerful if supplied |
| `daily_production_capacity` | Yes | **PENDING — highest-value single figure in the project** |
| `climate_control_statement` | No | **PENDING** — visible houses do not prove climate control |
| `facility_assets[]` | Yes | Placeholders available — see §12 |

### 6.5 White egg range & size grades (Home §4, `/products`)

| Field | Required | Status |
|---|---|---|
| `range_statement_ar` / `_en` | Yes | **CONFIRMED direction: white table eggs (C5)** |
| `grades[]` | Yes | **CONFIRMED as S / M / L / XL (C5); all attributes PENDING** |
| `grading_standard_reference` | Yes | **PENDING** — which standard defines these grades (SASO / EU / other)? |
| `brown_eggs` / `organic_eggs` | — | **PENDING — must be resolved.** Live metadata advertises both; the product section offers neither. Until confirmed, **remove from metadata**. |
| See §8 for the full per-grade schema | | |

### 6.6 Quality & compliance evidence (Home §5, `/quality`)

| Field | Required | Status |
|---|---|---|
| `certifications[]` (`name`, `issuing_body`, `certificate_number`, `valid_until`, `scan_asset`) | Yes | **PENDING — BLOCKING. No certification may be named without all five fields.** |
| `traceability_description` | Yes | **PENDING** — the site currently claims every egg is traceable; the mechanism is undocumented |
| `hygiene_protocol_summary` | Yes | PENDING |
| `lab_testing_regime` | Yes | PENDING |
| `grade_a_claim` | — | **PENDING — withdraw until confirmed as an official classification** |
| `shelf_life_days` + `storage_conditions` | Yes | **PENDING — food-safety claim; the current "3 months" must be substantiated or withdrawn** |
| `animal_welfare_statement` | No | PENDING |
| `feed_description` | No | PENDING — an ARASCO tanker appears in the footage |

> **Hard rule for this section:** it may contain **only** items with documentary backing. A quality page that makes unbacked claims is worse than no quality page, because the audience is professional buyers who verify.

### 6.7 Responsible production & solar (Home §6, `/production`)

| Field | Required | Status |
|---|---|---|
| `solar_statement_ar` | Yes | **CONFIRMED verbatim (C4):** «يسهم استخدام الطاقة الشمسية في تغطية جزء من احتياجات الطاقة في المزرعة.» |
| `solar_statement_en` | Yes | **CONFIRMED verbatim (C4):** "Part of the farm's energy consumption is supported by solar energy." |
| `solar_capacity_kwp` | No | PENDING — only if precise |
| `solar_share_percentage` | No | PENDING — **only if measured.** Absent a figure, the approved sentence stands alone |
| `other_responsibility_measures[]` | No | PENDING |
| `solar_asset` | Yes | Wide aerial available; detail shots MISSING |

> **Guard:** this section must not grow adjectives. One honest sentence outperforms a sustainability narrative the company cannot substantiate.

### 6.8 Distribution & export (Home §7, `/distribution`)

| Field | Required | Status |
|---|---|---|
| `domestic_coverage[]` (cities/regions) | Yes | **PENDING** |
| `delivery_frequency` | Yes | **PENDING** — current "same-day" claim is unverified |
| `fleet_size` + `refrigeration_spec` | Yes | **PENDING** |
| `cold_chain_description` | Yes | PENDING |
| `export_status` | Yes | **PENDING — do you currently export, or is this an ambition?** The honest answer changes the entire page |
| `export_markets[]` | Conditional | **PENDING — must never be invented** |
| `export_documentation[]` (health cert, CoO, halal cert) | Yes if exporting | PENDING |
| `incoterms_supported[]` | Yes if exporting | PENDING |
| `port_of_departure` | Yes if exporting | PENDING |
| `export_packaging_spec` | Yes if exporting | PENDING |
| `moq_export` / `lead_time_export` | Yes if exporting | PENDING |

> **Critical fork.** If the company does not yet export, this page must be written as **"export-ready capability"**, not as **"we export to X"**. Claiming markets you do not serve is the fastest way to lose an importer permanently. **This single answer determines whether `/export-enquiry` is a live conversion page or an expression-of-interest page.**

### 6.9 B2B conversion (Home §8, `/partners`)

| Field | Required | Status |
|---|---|---|
| `partner_types[]` — distributor / wholesale / supermarket / hotel & food-service / importer | Yes | CONFIRMED from C7 |
| Per type: `proposition`, `typical_volume`, `moq`, `lead_time`, `terms_summary` | Yes | **PENDING per segment** |
| `onboarding_steps[]` | Yes | PROPOSED — a 3–4 step "how partnership works" sequence reduces enquiry friction |
| `primary_cta` / `secondary_cta` | Yes | PROPOSED |

---

## 7. Required Factual Evidence for Every Commercial Claim

**Rule: no claim ships without its evidence type present.** This table is the gate.

| Claim | Evidence required | Status | If evidence absent |
|---|---|---|---|
| 60+ years of sector experience | Owner statement + earlier-farm reference (C6) | CONFIRMED as framing | Must state attribution explicitly — never as company age |
| Family-owned business | Company statement / CR | PENDING | Soften to a general statement |
| Company established in [year] | CR document | **PENDING** | Omit the year entirely |
| Fully automated production & grading | Equipment make/model + throughput | **PENDING** | Say "automated grading and candling" — visually evidenced — without figures |
| MOBA Omnia XF 220 | Company confirmation | **PENDING** (observed only) | Do not name the machine |
| Candling of every egg | Process confirmation | Visually evidenced; confirm "every" | Say "candled" without the universal quantifier |
| White table eggs in S/M/L/XL | Company confirmation (C5) | **CONFIRMED as direction** | — |
| Grade weights per size | Spec sheet + grading standard | **PENDING** | Publish grades without weights |
| Pack formats / cartons / SKUs | Spec sheet | **PENDING** | Omit |
| Shelf life | Documented basis + storage conditions | **PENDING** | **Withdraw the current "3 months" claim** |
| "Grade A" | Official classification proof | **PENDING** | **Withdraw** |
| ISO 22000 / HACCP / SFDA / Halal / GMP | Certificate scan + body + number + expiry | **PENDING — BLOCKING** | **Withdraw all, including from the marquee** |
| Traceability of every egg | Documented system | **PENDING** | Withdraw or describe honestly |
| Partial solar energy use | Approved wording (C4) | **CONFIRMED** | Use approved sentence verbatim |
| Solar share of consumption | Measured figure | **PENDING** | Omit the number |
| Climate-controlled houses | Specification | **PENDING** | Omit |
| Daily production capacity | Production records | **PENDING** | Omit — do not estimate |
| Delivery coverage | Operations confirmation | **PENDING** | Omit |
| Same-day delivery | Operations confirmation | **PENDING** | **Withdraw** |
| Own refrigerated fleet | Fleet list | PARTIAL — trailers visible | Say "refrigerated distribution" without figures |
| Export markets served | Shipping records | **PENDING** | **Never invent.** Use "export-ready" framing |
| Retail listings / named customers | Written permission | **PENDING** | Omit entirely |
| Testimonials | Real, consenting, named customers | **PENDING** | **Omit — existing ones appear fabricated** |
| 100% Saudi production | Company statement | Company claim | Acceptable as an attributed company statement |

### 7.1 Immediate exposure

Until the certification evidence arrives, **the live site is publishing four unverified regulatory claims** (ISO 22000, HACCP, SFDA, Halal). Phase 01 flagged this; Phase 02 restates it because the corrected audience — professional buyers and importers — is precisely the audience that verifies certifications. **Recommendation: withdraw from the live marquee now, ahead of the redesign, rather than carry the exposure through the whole project.**

---

## 8. Product Information Schema

### 8.1 Product entity

```
Product
├── id                        string          required
├── name_ar / name_en         string          required   CONFIRMED: white table eggs
├── slug                      string          required   Latin, both trees
├── category                  enum            required   table_egg
├── shell_colour              enum            required   CONFIRMED: white
├── description_ar / _en      rich text       required   PENDING copy
├── grades[]                  Grade[]         required   CONFIRMED S/M/L/XL (C5)
├── pack_formats[]            PackFormat[]    required   PENDING (C5)
├── storage_conditions        string          required   PENDING
├── shelf_life                object          required   PENDING — days + conditions
├── grading_standard          string          required   PENDING — SASO / EU / other
├── certifications[]          ref             optional   PENDING
├── assets[]                  Asset[]         required   MISSING — packshots do not exist
└── availability_note         string          optional   PENDING
```

### 8.2 Grade entity — **all values PENDING (C5)**

```
Grade
├── code              enum      required   S | M | L | XL
├── label_ar / _en    string    required
├── weight_min_g      number    required   PENDING
├── weight_max_g      number    required   PENDING
├── standard_ref      string    required   PENDING
└── typical_use_ar/en string    optional   PENDING
```

| Grade | Label AR | Weight range | Status |
|---|---|---|---|
| S | صغير | — g | **PENDING** |
| M | متوسط | — g | **PENDING** |
| L | كبير | — g | **PENDING** |
| XL | كبير جداً | — g | **PENDING** |

> The weight bands must come from the standard the company actually grades to. **They must not be copied from a generic reference** — an importer will check them against the delivered product.

### 8.3 Pack format entity — **all values PENDING (C5)**

```
PackFormat
├── code                    string    required   PENDING
├── name_ar / name_en       string    required   PENDING
├── eggs_per_unit           number    required   PENDING
├── units_per_carton        number    required   PENDING
├── eggs_per_carton         number    required   PENDING
├── carton_dimensions_mm    object    required   PENDING
├── gross_weight_kg         number    required   PENDING
├── net_weight_kg           number    required   PENDING
├── material                string    required   PENDING — pulp / plastic / printed carton
├── barcode_ean             string    optional   PENDING
├── sku                     string    optional   PENDING
├── pallet_configuration    object    required for export   PENDING
├── cartons_per_pallet      number    required for export   PENDING
└── container_capacity      object    optional   PENDING — 20ft / 40ft reefer
```

> **The existing "individual carton / 30-tray / 360-box" data in the codebase is superseded and must not be carried forward (C5).** Phase 01 also observed at least two distinct real pack formats in the facility imagery — printed pulp trays and white printed cartons — which suggests the true range differs from what is coded.

### 8.4 Export-specific fields

`pallet_configuration`, `cartons_per_pallet` and `container_capacity` are **not optional for the export audience**. An importer's first question after price is *"how many cartons per 40ft reefer?"* Without it, `/export-enquiry` receives unqualified enquiries and your team does the arithmetic by email on every one.

---

## 9. Quote & Export-Enquiry Form Requirements

### 9.1 Shared requirements — both forms

| Requirement | Detail |
|---|---|
| **Real backend** | **BLOCKING.** Phase 01 confirmed there is no backend — the current form only opens a WhatsApp deep link, with no delivery guarantee, no record and no spam protection. A B2B quote pipeline cannot run on this. |
| Delivery | Email to a monitored inbox + persistent record (database or CRM) |
| Autoresponder | Bilingual acknowledgement stating a response-time commitment **[PENDING: what commitment?]** |
| Language | Payload and autoresponder must follow the **user's** language. Phase 01 found the message body hard-coded in Arabic regardless of language — must not survive |
| Spam protection | Server-side; no visible CAPTCHA if avoidable |
| Validation | Inline, bilingual, RTL-correct |
| Privacy | Explicit consent checkbox + link to `/privacy` **[PENDING: policy does not exist]** |
| Accessibility | Labelled controls, keyboard-navigable, error messages tied to fields |
| Fallback | Phone, email and WhatsApp visible alongside every form |
| Anti-pattern | **Do not gate specifications behind the form.** B2B buyers abandon rather than trade contact details for a weight table |

### 9.2 `/request-a-quote` — domestic

| Field | Type | Required |
|---|---|---|
| Company name | text | Yes |
| Contact name | text | Yes |
| Business type | select — distributor / wholesaler / supermarket / hotel / restaurant / bakery / catering / other | Yes |
| City / region | select | Yes |
| Phone | tel, LTR-forced | Yes |
| Email | email | Yes |
| Grades required | multi-select S/M/L/XL | Yes |
| Pack format | select | Yes |
| Estimated volume | number + unit | Yes |
| Delivery frequency | select — daily / weekly / monthly / one-off | Yes |
| Preferred start date | date | No |
| Notes | textarea | No |
| Consent | checkbox | Yes |

### 9.3 `/export-enquiry` — international

| Field | Type | Required |
|---|---|---|
| Company name | text | Yes |
| Contact name + role | text | Yes |
| Country | select | Yes |
| Business type | select — importer / distributor / trader / retail chain / food service | Yes |
| Email + phone (with country code) | email / tel | Yes |
| Destination port or city | text | Yes |
| Grades required | multi-select | Yes |
| Estimated volume per shipment | number + unit | Yes |
| Shipment frequency | select | Yes |
| Preferred Incoterm | select — EXW / FOB / CFR / CIF / other | Yes |
| Required certifications | multi-select + other | Yes |
| Packaging/labelling requirements | textarea | No |
| Target start date | date | No |
| Consent | checkbox | Yes |

**Why the export form is longer:** every field here is a question your team would otherwise ask in the first reply. Capturing them up front converts a two-week email thread into a single substantive response — which, per §4.2, **is** the conversion event.

### 9.4 Routing — PENDING

Enquiries should route by segment and geography to the right person. **PENDING: who owns domestic quotes, and who owns export enquiries?** If it is one person today, the forms still separate cleanly for when it is not.

---

## 10. SEO Keyword Clusters

> **Method note.** These clusters are **PROPOSED hypotheses** derived from the corrected audience definition and the site's actual offer. **No search-volume, difficulty or competition data has been retrieved** — the connected keyword-research tooling was unavailable during this phase. **Every cluster requires validation against real volume data before Phase 03 commits page titles.** No volumes are stated here because none were measured.

### 10.1 Cluster A — Saudi domestic wholesale (Arabic, primary)

| Theme | Example terms | Target page |
|---|---|---|
| Supplier intent | مورد بيض، موردين بيض بالجملة، شركات بيض في السعودية | `/` , `/partners` |
| Wholesale intent | بيض بالجملة، أسعار بيض الجملة، بيع بيض جملة | `/partners`, `/request-a-quote` |
| Product intent | بيض أبيض، بيض مائدة، أحجام البيض، بيض حجم كبير | `/products`, `/products/white-table-eggs` |
| Geographic | مورد بيض الرياض، بيض سعودي، مزارع بيض السعودية | `/`, `/production` |
| Producer intent | شركة إنتاج بيض، مزرعة بيض، مصنع تدريج بيض | `/production` |

### 10.2 Cluster B — Saudi domestic B2B (English)

| Theme | Example terms | Target page |
|---|---|---|
| Supplier | egg supplier Saudi Arabia, egg suppliers Riyadh, wholesale egg supplier KSA | `/en`, `/en/partners` |
| Producer | egg producer Saudi Arabia, egg farm Saudi Arabia, egg grading facility | `/en/production` |
| Food service | eggs for hotels Saudi Arabia, bulk eggs restaurants, catering egg supplier | `/en/partners` |
| Product | white table eggs, egg size grades, graded white eggs wholesale | `/en/products` |

### 10.3 Cluster C — GCC regional

| Theme | Example terms | Target page |
|---|---|---|
| Regional supply | egg supplier GCC, eggs supplier UAE import, egg supplier Qatar / Kuwait / Bahrain / Oman | `/en/distribution` |
| Cross-border | egg export Saudi Arabia to UAE, GCC egg trade, egg distributor Gulf | `/en/distribution`, `/en/export-enquiry` |
| Arabic regional | تصدير بيض، مورد بيض الخليج، استيراد بيض | `/distribution` |

### 10.4 Cluster D — International export

| Theme | Example terms | Target page |
|---|---|---|
| Exporter intent | egg exporter Saudi Arabia, Saudi egg export company, table egg exporter Middle East | `/en`, `/en/distribution` |
| Trade intent | fresh eggs FOB, white shell eggs export, table eggs bulk export, eggs 40ft reefer | `/en/export-enquiry` |
| Compliance intent | halal certified eggs supplier, HACCP eggs exporter, ISO 22000 egg producer | `/en/quality` **[BLOCKED on certificates]** |
| Origin intent | eggs from Saudi Arabia, Saudi origin table eggs | `/en/about` |

### 10.5 Cluster E — Compliance & quality (both languages)

| Theme | Example terms | Target page |
|---|---|---|
| Certification | شهادات جودة البيض، بيض معتمد، egg supplier certifications | `/quality` **[BLOCKED]** |
| Process | تدريج البيض، فحص البيض بالإضاءة، egg candling, egg grading standards | `/quality`, `/production` |
| Safety | سلامة الغذاء بيض، تتبع البيض، egg traceability, egg food safety | `/quality` |

### 10.6 Strategic observations

1. **Cluster A is where near-term revenue is.** Arabic wholesale supplier intent is the highest-commercial-intent, lowest-difficulty group available.
2. **Cluster D is where the positioning is.** Export queries are lower volume and higher difficulty, but they are the "إلى العالم" half. Treat as a 12-month play, not a quick win.
3. **Cluster E is entirely blocked on certificates.** It is also the cluster where a small supplier can most credibly outrank larger ones — because most competitors publish certification *logos* without *documentation*. Publishing real certificate detail is a genuine differentiator. **This raises the commercial value of the PENDING certificates well beyond compliance.**
4. **Do not chase consumer queries** (بيض طازج للبيع, egg prices). Contradicts C8 and attracts unqualifiable traffic.
5. **Remove brown/organic terms** from all metadata until those lines are confirmed to exist (§6.5).

---

## 11. Per-Page Title, Search Intent & Target Keyword Group

> Titles below are **PROPOSED patterns**, not final copy, and are subject to §10's validation caveat. Final titles are written in Phase 03.

| Page | Search intent | Primary cluster | Title pattern (AR) | Title pattern (EN) |
|---|---|---|---|---|
| `/` | Navigational + supplier discovery | A | شركة بيض العائلة للتجارة — مورد بيض مائدة أبيض من السعودية | Family Eggs — Saudi White Table Egg Producer & Supplier |
| `/about` | Company evaluation, trust | A, D | من نحن — خبرة تتجاوز 60 عاماً في إنتاج البيض | About Us — 60+ Years of Experience in Egg Production |
| `/products` | Product & specification | A, B | منتجاتنا — بيض مائدة أبيض بأحجام S وM وL وXL | Our Products — White Table Eggs in S, M, L, XL Grades |
| `/products/white-table-eggs` | Technical specification | A, B | بيض المائدة الأبيض — المواصفات والأحجام والتعبئة | White Table Eggs — Specifications, Grades & Packaging |
| `/quality` | Compliance verification | E | الجودة والمطابقة — التدريج والفحص والشهادات | Quality & Compliance — Grading, Inspection & Certification |
| `/production` | Capability assessment | A, D | الإنتاج والمرافق — تدريج وتعبئة آلية | Production & Facilities — Automated Grading & Packing |
| `/distribution` | Logistics feasibility | C, D | التوزيع والتصدير — التغطية وسلسلة التبريد | Distribution & Export — Coverage, Cold Chain & Capability |
| `/partners` | Commercial partnership | A, B | للشركاء التجاريين — الموزعون والتجزئة والضيافة | For Business Partners — Distributors, Retail & Food Service |
| `/request-a-quote` | Transactional | A, B | اطلب عرض سعر | Request a Quote |
| `/export-enquiry` | Transactional (export) | D | استفسار تصدير | Export Enquiry |
| `/contact` | Navigational | — | تواصل معنا | Contact Us |

### 11.1 Title rules

- Arabic titles must not be transliterations of the English. Both are written natively.
- Keep the brand name in the title only where it aids recognition — not on every page.
- **No page title may contain an unverified claim** (no "certified", no "leading", no "largest").
- `/about` titles reference the 60+ years as **experience**, never as company age (C6).

---

## 12. Asset Map — Which Existing Asset Supports Which Section

Assets are from Phase 01 §5–§7. **Every entry is subject to the placeholder policy in §13.**

| Section | Best available asset | Type | Status | Gap |
|---|---|---|---|---|
| Home Hero | `04_farm-dusk_restored_4K.png` (5504x3072, no watermark) | AI-restored still | **PLACEHOLDER — strongest available** | Real golden-hour photography |
| Home §2 Heritage | — | — | **NONE** | Owner/family portrait — **cannot be AI-generated (C3)** |
| Home §3 Automation | `03_grading-line_restored_5504px.png` (MOBA line) | AI-restored still | **PLACEHOLDER — watermarked** | Clean version; real photography |
| Home §4 Products | — | — | **NONE** | **Product packshots — the single biggest asset gap** |
| Home §5 Quality | `05_candling-line_NOWATERMARK_4K.png` / `06_candling-hall_NOWATERMARK_4K.png` | AI-restored still | **PLACEHOLDER — no watermark** | Certificate scans; real candling macro |
| Home §6 Solar | `04_farm-dusk` (arrays visible) | AI-restored still | **PLACEHOLDER — wide only** | Solar detail photography |
| Home §7 Distribution | Video 0:00–0:16 (refrigerated trailers); `WhatsApp Image ...6.45.57 (1).jpeg` (logistics yard) | 848x478 video / 720p still | **WEAK** | Fleet and cold-room photography |
| Home §8 Conversion | — | — | **NONE** | Design-led; no photography required |
| `/about` | — | — | **NONE** | Portrait, archive imagery, timeline material |
| `/products` + detail | — | — | **NONE** | **Packshots per grade and pack format** |
| `/quality` | `02` / `05` / `06` candling stills | AI-restored | **PLACEHOLDER** | Certificate scans **[BLOCKING]** |
| `/production` | `02`, `03`, `05`, `06` + video 1:16–2:45 | AI-restored + video | **PLACEHOLDER — best-covered page** | Hen-house interior, properly lit |
| `/distribution` | Video 0:00–0:16; logistics-yard still | Weak | **WEAK** | Fleet, cold chain, port/export imagery |
| `/partners` | — | — | **NONE** | Design-led |
| Forms / `/contact` | — | — | — | Accurate map coordinates **[PENDING]** |
| `og:image` (all pages) | — | — | **NONE** | Branded social card — **BLOCKED on new logo (C1)** |
| Favicon set | — | — | **NONE** | **BLOCKED on new logo (C1)** |

### 12.1 Video usage

Per Phase 01 §7, the usable material sits in **0:00–2:45** of a 848x478 source. At that resolution it **cannot** carry a full-bleed desktop background.

**Recommended use, pending the original 4K files:**

| Timecode | Use | Constraint |
|---|---|---|
| 2:05–2:20 (conveyor) | Small framed loop, `/production` | Muted, no controls, short loop |
| 2:20–2:45 (candling) | Small framed loop, `/quality` | Same |
| 1:06–1:16 (facility scale) | Framed loop, `/about` or `/distribution` | Same |
| 0:00–0:16 (trailers) | Framed loop, `/distribution` | Same |

**Do not use** 0:16–0:35, 3:25–4:03 or 5:00–5:21 (Phase 01 assessed these as weak). **Do not** use the AI push-in clip in `generated/_rejected/`.

### 12.2 Coverage summary

| Section coverage | Count |
|---|---|
| Adequately supported by placeholders | 4 of 8 homepage sections |
| **Zero assets available** | **4 of 8** — Heritage, Products, Conversion, and all packshot needs |

**The Products sections cannot be designed at all until packshots exist.** This is the hard dependency for Phase 03.

---

## 13. Placeholder Policy for AI-Enhanced Imagery

Binding policy, derived from C3.

### 13.1 Permitted

| Use | Condition |
|---|---|
| Environment and facility backgrounds | Must be labelled internally as placeholder |
| Machinery and production-line imagery | Same |
| Layout and composition development | Same |
| Internal review, wireframes, design comps | Same |

### 13.2 Prohibited — absolute

| Prohibited use | Reason |
|---|---|
| **Documentary or evidential claims** | Detail is interpolated, not photographed. Cannot support a factual assertion. |
| **Authentic staff photography** | Faces are reconstructed. Presenting them as "our team" on a brand built on family authenticity is a credibility risk that is not worth taking (C3). |
| **Certificate, document or label imagery** | Text is reconstructed and may be wrong. |
| **Product packshots** | Packaging detail would be fabricated. |
| **Any claim of photographic provenance** | — |
| **Generating new people** | Never. |

### 13.3 Operating rules

1. **Register every AI-derived asset** — source frame, tool, date, operator — in an asset manifest committed with the project.
2. **Filename convention** must carry the status, e.g. `PLACEHOLDER_AI_production-line_v1.png`, so no one downstream mistakes it for a camera original.
3. **Watermarked variants** (`02`, `03`) must be replaced with clean versions before any use.
4. **Inspect at 100%** before publication — AI artefacts concentrate in faces, text and repeating structures.
5. **Every placeholder is a tracked debt item** with a named replacement in the shoot brief.
6. **Pre-launch gate:** a launch review must confirm which placeholders remain. **A placeholder in a section making a factual claim blocks launch.**
7. **Never in `og:image` or press material** — those get redistributed beyond your control.

### 13.4 Recommended launch posture

**Recommendation: launch with zero AI imagery in claim-bearing sections.** Placeholders are acceptable during design and internal review; for a B2B audience that verifies suppliers, shipping AI-reconstructed facility imagery as if it were documentation is a disproportionate risk against a modest visual gain. Where a real photograph does not exist by launch, prefer a design-led section without imagery over a synthetic one.

---

## 14. Missing Assets & Company Confirmations

Consolidated and prioritised. **Items marked BLOCKING prevent a page from existing at all.**

### 14.1 Blocking — a page cannot ship without these

| # | Item | Blocks |
|---|---|---|
| 1 | **New official logo** (vector, colour/mono/reversed, AR+EN lockup) + official palette + typography spec | **All visual design**, favicon, `og:image` |
| 2 | **Certification evidence** — name, issuing body, certificate number, validity, scan, for each of SFDA / ISO 22000 / HACCP / Halal / GMP | `/quality`, Home §5, Cluster E, the entire supermarket & hotel journey |
| 3 | **Export status** — do you export today, or is this capability? If yes: markets, documentation, Incoterms, port | `/distribution`, `/export-enquiry`, Cluster D |
| 4 | **Product specifications** — grade weight bands, grading standard, pack formats, dimensions, weights, pallet config | `/products`, `/products/white-table-eggs`, both forms |
| 5 | **Product packshots** — all pack formats, studio-lit, multiple angles, clipping paths | `/products`, Home §4 |
| 6 | **Form backend decision** — where enquiries are delivered and stored | `/request-a-quote`, `/export-enquiry` |

### 14.2 High priority — a page ships weaker without these

| # | Item | Affects |
|---|---|---|
| 7 | **Original 4K drone/camera files** — zero cost, upgrades every video and still recommendation | All imagery |
| 8 | **Daily production capacity** | `/production`, Home §3, Journey A |
| 9 | **Company establishment year** + CR / VAT numbers | `/about`, footer |
| 10 | **Owner name and consent** + earlier-farm reference | `/about`, Home §2 |
| 11 | **Domestic delivery coverage and frequency** | `/distribution`, Journey A |
| 12 | **Fleet size and refrigeration specification** | `/distribution` |
| 13 | **Grading line confirmation** (MOBA Omnia XF 220?) + throughput | `/production` |
| 14 | **Shelf life basis + storage conditions** | `/products`, `/quality` |
| 15 | **Traceability mechanism** | `/quality` |
| 16 | **MOQ, lead time and terms per partner segment** | `/partners`, forms |
| 17 | **Confirmed public email** + response-time commitment | Global, forms |
| 18 | **Brown / organic — do these lines exist?** | `/products`, all metadata |

### 14.3 Photography & media to commission

| # | Item | For |
|---|---|---|
| 19 | Owner / family portrait — **cannot be AI-generated** | `/about`, Home §2 |
| 20 | Staff photography with consent — real faces, real hands | Home §3, `/production`, `/quality` |
| 21 | Hen-house interior, properly lit | `/production` |
| 22 | Fleet, cold room, loading | `/distribution` |
| 23 | Solar installation detail | Home §6 |
| 24 | Golden-hour farm photography (real) | Home hero |
| 25 | Certificate scans, clean and legible | `/quality` |
| 26 | Macro egg and shell texture | Throughout |
| 27 | Export/port imagery if exporting | `/distribution` |

### 14.4 Legal & administrative

| # | Item |
|---|---|
| 28 | Privacy policy and terms — **required before any form goes live** |
| 29 | Real social media URLs, or a decision to remove the icons |
| 30 | Exact farm coordinates |
| 31 | Staff photography consent status |
| 32 | Whether the three coded testimonials are real, consenting customers — **if not, delete from the codebase** |
| 33 | Decision on the unlicensed third-party YouTube clip in the repository |
| 34 | Enquiry routing ownership — who handles domestic vs export |

---

## 15. Platform Recommendation — Retain Angular 20 or Rebuild

### 15.1 Recommendation

> **Retain Angular 20 and add `@angular/ssr` prerendering.** Rebuild is not justified by the evidence.

### 15.2 What is actually being kept vs discarded

The corrected brief (C9: no card grids, no rounded rectangles, no gradients; C10: new typography; C1: new logo) means **almost every existing component is discarded regardless of platform.** So the honest question is: what survives a redesign, and is it worth the framework?

| Asset | Lines | Survives redesign? | Cost to rebuild elsewhere |
|---|---|---|---|
| `MotionService` — GSAP + Lenis, RTL-aware `dirSign` | 284 | **Yes** | High — this is genuinely hard, and Phase 01 found it correct |
| i18n architecture — typed dictionary, signals, `dir` sync | 456 | **Yes** | Medium |
| RTL patterns — logical properties, `:host-context` | throughout | **Yes** | High — Phase 01 called RTL "the strongest part of the implementation" |
| Section components | ~2,100 | **No** — C9 discards them | — |
| Design tokens | 367 | **No** — C1/C2 discard the palette | — |

**Roughly 740 lines of hard-won, verified-correct bilingual RTL and motion work survives.** That is the real asset, and it is the part that is expensive and error-prone to rebuild.

### 15.3 Objective trade-offs

| Criterion | Retain Angular 20 + SSR/prerender | Rebuild (e.g. Astro / Next.js) |
|---|---|---|
| **SEO** | Fully solved by prerendering. Static HTML per route per language; correct per-language canonical/hreflang. For 20 static routes (10 pages x 2 languages) prerendering is the right tool — SSR is not required. | Equivalent. Astro is static-first by default. **No SEO advantage to rebuilding once prerendering is in place.** |
| **SSR / prerendering** | `@angular/ssr` is first-party and mature in Angular 20. Changes build output and the Railway start command — needs one deployment test. **Moderate, well-understood risk.** | Native and zero-config in Astro/Next. **Slightly lower friction, not a decisive gap.** |
| **Performance** | Current baseline 78 kB initial transfer, build green in 9.6 s. Prerendered pages ship HTML first. Zone.js removal (already close — signals + `OnPush` throughout) trims ~34 kB. **Good, not best-in-class.** | Astro ships ~0 kB JS by default — **genuinely better** for a content site. Real but modest gain; the dominant weight will be imagery, not framework. |
| **Image optimisation** | **Angular's `NgOptimizedImage` handles lazy-loading, priority hints and srcset — but does not transform formats.** AVIF/WebP generation requires a build step or an image CDN. **This is the weakest point of retaining Angular.** | Astro's `<Image>` transforms formats at build time via sharp. **Clear advantage** for a site about to onboard heavy photography. |
| **Bilingual routing** | Must be built — Angular has no opinionated i18n routing for this pattern. The dictionary and `dir` handling already exist; the routing layer does not. **Moderate work.** | Astro/Next ship i18n routing conventions. **Advantage, but the hard half — RTL and typed content — would have to be ported anyway.** |
| **Maintenance** | Single framework, already configured, deploys today on Railway. No CMS yet — content in TypeScript. | Fresh start invites a CMS decision at the right moment. But introduces a second toolchain the team may not know. |
| **Implementation risk** | **Low.** Working deployment, working build, working RTL, known behaviour. Redesign proceeds page by page. | **High.** Everything is re-derived at once — RTL, motion, i18n, deployment — while the brand is *also* being redefined. **Two large uncertainties at the same time.** |
| **Time to first page** | Fast — scaffolding exists | Slow — days before the first page renders |
| **Cost** | Redesign only | Redesign + re-platform |

### 15.4 Why retain

1. **The bottleneck is not the framework.** Phase 01's central finding, reinforced by the corrections, is that the project is blocked on **brand identity, assets and verified content** — items 1–6 in §14.1. None is unblocked one hour sooner by changing framework. **Re-platforming spends budget on the one axis that is not constraining.**
2. **The surviving code is the expensive code.** RTL-correct motion and bilingual direction handling is where projects like this usually fail. It is built and Phase 01 verified it works.
3. **Prerendering closes the entire SEO gap.** Every SEO defect found in Phase 01 — no canonical, no hreflang, no `og:image`, CSR-only, `robots.txt`/`sitemap.xml` serving the SPA shell — is fixable within Angular. **None requires a different framework.**
4. **Risk concentration.** The brand is being redefined and the logo does not yet exist. Adding a platform migration on top means that if something looks wrong, you cannot tell whether it is the design, the brand or the platform.
5. **20 static routes is a small surface.** The scale argument for a content-optimised framework does not bite at 10 bilingual pages.

### 15.5 The honest counter-argument

**Astro is objectively the better tool for this *category* of site** — content-led, image-heavy, SEO-driven, minimal interactivity. If this project were starting from zero today, Astro would be the recommendation, primarily for **build-time image transformation**, which is where Angular genuinely lags and where this site is about to feel real pressure.

**The recommendation to retain is therefore about sunk value and risk, not about Angular being the superior tool.**

**Reconsider a rebuild if any of these becomes true:**

- A CMS is adopted and Angular's integration proves awkward
- The site grows well beyond ~10 pages per language
- Prerendering fails its deployment test on Railway
- The image pipeline becomes a recurring maintenance burden that an image CDN cannot solve
- The team maintaining it long-term does not know Angular

### 15.6 Required technical work if retaining

| # | Work | Priority |
|---|---|---|
| 1 | Add `@angular/ssr`, configure prerendering for all bilingual routes, deployment-test on Railway | **Critical** |
| 2 | Build bilingual routing (`/` + `/en`) with per-language metadata, canonical and hreflang | **Critical** |
| 3 | Fix `splitTextIn()` DOM/binding bug — blocks the language switcher (§3.4) | **Critical** |
| 4 | Create `public/` (declared in `angular.json`, does not exist) and establish the image pipeline — responsive AVIF/WebP via build step or image CDN | **Critical** |
| 5 | Implement the form backend with delivery, storage and spam protection | **Critical** |
| 6 | Real `robots.txt` and `sitemap.xml` with hreflang annotations; verify `serve -s` serves them | High |
| 7 | Replace the design-token layer once the official brand arrives | High — **BLOCKED on C1** |
| 8 | Add analytics **before** the redesign ships, to preserve a baseline | High |
| 9 | Commit the pending email fix (currently uncommitted, publishing a personal Hotmail address) | High |
| 10 | Fix the reveal animations stranding 4 elements at `opacity: 0` | Medium |
| 11 | Fix or remove the blank map embed; add real coordinates | Medium |
| 12 | Remove zone.js (app is already signals + `OnPush` throughout) | Medium |
| 13 | Point `www.familyeggs.sa` at the apex | Low |
| 14 | Resolve the unlicensed third-party clip in the repository | Low |

---

## 16. What Phase 03 Cannot Start Without

| Dependency | Status | Blocks |
|---|---|---|
| New official logo, palette, typography (C1, C2, C10) | **In preparation** | All visual design |
| Certification evidence | **PENDING** | `/quality`, trust content, Cluster E |
| Export status answer | **PENDING** | `/distribution`, `/export-enquiry`, the entire export half |
| Product specifications (C5) | **PENDING** | `/products`, both forms |
| Product packshots | **MISSING** | `/products`, Home §4 |
| Approval of this IA | **Awaiting your review** | Everything |

### 16.1 Suggested Phase 03 scope, once unblocked

1. Wireframes for all 10 page types, bilingual, at three breakpoints
2. Content model implementation spec derived from §6 and §8
3. Photography shoot brief derived from §14.3 and the approved art direction
4. Copy brief for human writers — what to write, per section, with the evidence gate from §7 attached
5. Keyword validation against real volume data (§10's caveat)
6. Design-system foundations — **only once the official brand arrives**

---

## Appendix — Open Questions Requiring a Decision (not data)

These are choices only you can make. They are not blocked on the company supplying information.

| # | Question | Default if undecided |
|---|---|---|
| 1 | Approve the 9-page sitemap, or adjust? | As proposed in §1 |
| 2 | Approve `/` + `/en` URL strategy? | As proposed in §3 |
| 3 | Is the credibility strip (§5.2) wanted? | Include if data arrives; omit otherwise |
| 4 | Should `/quality` ship at launch without certifications, or wait? | **Recommendation: ship without certification claims, describing process only** |
| 5 | Is a CMS in scope? | No CMS for launch; revisit post-launch |
| 6 | Blog/news — is there a publishing commitment? | Omit |
| 7 | Launch posture for AI placeholders (§13.4) | **Recommendation: zero AI imagery in claim-bearing sections** |
| 8 | Withdraw the live certification marquee now, or at redesign? | **Recommendation: now** |
| 9 | Retain Angular (§15)? | Retain |

---

*End of Phase 02. No code, styles, components or copy were written or modified. Awaiting review before Phase 03.*
