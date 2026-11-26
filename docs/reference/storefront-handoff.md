# Storefront handoff (end of Phase 1)

Session: shad-2d (storefront). Lead/integrator: shad-61 (Fable). Commerce: shad-d8. Editorial: shad-8b.
Phase 1 approved (grotesk kept). Phase 2 = Sakooon identity. **Wait for shad-61's Phase 2 brief before changing theme files.**

## Where things are
- Worktree: `/Users/shad/sakooon-wt/storefront`, branch `sakooon/storefront` (head: the commit adding this file; previous `1b741bf`).
- Merged into `sakooon/integration` by shad-61. Pick up others' work with `git -c core.hooksPath=/dev/null merge origin/sakooon/foundation` (or `.../integration`).
- Git rules: always `git -c core.hooksPath=/dev/null`; **no rebase, no force-push** (plain fast-forward pushes); commit as the user, no Co-Authored-By; never bare `git stash`.
- Never touch `/Users/shad/sakooon` (Next.js app) or `/Users/shad/sakooon-theme`.

## Run and test (port 9301 is mine)
- Install: `npm install --ignore-scripts`
- Preview: `PORT=9301 nohup npm run preview > /Users/shad/sakooon-qa/preview-9301.log 2>&1 &`. Restart only by port: `lsof -ti tcp:9301 | xargs kill` (never `pkill -f`).
- Before every commit: `npm run check` (0 errors expected) and `node scripts/ref/storefront-schema-audit.mjs` (18/18 ok).
- Before reporting:
  - `node scripts/test-responsive.mjs --base http://localhost:9301 --paths /,/collections --viewports 1920,1440,1280,1024,768,390,375`
  - `node scripts/test-interactions.mjs --base http://localhost:9301 --only mobile-nav,header-sticky,mega-menu,search-drawer,keyboard-skip-link`
  - `node scripts/test-a11y.mjs --base http://localhost:9301 --paths /,/collections --open mobile-nav,search-drawer` and `node scripts/lighthouse.mjs --base http://localhost:9301 --paths / --only mobile`
- Own QA captures: `node scripts/ref/storefront-qa.mjs --only header,mega,mobile,sticky,full`; one element: `scripts/ref/storefront-shot.mjs`.
- QA output (not in git): `/Users/shad/sakooon-qa/` (references/, theme/storefront/, theme/home/, lighthouse/).

## Files I own
- Sections: announcement-bar, header, footer, header-group.json, footer-group.json, hero-full, hero-split, rich-text, featured-collection, product-highlights, editorial-grid, image-banner, collection-list, fabric-discovery, newsletter, service-info, image-with-text, comparison-highlights, room-collection, brand-values.
- Snippets: mega-menu, mobile-nav (nav-link and footer-column are allocated to me but unused).
- Assets: `storefront.css` (all storefront CSS), `header.js` (the area's only script, with `<sticky-header>`, `<header-menu>`, `<mobile-nav-levels>`, `<announcement-bar>`, `<scroll-rail>`, `<hero-video>`, `<hotspot-pin>`).
- Templates: index.json, list-collections.json. Locales: only the `storefront.*` namespace in en.default.json.
- Docs/scripts: `docs/reference/storefront*.md`, `scripts/ref/storefront-*.mjs`.

## Open items (see storefront-review.md for the full table)
- Parachute desktop mega panels never opened headlessly, so their geometry is unmeasured (structure from DOM only).
- All media are placeholders, so the transparent header (needs hero media + `[data-header-overlay]`) is untested with real assets except a local check.
- Hero video untested (the preview has no `video_tag`); verify on `shopify theme dev`.
- Fabric discovery swatches are flat colours; link to fabric metaobjects (D8) in Phase 2.
- Promo band needs a brand colour scheme; index.json collection/product handles are preview ones (`storefront-admin.md` §5).

## Three things a fresh context must know
1. **Contracts**: the header must keep `data-drawer-open="search-drawer"|"cart-drawer"`, `[data-cart-count]`, `<theme-drawer id="mobile-nav">`, the `.section-header` sticky wrapper, `header:height` pubsub + `--header-height`/`--header-visible-height`. Others depend on them (docs/component-contracts.md).
2. **Conventions**: every section has `color_scheme`, `padding_top`, `padding_bottom`, a preset, and one h1 per page (hero heading). Buttons render only when a link is set. Images go through `snippets/image.liquid`, cards through commerce's `product-card`. Reference findings carry evidence tags in `storefront.md`.
3. **Process**: report to shad-61 only at boundaries (task done / blocked) with commit hash, files, test output. Talk to shad-d8/shad-8b directly for cross-dependencies. Parachute rate-limits the shared IP: one browser, 20s pacing (`storefront-lib.mjs`), never bypass challenges.
