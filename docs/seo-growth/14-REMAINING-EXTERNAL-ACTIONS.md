# 14 — Remaining External Actions

Everything here needs access, credentials, money or a business decision that wasn't available. Each item says who acts and what "done" looks like.

## 1. Release (blocks everything else)

| # | Action | Who | Notes |
|---|---|---|---|
| 1.1 | Review and merge branch **`release/seo-growth`** | Owner / developer | Committed locally in clean commits, not pushed or deployed. Full procedure: [16](16-RELEASE-CHECKLIST.md) |
| 1.2 | Smoke test after deploy | Developer | [16](16-RELEASE-CHECKLIST.md) §5 |
| 1.3 | Owner sign-off on new copy and the privacy notice | Owner | [08](08-CONTENT-STRATEGY.md) §3 |

## 2. Cloudflare (DNS / edge)

| # | Action | Why |
|---|---|---|
| 2.1 | Add a proxied `www` record (CNAME → `familyeggs.sa`) and a **Redirect Rule**: `www.familyeggs.sa/*` → `https://familyeggs.sa/$1`, 301 | `www` currently gives a DNS error |
| 2.2 | **Cache Rule** for HTML: cache eligible, edge TTL ~5–15 min, respect origin for assets | HTML TTFB is ~1.0–1.9 s because every request goes to Railway in Paris. Edge caching serves Saudi visitors from a nearby PoP. Purge on deploy, or keep the TTL short |
| 2.3 | Optionally move the Railway service to a region nearer KSA, if one is available on the plan | Reduces uncached TTFB |
| 2.4 | Enable Cloudflare Web Analytics | Cookieless traffic data, no code |
| 2.5 | Add the Search Console TXT verification record | See [13](13-ANALYTICS-AND-SEARCH-CONSOLE.md) |
| 2.6 | Purge the cache after any `tools/build-media.py` run | Media names aren't hashed; cached 7 days |
| 2.7 | SSL/TLS → **Minimum TLS version 1.2** | TLS 1.0 is accepted today (verified) |
| 2.8 | Turnstile widget for `familyeggs.sa` | Its two keys protect the enquiry form ([16](16-RELEASE-CHECKLIST.md) §4) |
| 2.9 | Cache Rule: bypass `/api/*` | Dynamic endpoint (the origin also sends `no-store`) |

## 3. Server-side enquiry delivery (implemented; needs credentials)

The code is done and tested (`server/inquiry.mjs`, 23 automated tests including a real SMTP exchange with a local server). It stays **off** until these are set in Railway Variables: `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`, optional `INQUIRY_TO`, and (recommended) `TURNSTILE_SITE_KEY` + `TURNSTILE_SECRET_KEY`. Exact values and a verification procedure are in [16](16-RELEASE-CHECKLIST.md) §4.

**Not verified:** delivery through the real Migadu SMTP server, since no credentials were available. Send one test enquiry right after configuring.

## 4. Google and other accounts

| # | Action | Detail |
|---|---|---|
| 4.1 | Search Console domain property, sitemap, request indexing | [13](13-ANALYTICS-AND-SEARCH-CONSOLE.md) §3 |
| 4.2 | GA4 property, Measurement ID in code, key events | [13](13-ANALYTICS-AND-SEARCH-CONSOLE.md) §3 |
| 4.3 | Bing Webmaster Tools | Import from Search Console |
| 4.4 | **Google Business Profile**: check whether one exists before creating anything. If none, create one for the **head office** (Al Rabwah, Riyadh) and decide whether the **farm** (Marat) should have one (only if it receives visitors or deliveries; Google requires in-person contact at the location). Category suggestion: "Egg supplier" / "Poultry farm" (choose from Google's list). Use the verified phone, the website `https://familyeggs.sa/ar`, and the real photos already in `../videos` and `../generated` | Do not create duplicates; claim any existing listing instead |
| 4.5 | Apple Business Connect, Bing Places | Same data as the Business Profile; Bing can import it |
| 4.6 | Semrush API units, if keyword data is wanted | [04](04-KEYWORD-RESEARCH.md) §4 |

## 5. Business facts needed (unblocks content)

| Needed | Unblocks |
|---|---|
| SFDA / MEWA licence numbers; any Saudi GAP, ISO 22000, HACCP, Halal certificates | Quality & licences page, the strongest missing trust signal |
| Gram range per grade | Product detail, spec sheet |
| Carton and pallet dimensions | Spec sheet PDF |
| Delivery regions, lead times, MOQ | Wholesale page specifics |
| Whether export is actually wanted, and export eligibility status | Keep, adjust or remove `/international` |
| Social media accounts (if any) | `sameAs` in Organization JSON-LD, footer icons |
| Re-confirmation that 430,000 / 1,200 / 600,000 / 200,000 / 60 years are current | All pages |

## 6. External visibility (prioritised; nothing registered)

No accounts were created and nothing was paid for. In order:

1. **Google Business Profile** (free).
2. **Made in Saudi / Saudi Exports (SEDA)** listing and the "Import from Saudi" programme: the most relevant official channel to GCC buyers. Check eligibility and fees.
3. **Riyadh Chamber** membership directory (tied to the CR; probably already a member).
4. **Trade shows:** Gulfood (Dubai, Mar 2027; the UAE is the largest GCC importer) and Middle East Poultry Expo / Saudi Food Show. Exhibitor pages also rank and link well. SEDA may subsidise national pavilions.
5. **Apple Business Connect / Bing Places** (free).
6. **Tridge** (agri-food B2B; check terms).
7. **Kompass / Europages:** free basic listings only.
8. **Avoid:** Alibaba Gold Supplier (pay-to-play, poor fit for perishable short-haul trade), paid directory bundles, link packages and generic "Saudi business directory" sites.

Sources are in [research-competitors-raw.md](research-competitors-raw.md), Part C.
