# Storefront self-review (Phase 1)

Owner: shad-2d. Counts come from each section's `{% schema %}` (settings with an id; block type with its setting count). References: P = Parachute, T = Tekla (see `storefront.md`).

| Section | File | Recreates | Settings | Block types (settings) | Known gaps / Phase 2 notes |
|---|---|---|---|---|---|
| Announcement bar | `sections/announcement-bar.liquid` | T rotating bar (P single message) | 5 | announcement (2) | Copy is placeholder. No per-message colour. Dismissal is per session only. |
| Header | `sections/header.liquid`, `snippets/mega-menu.liquid`, `snippets/mobile-nav.liquid`, `assets/header.js` | P nav-left / logo-right header, mega panels (groups + promos), sticky, transparent over hero; T hide-on-scroll option; mobile sheet (P/T) | 10 | mega_promo (4) | P open-panel geometry and timing are unmeasured (panels don't open headlessly), so column spacing is our own. Promo imagery is placeholder. Tekla's two-level hover layout is not built (stretch goal). No store-locator icon. Logo is a text wordmark until a brand logo exists. |
| Footer | `sections/footer.liquid` | P newsletter + link columns + bottom bar; T optional column dividers | 9 | newsletter (4), link_list (3), text (3), social (2), image (5) | Needs real menus (`footer-*`, `legal`) and social links. Newsletter success state only after a full page reload (no AJAX). No back-to-top. |
| Hero | `sections/hero-full.liquid` | P full-bleed video hero (100svh minus chrome, transparent header overlay) | 10 | eyebrow (1), heading (3), text (1), buttons (6) | Hero media is a placeholder (so the header stays solid in Phase 1). Video is untested on the preview (no `video_tag`): verify on `shopify theme dev`. P bakes campaign type into the media; ours is live text. |
| Split hero | `sections/hero-split.liquid` | Image + content panel hero (generic split) | 14 | – | No video option. Not on the default homepage. |
| Rich text / promo band | `sections/rich-text.liquid` | P promo message band (800px, heading beside text) | 12 | – | Defaults to the ink scheme; P uses a brand colour, so Phase 2 should add a brand scheme. |
| Featured collection | `sections/featured-collection.liquid` | P product rail (256px cards, arrows, View all) / T 4-up grid | 16 | – | No swipe progress indicator. Card internals belong to commerce's `product-card`. |
| Product highlights | `sections/product-highlights.liquid` | P tabbed bestseller rail | 11 | tab (2) | All tab panels render on load (≤ 5 × 16 cards); lazy rendering via the Section Rendering API is a Phase 2 optimisation. |
| Campaign tiles | `sections/editorial-grid.liquid` | P split campaign tiles; T 2-up with captions below | 13 | tile (5) | No mobile-specific image per tile. Tile headings are h3 even without a section heading. |
| Image banner / lifestyle story | `sections/image-banner.liquid` | P campaign banner; P lifestyle feature with shoppable hotspot | 17 | hotspot (4) | Hotspot positions must be re-set when the image changes. On mobile the card is a bottom sheet rather than P's inline card. |
| Shop by category | `sections/collection-list.liquid` (+ `templates/list-collections.json`) | P 4-up category grid with chip labels; T labels below | 11 | category (3) | P hides it below 768; ours defaults to swipe (setting offers hide). Hover-reveal behaviour on P is unconfirmed, so not built. Needs collection images. |
| Fabric discovery | `sections/fabric-discovery.liquid` | P "palette" shade discovery (swatches switch a 9:16 rail) | 8 | shade (10) | Swatches are flat colours; real fabric swatch images and a link to fabric metaobjects (D8) are Phase 2. Images are block uploads, not product media. |
| Newsletter | `sections/newsletter.liquid` | Standalone sign-up (P/T footer pattern as a section) | 9 | – | Same reload-based success state as the footer. Not on the default homepage (the footer has one). |
| Service info | `sections/service-info.liquid` | Customer-service strip (delivery/returns/care/support) | 8 | item (5) | Icons from the shared set only; no custom icon upload. |
| Image with text | `sections/image-with-text.liquid` | Editorial image + text | 15 | – | No video. |
| Comparison highlights | `sections/comparison-highlights.liquid` | Fabric/weave comparison columns | 9 | column (6) | Attributes are free richtext; Phase 2 should read fabric metaobject fields so rows stay consistent. |
| Room collection | `sections/room-collection.liquid` | Curated "shop the room" | 6 | room (8) | Products picked by hand (4 max); no hotspots on the room image. |
| Brand values | `sections/brand-values.liquid` | Brand values columns | 11 | value (4) | Copy and imagery are placeholders pending brand content. |

Cross-cutting Phase 2 notes: brand typography (D11: a serif display may come back for P-style headings), a brand colour scheme for the promo band, real imagery replacing every placeholder, and minified assets.
