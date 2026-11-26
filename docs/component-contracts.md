# Component contracts

Shared interfaces every worker depends on. Changing a contract requires a message to Fable; Fable edits this file.

## 1. Global runtime (assets/global.js, loaded deferred in theme.liquid)
`window.theme` namespace:
- `theme.pubsub.subscribe(event, cb) -> unsubscribe`, `theme.pubsub.publish(event, payload)`
- `theme.fetchConfig(type = 'json')` returns headers/method for Shopify AJAX calls.
- `theme.trapFocus(container, startEl?)`, `theme.removeTrapFocus(returnTo?)`
- `theme.debounce(fn, wait)`, `theme.onSectionLoad(sectionType, cb)` (wraps shopify:section:load/select)
- `theme.renderSection({ sectionId, url?, params? }) -> Promise<HTMLElement>` (section rendering API fetch + parse)
- `theme.getFocusableElements(el)`
- `theme.money(cents)`: formats using `window.theme.moneyFormat` (set in theme.liquid from shop.money_format)
- `theme.strings.*`: translated strings exposed from theme.liquid (addToCart, soldOut, unavailable, cartError, etc.)

Base custom elements in global.js:
- `<theme-drawer id data-side="left|right|bottom" data-lock-scroll>`: methods `open(trigger)`, `close()`; attribute `open`;
  emits `theme:drawer:open|close`. Any `[data-drawer-open="<id>"]` button opens it; `[data-drawer-close]` inside closes it.
- `<theme-dialog>` same API for modals (size guide, zoom).
- `<theme-disclosure>` accordion item: `<theme-disclosure><button aria-expanded aria-controls>…</button><div id>…</div></theme-disclosure>`
- `<theme-tabs>` basic roving tabs.
- Scroll lock utility: `theme.lockScroll()`, `theme.unlockScroll()` (body class `scroll-locked`).

## 2. Events (pubsub names)
- `cart:updated` payload `{ cart }` (full /cart.js JSON). Published by whoever changes the cart (product form, cart drawer, cart page).
- `cart:error` payload `{ message }`.
- `cart:open-request` (header cart button publishes; cart-drawer listens and opens). Header may instead use `data-drawer-open="cart-drawer"`.
- `search:open-request` (header search button; search-drawer opens). Or `data-drawer-open="search-drawer"`.
- `variant:change` payload `{ sectionId, variant, product }` (product form publishes; gallery, price, sticky bar, pickup listen).
- `header:height` payload `{ height }` published by header on resize (storefront) so drawers/sticky offsets can use `--header-height`.
  Header also sets `document.documentElement.style.setProperty('--header-height', px)`.

## 3. Header <-> commerce handoff
Header (shad-2d) renders:
```liquid
<button type="button" class="header__icon" data-drawer-open="search-drawer" aria-label="{{ 'general.search.search' | t }}">{% render 'icon', icon: 'search' %}</button>
<a href="{{ routes.cart_url }}" class="header__icon header__cart" data-drawer-open="cart-drawer" aria-label="...">
  {% render 'icon', icon: 'bag' %}<span class="header__cart-count" data-cart-count>{{ cart.item_count }}</span>
</a>
```
Commerce (shad-d8) renders `<theme-drawer id="cart-drawer">` and `<theme-drawer id="search-drawer">` sections included in
`sections/header-group.json` (storefront adds those two section entries to the group once commerce commits them) and updates
`[data-cart-count]` on `cart:updated`. On `cart:updated` the cart drawer opens if `settings.cart_type == 'drawer'` and the
publisher passed `{ open: true }`.

## 4. Product card (snippets/product-card.liquid, owner shad-d8)
Parameters: `product` (required), `show_swatches` (bool, default settings), `show_secondary_image` (bool), `show_vendor`,
`image_ratio` ('adapt'|'portrait'|'square', default settings.card_image_ratio), `sizes` (sizes attribute string),
`lazy` (default true), `columns_desktop`, `heading_tag` (default 'h3').
Storefront sections (featured-collection, product-highlights, room-collection) call it; they never reimplement a card.
Card must render a graceful placeholder when `product` is blank (section onboarding in the editor).

