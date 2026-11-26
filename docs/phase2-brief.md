# Phase 2 brief: Sakooon identity (issued by Fable, 2026-11-26)

Phase 1 is approved (D16). Phase 2 turns the reference-fidelity theme into **Sakooon's** theme: brand palette, logo, real catalogue, real copy, Pakistan-first commerce. Still native Shopify OS 2.0, still LiquidJS preview as the dev target, still no publish to the live theme. The user is away for a while and asked for autonomous progress; anything that needs their input is parked in `docs/reference/phase2-inputs.md` §"Still needed", not invented.

## Non-negotiables (unchanged, plus two new ones)
1. **No fabricated facts.** No thread counts, compositions, GSM, certifications, dimensions, addresses, phone numbers, ratings, customer counts or service promises unless they appear in `docs/reference/phase2-inputs.md` §Verified. The live sakooon.com copy is Nocturne demo content and is **not** a source. Where a fact is missing, the theme shows nothing (conditional render), never a placeholder number.
2. **Copy that is tone, not claims, is fine**: calm, plain, warm, short. British spelling. Urdu word "sukoon" (peace/calm) is the brand hook. No "hotel-grade", "5-star", "OEKO-TEX" or similar unless verified.
3. Typography stays one grotesk (Inter via the font picker, D11/D16). Do not add fonts.
4. Palette, colour schemes, logo and favicon are Fable's; sections only reference scheme ids (`paper`, `white`, `sand`, `sage`, `ink`). Hex values never appear in section files.
5. Process: `git -c core.hooksPath=/dev/null`; first `merge origin/sakooon/integration` (head carries this brief, D17, the brand assets and the new schemes); merge, never rebase or force-push; one owner per file (`docs/file-ownership.md`); restart only your own preview port; `npm run check` clean before every push; report at boundaries with commit hash + test output.
6. Prices are PKR. `shop.money_format` is a store setting (currently `Rs.{{amount}}`, which the preview mirrors). Always go through `money` filters and `window.theme.money`; never hardcode "Rs". I will ask the user to switch the store format to `Rs. {{amount_no_decimals}}`.

## Brand direction (Fable, see docs/design-system.md §Brand)
- **Colour**: Sakooon green `#204830` (measured from the logo) is the single brand colour: buttons, links, focus, the dark "ink" scheme (`#163322` background). Neutrals are warm: paper `#F5F2EC`, white, sand `#E8E1D5`, pale sage `#E4E9E2` for promo/fabric bands. Text is a green-black `#1A2420`. No gold.
- **Logo**: `assets/sakooon-wordmark.png` (header, 1 colour), `assets/sakooon-mark.png` (calligraphy, for favicon/compact uses), `assets/sakooon-logo-stacked.png` (footer/about/password). Rendered through `snippets/brand-logo.liquid` (Fable) which prefers `settings.logo` when the merchant uploads one.
- **Voice**: "The comfort in every thread" is the tagline (from the logo). Short sentences. Talk about sleep, softness, care, home; not about luxury signalling.

## Work split

### Fable (lead): foundation + integration
- [x] Inputs inventory, this brief, D17.
- [ ] Brand assets from the logo (transparent PNGs, favicon set), `snippets/brand-logo.liquid`, favicon fallback in `layout/theme.liquid`.
- [ ] Colour schemes in `config/settings_data.json` (+ new `sage` scheme), design-system.md §Brand, contrast check (AA on every scheme pair).
- [ ] SEO foundations: Organization JSON-LD with logo + sameAs + contactPoint (only when settings are filled), default share image, `<meta name="theme-color">`, password page branding.
- [ ] Preview: `moneyFormat` PKR, shop name/description/currency fixtures, `shop.brand` shim.
- [ ] Integration merges, full QA (interactions, responsive, axe, Lighthouse) and the Phase 2 progress report for the user.

