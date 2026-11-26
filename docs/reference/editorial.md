# Editorial, customer education and brand pages: reference investigation

Owner: editorial workstream (shad session "editorial"). Captured 2026-11-26 with Playwright 1.65 (Chromium, deviceScaleFactor 1).
Viewports: 1920, 1440, 1280, 1024, 768, 390, 375. Viewport heights are 900 for desktop, 1024 for tablet and 844 for phones.

Artefacts (shared, non-git): `/Users/shad/sakooon-qa/references/{tekla,parachute}/<page>/`
- `<vw>-full.png` is a full-page screenshot, taken after scrolling through the page to trigger lazy loading.
- `<vw>-metrics.json` holds the raw computed-style and bounding-box measurements this doc summarises.
- `states/<vw>-<state>.png` holds interaction states at 1440 and 390.
- `tekla/editorial-interactions.json` holds the targeted probes: size-guide panel, shipping accordion, story filters and the article layout.

Scripts (in this branch): `scripts/ref/editorial-capture.mjs` (screenshots, states, metrics), `scripts/ref/editorial-interactions.mjs` (page-specific states), `scripts/ref/editorial-report.mjs` (turns metrics into the tables below) and `scripts/ref/editorial-dom-probe.mjs`.

Ground rules carried into implementation: we recreate **proportions, rhythm and behaviour**, not content. No Tekla or Parachute copy, photography, logos, fonts or sustainability or certification claims. Fonts are recorded by name only so that design-system substitutes can be picked.

---

## 1. Tekla: global findings (apply to every Tekla editorial page)

