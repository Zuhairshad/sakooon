# Visual QA workflow

Shared output: /Users/shad/sakooon-qa (not in git).
- references/<site>/<page>/<viewport>-full.png and states/<state>-<viewport>.png (captured by workers and scripts/capture-references.mjs)
- theme/<template>/<viewport>-full.png and states/ (scripts/capture-theme.mjs against the preview or `shopify theme dev` URL)
- diff/<pair>/<viewport>.png (scripts/compare-screenshots.mjs: pixelmatch diff + side-by-side + geometry JSON)

Viewports: 1920x1080, 1440x900, 1280x800, 1024x768, 768x1024, 390x844, 375x812. deviceScaleFactor 1.

Procedure per template
1. Capture reference and theme at all viewports (full page + interaction states).
2. Run compare: pixel diff is informational (content differs by design); the geometry report is the pass criterion:
   header height, section top offsets, content width, grid columns/gaps, image aspect ratios, type sizes within tolerance (2px / 1 column).
3. Record findings in docs/visual-qa-log.md (template, viewport, issue, fix commit).
4. Fix, re-run, repeat until geometry passes and a human-eye review says the rhythm matches.

Rules: never crop, mask, or edit screenshots; never hide broken components; intentional differences (placeholder imagery,
brand names, promo content) are ignored by judgment, documented in the log, not by altering captures.

Interaction tests (scripts/test-interactions.mjs): desktop mega menu open/close, mobile drawer + nested level, sticky header,
variant change updates price/media/URL, add to cart opens drawer and updates count, quantity change, remove, predictive search,
filter apply/clear, accordion toggles, size guide dialog, keyboard: Tab order, Escape closes, focus returns.
Responsive test (scripts/test-responsive.mjs): no horizontal overflow (document.scrollWidth <= innerWidth) at every viewport,
no console errors, all images have alt, exactly one h1.
