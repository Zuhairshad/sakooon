# Editorial templates: Shopify Admin setup

Owner: shad-8b (editorial). This is everything the editorial, guide, fabric and journal templates on `sakooon/editorial` need in Shopify Admin. Field definitions follow `docs/metafield-contracts.md` v0.2. Where this doc and that one differ, the contract wins.

**Nothing here has been done in the store.** Every step needs the store owner's authorisation.

Order matters: create the metaobject definitions and page metafields first (steps 1–2), then the pages (step 3), then the theme-editor references that point at those pages (step 6).

---

## 1. Metaobject definitions (Settings › Custom data › Metaobjects)

### 1.1 `Fabric` (type handle `fabric`)

Options:
- **Storefront access**: on (Read).
- **Publishable** (Active / Draft status): on. Drafts never render, are excluded from `shop.metaobjects.fabric.values`, and return 404.
- **Web pages / Online Store**: on. Template: `metaobject/fabric`. Shopify generates the URL. The theme only links through `fabric.system.url` and never builds it by hand.
- **Display name**: `name`. **SEO**: title = `name`, description = `summary`.

Every field is optional except `name`. The theme hides any blank field together with its label and row.

| Key | Name in Admin | Type | Validation |
|---|---|---|---|
| `name` | Name | Single line text | **Required** |
| `tagline` | Tagline | Single line text | max 80 |
| `summary` | Summary | Multi-line text | max 280 |
| `overview` | Overview | Multi-line text | 5–6 lines (about 450–650 characters); the PDP fabric row (shad-d8). Facts from the product descriptions only; general fabric knowledge says "in general" |
| `care_summary` | Care summary | Multi-line text | 5–6 lines; the PDP care row. Product-specific only where the description gives care; otherwise starts "General guidance, not specific to one product" |
| `description` | Description | Rich text | |
| `composition` | Composition | Single line text | enter only verified compositions |
| `fibre` | Fibre | Single line text | choices: cotton, linen, cotton-linen, lyocell, wool, other |
| `weave` | Weave | Single line text | choices: percale, sateen, plain, twill, jersey, flannel, terry, waffle, other |
| `finish` | Finish | Single line text | choices: stonewashed, peached, garment-washed, none |
| `yarn` | Yarn | Single line text | |
| `thread_count` | Thread count | Integer | min 1; only when verified |
| `gsm` | Weight (g/m²) | Integer | min 1; only when verified |
| `texture` | Texture | Single line text | |
| `feel` | Feel | Single line text | |
| `softness` | Softness | Rating | min 1, max 5 |
| `breathability` | Breathability | Rating | min 1, max 5 |
| `durability` | Durability | Rating | min 1, max 5 |
| `warmth` | Warmth | Rating | min 1, max 5. **Position**, where 1 = sleeps cool and 5 = sleeps warm |
| `best_for` | Best for | List of single line text | |
| `seasons` | Seasons | List of single line text | choices: all-season, warm-weather, cold-weather |
| `care` | Care | Rich text | |
| `care_symbols` | Care symbols | List of single line text | choices (exact): wash-30, wash-40, wash-60, hand-wash, no-bleach, tumble-low, tumble-none, line-dry, iron-low, iron-medium, iron-high, no-iron, dry-clean, no-dry-clean |
| `care_guide` | Care guide | Page reference | for example the "Bedsheet care" page |
| `texture_image` | Texture image | File (image) | 1:1 or 4:5, at least 1600px |
| `closeup_image` | Close-up image | File (image) | the fabric guide's large close-up; falls back to texture_image |
| `closeup_region` | Close-up region | Single line text | optional `x,y,w,h` in percent of the close-up image (a detail tile of a collage packshot), e.g. `35,71,30.5,29` |
| `lifestyle_image` | Lifestyle image | File (image) | 4:5, at least 1600px |
| `gallery` | Gallery | List of files (images) | |
| `swatch_color` | Swatch colour | Color | |
| `collection` | Shop collection | Collection reference | drives "Shop <fabric>" and the related-products fallback |
| `related_products` | Related products | List of product references | max about 12 |
| `sort_order` | Sort order | Integer | ascending order in guides |
| `origin` | Made in | Single line text | only when the supply chain is documented |
| `certifications` | Certifications | List of metaobject references → Certification | see 1.2 |

