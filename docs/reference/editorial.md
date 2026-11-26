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

**In progress.** parachutehome.com returns HTTP 429 to this machine's shared IP. Captures run serially, with 20s or more between loads and a 90s back-off on 429. This section is added in a follow-up commit once the run completes. Pages queued: fabrics, care, faq, returns, our-story, blog, contact, our-fabrics-detail (last).

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
