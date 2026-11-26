# Storefront reference investigation (Phase 1)

Owner: storefront session (branch `sakooon/storefront`). Scope: header, announcement bar, mega menu, mobile nav, sticky header, footer, homepage sections.

References: **Parachute** (primary, `parachutehome.com`) and **Tekla** (secondary, `teklafabrics.com`). This document records layout, proportions, spacing and behaviour as **patterns**. Nothing here is their copy, imagery, logos, code or fonts; font names are recorded only so we can choose licensed or system substitutes.

## Method

- Playwright Chromium, `deviceScaleFactor: 1`, viewports 1920/1440/1280/1024 × 900 and 768 × 900, 390/375 × 844 (mobile UA + touch below 768).
- Scripts: `scripts/ref/storefront-*.mjs` (`measure`, `states`, `tekla-l2`, `sticky`, `breakpoints`, `inspect`, `dom`, `slice`). Shared helpers in `storefront-lib.mjs`: popup dismissal, a 20s minimum gap between page loads per host shared across processes, a 90s back-off on HTTP 429, and a refusal to keep any capture that is a bot-protection interstitial or whose document height equals the viewport.
- Output (not in git): `/Users/shad/sakooon-qa/references/<site>/home/` holds `<vw>-full.png`, `<vw>-fold.png`, `measure.json` (all computed values below), `states/*.png`, `states.json`, `breakpoints.json`, `sticky-*.json`.
- Values come from `getComputedStyle` and `getBoundingClientRect`. "Inset" = distance from the section edge to the first or last visible content.

### Popups dismissed before capture

| Site | What | How |
|---|---|---|
| Parachute | Alia promotional email popup (delayed ~5–8s, modal) | its "Close popup" button |
| Parachute | Rebuy cart flyout (off-canvas, not opened) | left alone |
| Tekla | Cookie consent card (bottom-right, dims page) | "Only necessary" |
| Tekla | Klaviyo-style "Subscribe for 10% off" modal (delayed, mobile and desktop) | its "Close dialog" button |
| Tekla | Rotating announcement bar | left visible (it is part of the layout) |

Tekla geolocates to DKK/Denmark (`Ship to Denmark (DKK)`, `1.000 DKK` copy). That has no effect on layout.

### Could not capture (record)

| Site | State | Reason |
|---|---|---|
| Parachute | 768/390/375 on the first run | Cloudflare "Just a moment…" interstitial. Captures discarded, not bypassed. 768 and 390 were recaptured later. |
| Parachute | 375 full page | Chromium screenshot protocol error on the recapture; 375 measurements are pending a retry (390 is representative). |
| Parachute | All interaction states (mega menu per item, sticky sequence, mobile drawer + nested level, card hovers) and the breakpoint sweep | HTTP 429 to the shared IP (three attempts with 90s back-off). The mega menu **structure** below comes from the DOM captured on the first successful load (panels are present but hidden). Pixel measurements of open panels are **PENDING**; the scripts are ready (`node scripts/ref/storefront-states.mjs parachute`, `… storefront-breakpoints.mjs parachute`). |
| Parachute | 390 full-page PNG | The Alia mobile popup and the Rebuy cart flyout are painted over the top of the full-page image. The measurements in `measure.json` are unaffected; use `390-fold.png` or the JSON. |
| Parachute | Category-grid images 2–4 and the hero video frame in full-page PNGs | Lazy and video content is not painted in the stitched full-page image. Use `*-fold.png` for the hero. |

## Typography (both sites)

| | Parachute | Tekla |
|---|---|---|
| Sans (UI/body) | "Suisse Intl" 400/500/700 | "unica77" 300/400 |
| Display serif | "Canela" 300/400 | none (single sans family, weight 300 throughout) |
| Substitute proposal | Sans: Inter or system-ui (licensed). Serif: a licensed light display serif (for example Cormorant/Fraunces at 300) | Inter 300 or system-ui |

### Parachute type scale (computed)

| Role | 1920–1024 | 768 | 390/375 | Notes |
|---|---|---|---|---|
| Lifestyle display h1 | 80/68px, serif 300 | 48/40.8 | 48/40.8 | lh 0.85, tight |
| Campaign tile h2 | 42/46.2, serif 400 | 42 | 42 | lh 1.1 |
| Promo band h2 | 32/35.2, serif 400 | 24/26.4 | 24/26.4 | |
| Section title h2 | 28/30.8–33.6, serif 300 | 28 | 24–28 | product rails and editorial |
| Footer newsletter title | 24/28.8, serif 300 (20/24 at ≤1280) | 20 | 20 | |
| Product card title h3 | 16/17.6, serif 400 | 16 | 16 | |
| Body / lead | 16–18/1.3, sans 300–400 | 15–16 | 15–16 | |
| UI (nav, buttons, tabs, price) | 14/19.6–25.2, sans 400 | 14 | 14 | letter-spacing normal, no uppercase except a few text links |
| Legal / disclaimer | 12/16.8 sans | 12 | 12 | |

