# Metafield and metaobject contracts

Owner: Fable, co-authored with shad-8b. v0.3 (2026-11-26) incorporating docs/reference/fabric-model.md and the editorial review. Nothing here is created in the store yet; Shopify Admin setup is
documented at the end and requires the user's authorization.

Rules
- Every field is optional unless marked required. Templates hide any blank field, its label and its wrapper.
- No duplication: product-level fields hold product-specific facts; fabric-level facts live on the Fabric metaobject.
- Never render fabricated values. If a field is blank, the row does not appear; no "N/A" defaults.
- Namespace for all custom definitions: `sakooon`.
- Access: `product.metafields.sakooon.<key>`; metaobject references via `.value` (single) or `.value` list.

## Metaobject: Fabric (`type: fabric`)
Definition handle `fabric`; capabilities: storefront access, **publishable** (drafts stay hidden), web pages (template `metaobject/fabric.json`, owner shad-8b).
Link to a fabric page only via `fabric.system.url` (Shopify generates `/pages/<definition>/<handle>`-style URLs; never hardcode the pattern).

| key | type | notes |
| --- | --- | --- |
| name (display name) | single_line_text | required |
| handle | (system) | web page URL only via `fabric.system.url` (never hardcode the pattern) |
| tagline | single_line_text | short descriptor |
| summary | multi_line_text (<=280 chars) | cards, compare table, SEO description |
| fibre | single_line_text, choices: cotton, linen, cotton-linen, lyocell, wool, other | |
| finish | single_line_text, choices: stonewashed, peached, garment-washed, none | |
| yarn | single_line_text | |
| description | rich_text | editorial description |
| composition | single_line_text | e.g. "100% long-staple cotton" (verified only) |
| weave | single_line_text, choices: percale, sateen, plain, twill, jersey, flannel, terry, waffle, other | |
| thread_count | number_integer | only when verified |
| gsm | number_integer | towels/duvets; only when verified |
| texture | single_line_text | |
| feel | single_line_text | crisp, silky, soft, airy |
| softness | rating (1-5) | |
| breathability | rating (1-5) | |
| warmth | rating (1-5) | a POSITION on a cool-to-warm scale (1 cool, 5 warm), not a quality score; fabric-rating renders it as cool <-> warm |
| seasons | list.single_line_text, choices: all-season, warm-weather, cold-weather | |
| care_symbols | list.single_line_text, fixed set: wash-30, wash-40, wash-60, hand-wash, no-bleach, tumble-low, tumble-none, line-dry, iron-low, iron-medium, iron-high, no-iron, dry-clean, no-dry-clean | rendered by snippets/care-icons.liquid (owner shad-8b) |
| swatch_color | color | fabric chip in guides/compare |
| sort_order | number_integer | ordering in guides when a page does not list fabrics explicitly |
| durability | rating (1-5) | |
| best_for | list.single_line_text | e.g. "Hot sleepers" |
| care | rich_text | fabric-specific care |
| care_guide | page_reference | link to the relevant care guide page |
| texture_image | file_reference (image) | close-up |
| lifestyle_image | file_reference (image) | |
| gallery | list.file_reference | |
| collection | collection_reference | shop this fabric |
| related_products | list.product_reference | |
| certifications | list.metaobject_reference (certification) | rendered only when issuer, licence_number and certificate_url are present and valid_until is not past |
| origin | single_line_text | country/region of origin, if verified |

## Metaobject: Certification (`type: certification`)
| key | type | notes |
| --- | --- | --- |
| name | single_line_text | required |
| issuer | single_line_text | required for display |
| licence_number | single_line_text | required for display |
| certificate_url | url | required for display (public verification page) |
| scope | single_line_text | what is certified |
| valid_until | date | hidden when past |
| logo | file_reference | |
Free-text certifications are not allowed anywhere in the theme: a claim without issuer, licence number and verification link does not render.

## Variant metafields (namespace `sakooon`)
| key | type | used by |
| --- | --- | --- |
| fabric | metaobject_reference (fabric) | when fabric is a variant option; resolution order variant -> product, inline (render scopes are isolated, so no snippet): `assign fabric = variant.metafields.sakooon.fabric.value` then `if fabric == blank` -> `assign fabric = product.metafields.sakooon.fabric.value` |
| swatch_color | color | chip colour for this variant's colour/design value (product cards, variant picker). Resolution order (shad-d8): native option-value swatch -> variant `sakooon.swatch_color` (+ `swatch_color_secondary`) -> variant image thumbnail -> text chip. No CSS named-colour guessing. Added v0.3, 2026-11-26. |
| swatch_color_secondary | color, optional | second half of a split chip for two-tone/reversible colourways (e.g. "Grey / White"). Only read when `swatch_color` is set. Added v0.3. |