| Token | Value | Notes |
|---|---|---|
| Font | `unica77` (a neo-grotesk), substitute required | One family for everything. Weight **300** is the default for headings and body. **400** is used only for card titles. Bold (around 500) appears only in table header cells |
| Text colour | `rgb(24,24,24)` | near-black, never pure black |
| Muted text | `rgb(112,112,112)` (breadcrumb, care lists), `rgb(92,92,92)` (header nav) | |
| Page background | `rgb(246,246,246)` | warm-neutral off-white. The footer switches to `#fff` |
| Hairline | `1px solid rgb(227,227,227)` | every divider: accordion rows, size-guide rows, footer columns |
| Strong rule | `1px solid rgb(24,24,24)` | active filter underline, "Explore all products" text-button underline |
| Header | sticky, 52px tall, `top:0` | **hides on scroll down and reappears on any scroll up** (inner bar `translateY(-100%)` once scrollY is past about 52, 0.25s, per shad-2d's measurement). Compare `states/1440-scrolled-sticky.png` (hidden) with `1440-scrolled-up.png` (shown). Corrected 2026-11-26; an earlier draft said it never hides |
| Page gutter | 16px at every width below the container | |
| Containers | **1168** (wide: grids, care), **992** (about), **732** (text column: care intros, shipping), **700** (ESG long-form), **668** (size guide), **612** (article body) | all centred. A 732 text column inside the 1168 container is left-aligned with the grid, not centred |
| Grid gutter | 16px column gap. Row gap is **40px** (care cards) or **44px** (story cards) | |
| Image ratio | **4:5 (0.8)** everywhere for editorial and care cards, **5:4 (1.25)** for the ESG hero, **16:10 (1.6)** for story cards | `object-fit: cover`, no radius |
| Radius | 0 everywhere | |
| Transitions | `color, background-color, border-color, text-decoration-color, fill, stroke` at **0.15s** (buttons and rows) or **0.2s** (text links), `cubic-bezier(0.4,0,0.2,1)` | no scroll-reveal anywhere: 0 elements were hidden before entering the viewport on any page. Accordions open **instantly** (no height animation) |
| Link style | `text-decoration: underline 0.5px`, `text-underline-offset: ~0.33em (4.62px at 14px)`. The colour is transparent at rest and fades in on hover | breadcrumbs and inline links. Body-copy inline links (mailto) are underlined at rest |
| Cards | **no hover effect** (default and hover screenshots are byte-identical) | the whole card is a link |
| Popups | a cookie banner ("Before browsing"), dismissed with **Only necessary**. A floating accessibility widget sits bottom-left (site UI, left in place). No email popup appeared | |

### Typographic scale (Tekla)

Measured: size/line-height in px, then weight. The line-height ratio is consistently **1.5** on long-form pages and **1.45** on care pages.

| Role | ≥768 | ≤390 | Used on |
|---|---|---|---|
| Page title (h1) | 24/36 300 | 20/30 300 (long-form, stories, shipping) · 24/36 (care pages keep the desktop size) | all |
| Section heading (h2, long-form) | 18/27 300 | 16/24 300 | ESG, about |
| Section heading (h2, care) | 20/30 300 (20/29 on care detail) | 20/30 | care grid card titles, care detail "Care / Quality / Design / Details" |
| Card title (story) | 14/21 **400** | same | stories grid |
| Body | 14/21 300 (long-form) · 14/20.3 300 (care) | same | all |
| Meta / small | 12/18 300 | same | story date, category, separator "\|" |
| Table cell | 14/22 300. The header row is bold | same | size guide |
| Footer heading | 18/27 300 ("Keep in touch") | | footer (not ours) |

There is **no letter-spacing, no uppercase and no eyebrow labels**. Hierarchy comes only from size steps (24, 20, 18, 14, 12) plus generous whitespace. The text measure is wide: the care intro runs to about 118 characters per line at 732px and the ESG body to about 113 characters at 700px. That is wider than the classical 65–75 characters, and it works because the type is small and light. **Recommendation for Sakooon:** keep the 700–732px column proportion, but expose `.measure` (around 70ch) as an option for longer reading pages (journal articles).

### Vertical rhythm (Tekla)

| Gap | Desktop | ≤390 |
|---|---|---|
| Header → page title block (top padding) | 80px (care pages), 60px (shipping), 32px (about, article intro) | 48px (care) |
| Title block → first content (bottom padding) | 64px | 40px |
| End of section → footer | 80px | 48px |
| h1 → intro paragraph | 20–24px (flex gap) | same |
| Paragraph → paragraph | **20px** (long-form) · 16px (care intro) · 24px (care-guide intro) | same |
| Long-form section → next section | 16px bottom padding plus about 32px heading top margin (ESG) | |
| Card image → title | 12px (story) · around 20px (care) | |
| Title → meta → excerpt | +23px → +20px (story card) | |

---

## 2. Tekla: page by page

The per-viewport tables come from `editorial-report.mjs`. Columns: doc height · h1–h4 (size/line-height weight) · first body paragraph · paragraph width (≈ characters per line) · content left x · paragraph gap · number of top-level content sections · first images (w×h, ratio) · accordion row height/padding · table row height.

### 2.1 ESG (`/esg`): long-form single column, used as the model for `our-materials` / `quality` / `manufacturing`

Section inventory (in order):
1. Title: h1 24/36, centred above the column (the only centred h1 on Tekla).
2. Intro paragraph(s): 700 column.
3. Hero image: 700×560 (5:4), full column width, no caption.
4. Text sections ×3 ("Governance", "Environment", "Social"): h2 18/27 followed by 4–8 paragraphs at a 20px gap. Bulleted points are written as paragraphs that start with an en dash, not as `<ul>`.
5. A footnote paragraph in italic (one instance).
6. "Policies and guidelines" link list: en-dash list of underlined links to PDFs, then two trailing paragraphs. 80px bottom padding.

Responsive: the column holds at 700 down to 768 (x=34), then becomes full width minus 16px gutters. The image keeps 5:4 (358×286 at 390). Headings step down 24→20 and 18→16 at mobile.

### 2.2 Care guide hub (`/care-guide`)

1. Header block: h1 plus a 3-line intro in the 732 column. Padding 80/64 (48/40 mobile). Flex column with a 20px gap.
2. Two-up tiles: grid `576px 576px`, gap 40/16. Each tile is a 4:5 image (576×720), then an h2 20/30, then a one-to-two-line description. The whole tile is a link and has no hover effect.
3. Closing block: a sentence, a **video** (1168 wide), then a text-button "Explore all products" (14/21 with a 1px black underline, 121px wide). Padding 80/80. **Inaccessible state:** the video area renders blank in headless Chromium (H.264 is unsupported). Treat it as a 16:9 video slot.

Responsive: the 2-up grid holds through 768 (360×450). It stacks to one column at ≤390 (358×448).

### 2.3 Textile care index (`/care-guide/textile-care`): the model for the **fabric guide** and **care guide** index

1. Breadcrumb (14/20.3, muted `#707070`, chevron separator, underline fades in on hover) → h1 → 3 intro paragraphs (16px gap). Padding 80/64.
2. Card grid: 3 columns × 379px in 1168, gap 40 row / 16 column, 12 cards. Each card is a 4:5 image, then an h2 20/30, then a "Read more" link (14px). Bottom padding 80.

Responsive: 3 columns at 1024 (320 wide), 2 columns at 768, 1 column at ≤390 (358×448). This makes for very long pages on mobile (8580px).

### 2.4 Textile care detail (`/care-guide/textile-care/percale-bedding`): the model for the **fabric detail** and **care detail** templates

1. Breadcrumb (3 levels) → h1 24/35 → 2-line intro → **hero image 732×915 (4:5)** in the text column (left-aligned, not full-bleed). Padding 80/64.
2. Stacked text blocks in the 732 column: "Care" (an intro paragraph plus about 8 single-line tips as list items in muted grey), "Quality", "Design", "Details" (a spec list of about 6 short lines with no bullets: composition, thread count, finish, closure, origin). Each block has an h2 20/29 and 14/20.3 copy. 80 bottom padding.
3. "More textile care": an h2 and a 3-up related-card grid, using the same card as 2.3.

The "Details" list is the visual home for **Fabric metaobject specs**: composition, thread count, finish, origin.

### 2.5 Product care (`/care-guide/product-care`)

1. Breadcrumb → h1 → intro. Padding 80/64.
2. A 3-column grid of **topic cards** (Washing, Drying, Stains, …): each is a 4:5 image (379×473), then an h2 20/30, then 1–3 paragraphs of copy **inline in the card** (no click-through). 6 cards. 2 columns at 768, 1 column at mobile.

This is the model for **care-by-topic** blocks (washing / drying / storage / longevity).

### 2.6 About (`/about-tekla`)

1. h1 24/36, then h2 "Our story" 18/27, then 5 paragraphs, then h2 "Our purpose", then 6 paragraphs (one with an inline underlined link), then h2 "Our products" with a paragraph. Column **992** (max-w-5xl). Top padding 32.
2. "Discover our full collection" label → 4-up image links (236×295, 4:5, gap 16) with a 14/21 caption under each (Bed / Bath / Clothing / Home).

Responsive: 4-up stays 4-up at 768 (172 wide). At 390 the tiles are 269 wide, which means a **horizontal scroll rail** with a peek of the next tile.

### 2.7 Stories index (`/projects`): the model for **main-blog**

1. h1 "Stories" → a one-line intro (764 column).
2. **Filter row**: 4 text links (All / Projects / People / Places), 14/21, about 56px apart (16px padding each side and a 24px gap). The active link has a 1px black bottom border. These are links to tag URLs and are not client-side tabs.
3. Card grid: 3 × 379 with a 44px row gap. Card: 16:10 image (379×237), then +12px title 14/21 **400**, then a meta row 12/18 (`date | category` with a thin "|" separator), then a 14/21 excerpt (2–3 lines). No hover effect.
4. Pagination: "Showing 9 of 57 stories" (14/21, centred), a **progress bar** 216px wide with a 1px track and a dark fill proportional to the count, then an outlined **Show more** `<button>` (112×44, padding 0 16px, 1px grey border, transparent background, colour transition).

Responsive: 3-up at 768 (235 wide), 1-up at 390. The filter row wraps to 2 lines at 390 with a 16px gap.

### 2.8 Story article (`/projects/a-guide-to-down`): the model for **main-article** and "how it's made" brand pages

1. h1 centred 24/36 → intro paragraph in a 612 column (+32px top).
2. **Alternating image/text rows** ×4: a grid of `333px 333px` with a **2px gap** (668 total, centred). One cell holds a 4:5 image (333×416), and the other holds a 14/21 label (for example "Inspecting") plus a paragraph, padded 16px inside (301 wide). The sides alternate: image-left, image-right, image-left, image-right. The rows sit edge to edge with about 48px between them.
3. Long-form text block in 612 (h3-style label 14/21, then paragraphs at a 20px gap).
4. Two-up images 326×408 (4:5), gap 16.
5. More long-form text (3 sub-topics, each a 14/21 label plus paragraphs).
6. Product rail "Discover the …": 3 product cards (212×265, 4:5, on a light grey tile), a right-arrow button, then a centred outlined CTA button.

Responsive: at 390 the alternating rows stack with **the image first** (326 wide, inset 32), and the text below is inset 48 (294 wide). The rail shows 1.3 cards and scrolls.

### 2.9 Shipping and returns (`/shipping-and-returns`): the model for **page.shipping / page.returns / FAQ**

1. h1 "Shipping and delivery" → 9 short paragraphs (an en-dash country list, 20px gap) in the 732 column. Top padding 60.
2. Accordion group: a group label (a 14/21 `<p>` such as "Shipping and delivery", inset 16px) followed by rows. **Row:** `<button aria-expanded>`, 61–63px tall, padding `20px 0`, 14/21 300, a "+" icon at the right edge, `border-bottom: 1px solid #e3e3e3`. The rows are inset 16px from the column (700 wide). The panel opens **instantly** (no transition) to full height. Panel copy is 14/21 and can be very long (4000px or more with tables).
3. A second h1-sized heading "Returns" (24/36, around 80px top gap) with a second accordion group.

States: `states/1440-accordion-open-{60ms,200ms,settled}.png` are identical, which confirms the panel opens with no animation.

### 2.10 Size guide (`/size-guide`)

1. h1 → a 3-line intro in the 668 column.
2. **Category list**: 5 full-width `<button>` rows, 68px tall, padding `12px 16px`, a 1px `#e3e3e3` border at top and bottom, a label at 14/21, and a chevron-right at the right edge. Hover is a colour transition at 0.15s.
3. **On click:** a full-screen white panel replaces the view. It has no URL change and no `role=dialog`. The 100ms and settled frames differ, so there is a short fade or content load (compare `size-guide/states/*-row-open-*.png`). Inside the panel:
   - a **unit select** (`cm ▾`, 92×32, 1px border);
   - a **tab row** with one tab per product ("Duvet cover", …), the active tab with a 1px black underline over a full-width hairline;
   - an intro paragraph;
   - a **table**: 3 columns (Country / Single / Double), a bold header row, then 56px rows with cell padding `1px 32px 1px 16px` and **zebra striping** (`≈ rgb(235,235,235)` on odd rows, no borders). It is 668 wide on desktop and scrolls horizontally on mobile (516 wide inside the 358 viewport).

Sakooon needs: a bedding size guide and a mattress measurement guide. Use the same category-row → panel pattern, but give each category its **own anchor or URL** so that a product page can deep-link to it. That is better for SEO and accessibility than Tekla's stateless overlay.

### 2.11 Contact (`/contact`)

A plain text page with **no h1**: opening hours, then email and phone, then department emails, in the 1280-wide left-aligned container at x=80. Each block is a set of paragraphs with 20–24px gaps and underlined mailto links. There is no form; Tekla routes support to a help centre and live chat. Sakooon's contact page needs a form (Shopify `contact` form), so Tekla only supplies the type and spacing here.

### 2.12 Per-viewport tables (Tekla)

#### tekla/about
https://teklafabrics.com/about-tekla — "About Tekla | Timeless designs for the modern home | Tekla"
| vw | doc h | h1 | h2 | h3 | h4 | body p | p width (chars) | content x | p gap | sections | images (first 3 w×h ratio) | accordion row h / pad | table row h |
| 1920 | 1799 | 24/36 300 | 18/27 300 | – | – | 14/21 300 | 992px (160) | 464 | 20 | 2 | 236×295 (0.8), 236×295 (0.8), 236×295 (0.8) | – | – |
| 1440 | 1799 | 24/36 300 | 18/27 300 | – | – | 14/21 300 | 992px (160) | 224 | 20 | 2 | 236×295 (0.8), 236×295 (0.8), 236×295 (0.8) | – | – |
| 1280 | 1799 | 24/36 300 | 18/27 300 | – | – | 14/21 300 | 992px (160) | 144 | 20 | 2 | 236×295 (0.8), 236×295 (0.8), 236×295 (0.8) | – | – |
| 1024 | 1820 | 24/36 300 | 18/27 300 | – | – | 14/21 300 | 992px (160) | 16 | 20 | 2 | 236×295 (0.8), 236×295 (0.8), 236×295 (0.8) | – | – |
| 768 | 2150 | 24/36 300 | 18/27 300 | – | – | 14/21 300 | 736px (119) | 16 | 20 | 2 | 172×215 (0.8), 172×215 (0.8), 172×215 (0.8) | – | – |
| 390 | 3426 | 20/30 300 | 16/24 300 | – | – | 14/21 300 | 358px (58) | 16 | 20 | 2 | 269×336 (0.8), 269×336 (0.8), 269×336 (0.8) | – | – |
| 375 | 3412 | 20/30 300 | 16/24 300 | – | – | 14/21 300 | 343px (55) | 16 | 20 | 2 | 257×322 (0.8), 257×322 (0.8), 257×322 (0.8) | – | – |
#### tekla/care-guide
https://teklafabrics.com/care-guide — "Care guide | How to care for your products"
| vw | doc h | h1 | h2 | h3 | h4 | body p | p width (chars) | content x | p gap | sections | images (first 3 w×h ratio) | accordion row h / pad | table row h |
| 1920 | 2430 | 24/36 300 | 20/30 300 | – | – | 14/20.3 300 | 732px (118) | 376 | 24 | 3 | 576×720 (0.8), 576×720 (0.8) | – | – |
| 1440 | 2430 | 24/36 300 | 20/30 300 | – | – | 14/20.3 300 | 732px (118) | 136 | 24 | 3 | 576×720 (0.8), 576×720 (0.8) | – | – |
| 1280 | 2430 | 24/36 300 | 20/30 300 | – | – | 14/20.3 300 | 732px (118) | 56 | 24 | 3 | 576×720 (0.8), 576×720 (0.8) | – | – |
| 1024 | 2242 | 24/36 300 | 20/30 300 | – | – | 14/20.3 300 | 732px (118) | 16 | 24 | 3 | 488×610 (0.8), 488×610 (0.8) | – | – |
| 768 | 2180 | 24/36 300 | 20/30 300 | – | – | 14/20.3 300 | 732px (118) | 16 | 24 | 3 | 360×450 (0.8), 360×450 (0.8) | – | – |
| 390 | 3161 | 24/36 300 | 20/30 300 | – | – | 14/20.3 300 | 358px (58) | 16 | 24 | 3 | 358×448 (0.8), 358×448 (0.8) | – | – |
| 375 | 3135 | 24/36 300 | 20/30 300 | – | – | 14/20.3 300 | 343px (55) | 16 | 24 | 3 | 343×429 (0.8), 343×429 (0.8) | – | – |
#### tekla/contact
https://teklafabrics.com/contact — "Contact Tekla | Customer Service, Press & Sales | Tekla"
| vw | doc h | h1 | h2 | h3 | h4 | body p | p width (chars) | content x | p gap | sections | images (first 3 w×h ratio) | accordion row h / pad | table row h |
| 1920 | 1011 | – | – | – | – | 14/21 300 | 1760px (285) | 80 | 20/24 | 3 | – | 21 / 0px 8px 0px 8px | – |
| 1440 | 1011 | – | – | – | – | 14/21 300 | 1280px (207) | 80 | 20/24 | 3 | – | 21 / 0px 8px 0px 8px | – |
| 1280 | 1011 | – | – | – | – | 14/21 300 | 1120px (181) | 80 | 20/24 | 3 | – | 21 / 0px 8px 0px 8px | – |
| 1024 | 1076 | – | – | – | – | 14/21 300 | 864px (140) | 80 | 20/24 | 3 | – | 21 / 0px 8px 0px 8px | – |
| 768 | 1274 | – | – | – | – | 14/21 300 | 608px (98) | 80 | 20/24 | 3 | – | 48 / 0px 0px 0px 0px | – |
| 390 | 1927 | – | – | – | – | 14/21 300 | 358px (58) | 16 | 20/24 | 3 | – | 48 / 0px 0px 0px 0px | – |
| 375 | 1927 | – | – | – | – | 14/21 300 | 343px (55) | 16 | 20/24 | 3 | – | 48 / 0px 0px 0px 0px | – |
#### tekla/esg
https://teklafabrics.com/esg — "ESG at Tekla | Environmental, Social & Governance | Tekla"
| vw | doc h | h1 | h2 | h3 | h4 | body p | p width (chars) | content x | p gap | sections | images (first 3 w×h ratio) | accordion row h / pad | table row h |
| 1920 | 3395 | 24/36 300 | 18/27 300 | 18/27 300 | – | 14/21 300 | 700px (113) | 610 | 20 | 7 | 700×560 (1.25) | – | – |
| 1440 | 3395 | 24/36 300 | 18/27 300 | 18/27 300 | – | 14/21 300 | 700px (113) | 370 | 20 | 7 | 700×560 (1.25) | – | – |
| 1280 | 3395 | 24/36 300 | 18/27 300 | 18/27 300 | – | 14/21 300 | 700px (113) | 290 | 20 | 7 | 700×560 (1.25) | – | – |
| 1024 | 3416 | 24/36 300 | 18/27 300 | 18/27 300 | – | 14/21 300 | 700px (113) | 162 | 20 | 7 | 700×560 (1.25) | – | – |
| 768 | 3658 | 24/36 300 | 18/27 300 | 18/27 300 | – | 14/21 300 | 700px (113) | 34 | 20 | 7 | 700×560 (1.25) | – | – |
| 390 | 4901 | 20/30 300 | 16/24 300 | 16/24 300 | – | 14/21 300 | 358px (58) | 16 | 20 | 7 | 358×286 (1.251) | – | – |
| 375 | 4994 | 20/30 300 | 16/24 300 | 16/24 300 | – | 14/21 300 | 343px (55) | 16 | 20 | 7 | 343×274 (1.251) | – | – |
#### tekla/product-care
https://teklafabrics.com/care-guide/product-care — "Product care | How to care for your products"
| vw | doc h | h1 | h2 | h3 | h4 | body p | p width (chars) | content x | p gap | sections | images (first 3 w×h ratio) | accordion row h / pad | table row h |
| 1920 | 2072 | 24/36 300 | 20/30 300 | – | – | 14/20.3 300 | 732px (118) | 376 | 16 | 2 | 379×473 (0.8), 379×473 (0.8), 379×473 (0.8) | – | – |
| 1440 | 2072 | 24/36 300 | 20/30 300 | – | – | 14/20.3 300 | 732px (118) | 136 | 16 | 2 | 379×473 (0.8), 379×473 (0.8), 379×473 (0.8) | – | – |
| 1280 | 2072 | 24/36 300 | 20/30 300 | – | – | 14/20.3 300 | 732px (118) | 56 | 16 | 2 | 379×473 (0.8), 379×473 (0.8), 379×473 (0.8) | – | – |
| 1024 | 1947 | 24/36 300 | 20/30 300 | – | – | 14/20.3 300 | 732px (118) | 16 | 16 | 2 | 320×400 (0.8), 320×400 (0.8), 320×400 (0.8) | – | – |
| 768 | 2861 | 24/36 300 | 20/30 300 | – | – | 14/20.3 300 | 732px (118) | 16 | 16 | 2 | 360×450 (0.8), 360×450 (0.8), 360×450 (0.8) | – | – |
| 390 | 5205 | 24/36 300 | 20/30 300 | – | – | 14/20.3 300 | 358px (58) | 16 | 16 | 2 | 358×448 (0.8), 358×448 (0.8), 358×448 (0.8) | – | – |
| 375 | 5093 | 24/36 300 | 20/30 300 | – | – | 14/20.3 300 | 343px (55) | 16 | 16 | 2 | 343×429 (0.8), 343×429 (0.8), 343×429 (0.8) | – | – |
#### tekla/shipping-and-returns
https://teklafabrics.com/shipping-and-returns — "Shipping & returns I General guidelines | Tekla"
| vw | doc h | h1 | h2 | h3 | h4 | body p | p width (chars) | content x | p gap | sections | images (first 3 w×h ratio) | accordion row h / pad | table row h |
| 1920 | 1614 | 24/36 300 | – | – | – | 14/21 300 | 732px (118) | 594 | 20 | 2 | – | 63 / 20px 0px 20px 0px | – |
| 1440 | 1614 | 24/36 300 | – | – | – | 14/21 300 | 732px (118) | 354 | 20 | 2 | – | 63 / 20px 0px 20px 0px | – |
| 1280 | 1614 | 24/36 300 | – | – | – | 14/21 300 | 732px (118) | 274 | 20 | 2 | – | 63 / 20px 0px 20px 0px | – |
| 1024 | 1635 | 24/36 300 | – | – | – | 14/21 300 | 732px (118) | 146 | 20 | 2 | – | 63 / 20px 0px 20px 0px | – |
| 768 | 1877 | 24/36 300 | – | – | – | 14/21 300 | 732px (118) | 18 | 20 | 2 | – | 63 / 20px 0px 20px 0px | – |
| 390 | 2560 | 20/30 300 | – | – | – | 14/21 300 | 390px (63) | 0 | 20 | 2 | – | 63 / 20px 0px 20px 0px | – |
| 375 | 2581 | 20/30 300 | – | – | – | 14/21 300 | 375px (61) | 0 | 20 | 2 | – | 63 / 20px 0px 20px 0px | – |
#### tekla/size-guide
https://teklafabrics.com/size-guide — "Tekla Fabrics"
| vw | doc h | h1 | h2 | h3 | h4 | body p | p width (chars) | content x | p gap | sections | images (first 3 w×h ratio) | accordion row h / pad | table row h |
| 1920 | 1033 | 24/36 300 | – | – | – | 14/21 300 | 668px (108) | 626 | – | 2 | – | – | – |
| 1440 | 1033 | 24/36 300 | – | – | – | 14/21 300 | 668px (108) | 386 | – | 2 | – | – | – |
| 1280 | 1033 | 24/36 300 | – | – | – | 14/21 300 | 668px (108) | 306 | – | 2 | – | – | – |
| 1024 | 1076 | 24/36 300 | – | – | – | 14/21 300 | 668px (108) | 178 | – | 2 | – | – | – |
| 768 | 1296 | 24/36 300 | – | – | – | 14/21 300 | 668px (108) | 50 | – | 2 | – | – | – |
| 390 | 1955 | 24/36 300 | – | – | – | 14/21 300 | 358px (58) | 16 | – | 2 | – | – | – |
| 375 | 1955 | 24/36 300 | – | – | – | 14/21 300 | 343px (55) | 16 | – | 2 | – | – | – |
#### tekla/stories
https://teklafabrics.com/projects — "Stories | Interviews, projects and the inspiration behind Tekla"
| vw | doc h | h1 | h2 | h3 | h4 | body p | p width (chars) | content x | p gap | sections | images (first 3 w×h ratio) | accordion row h / pad | table row h |
| 1920 | 2028 | 24/36 300 | 14/21 400 | – | – | 14/21 300 | 764px (124) | 376 | – | 4 | 379×237 (1.6), 379×235 (1.608), 379×237 (1.6) | – | – |
| 1440 | 2028 | 24/36 300 | 14/21 400 | – | – | 14/21 300 | 764px (124) | 136 | – | 4 | 379×237 (1.6), 379×235 (1.608), 379×237 (1.6) | – | – |
| 1280 | 2028 | 24/36 300 | 14/21 400 | – | – | 14/21 300 | 764px (124) | 56 | – | 4 | 379×237 (1.6), 379×235 (1.608), 379×237 (1.6) | – | – |
| 1024 | 1960 | 24/36 300 | 14/21 400 | – | – | 14/21 300 | 764px (124) | 16 | – | 4 | 320×200 (1.6), 320×199 (1.607), 320×200 (1.6) | – | – |
| 768 | 2106 | 24/36 300 | 14/21 400 | – | – | 14/21 300 | 736px (119) | 16 | – | 4 | 235×147 (1.6), 235×146 (1.61), 235×147 (1.6) | – | – |
| 390 | 4998 | 20/30 300 | 14/21 400 | – | – | 14/21 300 | 358px (58) | 16 | – | 4 | 358×224 (1.6), 358×223 (1.608), 358×224 (1.6) | – | – |
| 375 | 4913 | 20/30 300 | 14/21 400 | – | – | 14/21 300 | 343px (55) | 16 | – | 4 | 343×214 (1.6), 343×213 (1.607), 343×214 (1.6) | – | – |
#### tekla/story-guide-to-down
https://teklafabrics.com/projects/a-guide-to-down — "A guide to down | Tekla Fabrics"
| vw | doc h | h1 | h2 | h3 | h4 | body p | p width (chars) | content x | p gap | sections | images (first 3 w×h ratio) | accordion row h / pad | table row h |
| 1920 | 4708 | 24/36 300 | – | – | – | 14/21 300 | 612px (99) | 654 | 20 | 12 | 333×416 (0.8), 333×416 (0.8), 333×416 (0.8) | – | – |
| 1440 | 4708 | 24/36 300 | – | – | – | 14/21 300 | 612px (99) | 414 | 20 | 12 | 333×416 (0.8), 333×416 (0.8), 333×416 (0.8) | – | – |
| 1280 | 4708 | 24/36 300 | – | – | – | 14/21 300 | 612px (99) | 334 | 20 | 12 | 333×416 (0.8), 333×416 (0.8), 333×416 (0.8) | – | – |
| 1024 | 4729 | 24/36 300 | – | – | – | 14/21 300 | 612px (99) | 206 | 20 | 12 | 333×416 (0.8), 333×416 (0.8), 333×416 (0.8) | – | – |
| 768 | 4971 | 24/36 300 | – | – | – | 14/21 300 | 612px (99) | 78 | 20 | 12 | 333×416 (0.8), 333×416 (0.8), 333×416 (0.8) | – | – |
| 390 | 7820 | 24/36 300 | – | – | – | 14/21 300 | 358px (58) | 16 | 20 | 12 | 326×408 (0.8), 326×408 (0.8), 326×408 (0.8) | – | – |
| 375 | 7777 | 24/36 300 | – | – | – | 14/21 300 | 343px (55) | 16 | 20 | 12 | 311×389 (0.8), 311×389 (0.8), 311×389 (0.8) | – | – |
#### tekla/textile-care
https://teklafabrics.com/care-guide/textile-care — "Textiles care | How to care for your products"
| vw | doc h | h1 | h2 | h3 | h4 | body p | p width (chars) | content x | p gap | sections | images (first 3 w×h ratio) | accordion row h / pad | table row h |
| 1920 | 3243 | 24/36 300 | 20/30 300 | – | – | 14/20.3 300 | 732px (118) | 376 | 16 | 2 | 379×473 (0.8), 379×473 (0.8), 379×473 (0.8) | – | – |
| 1440 | 3243 | 24/36 300 | 20/30 300 | – | – | 14/20.3 300 | 732px (118) | 136 | 16 | 2 | 379×473 (0.8), 379×473 (0.8), 379×473 (0.8) | – | – |
| 1280 | 3243 | 24/36 300 | 20/30 300 | – | – | 14/20.3 300 | 732px (118) | 56 | 16 | 2 | 379×473 (0.8), 379×473 (0.8), 379×473 (0.8) | – | – |
| 1024 | 2971 | 24/36 300 | 20/30 300 | – | – | 14/20.3 300 | 732px (118) | 16 | 16 | 2 | 320×400 (0.8), 320×400 (0.8), 320×400 (0.8) | – | – |
| 768 | 4558 | 24/36 300 | 20/30 300 | – | – | 14/20.3 300 | 732px (118) | 16 | 16 | 2 | 360×450 (0.8), 360×450 (0.8), 360×450 (0.8) | – | – |
| 390 | 8580 | 24/36 300 | 20/30 300 | – | – | 14/20.3 300 | 358px (58) | 16 | 16 | 2 | 358×448 (0.8), 358×448 (0.8), 358×448 (0.8) | – | – |
| 375 | 8355 | 24/36 300 | 20/30 300 | – | – | 14/20.3 300 | 343px (55) | 16 | 16 | 2 | 343×429 (0.8), 343×429 (0.8), 343×429 (0.8) | – | – |
#### tekla/textile-care-percale
https://teklafabrics.com/care-guide/textile-care/percale-bedding — "Percale bedding | Care for percale bedding"
| vw | doc h | h1 | h2 | h3 | h4 | body p | p width (chars) | content x | p gap | sections | images (first 3 w×h ratio) | accordion row h / pad | table row h |
| 1920 | 3374 | 24/34.8 300 | 20/29 300 | – | – | 14/20.3 300 | 732px (118) | 376 | 16 | 3 | 732×915 (0.8), 379×473 (0.8), 379×473 (0.8) | – | – |
| 1440 | 3374 | 24/34.8 300 | 20/29 300 | – | – | 14/20.3 300 | 732px (118) | 136 | 16 | 3 | 732×915 (0.8), 379×473 (0.8), 379×473 (0.8) | – | – |
| 1280 | 3374 | 24/34.8 300 | 20/29 300 | – | – | 14/20.3 300 | 732px (118) | 56 | 16 | 3 | 732×915 (0.8), 379×473 (0.8), 379×473 (0.8) | – | – |
| 1024 | 3321 | 24/34.8 300 | 20/29 300 | – | – | 14/20.3 300 | 732px (118) | 16 | 16 | 3 | 732×915 (0.8), 320×400 (0.8), 320×400 (0.8) | – | – |
| 768 | 4186 | 24/34.8 300 | 20/29 300 | – | – | 14/20.3 300 | 732px (118) | 16 | 16 | 3 | 732×915 (0.8), 360×450 (0.8), 360×450 (0.8) | – | – |
| 390 | 5108 | 24/34.8 300 | 20/29 300 | – | – | 14/20.3 300 | 358px (58) | 16 | 16 | 3 | 358×448 (0.8), 358×448 (0.8), 358×448 (0.8) | – | – |
| 375 | 5074 | 24/34.8 300 | 20/29 300 | – | – | 14/20.3 300 | 343px (55) | 16 | 16 | 3 | 343×429 (0.8), 343×429 (0.8), 343×429 (0.8) | – | – |


---

## 3. Parachute

Captured 2026-11-26. Every page has 7 viewports. One browser ran at a time, with at least 20s between loads and a 90s back-off on HTTP 429. Parachute fabrics@1920 was Cloudflare-blocked ("Just a moment…", 429) on the first run and was captured on a single later retry. Popups: a Rebuy "Your Cart" flyout opens itself and renders open in full-page captures. It was **hidden with CSS** for the screenshots (recorded per capture in `capture-log.json`), because it is site chrome and not content. A Gorgias chat bubble (bottom right) and a fixed promo bar were left in place.

**Labels.** **V** = verified from `getComputedStyle` / `getBoundingClientRect` in `<vw>-metrics.json`. **I** = inferred from screenshots, because the element is a custom widget the generic probe can't read (for example Parachute's accordions, which are not `<details>` and have no `aria-expanded`).

