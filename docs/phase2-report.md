# Phase 2 report: Sakooon identity (auto mode, pending user review)

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

## 4. Quality gates on the integrated head (37de3d7, closing run)
- Theme Check: 135 files, no offenses.
- test-interactions: 9/9 PASS (mobile nav, sticky header, mega menu, search drawer, cart add + drawer, variant change, facets, accordions, skip link).
- test-responsive: 112/112 PASS (16 templates x 7 viewports: no horizontal overflow, one visible h1, image alt, 24px targets, no console errors).
- test-a11y (axe-core WCAG 2.1 AA + best practice, drawers open): 30/30 PASS, 0 violations.
- Lighthouse mobile on the preview (a11y / best practices / SEO = 100 on every page):

| Page | Perf | LCP |
| --- | --- | --- |
| Home | 79 | 4.9 s |
| Collection bed-sheets | 79 | 5.1 s |
| PDP quilted set | 82 | 4.1 s |
| PDP pillow (sold out) | 87 | 3.7 s |
| Fabric guide | 85 | 4.0 s |
| About | 90 | 3.4 s |
| FAQ | 94 | 2.8 s |
| Journal | 92 | 3.1 s |

The preview is a floor: fonts come from a Google CSS request here but from Shopify's CDN on the store, assets are unminified and uncompressed here, and all four sessions shared the CPU during the run. Image bytes are no longer the LCP cost (deferred drawer/menu images, cropped banners, resized packshots); render delay from the blocking CSS chain is. Next lever, to be judged on the development theme: inline the critical base/header CSS.

## 5. Screenshots
/Users/shad/sakooon-qa/theme/p2-{home,product,soldout,collection,about,fabric,faq,journal}/{1440,390}-full.png; storefront's own set under /Users/shad/sakooon-qa/theme/phase2/.

## 6. Open work
- Homepage lower half redesign requested by the user on return: done (storefront e8e0c43 + 6a7a727, integration 6a7a727): Sukoon statement in deep green under the hero, Why Sakooon as photo + text rows, newsletter band and service strip removed, 1440px text cap, product rails with <= 3 products fill the row as equal columns. Home re-checked: interactions 9/9, responsive 7/7, axe 0.
- Everything else in Phase 2 scope is delivered; workers idle pending the user's answers in §7.

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
