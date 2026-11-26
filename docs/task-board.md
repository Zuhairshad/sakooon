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
- [x] Homepage sections + index.json (shad-2d) 087ac7e + presets f1566cd + mobile sheet menu 2cd7e67 + storefront-admin.md 6800d75, merged to integration
- [x] Product card, price, swatches (shad-d8) 4ca6ac1 + 66a70a2, reviewed
- [x] Collection template + facets + sort + mobile filter drawer (shad-d8) 16f57cf 80abd92, merged to integration
- [x] Product template: gallery, variant picker, buy buttons, sticky bar, accordions, recommendations (shad-d8) b2f85dd, merged to integration
- [x] Cart drawer + search drawer (shad-d8) 06b8930 c3e93ee, merged to integration
- [x] Cart page + search results template (shad-d8) 8e1fffe, merged
- [x] Editorial section library + page templates (shad-8b) 2519044, merged to integration
- [x] Fabric metaobject template + fabric guide + compare (shad-8b) 993bc36, merged to integration
- [x] Care guides (shad-8b) fa01a08, merged to integration
- [x] Brand pages (editorial library) and journal (main-blog, main-article, article-card) ccedb41, merged to integration
- [x] Size guide, measurement guide (shad-8b) ccedb41; FAQ, shipping, returns, contact 2519044; merged to integration
- [x] Integration merges + theme check (Fable): all branches merged into sakooon/integration; theme check no offenses (135 files)
- [x] Visual comparison passes per template (Fable + owner): all templates logged in docs/visual-qa-log.md; editorial-visual-pass.md; storefront-review.md
- [x] Functional tests, a11y, Lighthouse (Fable): interactions 9/9, responsive 91/91, axe 0 violations, Lighthouse a11y/BP/SEO 100 on 10 templates, mobile perf 77-95; final 7-viewport captures done
- [x] Final deliverables report (Fable): docs/phase1-report.md

## Open decisions
- Typography: resolved by D11 (one grotesk, 14px/300 defaults); serif display revisited in Phase 2 branding.

## Closing docs
- [x] docs/reference/storefront-admin.md + storefront-review.md (shad-2d) 6800d75, 1b741bf, merged
- [x] docs/reference/commerce-admin.md (shad-d8) a279857
- [x] docs/reference/editorial-admin.md + editorial-visual-pass.md (shad-8b) cfbd180
- [x] docs/phase1-report.md final (Fable)

## Phase 1 gate
- [x] USER APPROVAL of the reference-based implementation: approved 2026-11-26; typography stays grotesk (D16)
- [ ] Shopify CLI login and development-theme verification pass (checklists in docs/reference/*-admin.md)

## Phase 2: Sakooon identity (starts after session compaction)
- [x] Phase 2 brief + inputs inventory (Fable): docs/phase2-brief.md, docs/reference/phase2-inputs.md, D17/D18 (2f06acf)
- [x] Brand palette + colour schemes (paper/white/sand/sage/ink from logo green #204830), logo artwork + favicon + brand-logo snippet, fonts unchanged (Fable, fd7bada)
- [x] SEO foundations: og:image fallback to the stacked logo, Organization contactPoint (Fable)
- [ ] Workers briefed 2026-11-26 (shad-2d storefront, shad-d8 commerce, shad-8b editorial); awaiting first milestones
- [ ] Real catalogue data in the preview snapshot; product content + metafields plan (shad-d8)
- [ ] Homepage with real photography and campaign copy (shad-2d)
- [ ] Fabric metaobjects, care/size/FAQ/shipping/returns copy from verified Sakooon information (shad-8b)
- [ ] Pakistani customer positioning, conversion strategy, SEO content (all; Fable coordinates)
- [ ] CLI login + development theme push for real-store verification (user + Fable)