### 3.1 Global (Parachute)

| Token | Value | |
|---|---|---|
| Fonts | `Canela` (serif display, 300/400) for headings and statements; `Suisse Intl` (sans, 300–700) for body and UI. Substitutes are needed; names are recorded only | V |
| Text colour | `rgb(53,51,49)`; body copy often at 0.85 alpha | V |
| Background | `#fff` page; warm `rgb(241,238,233)` bands (fabric-guide tabs) and the footer | V |
| Hairline | `1px solid rgba(53,51,49,.25)` (FAQ rows ×119, fabric panels); strong `1px solid rgb(53,51,49)` (panel frames, contact boxes) | V |
| Header | 56px, `top:0`, sticky (the group wrapper sticks) | V |
| Side gutter | 56px desktop (x=56), 20px mobile | V |
| Display scale | h1 64/70.4 (care) or 40/41.6 (others); h2 40/41.6 to 40/52 with ls −0.4px; statement 32/33–36.8 (300); mobile h1/h2 30–32 | V |
| Body | 16/21.6–24 at 300–400 (care, story), 14/21 400 (FAQ answers), 16/28.8 400 (contact and returns help copy) | V |
| Labels | 16/16 500 uppercase ls 0.32px ("RETURNS", "THE SHEETING FABRIC GUIDE"), 12/21.6 500 uppercase (care links) | V |
| Motion | `all .3s linear` on almost everything (×180–580 elements), `filter .3s ease` on images, a hover image swap `opacity .2s` on product cards. No scroll-reveal (0 hidden-before-scroll elements on content pages; the hidden ones are swiper slides and card hover images) | V |
| Links in copy | underline 1px, offset 3px, `text-decoration-thickness .1s` on hover (care page) | V |

