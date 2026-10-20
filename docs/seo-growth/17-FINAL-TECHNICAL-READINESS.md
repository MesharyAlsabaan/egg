# 17 — Final Technical Readiness

**Family Eggs · familyeggs.sa · 2026-10-19 · branch `release/seo-growth` (local, not pushed)**

Scope: technical completion only. No visual element was changed: no typography, colour, layout, animation or brand changes. The premium visual redesign starts after this release.

Status labels used throughout:

| Label | Meaning |
|---|---|
| **VERIFIED** | Executed in this session, with the evidence cited |
| **READY — NOT ACTIVATED** | Built and tested; switched off until the owner provides access or credentials |
| **BLOCKED — OWNER ACTION** | Cannot proceed without owner access, a decision or information |
| **NOT TESTED** | Could not be tested here; the reason is given |

---

## 1. State of the work (Step 1)

| Check | Result | Evidence |
|---|---|---|
| Branch | `release/seo-growth`, 7 earlier commits + this round's fixes (§9) on `master` @ `9a3e82e` | `git log master..release/seo-growth` |
| Remote | `origin/master` = `9a3e82e`, unchanged. The branch has **not** been pushed | `git ls-remote origin` |
| Uncommitted genuine changes | None, other than this round's, which are committed in §9 | `git diff -w HEAD` |
| Line-ending noise | 23 files in the Google Drive working tree differ from the branch only in CRLF (24 before this round; `scroll-to.service.ts` now carries a real, committed change). Not committed, not modified | `git diff -w` = 0 insertions / 0 deletions |
| Completed improvements lost? | **No.** Every item in reports 01, 08, 11 and 16 is present in the branch and re-tested below | §3 |
| Deployment configuration | `railway.json`: Nixpacks, `npm run build`, `npm run serve:prod`, health check `/ar` (60 s), restart on failure ×3. All 7 keys valid against Railway's published schema | Schema check |
| Clean reproduction (what Railway does) | `git archive` of the branch → `npm ci` (Node 22.23.3) → `npm run build` → `npm run serve:prod` | §3 rows 1–4 |

## 2. Issues found and fixed in this round (Step 2)

