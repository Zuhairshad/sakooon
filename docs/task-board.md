# Task board

Legend: [ ] todo, [~] in progress, [x] done, [!] blocked. Owner in brackets. Updated by Fable at boundaries.

## Phase 0: setup
- [x] Identify repo, store, tooling; create branches and worktrees (Fable)
- [x] Dispatch worker roles and reference investigation (Fable)
- [x] Reference investigation: storefront (shad-2d) d79ecb9; Parachute open-panel/mobile states pending IP cooldown
- [x] Reference investigation: commerce (shad-d8) 9919ffc; lower viewports/state captures still running (429 throttling)
- [x] Reference investigation: editorial (shad-8b) 4342cca; Parachute pages still capturing
- [x] Foundation: docs, settings, layout, tokens, global.js, snippets, customer templates (Fable) 60f1346
- [x] QA scripts: capture-references, capture-theme, compare-screenshots, test-responsive, test-interactions (Fable)
- [x] Preview server adapted to new theme (Fable) 7822650
- [ ] `shopify theme dev` login for juj1hc-qf.myshopify.com: deferred by the user on 2026-11-26; LiquidJS preview (tools/preview) is the Phase 1 dev target. Real-store checks (variants with colour, facets, cart totals, checkout handoff) move to the integration pass once the CLI is connected.

## Phase 1: implementation
- [x] CONTRACTS READY sent 2026-11-26; workers rebase onto sakooon/foundation after finishing investigation
- [~] Header, announcement, mega menu, mobile nav, sticky (shad-2d)
- [ ] Footer (shad-2d)
- [ ] Homepage sections + index.json (shad-2d)
- [x] Product card, price, swatches (shad-d8) 4ca6ac1 + 66a70a2, reviewed
- [ ] Collection template + facets + sort + mobile filter drawer (shad-d8)
- [ ] Product template: gallery, variant picker, buy buttons, sticky bar, accordions (shad-d8)
- [~] Cart drawer + search drawer (shad-d8, milestone b); cart page later
- [ ] Search drawer + results (shad-d8)
- [~] Editorial section library (shad-8b, milestone a)
- [ ] Fabric metaobject template + fabric guide + compare (shad-8b)
- [ ] Care guides (shad-8b)
- [ ] Brand pages, journal (shad-8b)
- [ ] Size guide, measurement guide, FAQ, shipping, returns, contact (shad-8b)
- [ ] Integration merges + theme check (Fable, continuous)
- [ ] Visual comparison passes per template (Fable + owner)
- [ ] Functional tests, a11y, Lighthouse (Fable)
- [ ] Final deliverables report (Fable)

## Open decisions
- Typography: resolved by D11 (one grotesk, 14px/300 defaults); serif display revisited in Phase 2 branding.
