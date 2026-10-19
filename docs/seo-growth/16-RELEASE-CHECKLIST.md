# 16 — Release Checklist, Deployment and Rollback

Branch: **`release/seo-growth`** (local; based on `master` at `9a3e82e`, which equals `origin/master` as of 2026-10-19). Not pushed, not deployed.

## Commits on `release/seo-growth`

| # | Commit | Scope |
|---|---|---|
| 1 | `e91a394` chore(deps): update Angular to 20.3.33, CLI/build/SSR to 20.3.38 | `package.json`, `package-lock.json` |
| 2 | `5dcf9e0` perf(hero): start the hero film after the page has loaded | `hero.component.ts` |
| 3 | `7bfae19` fix(hosting): 301 redirects, cache policy and security headers | `public/serve.json`, `public/404.html` |
| 4 | `f2661ea` feat: add wholesale, international and privacy pages with per-page SEO | 21 files in `src/`, `public/sitemap.xml` |
| 5 | `a0e6a86` test(seo): add a build-output SEO check | `tools/check-seo.mjs`, `package.json` |
| 6 | `fdfa120` feat(server): production server with enquiry delivery | `server/*`, `railway.json`, `package.json`, `package-lock.json` |
| 7 | docs: SEO growth programme, release checklist and rollback | `README.md`, `docs/seo-growth/*` |

Each commit was exported from git and built in isolation; results are in [12](12-QA-TEST-RESULTS.md) §9. Every commit is LF. The 25 files in the Drive working tree that differ from `master` only in CRLF line endings are not in any commit.

## 1. What changes in production

| Area | Before | After |
|---|---|---|
| Start command | `npm run serve:prod` → `serve` | `npm run serve:prod` → **`node server/server.mjs`** (same script name, so `railway.json` is unchanged except for a health check) |
| Pages | `/ar`, `/en` | + `/{ar,en}/wholesale`, `/{ar,en}/international`, `/{ar,en}/privacy` (noindex) |
| `/`, `/x/` | 200 meta-refresh stub; trailing-slash duplicates | 301 → `/ar`; 301 → no trailing slash; `/x/index.html` → 301 |
| Headers | 4 h cache on everything, AVIF as octet-stream, no security headers | Hashed assets immutable for 1 year; AVIF typed; HSTS, nosniff, referrer policy, frame options, permissions policy, non-script CSP |
| Enquiries | WhatsApp link only | Form on both commercial pages. Hand-off until SMTP is configured, server delivery after |
| Runtime dependencies | `serve` (high-severity `compression` advisory) | `nodemailer@10.0.14`; `npm audit --omit=dev` = **0 vulnerabilities**. `serve` kept as a dev dependency, for rollback only |
| Framework | Angular 20.3.30 | 20.3.33 (framework) / 20.3.38 (CLI, build, SSR): patch updates that clear the Angular SSR, router and build (`piscina`, critical) advisories |

## 2. Before you deploy

- [ ] Owner confirms deployment, and the copy sign-off list in [08](08-CONTENT-STRATEGY.md) §3, including the privacy notice wording.
- [ ] Review the branch: `git log --oneline master..release/seo-growth`, then `git diff master..release/seo-growth --stat`.
- [ ] Locally: `npm ci && npm run build && npm run check:seo && npm run test:server`. All must pass.
- [ ] Decide whether enquiry email delivery goes live now (§4) or later. The site is correct either way.

## 3. Deploy

Railway deploys from the GitHub repository. Deploying = getting the branch onto the branch Railway watches (normally `master`).

```bash
git push origin release/seo-growth          # publish the branch (no force)
# open a PR release/seo-growth → master on GitHub, review, merge
```

Merging to `master` also triggers `.github/workflows/pages.yml` (the GitHub Pages preview). That is expected and harmless: the preview has no API, so its form stays in hand-off mode.

Railway builds with `npm run build` and starts `npm run serve:prod`. The new `healthcheckPath: /ar` makes Railway wait until the new server answers before switching traffic.

## 4. Turning on enquiry email delivery (optional, any time after deploy)

Set these in Railway → service → **Variables** (never in the repository):

| Variable | Value | Notes |
|---|---|---|
| `SMTP_HOST` | `smtp.migadu.com` | The domain's MX is Migadu. Confirm the host in the Migadu dashboard |
| `SMTP_PORT` | `465` | Implicit TLS |
| `SMTP_USER` | e.g. `website@familyeggs.sa` | A dedicated sending mailbox is safer than the main inbox's password |
| `SMTP_PASS` | mailbox password | Secret |
| `SMTP_FROM` | same as `SMTP_USER` | Must be a Migadu address for SPF/DKIM alignment |
| `INQUIRY_TO` | `info@familyeggs.sa` | Default if unset |
| `TURNSTILE_SITE_KEY` | from Cloudflare → Turnstile → add site `familyeggs.sa` | **Recommended.** Set both Turnstile keys or neither; setting only one disables delivery on purpose |
| `TURNSTILE_SECRET_KEY` | ditto | Secret |

