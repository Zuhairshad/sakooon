# Lead handoff (Fable) for resuming after context compaction

State 2026-11-26: Phase 1 approved by the user (D16). Integration head 0d8b6c1+ on `sakooon/integration`; foundation on `sakooon/foundation`.
Preview: `cd /Users/shad/sakooon-wt/integration && PORT=9292 npm run preview`. Checks: `npm run check`, `node scripts/test-interactions.mjs --base http://localhost:9292`,
`node scripts/test-responsive.mjs --base ...`, `node scripts/test-a11y.mjs --base ...`, `node scripts/lighthouse.mjs --base ...`.
Workers (cmux sessions): shad-2d storefront, shad-d8 commerce, shad-8b editorial; each wrote docs/reference/<area>-handoff.md. Rule: merge, never rebase.
Restart only your own preview by port (`lsof -ti tcp:9292 | xargs kill`).

## Phase 2 plan (Sakooon identity) to brief after compaction
Inputs already on disk: /Users/shad/Downloads/SAKOOON logo.png; product images /Users/shad/sakooon/public/images; live catalogue juj1hc-qf.myshopify.com
(collections.json public; products.json blocked; data/store.json snapshot of 5 products in /Users/shad/sakooon); Nocturne theme (theme-code) for existing copy/palette hints.
Needed from the user: brand palette (or approve a proposal derived from the logo), final fonts (Shopify library or licensed files), lifestyle photography,
verified fabric specs (composition, thread count/GSM, certifications with issuer + licence + URL), shipping/payment/return policies, positioning notes, CLI login.
Work split: Fable = palette/colour schemes/logo/favicon/fonts/SEO foundations + integration; shad-2d = homepage with real media + campaigns + menus;
shad-d8 = real catalogue in preview snapshot, product content plan, swatches (sakooon.swatch_color), complementary sets, PKR formatting; shad-8b = Fabric metaobject
entries from verified data only, care/size/FAQ/shipping/returns copy, brand story (no unverified claims).
Rules unchanged: no fabricated specs or certifications; nothing pushed to the live theme; development theme only once the CLI is connected.

## Phase 2 status (2026-11-26, auto mode while the user was out)
All three worker sections of docs/phase2-brief.md are delivered and merged into sakooon/integration (storefront 95f8bb1, commerce 01a65ba, editorial b5faf86).
Lead work done: D17 palette + logo artwork + brand-logo snippet, D18, D19, SEO fallbacks, image crop srcsets, non-blocking area CSS, preview pages/variant metafields/crop resizing, docs/phase2-report.md.
Workers are idle awaiting the user's answers (docs/reference/phase2-inputs.md §Still needed, 14 items). Next lead actions when the user returns:
1. Walk the user through docs/phase2-report.md §7; collect palette sign-off, policies, contact channels, product-data corrections, photography.
2. Turn answers into briefs: policies -> shad-8b (FAQ/shipping/returns answers, remove "coming soon"), contact/social -> shad-2d (footer/contact blocks) + settings_data, product corrections -> the user's Shopify Admin (not the theme), swatch hexes -> shad-d8 overlay.
3. CLI login, then `shopify theme push --development` style dev theme (never publish) and re-run Lighthouse on the real store; decide on critical-CSS inlining from those numbers.
