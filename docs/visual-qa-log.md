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
