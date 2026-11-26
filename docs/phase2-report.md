# Phase 2 report: Sakooon identity (draft, auto mode)

Status date: 2026-11-26. Deliverable branch: `sakooon/integration` (head in git log). Nothing has been uploaded to the Shopify store; the live theme is untouched.
Phase 2 ran autonomously while the user was away; every decision that needs the user is listed in §7 and in `docs/reference/phase2-inputs.md` §"Still needed".

## 1. What changed since Phase 1
| Area | Owner | Delivered |
| --- | --- | --- |
| Brand foundation | Fable | Palette from the logo (D17): Sakooon green #204830, warm neutrals, five schemes (paper, white, sand, sage, ink). Logo artwork cut from the PNG (wordmark, mark, stacked, light twins), favicon set, `brand-logo` snippet with merchant-upload override. Fonts unchanged (Inter, D16). |
| SEO | Fable | og:image falls back to the stacked logo; Organization JSON-LD gets contactPoint when the store has email/phone; theme-color follows the paper scheme. |
| Image pipeline | Fable | `image` snippet: `crop` + `aspect` produce cropped srcsets (banners stop downloading full portrait packshots); duplicate candidate removed. commerce.css/editorial.css load non-blocking outside their templates. |
| Preview | Fable | Fixture pages with template routing, per-variant metafields, cover-crop resizing, one font request per family. |
| Storefront | shad-2d | Header/footer on the brand logo (dark + light for the transparent hero state), contact/social blocks that render only when filled, menus limited to the five real collections + Guides + About, homepage on the real bedroom photograph with sukoon promo band, featured bed sheets, categories, highlights, fabric discovery on the fabric metaobjects, claim-free brand values, newsletter, service strip. Mega-menu promo images deferred until the panel opens. Cart link accessible name includes the count. |
| Commerce | shad-d8 | Preview catalogue = the five live products only, with metafield overlays (fabric, size guide, package contents from the descriptions, swatch colours per variant, description-backed complementary products). Collections adapt to 1–3 products (facets hide when they cannot change results). PDP splits the real descriptions into accordion rows by heading; pills for size/pack; honest sold-out state with price; collection banner copy with sources. (M4 price format sweep and M5 swatches: see §6.) |
| Editorial | shad-8b | Four fabric metaobjects with only description-backed fields (no thread count, GSM, origin or certification claims). Care guide labelled general guidance; size guide prints product sizes verbatim and separates a "common mattress sizes" comparison table. FAQ (7 answered from product copy, 10 pending), shipping and returns pages with every policy answer pending, contact with email flagged for confirmation and WhatsApp only when a link is set. About page (292 words, no year, city or numbers). Two journal articles. `docs/reference/editorial-content-sources.md` maps every factual sentence to its source. |

## 2. Decisions recorded
D17 palette from the logo; D18 live sakooon.com copy is not a fact source; D19 prices via `money_without_trailing_zeros`. See `docs/decisions.md`.

## 3. Facts policy, applied
Only `docs/reference/phase2-inputs.md` §Verified feeds the storefront: the five products' own titles, descriptions, options, prices and images, the five live collections, the logo, and the brand email (flagged). Everything else renders conditionally and is empty today: phone, WhatsApp, address, social links, policies, certifications, thread counts, ratings, customer counts.

## 4. Quality gates on the integrated head
(filled in from the final run; see docs/visual-qa-log.md for every intermediate check)
- Theme Check: 135 files, no offenses.
- test-interactions: 9/9.
- test-responsive: see log.
- test-a11y (axe, WCAG 2.1 AA + best practice, drawers open): see log.
- Lighthouse mobile (preview; a11y/BP/SEO 100 everywhere): home 76–87 across runs, PDP 75, fabric guide 78–85, care 85, size 90, FAQ 84–93, about 86, contact 95, journal 88, article 90. The preview is a floor: fonts come from a Google CSS request here but from Shopify's CDN on the store, and assets are unminified here. LCP render delay (not image bytes) is the remaining cost; next lever is inlining critical CSS, to be judged on the development theme.

## 5. Screenshots
/Users/shad/sakooon-qa/theme/p2-{home,product,soldout,collection,about,fabric,faq,journal}/{1440,390}-full.png; storefront's own set under /Users/shad/sakooon-qa/theme/phase2/.

## 6. Open work (in flight at the time of writing)
- shad-d8 M4: price format sweep (D19), long titles in cart/search, deferred search-drawer idle images. M5: swatches (option swatch -> sakooon.swatch_color -> variant image -> text).
- Lead: final QA run, this report's numbers, Phase 2 handoff notes.

## 7. Needs the user (nothing proceeds on guesses)
1. Palette sign-off, or hex values of your own (D17 is a proposal; `config/settings_data.json` is the only place to change).
2. Policies: delivery fees/zones/times, COD, payment methods, exchange/return window and conditions. 17 FAQ/shipping/returns answers are listed in `docs/reference/editorial-admin.md` §8.
3. Contact channels: WhatsApp number, phone, hours, city, social handles; confirm hello@sakooon.com.
4. Product data conflicts found in your own descriptions: duvet insert Single "60 x 90 in (152 x 240 cm)" (90 in ≈ 229 cm); pillow "20 x 30 in (48 x 76 cm)" (20 in ≈ 51 cm); pillow product sells "Pack of 1" while its copy says a pack holds two; both pillow variants are sold out.
5. Fabric facts and certifications (issuer, licence number, certificate URL) if you want any shown.
6. Photography: one lifestyle image exists; campaign tiles and the mobile hero crop want at least one more.
7. "Designed in Pakistan" on the homepage: confirm or remove.
8. Swatch hex values were eyedropped from packshots (`docs/metafield-contracts.md` §Admin values): confirm or replace.
9. Store money format: switch to `Rs. {{amount_no_decimals}}` in Shopify settings when convenient (theme already renders without trailing zeros).
10. Shopify CLI login for a development theme (`shopify theme dev --store juj1hc-qf.myshopify.com`); never a publish.
