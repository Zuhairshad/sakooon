# File ownership

Rule: one owner per file. Only the owner edits it. To change someone else's file, message them
with the exact change. Integration (Fable) resolves conflicts.

## Fable (shad-61): foundation, integration, QA
- layout/*.liquid
- config/settings_schema.json, config/settings_data.json
- locales/*
- assets/base.css (tokens, reset, typography, layout utilities, buttons, forms, a11y helpers)
- assets/global.js (shared runtime, see component contracts)
- snippets/: icon.liquid, image.liquid, meta-tags.liquid, structured-data.liquid,
  section-heading.liquid, button.liquid, skip-link.liquid, css-variables.liquid, placeholder.liquid,
  pagination.liquid, breadcrumbs.liquid
- sections/: main-404, main-password, apps, custom-liquid, spacer, customers (main-login,
  main-register, main-account, main-addresses, main-order, main-activate, main-reset)
- templates/: 404.json, password.json, gift_card.liquid, customers/*
- blocks/ (empty for now)
- docs/*, scripts/*.mjs, tools/*, package.json, .theme-check.yml, .shopifyignore
- Initial stubs handed over at CONTRACTS READY: sections/header.liquid, sections/footer.liquid,
  sections/announcement-bar.liquid, sections/header-group.json, sections/footer-group.json -> shad-2d.

## shad-2d: storefront
- sections/header.liquid, announcement-bar.liquid, footer.liquid, header-group.json, footer-group.json
- sections/hero-*.liquid (hero-full, hero-split), featured-collection.liquid, collection-list.liquid
  (shop by category), image-banner.liquid, image-with-text.liquid, editorial-grid.liquid (campaign),
  product-highlights.liquid (bestsellers/new arrivals variants of featured-collection via settings),
  fabric-discovery.liquid, comparison-highlights.liquid, room-collection.liquid (curated bedroom),
  newsletter.liquid, service-info.liquid (customer service strip), brand-values.liquid, rich-text.liquid
- snippets/: mega-menu.liquid, mobile-nav.liquid, nav-link.liquid, footer-column.liquid
- assets/header.js, assets/storefront.css (section CSS may also live inline in the section via {% style %})
- templates/index.json, templates/list-collections.json
- docs/reference/storefront*.md, scripts/ref/storefront-*.mjs

## shad-d8: commerce
- sections/main-collection.liquid, collection-banner.liquid, main-product.liquid, product-recommendations.liquid,
  complementary-products.liquid, main-cart.liquid, cart-drawer.liquid, search-drawer.liquid (predictive),
  main-search.liquid, featured-product.liquid
- snippets/: product-card.liquid, price.liquid, swatches.liquid, variant-picker.liquid, product-media.liquid,
  product-gallery.liquid, facets.liquid, cart-line.liquid, quantity-input.liquid, product-accordions.liquid,
  size-guide-trigger.liquid, buy-buttons.liquid
- assets/product.js, cart.js, search.js, facets.js, commerce.css
- templates/product.json, collection.json, cart.json, search.json
- docs/reference/commerce*.md, scripts/ref/commerce-*.mjs

## shad-8b: editorial
- sections/editorial-*.liquid (editorial-hero, editorial-text, editorial-image-text, editorial-gallery,
  editorial-quote, editorial-stats, editorial-timeline), fabric-guide.liquid, fabric-detail.liquid,
  fabric-compare.liquid, fabric-care.liquid, care-guide.liquid, guide-anchor-nav.liquid, faq.liquid,
  size-guide.liquid, measurement-guide.liquid, contact-form.liquid, info-columns.liquid (shipping/returns),
  main-page.liquid, main-blog.liquid, main-article.liquid, main-metaobject-fabric.liquid, related-products-editorial.liquid
- snippets/: accordion.liquid, fabric-rating.liquid, care-icons.liquid, article-card.liquid, fabric-card.liquid
- assets/editorial.js, editorial.css
- templates/page.json, page.*.json, blog.json, article.json, metaobject/fabric.json
- docs/reference/editorial*.md, docs/reference/fabric-model.md, scripts/ref/editorial-*.mjs
- Co-owns docs/metafield-contracts.md with Fable (propose edits via message; Fable commits).

## Shared contracts (no code, read-only for workers)
docs/component-contracts.md, docs/design-system.md, docs/metafield-contracts.md.
