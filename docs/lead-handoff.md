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