### 1.2 `Certification` (type handle `certification`)

Storefront access: on. Publishable: on. Web pages: off.

| Key | Type | Validation |
|---|---|---|
| `name` | Single line text | **Required** |
| `issuer` | Single line text | needed for display |
| `licence_number` | Single line text | needed for display |
| `certificate_url` | URL | needed for display; the public verification page |
| `scope` | Single line text | what exactly is certified |
| `valid_until` | Date | it stops rendering after this date |
| `logo` | File (image) | only with the issuer's written permission |

A certification renders only when issuer, licence number and verification URL are all present and the certificate has not expired. **Do not create certification entries Sakooon does not hold.** There is no free-text "certified" field anywhere in the theme.

## 2. Metafield definitions (Settings › Custom data)

These are the editorial ones. The product and variant fabric references are listed in the contract, and shad-d8 owns their use.

| Resource | Namespace.key | Type | Used by |
|---|---|---|---|
| Page | `sakooon.related_fabrics` | List of metaobject references → Fabric | `fabric-guide` and `fabric-compare` order on that page. When blank, they show all active fabrics by `sort_order` |
| Product | `sakooon.size_guide` | Page reference | PDP size dialog (shad-d8). Point it at the Size guide page |
| Product | `sakooon.care_guide` | Page reference | PDP care link. Overrides `fabric.care_guide` |
| Product | `sakooon.care_instructions` | Rich text | PDP care text. Overrides `fabric.care` |
| Product / Variant | `sakooon.fabric` | Metaobject reference → Fabric | PDP fabric block, and the reverse link from fabric pages via `related_products` |
| Collection | `sakooon.fabric` | Metaobject reference → Fabric | fabric-led collection banner (shad-d8) |

Storefront access must be on for every definition.

## 3. Pages to create (Online Store › Pages)

The handle is what menus, PDP links and internal links expect. The template suffix is set in the page's "Theme template" selector.

| Title (suggested) | Handle | Theme template | Notes |
|---|---|---|---|
| About | `about` | `page.about` | |
| Our story | `our-story` | `page.about` (or a duplicate, customised) | the about template already has hero, text and gallery |
| Contact | `contact` | `page.contact` | Shopify's contact form emails the store's sender address (Settings › Notifications) |
| FAQ | `faq` | `page.faq` | `/pages/faq#faq-<block id>` deep-links and opens one question |
| Shipping and delivery | `shipping` | `page.shipping` | |
| Returns and exchanges | `returns` | `page.returns` | |
| Fabric guide (Our fabrics) | `fabrics` | `page.fabric-guide` | optionally fill `sakooon.related_fabrics` to set the order |
| Care guide | `care-guide` | `page.care-guide` | the hub links to the four pages below by these handles |
| Bedsheet care | `care-bedsheets` | `page.care-bedsheets` | |
| Pillow care | `care-pillows` | `page.care-pillows` | |
| Duvet and comforter care | `care-comforters` | `page.care-comforters` | |
| Size guide | `size-guide` | `page.size-guide` | each category's "Anchor" setting = the product type handle (duvet-covers, fitted-sheets, flat-sheets, pillowcases, duvets …), so the PDP dialog scrolls to it |
| Mattress measuring guide | `measurement-guide` | `page.measurement-guide` | section anchor `#mattress-measuring` |
| (any other page) | | `page` (default) | renders the title plus page content |

Page body content (the rich text editor) is shown only by the default `page` template and by an `editorial-text` "Page content" block. Every other template takes its copy from the theme editor sections.

## 4. Blog (Online Store › Blog posts › Manage blogs)

| Blog | Handle | Template | Notes |
|---|---|---|---|
| Journal | `journal` | `blog` (articles use `article`) | Tags drive the filter row. Suggested tags: Care, Guides, Stories. The first tag shows as the article's category. Comments render only when the blog allows comments |

