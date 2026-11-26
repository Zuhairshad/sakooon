# Visual QA log

Format: date | template/state | viewport | observation | action | status.

## 2026-11-26 Header, drawers (integration a1b6a1d + storefront 073f94c)
- home / mega menu | 1440 | Nav left, logo + icons right; announcement 40px with prev/next and pause, header bar 56px; panel full width with group column + three 3:4 promos and an "All <item>" arrow link. Geometry matches the Parachute pattern (37+56 measured; announcement 40 follows Tekla's rotating bar). | none | OK
- home / mobile nav | 390 | Full-height left drawer, 56px rows with chevrons, account link in the footer of the drawer. Matches the measured 68px-row Tekla/Parachute drawers within tolerance (56 vs 68 rows: raise to 60-64 when the Parachute mobile drawer capture lands). | follow-up for shad-2d after the 429 reruns | OPEN (minor)
- home / search drawer | 1440 | Top sheet, full width, pill input with magnifier and clear, Suggestions + Collections column, 4-column product grid. Parachute uses square packshots in this grid; ours follow the card ratio setting (3:4). | shad-d8: add a `results_image_ratio` setting on search-drawer defaulting to square per reference | OPEN (minor)
- Parachute homepage fold references | 1440, 390 | Captures contain a newsletter/sale interstitial (washed-out desktop, email popup on mobile), so they are not usable for header pixel comparison. Measurements in docs/reference/storefront.md stand in. | shad-2d re-captures the fold once the IP cools, dismissing the popup first | OPEN
- global | all | Interaction suite: mobile-nav, header-sticky, mega-menu, search-drawer, keyboard-skip-link PASS; responsive 15/15 (1920/1440/1024/768/390) on /, /pages/about, /collections/all. | none | OK
