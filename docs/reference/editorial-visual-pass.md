# Editorial visual pass

Owner: shad-8b. Each editorial template is compared with its governing reference capture in `/Users/shad/sakooon-qa/references/` (unchanged) using `scripts/ref/editorial-compare.mjs`. That script measures the theme on the :9303 preview with the same probes used on the references. Placeholder imagery is kept as is.

Legend:
- **Fixed**: changed in the commit shown.
- **By design**: an intentional difference, with the decision named.
- **Foundation**: the difference comes from shared tokens owned by shad-61 and is reported, not changed here.

## Findings

| Template | Viewport | Difference vs reference | Resolution | Commit |
|---|---|---|---|---|
| all editorial page headers (hero, blog, article, fabric, page) | 1440 / 390 | page title 36/45 (h2 token) vs Tekla 24/36 and 20/30 on mobile | Fixed: templates and section defaults now use `h3`, giving 28/35 desktop and 24 mobile | 9c8e0e9 |
| fabric guide, care hub, journal, measurement guide, related products, fabric pages | 1440 | content ran to the 1392px page width; Tekla grids sit in a 1168px container (left edge x=136) | Fixed: `.ed-wide` container at `1168 + 2 × gutter`. Now care hub tiles are 576×720 (Tekla 576×720), fabric cards 379×473 (379×473), journal cards 379×237 (379×237), care hub left edge x=136 (136) | 9c8e0e9 |
| page.faq | 1440 | single column with a top anchor bar; Parachute FAQ uses a sticky 336px "Jump to a section" column beside an 881px question column | Fixed: `faq` layout `sidebar` (336fr / 881fr, sticky, aria-current tracking), used by page.faq. Hero and help aligned to the same container | 827ba06, 9a6dc84 |
| page.fabric-guide | 1440 / 390 | card grid only; the Parachute fabric guide uses framed panels (texture banner with name, chips, statement, two accordions, product rail, "Shop all") | Fixed: `fabric-guide` layout `panels`, used by page.fabric-guide. Banner 43:5 desktop / 21:10 mobile (Parachute 1248×145 / 350×167), info/shop split 5fr / 7fr, product cards about 160px wide (Parachute 160×213) | a2ebaff |
| metaobject/fabric | 1440 | fabric-detail gallery thumbnails about 72px (body in the narrow column when a block had no heading) | Fixed: body always in the content column; gallery full width, 2-up / 3-up, rail on mobile | fa01a08 |
| metaobject/fabric | 1440 | "More fabrics" ran full width (`<fabric-guide>` was inline) | Fixed: `fabric-guide { display: block }`. Cards now 3-up on Tekla's 379px track | 993bc36 |
| metaobject/fabric | 1440 | Tekla care detail is a single 732px column with a 4:5 hero; ours is a split header (imagery and sticky info) | By design (D4: Parachute supplies commerce geometry and the fabric page sells). Tekla's stacked "Care / Quality / Details" rhythm is kept in `fabric-detail` | |
| care type pages | 1440 | Tekla product-care uses 3-up topic cards; our type pages use "heading beside text" rows | By design: rows read better for step-by-step instructions. The `care-guide` "cards" layout reproduces Tekla exactly and is used on the hub | |
| text-column pages (FAQ text width, shipping, returns, size guide, about) | 1440 | text column 672px (`.page-width--text` is 720 including 24px gutters) vs Tekla 732 / 700 | Foundation: suggest `.page-width--text` at `732px + 2 × gutter`. Size guide already matches (672 vs 668) | reported |
| all | 1440 / 390 | body weight 400 vs Tekla 300 (14/21 size matches) | Foundation: the body font setting and weight are global (D11) | reported |
| page.about | 1440 | narrow container 960 (text x=264) vs Tekla 992 (x=224) | By design: within 32px; uses the shared `--narrow` token | |
| page.contact | 1440 | Tekla contact is plain text with no form; ours adds info columns and a form | By design: Sakooon needs a contact form (customer assistance scope) | |
| article | 1440 | featured image 912×513 (16:9, wide) vs Tekla article 4:5 pairs | By design: the article hero is a setting (4:5, 5:4, 16:9, 21:9). Inline 2-up 4:5 imagery is available through `editorial-gallery` | |

## Measured after fixes (1440, ours vs reference)

| Template | Image (w×h) | Title | Body |
|---|---|---|---|
| fabric guide (grid) vs Tekla textile care | 379×473 vs 379×473 | 28/35 vs 24/36 | 14/21 vs 14/20.3 |
| care hub vs Tekla care guide | 576×720 vs 576×720 | 28/35 vs 24/36 | 14/21 vs 14/20.3 |
| journal vs Tekla stories | 379×237 vs 379×237 | 28/35 vs 24/36 | n/a |
| size guide vs Tekla size guide | n/a | 28/35 vs 24/36 | column 672 at x=384 vs 668 at x=386 |

## Checks run with the pass

- `npm run check`: 106 files, no offenses.
- `scripts/test-responsive.mjs` on every editorial template: pass (latest run 21/21 on the fabric guide, FAQ and care hub after the panels change).
- `scripts/test-a11y.mjs` (axe) at 1440 and 390: 0 violations on every editorial template.
- `scripts/ref/editorial-a11y.mjs`: all clear.
- Lighthouse mobile (`scripts/lighthouse.mjs --only mobile`): /pages/fabric/percale performance 89 (LCP 3.5s), accessibility, best practices and SEO all 100. /blogs/journal performance 95, the other three 100.