Article fields used: title, featured image (16:10 crop on cards; the article page offers 16:9, 4:5, 5:4 or 21:9), excerpt (cards, plus the article introduction), content, tags, author (hidden by default), published date.

## 5. Navigation (Online Store › Navigation)

Menu names are configured in theme settings, and their handles are in the contract. Suggested editorial links:

| Menu | Links |
|---|---|
| Footer: Help (`footer-support`) | Contact `/pages/contact`, FAQ `/pages/faq`, Shipping `/pages/shipping`, Returns `/pages/returns`, Size guide `/pages/size-guide` |
| Footer: Guides (`footer-guides`) | Our fabrics `/pages/fabrics`, Care guide `/pages/care-guide`, Mattress measuring `/pages/measurement-guide`, Journal `/blogs/journal` |
| Footer: Company | About `/pages/about`, Our story `/pages/our-story` |

## 6. Theme editor follow-ups after the pages exist

1. **Fabric page template** (`metaobject/fabric` › Fabric header): set **Fabric guide page** to the Fabric guide page, so the breadcrumbs read Home / Our fabrics / Percale.
2. **Fabric page › Related products**: no setup needed. It uses each fabric's `related_products`, then its `collection`. An optional fallback collection can be picked.
3. **Size guide**: replace the example dimensions in every category table (one row per line, cells separated by `|`, centimetres) and check each category's Anchor against the store's product types.
4. **Care pages and FAQ**: replace the onboarding copy. The FAQ sections emit FAQPage structured data. Keep that on for one FAQ section per page.
5. **Fabric guide page** uses the "Panels with products" layout. Each fabric's product rail comes from its `related_products` (or its `collection`), and "Shop all <fabric>" needs `collection`. A fabric without either shows only its information column. Chips come from `feel` (comma-separated), falling back to `best_for`.
6. **FAQ page** uses the "Topic list beside questions" layout. Every "Topic heading" block becomes a link in the sticky list, so give each group a heading.
7. **Figures section** (if used): enter only figures that can be substantiated. An empty value hides the figure.

## 7. Preview vs store

The local preview (`tools/preview`) mimics all of the above with fixtures: the four Phase 2 fabric metaobjects (`cotton-satin`, `quilted-cotton`, `microfibre-fill`, `cotton-microfibre`, verified fields only), no certifications, the `journal` blog, and the editorial pages in `tools/preview/fixtures/pages.json`. Pages `about` and `fabric-guide` carry `related_fabrics`.

## 8. Questions for the store owner (Phase 2)

Every question below is already on the storefront. Its answer is blank, so the theme shows "Details coming soon." (locale key `editorial.faq.details_coming_soon`). To publish an answer, type it into the question's **Answer** field in the theme editor. Answered questions are automatically added to the FAQ structured data.

**FAQ page (`page.faq`)**
- Orders: How do I change or cancel my order? · Which payment methods do you accept? · Can I order by WhatsApp or phone?
- Delivery: Where do you deliver? · How long does delivery take? · How much does delivery cost? · Do you offer cash on delivery?
- Returns and exchanges: Can I exchange an item? · Can I return an item for a refund? · How do I start a return or exchange?

**Shipping page (`page.shipping`)**
- Where do you deliver? · How long does delivery take? · How much does delivery cost? · Do you offer cash on delivery?
- How do I track my order? · What if my order is late? · What if my order arrives damaged?

**Returns page (`page.returns`)**
- Can I exchange an item? · How long do I have to ask for an exchange? · How do I start an exchange?
- Can I return an item for a refund? · Which items can't be returned? · Who pays for return delivery? · When will I receive my refund?

**Contact page (`page.contact`)**
- Confirm `hello@sakooon.com` is the mailbox to print. It currently appears in the "Email" column.
- WhatsApp: set Theme settings › Social media › WhatsApp to a `https://wa.me/<number>` link. The contact page's "Message us on WhatsApp" button appears only once it is set.
- Phone, hours and address are not shown anywhere until they are supplied.

Also write the Shopify refund and shipping policies (Settings › Policies). Both currently return 404.