### 3.2 Our Fabrics Detail (`/pages/our-fabrics-detail`), the model for the `fabric-guide` "panels" layout

Inventory: (1) a two-tab band, "The sheeting fabric guide" / "The bath fabric guide", 83px tall, each tab 720 wide, the active tab on a darker warm ground (V). (2) A hero image band 1440×377 with a centred serif h2 40/41.6 and a 16/20.5 500 intro (V). (3) Per fabric (×5) a **panel**, 1250 wide at x=95, framed by a 1px ink border (V):
- a **texture banner** 1248×145 (≈8.6:1) with the fabric name in serif at 40px over it (V for size, I for overlay position);
- a body split about 430 / 600 (I from 1440 shot; the left statement column measures 430 wide at x=168, V);
- left: 3 outlined **chips** ("Crisp", "Smooth", "Breathable"), then a **statement** 24/33.6 Canela 400 (V), then two accordion rows, "Feel & Benefits" and "Craftsmanship & Care", on hairlines with chevrons (I);
- right: a product carousel of 160×213 (3:4) cards (V), then a full-width dark **"Shop all <fabric>"** button (I).

Mobile (390): the banner is 350×167; the columns stack with the statement first, then the accordions, then the carousel (V for sizes, I for order).

### 3.3 FAQ (`/pages/faq`), the model for the `faq` "sidebar" layout

