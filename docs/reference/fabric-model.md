# Fabric model: draft

Status: **draft proposal** from the editorial workstream, written to feed `docs/metafield-contracts.md`, which shad-61 and editorial own together. The namespace (`sakooon`), the type names and the field keys are proposals until that contract is signed off.

## Principle

Each fabric is defined **once**, as a `fabric` metaobject entry. Products, variants, collections, the fabric guide, fabric detail pages, the comparison table and care guides all reference that entry. They do not copy its text. Fixing the description of "Percale" in one place updates every surface that shows it.

```
                 ┌──────────────┐  care_guide   ┌──────────────┐
product ───────▶ │    fabric    │ ────────────▶ │  care_guide  │ ◀── page.care-* templates
variant ───────▶ │ (metaobject) │               │ (metaobject) │
collection ────▶ │              │ certifications└──────────────┘
fabric guide ──▶ │              │ ────────────▶  certification (metaobject, gated)
                 └──────────────┘
                        │ renderable → /pages/fabric/<handle>  (templates/metaobject/fabric.json)
```

## Metaobject `fabric`

Definition settings:
- Access: storefront `PUBLIC_READ`.
- Capabilities: `publishable`, so draft fabrics stay hidden. Also `renderable` (Online Store), so each fabric gets its own URL through `templates/metaobject/fabric.json`. The SEO title maps to `name` and the SEO description to `summary`.
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
| `weight_gsm` | number_integer | grams per m², min 1 | comparison, PDP specs |
| `yarn` | single_line_text_field | for example "long-staple combed cotton" | detail |
| `origin` | single_line_text_field | where it is woven or made. Only enter it when the supply chain is documented | detail "made" row |
| `feel` | single_line_text_field | for example "crisp, cool, matte" | cards, comparison |
| `appearance` | single_line_text_field | for example "matte", "soft sheen" | comparison |
| `rating_softness` | rating | scale 1–5 | rating bars, comparison |
| `rating_breathability` | rating | scale 1–5 | rating bars, comparison |
| `rating_durability` | rating | scale 1–5 | rating bars, comparison |
| `warmth` | number_integer | 1–5 **spectrum**, where 1 sleeps cool and 5 sleeps warm. It is a position, not a quality score, so it renders as a cool↔warm scale rather than as filled stars | rating bars, comparison |
| `best_for` | list.single_line_text_field | for example "hot sleepers", "year-round" | cards, detail |
| `seasons` | list.single_line_text_field | choices list: all-season, warm-weather, cold-weather | filters, detail |
| `care_guide` | metaobject_reference → `care_guide` | the shared washing, drying and storage guide for this fabric family | detail "Care" block, PDP care tab, care pages |
| `care_notes` | rich_text_field | notes that apply only to this fabric and add to the care_guide | detail, PDP care tab |
| `care_symbols` | list.single_line_text_field | choices list: wash-30, wash-40, wash-60, hand-wash, no-bleach, tumble-low, tumble-none, line-dry, iron-low, iron-medium, iron-high, no-iron, dry-clean, no-dry-clean. These keys map to **our own** SVG icon set in a snippet | care rows |
| `image` | file_reference (image) | lifestyle or hero image, recommended 4:5 | guide cards, detail hero |
| `texture_image` | file_reference (image) | macro close-up of the weave, recommended 1:1 | detail, comparison header, PDP fabric block |
| `gallery` | list.file_reference (image) | extra imagery | detail |
| `swatch_color` | color | fallback swatch when there is no texture image | comparison, chips |
| `related_products` | list.product_reference | curated, max about 8. When blank, fall back to products whose `sakooon.fabric` equals this entry, via the collection below | detail "Shop percale" rail |
| `collection` | collection_reference | the shop-this-fabric collection | detail CTA, guide cards |
| `sort_order` | number_integer | ordering in the guide and the comparison table, ascending | guide, comparison |
| `certifications` | list.metaobject_reference → `certification` | **gated**, see below | detail, PDP |

### Metaobject `care_guide` (one per fabric family or product type)

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

The care pages (`page.care-bedsheets`, `page.care-pillows`, …) take their content from `care_guide` entries by `product_type`, or from a page metafield that points to one. They are therefore assembled from the same data the PDP care tab uses.

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
| product | `sakooon.care_guide` | metaobject_reference → care_guide | optional | overrides `fabric.care_guide` (for example a pillow whose care differs from its fabric) |
| collection | `sakooon.fabric` | metaobject_reference → fabric | optional | fabric collections show the fabric story, ratings and texture image in the collection header |
| page | `sakooon.fabrics` | list.metaobject_reference → fabric | optional | which fabrics a guide or comparison page shows, in order. When blank, show all published fabrics sorted by `sort_order` |
| page | `sakooon.care_guide` | metaobject_reference → care_guide | optional | care page content source |

Theme-side resolution (one snippet, `fabric-resolve`, for everyone to use):
`fabric = variant.metafields.sakooon.fabric.value | default: product.metafields.sakooon.fabric.value`
`care = product.metafields.sakooon.care_guide.value | default: fabric.care_guide.value`

## Legacy keys in the old Nocturne theme (migration note)

The `sn-*` theme reads `product.metafields.custom.thread_count`, `custom.subtitle`, `custom.spec_chips` and `specs.line_*`. `thread_count` moves to `fabric.thread_count`. `spec_chips` and `specs.line_*` should be generated from fabric fields instead of hand-typed. `subtitle` stays a product-level field and is commerce-owned, so shad-d8 decides.

## Open questions for shad-61 / shad-d8

1. Namespace: `sakooon` or `custom`? I propose `sakooon`, so the theme's contract keys cannot clash with keys that merchant apps add under `custom`.
2. Should a towel fabric (terry, waffle) use the same `fabric` type? I propose **yes**. The type covers it, and the guide filters by `fibre`/`weave`/`product_type`.
3. Comparison table columns are fixed in the theme (composition, weave, thread count, weight, feel, the four ratings). Should we let merchants choose columns per section instead? I propose fixed columns with a toggle per column.