### Tekla type scale

All text 14px / 21px weight 300 (nav, captions, footer links, announcement). Footer column titles and the newsletter title are 18px/300. Mobile drawer items are 16/24 300. There is no display type on the homepage: the imagery is the hierarchy. Colours: text `#181818`, secondary `#5c5c5c`, muted `#9e9e9d`, page `#f6f6f6`, rules `#e3e3e3`.

## Buttons and links

| | Parachute | Tekla |
|---|---|---|
| Primary (solid) | 48px high, padding 0 24px, radius 4px, brand fill (deep wine), white 14/400 text, 1px border | none on homepage (text links only) |
| On-image button | 40–44px high, padding 0 32px (or 12px 20px), radius 2–4px, light warm fill `#f1eee9`, dark text 14/400 | – |
| Tab pills (rail filters) | 14/400 text-only buttons; the active tab has a 1px underline bar running under the whole tab row | – |
| Text link on image | 16px uppercase, `text-decoration: underline`, transition 0.3s linear | 14/300, no underline; colour shifts `#5c5c5c` → `#181818` on hover/active |
| Hover transitions | Header background/colour 0.2s; links 0.3s linear | 0.25s `cubic-bezier(.4,0,.2,1)` (header), mega panel `transform .3s` same curve, mobile menu `opacity/visibility .2s`, backdrop `opacity .3s` |

## Header and announcement

### Parachute

| Viewport | Announcement | Header bar | Header total | Logo (w×h, position) | Nav | Utilities |
|---|---|---|---|---|---|---|
| 1920 | 37px, 14/400, links underlined | 56px, padding 0 20px | 56 | 140×12, right group (x=1596) | 8 items left-aligned at x=20, 14/400, 24px gap, no padding | 4 icons 24×24, 12px gap: search, store, account, cart |
| 1440 | 37 | 56 | 56 | 140×12 (x=1116) | same | same |
| 1280 | 37 | 56 | 56 | 140×12 | same | same |
| 1024 | 37 | 56 | 56 | 140×12 | same (still desktop nav) | same |
| 768 | 37 | 56 bar + 54 sub-nav row | 110 | 140×12, left at x=16 | hamburger | search, cart, menu (24×24) |
| 390 | 58 (wraps to 2 lines) | 56 + 54 | 110 | 140×12 left x=16 | hamburger | search, cart, menu |

- Layout: **nav left, logo and utilities grouped right** (desktop). On mobile: logo left, icons right, and below that a **horizontally scrolling sub-nav row** of the top-level links (sale items in an accent colour).
- Header is `position: sticky; top: 0; z-index: 100`. On the homepage it is **transparent over the hero** (white text and logo) and turns solid (light background, dark text) on scroll and when a mega menu opens. Transition: `background-color .2s, color .2s`. The full scroll sequence is PENDING (429).
- The announcement bar is a solid brand-colour band with a single centred or left message link; it scrolls away (it is not sticky).

### Tekla

| Viewport | Announcement | Header | Logo | Nav | Utilities |
|---|---|---|---|---|---|
| 1920–1024 | 40px, `#e3e3e3`, 14/300, 4 rotating messages (fade), close × at right (16px) | 52px, `#f6f6f6`, padding 0 16px | 92×20, left x=16 | 4 items after the logo (x=120), 14/300 `#5c5c5c`, padding 0 8px; the active/hover item turns `#181818` | 4 icons ~14×17 with ~32px gaps (search, wishlist, account, cart) |
| 768–375 | 40px | 52px, padding 0 4px 0 16px | 84×18 (<768), 92×20 at 768 | hidden | search, cart, menu as 40×48 hit areas |

- Sticky with **hide on scroll down, reveal on scroll up**. The outer element is `sticky; top: 0`. The inner bar gets `translateY(-100%)` once scrollY exceeds about the header height, and `none` on any upward scroll. 0.25s `cubic-bezier(.4,0,.2,1)`. No shadow or border change.
- Desktop nav breakpoint: 1024 (≥1024 shows inline nav; below, hamburger).

## Mega menu (desktop)

See `storefront-nav.md` for the full structure. Summary:

