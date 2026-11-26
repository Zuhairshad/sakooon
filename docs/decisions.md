# Decisions log

Format: date, decision, why, consequences. Newest last.

## 2026-11-26 D1: Clean foundation, not an extension of the Nocturne theme
The live theme ("Sakooon Nocturne", sn-* files) is a dark, animation-heavy design with a WebGL
"silk" shader, a preloader and JS-gated content. The target is the opposite (light, editorial,
minimal JS). Its structure (section list, customer templates, facets, cart drawer) is ordinary
Shopify scaffolding that is faster to rebuild in the new design system than to restyle.
Consequence: all sn-* files were removed on sakooon/foundation. Anything worth consulting is in
git history on `theme-code` (e.g. `git show theme-code:sections/sn-main-login.liquid`).

## 2026-11-26 D2: Theme at repo root; dev tooling excluded by .shopifyignore
Keeps Shopify GitHub integration and `shopify theme dev/push` conventions working without `--path`.
docs/, scripts/, tools/, package.json are ignored for uploads.

## 2026-11-26 D3: Section blocks (classic), not theme blocks (blocks/ dir), in Phase 1
Theme blocks add schema complexity across every section and complicate ownership. The blocks/
directory exists (empty, with a README) so we can adopt theme blocks for shared pieces later.

## 2026-11-26 D4: One unified design language: Tekla typography/whitespace, Parachute layouts
Single grotesk sans for everything (Shopify font library, default `inter`), modest display scale,
warm off-white paper, ink text, hairline rules, square corners, generous vertical rhythm.
Parachute supplies the commerce layout geometry (grids, PDP split, cart, mega menu), Tekla the
editorial rhythm, measure and label treatment. Measured values from the reference investigation
override the provisional token values in docs/design-system.md, never the other way around.

## 2026-11-26 D5: Fonts via Shopify font_picker, no self-hosted font files in Phase 1
Shopify library fonts are licensed for storefront use and preload/caching is handled by
`font_face`/`font_url`. Phase 2 may introduce brand fonts as assets once licensed.

## 2026-11-26 D6: Colour via colour schemes (settings `color_scheme_group`)
Sections expose a `color_scheme` setting; the theme defines schemes (paper, sand, ink, white) and
CSS custom properties per scheme. This is the OS 2.0 pattern the editor understands.

## 2026-11-26 D7: JS architecture = small custom elements + one shared `theme` namespace
assets/global.js defines utilities (pubsub, fetchConfig, trapFocus, debounce, section-render
helper, drawer/dialog base element). Feature scripts (product.js, cart.js, search.js, facets.js,
header.js) are loaded per section with `defer` only where the section renders.
Events are documented in docs/component-contracts.md.

## 2026-11-26 D8: Fabric is a metaobject; products reference it
One fabric definition reused by products, collections, and guides. Product-level metafields hold
only product-specific facts (dimensions, package contents). See docs/metafield-contracts.md.

## 2026-11-26 D9: Preview ports per session, one shared QA output dir
Local preview (`npm run preview`, LiquidJS) ports: Fable 9292, shad-2d 9301, shad-d8 9302, shad-8b 9303 (`PORT=9301 npm run preview`).
QA scripts take `--base http://localhost:<port>`. Output always goes to /Users/shad/sakooon-qa (shared, not in git).
`shopify theme dev --store juj1hc-qf.myshopify.com` is the authoritative preview once the user has logged the CLI in;
only Fable runs it (single development theme) and workers test against the preview or ask Fable for a push to it.

## 2026-11-26 D10: Colour = variant option first, sibling products supported
Proposed by shad-d8 from the Parachute investigation. Variant option gives variant media and native filters; the live store
currently sells colours as separate products, so `sakooon.siblings` keeps that working. Colour filtering via `sakooon.color_family`
metaobject references (Search & Discovery). Facets apply via the Section Rendering API with history.pushState, not a full reload.

## 2026-11-26 D11: Typography defaults from measurements; one grotesk stays
Both references set UI/body at 14px and display weight at 300. Defaults changed: body_size 14, heading_weight 300.
Tekla uses one sans family; Parachute adds a light serif display. We keep one grotesk (D4) for Phase 1 since the heading font is a
setting; Phase 2 brand typography decides whether a serif display enters. Tekla's 732px text column and 4:5 imagery are adopted
for editorial templates; Parachute's 12-col/8px-gap geometry for commerce templates (section-level, not global tokens).

## 2026-11-26 D12: Certifications are verified metaobjects only; care guides are pages
From the editorial review: free-text certification fields are removed everywhere; a `certification` metaobject with issuer,
licence number, verification URL and expiry is required for anything to render. Care guides are pages with topic blocks; the
care_guide metaobject is deferred.

