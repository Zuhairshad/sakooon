# Commerce reference: Parachute (collection, product, cart, search)

Investigation by the commerce session, 2026-11-26, Playwright Chromium (headless, deviceScaleFactor 1).
Captures: `/Users/shad/sakooon-qa/references/parachute/{collection,product,search,cart}/` (not in git). Scripts: `scripts/ref/commerce-*.mjs` (`commerce-run-all.sh` runs everything serially).

Only layout, proportions, behaviour and timing are recorded here. Fonts are named only so we can substitute them. No code, copy, imagery or assets are reused.

## Status and gaps

- **Rate limiting.** parachutehome.com returned HTTP 429 from about 06:18 UTC after parallel runs (several sessions share this Mac's IP). Scripts now run one browser at a time, wait 20 s between page loads and back off 90 s on a 429. Nothing is bypassed.
- **Measured so far:** collection at 1920 and 1440; product, search results and search overlay at 1920, plus structure and geometry at 1440 from probes; filter drawer at 1440.
- **Pending:** the remaining viewports (1280/1024/768/390/375) and the scripted state screenshots (card hover, swatch hover/selected, size selected, sold-out, gallery next/zoom, detail drawer, sticky bar, cart drawer with 1 and 2 items, quantity change, cart page, search states, mobile filter drawer). `commerce-run-all.sh` is still running. A follow-up commit will add those tables. Responsive behaviour below 1440 is inferred from the stylesheet grid tokens and will be checked against those captures.
- **Popups:** none appeared in the first 8 s at 1440 on the collection or product page. Always present: Gorgias chat launcher iframe (bottom right), a Shop Pay "hop" iframe, and the Rebuy cart flyout, which stays in the DOM off-canvas.
- **Third-party widgets:** cart drawer = **Rebuy Smart Cart**, search overlay = **Rebuy Smart Search**, recommendations = Rebuy. We rebuild these natively (Shopify AJAX Cart, Predictive Search, Product Recommendations). Only their geometry and behaviour are the reference.

## Global tokens observed

| Token | Value |
|---|---|
| Sans (UI/body) | "Suisse Intl" → substitute |
| Serif (display, product titles, card titles) | "Canela" (light 300 for display) → substitute |
| Text colour | rgb(53,51,49) |
| Muted text | rgb(105,102,99) |
| Accent (sale price, sale tag, ATC) | rgb(91,40,49) (deep wine) |
| Neutral fill (option controls, pairing card, image bg) | rgb(241,238,233) |
| Divider | 1px rgba(53,51,49,.25) |
| Radius | 4px controls/buttons, 2px tags/arrows |
| Page grid | 12 columns, 8px column gap, 20px outer padding (≥1024) |
| Default UI transition | `0.3s linear` (links, buttons, swatches), drawers `transform .2s` |
| Announcement bar 37px + header 56px | header overlays the product gallery (transparent on the PDP) |

## 1. Collection (`/collections/sheet-sets`)

### Layout per viewport

| Metric | 1920 | 1440 |
|---|---|---|
| Collection header height | 679 (20 top / 40 bottom padding) | 519 |
| Header grid | 12 col × 149.3px, gap 8 / row-gap 24 | 12 col × 109.3px |
| Header image | 464×619, 3:4, spans 3 cols, bg #F1EEE9 | 344×459 |
| Title | Canela 80/68px, weight 300, at col 4 | same |
| Item count | Sans 10/14px superscript next to the title | same |
| Description | Sans 18/25.2px, muted, width ≈ 4 cols (597 / 437px), bottom-aligned with the image | same |
| Parent link "← Sheets" | Sans 14/19.6px, bottom right, gap 4 | same |
| Divider above the filter bar | 1px, inset 20px | same |
| Filter bar | 43.6px tall, padding 12/16, "Filter / Sort" text button 14px | same |
| Grid | 4 columns, column gap 8, row gap 32, side padding 16 | 4 × 346px |
| Card | 466 wide, 710 tall | 346 × 551 |
| Card media | 3:4, object-fit cover, white bg | 346×461 |
| Hover image | second image, absolutely positioned, `opacity .2s` | same |
| Sale tag | top-left inset 4px, Sans 10/14 uppercase, white on wine, padding 2/4/1/4, radius 2 | same |
| Info block | 12px below media, flex column, gap 12 | 77px tall |
| Card title | Canela 16/17.6px, weight 400 | same |
| Price | Sans 14/19.6, wine when on sale; compare `<s>` muted, 8–9px gap; ranges "$183.20 – $239.20" | same |
| Swatches | 20×20 hit area, 16px circle chip, gap 2px, first 3 + "+18" (14px muted) | same |
| Products per page | 36 (48 in the collection), pagination block below the grid with 70px top margin | same |
| Editorial tiles in the grid | none in this collection | – |

### Interaction log

| Trigger | Behaviour | Timing |
|---|---|---|
| Hover card media (pointer) | second image fades in over the first (opacity 0 → 1, measured) | `opacity 0.2s` |
| Hover swatch | swatches are links to **sibling products** (one product per colour). Hovering does **not** swap the card image or link (measured). Each chip has a 1px rgba(53,51,49,.25) hairline (`::after`). The selected sibling is listed first among the 3 | 0.3s linear |
| Click "Filter / Sort" | `<dialog>` drawer slides in from the **left**, 600px wide at 1440, full height, `::backdrop` rgb(53,51,49) (dimmed), 28px close × at top right (x 548, y 24). Form starts 60px down, padding 0/16/16, gap 32 between groups | settles in 190 ms (measured); `transform 0.2s`, `display/overlay 0.2s allow-discrete` |
| Drawer content | Sort as a 2-column radio grid (Featured, Price descending, Most recent, Price ascending); facet groups Color (with a strip of mini colour chips per family: Blues, Browns, Greens, Greys, Neutrals, Patterns, Reds), Material (Cotton/Linen/Tencel), Product Type, Size (Twin…Cal King), each a 2-column checkbox grid with counts; group heading 16px with a 1px divider below | – |
| Apply / Reset | pair at the bottom, 279×45.6 each (Reset outlined, Apply filled dark). Checking boxes does nothing until Apply (URL unchanged, measured). Apply submits a GET form → full reload, e.g. `?sort_by=price-ascending&filter.p.m.facets.material=Linen` (14 results, about 3.1 s). Afterwards the bar reads "Filter / Sort (1)"; there are no active-filter pills | full page load |
| Facet sources | `sort_by` radios = `collection.sort_options` (manual, price-descending, created-descending, price-ascending). Colour = **product metafield `facets.color` referencing colour-family metaobjects** (Search & Discovery metafield filter). Material = `facets.material` (text) | – |
| Pagination | Dawn-style numbered `nav.pagination` (1, 2, next), `?page=2`. There is also a skeleton `<template>` grid, which suggests JS swaps pages in | – |

## 2. Product (`/products/percale-sheet-set-evergreen-f-q`)

### Layout

| Metric | 1920 | 1440 |
|---|---|---|
| Split | 50/50: gallery 960 / info column 960 | 720 / 720 |
| Gallery | carousel (one slide visible), slide 3:4 (960×1280), full bleed, starts under the transparent header (y=37) | 720×960 |
| Gallery controls | bottom right: ‹ 1/4 › (32px square arrows, radius 2, 12px count), shade gradient 64px at the bottom | same |
| Packshot | 168×224 thumbnail of the product's packshot, bottom-left inset 20px, sale tag on it; links to that slide | same |
| Info column | padding-left 80 / right 104; container sticky `top: 32px` | |
| Buy box | 460px fixed width, centred in the column, padding-top 160px, gap 16 | 460, x=838 |
| Sale tag | as on cards | |
| Title | Canela 28/33.6, weight 300; star rating right-aligned on the same row (70px) | |
| Colour swatches | 48×36 hit areas, 20px chips, gap 2, wrapping rows (21 colours → 3 rows), selected = ring; new/limited ones carry a dot badge; label below: "Evergreen" + "NEW" note | |
| Option controls (Size, Style) | **native `<select>`** styled as a 44px row, bg #F1EEE9, radius 4, label left (14px), value + chevron right, padding 12/32/12/16, hover fill transition 0.2s | |
| Add to bag | 460×44, wine bg, radius 4, padding 11/19, label left, **price inside the button on the right** (sale + struck compare) | |
| Low-stock note | "ONLY A FEW ITEMS IN STOCK", 10/14 uppercase, right-aligned under the button | |
| What's included | inline uppercase 10px list (1X FITTED SHEET · 1X TOP SHEET · 1X PILLOWCASE SET), 64px below | |
| Detail rows | 3 rows × 64px (title 14px + subtitle 14px muted, chevron →), 1px dividers; each opens a **right-hand drawer** | `0.3s linear` hover |
| Pairing card | "Pairs well with" heading + 460×92 card (63×84 3:4 image, title, price, arrow), bg #F1EEE9, radius 4 | |
| Below the fold | story section (12-col grid, text 4 cols + small image, large 936×702 image right, 160px vertical padding) → Rebuy carousel "You may also like" (Canela 20px heading) → full-width banner 600px → tabbed columns → a second Rebuy carousel | |

### Interaction log (from probes; scripted states pending)

| Trigger | Behaviour |
|---|---|
| Swatch click | navigates to the sibling product URL (full page load) |
| Size/Style select | native select. Changing it updates `?variant=`, button price and low-stock note in place (to be confirmed with timings in the states run) |
| Gallery arrows / swipe | horizontal track of `li` slides (`transition: transform`), count updates "n/4" |
| Detail row click | opens a `<dialog>` drawer (same `cv-drawer` component as filters), content in accordions |
| Sticky buy bar | none seen at 1440 at first glance; the info column is `position: sticky; top: 32px`. To be confirmed in the states run (mobile in particular) |

## 3. Cart drawer (Rebuy Smart Cart)

- Off-canvas right flyout, **500×880 at 1440** (full height, z-index max), always in the DOM.
- Opens automatically after Add to bag. Header cart icon is `<a href="/cart">` (works without JS).
- 1/2 items, quantity change, loading and empty states are pending the states run.

## 4. Search

| Metric | 1440 overlay | 1920 results page |
|---|---|---|
| Trigger | header `<a href="/search" data-search-trigger>` | – |
| Overlay | top sheet below the announcement bar, full width, 750px tall, white; input row 44px, pill-shaped field (#EEEDE9 fill, radius ≈ 22px), magnifier left, × close right; focus goes to the input on open | – |
| Typed state | heading "Matching Products" (Canela ~20px), 4-column grid of 338×338 square packshots, title Sans 16px, price serif 13px wine; results update as you type | – |
| Results page | – | centred 1100px container (x=410), input 1022px uppercase 16px, Canela 20/24 headings, prices 13px/600, pagination 30px top margin |

## 5. Mobile filter drawer

Same left `<dialog>`; at ≤ 768 it is expected to be full width. Pending the 390/768 captures.

## Proposed Shopify structure

Names below are proposals; final file names follow `docs/file-ownership.md` / `docs/component-contracts.md` once CONTRACTS READY lands.

### Product model decision (needs lead sign-off)

Parachute models **each colour as a separate product** (`percale-sheet-set-evergreen-f-q`, `…-white-f-q`) and links them with sibling swatches (`<a href="/products/<sibling>">`); size/style are the only real variant options (native `<select>`). For Sakooon we recommend **colour as a real variant option on one product** (Colour × Size), because:

- variant media (`variant.featured_media` + media alt-text grouping) gives per-colour galleries without page loads;
- native filtering on `filter.v.option.colour` works with no extra metafields;
- one review/metafield set per fabric instead of per colour.

The card swatches then come from `product.options_with_values` (colour option) with `swatch.color` / `swatch.image` from Shopify's native option swatches (falling back to a `sakooon.swatch_hex` metaobject lookup). If the merchant prefers Parachute-style sibling products later, the swatch snippet should accept a `product.metafields.sakooon.siblings` (list.product_reference) source behind a setting. Both paths render the same markup.

### Collection template — `templates/collection.json`

| Order | Section | Blocks / settings | Notes |
|---|---|---|---|
| 1 | `main-collection-header` | settings: show image (collection.image or `collection.metafields.sakooon.header_image`), show count, show parent link (`collection.metafields.sakooon.parent` collection_reference), description | 12-col grid: image spans 3 cols (3:4), title+description in cols 4–7, parent link bottom right. Mobile: stacked. |
| 2 | `main-collection-grid` | settings: products per page (24/36/48), columns desktop 4 / tablet 3 / mobile 2, show hover image, show swatches, max swatches (3) ; blocks: `editorial_tile` (image, heading, link, position index, span 1–2) | Contains the filter bar + `<facet-drawer>` form, `<ul id="product-grid">`, pagination, empty state. Re-rendered via section rendering on filter apply. |
| 3 | `editorial-banner` (owned by shad-8b, reused) | | Optional below grid. |

Facets use native `collection.filters` (`filter.v.option.*`, `filter.p.product_type`, `filter.p.m.sakooon.material`, `filter.v.price`), `collection.sort_options` and `collection.sort_by`. Colour filter groups ("Blues", "Greens") are a product metafield referencing a `colour_family` metaobject, exposed as a Search & Discovery filter (Parachute does exactly this with `facets.color`). Each value shows a strip of swatches from the family's members. Unlike Parachute, we update via section rendering on Apply (no full reload), and on desktop optionally live on change behind a setting.

### Product card — `snippets/product-card.liquid`

Params: `product`, `index` (for eager loading of first 4), `show_hover_image`, `show_swatches`, `max_swatches`, `sizes`.
Renders: media (3:4, `object-fit: cover`, first image eager when `index < 4`, `product.media[1]` as hover image with `opacity .2s`), tag (`product.metafields.sakooon.badge` or "NN% OFF" computed from `compare_at_price_max`), title (link), price (`price_min`–`price_max` range, sale colour + `<s>` compare range), swatches (first 3 + "+N"), sold-out label when `product.available == false`.

### Product template — `templates/product.json`

| Order | Section | Blocks |
|---|---|---|
| 1 | `main-product` | **Gallery** (setting: layout carousel/stack); buy box blocks: `badge`, `title_rating`, `colour_swatches`, `variant_picker` (setting: style select/pills per option), `buy_buttons` (price in button), `low_stock_note` (threshold setting, reads `variant.inventory_quantity` only if `inventory_management` set), `whats_included` (reads `sakooon.whats_included`), `detail_drawers` (one `detail_drawer` block each: title, subtitle, source metafield), `pairing_card` (`sakooon.pairs_with` product_reference), `sticky_bar` (enable) |
| 2 | `product-story` | image large + small + rich text from `sakooon.story` (rich_text) |
| 3 | `product-recommendations` | intent `related` (heading "You may also like") |
| 4 | `complete-the-bed` | `sakooon.complete_the_bed` list.product_reference, falls back to `recommendations` intent `complementary` |
| 5 | `editorial-banner` / tabs (shad-8b) | |

#### Detail drawers / accordions → metafields

All namespace `sakooon` (final namespace per `docs/metafield-contracts.md`):

| Drawer / accordion | Metafield | Type |
|---|---|---|
| Size guide | `sakooon.size_guide` | metaobject_reference (`size_guide`: table rows: size, flat, fitted, pillowcase, depth) or page_reference |
| Dimensions | `sakooon.dimensions` | rich_text (per product) + optional variant-level `sakooon.dimensions` (single_line) shown for the selected size |
| Composition / fabric | `sakooon.composition` | rich_text (e.g. weave, thread count, certifications) |
| Feel | `sakooon.feel` | single_line_text (short) + `sakooon.feel_scale` number_integer 1–5 (crisp→silky) |
| Specs | `sakooon.specs` | list.single_line_text ("Pocket depth: 16\"") |
| What's included | `sakooon.whats_included` | list.single_line_text (renders the uppercase chips under the ATC and the list in Details) |
| Care | `sakooon.care` | rich_text |
| Shipping + returns | shop-level `shop.metafields.sakooon.shipping_returns` rich_text, product override `sakooon.shipping_returns` |
| Subtitle under each row | block setting `subtitle` | text |

Parachute groups these into three right-side drawers (Size Guide / Details + Care / Shipping + Returns), with accordions *inside* the Details drawer. We should do the same: the `detail_drawer` block opens a `<dialog>` drawer from the right; inside, each metafield is a `<details>` accordion.

### Cart drawer + cart page

`sections/cart-drawer.liquid` (rendered in `layout/theme.liquid` as a section group or static section so it can be re-rendered by id) and `templates/cart.json` → `main-cart`. Shared `snippets/cart-line-item.liquid` for both. Blocks for the drawer: free-shipping progress (threshold setting, uses `cart.total_price`), line items, complementary products (`recommendations` intent `complementary` of the last-added product, via section rendering of `cart-recommendations`), note, subtotal + checkout.

### Search

`sections/predictive-search.liquid` (rendered via `/search/suggest?section_id=predictive-search`), `snippets/search-drawer.liquid` (top drawer, full width), `templates/search.json` → `main-search` (input + count + product grid reusing `product-card` + pagination + no-results state, also native filters via `search.filters`).

### Open/close event contract (proposal, aligned to whatever the base contract is)

- Openers dispatch `document.dispatchEvent(new CustomEvent('sakooon:drawer:open', { detail: { id: 'cart' | 'search' | 'filters' } }))`; header buttons (shad-2d) are `<a href="/cart">` / `<a href="/search">` with `data-drawer-open="cart|search"` so they work without JS.
- Drawers emit `sakooon:drawer:opened` / `sakooon:drawer:closed` with `{ id }`.
- Cart emits `sakooon:cart:updated` with `{ cart, source }` after every successful mutation; header count listens to it (or is re-rendered via the `sections` param of the same AJAX call).
- Implementation: native `<dialog>` + `showModal()` (focus trap, Esc, `::backdrop`), `transform` transition 200–300 ms with `@starting-style`, `inert` fallback not needed.

## Shopify AJAX calls

| Call | Where | Purpose |
|---|---|---|
| `POST /cart/add.js` (FormData from the product form, + `sections=cart-drawer,cart-icon-bubble&sections_url=<current path>`) | `assets/product.js` (buy buttons, sticky bar, pairing card quick add, complete-the-bed) | Add variant; response carries re-rendered drawer + header count HTML, so no second request. |
| `POST /cart/change.js` (`{ line, quantity, sections, sections_url }`) | `assets/cart.js` (drawer + cart page quantity +/−, remove = quantity 0) | Line-level update by index (`line`), handles duplicate variants with different properties. |
| `POST /cart/update.js` (`{ note }` / `{ updates: {…} }`, + `sections`) | `assets/cart.js` | Cart note; bulk update on the cart page without JS fallback form. |
| `GET /cart.js` | `assets/cart.js` | Only for resync after errors / `pageshow` from bfcache. |
| `GET /search/suggest?q=…&resources[type]=product,collection,query,article,page&resources[limit]=…&section_id=predictive-search` | `assets/search.js` | Predictive search HTML; abort previous request with `AbortController`, 250 ms debounce. |
| `GET /recommendations/products?product_id=…&intent=complementary&section_id=cart-recommendations` and `intent=related&section_id=product-recommendations` | `assets/cart.js`, `assets/product.js` | Cart drawer suggestions, related/complete-the-bed fallbacks. |
| Section Rendering API `GET <collection url>?<filter params>&section_id=main-collection-grid` | `assets/facets.js` | Apply filters/sort/pagination without full reload; `history.pushState` to the same URL. |
| Section Rendering API `GET /products/<handle>?variant=<id>&section_id=main-product` (or `option_values=` for combined listings) | `assets/product.js` | Variant change: swap price, availability, buy button state, low-stock note, media order. |
| `GET /search?q=…&section_id=main-search` | `assets/facets.js` | Filtering/sorting on the search results page. |
