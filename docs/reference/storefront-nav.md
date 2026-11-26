# Navigation patterns: mega menu and mobile drawer

These are patterns only. Labels below are **placeholders** (`Category A`, `Link 1`…); the reference sites' own wording is not reproduced. Counts and geometry come from the reference DOM and measurements (see `storefront.md` for method and gaps).

## Parachute-style mega menu (primary pattern)

Header: top-level links on the left (8 items, 14px, 24px apart). Each top-level link is a real URL and also opens a full-width panel below the header on hover or focus. The header turns solid while a panel is open.

Panel = one horizontal row of **link columns** followed by **promo cards**. The cell mix varies per top-level item:

| Top-level item kind | Link columns | Promo cards | Example shape |
|---|---|---|---|
| Sale / campaign | 1 | 2 | `[links][promo][promo]` |
| New | 1 | 3 | `[links][promo][promo][promo]` |
| Large category (bedding) | 5 | 1 | `[links][links][links][links][links][promo]` |
| Mid category (pillows & duvets) | 3 | 2 | `[links][links][links][promo][promo]` |
| Single product line (mattress) | 1 | 2 | `[links][promo][promo]` |
| Category (bath) | 4 | 1 | `[links][links][links][links][promo]` |
| Small category (decor) | 1 | 2 | `[links][promo][promo]` |
| Archive / outlet | 1 | 2 | `[links][promo][promo]` |

Column anatomy (from DOM): each link column is a vertical stack `[group heading][link][link]…`. A promo card is one anchor wrapping `[image][caption]` that points to a collection, product or article. Pixel values of open panels (column widths, link pitch, heading style, image ratio, open/close timing) are unmeasured: the panels do not open under headless hover (see storefront.md, "Could not capture").

Mobile (<1024, measured at 390 and 768):
- The header bar shows logo, search, cart and hamburger, with a horizontally scrolling **sub-nav row** below it (the same top-level links; sale items in an accent colour). This lets people jump without opening the drawer.
- Drawer: a full-width **bottom sheet** (582px at an 844px viewport) sliding up over 0.3s below the visible header. Level 1: 8 rows, 16/500, 61px, hairline rules. Choosing one replaces the list with that section's groups (level 2): "Back to menu" (12px uppercase) and utility icons on top, then per group an uppercase 12/700 heading link with an arrow, followed by 15–16px links (~33px pitch), groups separated by rules. No promo images on mobile.

## Tekla-style mega menu (secondary pattern: two-level hover)

Panel at 1440: full width, ≈ 490px tall, `#f6f6f6`, 1px bottom rule, opens with `transform .3s cubic-bezier(.4,0,.2,1)`. The page behind gets a blurred translucent overlay (`backdrop-filter: blur(12.5px)`). Top-level items: 4 (`New`, `Shop`, `Gift`, `About`); one of them (`Gift`) is a plain link with no panel.

**Level 1** (on hover of a top-level item):

```
| 1/4: list of sub-sections         | 3/4: three promo cards (4:5 image + 14px caption below), 16px gaps |
|  Category A  (active = #181818)   |  [promo]          [promo]          [promo]                      |
|  Category B  (#5c5c5c)            |                                                                   |
|  …  7 items, 14/300, 29px pitch   |                                                                   |
```

**Level 2** (on hover of a left-list item; the list stays, the right side is replaced):

```
| col 1 (240) | col 2 (240)       | col 3 (240)          | cols 4–6 (720)                    |
| list        | "Group 1" title   | "Group 2" title      | [promo 4:5]   [promo 4:5]          |
|             | link × 6 + "All"  | link × 4             | caption below each (14/300)        |
```

- A 6-column grid (each column 1/6 of the viewport), 1px `#e3e3e3` rules between columns, 16px padding.
- Group titles are 14/300 `#181818`; links are 14/300 `#5c5c5c`, about 29px pitch.
- Promo cards: 4:5 image, caption below. Level 1 uses 3 cards, level 2 uses 2.

Mobile (<1024): a full-width sheet below the 52px header (header stays; the hamburger becomes ×).
- Level 1: a tab row of top-level items, then the sub-section list (16/24 300, 48px rows), then promo cards (4:5), then account / support / ship-to rows.
- Level 2: `← Back`, a "Discover <section>" row, then per group a **muted 16px label** + links (16/24, 45px pitch), groups separated by 1px rules, then a horizontal row of promo cards (224px wide, 4:5).

## What we build (proposal for `sections/header.liquid`)

One data model drives both desktop and mobile:

- **Menu source**: the Shopify `main-menu` linklist, 3 levels deep. Level 1 = top-level items. Level 2 = **link groups** (the group heading is the level-2 link title). Level 3 = links inside the group.
- **Promo cards**: `mega_promo` blocks in the header section with settings `menu_item` (the level-1 title or handle to attach to), `image`, `heading`, `link`. Up to 3 per top-level item.
- **Layout per top-level item** comes from content: N groups + M promos in one row, Parachute style. The column count is `N + M` (max 6). An item with no children and no promos is a plain link (Tekla "Gift" case).
- Optional `mega_layout` setting: `columns` (Parachute, default) or `two_level` (Tekla left list + hover-swapped right side). Ship `columns` in Phase 1 and keep `two_level` as a stretch goal.
- **Mobile drawer**: the same linklist. Level 1 rows with chevrons, level 2 slides in with "Back", level-2 groups render as label + links (Tekla's grouped level 2), and promos render as a horizontal card row at the end. An optional `mobile_subnav_menu` setting renders Parachute's scrolling sub-nav row under the mobile bar.
- **Accessibility**: top-level links stay real links. A separate disclosure button (or `aria-expanded` on hover plus Enter/Space/ArrowDown on a button) opens the panel, Esc closes it and returns focus to the trigger, and the drawer uses `theme-drawer` focus trapping from `global.js`. There is a hover-intent delay of about 100–150ms both ways so diagonal mouse moves don't flicker panels. Reduced motion: no transforms; opacity only.