Inventory: (1) a hero image 1440×432 with a centred title "Frequently asked questions", serif 40 (V). (2) Two columns: a **sticky "Jump to a section" column** 336 wide at x=56, `position: sticky; top: 30px`, 840 tall, holding 17 anchor links (V), beside an 881-wide question column at x=503 (V). Group headings are serif 40/40 (V). Questions are about 72px rows with a 1px hairline (`rgba(53,51,49,.25)`) and a chevron (I). Answers are 14/21 400 with a 12px paragraph gap (V). Transitions `all .2s/.3s ease` on rows (V).

Mobile: the jump list sits inline above the questions (not sticky); the question column is 350 wide (V).

### 3.4 Contact (`/pages/contact?view=contact`), referenced by `page.contact`

(1) A hero image 1440×471 with "Get support", serif 40 (V). (2) A two-column band: on the left a **sticky contact box** 656 wide (`top: 86px`), on the right 4 self-help cards (icon, serif 32/36.8 300 question, 16/28.8 copy, uppercase 16/16 500 link such as "RETURNS") (V). (3) A "Still need help?" strip with a 1px ink-outlined button (V). Mobile stacks it all at 350 wide (V).

### 3.5 Care (`/pages/care-2026`)

h1 64/70.4 Canela (V). Then **alternating 664-wide image/text rows** per product family (Bedding, Utility, Bath, Decor, Eco mattress), the image side alternating (x=56 / x=720) (V). Each row is followed by a 4-up product strip of 346-wide 3:4 cards (V). Copy is 16/21.6 300 (V). A care tip link is underlined 1px, offset 3px (V). Mobile: rows stack at 350 wide and the strips become a 2×2 grid at 175 wide (V).

### 3.6 Our story (`/pages/our-story`)

Hero 1440×609 with h1 40/41.6 (V) → a 2-column grid 654/654 with a 20px gap holding image and statement (V) → a 432 text / 950 image split (V) → testimonial quotes in serif (V) → two half-width image tiles 720/720 (V). Mobile stacks at 350 wide (V).

### 3.7 Blog (`/blogs/posts`) and Fabrics (`/pages/fabrics`)

