# Phase 1 report: reference-based recreation (DRAFT, in progress)

Status date: 2026-11-26. Branch: `sakooon/integration`. Nothing has been pushed to the Shopify store; the live theme is untouched.

## 1. Theme source
`sakooon/integration` on github.com/Zuhairshad/sakooon (theme at the repo root; docs/, scripts/, tools/ excluded by .shopifyignore).
Local checkout: /Users/shad/sakooon-wt/integration.

## 2. Preview
LiquidJS preview (`PORT=9292 npm run preview`, http://localhost:9292) with fixture catalogue, menus, metaobjects and journal.
Shopify development theme: pending the Shopify CLI login (`shopify theme dev --store juj1hc-qf.myshopify.com`), deferred by the user on 2026-11-26.

## 3. Screenshots
/Users/shad/sakooon-qa/theme/<template>/<viewport>-full.png (1920/1440/1280/1024/768/390/375) plus states/ (menus, drawers, filters, variants, accordions).
Reference captures: /Users/shad/sakooon-qa/references/{parachute,tekla}/...

## 4. Reference comparison
docs/reference-map.md (governing reference per template), docs/reference/{storefront,commerce,editorial}.md (measurements with evidence levels),
docs/visual-qa-log.md (per-template review and open items), /Users/shad/sakooon-qa/diff/ (pixel diffs, side-by-sides, summary.md).

## 5. Theme Check
`shopify theme check`: 131 files, no offenses (2026-11-26).

## 6. Functional tests
scripts/test-interactions.mjs: 9/9 (mobile nav, sticky header, mega menu, search drawer, variant + add to cart + quantity + remove, facets apply via section rendering, mobile filter drawer, accordions, skip link).
scripts/test-responsive.mjs: no horizontal overflow, one visible h1, image alt, 24px targets at all viewports on every integrated template.
scripts/test-a11y.mjs (axe-core, WCAG 2.1 AA + best practice): 0 serious/critical after the icon fix; remaining moderate items assigned (see visual-qa-log).
Worker suites: commerce cart 34/34, search 28/28, collection 58/58, product 50/50; storefront QA script; editorial responsive 63/63 and 35/35.

## 7. Performance
scripts/lighthouse.mjs against the LiquidJS preview (indicative: the preview serves unresized images and imports Google Fonts; Shopify's CDN resizes srcset widths and fonts come from Shopify):
see /Users/shad/sakooon-qa/lighthouse/summary.md. Trial PDP mobile: performance 71, accessibility 100, best practices 96, SEO 100; LCP driven by the unresized hero image in the preview.

## 8. Implemented sections and templates
(filled from `ls sections templates` at hand-off)

## 9. Required Shopify Admin configuration
Consolidated from docs/metafield-contracts.md and docs/reference/{storefront,commerce,editorial}-admin.md: metaobjects (fabric, certification, color_family), product/collection/page metafields, Search & Discovery filters, option swatches, menus, pages with template suffixes.

## 10. Metafield and metaobject documentation
docs/metafield-contracts.md v0.2.

## 11. Outstanding issues and limitations
- Not verified against the real store yet (CLI login pending): variant media with real colour options, Search & Discovery filters, cart totals/taxes, checkout hand-off, customer accounts, gift cards.
- Parachute desktop mega-menu open-state pixels were not obtainable headlessly (bot protection / hover); structure captured from the DOM.
- Swatches render as text chips until option swatches or sakooon.swatch_color exist in Admin.
- Preview-only differences: fonts via Google import, no image resizing, approximate Liquid.

## 12. Branding readiness (Phase 2 inputs)
Logo + favicon, colour schemes (4 defined, editable), heading/body fonts (font picker), photography per section (sizes documented in storefront-admin.md), product content and verified fabric data (metafields), copy for guides/FAQ/shipping/returns, menus, social links, announcement messages.
