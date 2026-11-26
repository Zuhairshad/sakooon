# Phase 1 report: reference-based recreation

Status date: 2026-11-26. Deliverable branch: `sakooon/integration` (156 commits, head listed in git). Nothing has been uploaded to the Shopify store; the live theme is untouched. Phase 2 (Sakooon identity) has not started and waits for approval.

## 1. Complete theme source
- github.com/Zuhairshad/sakooon, branch `sakooon/integration` (theme at the repo root; `docs/`, `scripts/`, `tools/`, `package.json` are development-only and excluded from uploads by `.shopifyignore`).
- Local: /Users/shad/sakooon-wt/integration. Worker branches sakooon/storefront, sakooon/commerce, sakooon/editorial and the lead branch sakooon/foundation are all merged.

## 2. Integrated Git branch
`sakooon/integration`. Merge policy: lead merges each milestone after review; conflicts (locale files) resolved by deep JSON merge; workers merge, never rebase, after first integration.

## 3. Preview
- LiquidJS preview: `cd /Users/shad/sakooon-wt/integration && npm install --ignore-scripts && PORT=9292 npm run preview` -> http://localhost:9292. Fixtures: colour x size products (9001, 9002), 3-level menus, fabric/certification metaobjects, journal with 11 articles, storefront-style filters, cart/predictive-search/recommendations/section-rendering endpoints, CDN-like image resizing.
- Shopify development theme: pending CLI login (`shopify theme dev --store juj1hc-qf.myshopify.com`), deferred by the user on 2026-11-26. The theme is ready to push to a development theme; nothing in it is preview-specific.