| | Parachute | Tekla |
|---|---|---|
| Trigger | hover (and focus) on a top-level link; the link is also a real URL | hover on a top-level link (also a real URL) |
| Panel | full width below the header, columns of link groups + 1–3 promo image cards | full width below the header, height ≈ 490px at 1440, `transform .3s cubic-bezier(.4,0,.2,1)`; page behind gets a blurred translucent overlay (`backdrop-filter: blur(12.5px)`) |
| Columns | 1–5 link columns + 1–3 promo cells per item | Level 1: 1/4 left list + 3/4 promo row (3 cards, 4:5). Level 2 (hover a left item): a 6-column grid, 240px each at 1440: list, "Category" group, "Collection" group, then 2 promo cards spanning 3 columns. 1px `#e3e3e3` column rules, 16px padding |
| Open timing | PENDING (429) | panel present ~60–75ms after hover (first frame); no visible delay |

## Mobile navigation drawer

| | Parachute (structure from DOM) | Tekla (measured) |
|---|---|---|
| Container | `#cv-mobile-drawer` off-canvas drawer + backdrop | full-width sheet under the header (`top: 52px`, height `100dvh − 52px`), bg `#f6f6f6`, 1px top rule, fade `.2s` |
| Top | "Close" and "Back to menu" buttons (icon + label), utilities: currency selector, store locator, account | the header stays visible; the hamburger turns into × |
| Level 1 | list of top-level sections, each a row with a right arrow | tab row (Shop / Gift Shop / About / New), then the list of categories 16/24 300, 48px rows, then 3 promo cards (4:5), then Sign in / Online support / Ship-to selector |
| Level 2 | slides in from the right, "Back to menu" | "← Back" row, a "Discover <category>" row, then **group label (muted 16px)** + links (16/24, 45px pitch) for "Category" and "Collection", then promo cards 224px wide (4:5) in a horizontal row; groups separated by 1px rules |

## Footer

### Parachute

| Viewport | Height | Structure |
|---|---|---|
| 1920 | 845 | Background a warm off-white. Padding 20px. **Left**: newsletter (serif 24/300 title, 16px subtitle, a dark full-width input bar ~344px wide with an arrow submit, 12px disclaimer) and an image card underneath (~344 square-ish). **Right**: link columns on a CSS subgrid, 3 columns per row with 8px gaps (Shop / Inspiration / Help, then Company / Social on a second row); column titles 14px medium, links 14px, ~22px pitch. Currency selector top-right. **Bottom row**: wordmark centred, legal links and © right (14px, muted `#696663`). |
| 1440 | 725 | same, columns 227px wide |
| 1280 | 661 | newsletter title 20/24 |
| 1024 | 612 | columns 155px |
| 768 | 827 | newsletter full width, then link columns 2-up |
| 390 | 1363 | everything stacked; link columns 2-up (175px), currency and legal at the bottom |

### Tekla

| Viewport | Height | Structure |
|---|---|---|
| ≥1024 | 383 (404 at 1024) | White background, 1px top rule. One row: **newsletter column 1/3** (18/300 title, 14/300 copy, outlined input 344×44), then **four link columns of 1/6 each** with 1px vertical rules (Online support / About us / Connect / Legal), titles 14/300 muted, links 14/300 with 21px pitch. Bottom bar 72px with a top rule: © left (muted). Padding 16px; text starts 41px below the top rule. |
| 768 | 646 | newsletter column 340px max, link columns wrap |
| 390/375 | 1299 | fully stacked; each link group separated by a 1px rule, title muted |

## Homepage section inventory

### Parachute (desktop order; 1440 values, with others where they change)