## Product metafields (namespace `sakooon`)
| key | type | used by |
| --- | --- | --- |
| fabric | metaobject_reference (fabric) | PDP composition accordion, card label, fabric guides (reverse lookup via fabric.related_products) |
| composition_override | single_line_text | PDP, only when it differs from the fabric |
| dimensions | rich_text or list.single_line_text | PDP "Dimensions" |
| dimensions_table | json | optional `{ "columns": [], "rows": [[]] }` per size |
| package_contents | list.single_line_text | PDP "What's included" |
| weight | weight | PDP specifications |
| product_weight_gsm | number_integer | duvets/towels |
| benefits | list.single_line_text | PDP highlights |
| care_instructions | rich_text | resolution: product.sakooon.care_instructions -> fabric.care |
| drying_instructions | rich_text | |
| size_guide | page_reference | PDP size guide dialog content |
| care_guide | page_reference | resolution: product.sakooon.care_guide -> fabric.care_guide |
| complementary_products | list.product_reference | "Complete the bed" (falls back to Shopify Search & Discovery complementary) |
| origin | single_line_text | |
| certifications | list.metaobject_reference (certification) | same validity rules as fabric.certifications |
| feel | single_line_text | |
| shipping_note | single_line_text | per product shipping/returns override |
| siblings | list.product_reference | colour siblings when each colour is a separate product (fallback for stores that do not use a Colour option); card and PDP swatches render from `Colour` option values first, then `siblings` |
| swatch_color | color | this product's swatch colour when it is a colour sibling (fallback: `swatch_image`, then first image) |
| swatch_image | file_reference | swatch texture for siblings |
| color_family | list.metaobject_reference (color_family) | colour filtering via Search & Discovery filters on this metafield |

## Metaobject: Colour family (`type: color_family`)
Fields: name (e.g. Blue), handle, swatch (color), sort_order (number_integer). Used only for filtering; swatch colours on cards come from option-value swatches or `sakooon.swatch_color`.

## Colour representation (decision 2026-11-26, D10)
Primary pattern: Colour is a real variant option (Colour x Size) so variant media, native option-value swatches and filtering work out of the box.
Compatibility pattern: colour as separate products linked with `sakooon.siblings` (the live catalogue currently does this). The theme supports both; swatch rendering order: option value `swatch` (color/image) -> named colour from the value handle -> text chip; for siblings: `swatch_color` -> `swatch_image` -> featured image.

Standard product metafields to respect if present: `product.metafields.shopify.*` (category metafields like color-pattern, fabric) may be used by filters.

## Collection metafields (namespace `sakooon`)
| key | type | used by |
| --- | --- | --- |
| banner_image | file_reference | collection banner |
| banner_heading | single_line_text | |
| banner_text | rich_text | |
| fabric | metaobject_reference (fabric) | fabric-led collections |
| guide | page_reference | link to related guide |

## Page metafields (namespace `sakooon`) for guides
| key | type |
| --- | --- |
| hero_image | file_reference |
| eyebrow | single_line_text |
| related_fabrics | list.metaobject_reference (fabric) |
| related_products | list.product_reference |
| related_collection | collection_reference |

## Care guides are pages (decision 2026-11-26)
Care guides use `templates/page.care-guide.json` with a `care-guide` section and topic blocks (washing, drying, storage, longevity),
per product type via settings/blocks. A `care_guide` metaobject is deferred (not needed for Phase 1).
Page metafield `related_fabrics` drives fabric-guide and compare ordering; when blank, sections list all published fabrics by `sort_order`.