## 2026-11-26 D13: Never `pkill -f` the preview; restart by port
`pkill -f tools/preview/server.mjs` matches every session's preview. Restart only your own: `lsof -ti tcp:<your port> | xargs kill`, then start again.

## 2026-11-26 D14: Layout tokens set from the storefront measurements
Defaults: page gutter 24 desktop / 16 mobile, grid gap 16 desktop / 8 mobile, section padding 40->64 (sm 24->40, lg 48->88, xl 64->160).
Parachute: nav left, logo+utilities right, 56px bar + 37px announcement, transparent over the homepage hero; Tekla: 52px bar,
hide-on-scroll-down, 40px rotating announcement. Both exposed as header settings (shad-2d). Image ratios: 3:4 cards (Parachute),
4:5 (Tekla everywhere); card ratio stays a theme setting (default portrait 3:4).

## 2026-11-26 D15: Body weight stays 400 by default; text column 732px
Tekla sets body at 300, Parachute at 400. At 14px a 300 weight loses contrast on lower-density screens, so the default body font stays
regular (`inter_n4`); merchants who want the Tekla feel pick the Light variant in the body font picker (no code change). The editorial
text column is 732px plus gutters (`.page-width--text`), matching Tekla's measured 732/700 columns.

## 2026-11-26 D16: Phase 1 approved by the user; typography stays grotesk; Phase 2 begins
The user approved the reference-based implementation on sakooon/integration (0d8b6c1) and kept the single grotesk typography (D4/D11).
Phase 2 (Sakooon identity) starts after every session compacts its context. Live theme remains untouched; no publishing without explicit authorization.

## 2026-11-26 D17: Brand palette derived from the logo; Nocturne navy/gold dropped
The only brand asset is the green calligraphy logo (dominant pixel #204830). Phase 2 therefore uses one brand green for all interactive and
dark surfaces, warm neutrals for everything else, and adds a `sage` scheme (#E4E9E2) for fabric and promo bands. The `ink` scheme id is kept
(sections reference it) but its values become deep green #163322 / paper. Logo artwork is bundled as transparent PNGs rendered by
`snippets/brand-logo.liquid`, overridable by the Theme settings logo. Proposal pending the user's sign-off; swapping hex values in
`config/settings_data.json` is the only change needed if they prefer different ones.

## 2026-11-26 D18: The live sakooon.com copy is not a source of facts
The live Nocturne theme still carries its demo copy (placeholder phone numbers, three fictional studios, "12,000+ sleepers", "OEKO-TEX dyes",
T200/T250/T300 families and bath ranges that do not exist in the catalogue). Phase 2 content may only state what `docs/reference/phase2-inputs.md`
§Verified contains (store product data, collections, the logo, the brand email). Everything else renders conditionally and stays empty until the user supplies it.

## 2026-11-26 D19: Prices render with `money_without_trailing_zeros`
PKR prices are whole rupees and the store's money format (`Rs.{{amount}}`) carries ".00". All price output in every area uses
`money_without_trailing_zeros` and never `money_with_currency` (it rendered "Rs.6,999.00 PKR" in the subtotal). Still format-driven, so a
store-format change needs no theme change. No currency symbol is ever hardcoded.


## 2026-11-26 D20: Announcement bar rotates automatically with no controls
User decision (direct to shad-2d): no arrows, no pause button. Rotation holds on hover/focus and is off under prefers-reduced-motion; the "Rotate messages" setting can disable it. Known trade-off: WCAG 2.2.2 pause mechanism is partial without a button.

## 2026-11-26 D21: No brand statement directly after the homepage hero
User decision: the Sukoon statement block is removed from the homepage (product first after the hero). The "statement" layout stays in rich-text for the About page. Brand story on the homepage lives only in the Why Sakooon photo + text block.

## 2026-11-26 D22: Serif display headings (supersedes D16 for headings)
User decision after seeing Parachute's serif promo headings: every heading (hero, section titles, product and page titles) uses
Playfair Display (Shopify font library, `playfair_display_n4`, heading weight 400) via the theme heading font setting; body, navigation,
prices, buttons and form text stay Inter. Section-level font pickers (campaign tiles) default to the theme heading font.


## 2026-11-26 D22a: Every heading in the serif
User instruction (to shad-2d): use the heading font for all headings across the site, including small ones (footer column titles, product card titles, drawer titles, accordion questions, article card titles). Small serif headings get a minimum size of 16px (product cards) to 17-18px elsewhere with line-height 1.25-1.3. Body copy, prices, menus, buttons and labels stay Inter.
