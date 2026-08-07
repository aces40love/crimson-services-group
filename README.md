# Crimson Services Group, LLC — Website

A hand-built, dependency-free static site. No build step, no framework, no npm install.
Upload the contents of this folder to your web root and it runs.

---

## Files

```
index.html                Home — group overview, brands, process, security, FAQ
crimson-solutions.html    Mobile notary & certified loan signings
title-services.html       Crimson Title Services + working fee estimator & seller net sheet
regready.html             RegReady Solutions — L1–L4 framework, pricing, plan estimator, TRID
resources.html            Wire fraud guide, Tennessee links, mortgage/credit/closing/program FAQs
contact.html              Contact form + TREC advertising disclosures

assets/css/site.css       Complete design system (tokens, components, responsive, print)
assets/js/site.js         Nav, scroll reveal, counters, accordions, three calculators
assets/img/logos/         Brand logo files
robots.txt                Crawler directives (update the sitemap URL to your domain)
sitemap.xml               All six pages (update the URLs to your domain)
```

### Logo assets

| File | Use |
|---|---|
| `crimson-services-group.jpg` | Parent company — header, footer, favicon |
| `crimson-solutions.jpg` | Notary/signing brand |
| `crimson-title-services.jpg` | Title brand |
| `regready-solutions.jpg` | Compliance brand (current mark) |
| `oneill-property-management.jpg` | Brokerage affiliation (TREC disclosure) |
| `regready-horizontal*.png/.jpg` | Older horizontal RegReady lockup, kept as an alternate |

---

## Before launch — required

1. **Contact form endpoint.** In `contact.html`, replace `YOUR_FORM_ID` in the form `action`:
   ```html
   <form action="https://formspree.io/f/xxxxxxx" method="POST" data-contact novalidate>
   ```
   Until that's replaced, the form shows a local success message and does not send anything.

2. **Canonical domain.** Every page carries a `rel="canonical"` link plus Open Graph tags pointing at
   `https://www.crimsonservicesgroup.com/`. If the live domain differs, search-and-replace that string
   across all six HTML files, `robots.txt`, and `sitemap.xml`.

3. **Testimonials.** `index.html` carries three clearly-labelled placeholder quotes. Replace them with real,
   attributable client feedback — or delete the section entirely — before you go live. Do not publish
   invented testimonials; TREC rules prohibit false or misleading advertising claims.

4. **Verify the calculators against your real rates.** See "Calculator assumptions" below.

## Before launch — recommended

- Add an SSL certificate (most hosts issue one free) — the site claims TLS in the security section.
- Add Google Business Profile / local listings using the same NAP: name, `615-994-9244`, service area.
- Add `robots.txt` and a `sitemap.xml` listing the six pages.
- Re-check the outbound Tennessee links on `resources.html` once a year; state URLs move.

### Plan deep-links

The four RegReady pricing CTAs link to `contact.html?plan=<slug>#form`. `initPrefill()` in `site.js`
reads that slug, selects the loan-file-review service, and drops the plan name into the message box —
so the enquiry arrives already labelled. Slugs: `basic`, `exam-prep`, `audit-plus`, `enterprise`.
If you rename a plan, update `PLAN_LABELS` in `site.js` to match.

---

## TREC advertising compliance

**See `COMPLIANCE.md` for the full review, the citations, and the open questions that block launch.**

Two blocks carry the required disclosures, and both appear on **all six pages**:

1. **`.brokerage-band`** — directly below the header. Firm name, firm telephone, supervision
   statement. TREC Rule 1260-02-.12(3)(b) requires the firm name in letters *the same size or
   larger* than the licensee's or any group's name, so `.bb-firm` deliberately shares the exact
   font-size token as `.site-header .brand-name`. **Change one and you must change the other.**
2. **`.footer-legal`** — broker line, the verbatim T.C.A. § 8-16-201(a)(1) notary notice
   (`.notary-notice`, the gold box — do not shrink, reword, or remove it), and the Equal Housing
   statement.

Full disclosures also appear on `contact.html#disclosures`.

- Brokerage firm: **O'Neill Property Management**
- Broker phone (TREC file): **615-650-0008** — required on every page
- Licensed agent: **Catrena S. Thompson**, REALTOR® — Tennessee Affiliate Broker, License #340848
  (confirmed against the TDCI license record, active, expires 05/07/2027)