| # | Type | Height 1920 / 1440 / 1280 / 1024 / 768 / 390 | Structure | Maps to (our section) |
|---|---|---|---|---|
| 0 | **Full-bleed video hero** | 810 / 810 / 810 / 810 / 810 / 754 | Video or image `object-fit: cover`, height = `100svh − 90px` (810 at 900 tall, 754 at 844). Transparent header overlays it. Centred CTA button near the bottom (≈32px from the bottom edge) and campaign type baked into the media. | `hero` (full width) |
| 1 | **Promo message band** | 139 / 139 / 139 / 139 / 157 / 215 | Solid brand colour. Content max-width 800px, centred. Desktop: two columns (serif h2 32px left, 16/300 text right). Mobile: stacked. Inset 48 top / 56 bottom. | `promo-band` (rich text band) / `service-info` variant |
| 2 | **Product rail** (sale collection) | 860 / 860 / 860 / 860 / 860 / 814 | Title (serif 28/300) + text-link tab under it, prev/next arrows top-right. Cards **fixed 256px wide**, 16px gap, image 256×341 (3:4), horizontal scroll (`overflow-x: auto`), 48px left gutter. 6.9 / 5.1 / 4.6 / 3.6 / 2.7 cards visible; mobile 195px cards, 1.9 visible, 8px gutter. "View all" solid button below. Inset 64 top / 88 bottom. | `featured-collection` (carousel layout) |
| 3 | **Split campaign tiles** | 1352 / 1039 / 935 / 768 / 601 / 1068 | Two tiles, 8px gap, 24px gutters, image ratio ≈ 0.76 (3:4). Overlay copy bottom-left: serif h2 42/400 + light on-image button. Mobile: stacked, 16px gutters. Inset 64/64. | `split-hero` / `campaign-tiles` |
| 4 | **Product rail with tabs** | 860 … | As #2 plus filter tabs (All / Bedding / Bath / Decor) that switch the rail's collection. | `bestsellers` (tabbed featured collection) |
| 5 | **Lifestyle feature** | 2517 / 1877 / 1664 / 1323 / 981 / 693 | Near-full-bleed image (16px inset) at about 3:4 on desktop, display h1 80/300 top-left with a light button, plus a small **shoppable hotspot** card (168×224 product thumbnail with a badge). Mobile: full-bleed, h1 48px. | `lifestyle-story` (image + hotspot blocks) |
| 6 | **Campaign banner** | 1142 / 885 / 799 / 662 / 524 / 329 | Image 24px inset, ratio ≈ 1.84 desktop (1.78 mobile, 16px inset). Overlay bottom-left: serif h2 28/300 + uppercase underlined text link. Inset 64/64. | `campaign-image` |
| 7 | **Product rail with tabs** | 860 … | Repeat of #4 (different collection). | `bestsellers` / `new-arrivals` |
| 8 | **Shop by category** | 768 / 605 / 550 / 455 / hidden / hidden | 4 equal tiles, 8px gap, 24px gutters, image ratio ≈ 0.72; label as a light chip button bottom-left. Only the first image showed in the capture (the others are lazy or revealed on hover); confirming is PENDING. **Hidden below 768.** | `shop-by-category` |
| 9 | **Shade / fabric discovery** | 1057 / 1057 / 874 / 874 / 914 / 854 | Wide inset (120px gutters desktop, 16 mobile). Header row: serif h2 28/300 + 18px lead on the left, **swatch grid** (2 rows × 7 squares, ~24px) on the right. "Discover by shade: <name>" + arrows. Rail of tall images, 343×610 (9:16), 8px gap (240px wide at ≤1280). Inset 160 top / 105 bottom (80/104 mobile). | `fabric-discovery` |
| F | Footer | see above | | `footer` |

### Tekla (order)

| # | Type | Height 1920 / 1440 / 1280 / 1024 / 768 / 390 | Structure | Maps to |
|---|---|---|---|---|
| 0 | Announcement (rotating) | 40 | see header | `announcement-bar` |
| 1 | **Split campaign 2-up** | 1260 / 960 / 860 / 700 / 540 / 1081 | Full-bleed, 2 columns, **2px gap**, images 4:5, caption **below** the image (14/300, ~52px caption band), no overlay text. Mobile (<768): stacked, full width. | `split-hero` (caption-below variant) |
| 2 | **Product row 4-up** | 659 / 509 / 459 / 379 / 299 / 419 | 4 equal columns, 2px gap, 4:5 images on a light grey ground, name below. Mobile: horizontal scroll, 1.33 cards visible (293px at 390). Hover crossfades to a second image (opacity 0→1). | `featured-collection` (grid layout, minimal card) |
| 3 | **Split campaign 2-up** | as #1 | repeat | `split-hero` |
| 4 | Footer | 383 | see above | `footer` |

### Spacing and grid conventions observed

| Token | Parachute | Tekla |
|---|---|---|
| Page gutter, edge-to-edge sections | 24px (16 on mobile); 48px for rails; 120px for the "editorial narrow" section | 0 (full bleed) with 16px text inset |
| Grid gap | 8px (tiles), 16px (product cards) | 2px |
| Section vertical rhythm | 64px top / 64–88px bottom; 160px top on editorial intros; promo band 48/56 | 0 (sections abut); footer 41px top |
| Content max-width | none for media (fluid); 800px for centred text bands | none |
| Image ratios | 3:4 cards; ≈0.76 campaign tiles; ≈1.84 banner; 9:16 discovery rail; ≈0.72 category tiles | 4:5 everywhere |

