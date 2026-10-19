# 13 — Analytics and Search Console

## 1. What was found

| Property | Finding | Evidence |
|---|---|---|
| Google Search Console | **Unknown — no access.** No `google-site-verification` TXT record in DNS and no verification meta tag. If a property exists, it is verified some other way | `dig TXT familyeggs.sa` → only SPF and a hosting-email verification |
| Google Analytics 4 | **Not installed** | No `gtag`/`googletagmanager` in the repository or the served HTML |
| Google Tag Manager | **Not installed** | Same |
| Google Business Profile | **Unknown — no access** | — |
| Cloudflare Web Analytics | Unknown (dashboard not accessible) | — |
| Email notifications | **None found.** A read-only search of the connected Gmail account (2026-10-19) for `familyeggs.sa` and for Search Console / Analytics / Business Profile senders returned nothing. That account may not be the one that owns the properties, so this is not proof they don't exist | Gmail search |

**Before installing anything, the owner should check** analytics.google.com and search.google.com/search-console while signed in with every Google account used for the business. If a GA4 property already exists, reuse its Measurement ID; do not create a second one. The site has no tag of its own, so there is no risk of a duplicate installation from the code side.

**So there is no historical data for this audit.** The 16-month Search Console analysis, query/page/country breakdowns, CTR and position work, and the 28-day comparisons could not be done. Nothing in these documents estimates them.

## 2. What was implemented

`src/app/core/analytics.service.ts`:
- Events listed in [09](09-B2B-CONVERSION-STRATEGY.md) §4 are pushed to `window.dataLayer` on every page **today**. No data leaves the browser until a tag is configured.
- **Conversions are honest:** `*_inquiry_submit` fires only when the server has emailed the enquiry. Hand-offs are `inquiry_handoff`; failures are `inquiry_error`. Until SMTP delivery is switched on, the site records **no** conversion events at all.
- `GA4_MEASUREMENT_ID` is empty. Setting it (one line) loads `gtag.js`, configures GA4 and sends the same events to it.
- Consent defaults when GA4 is enabled: `ad_storage`, `ad_user_data`, `ad_personalization` **denied**; `analytics_storage` **granted**. See §4: this is an owner/legal decision.
- One delegated click listener for the whole document, so no duplicate events.

Tested in Chrome ([12](12-QA-TEST-RESULTS.md)): correct event names and parameters, one event per valid submit, none on validation failure, and no PII.

## 3. Setup steps for the owner (in order)

**Search Console (week 1)**
1. Add a **Domain property** for `familyeggs.sa` at search.google.com/search-console and verify it with the TXT record it gives you, in Cloudflare DNS.
2. Sitemaps → submit `https://familyeggs.sa/sitemap.xml`.
3. URL Inspection → *Request indexing* for `/ar/wholesale`, `/en/wholesale`, `/ar/international`, `/en/international`.
4. Also add the property in **Bing Webmaster Tools** (it can import from Search Console).

**GA4 (week 1)**
1. Create a GA4 property (time zone Asia/Riyadh, currency SAR) and a Web data stream for `https://familyeggs.sa`.
2. Copy the Measurement ID (`G-…`) into `GA4_MEASUREMENT_ID` in `analytics.service.ts`, then build and deploy.
3. Admin → Events → mark `wholesale_inquiry_submit`, `distributor_inquiry_submit` and `international_inquiry_submit` as **key events**. These names appear in GA4 only after the first real one fires, so do this after the first server-delivered enquiry, or create them in advance under Admin → Key events → New key event. **Do not** mark `inquiry_handoff`.
4. Admin → Custom definitions → event-scoped dimensions: `buyer_type`, `delivery`, `channel`, `form_location`, `link_location`, `reason`.
5. Link GA4 to Search Console.
6. Verify in DebugView: submit a test inquiry and click the phone link.
7. Setting the ID also switches the privacy notice's analytics paragraph to describe Google Analytics. It reads `ANALYTICS_ENABLED`, so the two cannot disagree.

**Alternative or additional:** Cloudflare Web Analytics is cookieless and needs no code. Enable it in the Cloudflare dashboard for traffic counts with no consent question.

## 4. Privacy and consent (owner / legal decision)

- Saudi Arabia's Personal Data Protection Law (PDPL) is in force. GA4 sets cookies and processes online identifiers.
- The current defaults (analytics granted, ads denied, no banner) are a common pragmatic setup, **not legal advice**. If legal review requires opt-in, add a consent banner and change the `analytics_storage` default to `denied`.
- A **privacy notice** now exists at `/ar/privacy` and `/en/privacy` (noindex, linked from the footer and every form). It describes only what the site actually does. Two policy statements (data rights under the PDPL; retention "only as long as needed") need owner or legal confirmation before launch.
- The inquiry form stores nothing on the site, and analytics never receive form contents.

## 5. Baseline and measurement plan

| When | Metric | Source |
|---|---|---|
| Day 0 (first full day after verification) | Indexed pages, impressions, clicks, average position | Search Console |
| Weekly | Coverage of the six sitemap URLs ("Indexed") | Search Console → Pages |
| Every 28 days vs the previous 28 | Impressions, clicks, CTR, position for (a) brand queries, (b) non-brand, (c) `/wholesale`, (d) `/international` | Search Console. Exclude the last 2–3 days (data delay) |
| Monthly | Inquiry submit events by type and channel vs inquiries actually received | GA4 + sales log |
| Monthly | Field CWV (LCP, INP, CLS at p75), once there is enough traffic | Search Console → Core Web Vitals / CrUX |

**Brand regex for Search Console:** `بيض العائلة|family ?eggs|familyeggs`.

Do not judge the new pages before **8–12 weeks**. New URLs on a low-authority domain take time to be crawled, indexed and ranked.
