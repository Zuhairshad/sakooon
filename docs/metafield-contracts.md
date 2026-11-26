# Metafield and metaobject contracts

Owner: Fable, co-authored with shad-8b. Draft v0.1 (2026-11-26). Final field list is confirmed after
docs/reference/fabric-model.md lands. Nothing here is created in the store yet; Shopify Admin setup is
documented at the end and requires the user's authorization.

Rules
- Every field is optional unless marked required. Templates hide any blank field, its label and its wrapper.
- No duplication: product-level fields hold product-specific facts; fabric-level facts live on the Fabric metaobject.
- Never render fabricated values. If a field is blank, the row does not appear; no "N/A" defaults.
- Namespace for all custom definitions: `sakooon`.
- Access: `product.metafields.sakooon.<key>`; metaobject references via `.value` (single) or `.value` list.

## Metaobject: Fabric (`type: fabric`)
Definition handle `fabric`; storefront access enabled, with web pages enabled (template `metaobject/fabric.json`, owner shad-8b).

| key | type | notes |
| --- | --- | --- |
| name (display name) | single_line_text | required |
| handle | (system) | URL `/metaobjects/fabric/<handle>` or via page template |
| tagline | single_line_text | short descriptor |
| description | rich_text | editorial description |
| composition | single_line_text | e.g. "100% long-staple cotton" (verified only) |
| weave | single_line_text | percale, sateen, twill, waffle, terry |
| thread_count | number_integer | only when verified |
| gsm | number_integer | towels/duvets; only when verified |
| texture | single_line_text | |
| feel | single_line_text | crisp, silky, soft, airy |
| softness | rating (1-5) | |
| breathability | rating (1-5) | |
| warmth | rating (1-5) | 1 = cool sleeper, 5 = warm |
| durability | rating (1-5) | |
| best_for | list.single_line_text | e.g. "Hot sleepers" |
| care | rich_text | fabric-specific care |
| care_guide | page_reference | link to the relevant care guide page |
| texture_image | file_reference (image) | close-up |
| lifestyle_image | file_reference (image) | |
| gallery | list.file_reference | |
| collection | collection_reference | shop this fabric |
| related_products | list.product_reference | |
| certifications | list.single_line_text | verified certifications only; blank hides the row |
| origin | single_line_text | country/region of origin, if verified |

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
| care_instructions | rich_text | overrides fabric.care when set |
| drying_instructions | rich_text | |
| size_guide | page_reference | PDP size guide dialog content |
| care_guide | page_reference | PDP link |
| complementary_products | list.product_reference | "Complete the bed" (falls back to Shopify Search & Discovery complementary) |
| origin | single_line_text | |
| certifications | list.single_line_text | verified only |
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

## Metaobject: Care guide (`type: care_guide`) (proposed, 8b to confirm vs. page-based approach)
Fields: name, product_type (bedsheets/pillows/comforters/towels), washing (rich_text), drying (rich_text), storage (rich_text),
longevity (rich_text), icons (list.single_line_text from fixed set), related_fabrics, related_collection.

## Shopify Admin configuration required (Phase 2/3, with authorization)
1. Settings > Custom data > Metaobjects: create `Fabric` and (optionally) `Care guide` with the fields above; enable Storefront access and web pages for Fabric.
2. Settings > Custom data > Products / Collections / Pages: create the `sakooon.*` definitions above, storefront access on.
3. Install Shopify Search & Discovery for filters, complementary and related products.
4. Navigation: menus `main-menu`, `footer`, `footer-support`, `footer-shop`, `footer-guides`, `legal` (names configurable in theme settings).
5. Create pages with the templates: page.fabric-guide, page.care-guide, page.size-guide, page.faq, page.about, page.contact, page.shipping, page.returns, page.measurement-guide.
