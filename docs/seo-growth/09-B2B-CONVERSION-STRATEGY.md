# 09 — B2B Conversion Strategy

## 1. Conversion paths

| Buyer | Entry | Path | Actions available |
|---|---|---|---|
| KSA distributor / wholesaler | Search → `/wholesale`, or home → signpost / nav | Who we serve → what we supply → how ordering works → **form** → FAQ → contact | Form (preset distributor), WhatsApp, phone, email |
| Supermarket / HoReCa / institutional | Same | Same; select the business type in the form | Same |
| Importer / GCC distributor | Search (EN) → `/international`, or home signpost | Eligibility note → producer facts → what to send → **form** (country required) | Form (preset importer), channels |
| Anyone, any page | Header | "Request a quote" (WhatsApp) | Unchanged: the one header CTA |

The owner has approved keeping both the Wholesale and International sections, and the forms.

## 2. The inquiry form

**Fields:** full name\*, company\*, type of business\*, country (\* on the international page; pre-filled "Saudi Arabia" on wholesale), email, phone (at least one of the two\*), pack required, approximate volume, message. That is the minimum needed to reply to a B2B enquiry. Pack, volume and message stay optional.

### Two delivery modes, chosen automatically

On load, the form asks the server `GET /api/inquiry/config`.

| | **Server delivery** (when SMTP is configured) | **Hand-off** (no SMTP, static host, or the API is unreachable) |
|---|---|---|
| Button | "Send enquiry" / «إرسال الطلب» | "Continue in WhatsApp" / "Continue by email", following the selected channel |
| What happens | `POST /api/inquiry` → validated → emailed to `info@familyeggs.sa`, Reply-To the visitor | The message opens in the visitor's own WhatsApp / mail app, addressed to the company line / inbox |
| Confirmation | **"Your enquiry has been sent"**, shown only after the server confirms the email went out | **"Your message is ready — not sent yet"**: "It only reaches us when you press Send there" |
| Failure | "Your enquiry was not sent": the input is kept, with buttons to send the same enquiry by WhatsApp or email. A separate message covers rate limiting | n/a |
| Privacy line | "Your details are emailed to Family Eggs only so we can reply… The website does not store them." + link to the notice | "The website stores none of your details… only reaches us when you press Send there." + link |

A WhatsApp redirect is never presented as a submitted form.

**Without JavaScript:** the form falls back to a native `mailto:` post.

### Server-side safeguards (`server/inquiry.mjs`)

| Layer | Behaviour |
|---|---|
| Off by default | Enabled only when `SMTP_HOST` and a sender are set. Otherwise `503`, and the client hands off |
| Origin check | `Origin` must be the site (`ALLOWED_ORIGINS`), else `403` |
| Content type / size | JSON only (`415`); 16 KB cap (`413`) |
| Rate limits | 5 per IP per 10 min, plus **30 per 10 min across everyone** (`429` + `Retry-After`). The global cap holds even if someone forges the client-IP header by hitting the origin directly |
| Honeypot | A hidden `website` field. If filled, the server returns success and sends nothing |
| Minimum fill time | Under 3 s from page load: returns success, sends nothing |
| Turnstile | Cloudflare Turnstile when both keys are set (recommended). Half a configuration disables delivery rather than running unprotected |
| Validation | The same rules as the browser, server-side; field length caps; control characters and CR/LF stripped. Header injection was tested (§12-QA) |
| Email | Plain text, labelled in the visitor's language; `From` the configured site mailbox; `Reply-To` the visitor |
| Storage | **None.** Nothing is written to disk or a database. Logs contain labels only (buyer type, page, language), never what was typed |
| Mail failure | `502`; the form shows its failure state with hand-off alternatives |

## 3. Calls to action

| Label (EN / AR) | Where | Action |
|---|---|---|
| Request a quote / اطلب عرض سعر | Header, menu | WhatsApp (unchanged) |
| Wholesale supply details / تفاصيل التوريد بالجملة | Home signpost | → `/wholesale` |
| International enquiries / طلبات الاستيراد | Home signpost | → `/international` |
| Send enquiry / إرسال الطلب | Forms (server mode) | POST |
| Continue in WhatsApp / by email | Forms (hand-off mode) | Opens the app |
| Cross-links | Below each form | wholesale ↔ international |

## 4. Measurement

| Event | Fires when | Key event in GA4? |
|---|---|---|
| `distributor_inquiry_submit` | **Server confirmed delivery**, business type = distributor | **Yes** |
| `wholesale_inquiry_submit` | Server confirmed delivery, other domestic types | **Yes** |
| `international_inquiry_submit` | Server confirmed delivery on `/international`, or business type = importer | **Yes** |
| `inquiry_handoff` | Valid form handed to WhatsApp / email (not a confirmed lead) | No |
| `inquiry_error` | The server refused or failed (`reason`: busy, captcha, invalid, server, network) | No |
| `whatsapp_click` · `phone_click` · `email_click` | Any `wa.me` / `tel:` / `mailto:` link | No (optional) |

Parameters are labels only: `buyer_type`, `product_interest`, `delivery`, `channel`, `form_location`, `language`, `link_location`, `reason`, `page_path`. Validation errors fire nothing. The hand-off fallback link is excluded from click tracking.

**Until SMTP is configured there are no conversion events**, only `inquiry_handoff`. That is deliberate: hand-offs can't be confirmed as leads.

## 5. Next CRO steps (after 4–8 weeks of data)

1. Compare `*_inquiry_submit` counts with emails received. They should match exactly; investigate if not.
2. If `/wholesale` gets traffic but few submits, test the form above "How ordering works".
3. Add trust content (licences, certificates) beside the form once confirmed.
