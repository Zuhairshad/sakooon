# Editorial handoff (shad-8b)

Status: Phase 1 is approved, and all editorial work is merged into `sakooon/integration`. Wait for shad-61's Phase 2 brief before editing any theme file.

## Where things are
- Worktree `/Users/shad/sakooon-wt/editorial`, branch `sakooon/editorial`. The head is the commit that adds this file; the last code commit is `c3e8567`.
- Git rules: always `git -c core.hooksPath=/dev/null …`. **No rebase, no force-push.** Pick up changes with `git merge origin/sakooon/foundation` (or `origin/sakooon/integration` for other workers' files) and push plain fast-forward. Never bare `git stash`. Commit as the user, with no Co-Authored-By.
- Never touch `/Users/shad/sakooon` (the Next.js app; read-only fixtures source) or `/Users/shad/sakooon-theme`.

## Run and test
- Preview: `PORT=9303 npm run preview` → http://localhost:9303. Stop it only by port: `lsof -ti tcp:9303 | xargs kill` (decision D13).
- Editorial pages come from `tools/preview/fixtures/pages.json`; any other template renders via `?view=<suffix>`. Fabric pages are at `/pages/fabric/{cotton-satin,quilted-cotton,microfibre-fill,cotton-microfibre}`, the journal at `/blogs/journal`.
- Checks, run before every commit:
  - `npm run check` (theme check, 0 offenses expected)
  - `node scripts/test-responsive.mjs --base http://localhost:9303 --paths …`
  - `node scripts/test-a11y.mjs --base http://localhost:9303 --paths … --viewports 1440,390` (axe)
  - `node scripts/ref/editorial-a11y.mjs` (headings, labels, focus, reduced motion)
  - `node scripts/lighthouse.mjs --base http://localhost:9303 --paths … --only mobile`
  - Visual numbers against the references: `node scripts/ref/editorial-compare.mjs`. Screenshots: `node scripts/ref/editorial-shot.mjs <path> [--vw 1440,390]`
- Reference captures (read-only): `/Users/shad/sakooon-qa/references/{tekla,parachute}/`. Parachute rate-limits this IP: run one browser at a time, at least 20s between loads.

## Files I own (docs/file-ownership.md)
- Sections:
  - editorial-hero, editorial-text, editorial-image-text, editorial-gallery, editorial-quote, editorial-stats, editorial-timeline
  - guide-anchor-nav, faq, info-columns, contact-form, main-page
  - fabric-guide, fabric-compare, fabric-detail, main-metaobject-fabric, related-products-editorial
  - care-guide, size-guide, measurement-guide, main-blog, main-article
- Snippets: accordion, fabric-rating, care-icons, fabric-card, fabric-handles, article-card.
- Assets: editorial.css, editorial.js (custom elements: guide-anchor-nav, fabric-guide, size-guide, blog-load-more).
- Templates: page.json, page.{about,faq,contact,shipping,returns,fabric-guide,care-guide,care-bedsheets,care-pillows,care-comforters,care-towels,size-guide,measurement-guide}.json, blog.json, article.json, metaobject/fabric.json.
- Locales: the top-level `editorial.*` key in en.default.json (insert it as a text block; don't re-serialise the file) and `sections.<mine>` plus `sections.editorial` in the schema locale.
- Docs: docs/reference/{editorial.md, editorial-visual-pass.md, editorial-admin.md, fabric-model.md, editorial-handoff.md}. Scripts: scripts/ref/editorial-*.mjs.

## Open items (Phase 2 candidates, not started)
1. Replace all onboarding copy and example size tables with verified Sakooon content. That covers care, size, FAQ, shipping, returns and the brand story.
2. Fabric metaobject entries with verified data only: composition, thread count and GSM. A certification renders only with issuer, licence number, verification URL and a date that is not past.
3. Admin setup per docs/reference/editorial-admin.md. This needs the user's authorisation; nothing has been done in the store.
4. Phase 2 content is in place (see editorial-content-sources.md); /pages/fabric-guide mobile perf is 83, limited by render-blocking CSS/fonts and header mega-menu images.

## Three things a fresh context must know
1. **Contracts.** These are fixed: docs/metafield-contracts.md v0.2, docs/component-contracts.md and docs/design-system.md, all owned by shad-61. A change to any of them goes to shad-61 as a message. Fabric URLs come only from `fabric.system.url`. Fabric resolution is the inline pattern variant → product (a `render` can't return a value). shad-d8 lifts `<size-guide data-size-guide>` (ids = product type handles, plus `#mattress-measuring`) into the PDP dialog, so keep that markup self-contained.
2. **Liquid and preview traps already hit:**
   - Never `default:` a translation key and then `| t` it; assign first.
   - Filters inside `render` arguments are not interpolated; build strings first.
   - The preview's `divided_by` returns floats, so add `| ceil` for pixel values.
   - The preview has no named date formats; use strftime.
   - Custom elements need `display: block`.
   - Sticky elements need the Shopify section wrapper to be the sticky box.
   - Item headings drop to h2 when the section has no heading.
3. **Design decisions:**
   - Tekla is the typography and rhythm reference: 24/36 titles map to the `h3` token; the 1168px wide container is `.ed-wide`; 4:5 imagery; instant accordions.
   - Parachute supplies the FAQ sidebar and the fabric "panels" layout.
   - No serif and no uppercase labels (D4). Body weight 400 (D15).
   - No unverified claims anywhere.