- **Blog:** a hero 1440×560 with a serif 40 title, a "Latest stories" grid of 320×320 square cards, title 18/21.6 450, excerpt 14/19 400, and numbered pagination at 18px (V).
- **Fabrics:** a split hero of two 720×880 tiles ("Explore sheeting / bath fabrics", serif 40 over the image) (V), then a carousel of 432×630 category tiles (V).

### 3.8 Per-viewport tables (Parachute)

#### parachute/blog
https://parachutehome.com/blogs/posts — "Posts – Parachute Home"
| vw | doc h | h1 | h2 | h3 | h4 | body p | p width (chars) | content x | p gap | sections | images (first 3 w×h ratio) | accordion row h / pad | table row h |
| 1920 | 2902 | – | 40/52 400 | – | – | 14/19 400 | 440px (68) | 512 | – | 2 | 1920×560 (3.429), 440×440 (1), 440×440 (1) | – | – |
| 1440 | 2604 | – | 40/52 400 | – | – | 14/19 400 | 320px (49) | 392 | – | 2 | 1440×560 (2.571), 320×320 (1), 320×320 (1) | – | – |
| 1280 | 2454 | – | 40/52 400 | – | – | 13/17.7 400 | 298px (49) | 334 | – | 2 | 1280×560 (2.286), 298×298 (1), 298×298 (1) | – | – |
| 1024 | 2331 | – | 40/52 400 | – | – | 13/17.7 400 | 234px (39) | 270 | – | 2 | 1024×560 (1.829), 234×234 (1), 234×234 (1) | – | – |
| 768 | 3662 | – | 40/52 400 | – | – | 14/19 400 | 356px (55) | 392 | – | 2 | 768×560 (1.371), 356×356 (1), 356×356 (1) | – | – |
| 390 | 5874 | – | 30/39 400 | – | – | 14/19 400 | 350px (54) | 20 | – | 2 | 390×340 (1.147), 350×335 (1.044), 350×335 (1.044) | – | – |
| 375 | 5844 | – | 30/39 400 | – | – | 14/19 400 | 335px (52) | 20 | – | 2 | 375×340 (1.103), 335×321 (1.044), 335×321 (1.044) | – | – |
#### parachute/care
https://parachutehome.com/pages/care-2026 — "Care 2026 – Parachute Home"
| vw | doc h | h1 | h2 | h3 | h4 | body p | p width (chars) | content x | p gap | sections | images (first 3 w×h ratio) | accordion row h / pad | table row h |
| 1920 | 9841 | 64/70.4 400 | 40/52 400 | – | – | 16/21.6 300 | 440px (59) | 1030 | 24/10 | 14 | 1920×570 (3.368), 902×458 (1.969), 466×644 (0.723) | – | – |
| 1440 | 8575 | 64/70.4 400 | 40/52 400 | – | – | 16/21.6 300 | 440px (59) | 790 | 24/10 | 14 | 1440×570 (2.526), 662×458 (1.445), 346×481 (0.72) | – | – |
| 1280 | 8128 | 64/70.4 400 | 40/52 400 | – | – | 16/21.6 300 | 440px (59) | 710 | 24/10 | 14 | 1280×570 (2.246), 618×458 (1.349), 306×426 (0.718) | – | – |
| 1024 | 7497 | 64/70.4 400 | 40/52 400 | – | – | 16/21.6 300 | 352px (47) | 582 | 24/10 | 14 | 1024×570 (1.796), 490×458 (1.07), 242×339 (0.713) | – | – |
| 768 | 7228 | 32/35.2 400 | 40/52 400 | – | – | 16/21.6 300 | 284px (38) | 424 | 24/10 | 14 | 768×570 (1.347), 362×458 (0.79), 171×267 (0.64) | – | – |
| 390 | 9436 | 32/35.2 400 | 30/39 400 | – | – | 16/21.6 300 | 326px (44) | 32 | 24/10 | 12 | 390×570 (0.684), 348×294 (1.184), 175×233 (0.75) | – | – |
| 375 | 9431 | 32/35.2 400 | 30/39 400 | – | – | 16/21.6 300 | 311px (42) | 32 | 24/10 | 12 | 375×570 (0.658), 333×294 (1.133), 167×223 (0.75) | – | – |
#### parachute/contact
https://parachutehome.com/pages/contact?view=contact — "Contact Us | Parachute Home"
| vw | doc h | h1 | h2 | h3 | h4 | body p | p width (chars) | content x | p gap | sections | images (first 3 w×h ratio) | accordion row h / pad | table row h |
| 1920 | 3188 | – | 40/41.6 400 ls -0.4px | – | – | 16/28.8 400 | 423px (57) | 56 | – | 3 | 1920×587 (3.273), 42×48 (0.875), 46×47 (0.979) | – | – |
| 1440 | 3017 | – | 40/41.6 400 ls -0.4px | – | – | 16/28.8 400 | 300px (40) | 56 | – | 3 | 1440×471 (3.057), 42×48 (0.875), 46×47 (0.979) | – | – |
| 1280 | 2945 | – | 36/37.4 400 ls -0.4px | – | – | 16/28.8 400 | 291px (39) | 20 | – | 3 | 1280×467 (2.741), 42×48 (0.875), 46×47 (0.979) | – | – |
| 1024 | 2896 | – | 36/37.4 400 ls -0.4px | – | – | 16/28.8 400 | 224px (30) | 20 | – | 3 | 1024×467 (2.193), 42×48 (0.875), 46×47 (0.979) | – | – |
| 768 | 3892 | – | 34/35.4 400 ls -0.4px | – | – | 16/28.8 400 | 336px (45) | 20 | – | 3 | 768×386 (1.99), 42×48 (0.875), 46×47 (0.979) | – | – |
| 390 | 4873 | – | 32/33.3 400 | – | – | 15/27 400 | 330px (47) | 20 | – | 3 | 390×364 (1.071), 42×48 (0.875), 46×47 (0.979) | – | – |
| 375 | 4871 | – | 32/33.3 400 | – | – | 15/27 400 | 315px (45) | 20 | – | 3 | 375×350 (1.071), 42×48 (0.875), 46×47 (0.979) | – | – |
#### parachute/fabrics
https://parachutehome.com/pages/fabrics — "Fabrics – Parachute Home"
| vw | doc h | h1 | h2 | h3 | h4 | body p | p width (chars) | content x | p gap | sections | images (first 3 w×h ratio) | accordion row h / pad | table row h |
| 1920 | not captured |||||||||||||
| 1440 | 2492 | – | 40/41.6 400 ls -0.4px | 40/41.6 400 ls -0.4px | – | – | – | – | – | 2 | 720×880 (0.818), 720×880 (0.818), 432×630 (0.686) | – | – |
| 1280 | 2137 | – | 40/41.6 400 ls -0.4px | 36/37.4 400 ls -0.4px | – | – | – | – | – | 2 | 640×782 (0.818), 640×782 (0.818), 320×467 (0.686) | – | – |
| 1024 | 1931 | – | 40/41.6 400 ls -0.4px | 36/37.4 400 ls -0.4px | – | – | – | – | – | 2 | 512×626 (0.818), 512×626 (0.818), 320×467 (0.686) | – | – |
| 768 | 1876 | – | 40/41.6 400 ls -0.4px | 34/35.4 400 ls -0.4px | – | – | – | – | – | 2 | 384×469 (0.818), 384×469 (0.818), 240×350 (0.686) | – | – |
| 390 | 2735 | – | 24/33.6 400 ls -0.24px | 27.6/31 400 | – | – | – | – | – | 2 | 390×477 (0.818), 390×477 (0.818), 248×362 (0.686) | – | – |
| 375 | 2693 | – | 24/33.6 400 ls -0.24px | 27.6/31 400 | – | – | – | – | – | 2 | 375×459 (0.818), 375×459 (0.818), 248×362 (0.686) | – | – |
#### parachute/faq
https://parachutehome.com/pages/faq — "Faq – Parachute Home"
| vw | doc h | h1 | h2 | h3 | h4 | body p | p width (chars) | content x | p gap | sections | images (first 3 w×h ratio) | accordion row h / pad | table row h |
| 1920 | 11003 | – | 40/42 400 ls -0.6px | 40/41.6 400 ls -0.35px capitalize | – | 14/21 400 | 881px (136) | 983 | 12 | 2 | 1920×432 (4.449) | – | – |
| 1440 | 10883 | – | 40/42 400 ls -0.6px | 40/41.6 400 ls -0.35px capitalize | – | 14/21 400 | 881px (136) | 503 | 12 | 2 | 1440×432 (3.336) | – | – |
| 1280 | 10819 | – | 40/42 400 ls -0.6px | 40/41.6 400 ls -0.35px capitalize | – | 14/21 400 | 880px (136) | 380 | 12 | 2 | 1280×432 (2.966) | – | – |
| 1024 | 10769 | – | 32/33.6 400 ls -0.6px | 40/41.6 400 ls -0.35px capitalize | – | 14/21 400 | 695px (107) | 309 | 12 | 2 | 1024×432 (2.373) | – | – |
| 768 | 11044 | – | 32/33.6 400 ls -0.6px | 30/31.2 400 ls -0.35px capitalize | – | 14/21 400 | 421px (65) | 327 | 12 | 2 | 768×339 (2.264) | – | – |
| 390 | 12304 | – | 16/24 700 | 32/33.3 400 ls -0.35px capitalize | – | 14/21 400 | 350px (54) | 20 | 12 | 2 | 390×350 (1.116) | – | – |
| 375 | 12385 | – | 16/24 700 | 32/33.3 400 ls -0.35px capitalize | – | 14/21 400 | 335px (52) | 20 | 12 | 2 | 375×350 (1.073) | – | – |
#### parachute/our-fabrics-detail
https://parachutehome.com/pages/our-fabrics-detail — "Our Fabrics Detail – Parachute Home"
| vw | doc h | h1 | h2 | h3 | h4 | body p | p width (chars) | content x | p gap | sections | images (first 3 w×h ratio) | accordion row h / pad | table row h |
| 1920 | 5488 | – | 40/41.6 400 ls -0.4px | 16/17.6 400 | – | 16/20.5 500 | 1250px (166) | 335 | – | 3 | 1920×377 (5.093), 1700×145 (11.756), 160×213 (0.75) | – | – |
| 1440 | 5368 | – | 40/41.6 400 ls -0.4px | 16/17.6 400 | – | 16/20.5 500 | 1250px (166) | 95 | – | 3 | 1440×377 (3.82), 1248×145 (8.631), 160×213 (0.75) | – | – |
| 1280 | 4810 | – | 36/37.4 400 ls -0.4px | 16/17.6 400 | – | 16/20.5 500 | 1200px (159) | 40 | – | 3 | 1280×300 (4.267), 1238×117 (10.542), 160×213 (0.75) | – | – |
| 1024 | 4761 | – | 36/37.4 400 ls -0.4px | 16/17.6 400 | – | 16/20.5 500 | 944px (125) | 40 | – | 3 | 1024×300 (3.413), 982×117 (8.362), 160×213 (0.75) | – | – |
| 768 | 4545 | – | 34/35.4 400 ls -0.4px | 16/17.6 400 | – | 14/17.9 500 | 688px (104) | 40 | – | 3 | 768×300 (2.56), 726×103 (7.029), 160×213 (0.75) | – | – |
| 390 | 7446 | – | 24/33.6 400 ls -0.24px | 16/17.6 400 | – | 14/19 400 | 245px (38) | 73 | – | 3 | 390×240 (1.625), 350×167 (2.092), 160×213 (0.75) | – | – |
| 375 | 7499 | – | 24/33.6 400 ls -0.24px | 16/17.6 400 | – | 14/19 400 | 245px (38) | 65 | – | 3 | 375×240 (1.563), 335×167 (2.003), 160×213 (0.75) | – | – |
#### parachute/our-story
https://parachutehome.com/pages/our-story — "Our story – Parachute Home"
| vw | doc h | h1 | h2 | h3 | h4 | body p | p width (chars) | content x | p gap | sections | images (first 3 w×h ratio) | accordion row h / pad | table row h |
| 1920 | 5348 | 40/41.6 400 ls -0.4px | 32/33.3 300 | – | – | 16/24 400 | 438px (59) | 1198 | – | 5 | 1920×812 (2.364), 289×289 (1), 289×560 (0.516) | – | – |
| 1440 | 4350 | 40/41.6 400 ls -0.4px | 32/33.3 300 | – | – | 16/24 400 | 438px (59) | 838 | – | 5 | 1440×609 (2.364), 209×209 (1), 209×405 (0.516) | – | – |
| 1280 | 3985 | 40/41.6 400 ls -0.4px | 32/33.3 300 | – | – | 16/24 400 | 438px (59) | 736 | – | 5 | 1280×541 (2.364), 195×195 (1), 195×377 (0.516) | – | – |
| 1024 | 3334 | 40/41.6 400 ls -0.4px | 32/33.3 300 | – | – | 16/24 400 | 438px (59) | 544 | – | 5 | 1024×433 (2.364), 152×152 (1), 152×295 (0.516) | – | – |
| 768 | 3447 | 40/41.6 400 ls -0.4px | 32/33.3 300 | – | – | 16/24 400 | 354px (48) | 394 | – | 5 | 768×325 (2.364), 354×498 (0.711), 345×517 (0.666) | – | – |
| 390 | 5112 | 32/33.3 400 ls -0.32px | 32/33.3 300 | – | – | 15/22.5 400 | 350px (50) | 20 | – | 5 | 390×333 (1.172), 350×265 (1.323), 224×337 (0.666) | – | – |
| 375 | 5000 | 32/33.3 400 ls -0.32px | 32/33.3 300 | – | – | 15/22.5 400 | 335px (48) | 20 | – | 5 | 375×320 (1.172), 335×253 (1.323), 215×322 (0.666) | – | – |
#### parachute/returns
https://parachutehome.com/pages/returns — "Returns – Parachute Home"
| vw | doc h | h1 | h2 | h3 | h4 | body p | p width (chars) | content x | p gap | sections | images (first 3 w×h ratio) | accordion row h / pad | table row h |
| 1920 | 3584 | – | 40/41.6 400 ls -0.4px | – | – | 16/20.5 500 ls -0.55px | 432px (57) | 744 | – | 3 | 1920×587 (3.273), 74×50 (1.48), 60×67 (0.896) | – | – |
| 1440 | 3348 | – | 40/41.6 400 ls -0.4px | – | – | 16/20.5 500 ls -0.55px | 432px (57) | 504 | – | 3 | 1440×472 (3.054), 74×50 (1.48), 60×67 (0.896) | – | – |
| 1280 | 3174 | – | 36/37.4 400 ls -0.4px | – | – | 16/20.5 500 ls -0.55px | 432px (57) | 424 | – | 3 | 1280×467 (2.739), 74×50 (1.48), 60×67 (0.896) | – | – |
| 1024 | 3211 | – | 36/37.4 400 ls -0.4px | – | – | 16/20.5 500 ls -0.55px | 432px (57) | 296 | – | 3 | 1024×467 (2.191), 74×50 (1.48), 60×67 (0.896) | – | – |
| 768 | 3770 | – | 34/35.4 400 ls -0.4px | – | – | 16/20.5 500 ls -0.55px | 432px (57) | 168 | – | 3 | 768×386 (1.988), 74×50 (1.48), 60×67 (0.896) | – | – |
| 390 | 4691 | – | 32/33.3 400 | – | – | 15/19.2 400 | 283px (41) | 54 | – | 3 | 390×311 (1.254), 74×50 (1.48), 60×67 (0.896) | – | – |
| 375 | 4739 | – | 32/33.3 400 | – | – | 15/19.2 400 | 283px (41) | 46 | – | 3 | 375×299 (1.254), 74×50 (1.48), 60×67 (0.896) | – | – |