| # | Found | Fix | Evidence |
|---|---|---|---|
| 1 | **Fragment links unreliable:** `/ar#products` landed at the section only some of the time (0–3 of 6 per run under normal load). Causes, found by instrumenting every scroll call: (a) the router's scroll-to-top could run after ours; (b) our scroll used `behavior:'auto'`, which the stylesheet's `scroll-behavior: smooth` turns into an animation that hydration work then cancels | Run after the router's own `Scroll` event (a microtask, no timers), and use `behavior:'instant'` on arrival. In-page clicks keep the smooth scroll | **36 / 36** across 6 runs × 6 cases (390 and 1440 px) |
| 2 | **Privacy notice contained legal assurances** I had written: data rights "in line with the PDPL", a retention period, and "used **only** to…" | Removed or rewritten as factual descriptions. The two policy statements are now an owner decision (§6) | Rendered text audited line by line (§4) |
| 3 | **Notice said the IP is held "briefly"**, but expired rate-limit entries were pruned only once 5,000 IPs accumulated | The server now sweeps every minute, so an IP leaves memory ~10–11 min after its last request. The notice says "about ten minutes" and that it is never logged | Code review + log audit |
| 4 | **Notice omitted the localStorage language key**; a draft line said it "opens in that language next time", which is false in production (the `/` redirect is server-side) | The notice now says the only thing stored in the browser is the last language choice, and that it is never sent anywhere | `i18n.service.ts`, `main.ts` |
| 5 | **Turnstile blocked** (ad-blocker or firewall) left the visitor stuck on "complete the security check" | The form falls back to WhatsApp/email hand-off ("not sent yet"), and the captcha error also offers both channels | Browser test E (§3) |
| 6 | **No client-side timeout** on submit | 45 s abort (longer than the server's worst case of ~43 s), leading to the failure state | Code |
| 7 | SMTP *rejecting* a message (bad credentials, refused sender) was untested | New test: rejected → `502`, no false success | `test:server` 24 / 24 |

## 3. Verification results (Steps 2 and 4)

All executed on 2026-10-19 against the release build, served by `node server/server.mjs`.

| # | Area | Test | Status |
|---|---|---|---|
| 1 | Build | `npm ci` from the lockfile on a clean copy; `npm run build`: 9 routes prerendered, no warnings | **VERIFIED** |
| 2 | Types | `tsc --noEmit` | **VERIFIED** |
| 3 | Production dependencies | `npm audit --omit=dev`: **0 vulnerabilities**. Runtime deps: `nodemailer@10.0.14` (+ Angular, used only at build time) | **VERIFIED** |
| 4 | Railway health check | `GET /ar` with `Host: healthcheck.railway.app` → 200 in 5 ms on the clean build | **VERIFIED** (local simulation) |
| 5 | Arabic / English routing | 8 pages: correct `lang`/`dir`; the language switch keeps the page (`/en/wholesale` → `/ar/wholesale`); nav and footer links; privacy switch | **VERIFIED** |
| 6 | Redirects | `/` → `/ar`; trailing slash; `/x/index.html`; `www` → apex: all 301 with relative or absolute HTTPS location | **VERIFIED** (`test:server`) |
| 7 | Canonical + hreflang | All 8 pages self-canonical; ar / en / x-default reciprocal (x-default `/ar/…`, except `/en/international`); identical to the sitemap | **VERIFIED** (`check:seo` + curl table, §4) |
| 8 | Sitemap / robots | 6 indexable URLs exactly; privacy pages excluded and `noindex, follow`; robots.txt `Allow: /` + Sitemap line | **VERIFIED** |
| 9 | Structured data | One parseable graph per page, Organization everywhere, BreadcrumbList on inner pages, FAQ ↔ visible parity | **VERIFIED** (syntax, types, parity). Google Rich Results Test: **NOT TESTED** (needs a public URL) |
| 10 | Security headers | HSTS (1 y), nosniff, `X-Frame-Options: SAMEORIGIN`, referrer policy, permissions policy, CSP (frame-ancestors / base-uri / object-src / form-action) on every response; `/api/*` `no-store` | **VERIFIED** |
| 11 | Path safety | Traversal (`/../`, `%2e%2e`, `..%2f`), dot-files, build internals → 400 / 404 | **VERIFIED** |
| 12 | Rate limiting | Per IP: 6th request in 10 min → 429. Global: 31st → 429. Expired entries swept every minute | **VERIFIED** (tests); sweep by code review |
| 13 | Spam controls | Origin 403, type 415, size 413, bad JSON 400; honeypot and < 3 s → silent 200, nothing sent | **VERIFIED** |
| 14 | Turnstile | Server: Cloudflare always-pass key → 200, always-fail → 400, missing token → 400. **Browser: the real Cloudflare widget issued a token and the enquiry was emailed (test keys).** Script blocked → hand-off | **VERIFIED** with Cloudflare **test** keys |
| 15 | Form, delivery off | Hand-off: "Continue in WhatsApp" / «المتابعة عبر واتساب»; "ready — not sent yet"; event `inquiry_handoff` only; no conversion | **VERIFIED** (AR + EN) |
| 16 | Form, delivery on | "Send enquiry" → exactly 1 email to `info@familyeggs.sa`, `Reply-To` the visitor, CR/LF header injection blocked; "Your enquiry has been sent" / «تم إرسال طلبك»; conversion event | **VERIFIED** against a local SMTP server |
| 17 | Email error handling | Server unreachable → 502; server rejects → 502; UI: "Your enquiry was not sent", input kept, WhatsApp/email alternatives, `inquiry_error` | **VERIFIED** |
| 18 | Form without JavaScript | `<form action="mailto:info@familyeggs.sa">` in the prerendered HTML | **VERIFIED** (markup) |
| 19 | Rendering | 8 pages × 390 / 820 / 1440 px = **24 / 24**: no overflow, controls ≥ 44 px, links ≥ 24 px, one `<h1>`, no console or HTTP errors | **VERIFIED** |
| 20 | Accessibility | Lighthouse a11y on all 8 pages, mobile + desktop: **100 on all 16 runs** (best practices 100; SEO 100 on the 6 indexable pages; privacy pages SEO 69 = Lighthouse's expected "not crawlable" flag for `noindex`). Labelled fields, `aria-invalid`/`describedby`, `role=alert`/`status`, focus moved to the first error and to the confirmation | **VERIFIED** (automated). Screen-reader walkthrough: **NOT TESTED** |
| 21 | Performance | Interleaved A/B, original `9a3e82e` on `serve` vs release on the new server, mobile, median of 3: `/ar` **51 vs 50**, `/en` **53 vs 54**; LCP 3.54 vs 3.56 s and 3.32 vs 3.34 s; CLS 0 → **no regression**. Desktop LCP 0.75–0.97 s on all pages. Absolute scores on this machine today are depressed: TBT is ~20 s on *both* builds, including the untouched original, so it's an environment artefact (it was 20–27 ms in the first session). Reference numbers: [10](10-PERFORMANCE-REPORT.md) (mobile 93 / desktop 100, normal conditions) | **VERIFIED** (lab). Field data: **NOT TESTED** (needs live traffic) |
| 22 | Privacy notice vs behaviour | Every statement checked against the code (§4) | **VERIFIED** (factual accuracy only, not legal sufficiency) |
| 23 | Real SMTP (Migadu) | — | **NOT TESTED**: no credentials |
| 24 | Safari / Firefox | — | **NOT TESTED**: Chrome only on this machine. Video byte ranges, which Safari needs, are server-tested |

## 4. Privacy notice: statement-by-statement audit

| Statement (EN; the AR version matches) | Matching behaviour | OK |
|---|---|---|
| Details entered are sent to Family Eggs so the company can reply | Form → email to `INQUIRY_TO` (default `info@familyeggs.sa`), or hand-off to the same address / line | ✅ |
| Website keeps no copy | No file, database or cache write in `server/*`; nodemailer streams and discards | ✅ |
| Logs record only whether an enquiry was sent, with type of business, page and language, never contents | The only log lines: `inquiry_sent {buyer, source, lang}`, `inquiry_dropped {reason}`, `inquiry_send_failed {code}`, `config_error`, `server_error {message}` (server faults, no request data), `listening` | ✅ |
| WhatsApp / email option sends from your own app | `wa.me` / `mailto:` hand-off | ✅ |
| Turnstile, when on, receives IP and browser information | Widget loaded from `challenges.cloudflare.com`; server sends `remoteip` to `siteverify` | ✅ |
| Server keeps the IP in memory about ten minutes, never logged | 10-min window + 1-min sweep; no IP in any log line | ✅ (after fix #3) |
| No analytics or advertising cookies; only the last language choice in local storage, never sent | `GA4_MEASUREMENT_ID` empty; key `familyeggs.lang`; no `Set-Cookie` from the origin or from Cloudflare on `/ar` (checked live) | ✅ |
| Analytics paragraph switches when GA4 is enabled | `ANALYTICS_ENABLED` drives the text | ✅ |
| Cloudflare and Railway process technical data such as IP | Both are in the request path (live headers `server: cloudflare`, `x-railway-edge`) | ✅ |
| Contact for questions: `info@familyeggs.sa` | Owner-confirmed address | ✅ |

**Not approved here, and not on the page:** any statement of rights under the PDPL, retention periods, or a lawful basis. These are owner / legal decisions (§6).

## 5. External services (Step 3)

Each service was checked for existence first, using only public DNS/HTTP and the connected Gmail. **No account was opened, no setting changed, and no credential was seen or stored.** Never paste passwords or secret keys into chat, documents, the repository, or Railway's *build* command. They go only in Railway **Variables**.

### 5.1 Cloudflare: DNS, TLS, caching
**Exists:** yes. The zone is active (nameservers `giancarlo` / `pola.ns.cloudflare.com`), proxied, Always-HTTPS on, edge certificate valid to 2027-01-06 covering `familyeggs.sa` and `*.familyeggs.sa`.
**Status:** BLOCKED — OWNER ACTION (dashboard access).

Dashboard → select **familyeggs.sa**:
1. **DNS → Records → Add record:** Type `CNAME`, Name `www`, Target `familyeggs.sa`, Proxy status **Proxied**, Save. *(Check first that no `www` record exists. None resolves today.)*
2. **Rules → Redirect Rules → Create rule:** "If incoming requests match" → Custom filter: Field `Hostname` equals `www.familyeggs.sa`. Then: Type **Dynamic**, Expression `concat("https://familyeggs.sa", http.request.uri.path)`, Status **301**, **Preserve query string** on. Deploy.
3. **SSL/TLS → Overview:** encryption mode **Full (strict)** (check the current value first).
4. **SSL/TLS → Edge Certificates:** Minimum TLS Version **TLS 1.2** (currently 1.0 is accepted); Always Use HTTPS **On**; leave HSTS **off** here, because the origin sends it.
5. **Caching → Cache Rules → Create rule "API bypass":** URI Path starts with `/api/` → **Bypass cache**. Place it first.
6. **Caching → Cache Rules → Create rule "HTML edge cache"** (optional, after go-live is stable): Hostname equals `familyeggs.sa` AND URI Path does not start with `/api/` → **Eligible for cache**, Edge TTL **Override 5 minutes**, Browser TTL **Respect origin**. **Purge after every deploy** (Caching → Configuration → Purge Everything): cached HTML points at hashed JS that the next deploy deletes.
7. **Analytics & Logs → Web Analytics:** enable for the site (cookieless; no code needed).
8. Optional: **Scrape Shield → Email Address Obfuscation** off (it injects a script and rewrites `mailto:` links; harmless either way).

### 5.2 Cloudflare Turnstile
**Exists:** unknown. It isn't visible from outside, and no widget is on the live site.
**Status:** READY — NOT ACTIVATED (code tested end to end with Cloudflare's test keys).

Dashboard → **Turnstile** (account level, left sidebar):
1. Check the list for an existing widget for `familyeggs.sa`. Reuse it if present.
2. Otherwise **Add widget**: Name `familyeggs.sa enquiry form`, Hostnames `familyeggs.sa` (and `www.familyeggs.sa`), Widget mode **Managed**, Pre-clearance **No**. Create.
3. Copy the **Site Key** (public) and the **Secret Key** (secret) straight into Railway Variables (§5.6). Do not email them or store them anywhere else.

### 5.3 Migadu SMTP
**Exists:** yes, and fully configured for the domain: MX `aspmx1/2.migadu.com`, SPF `include:spf.migadu.com -all`, DKIM `key1`–`key3._domainkey` → Migadu, DMARC `p=quarantine`, autoconfig. `smtp.migadu.com:465` serves a valid certificate (to 2027-01-06). Whether a dedicated sending mailbox exists is unknown.
**Status:** BLOCKED — OWNER ACTION (credentials).

Migadu admin → **Domains → familyeggs.sa → Mailboxes:**
1. Check for an existing mailbox to send from. Recommended: a dedicated **`website@familyeggs.sa`**, so the main `info@` password never sits on a server. If it doesn't exist: **New Mailbox** → local part `website`, set a long random password, Create.
2. Note: because **DMARC is `p=quarantine`**, the sender **must** be a mailbox on `familyeggs.sa` sent through Migadu. Any other "From" address would be quarantined as spam. The code sends `From: Family Eggs website <SMTP_FROM>` and `Reply-To: <visitor>`, which keeps DMARC aligned.
3. Settings for §5.6: host `smtp.migadu.com`, port `465`, TLS on connect; username = the full address; password = the mailbox password.
4. Optional, later: add `rua=mailto:…` to the DMARC record to receive reports.

### 5.4 Google Search Console
**Exists:** no evidence. There's no `google-site-verification` TXT record or meta tag, and no Search Console mail in the connected Gmail (which may not be the owning account).
**Status:** BLOCKED — OWNER ACTION.

1. Signed in with **each** Google account the business uses, open search.google.com/search-console and check the property list for `familyeggs.sa`. If it exists: Settings → Users and permissions → confirm you are **Owner**.
2. Otherwise **Add property → Domain** → `familyeggs.sa` → copy the TXT value → Cloudflare **DNS → Add record** Type `TXT`, Name `@`, Content = the value → back in Search Console, **Verify**.
3. After deploy: **Sitemaps** → submit `https://familyeggs.sa/sitemap.xml`. **URL Inspection** → request indexing for `/ar/wholesale`, `/en/wholesale`, `/ar/international`, `/en/international`.
4. Record the baseline on day 0 ([13](13-ANALYTICS-AND-SEARCH-CONSOLE.md) §5). Optionally add Bing Webmaster Tools via "Import from Google Search Console".

### 5.5 Google Analytics 4
**Exists:** no evidence. There's no tag in the code or on the live site, and no GA mail found.
**Status:** READY — NOT ACTIVATED (code ready; needs a Measurement ID and a consent decision).

1. Signed in with each business Google account, open analytics.google.com → **Admin** → check the account and property lists for Family Eggs. **Reuse an existing property, don't create a duplicate.**
2. If none: **Admin → Create → Property**: name `familyeggs.sa`, time zone **Saudi Arabia**, currency **SAR** → **Data streams → Web** → URL `https://familyeggs.sa`. Leave Enhanced measurement on.
3. Copy the **Measurement ID** (`G-…`; it's public, not a secret) and send it to the developer. It goes in `GA4_MEASUREMENT_ID` in `src/app/core/analytics.service.ts`, then rebuild and deploy. This also switches the privacy notice's analytics paragraph.
4. **Admin → Data display → Key events → New key event:** `wholesale_inquiry_submit`, `distributor_inquiry_submit`, `international_inquiry_submit`. Not `inquiry_handoff`.
5. **Admin → Data display → Custom definitions → Create custom dimension** (event scope): `buyer_type`, `delivery`, `channel`, `form_location`, `link_location`, `reason`.
6. **Admin → Product links → Search Console links** → link the property.
7. **Decide consent first** (owner / legal): the code defaults to ads denied, analytics granted, no banner ([13](13-ANALYTICS-AND-SEARCH-CONSOLE.md) §4).

### 5.6 Railway production environment
**Exists:** yes. The live responses carry `x-railway-edge: cdg1`. Current variables can't be seen from outside.
**Status:** BLOCKED — OWNER ACTION (dashboard access).

Railway → project → the familyeggs.sa **service**:
1. **Settings → Source:** confirm the connected repo is `MesharyAlsabaan/egg` and the branch Railway deploys (normally `master`). The release ships by merging into that branch.
2. **Settings → Deploy:** `railway.json` in the repo now sets the start command, health check and restart policy. Check that no dashboard override contradicts it (a custom start command in the dashboard would win).
3. **Variables:** check for existing `SMTP_*` / `TURNSTILE_*` first. Then, **when ready to switch delivery on**, add with **New Variable** (or **Raw Editor**):

   | Name | Value | Secret? |
   |---|---|---|
   | `SMTP_HOST` | `smtp.migadu.com` | no |
   | `SMTP_PORT` | `465` | no |
   | `SMTP_USER` | `website@familyeggs.sa` | no |
   | `SMTP_PASS` | *(mailbox password)* | **yes** |
   | `SMTP_FROM` | `website@familyeggs.sa` | no |
   | `INQUIRY_TO` | `info@familyeggs.sa` | no |
   | `TURNSTILE_SITE_KEY` | *(site key)* | no |
   | `TURNSTILE_SECRET_KEY` | *(secret key)* | **yes** |

   Set **both** Turnstile keys or **neither**; one alone deliberately disables delivery. Do **not** set `SMTP_IGNORE_TLS` (test-only). `PORT` is provided by Railway.
4. After saving, Railway redeploys. **Deployments → latest → View logs:** expect `{"evt":"listening",…,"inquiryDelivery":true,"turnstile":true}`. Values are never logged.

## 6. Owner decisions (not technical, and not made here)

| Decision | Why it matters |
|---|---|
| Privacy notice: whether to add (a) data-subject rights under the PDPL and how to exercise them, (b) a retention period for enquiry emails, (c) the lawful basis | Legal content; removed from the draft so nothing is asserted on the company's behalf |
| Approve the commercial process copy ([08](08-CONTENT-STRATEGY.md) §3) | It speaks for the company |
| Analytics consent approach | Determines GA4 defaults and whether a banner is needed |
| The home-page line "A fleet ready to deliver wherever the customer needs" (pre-existing owner copy) | "Wherever" reads as unlimited coverage |

## 7. Production readiness checklist (Step 4)

| Area | Status | Evidence / blocker |
|---|---|---|
| Build | **VERIFIED** | Clean `npm ci` + build, 9 routes; each commit builds alone |
| Security | **VERIFIED** (code + headers); Cloudflare TLS 1.2: **BLOCKED — OWNER** | §3 rows 3, 10–13; §5.1 |
| Bilingual functionality | **VERIFIED** | §3 row 5; 24/24 matrix |
| SEO | **VERIFIED** (on-site); Search Console: **BLOCKED — OWNER** | §3 rows 6–9; §5.4 |
| Forms | **VERIFIED** (both modes, fallbacks, no-JS markup) | §3 rows 14–18 |
| Email delivery | **READY — NOT ACTIVATED**; real Migadu send: **NOT TESTED** | §3 rows 16–17, 23; §5.3, §5.6 |
| Spam protection | Code **VERIFIED**; Turnstile **READY — NOT ACTIVATED** | §3 rows 12–14; §5.2 |
| Analytics | **READY — NOT ACTIVATED**; GA4 property: **BLOCKED — OWNER** | §5.5 |
| Privacy | Factual accuracy **VERIFIED**; legal sufficiency **BLOCKED — OWNER** | §4, §6 |
| Performance | **VERIFIED** (lab, no regression); field CWV **NOT TESTED** | §3 row 21 |
| Accessibility | **VERIFIED** (automated); screen reader **NOT TESTED** | §3 row 20 |
| Deployment | **READY**; push / merge awaits approval | §8 |
| Rollback | **READY**; procedure documented, not exercised in production | §8 |
| `www` / edge cache | **BLOCKED — OWNER** | §5.1 |

## 8. Release (Step 5): awaiting approval

### Exact changes awaiting release
`git diff --stat master..release/seo-growth`. Summary:
- **New pages:** `/{ar,en}/wholesale`, `/{ar,en}/international`, `/{ar,en}/privacy` (noindex). Home unchanged except a signpost section.
- **SEO:** per-page head tags, JSON-LD graph, corrected sitemap.
- **Forms:** server delivery (off until configured) plus an honest hand-off.
- **Server:** `node server/server.mjs` replaces `serve`, with 301s, cache policy, AVIF MIME type, security headers, ranges, compression and the enquiry API.
- **Analytics:** events ready and inert.
- **Dependencies:** Angular patch updates, `nodemailer@10.0.14`, `serve` → dev only.
- **Railway:** health check added.
- **Fixes in this round:** see §2.

### Remaining risks
| Risk | Likelihood / impact | Mitigation |
|---|---|---|
| New server misbehaves under real traffic | Low / high | 24 tests + 159-file parity; health check gates the switch; one-click redeploy of the previous build; `serve:static` fallback |
| A Railway dashboard override contradicts `railway.json` | Low / medium | Check §5.6 step 2 before merging |
| SMTP credentials wrong once set | Medium / low | The UI shows "not sent" plus alternatives; logs show `inquiry_send_failed` with the error code; test one enquiry right after setting |
| Stale HTML at Cloudflare after a deploy, if the cache rule is enabled | Medium / medium | Purge on every deploy; the HTML rule is optional and comes after go-live |
| Bots forging `CF-Connecting-IP` by hitting the Railway URL directly | Low / low | Global cap of 30 / 10 min; Turnstile |
| Privacy wording judged insufficient | Owner / legal | §6 |
| GitHub Pages workflow runs on merge | Certain / none | Expected; the preview's form uses hand-off |

### Credentials and permissions required
GitHub write access (push the branch, merge the PR) · Railway project access · Cloudflare dashboard access (DNS, rules, TLS, Turnstile) · Migadu admin (sending mailbox) · Google account owning or able to create Search Console and GA4.

### Deployment sequence (after approval)
1. Locally: `npm ci && npm run build && npm run check:seo && npm run test:server`.
2. Railway: check §5.6 steps 1–2 (source branch, no overriding start command).
3. `git push origin release/seo-growth` → open PR → review → **merge** (no force-push). Railway builds and the health check on `/ar` gates the switch.
4. Smoke test ([16](16-RELEASE-CHECKLIST.md) §5).
5. Cloudflare §5.1 steps 1–5 and 7.
6. Turnstile widget (§5.2), Migadu mailbox (§5.3), Railway variables (§5.6) → send **one real enquiry** from `/en/wholesale` and one from `/ar/international`; confirm both arrive at `info@familyeggs.sa`.
7. Search Console (§5.4); GA4 (§5.5) after the consent decision.
8. After about a week of stable operation: optional HTML cache rule (§5.1 step 6).

### Rollback procedure
| Situation | Action | Time |
|---|---|---|
| Anything wrong after deploy | Railway → **Deployments** → previous deployment → **⋯ → Redeploy** | ~1 min |
| Only the server | Railway → Settings → Deploy → Custom Start Command `npm run serve:static` → redeploy (old `serve` path; same redirects and headers; forms hand off) | ~2 min |
| Only email delivery | Delete `SMTP_HOST` in Variables | ~1 min |
| Stale edge cache | Cloudflare → Caching → Purge Everything | seconds |
| Permanent | `git revert -m 1 <merge-commit>` on `master` and push | — |

### Go / no-go recommendation
**GO, technically**, subject to:
1. Owner approval to push and merge.
2. The privacy-wording decision in §6. The current notice is factual and safe to publish as it is, but it says nothing about rights or retention.
3. The Railway pre-check in §5.6 step 2.

Every test that can be run without owner credentials passes. Email delivery, Turnstile and analytics are built, tested and safely off until configured.

## 9. Commits

`release/seo-growth`, oldest first, on top of `master` @ `9a3e82e`:

| # | Commit | Built + tested in isolation |
|---|---|---|
| 1 | `e91a394` chore(deps): Angular 20.3.33 / 20.3.38 | ✅ |
| 2 | `5dcf9e0` perf(hero): start the film after load | ✅ |
| 3 | `7bfae19` fix(hosting): redirects, cache, security headers | ✅ |
| 4 | `f2661ea` feat: wholesale, international, privacy pages + per-page SEO | ✅ |
| 5 | `a0e6a86` test(seo): build-output SEO check | ✅ `check:seo` 0 failures |
| 6 | `fdfa120` feat(server): production server + enquiry delivery | ✅ `test:server` 21 + 2 network |
| 7 | `5e4d50c` docs | — |
| 8 | `f2f45eb` fix(home): #fragment landing | ✅ 23 / 23 |
| 9 | `7d4bdff` fix(form): Turnstile fallback, timeout | ✅ 23 / 23 |
| 10 | `6fbc693` fix(server): IP sweep, rejected-mail test | ✅ 24 / 24 |
| 11 | `a27e260` fix(privacy): factual-only notice | ✅ 24 / 24 |
| 12 | docs: this report | — |

Every commit is LF. None includes any of the 23 CRLF-only working-tree files.

**Stopped here. Nothing has been pushed, merged, deployed, or changed in DNS or any production setting. Waiting for approval.**
