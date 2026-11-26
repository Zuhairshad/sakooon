# Commerce: Shopify Admin setup the theme expects

Owner: shad-d8. Covers what the collection, product, cart and search templates read. Field definitions follow
`docs/metafield-contracts.md`, which wins if the two ever disagree. Nothing here has been created in the store. Every step needs
the store owner's go-ahead (Phase 2/3).

Everything is optional: a blank field hides its row, badge or block. Nothing falls back to invented copy.

## 1. Product options and swatches

| Need | Admin | Theme behaviour |
|---|---|---|
| Colour as a real option (decision D10) | Product > Variants: option named **Colour** (or Color) plus Size, e.g. Colour × Bedding size | PDP colour radios, card swatches, colour-filtered gallery, `filter.v.option.colour` |
| Option names treated as colour | Theme settings > Product cards > "Swatch option names" (default `Color, Colour`) | Case-insensitive match |
| Swatch colour or texture | Products > Category "Bedding…" > link the Colour option to the **Color** category metafield, then set each value's swatch (colour or image) | `value.swatch.color` / `value.swatch.image`. Without one, CSS named colours (white, ivory, black, navy, sage…) are used, otherwise a text chip |
| Variant images per colour | Variant > image: assign the first image of each colour's group. Order media so each colour's images follow its variant image | Gallery shows only the selected colour's group plus media before the first variant image (main-product setting "Show only the selected colour's media") |
| Colour as separate products (current live catalogue) | Product metafield `sakooon.siblings` (list of products), plus `sakooon.swatch_color` (color) or `sakooon.swatch_image` (file) on each sibling | Card and PDP swatches link to the sibling products; colour order: swatch_color → swatch_image → featured image |

## 2. Product metafields (namespace `sakooon`) read by commerce

Settings > Custom data > Products. Turn on Storefront access for each.

| Key | Type | Where it shows |
|---|---|---|
| `fabric` | Metaobject reference (fabric) | Composition / Feel / Care accordions, fabric ratings, link to `fabric.system.url`. A variant-level `sakooon.fabric` overrides it |
| `composition_override` | Single line text | Composition row, when it differs from the fabric |
| `dimensions` | Rich text or list of single line text | Dimensions accordion |
| `dimensions_table` | JSON `{ "columns": [...], "rows": [[...]] }` | Table in the Dimensions accordion (first cell of each row is the row header) |
| `package_contents` | List of single line text | Uppercase chips under the buy button, plus the "What's included" accordion |
| `benefits` | List of single line text | Benefits block, Specifications accordion |
| `weight`, `product_weight_gsm` | Weight, Integer | Specifications accordion |
| `care_instructions`, `drying_instructions` | Rich text | Care accordion (care_instructions → fabric.care) |
| `care_guide` | Page reference | "Read the care guide" link (→ fabric.care_guide) |
| `size_guide` | Page reference | Size guide link and drawer. The page must use template `page.size-guide` (editorial). The anchor is the product type handle, so set Product type consistently: Duvet Covers → `#duvet-covers`, Sheet Sets → `#sheet-sets`, Fitted Sheets, Flat Sheets, Pillowcases, Duvets |
| `feel`, `origin` | Single line text | Feel / Composition accordions (→ fabric.feel / fabric.origin) |
| `shipping_note` | Single line text | First line of the Shipping and returns accordion |
| `complementary_products` | List of products | "Complete the bed" section and the "Pairs well with" card (first entry). Falls back to Search & Discovery |
| `siblings`, `swatch_color`, `swatch_image` | see §1 | Swatches |
| `color_family` | List of metaobject references (color_family) | Colour filter (§4) |

Collection metafields: `sakooon.banner_heading` (single line), `sakooon.banner_text` (rich text) and `sakooon.banner_image` (file) override
the collection title, description and image in the collection banner. The banner section's own image setting overrides all three.

## 3. Inventory and selling

- **Low-stock note:** shown only when the variant tracks inventory in Shopify, the policy is "Stop selling when out of stock", and
  quantity is between 1 and the buy-buttons block threshold (default 5). Untracked variants never show it.
- **Sold out:** the button is disabled with the text "Sold out". If a back-in-stock app is installed later, add its app block to
  main-product (`@app`) rather than editing the button.
- **Quantity rules / volume pricing:** quantity inputs read `variant.quantity_rule` min, max and increment.
- **Dynamic checkout buttons:** off by default (buy buttons block). The cart page shows accelerated checkout when enabled in Payments.

## 4. Search & Discovery app

Install **Shopify Search & Discovery**.

**Filters** (Search & Discovery > Filters), in this order, matching the filter drawer:
1. Availability
2. Price
3. Colour: source "Product metafield `sakooon.color_family`". Display: swatch (uses the color_family metaobject's `swatch` field). Group by family (Blues, Greens, Neutrals…) like the reference
4. Size: option "Bedding size" (or the size option's name)
5. Product type
6. Optional: Material/Fabric via product metafield `sakooon.fabric` (metaobject reference filters show the fabric name)

**Metaobject `color_family`:** fields name, swatch (color), sort_order. Create families first, then set `sakooon.color_family` on products.

**Sort** (Settings in the app): keep Featured, Best selling, Price low/high and Date new→old. The drawer lists whatever
`collection.sort_options` returns.

**Product recommendations:**
- **Complementary:** for each bedding product, add pillowcases, duvets, throws, etc. They feed the PDP "Complete the bed" when
  `sakooon.complementary_products` is blank, and the cart drawer suggestions (first item in the cart).
- **Related:** automatic. You can pin products. Feeds "You may also like".

**Search:** add synonyms (duvet/comforter/quilt, pillowcase/pillow cover, sheet set/bedding set). Predictive search uses the same index.

## 5. Theme settings used by commerce

| Setting | Effect |
|---|---|
| Cart > Cart type: Drawer / Page | Drawer: add-to-cart opens the drawer and the header cart icon opens it. Page: add redirects to /cart and there is no drawer |
| Cart > Free shipping bar + threshold | Meter in the drawer and on the cart page (threshold in shop currency, whole units) |
| Cart > Show note, Show vendor | Note field, vendor above line titles |
| Search > Predictive search | Off: the drawer only submits to /search |
| Product cards > image ratio, secondary image, swatches, vendor, text alignment | Every product card (collection, search, recommendations, storefront sections) |

## 6. Menus and pages the commerce templates expect

- **Menus:** none are read by commerce sections. The collection banner's "back" link (e.g. "← Sheets") is a section setting
  (label + URL) per collection template. Navigation menus belong to the header (shad-2d).
- **Pages:** the size guide page (template `page.size-guide`), care guide pages (`page.care-guide`), the shipping policy
  (Settings > Policies, used for the "Shipping calculated at checkout" link), and optionally a returns page linked from the
  Shipping and returns accordion's page setting.
- **Collections:** `all` is the empty-cart / empty-state fallback link unless a section's link setting is set. The search
  drawer's featured collection is a setting.

## 7. Verification checklist after setup

1. A colour × size product: changing colour swaps images and the URL `?variant=`; a sold-out combination shows "Sold out" in the size list.
2. A collection with the filters above: Apply updates results without a reload, pills appear, and Back restores the previous state.
3. The size guide link opens the drawer at the product type's table.
4. The Composition accordion shows fabric ratings and the fabric page link when `sakooon.fabric` is set.
5. The cart drawer shows complementary products after adding a bedding item with complementary products configured.
