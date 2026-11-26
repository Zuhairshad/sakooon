# Commerce handoff (shad-d8), end of Phase 1

Status: Phase 1 approved. Wait for the Phase 2 brief from shad-61 before changing any theme file.
Worktree `/Users/shad/sakooon-wt/commerce`, branch `sakooon/commerce`. Head before this doc: `a279857` (merged into
`sakooon/integration`). Repo github.com/Zuhairshad/sakooon. Never touch /Users/shad/sakooon (Next.js) or /Users/shad/sakooon-theme.

## Git rules
- Always `git -c core.hooksPath=/dev/null …`. No rebases or force-pushes: merge `origin/sakooon/foundation` (or integration) into the branch and push fast-forward.
- Never bare `git stash`. Commit as the user, no Co-Authored-By lines. Commit small, run `npm run check` first.

## Run
- `npm install --ignore-scripts`, then `PORT=9302 node tools/preview/server.mjs` (my port). Restart only by port: `lsof -ti tcp:9302 | xargs kill` (rule D13, never `pkill -f`).
- The preview is LiquidJS with fixtures: product 9001 `fixture-quilted-bed-sheet-set` (11 colours × 3 sizes, Rust/King sold out, metafields), 9002 `fixture-two-tone-duvet-cover-set` (compare-at, size_guide/care_guide).
- Drawers: on my branch `sections/header-group.json` may lack cart-drawer/search-drawer (integration has them). For local tests add them in an uncommitted edit, then `git checkout` that file.
- Tests (all green at a279857): `node scripts/ref/commerce-test-{pages,product,cart,search,collection}.mjs --base http://localhost:9302 [--shots /Users/shad/sakooon-qa/theme/commerce]`
  (28/50/34/28/58), then `node scripts/test-interactions.mjs`, `test-responsive.mjs`, `test-a11y.mjs --open cart-drawer,search-drawer` with `--base`.
- Reference captures: `scripts/ref/commerce-run-all.sh` (serial, 20s spacing, 90s backoff on 429; the site rate-limits the shared IP). Output: `/Users/shad/sakooon-qa/references/parachute/`.

## Files I own (docs/file-ownership.md)
- sections: main-collection, collection-banner, main-product, product-recommendations, complementary-products, main-cart, cart-drawer, search-drawer, main-search (featured-product is not built yet)
- snippets: product-card, price, swatches, variant-picker, product-gallery, buy-buttons, product-accordions, size-guide-trigger, facets, cart-line, quantity-input (product-media is not built: the gallery covers it)
- assets: product.js, cart.js, search.js, facets.js, commerce.css. templates: product, collection, cart, search (.json)
- docs/reference/commerce*.md (commerce.md investigation, commerce-admin.md store setup, this file), scripts/ref/commerce-*.mjs
- Locales: only keys under products.*, sections.cart.*, templates.*, and schema labels sections.<my section>.*. Edit as structured JSON inserts; never reformat the file.

## Contracts in use
- `theme.cart.add(formOrItems,{source,open})` / `.change(line,qty)` / `.refresh()` / `.open()`. Adds post `/cart/add.js` with `sections` (every `cart-items[data-cart-section]`), then publish `cart:updated {cart, source, open, sections}`. The drawer re-renders only `[data-cart-content]`.
- PDP variant change: GET `?variant=&section_id=` and swap `[data-pdp-update]` regions (gallery only when the colour changes), then `variant:change`.
- Facets: `[data-facets-section]` is re-rendered via `?section_id=` with pushState/popstate. The GET form works without JS.
- Colour (D10): a real Colour option first, else `sakooon.siblings`. Swatch order: option swatch → CSS named colour → text chip.
- Fabric resolution inline: variant.metafields.sakooon.fabric → product. Size guide: lift `[data-size-guide]` from the guide page; anchor = `product.type | handle`.

## Open items
1. Real-store verification (native swatches, Search & Discovery filters, complementary recs) is pending `shopify theme dev` (user CLI login).
2. Uncaptured reference states: Parachute cart drawer states; collection and search states at 390.
3. Not built (not requested in Phase 1): featured-product section, quick add on cards (setting `card_show_quick_add` exists, unused), back-in-stock app block.

## Three things a fresh context must know
1. Liquid filter chains: arguments end at the next `|`. Format money first, then pass it to `t` (`assign m = x | money` then `t: price: m`); same for `image_url` inside `append`. Never `assign p = true` before checking a `p` render param (check `== nil`/`== false` into a new variable).
2. The preview is not Shopify. Template section ids are `template--<file>__<key>`, group ids `sections--<group>__<key>`. Custom elements need `display:block` (commerce.css). Playwright tests run with reducedMotion where relevant, and `framenavigated` fires on pushState (use a window marker to detect reloads).
3. Coordination: report to shad-61 only at boundaries (done/blocked) with commit hashes and test output. Ask shad-2d (header/storefront) and shad-8b (editorial, size guide/fabric) directly and cc shad-61 with one line. Never ask the user directly.