## 4. Screenshots
- Theme: /Users/shad/sakooon-qa/theme/<template>/<viewport>-full.png at 1920/1440/1280/1024/768/390/375 for home, collection, product, cart, search, about, FAQ, size guide, contact, 404, login, fabric, fabric guide, care guides, journal; interaction states under states/ (mega menu, mobile sheet, sticky header, search typed, cart open, variant selected, accordion open, size guide, sticky bar, added to cart, filters, hover).
- References: /Users/shad/sakooon-qa/references/parachute/* (home, collection, product, search, cart states, fabrics, care, FAQ, contact, returns, our-story, blog) and /Users/shad/sakooon-qa/references/tekla/* (home, ESG, care guide, textile care, product care, about, stories, size guide, shipping and returns, contact), each with measurement JSON.

## 5. Reference-versus-implementation comparison
- docs/reference-map.md: governing reference per template with measured key values.
- docs/reference/storefront.md, commerce.md, editorial.md: measurements per viewport with evidence levels (measured / visual / DOM / inferred), interaction logs, section inventories.
- docs/visual-qa-log.md: review of every integrated template against its reference, with open items and their owners.
- docs/reference/editorial-visual-pass.md and storefront-review.md: per-section self-reviews.
- /Users/shad/sakooon-qa/diff/<pair>/: pixel diff, side-by-side and summary for home, collection, product, size guide, journal (pixel mismatch is content-driven with placeholder media; geometry is judged from the measured tables).
- Known, documented differences: Parachute desktop mega-panel geometry unmeasured (panels do not open headlessly; structure from DOM); size guide uses inline tables instead of a full-screen panel; PDP below-fold editorial blocks exist as presets, not in product.json; swatches render as text chips until Admin swatch data exists.

## 6. Theme Check
`shopify theme check` on sakooon/integration: 135 files inspected, no offenses.

## 7. Functional testing
- scripts/test-interactions.mjs: 9/9 PASS (mobile nav open/Escape/focus return, sticky header, mega menu hover/keyboard/Escape, search drawer autofocus/typing/Escape, variant change + add to cart + drawer + quantity + remove, facets drawer apply via Section Rendering with history, mobile filter drawer, accordions keyboard toggle, skip link).
- scripts/test-responsive.mjs: 91/91 PASS (13 templates x 7 viewports: no horizontal overflow, one visible h1, image alt, 24px targets, no console errors).
- scripts/test-a11y.mjs (axe-core WCAG 2.1 AA + best practice, with cart drawer, search drawer and mobile sheet open): 0 serious/critical, 0 moderate on the standard template list after fixes.
- Worker suites (Playwright, on their branches with the integrated tree): commerce product 50/50, cart 34/34, search 28/28, collection 58/58, pages 28/28; storefront QA script and schema audit 18/18; editorial responsive 63/63 and 21/21, editorial-a11y clear on 15 templates.
- Checkout navigation: the cart's Check out button posts to Shopify's checkout; verified as a form action only (no real purchase, no checkout in the preview).

## 8. Performance
scripts/lighthouse.mjs on the preview with CDN-like image resizing (indicative: fonts come from a Google import in the preview and from Shopify's font CDN on the store; no Shopify CDN caching). Reports: /Users/shad/sakooon-qa/lighthouse/.

| page | form | perf | a11y | best | seo | LCP | CLS | TBT |
|---|---|---|---|---|---|---|---|---|
| / | mobile | 89 | 100 | 100 | 100 | 3.3 s | 0 | 0 ms |
| / | desktop | 95 | 100 | 100 | 100 | 1.1 s | 0 | 0 ms |
| /collections/all | mobile | 80 | 100 | 100 | 100 | 4.6 s | 0.001 | 0 ms |
| /collections/all | desktop | 97 | 100 | 100 | 100 | 1.0 s | 0.001 | 0 ms |
| /products/fixture-quilted-bed-sheet-set | mobile | 77 | 100 | 100 | 100 | 5.0 s | 0.001 | 10 ms |
| /products/fixture-quilted-bed-sheet-set | desktop | 91 | 100 | 100 | 100 | 1.2 s | 0.013 | 0 ms |
| /cart | mobile | 95 | 100 | 100 | 100 | 2.6 s | 0.001 | 0 ms |
| /cart | desktop | 99 | 100 | 100 | 100 | 0.7 s | 0.002 | 0 ms |
| /search?q=sheet | mobile | 81 | 100 | 100 | 100 | 4.4 s | 0.001 | 0 ms |
| /search?q=sheet | desktop | 91 | 100 | 100 | 100 | 1.4 s | 0 | 0 ms |
| /pages/fabric/percale | mobile | 87 | 100 | 100 | 100 | 3.8 s | 0 | 0 ms |
| /pages/fabric/percale | desktop | 75 | 100 | 100 | 100 | 2.3 s | 0 | 0 ms |
| /pages/about?view=fabric-guide | mobile | 83 | 100 | 100 | 100 | 4.1 s | 0 | 0 ms |
| /pages/about?view=fabric-guide | desktop | 98 | 100 | 100 | 100 | 1.1 s | 0.002 | 0 ms |
| /pages/about?view=faq | mobile | 95 | 100 | 100 | 100 | 2.6 s | 0.001 | 0 ms |
| /pages/about?view=faq | desktop | 99 | 100 | 100 | 100 | 0.8 s | 0 | 0 ms |
| /pages/size-guide | mobile | 93 | 100 | 100 | 100 | 2.6 s | 0.054 | 0 ms |
| /pages/size-guide | desktop | 99 | 100 | 100 | 100 | 0.7 s | 0.02 | 0 ms |
| /blogs/journal | mobile | 81 | 100 | 100 | 100 | 4.7 s | 0 | 0 ms |
| /blogs/journal | desktop | 99 | 100 | 100 | 100 | 0.8 s | 0 | 0 ms |

Accessibility, best practices and SEO are 100 on every template. Mobile performance is 77-95: the remaining cost is render-blocking CSS (four theme stylesheets) and image-heavy templates' LCP on a throttled 4G profile. Real figures require the Shopify development theme.

## 9. Implemented sections and templates
Sections (61): announcement-bar, header, footer, hero-full, hero-split, rich-text, featured-collection, editorial-grid, product-highlights, image-banner, image-with-text, collection-list, fabric-discovery, comparison-highlights, room-collection, brand-values, newsletter, service-info; main-collection, collection-banner, main-product, product-recommendations, complementary-products, cart-drawer, main-cart, search-drawer, main-search; editorial-hero, editorial-text, editorial-image-text, editorial-gallery, editorial-quote, editorial-stats, editorial-timeline, guide-anchor-nav, faq, info-columns, contact-form, main-page, main-metaobject-fabric, fabric-detail, fabric-guide, fabric-compare, related-products-editorial, care-guide, size-guide, measurement-guide, main-blog, main-article; main-404, main-password, apps, custom-liquid, spacer, main-login, main-register, main-account, main-addresses, main-order, main-activate, main-reset. Section groups: header-group (announcement, header, cart-drawer, search-drawer), footer-group.
Templates (33): index, collection, list-collections, product, cart, search, 404, password, gift_card, blog, article, page, page.about, page.contact, page.faq, page.shipping, page.returns, page.fabric-guide, page.care-guide, page.care-bedsheets, page.care-pillows, page.care-comforters, page.care-towels, page.size-guide, page.measurement-guide, metaobject/fabric, customers/login, register, account, addresses, order, activate_account, reset_password.
Snippets (31) including product-card, price, swatches, variant-picker, product-gallery, buy-buttons, product-accordions, facets, cart-line, quantity-input, mega-menu, mobile-nav, accordion, fabric-card, fabric-rating, care-icons, article-card, image, icon, section-heading, pagination, breadcrumbs, structured-data, meta-tags.
Assets: base.css, storefront.css, commerce.css, editorial.css, global.js, header.js, product.js, cart.js, search.js, facets.js, editorial.js (no third-party libraries).

## 10. Required Shopify Admin configuration (not yet applied; needs authorization)
Consolidated in: docs/metafield-contracts.md (definitions), docs/reference/commerce-admin.md (options and native swatches, product/collection metafields, inventory, Search & Discovery filters incl. colour family, recommendations, theme settings, verification checklist), docs/reference/editorial-admin.md (Fabric and Certification metaobjects field by field, page/product metafields, the 14 pages with template suffixes, journal blog, menus), docs/reference/storefront-admin.md (menus main-menu/footer-shop/help/company/guides/legal, theme settings, image sizes per section, handles referenced by index.json).

## 11. Metafield and metaobject documentation
docs/metafield-contracts.md v0.2: Fabric metaobject (publishable, web pages), Certification metaobject (issuer, licence number, verification URL, expiry: nothing renders without all of them), Colour family metaobject; product, variant, collection and page metafields in namespace `sakooon`; resolution chains (variant -> product fabric; product care -> fabric care).

## 12. Outstanding issues and limitations
- Not verified on the real store: native option swatches, Search & Discovery filters and recommendations, cart totals and taxes, checkout hand-off, customer accounts, gift cards, video in hero-full. All are standard Shopify objects/endpoints; verification is a `shopify theme dev` session plus the checklists in the admin docs.
- Reference gaps: Parachute desktop mega-panel pixels; some mobile cart/search states (bot protection and rate limiting; nothing bypassed).
- Design-language choices to confirm with you: single grotesk at 14px/300 headings (D4/D11) versus Parachute's serif display; body weight 400 (D15); warm paper palette (provisional, Phase 2 brand palette replaces it).
- Open minor items: none blocking; see docs/visual-qa-log.md "OPEN" rows (all assigned or deferred to Phase 2 content).

## 13. Branding readiness for Phase 2
Everything brand-specific is a setting or content: logo and favicon (theme settings), four colour schemes (editable; a brand accent scheme for promo bands is recommended), heading/body fonts and weights (font pickers), announcement messages, mega-menu promo imagery, hero media (image/video, sizes in storefront-admin.md), section imagery per section, product photography and copy via Admin, fabric data via the Fabric metaobject, care/size/FAQ/shipping/returns copy via page templates and blocks, social links, payment icons (Shopify), Pakistani positioning and PKR formatting (shop settings). No code change is required to apply Phase 2 branding; what remains code-level is any new section pattern you request after seeing the branded content.
