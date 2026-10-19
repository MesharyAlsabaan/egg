# 08 — Content Strategy and Fact Register

## 1. Rule

The project already had a sourcing rule (`dictionary.ts`, `docs/DELIVERY-REPORT.md`): **a fact is published only if it comes from the brand file, the packaging, the footage or written owner confirmation.** All new copy follows it. Every number on the new pages is interpolated from the same `FIGURES` / `SPEC` constants the home page uses, so a correction in one place corrects every page.

## 2. Fact register

| Fact | Value | Source on record | Status |
|---|---|---|---|
| Daily production | 430,000 eggs | Owner-provided, live since Sept 2026 | Published (pre-existing). Owner to re-confirm it is current |
| Cartons per day | 1,200 | Owner-provided | Published (pre-existing). 1,200 × 360 = 432,000, consistent |
| Producing birds | 600,000 | Owner-provided | Published (pre-existing) |
| Birds in rearing | 200,000 | Owner-provided | Published (pre-existing) |
| Birds per house | 100,000 | Owner-provided | Published (pre-existing) |
| Grades | XX · XL · L1 · L2 · M · S | Owner-supplied list (delivery report §7) | Published |
| Packs | Tray 30; carton 360 (12 × 30) | Carton artwork | Published |
| Shelf life / storage / RH | 3 months; 4–18 °C; 75–80% | Carton artwork | Published |
| Heritage | 60 years | Owner-provided | Published (pre-existing) |
| Delivery fleet | "A fleet ready to deliver wherever the customer needs" | Owner-approved copy | Home page only (pre-existing). Not restated on the new pages, which say only that delivery location and timing are agreed per order |
| Gram weights per grade | — | **Not available** | Not published |
| Certifications, licences | — | **Not available** | Not published |
| Minimum order quantity | — | **Not available** | Not published |
| Delivery regions | — | **Not available** (delivery report lists coverage as pending) | Not published |
| Export approvals / markets | — | **Not available** | Not published. Page states eligibility is checked per market |
| Prices | — | Not published by policy | Not published |

## 3. Accuracy review of the new commercial copy (second pass, 2026-10-19)

Every statement added on the new pages was checked against the fact register (§2). Anything implying a capability not on record was corrected (Arabic changed the same way).

| Was (EN) | Problem | Now |
|---|---|---|
| "Regular supply by the carton, in the grades your market asks for" | Implies regular schedules and any grade on demand | "Supply by the carton (360 eggs), choosing from the six available grades" |
| "30-egg trays across several grades, so one supplier covers more than one price point on the shelf" | Marketing inference; the pack × grade matrix is not on record | "Trays of 30 eggs or cartons of 360, depending on what the outlet needs" |
| "Scheduled volumes matched to your consumption" | Implies a scheduling capability | "By the tray or by the carton, with quantities and timing agreed when you order" |
| "Supply to catering contractors and institutions on an agreed schedule and specification" | Implies existing institutional supply | "Enquiries from catering contractors and institutions are welcome; terms are agreed per enquiry" |
| "Up to 430,000 eggs a day … all passing through …" | Capacity could be read as quantity available to buyers | "Daily production capacity of up to 430,000 … Available quantities are confirmed for each order" |
| "Supply begins on the agreed schedule, delivered by our own fleet" | "Own fleet" ownership and delivery coverage are not confirmed | "On the quantities, timing and delivery method agreed with you" |
| FAQ "Do you deliver? Yes, we run our own delivery fleet…" | Same | "How is delivery arranged? Delivery location and timing are agreed with each customer when the order is confirmed" |
| "…in volumes that suit distributors…" | Unsupported qualifier | "…for distributors, wholesalers, retailers and the hospitality trade" |
| Home signpost "For distributors … caterers" | Implicitly nationwide | "… in Saudi Arabia" (scope only; no coverage claim) |

**Checked and kept:** grades, packs, shelf life, storage (carton artwork); capacity, birds and heritage figures (owner-provided, pre-existing); the automated-line description (pre-existing owner copy). Also kept: the export note ("subject to the destination country's import requirements … we confirm that we can supply your market before we send any quotation"), which makes **no** claim of export authorisation or existing international operations.

**Not claimed anywhere:** delivery coverage, minimum order, certifications, export approval, existing export markets, prices.

**One pre-existing home-page line** is the owner's own: "A fleet ready to deliver wherever the customer needs" (facility section). It is unchanged, but "wherever" reads as unlimited coverage. Consider "A delivery fleet at the farm" until coverage is confirmed.

### Still needs owner sign-off

| Item | Where |
|---|---|
| The four buyer segments, as "who we take enquiries from" | `/wholesale` |
| The three ordering steps and the delivery FAQ answer | `/wholesale` |
| The export note and "we review each enquiry individually" | `/international` |
| **The privacy notice**: factual description of the site, plus two policy statements (data rights under the PDPL; "kept only as long as needed…") that need owner / legal confirmation | `/{ar,en}/privacy` |

## 4. Tone

- Arabic first and written natively, not translated: "جهات نستقبل طلباتها", "كيف يتم الطلب", "ما يساعدنا على الرد بسرعة".
- English in plain procurement language ("grades", "pack", "Incoterms", "delivery terms"), with no superlatives.
- Short sections, each answering one buyer question, in the existing type scale and colours.

## 5. Content backlog (each needs owner input first)

| Priority | Content | Needs from the owner |
|---|---|---|
| 1 | **Quality & licences** page/section: licence numbers, certificates, biosecurity, the inspection step | Copies of SFDA/MEWA licences, any Saudi GAP / ISO / Halal certificates |
| 2 | Gram range per grade (XX…S) on products and wholesale | Weight bands per grade |
| 3 | One-page spec sheet PDF (AR/EN): grades, packs, carton dimensions, pallet configuration, storage | Carton and pallet dimensions |
| 4 | Delivery coverage statement | Cities/regions served, lead times |
| 5 | Minimum order and ordering cadence | MOQ policy |
| 6 | Photo of the six grades side by side | One studio photo |
| 7 | Packing & quality-control section using `05-packing-quality-control.mp4` / `7.mp4` | Approval to show staff on camera (the delivery report kept these out of the "no human contact" story) |
