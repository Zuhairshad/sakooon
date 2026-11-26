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
- [x] Header, announcement, mega menu, mobile nav, sticky (shad-2d) 073f94c, merged to integration
- [x] Footer (shad-2d) 0c1ca23, merged to integration
- [x] Homepage sections + index.json (shad-2d) 087ac7e + presets f1566cd (hero-split, image-with-text, comparison-highlights, room-collection, brand-values, list-collections), merged to integration
- [x] Product card, price, swatches (shad-d8) 4ca6ac1 + 66a70a2, reviewed
- [x] Collection template + facets + sort + mobile filter drawer (shad-d8) 16f57cf 80abd92, merged to integration
- [x] Product template: gallery, variant picker, buy buttons, sticky bar, accordions, recommendations (shad-d8) b2f85dd, merged to integration
- [x] Cart drawer + search drawer (shad-d8) 06b8930 c3e93ee, merged to integration
- [~] Cart page + search results template (shad-d8, milestone e); search drawer done
- [x] Editorial section library + page templates (shad-8b) 2519044, merged to integration
- [x] Fabric metaobject template + fabric guide + compare (shad-8b) 993bc36, merged to integration
- [x] Care guides (shad-8b) fa01a08, merged to integration
- [x] Brand pages (editorial library) and journal (main-blog, main-article, article-card) ccedb41, merged to integration
- [x] Size guide, measurement guide (shad-8b) ccedb41; FAQ, shipping, returns, contact 2519044; merged to integration
- [~] Integration merges + theme check (Fable, continuous): e515562 commerce+editorial, header merged; 0 errors
- [~] Visual comparison passes per template (Fable + owner): header, footer, collection, fabric, home logged; editorial self-pass assigned; product pending
- [ ] Functional tests, a11y, Lighthouse (Fable)
- [ ] Final deliverables report (Fable)

## Open decisions
- Typography: resolved by D11 (one grotesk, 14px/300 defaults); serif display revisited in Phase 2 branding.