After saving, Railway restarts the service. Then check:
1. The logs show `{"evt":"listening",…,"inquiryDelivery":true,"turnstile":true}`.
2. `curl https://familyeggs.sa/api/inquiry/config` → `{"enabled":true,"turnstileSiteKey":"…"}`.
3. Submit one real enquiry on `/en/wholesale`. "Your enquiry has been sent" appears, the email arrives at `info@familyeggs.sa`, and Reply-To is the visitor's address.
4. In GA4 (once configured), the conversion event appears.

To turn delivery off again, delete `SMTP_HOST`. The form drops back to hand-off.

**Not verified here:** no SMTP credentials were available, so delivery to the real Migadu server has not been exercised. The full path was tested against a local SMTP server (12-QA §2).

## 5. Smoke test after every deploy

```bash
B=https://familyeggs.sa
curl -sI $B/            | grep -iE '^(HTTP|location)'      # 301, location: /ar
curl -sI $B/ar/         | grep -iE '^(HTTP|location)'      # 301, location: /ar
for p in ar en ar/wholesale en/wholesale ar/international en/international ar/privacy en/privacy; do
  printf '%-20s ' $p; curl -s -o /dev/null -w '%{http_code}\n' $B/$p; done   # all 200
curl -sI $B/nope        | head -1                          # 404
curl -sI $B/media/hero-poster-desktop-1600.avif | grep -i content-type      # image/avif
curl -sI $B/ar | grep -iE 'strict-transport|content-security|x-content-type'
curl -s  $B/api/inquiry/config                             # {"enabled":false|true,...}
curl -s  $B/sitemap.xml | grep -c '<loc>'                  # 6
```
Then in a browser: switch language on `/en/wholesale`, open the mobile menu, play the hero, and submit one test enquiry.

## 6. Cloudflare settings (owner, in the dashboard)

| Setting | Recommended | Why |
|---|---|---|
| DNS `www` | Proxied CNAME `www` → `familyeggs.sa` | `www` doesn't resolve today. The certificate already covers `*.familyeggs.sa`. The origin also 301s `www` → apex, as a backstop |
| Redirect Rule | `www.familyeggs.sa/*` → `https://familyeggs.sa/${1}`, 301 | Do it at the edge |
| SSL/TLS → Edge → Always Use HTTPS | On (already effective) | Verified: `http://` → 301 |
| SSL/TLS → Minimum TLS | **1.2** | TLS 1.0 is currently accepted |
| SSL/TLS mode | Full (strict), if not already | Railway issues certificates for custom domains. The current mode could not be checked without dashboard access |
| Cache Rule: HTML | Hostname `familyeggs.sa`, path not starting `/api/`: **Eligible for cache**, Edge TTL **5 min**, Browser TTL: respect origin | Cuts ~1 s TTFB for Saudi visitors. **Purge everything after each deploy**: cached HTML refers to hashed JS files, which a new deploy deletes |
| Cache Rule: `/api/*` | **Bypass cache** | Dynamic. The origin also sends `no-store` |
| Turnstile | Add widget for `familyeggs.sa` (Managed) | Keys for §4 |
| Web Analytics | Enable | Cookieless traffic counts |
| Email Obfuscation | Optional to turn off | Works, but injects a script and rewrites `mailto:` links |

Do not cache `/api/*`. Nothing else on the site is private or personalised.

## 7. Rollback

| Problem | Fastest fix |
|---|---|
| New server misbehaves | Railway → Settings → Start Command: `npm run serve:static`, then redeploy. This is the old `serve` path; `public/serve.json` gives it the same redirects and headers (no API, so forms hand off) |
| Anything in the release | Railway → Deployments → the previous deployment → **Redeploy** (instant, no git needed). Then `git revert -m 1 <merge-commit>` on `master` |
| Form delivery misbehaves | Delete `SMTP_HOST` in Railway Variables; the forms fall back to hand-off |
| Bad cached HTML at Cloudflare | Caching → Purge Everything |

## 8. Release recommendation

**Ready to release**, conditional on the owner's sign-off in §2. Every test suite passes (12-QA). Runtime dependencies have no known vulnerabilities. The site works correctly whether or not email delivery is configured. Rollback is a one-click redeploy.

Recommended order:
1. Deploy with delivery **off**, and run the smoke test.
2. Same day: Cloudflare `www` record, minimum TLS 1.2, Turnstile widget; Search Console sitemap submission ([13](13-ANALYTICS-AND-SEARCH-CONSOLE.md)).
3. Then set the SMTP and Turnstile variables and send one real test enquiry.
4. Then the GA4 ID and key events ([13](13-ANALYTICS-AND-SEARCH-CONSOLE.md) §3).
5. Within a week: the Cloudflare HTML cache rule, with purge-on-deploy.
