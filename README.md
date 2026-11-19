# Sakooon — headless frontend

A Next.js 16 frontend (App Router, Cache Components) that reproduces the **Sakooon Nocturne** design from
[sakooon.com](https://sakooon.com): same markup, CSS, fonts and interactions. It leaves out the old theme's
performance problems: the WebGL "silk" shaders, the 4-second preloader, and content that stayed hidden until JavaScript ran.

The frontend runs on its own. Until a Shopify store is connected it uses **local sample data**:
- `data/store.json`: a snapshot of the current catalogue (5 products, 5 collections, pages and blog);
- `public/images`: the product and section images.

Connecting Shopify is an environment change, not a code change.

## Run locally

```bash
npm install
npm run dev        # http://localhost:3000, no environment variables needed
npm run build && npm start
```

## Data: local sample data → Shopify

| Mode | When | What happens |
| --- | --- | --- |
| Local sample data | `SHOPIFY_STORE_DOMAIN` unset (default) | Products, collections, pages, search and predictive search read `data/store.json` (`lib/data/local.ts`). The cart is kept in a cookie and checkout links to `/cart`. |
| Shopify | `SHOPIFY_STORE_DOMAIN` set | The same functions in `lib/shopify/*` call the Storefront API. The cart and checkout are Shopify's own. |

Every data function in `lib/shopify/*` starts with `if (!SHOPIFY_ENABLED) return local.…`, so both modes share the same types and components.
`scripts/snapshot-store.mjs` regenerates the sample data from any store (`node scripts/snapshot-store.mjs your-store.myshopify.com`).
Delete `data/` and `public/images/` once a real store is connected.

All variables are listed in `.env.example`.

## Images

Local images go through the Next image optimiser via `img()` in `lib/utils.ts`, which serves AVIF/WebP at fixed widths.
When Shopify is connected, product images come from Shopify's CDN with its `width` parameter.
The allowed widths live in `next.config.ts` (`images`) and `IMAGE_WIDTHS`; keep the two in sync.

## How it is put together

- `app/styles/theme.css`: the theme's `sn-base.css`, design tokens and `@font-face` rules. Fonts are self-hosted from `public/theme`.
- `app/styles/overrides.css`: CSS-only replacements for the theme's JavaScript effects (silk, above-the-fold reveal).
- `components/chrome/*`: announcement bar, header (mega menus, search, mobile menu), footer and popup.
- `components/home/*`, `components/pages/*`, `components/product/*`, `app/*`: one component per theme section, each with that section's CSS.
- `lib/theme/runtime.ts`: a TypeScript port of the theme's `sn-core.js`. It drives `data-*` behaviours: reveal on scroll,
  sliders, tabs, overlays, wishlist, quick view and predictive search. `components/theme/Boot.tsx` runs it after each page hydrates.
- `components/cart/*`: React cart drawer and provider; server actions live in `lib/shopify/cart.ts`.
- `proxy.ts`: returns a real 404 for unknown product, collection, page or blog URLs.

## Performance rules

On mobile Lighthouse over HTTP/2, pages score 90–97 and desktop scores 100. The live theme scores 36 on mobile. Keep these rules when adding sections:

- **Wrap static markup in `<Static>`** (`components/theme/Static.tsx`). React keeps the server HTML and skips hydrating it.
  Put behaviour/client components *next to* the `<Static>` block, never inside it. Internal `<a>` links inside get client-side
  navigation from `ThemeRuntime`.
- **Behaviours start after first paint** (`useAfterPaint`, `useSection`). The theme runtime and the cart drawer are code-split and load
  when the page is idle.
- **Looping animations wait for `html.sn-idle`.** After adding an `infinite` animation, run `node scripts/gen-idle-gate.mjs`.
- **Content visible on load must not depend on JavaScript.** Above-the-fold `[data-r]` elements get `data-atf`; product cards do this
  when `priority` is set.
- **Streamed (Suspense) content reserves its height**, so the footer never shifts into view.
- Measure production builds over HTTP/2, like your CDN serves them. `next start` alone is HTTP/1.1, which Lighthouse
  scores noticeably lower.