## 5. Price (snippets/price.liquid, owner shad-d8)
Parameters: `product` or `variant`, `show_compare_at` (default true), `price_class`. Must output `<s>` compare price with
visually-hidden labels (`products.product.price.regular_price` / `sale_price`).

## 6. Images (snippets/image.liquid, owner Fable)
Parameters: `image` (image or media object), `sizes` (required string), `widths` (default '320,480,640,768,960,1280,1600,1920,2400'),
`aspect` ('natural'|'3/4'|'4/5'|'1/1'|'4/3'|'16/9'|'21/9' or any CSS ratio), `priority` (bool: eager + fetchpriority high),
`class`, `alt` (override), `decorative` (true -> alt=""; use for card images beside a visible title), `crop` ('center'|'top'|'bottom'|'left'|'right'; implemented 2026-11-26: with `aspect` every srcset candidate is requested as width+height+crop so banners download only the visible crop; candidates are capped at the width the source height allows), `region_height` (1-99, with `aspect` + `crop`: limit the source to its top N% first, e.g. the main photo of a collage packshot, then cut the aspect from that area centred; uses Shopify image_url crop: 'region'), `region` ('x,y,w,h' in percent of the source, with `aspect` + `crop`: crop a detail tile of a collage, e.g. a fabric close-up; overrides `region_height`), `placeholder` (name for placeholder_svg_tag when image blank).
Renders `<img>` with width/height, srcset, loading, decoding. Wrap in `.media` with `style="--aspect: 3/4"` when a fixed ratio is needed.

## 7. Section heading (snippets/section-heading.liquid, owner Fable)
Parameters: `eyebrow`, `heading`, `heading_tag` (default h2), `heading_size` ('h1'..'h4'), `text` (richtext), `link_label`, `link_url`,
`align` ('left'|'center'). Standard layout used by every storefront/editorial section header.

## 8. Section conventions
- Wrapper: `<section id="shopify-section-…"` is added by Shopify; our root element: `<div class="section section--{{ section.id }} color-scheme-{{ section.settings.color_scheme }}" style="--section-pt: {{ pt }}px; --section-pb: {{ pb }}px">`.
- Every section exposes: `color_scheme` (color_scheme type), `padding_top`, `padding_bottom` (range 0-160 step 4).
- Section CSS lives in `{% stylesheet %}` tags? No: use `{% style %}` for instance-specific variables only, and put reusable CSS in the owner's
  asset stylesheet (storefront.css / commerce.css / editorial.css) loaded once from theme.liquid. Keep per-section scope with a `.section-name` prefix.
- JS: custom elements defined in the owner's asset script; scripts are loaded by theme.liquid with `defer` (all four assets are small). Elements must
  initialise on `connectedCallback` so section load/re-render in the editor works. Clean up listeners in `disconnectedCallback`.
- Translations: all UI strings go in locales/en.default.json under the section's namespace; schema labels in en.default.schema.json. Workers add their keys
  under their namespace and send Fable the diff for locales (Fable owns locales; workers may stage keys in docs/locales-<area>.json for Fable to merge, or commit directly to locales ONLY within their own top-level namespace key: `storefront`, `commerce`, `editorial`, with sections' schema labels under `sections.<name>` in the schema locale).
- Placeholders: `placeholder_svg_tag` via snippets/placeholder.liquid; headings default to generic copy ("Heading", "Share information about your brand").
- No `{{ 'x' | asset_url | stylesheet_tag }}` inside sections except for the owner's single asset (and only once per page: guard not needed since Shopify dedupes the same URL? It does not; load from theme.liquid instead).

## 9. Sticky header
Shopify wraps every section in `<div id="shopify-section-<id>" class="shopify-section <schema class>">`. `position: sticky` on an element inside a wrapper of the same height does nothing, so the header section sets its stickiness on the wrapper: schema `"class": "section-header"` and CSS `.section-header { position: sticky; top: 0; z-index: var(--z-sticky); }` (toggled by a data attribute/class the section renders when sticky is enabled). Other sections that need the header edge read `--header-height` (set by global.js and the header).

## 10. Metafields
See docs/metafield-contracts.md for namespaces/keys. Access pattern: `product.metafields.sakooon.<key>` with `blank` guards.
