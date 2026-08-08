# Tennessee advertising compliance — review & remediation

**Reviewed:** 7 August 2026 · **Scope:** all six site pages + `business-cards.html`
**Against:** TREC Rule 1260-02-.12 (Advertising), T.C.A. Title 62 ch. 13, T.C.A. Title 8 ch. 16
(notary consumer protection), T.C.A. Title 56 ch. 35 (title insurance), RESPA §8 / Reg X,
and the NAR Membership Marks Manual.

**License of record** (Tennessee Department of Commerce & Insurance, confirmed by Catrena
directly from the state's license verification lookup, 7 August 2026):

| Field | Value |
|---|---|
| Name | Catrena Thompson |
| License # | **340848** |
| Type | Affiliate Broker |
| Status | Active |
| Original licensure | 05/08/2017 |
| Expiration | 05/07/2027 |
| Firm affiliation | O'Neill Property Management (Firm license #261630), effective 02/24/2026 |
| Address of record | Nashville, Davidson County, TN 37207 |

This resolves items 2 and 3 from the original "ASK" list below — left in place with a strike-through
note rather than deleted, so the reasoning for why they were blocking is still visible.

> This is a documentation review, not legal advice. Anything marked **ASK** below needs a
> human answer — from Catrena, from the principal broker at O'Neill Property Management, or
> from counsel — before the site goes live.

---

## 1. The rule that drove the biggest change

**TREC Rule 1260-02-.12(3)(b)** — verbatim:

> "All advertising shall be under the direct supervision of the principal broker and shall list
> the firm name and the firm telephone number as listed on file with the Commission. **The firm
> name must appear in letters the same size or larger than those spelling out the name of a
> licensee or the name of any team, group or similar entity.**"

And 1260-02-.12(1) defines "advertising" to expressly include **websites**.

The site's loudest name was "Crimson Services Group" in the header. "O'Neill Property Management"
appeared only as grey fine print in the footer. That inverts what the rule requires.

**Fixed:** a brokerage band now sits directly under the header on **all six pages**, carrying the
firm name, the firm telephone, and the supervision statement. The firm name is typeset at
`clamp(1.5rem, 2.5vw, 1.95rem)` — the *identical* size token used for "Crimson Services Group".

⚠️ **If you ever restyle the header, change both together.** `.bb-firm` and
`.site-header .brand-name` in `assets/css/site.css` must keep matching font sizes, or the site
falls back out of compliance. There is a comment in the CSS saying so.

---

## 2. Fixed — confirmed violations

| # | Issue | Rule | What changed |
|---|---|---|---|
| 1 | Firm name subordinate to the licensee's own brand | TREC 1260-02-.12(3)(b) | Brokerage band added to all 6 pages (above) |
| 2 | Mandatory notary notice was **paraphrased**, not reproduced | T.C.A. § 8-16-201(a)(1) | Verbatim statutory notice now in the footer of all 6 pages, boxed in gold at conspicuous size; also set as the lead text of the Notary card on `contact.html` |
| 3 | **False statement of law:** "Tennessee sets a maximum fee per notarial act" | § 8-21-1201(a) | Corrected to "a reasonable fee for each notarial act". Tennessee sets **no** per-act maximum for in-person work — the only cap ($25) applies solely to *online* notarization under § 8-16-311, which this site does not advertise |
| 4 | REALTOR® used without disclosing state of licensure | NAR Membership Marks Manual | Footer and brokerage-band lines now read "REALTOR® — Tennessee Affiliate Broker, License #340848" on all 6 pages |
| 5 | Service area stated inconsistently — "West & Middle Tennessee" in 13 places vs. seven **Middle** Tennessee counties everywhere else | TREC 1260-02-.12, § 62-13-312(b)(4) (misleading advertising) | Normalized to "Middle Tennessee" sitewide |
| 6 | No Equal Housing treatment anywhere on a site marketing real estate | Federal Fair Housing Act; NAR Code of Ethics | Equal Housing Opportunity mark + statement added to the footer of all 6 pages |
| 7 | Licensee's classification (affiliate broker vs. broker) never stated, and no license number published | TREC 1260-02-.12(3)(c) | Confirmed against the official TDCI record — **Affiliate Broker, License #340848** — and published sitewide in the brokerage band, footer, and `contact.html` disclosures |
| 8 | NNA Certified Notary Signing Agent mark shown as a hand-drawn text stand-in, not the real mark | NNA licensing terms | Replaced with NNA's own official embed code (found in `choose_nsa.pdf`) — hotlinked from `nationalnotary.org`, not self-hosted, per NNA's terms |

**Why #2 and #3 matter more than they look.** T.C.A. § 8-16-203 declares that *any* failure to
comply with the notary advertising provisions "constitutes an unfair or deceptive act as provided
for in § 47-18-104" — the Tennessee Consumer Protection Act. That is Attorney General
enforcement territory, not a technical foot-fault. Do not shrink, reword, or delete the gold box.

Also removed sitewide, per your note: every reference to appraisers/appraisals.

---

## 3. ASK — needs your answer before launch

These are blocking. I did **not** guess at any of them, because guessing wrong on several would
itself create a false statement.

1. **Is Crimson Title Services licensed yet?**
   The site says "Opening August 2026" — and it is now August 2026. T.C.A. § 56-35-201(a):
   *"No person within this state shall act as or hold out to be a title insurance agent … unless
   licensed."* Right now the pages actively solicit title and escrow business.
   - If the TN title agency licence **and** an underwriter appointment are in place → delete the
     "opens August 2026" language, which is now false.
   - If they are **not** → the solicitation copy has to come down to a notify-list.

   I left this exactly as-is on purpose: publishing "we are not licensed" would be just as
   damaging if it's wrong. Check the entity at **verify.tn.gov** and tell me which branch to take.

2. ~~Is your NNA Certified Notary Signing Agent certification currently active?~~ **RESOLVED.**
   `choose_nsa.pdf` contained NNA's own embed code. That is now live on `crimson-solutions.html`
   and `contact.html`, hotlinked from `nationalnotary.org` (per their terms, not self-hosted).
   ⚠️ One thing only you can confirm: this only stays truthful while the certification and its
   background screening remain current. If either lapses, remove the badge — displaying it after
   lapse is deceptive advertising under both TREC and the Tennessee Consumer Protection Act.

3. ~~Your TREC licence number and classification.~~ **RESOLVED** — confirmed directly against the
   TDCI license lookup: **Affiliate Broker, License #340848, Active, expires 05/07/2027**, firm
   affiliation O'Neill Property Management (Firm #261630). Now published in the brokerage band,
   every footer, and `contact.html`. The site uses "Dr. Catrena S. Thompson" in marketing copy
   (the doctorate is accurate and not a licensing claim) and "Catrena S. Thompson" — matching the
   license record's name — in every regulatory disclosure. That split is intentional: TREC Rule
   1260-02-.12(3)(c) only governs the disclosure lines, not marketing copy.

4. **Your notary commission county.** The business card (Card 2 back) is filled in as **Davidson
   County**, inferred from the license record's Nashville/Davidson address. That is a real
   estate license field, not the notary commission record itself — confirm it matches your actual
   notary commission before this goes to print.

5. **Has the principal broker at O'Neill Property Management approved this site?**
   Rule 1260-02-.12(3)(b) puts all advertising under the principal broker's direct supervision.
   Send them the link before it goes live.

6. **Are "1000s" of signings and "hundreds of loan file reviews" substantiable?**
   (`index.html` stat tiles; "Thousands of successful notary signings" on the notary page.)
   § 62-13-312(b)(4) reaches false or misleading claims about experience and production. I left
   these in place — they may well be true over sixteen years — but if you can't document them,
   soften them to something you can.

7. **Title fee estimator and seller net sheet.** The formulas in `assets/js/site.js` are
   reasonable Middle-TN defaults, **not filed rates**. Once your underwriter issues a rate
   schedule, replace them. Until then a regulator could read the output as a premium quote.

8. **Contact delivery uses the visitor's email app.** The form prepares an email addressed to
   `catrena@crimsonservicesgroup.com`; the visitor must review it and tap Send. This avoids a false
   success state and avoids routing inquiry data through an unapproved third-party form service.

---

## 4. Flagged — worth doing, not blocking

- **RESPA affiliated-business disclosure.** You refer real estate clients to a title company you
  own. That is an Affiliated Business Arrangement under Reg X, 12 CFR 1024.15. The safe harbour
  needs three things: written disclosure at or before referral, no required use, and no return
  other than an ownership interest. The business card back now carries "You are not required to
  use Crimson Title Services…", but you also need the **standard AfBA disclosure form** given at
  referral. That's a transaction document, not a web page — worth asking counsel to draft.
- The site describes Crimson Services Group, LLC in language that can read as though the LLC
  itself provides real estate brokerage services. It does not and cannot — only the brokerage
  does. The new brokerage band mitigates this; a copy pass on `index.html` would finish it.
- RegReady's "examiner-ready, regulator-respected" and savings-estimate copy imply outcomes.
  Low risk (B2B, not real estate advertising), but worth a hedge.

---

## 5. Method

98 agents: four parallel primary-source research passes, a per-page audit, then an adversarial
verification pass where each finding was assigned a skeptic instructed to refute it by default.
87 raw findings → 65 reached verdict → **13 confirmed violations, 36 confirmed risks**; the rest
were refuted as already-compliant, fabricated quotes, or invented citations.

Twenty-three verification agents and the final synthesis pass died on a session usage limit, so
`contact.html` and `title-services.html` got less automated verification than the other four
pages. The license lookup itself was done by hand against the TDCI system rather than by an
agent — the automated lookup was still running and Catrena pulled the record directly, which is
the more reliable source anyway. A follow-up pass on `contact.html`/`title-services.html` would
likely surface a few more findings on those two pages specifically.
