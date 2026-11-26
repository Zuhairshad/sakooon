# Storefront: what must exist in Shopify Admin

Owner: shad-2d. Covers the header, announcement bar, footer and homepage (`templates/index.json`, `sections/header-group.json`,
`sections/footer-group.json`, `templates/list-collections.json`). Anything listed under "Required" renders a placeholder or
nothing until it exists; nothing breaks.

## 1. Menus (Online Store > Navigation)

Phase 2: menus list only what exists in the store (5 collections, the guide pages, the journal and About). The preview mirrors this in `tools/preview/fixtures/menus.json`.
Create each menu with exactly these items; the theme reads the handles below.

**`main-menu`** (header mega menu + mobile menu; 2 levels are enough today, a 3rd level would become column headings)

| Level 1 | Link | Level 2 (link) |
|---|---|---|
| Bedding | Collections > All products (`/collections/all`) | Bed Sheets (`bed-sheets`), Duvet Covers (`duvet-covers`), Duvets (`duvets`), Pillows (`pillows`), Bed Covers (`bed-covers`) |
| Guides | `#` (opens the panel only; no "All Guides" link) | Fabric guide (`/pages/fabric-guide`), Care guide (`/pages/care-guide`), Size guide (`/pages/size-guide`), Journal (Blogs > Journal) |
| About | Pages > About (`/pages/about`) | none (plain link) |

The level-1 link of "Bedding" appears as "All Bedding" in its panel. If Admin refuses `#` for Guides, link it to the Fabric guide page; the panel then shows "All Guides" pointing there.

| Handle | Used by | Items |
|---|---|---|
| `footer-shop` | Footer "Shop" column | Bed Sheets, Duvet Covers, Duvets, Pillows, Bed Covers, Shop all (`/collections/all`) |
| `footer-help` | Footer "Help" column | Contact, FAQ, Delivery (`/pages/shipping`), Exchanges and returns (`/pages/returns`) |
| `footer-company` | Footer "Sakooon" column | About, Journal |
| `footer-guides` | Optional extra footer column (add a Menu block) | Fabric guide, Care guide, Size guide |
| `legal` | Footer bottom bar | Privacy policy only. Add Terms of service, Refund policy and Shipping policy once they are written (Settings > Policies); today they return 404. |
| any | Header > "Quick links row" (mobile scrolling row) | Off by default |

Pages the menus point to must exist in Admin (Online Store > Pages, with the theme template of the same name): `about`, `contact`, `faq`, `shipping`, `returns`, `fabric-guide`, `care-guide`, `size-guide`; blog `journal`.

## 2. Theme settings (Customize > Theme settings)

| Setting | Why |
|---|---|
| Logo (+ logo width) | Optional. The theme ships the Sakooon wordmark (header, footer bar) and stacked logo (footer Logo block) via `snippets/brand-logo.liquid`; an upload here replaces them. Width default 120px; mobile renders at 75%. |
| Social media links | The footer "Follow" column lists only networks with a URL and is hidden entirely while none are set. The WhatsApp link also appears in the footer Contact block. |
| Footer > Contact block | Email, phone and hours are block settings, empty today; each line shows only once filled (confirm `hello@sakooon.com` before entering it). |
| Cart type = Drawer | The header cart icon opens the cart drawer; with "Page" it links to /cart. |
| Customer accounts enabled (Settings > Customer accounts) | Shows the account icon (desktop header) and the Account link in the mobile menu. |
| Markets with more than one country | Shows the footer country/region selector (hidden with one country). |
| Payment providers | The footer payment icons come from `shop.enabled_payment_types` automatically. |

## 3. Section content to replace (Customize > Home page / header / footer)

| Where | What to set |
|---|---|
| Announcement bar | Replace the three placeholder messages (text + optional link). Rotation 5s, pause button included; set "Rotate messages" off for a single message. |
| Header > Mega menu promo blocks | 4 blocks: "Bedding" ×3 (Quilted Bed Sheet Set, Two-Tone Duvet Cover Set, Yarn-Dyed Cotton Satin Sheet Set, each linking to its product) and "Guides" ×1 (duvet insert, "Find your duvet size" → size guide). Images are the product packshots; upload the same files to Content > Files (names in `sections/header-group.json`) or re-pick them in the editor. **The "Menu item" field must match the top-level menu title** (compared as a handle). Rename it if you rename the menu item. |
| Header | Transparent over the hero is on; it only applies when the first homepage section is the hero **with an image or video**. Set "Transparent header text" (light/dark) to suit the image, and optionally a light "Transparent header logo". |
| Footer > Newsletter | Heading, text, small print. Sign-ups create customers tagged `newsletter` with email marketing consent (Shopify customer form). |
| Footer | Legal menu handle, copyright text, show/hide logo and payment icons. |
| Every homepage section | Images (see §4), headings, copy and links are placeholders. All links in `index.json` point to `/collections/all` until real targets exist. |