### 3.9 What we take from Parachute (and what we don't)

| Parachute pattern | Used in | Status |
|---|---|---|
| Sticky "Jump to a section" column beside the FAQ | `faq` layout `sidebar` (336/881 proportion) | implemented in the visual pass |
| Fabric panel: texture banner, chips, statement, accordions, products, "Shop all" | `fabric-guide` layout `panels` | implemented in the visual pass |
| Alternating image/text rows with a product strip (care) | `editorial-image-text` + `related-products-editorial` | already possible |
| Self-help cards on contact | `info-columns` with icons | already possible |
| Serif display face and uppercase labels | **not adopted**. Decision D4 is one grotesk family, Tekla's typography | by design |
| Full-bleed hero image bands on every page | optional (`editorial-hero` image width "full") | by design: Tekla-style text headers are the default |


---

## 4. Proposed reusable editorial section library

All sections share these settings: `color_scheme`, `padding_top` / `padding_bottom` (default 80/80 desktop, ×0.6 on mobile, following the Tekla 80→48 ratio), `width` (`text` 732 · `narrow` 668/612 · `wide` 1168 · `full`), and a heading through the `section-heading` snippet. All copy is placeholder.

| Section | Purpose | Settings | Blocks | Reference |
|---|---|---|---|---|
| `editorial-hero` | page title block: breadcrumb, h1, intro, optional image | breadcrumb on/off, heading size (`h1` 24/36 or `display`), alignment left/centre, width, image ratio (4:5 / 5:4 / 16:9 / full-bleed), image position (below text / background) | `text` (rich text), `button` | Tekla care header, ESG title, Parachute guide hero |
| `editorial-text` | long-form column of headed rich text | width, paragraph spacing (16/20/24), measure on/off | `heading`, `rich_text`, `list` (en-dash or bullet), `footnote`, `link_list` | ESG body, about, care detail "Quality/Design" |
| `editorial-image-text` | **alternating** image/text rows | layout (`split-50` 2px gap / `split-60`), first image side, alternate on/off, image ratio, stack order on mobile (image first) | `row` (image, label, rich text, link) ×n | Tekla article "Inspecting/Cleaning…" |
| `editorial-gallery` | 2–4-up images with optional captions; becomes a scroll rail on mobile | columns 2/3/4, ratio, captions, mobile rail on/off | `image` (image, caption, link) | about 4-up, article 2-up |
| `editorial-quote` | pull quote or statement | size, alignment, attribution | — | (statement copy; Parachute "Essentials for easy living…" serif statement) |
| `editorial-stats` | figures in a row | columns, number style | `stat` (value, label, footnote) | placeholder only: **no sustainability figures** unless they are substantiated |
| `editorial-timeline` | our-story milestones | orientation | `milestone` (year, title, text, image) | brand story |
| `guide-anchor-nav` | sticky in-page nav for long guides | sticky on/off, top offset = header height (52), style (links / pills) | `link` (label, anchor) or auto from `editorial-text` headings | **not present on Tekla** (no anchors, no sticky side nav): proposed for long Sakooon guides |
| `guide-card-grid` | index of guides, fabrics or care topics as 4:5 cards | columns 2/3/4, ratio, show description, "Read more" label, inline body (product-care style) on/off | `card` (image, title, text, link) | care hub 2-up, textile-care 3-up, product-care topic cards |
| `faq` | grouped accordions | group label style, icon (+ / chevron), open first, animate on/off (Tekla: off) | `group` heading, `question` (question, rich answer) | shipping & returns |
| `info-columns` | 2–4 columns of short headed info (hours, contacts, policies) | columns, dividers | `column` (heading, rich text, link) | contact |
| `contact-form` | Shopify contact form | fields toggles, side text | `text` | — |
| `main-page` | default page.content renderer | width, heading on/off | — | — |
| `care-guide` | care content by topic (wash, dry, iron, store, longevity) reading a `care_guide` metaobject or blocks | source (metaobject / blocks), layout (stacked / topic-cards), show care symbols | `topic` (icon, heading, text, image) | Tekla percale "Care" list + product-care cards |
| `guide-size-table` | size or measurement tables with a unit toggle (cm/in) and tabs per product | default unit, zebra on/off | `table` (title, intro, CSV-like rows), `diagram` (image, steps) | Tekla size-guide panel |
| `fabric-guide` | fabric index: cards with ratings | columns, show ratings, filter by fibre/weave | auto from `fabric` metaobjects (or `page.metafields.sakooon.fabrics`) | textile-care index, Parachute fabric guide |
| `fabric-compare` | comparison table across fabrics | rows to show (toggles), sticky first column on mobile | auto | Parachute fabric comparison (see §3) |
| `fabric-detail` | detail hero, story, specs ("Details" list), ratings, care, related products | toggles per block | — | Tekla care detail |
| `main-blog` / `main-article` | journal | blog: filter links by tag, 3-up 16:10 cards, "Showing X of Y" + progress + "Show more". Article: centred title, 612 body, sections allowed via `article.json` | — | Tekla stories / story |

