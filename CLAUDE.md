@AGENTS.md

## Keep the Shopify theme in sync

This headless site is a port of the Shopify theme on the `theme-code` branch (checked out at `../sakooon-theme`).
Every change to the headless site must be mirrored in the theme in the same piece of work, then pushed to `theme-code`:

| Headless | Theme |
| --- | --- |
| `components/home/*`, `components/pages/*`, `components/chrome/*` | `sections/sn-*.liquid` (+ `sections/*-group.json`, `templates/*.json` for content) |
| `components/product/*` | `sections/sn-main-product.liquid`, `snippets/sn-card.liquid`, `assets/sn-product.js` |
| `lib/theme/runtime.ts` | `assets/sn-core.js` |
| `app/styles/theme.css`, `app/styles/overrides.css` | `assets/sn-base.css` (root tokens also in `layout/theme.liquid`) |
| `app/layout.tsx` | `layout/theme.liquid` |
| `data/store.json` | Shopify admin data, not theme code: tell the user what to change there |

- Port the intent idiomatically (Liquid, section settings, the theme's own JS), not React code.
- Check the theme renders with its local preview: `cd ../sakooon-theme/local-preview && npm start` (http://localhost:9292, uses this repo's sample data). It is an approximation of Shopify.
- Headless-only concerns (Next config, Vercel, image optimiser, proxy.ts) have no theme counterpart.
- Run git in the theme with hooks disabled: `git -c core.hooksPath=/dev/null ...`.
