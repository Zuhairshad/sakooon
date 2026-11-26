# Visual QA log

Format: date | template/state | viewport | observation | action | status.

## 2026-11-26 Header, drawers (integration a1b6a1d + storefront 073f94c)
- home / mega menu | 1440 | Nav left, logo + icons right; announcement 40px with prev/next and pause, header bar 56px; panel full width with group column + three 3:4 promos and an "All <item>" arrow link. Geometry matches the Parachute pattern (37+56 measured; announcement 40 follows Tekla's rotating bar). | none | OK
- home / mobile nav | 390 | Full-height left drawer, 56px rows with chevrons, account link in the footer of the drawer. Matches the measured 68px-row Tekla/Parachute drawers within tolerance (56 vs 68 rows: raise to 60-64 when the Parachute mobile drawer capture lands). | follow-up for shad-2d after the 429 reruns | OPEN (minor)
- home / search drawer | 1440 | Top sheet, full width, pill input with magnifier and clear, Suggestions + Collections column, 4-column product grid. Parachute uses square packshots in this grid; ours follow the card ratio setting (3:4). | shad-d8: add a `results_image_ratio` setting on search-drawer defaulting to square per reference | OPEN (minor)
- Parachute homepage fold references | 1440, 390 | Captures contain a newsletter/sale interstitial (washed-out desktop, email popup on mobile), so they are not usable for header pixel comparison. Measurements in docs/reference/storefront.md stand in. | shad-2d re-captures the fold once the IP cools, dismissing the popup first | OPEN
- global | all | Interaction suite: mobile-nav, header-sticky, mega-menu, search-drawer, keyboard-skip-link PASS; responsive 15/15 (1920/1440/1024/768/390) on /, /pages/about, /collections/all. | none | OK

## 2026-11-26 Footer + fabric pages (integration after storefront 0c1ca23 and editorial 993bc36)
- home / footer | 1440 | 12-col footer, newsletter 4/12 left with inline arrow submit, four 2/12 link columns, bottom bar with wordmark, legal links and copyright; sand scheme. Matches the Parachute footer structure and Tekla's divider option. | none | OK
- metaobject/fabric | 1440 | Two-column header: 4:5 texture image + gallery grid + lifestyle image on the left, sticky info column (eyebrow, h1, tagline, summary, spec rows, cool-warm scale, best-for chips, Shop + Care guide) on the right; details in the 732px editorial column; "More fabrics" cards. Reads as Parachute fabric detail with Tekla text rhythm. Console clean, no overflow at 1440/390. | none | OK
- metaobject/fabric / gallery block | 1440 | The gallery block renders two ~72px thumbnails under Care; the reference (Tekla percale page) uses a full-column image, Parachute uses large 4:5 tiles. | shad-8b: render gallery images at column width (2-up 4:5 grid, 3-up on wide) | OPEN (minor)
- metaobject/fabric / more fabrics | 1440 | 2 large cards; Tekla's "More textile care" is a 3-up grid with 4:5 images and title + Read more. | shad-8b: columns setting default 3 (falls to 2 when only two fabrics exist, 1 col scroll on mobile) | OPEN (minor)
- fabric guide | 1440 | 4392px page, console clean; filters work (sateen leaves one card). Detailed comparison pending the Parachute our-fabrics-detail capture (directory exists, images not yet written). | revisit after capture | PENDING

## 2026-11-26 Collection (integration after commerce 16f57cf/80abd92)
- collection | 1440 | Banner: 80px display title with superscript count, no image because the fixture collection has none (Parachute shows a 3:4 image in cols 1-3 when present; our banner supports it via collection.image or sakooon.banner_image). Toolbar "Filter and sort" + count, hairline above. 4-column grid, 8px gap, 3:4 cards, badges top-left, price + compare, swatches. Matches the measured Parachute geometry. | none | OK
- collection / swatches | 1440 | Fixture colour names ("Grey / White", "Periwinkle Blue") are not CSS named colours, so the D10 fallback renders text chips; Parachute shows 16px circles. On the real store option-value swatches or sakooon.swatch_color give circles. | Phase 2 data task: set option swatches in Admin | OK (expected)
- collection / facets drawer | 1440, 390 | 600px left drawer (full width on mobile), sort radios, list filters with counts, price range, sticky Reset/Apply; Apply re-renders in place (no navigation entry), back/forward restore. | none | OK
- search drawer | 1440 | Result tiles are square (260px) as on Parachute; earlier note withdrawn. | none | OK

## 2026-11-26 Homepage (integration after storefront 087ac7e)
- home | 1440 | Section sequence matches the Parachute inventory one for one: hero (100svh minus announcement), promo band (800px measure, split), featured rail (256px 3:4 cards, 16px gap, arrows, View all), two campaign tiles with overlay copy, tabbed bestsellers rail, lifestyle feature with display headline and hotspot, campaign banner with bottom-left caption, second tabbed rail, shop-by-category tiles with chip labels, fabric discovery (swatch tabs + 9:16 rail with 120px gutters), service strip, footer. Page height 9520 vs 9914 reference (placeholder imagery, no promo copy). | none | OK
- home / hero | 1440 | Reference hero carries only a centred CTA near the bottom with the campaign type baked into the media; our placeholder shows heading + text + button at middle-left (a content-position setting). Default the preset to bottom-centre with button only when media is present, keep heading/text as optional settings. | shad-2d | OPEN (minor)
- home | 390 | Stacked sequence intact, no overflow at 375/390, rails become 2-up scroll, categories 2 columns, discovery rail scrolls. | none | OK
- compare script | all | Bug found: pixel diffs were blank (buffer copy direction). Fixed; page-height check added. Worker reference captures store measure.json rather than geometry.json, so geometry rows are empty for those; the measured tables in docs/reference/*.md are the geometry source for Phase 1. | fixed | OK

## 2026-11-26 Journal and size guide (integration after editorial ccedb41)
- blog | 1440 | Title + intro, tag filter row with underlined current tag, 3-up 16:10 cards with title, date | tag, excerpt; "Showing 9 of 11" progress bar and outlined Show more. Matches the Tekla stories pattern (3-up, caption meta, Show more). | none | OK
- page.size-guide | 1440 | 668px column, intro, cm/in toggle, hairline category rows (68px, chevrons) exactly like Tekla's size guide index, then inline tables with zebra 56px rows and "Measurements in cm" caption. Tekla opens each category in a full-screen panel; ours anchors to inline tables, which keeps the content crawlable and works without JS. Accepted as an intentional difference. | none | OK (documented)

## 2026-11-26 Product page (integration after commerce b2f85dd)
- product | 1440 | 50/50 split: full-bleed 3:4 gallery left, 460px sticky buy box right with title, colour label + swatches, filled "Bedding size" dropdown row (44px), add-to-cart with the price inside the button, uppercase "what's included" chips, hairline accordions, then "Complete the bed" and "You may also like" rails, footer. Matches the measured Parachute PDP (720/720 split, 460 buy box, 44px controls, price-in-button). | none | OK
- product / accordions | 1440 | Reference shows three 64px rows (Size guide, Details + Care, Shipping + Returns) that open side drawers; ours shows one accordion per populated metafield group (Description, Dimensions, Composition, Feel, Specifications, What's included, Care) inline. Merchant-configurable blocks; keep inline accordions (crawlable, no extra drawer) but consider a preset with fewer, grouped rows in Phase 2 content work. | note for Phase 2 | OK (documented)
- product / swatches | 1440 | Text chips for non-CSS colour names (fixture data); real option swatches arrive with Admin data. | Phase 2 data | OK (expected)
- product / add to cart | 1440 | Cart drawer opens from the right (500px) with line (image, title, options, qty stepper, Remove), "Complete the bed" rail, subtotal, tax note, Check out, View cart. Matches the Rebuy flyout geometry recorded by commerce. | none | OK
- product | 390 | Gallery full width, buy box stacked, sticky add-to-cart bar appears after the main button scrolls away, rails scroll horizontally, no overflow. | none | OK
- disclosure | all | Collapsed accordions showed ~20px of content (padding inside the 0fr row). Fixed in base.css (min-height 0). | fixed | OK

## 2026-11-26 Pixel/side-by-side comparisons (scripts/compare-screenshots.mjs, /Users/shad/sakooon-qa/diff/)
- parachute/home vs home | 1440 59% / 390 46% mismatch | page height 9520 vs 9914 (pass within 10%). Placeholder imagery and copy drive the pixel number; structure matches (see homepage entry). | none | OK
- parachute/collection vs collection | 1440 50% / 390 46% | reference 48 products over 6763px vs 4 fixture products over 1899px; the header, banner, toolbar and grid rows align at the top. Height check is content-driven, not a layout defect. | none | OK (content)
- parachute/product vs product | 1440 48% / 390 46% | reference 5378px includes a long editorial story, "Complete your set", reviews banner, materials and recently-viewed blocks below the fold; ours ends after two rails (2793px). The above-the-fold split, buy box and rails match. Below-fold editorial sections exist as presets (image-with-text, comparison-highlights, featured-collection) and can be added to product.json in Phase 2 content work. | Phase 2 | OK (documented)
- tekla/size-guide vs size-guide | 1440 0.9% | reference 1033px shows only the index (tables open in a panel); ours 3536px shows the index plus inline tables. Index geometry matches (0.9% mismatch above the fold). | documented earlier | OK
- tekla/stories vs journal | 1440 38% | page heights pass; 3-up grid and caption rhythm match, imagery differs. | none | OK

## 2026-11-26 Mobile menu sheet (integration after storefront 2cd7e67)
- home / mobile nav | 390 | Bottom sheet rising under the visible header, 61px rows with chevrons, Account row at the end; matches the measured Parachute sheet (582px, 61px rows). Earlier left-drawer note closed. | none | OK

## 2026-11-26 Cart page, FAQ sidebar, fabric guide panels (integration after commerce a279857, editorial cfbd180)
- cart | 1440 | "Your cart (1)" title, line with image/title/options/stepper/Remove, sticky summary card (subtotal, tax note, Check out, Continue shopping), empty state with login prompt. Parachute has no dedicated cart page geometry beyond the flyout; ours follows the drawer's line layout. | none | OK
- page.faq (sidebar layout) | 1440 | Sticky "Jump to a section" list left (aria-current follows scroll), grouped question accordions right with hairlines, "Still have a question?" footer block. Matches the Parachute FAQ structure. | none | OK
- page.fabric-guide (panels layout) | 1440 | Filter chips, framed panels per fabric with 43:5 texture banner and name, feel chip, statement, two accordions, product-card rail, "Shop all <fabric>"; compare table; how-to-choose; FAQ. Matches Parachute's fabric guide pattern (verified by editorial in docs/reference/editorial-visual-pass.md). | none | OK

## 2026-11-26 Phase 2 integration check (head 31f9cfd)
Merged: editorial 62e7dd9 (fabric metaobjects, accordion label), commerce 25efe12 (real-catalogue overlays, variant swatch colours). Theme Check: 136 files, no offenses. test-interactions on 9292: all pass. test-a11y default set (15 pages x 2 viewports): 30/30 PASS, 0 violations.

## 2026-11-26 Phase 2 integration check (head 1a7e960)
Merged: storefront 78459d8 + 5df3ee1 (brand header/footer, real menus, homepage, cart name fix), editorial e111c43/d2a3a96 (care, size, FAQ, shipping, returns, contact), commerce 25efe12. Theme Check clean; interactions 9/9 on 9292.
Lighthouse mobile on the preview: / 76-78, PDP 75, FAQ 84 (a11y/BP/SEO 100/100/100). LCP = hero img; breakdown TTFB 0.45 s, load 1.0 s, render delay 4.0 s. Render delay is the blocking chain: 4 CSS files (147 KB unminified) + the preview-only Google Fonts CSS request (1.3 s). On Shopify, fonts are @font-face from the Shopify CDN (preconnected, preloaded) and assets are minified + brotli, so this number is a floor, not the expected store result. Done anyway: commerce.css/editorial.css load non-blocking outside their templates; preview font requests collapsed to one per family. Remaining lever if the store measurement is still low: inline the critical base/header CSS (~6 KB) in theme.liquid.

## 2026-11-26 Phase 2 integration check (head 028abe0, clean run)
14 templates x 7 viewports: test-responsive 98/98. test-a11y default set (15 pages x 2 viewports, drawers open): 30/30 PASS, 0 violations. Theme Check clean. Later merges (storefront 95f8bb1, editorial b5faf86, commerce M4 1d31ba9, D19 leftovers) each passed Theme Check; final suite re-run after commerce M5.

## 2026-11-26 Phase 2 closing run (head 37de3d7)
Interactions 9/9, responsive 112/112 (16 templates x 7 viewports), axe 30/30 with 0 violations, Theme Check clean. Lighthouse mobile: home 79, bed-sheets 79, PDP 82/87, fabric guide 85, about 90, FAQ 94, journal 92; a11y/BP/SEO 100 everywhere.

## 2026-11-26 Homepage redesign check (head 6a7a727)
After the user review: storefront e8e0c43 (Sukoon statement, Why Sakooon split, newsletter/service strip removed, 1440 text cap) and 6a7a727 (rails fit). Home: Theme Check clean, interactions 9/9, responsive 7/7, axe 0 at 1920/390; capture /Users/shad/sakooon-qa/theme/p2-home-v3/1920-full.png.
