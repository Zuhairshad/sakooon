# Fabric model: draft

Status: **draft proposal** from the editorial workstream, written to feed `docs/metafield-contracts.md`, which shad-61 and editorial own together. The namespace (`sakooon`), the type names and the field keys are proposals until that contract is signed off.

## Principle

Each fabric is defined **once**, as a `fabric` metaobject entry. Products, variants, collections, the fabric guide, fabric detail pages, the comparison table and care guides all reference that entry. They do not copy its text. Fixing the description of "Percale" in one place updates every surface that shows it.

```
                 ┌──────────────┐  care_guide   ┌──────────────┐
product ───────▶ │    fabric    │ ────────────▶ │  care page   │ (page.care-guide template)
variant ───────▶ │ (metaobject) │ page_reference│              │
collection ────▶ │              │ certifications└──────────────┘
fabric guide ──▶ │              │ ────────────▶  certification (metaobject, gated)
                 └──────────────┘
                        │ renderable → /pages/fabric/<handle>  (templates/metaobject/fabric.json)
```

## Metaobject `fabric`

Definition settings:
- Access: storefront `PUBLIC_READ`.
- Capabilities: `publishable`, so draft fabrics stay hidden. Also `renderable` (Online Store, web pages on), so each fabric gets its own URL at **`/pages/fabric/<handle>`** (Shopify's metaobject web-page URL pattern, `/pages/<type>/<handle>`) rendered by `templates/metaobject/fabric.json`. The SEO title maps to `name` and the SEO description to `summary`.
- Display name field: `name`.

Every field is **optional except `name`**. Sections must render cleanly when any optional field is blank: hide the row, the rating bar or the image, and never show placeholder text in the live theme.

| Key | Shopify type | Validation / notes | Used by |
|---|---|---|---|
| `name` | single_line_text_field | **Required.** For example "Percale" | everywhere |
| `tagline` | single_line_text_field | max 80 chars, one line under the name | guide cards, detail hero |
| `summary` | multi_line_text_field | max 280 chars, plain text | guide cards, comparison table, PDP fabric block, SEO description |
| `description` | rich_text_field | long-form story | fabric detail page |
| `composition` | single_line_text_field | for example "100% cotton". Free text, because blends exist | PDP specs, comparison table |
| `fibre` | single_line_text_field | choices list: cotton, linen, cotton-linen, lyocell, wool, other | filters, comparison |
| `weave` | single_line_text_field | choices list: percale, sateen, plain, twill, jersey, flannel, terry, waffle, other | comparison, detail |
| `finish` | single_line_text_field | for example "stonewashed", "peached", "garment-washed" | detail, PDP |
| `thread_count` | number_integer | min 1. Only meaningful for woven cotton, so leave it blank for linen and terry | comparison, PDP specs |
| `gsm` | number_integer | grams per m², min 1 | comparison, PDP specs |
| `yarn` | single_line_text_field | for example "long-staple combed cotton" | detail |
| `origin` | single_line_text_field | where it is woven or made. Only enter it when the supply chain is documented | detail "made" row |
| `feel` | single_line_text_field | for example "crisp, cool, matte" | cards, comparison |
| `softness` | rating | scale 1–5 | rating bars, comparison |
| `breathability` | rating | scale 1–5 | rating bars, comparison |
| `durability` | rating | scale 1–5 | rating bars, comparison |
| `warmth` | rating | scale 1–5, where 1 sleeps cool and 5 sleeps warm. It is stored as a rating, but it is a **position, not a quality score**, so `fabric-rating` renders it as a cool↔warm scale rather than as filled bars | rating bars, comparison |
| `best_for` | list.single_line_text_field | for example "hot sleepers", "year-round" | cards, detail |
| `seasons` | list.single_line_text_field | choices list: all-season, warm-weather, cold-weather | filters, detail |
| `care` | rich_text_field | care that applies only to this fabric. `product.sakooon.care_instructions` overrides it on a PDP | detail "Care" block, PDP care tab |
| `care_guide` | page_reference | the care guide **page** for this fabric family (Phase 1 decision: care guides are pages built from the `care-guide` section, not a metaobject) | detail "Care" link, PDP link |
| `texture` | single_line_text_field | for example "smooth", "slubby", "looped" | comparison |
| `care_symbols` | list.single_line_text_field | choices list: wash-30, wash-40, wash-60, hand-wash, no-bleach, tumble-low, tumble-none, line-dry, iron-low, iron-medium, iron-high, no-iron, dry-clean, no-dry-clean. These keys map to **our own** SVG icon set in a snippet | care rows |
| `lifestyle_image` | file_reference (image) | lifestyle or hero image, recommended 4:5 | guide cards, detail hero |
| `texture_image` | file_reference (image) | macro close-up of the weave, recommended 1:1 | detail, comparison header, PDP fabric block |
| `gallery` | list.file_reference (image) | extra imagery | detail |
| `swatch_color` | color | fallback swatch when there is no texture image | comparison, chips |
| `related_products` | list.product_reference | curated, max about 8. When blank, fall back to products whose `sakooon.fabric` equals this entry, via the collection below | detail "Shop percale" rail |
| `collection` | collection_reference | the shop-this-fabric collection | detail CTA, guide cards |
| `sort_order` | number_integer | ordering in the guide and the comparison table, ascending | guide, comparison |
| `certifications` | list.metaobject_reference → `certification` | **gated**, see below. This replaces the free-text `list.single_line_text` in contract v0.1 | detail, PDP |

### Metaobject `care_guide`: **deferred** (not in Phase 1)

Decision (editorial, 2026-11-26): care guides are **pages** (`page.care-guide.json`, plus per-type pages built with the `care-guide` section and its blocks), referenced through `page_reference` from the fabric (`care_guide`) and the product (`sakooon.care_guide`). Pages give each guide a URL, editor-composable sections and SEO without another metaobject. The structure below is kept for a possible Phase 3 migration if care content has to be shared between pages.

All optional except `title`. One `care_guide` can serve several fabrics. For example "Cotton bedding care" can serve both percale and sateen.

| Key | Type | Notes |
|---|---|---|
| `title` | single_line_text_field | **Required.** |
| `intro` | multi_line_text_field | |
| `washing` | rich_text_field | |
| `drying` | rich_text_field | |
| `ironing` | rich_text_field | |
| `storage` | rich_text_field | |
| `longevity` | rich_text_field | tips for making it last |
| `stain_care` | rich_text_field | |
| `symbols` | list.single_line_text_field | same choices as `fabric.care_symbols` |
| `image` | file_reference | |
| `product_type` | single_line_text_field | choices list: bedsheets, duvet-covers, pillows, comforters, towels, blankets, other. Drives the care pages for each product type |


### Metaobject `certification`: gated, so it never implies claims

Sakooon must never imply certifications it does not hold. Sections only render a certification when **all** of these are present: `name`, `issuer`, `licence_number`, `certificate_url`. When any of them is missing, nothing renders. There is no free-text "certified" field anywhere in the model. Placeholder content in Phase 1 contains **no** certification entries.

| Key | Type | Notes |
|---|---|---|
| `name` | single_line_text_field | **Required.** |
| `issuer` | single_line_text_field | **Required for render.** |
| `licence_number` | single_line_text_field | **Required for render.** |
| `certificate_url` | url | **Required for render.** Link to the public verification page |
| `scope` | single_line_text_field | what exactly the certificate covers (for example "fabric only") |
| `valid_until` | date | when it is past this date, do not render |
| `logo` | file_reference | only with written permission from the issuer |

## References from resources (proposed metafields)

| Owner | Key | Type | Required? | Purpose |
|---|---|---|---|---|
| product | `sakooon.fabric` | metaobject_reference → fabric | optional | primary fabric. Drives the PDP fabric block, care tab, specs and "about this fabric" link |
| product | `sakooon.secondary_fabrics` | list.metaobject_reference → fabric | optional | sets or bundles that mix fabrics |
| variant | `sakooon.fabric` | metaobject_reference → fabric | optional | when fabric is a product **option** (for example a Percale or Sateen variant), the variant value overrides the product value. Resolution order: `variant → product` |
| product | `sakooon.care_guide` | page_reference | optional | overrides `fabric.care_guide` (for example a pillow whose care differs from its fabric) |
| collection | `sakooon.fabric` | metaobject_reference → fabric | optional | fabric collections show the fabric story, ratings and texture image in the collection header |
| page | `sakooon.related_fabrics` | list.metaobject_reference → fabric | optional | which fabrics a guide or comparison page shows, in order. When blank, show all published fabrics sorted by `sort_order` (Liquid: `shop.metaobjects.fabric.values`) |

Theme-side resolution (an inline pattern: a snippet can't return a value, because `render` scopes are isolated):
`fabric = variant.metafields.sakooon.fabric.value | default: product.metafields.sakooon.fabric.value`
`care_text = product.metafields.sakooon.care_instructions | default: fabric.care` · `care_page = product.metafields.sakooon.care_guide.value | default: fabric.care_guide.value`

## Legacy keys in the old Nocturne theme (migration note)

The `sn-*` theme reads `product.metafields.custom.thread_count`, `custom.subtitle`, `custom.spec_chips` and `specs.line_*`. `thread_count` moves to `fabric.thread_count`. `spec_chips` and `specs.line_*` should be generated from fabric fields instead of hand-typed. `subtitle` stays a product-level field and is commerce-owned, so shad-d8 decides.

## Open questions for shad-61 / shad-d8

1. Namespace: `sakooon` (confirmed in contract v0.1).
2. Should a towel fabric (terry, waffle) use the same `fabric` type? I propose **yes**. The type covers it, and the guide filters by `fibre`/`weave`/`product_type`.
3. Comparison table columns are fixed in the theme (composition, weave, thread count, weight, feel, the four ratings). Should we let merchants choose columns per section instead? I propose fixed columns with a toggle per column.
