# Storefront: what must exist in Shopify Admin

Owner: shad-2d. Covers the header, announcement bar, footer and homepage (`templates/index.json`, `sections/header-group.json`,
`sections/footer-group.json`, `templates/list-collections.json`). Anything listed under "Required" renders a placeholder or
nothing until it exists; nothing breaks.

## 1. Menus (Online Store > Navigation)

| Handle | Used by | Structure | Required |
|---|---|---|---|
| `main-menu` | Header (desktop mega menu + mobile menu) | **3 levels.** Level 1 = top-level items. Level 2 = group headings (a level-2 link *with* children becomes a column heading; a level-2 link *without* children goes into one plain link column). Level 3 = links in the group. Items without children and without promo cards are plain links. | Yes |
| `footer-shop` | Footer "Shop" column | flat list, about 5 links | Yes (column hidden if empty) |
| `footer-help` | Footer "Help" column | flat list | Yes |
| `footer-company` | Footer "Company" column | flat list | Yes |
| `footer-guides` | Optional extra footer column (add a Menu block) | flat list | No |
| `legal` | Footer bottom bar | Privacy policy, Terms of service, Refund policy | Yes |
| any | Header > "Quick links row" (mobile scrolling row) | flat list | No (off by default) |

Recommended `main-menu` shape (from the reference): 5–8 top-level items; per item 1–5 groups of 3–7 links. With up to 3 promo cards, a panel fits 6 columns at desktop.
The URL of each top-level item appears as "All <item>" inside its panel and the mobile level 2, because the top-level entries open panels instead of navigating.

## 2. Theme settings (Customize > Theme settings)

| Setting | Why |
|---|---|
| Logo (+ logo width) | Header and footer show the shop name in spaced capitals until a logo is set. The mobile logo renders at 75% of the width. |
| Social media links | The footer "Follow" column lists only networks with a URL; with none it shows a "Follow us" placeholder. |
| Cart type = Drawer | The header cart icon opens the cart drawer; with "Page" it links to /cart. |
| Customer accounts enabled (Settings > Customer accounts) | Shows the account icon (desktop header) and the Account link in the mobile menu. |
| Markets with more than one country | Shows the footer country/region selector (hidden with one country). |
| Payment providers | The footer payment icons come from `shop.enabled_payment_types` automatically. |

## 3. Section content to replace (Customize > Home page / header / footer)

| Where | What to set |
|---|---|
| Announcement bar | Replace the three placeholder messages (text + optional link). Rotation 5s, pause button included; set "Rotate messages" off for a single message. |
| Header > Mega menu promo blocks | 8 placeholder blocks are attached to the menu items "New" (3), "Bedding" (1), "Bath" (2), "Pillows & Duvets" (2). **The "Menu item" field must match the top-level menu title** (case and punctuation-insensitive: it is compared as a handle). Rename it if you rename the menu item. Set image, caption and link. |
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