### shad-2d: storefront with the real brand
Deliver, in order, each as its own commit:
1. Header/footer: call `{% render 'brand-logo', variant: 'wordmark' %}` (header) and `variant: 'stacked'` (footer, optional block) instead of the inline `settings.logo` markup; keep every contract in component-contracts.md §header. Footer: newsletter + menus + contact block that renders phone/WhatsApp/email **only** when the corresponding `settings.social_*`/contact settings are filled (none are filled today). No fake addresses.
2. Menus (preview fixtures `tools/preview/fixtures/menus.json` are yours for the storefront menus): main menu limited to what exists: Bed Sheets, Duvet Covers, Duvets, Pillows, Bed Covers, plus Guides (fabric guide, care guide, size guide) and About. Mega menu promos use real product images from `/images/…` (see `/Users/shad/sakooon/public/images`). Write the same structure into `docs/reference/storefront-admin.md` as the Shopify navigation the merchant must create.
3. Homepage `templates/index.json` with real content: hero on `sakooon-white-bedding-bedroom.webp`, featured collection = `bed-sheets`, product highlights = the three in-stock sets, fabric discovery linked to the fabric metaobject handles that shad-8b publishes (ask them for handles), brand values block with only confirmable, claim-free statements (e.g. "Designed in Pakistan", "Cotton bedding", "Easy exchanges" **only once the user confirms the policy**, so leave that block's policy items off for now), newsletter. Promo band uses the `sage` scheme.
4. Copy pass over all storefront strings for voice (§Brand direction). Keep the `storefront.*` locale namespace.
Acceptance: `npm run check` clean; interactions mobile-nav, header-sticky, mega-menu, search-drawer pass; responsive 7 viewports on `/`; axe 0; Lighthouse mobile `/` ≥ 85 perf with the real hero image (use `snippets/image.liquid` widths and `priority: true`). Report with full-page captures at 1440 and 390.

### shad-d8: real catalogue and commerce polish
1. Preview data: the server already merges `/Users/shad/sakooon/data/store.json` (5 real products). Replace the `fixture-*` products in `tools/preview/fixtures/products.json` with **metafield/sibling/swatch overlays keyed to the real handles** (fabric reference, `sakooon.swatch_color` for each colour variant using the packshot's dominant colour or a named hex, `sakooon.siblings`, size guide page ref, package contents **copied from the product descriptions**). Remove placeholder products entirely so the preview catalogue equals the store.
2. Collections: make `bed-sheets`, `duvet-covers`, `duvets`, `pillows`, `bed-covers` render well with 1–3 products (empty-state and small-grid behaviour, facets that hide when only one value exists). Collection banners: title + one line of claim-free description each, written into `docs/reference/commerce-admin.md` as the Admin copy.
3. PDP: real descriptions render through the accordions (the descriptions contain "Available sizes", "Why you'll love it", "Specifications", "FAQ" headings; split them into accordion items by heading in Liquid when present, fall back to the full description). Variant pickers for "Bedding size", "Design", "Color", "Pack Size". Sold-out state (pillow pack) with a notify-me-free, honest "Sold out" button. Compare-at pricing with the PKR format and no decimals.
4. Cart/search: PKR format, sold-out handling, search suggestions that work with the real titles (long titles must truncate gracefully at 2 lines).
5. Swatches: colour chips from `sakooon.swatch_color`, falling back to the variant image thumbnail, falling back to text.
Acceptance: `npm run check` clean; all 9 interactions pass on 9302; responsive on `/collections/bed-sheets`, `/products/quilted-bed-sheet-set-king`, `/products/duvet-comfort-pillow-pack-of-2`, `/cart`, `/search?q=duvet`; axe 0; Lighthouse mobile PDP ≥ 80. Document every metafield value you relied on in `docs/metafield-contracts.md` §Admin values (append; the contract itself stays v0.2 unless you message me).

### shad-8b: verified content only
1. Fabric metaobjects (`tools/preview/fixtures/metaobjects.json`): one entry per fabric that actually appears in the catalogue, with **only** the fields the product descriptions support (e.g. "Microfibre shell, 100% polyester fill" for the duvet insert; cotton satin and quilted cotton for the sheet sets as described). Leave thread count, GSM, origin, certifications empty. The guide pages must render correctly with these gaps (no empty labels, no "—").
2. Care guide: generic textile care for cotton, cotton satin, microfibre/polyester fills, written from general knowledge (wash cool, line dry, etc.), explicitly labelled as general guidance and not product-specific until the user confirms. Size guide: our verified sizes only (duvet insert Single 60×90 in / 152×240 cm, Queen 90×95 in / 230×240 cm, King 104×94 in / 265×240 cm, and whatever the sheet-set descriptions state); mattress sizes table may stay as "common Pakistani mattress sizes" with inches and cm, clearly separated from product dimensions.
3. FAQ, shipping, returns, contact pages: structure and questions written; every answer that depends on a policy renders a short "Details coming soon" line from a locale string, and the question list goes into `docs/reference/editorial-admin.md` as the list for the user to answer. Contact page shows only the form plus email (hello@sakooon.com, flagged for confirmation) and the WhatsApp button only when `settings.social_whatsapp_link` is set.
4. About/brand story: 250–400 words around "sukoon", designed in Pakistan, cotton bedding, care and plainness. No founding year, no city, no numbers.
5. Journal: two short articles that are genuinely informative without product facts (how to choose a duvet weight for Pakistani winters in general terms; how to make a bed with a two-tone reversible cover), using the real images.
Acceptance: `npm run check` clean; responsive + axe on `/pages/fabric-guide`, `/pages/care-guide`, `/pages/size-guide`, `/pages/faq`, `/pages/about`, `/pages/contact`, `/blogs/journal`; Lighthouse mobile ≥ 85; a one-page `docs/reference/editorial-content-sources.md` listing the source of every factual sentence.

## Coordination
- shad-8b → shad-2d: fabric metaobject handles for the homepage fabric discovery block.
- shad-d8 → shad-8b: fabric handle per product (`sakooon.fabric`) so PDP → guide links resolve.
- Anyone → Fable: new global setting, locale key outside your namespace, base.css change, preview server change. I turn those around first.
- Message Fable when a milestone lands (hash, files, test output) or when blocked. Do not wait for the user; park user questions in `docs/reference/phase2-inputs.md` §"Still needed" (append, do not rewrite).