## Breakpoints

| Site | Width | What changes | Source |
|---|---|---|---|
| Tekla | 1024 | inline nav ↔ hamburger | sweep + binary search |
| Tekla | 768 | 2-up and 4-up grids collapse (2-up stacks, 4-up becomes a horizontal scroller); logo 92 → 84px below 768 | sweep |
| Parachute | between 1024 and 768 | desktop nav ↔ mobile bar + sub-nav row; category grid hidden; promo band stays 2 columns at 768 | viewport captures (exact px PENDING: 429) |
| Parachute | between 768 and 390 | campaign tiles stack; rail cards 256 → 195px; gutters 24 → 16 (rails 48 → 8) | viewport captures |
| Parachute | between 1440 and 1280 | footer newsletter title 24 → 20; discovery rail images 343 → 240px | viewport captures |

## Proposed Shopify settings per homepage section

Every section also gets `color_scheme`, `padding_top`, `padding_bottom` (standard).

| Section | Settings | Blocks |
|---|---|---|
| `hero` | `media_type` (image/video), `image`, `image_mobile`, `video` (video picker), `video_url` fallback, `height` (`screen` = 100svh − header, `large`, `medium`, `adapt`), `overlay_opacity`, `content_position` (9-point), `text_color`, `transparent_header` (bool) | `heading` (text, size), `text` (richtext), `buttons` (label, link, style ×2) |
| `promo-band` | `layout` (`split` heading left / text right, `centered`), `max_width` (narrow 800 / wide) | `heading`, `text`, `button` |
| `split-hero` / `campaign-tiles` | `columns` (2/3), `gap` (0/2/8), `image_ratio` (portrait 3:4, 4:5, square, adapt), `caption_position` (overlay-bottom-left / below), `full_bleed` (bool), `mobile_layout` (stack / scroll) | `tile` (image, image_mobile, heading, text, button_label, link) |
| `featured-collection` | `collection`, `heading`, `heading_link_label`, `products_to_show`, `layout` (`carousel` / `grid`), `columns_desktop` (3–6), `card_width` (carousel: 256px default), `show_arrows`, `show_view_all` + `view_all_label`, `image_ratio` | none (or `tab` blocks, see below) |
| `bestsellers` / `new-arrivals` (tabbed rail) | as above | `tab` (label, collection), up to 5 |
| `lifestyle-story` | `image`, `image_mobile`, `image_ratio`, `inset` (0/16/24), `heading` (display size), `button_label`, `button_link`, `text_position` | `hotspot` (product, x %, y %, badge text), up to 4 |
| `campaign-image` | `image`, `image_mobile`, `desktop_ratio` (16:9 / 1.85 / 21:9), `mobile_ratio`, `inset`, `heading`, `link_label`, `link`, `content_position` | none |
| `shop-by-category` | `columns_desktop` (3/4), `image_ratio`, `label_style` (chip / text below), `hide_on_mobile` (bool), `mobile_layout` (scroll/grid) | `category` (collection, image override, label override) |
| `fabric-discovery` | `heading`, `text`, `rail_image_ratio` (9:16 default), `side_padding` (wide/standard) | `shade` (swatch colour or image, name, link, images ×N or `collection`) |
| `curated-rooms` | `heading`, `layout` (rail / grid), `image_ratio` | `room` (image, title, collection or products ×4, link) |
| `image-with-text` (editorial) | `image`, `image_position` (left/right), `image_ratio`, `content_width` | `heading`, `text`, `button` |
| `comparison-highlights` | `heading`, `columns` | `item` (icon/image, title, text, link) |
| `newsletter` | `heading`, `text`, `disclaimer`, `layout` (inline / stacked), `image` | none |
| `service-info` / `brand-values` | `columns` (3/4), `icon_style` | `item` (icon, heading, text, link) |
| `header` | `menu` (main), `mobile_subnav_menu`, `logo`, `logo_width`, `logo_position` (left / right-group), `sticky_mode` (`always` / `hide-on-scroll-down` / `none`), `transparent_on_home` (bool), `transparent_text_color`, `show_store_locator` + link | `mega_menu` (menu_item handle to match, promo cards ×3: image, title, link) |
| `announcement-bar` | `autoplay`, `speed`, `dismissible` | `announcement` (text, link) |
| `footer` | `newsletter_enable`, `newsletter_heading`, `newsletter_text`, `image`, `show_currency_selector`, `show_payment_icons`, `copyright` | `link_list` (menu, heading), `text`, `social` |