## Shopify Admin configuration required (Phase 2/3, with authorization)
1. Settings > Custom data > Metaobjects: create `Fabric` (storefront access, publishable, web pages), `Certification` and `Colour family` with the fields above.
2. Settings > Custom data > Products / Collections / Pages: create the `sakooon.*` definitions above, storefront access on.
3. Install Shopify Search & Discovery for filters, complementary and related products.
4. Navigation: menus `main-menu` (3 levels: item > group heading > links), `footer-shop`, `footer-help`, `footer-company`, `footer-guides`, `legal` (handles configurable in the header/footer section settings; the preview ships the same handles as fixtures).
5. Create pages with the templates: page.fabric-guide, page.care-guide, page.size-guide, page.faq, page.about, page.contact, page.shipping, page.returns, page.measurement-guide.

## Admin values
Values to enter in Shopify Admin for the real catalogue (mirrored in `tools/preview/fixtures/products.json`). Appended by owner; each line says where the value comes from.

### Commerce (shad-d8)
Products, namespace `sakooon` (source: each product's own description in store.json, quoted, not extended):

| Product handle | fabric | size_guide | package_contents | complementary_products |
| --- | --- | --- | --- | --- |
| duvet-comfort-filling-220-gsm | `microfibre-fill` | page `size-guide` | blank (the description has no "What's in" list) | two-tone-duvet-cover-set-king ("cover sold separately") |
| duvet-comfort-pillow-pack-of-2 | `cotton-microfibre` | page `size-guide` | blank: the description says "2 x Pillows" but the product also sells "Pack of 1 Pillow" (parked in phase2-inputs "Still needed") | yarn-dyed and quilted sheet sets ("pair it with the matching pillow covers from our bed sheet sets") |
| yarn-dyed-cotton-satin-bed-sheet-set-king | `cotton-satin` | page `size-guide` | "1 x Bed Sheet – 94 x 96 inches (King)", "2 x Pillow Covers – 19 x 29 inches" | blank (Search & Discovery) |
| two-tone-duvet-cover-set-king | `cotton-satin` | page `size-guide` | "1 x Reversible Duvet Cover – 90 x 100 inches (King)", "1 x Bed Sheet – 94 x 96 inches (King)", "4 x Pillow Covers – 19 x 29 inches (2 in each tone)" | duvet-comfort-filling-220-gsm ("Pair it with our Duvet Comfort Filling") |
| quilted-bed-sheet-set-king | `quilted-cotton` | page `size-guide` | "1 x Quilted Bed Sheet – 96 x 106 inches (King)", "2 x Quilted Pillow Covers – 19 x 29 inches" | blank (Search & Discovery) |

`siblings`, `swatch_image`, `benefits`, `dimensions`, `weight`, `product_weight_gsm`, `origin`, `certifications` stay blank: colour and design are real variant options (D10), and the descriptions already carry sizes and benefits (the PDP splits them into accordions by heading).
Product type must stay as it is in the store (`Duvet`, `Pillow`, `Bed Sheet Set`, `Duvet Cover Set`): the size-guide anchors are `#duvet`, `#pillow`, `#bed-sheet-set`, `#duvet-cover-set`.

Variant `sakooon.swatch_color` (+ `swatch_color_secondary`). Source: median colour sampled from the lit bed area of each variant's packshot, then lifted out of shadow by eye. These are approximations; replace them with the merchant's own values when available. Yarn-dyed "Design" variants get none: their prints render as image chips from the variant image.

| Product | Value | swatch_color | swatch_color_secondary |
| --- | --- | --- | --- |
| quilted-bed-sheet-set-king | Sage Green / Ivory / Dusty Blue / Emerald Green / Slate Grey / Blush Pink | #93a596 / #e9e1d0 / #7f9ab8 / #1f4d38 / #5a5d60 / #c49a8a | |
| quilted-bed-sheet-set-king | Charcoal Grey / Rust / Butter Yellow / Periwinkle Blue / Black | #45433f / #8c4a2a / #d8c07e / #8c9bc0 / #1c1c1e | |
| two-tone-duvet-cover-set-king | Grey / White | #6b6866 | #f2f0ec |
| two-tone-duvet-cover-set-king | Black / White | #161616 | #f2f0ec |
| two-tone-duvet-cover-set-king | Rust / Peach | #7a3419 | #d39066 |
| two-tone-duvet-cover-set-king | Royal Blue / Sky Blue | #1f3d78 | #a9c6e0 |
| two-tone-duvet-cover-set-king | Forest Green / Lime Green | #24392a | #b6c98c |

Collections, `sakooon.banner_text` (or the collection description; claim-free copy, see docs/reference/commerce-admin.md §8).