Snippets: `accordion` (button + panel, `aria-expanded`/`aria-controls`, + icon, optional height transition while respecting `prefers-reduced-motion`), `fabric-rating` (1–5 bars; warmth renders as a cool↔warm scale), `care-icons` (maps `care_symbols` keys to `icon.liquid`), `fabric-card`, `article-card`, `breadcrumbs`.

### Page assembly map

| Page (template) | Sections in order |
|---|---|
| `page.about.json` | editorial-hero (centred, no image) → editorial-text → editorial-gallery (4-up category links) |
| `page.our-story.json` | editorial-hero (image) → editorial-text → editorial-timeline → editorial-image-text → editorial-quote |
| `page.our-materials.json` | editorial-hero → editorial-text → fabric-guide (cards) → editorial-image-text |
| `page.quality.json` / `page.craftsmanship.json` / `page.manufacturing.json` | editorial-hero (5:4 image, ESG model) → editorial-text ×n → editorial-image-text (process steps) → editorial-gallery |
| `page.fabric-guide.json` | editorial-hero (breadcrumb) → fabric-guide → fabric-compare → editorial-text (how to choose) → faq |
| `metaobject/fabric.json` | main-metaobject-fabric (= fabric-detail: hero 4:5, story, Details specs, ratings, care) → guide-card-grid / related products |
| `page.care-guide.json` | editorial-hero → guide-card-grid (2-up: by product type / by fabric) → editorial-text |
| `page.care-<type>.json` or a single `page.care.json` with a section setting | editorial-hero (breadcrumb) → care-guide (topic cards) → editorial-text (longevity) → guide-card-grid (more care) |
| `page.size-guide.json` | editorial-hero → guide-size-table (category list → tables, one anchor per category) |
| `page.mattress-measuring.json` | editorial-hero → editorial-image-text (steps with diagrams) → guide-size-table |
| `page.faq.json` | editorial-hero → guide-anchor-nav (groups) → faq |
| `page.shipping.json` / `page.returns.json` | editorial-hero → editorial-text → faq |
| `page.contact.json` | editorial-hero → info-columns → contact-form |
| `blog.json` / `article.json` | main-blog / main-article (+ optional editorial-gallery, product rail) |

---

## 5. States captured and not captured

| State | Status |
|---|---|
| Cookie banner | dismissed with "Only necessary" on every Tekla load. The banner itself was not screenshotted (it is proprietary chrome and not needed) |
| Sticky header (scrolled / scrolled-up) | captured at 1440 and 390 on all Tekla pages. It is hidden after scrolling down and shown again after scrolling up 200px |
| Accordion closed / opening / open | captured: `tekla/shipping-and-returns/states/{1440,390}-accordion-*` |
| Size-guide row hover / panel open | captured: `tekla/size-guide/states/*` |
| Link default / hover | captured: breadcrumbs on care pages |
| Card default / hover | captured, with no visible difference |
| Story filter: active "Projects" | **not captured**. The probe clicked the "Projects" category label inside a card and navigated to an article. The active-filter style was measured from "All stories" instead (1px black border-bottom) |
| Story "Show more" loaded | **not captured**. The probe ran after the failed filter click had navigated away to an article. "Show more" is a `<button>` (h-11 = 44px, px-4, 1px border `grayscale-600`, colour transition). The default state is visible in the full screenshots |
| Care-guide video | **not capturable**: blank in headless Chromium (H.264) |
| Article product carousel "next" | screenshot taken (`story-guide-to-down/states/*-carousel-next.png`). The icon button was picked heuristically, so verify it visually before relying on it |
| Scroll-reveal | none exists on Tekla (0 hidden elements before scroll on every page) |
| Anchor nav / tabs | none exist on Tekla editorial pages (except the size-guide panel tab) |