If any of these change, update `.brokerage-band` and `.footer-legal` in all six HTML files.

## Business cards

`business-cards.html` — three cards (Crimson Services Group, Crimson Solutions, Crimson Title
Services), front and back, drawn at 3.5″ × 2″ trim with 0.125″ bleed. Open it in a browser; the
on-screen notes explain how to proof and what to hand a printer. Office 615-994-9244, direct
615-994-9094, broker 615-650-0008, License #340848. One item to confirm before printing: Card 2's
notary commission county is filled in as Davidson, inferred from the real estate license
address — verify it against the actual notary commission.

---

## Calculator assumptions

All three calculators live in `assets/js/site.js` and are clearly labelled as estimates on-page.
**Review these numbers before launch** — they are reasonable Middle Tennessee defaults, not your filed rates.

### Title fee estimator (`initTitleFee`)
| Item | Current model |
|---|---|
| Owner's policy | `$350 + $2.60 per $1,000` of price (skipped on refinance) |
| Lender's policy | `$150 + $0.90 per $1,000` of loan |
| Settlement fee | `$495` |
| Title search | `$175` |
| Recording | `$60` |
| Courier | `$45` |
| State transfer tax | `$0.37 per $100` of consideration (purchase only) |
| Mortgage recording tax | `$0.115 per $100` of indebtedness over `$2,000` |

Replace the policy formulas with your underwriter's filed rate table when it's issued.

### Seller net sheet (`initNetSheet`)
Uses the same title/settlement/recording assumptions plus user-entered commission %, payoff,
prorated taxes, repairs, and concessions. Excludes HOA transfer fees, home warranty, unpaid
liens, and per-diem interest — noted on-page.

### RegReady plan estimator (`initPlanPicker`)
Rack rates and the four subscription plans are hard-coded in the `RACK` and `PLANS` constants and
match the framework document. Update both the JS **and** the tables in `regready.html` together
if pricing changes.

---

## Design system

Everything is driven by CSS custom properties in `:root` at the top of `assets/css/site.css`.
Change a token, and the whole site follows.

```css
--crimson:#8B1538   /* primary — sampled from the logo suite */
--navy:#1E3A5F      /* secondary */
--ink:#0F1B2D       /* dark sections, footer */
--gold:#C9A227      /* accent — eyebrows, rules, highlights */
--paper:#FCFBF9     /* warm page background */
--sand:#F3F1EC      /* alternating section background */
```

Type: **Crimson Pro** (display serif) + **Inter** (UI/body), loaded from Google Fonts with a full
system-font fallback stack, so the site stays readable if the font request fails.

### Section rhythm
Sections alternate `.section--paper` → `.section--sand` → `.section--white` → `.on-dark`.
Keep that alternation when adding sections, and never place two `.on-dark` sections back to back.

### Key components
`.btn` (`--primary` / `--gold` / `--ghost` / `--light` / `--ink`, `--sm`, `--block`) ·
`.card` · `.brand-card` · `.level` (auto-numbers L1, L2, L3, L4 via CSS counter) · `.plan` ·
`.acc` accordion · `.tool` calculator · `.timeline` · `.quote-card` · `.res` link row ·
`.disc` disclosure tile · `.callout` · `.chip`

### Animation
Add `data-reveal` to any element to fade it in on scroll; add `data-delay="1"`–`"4"` to stagger.
Add `data-count="16"` with optional `data-suffix="+"` to animate a number. All motion is disabled
automatically under `prefers-reduced-motion`.

---

## Browser support & accessibility

- Modern evergreen browsers; degrades gracefully — with JS off, every page is still fully readable
  and navigable, and accordion content stays in the DOM.
- Skip link, visible focus rings, `aria-expanded`/`aria-controls` on the nav and accordions,
  labelled form fields, and semantic landmarks throughout.
- `@media print` styles strip navigation and dark backgrounds so the RegReady pricing tables print cleanly.

---

## Editing tips

- The header and footer are duplicated in each HTML file (no templating). If you change a nav item
  or a disclosure, change it in **all six files**.
- Adding a page: copy an existing page, swap the `<main>` content, add a `<li>` to `.nav-links` in
  every file. The active-page highlight is automatic — `site.js` matches the filename.
- Icons are inline SVG (Feather-style, `stroke="currentColor"`), so they inherit color from their
  container. No icon font, no external requests.

---

Contact: catrena@crimsonservicesgroup.com · 615-994-9244