## 4. Images per section

Upload at least the size below (Shopify resizes down; never up). Ratios are the default crop; most sections have an "Image shape" setting.

| Section | Default shape | Rendered width (desktop / mobile) | Upload at least | Notes |
|---|---|---|---|---|
| Hero (`hero-full`) | fills the screen (~16:9 desktop, ~9:16 mobile) | 100vw | 2400 × 1350; mobile image 1080 × 1920 | Set a separate mobile image for portrait crops. Video: MP4 uploaded through the video setting, muted loop, ≤ 15 MB. |
| Split hero (`hero-split`) | half the screen, tall | 50vw / 100vw | 1600 × 2000 | |
| Campaign tiles (`editorial-grid`) | 3:4 (also 4:5, 1:1, 4:3) | 50vw (2 cols) / 100vw | 1500 × 2000 | 3 columns: 1200 × 1600. |
| Lifestyle story (`image-banner`, Lifestyle preset) | 3:4 desktop, 9:16 mobile | ~1392px / 100vw | 1600 × 2133; mobile 1080 × 1920 | Hotspot positions are % of the image, so re-check them after changing the image. |
| Campaign banner (`image-banner`) | 1.85:1 desktop, 16:9 mobile | ~1392px / 100vw | 2400 × 1300; mobile 1200 × 675 | |
| Shop by category (`collection-list`) | 3:4 | 25vw / 62vw | 960 × 1280 | Uses the collection image unless overridden on the block. |
| Fabric discovery | 9:16 | 344px (240px below 1440) / 62vw | 720 × 1280 | Up to 6 per shade; a swatch image (fabric close-up, ≥ 96 × 96) can replace the colour. |
| Image with text | 4:5 | 50–60vw / 100vw | 1600 × 2000 | |
| Room collection | 4:5 | 50vw / 100vw | 1600 × 2000 | Product cards use product images. |
| Comparison highlights | 4:5 | 25vw / 72vw | 800 × 1000 | |
| Brand values | 4:5 (also 1:1, 4:3) | 33vw / 100vw | 1000 × 1250 | Optional; icons are used without images. |
| Mega menu promo | 4:5 | ~220px | 640 × 800 | Also shown in the mobile menu level 2 at 224px. |
| Footer image block | 4:5 | 33vw / 100vw | 960 × 1200 | Optional. |
| Product cards (rails, rooms, hotspots) | 3:4 (theme setting "card image ratio") | 256px / ~195px | 960 × 1280 product images | Second product image is used for the hover cross-fade. |

Always fill in image **alt text** in Admin (Files or product media); the theme uses it.

## 5. Objects `index.json` references by handle

| Type | Handle | Section |
|---|---|---|
| Collection | `bed-sheets` | Featured collection; Bestsellers tab "All"; Shop by category |
| Collection | `duvet-covers` | New arrivals; Bestsellers tab "Bedding"; Shop by category |
| Collection | `duvets` | Bestsellers tab "Duvets"; Shop by category |
| Collection | `pillows` | Bestsellers tab "Pillows"; Shop by category |
| Product | `duvet-comfort-filling-220-gsm` | Lifestyle story hotspot |
| Collection | `all` (built in) | default link target everywhere |

If a handle does not exist on the store, the section falls back to placeholder cards ("Example product title") or the default collection label; re-pick the collection or product in the editor.
The handles come from the current preview catalogue and are expected to change for the real catalogue.

## 6. Pages and templates

| Template | Needs |
|---|---|
| `templates/list-collections.json` (/collections) | Nothing: it lists every collection with its image and title. Set collection images in Admin for good tiles. |
| Home page | Nothing beyond §3–5. Exactly one H1: the hero heading (block "Heading", level H1). Use H2 for any other hero you add. |
