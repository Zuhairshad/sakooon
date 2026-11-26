# Local theme preview

Renders the theme without a Shopify store (LiquidJS). `PORT=9292 npm run preview` from the repo root.

- Data: `/Users/shad/sakooon/data/store.json` + `public/images` (override with `HEADLESS=/path`), extended by `tools/preview/fixtures/*.json`
  (colour x size variant products, metafields, extra collection membership).
- Shimmed: Shopify filters/tags, colour schemes, font_picker objects, link lists, `collection.filters` + `sort_by` from the query string,
  `/cart.js`, `/cart/add|change|update.js` (with `sections` + `sections_url`), `/products/<handle>.js`, `/products.json`,
  `/search/suggest.json`, `/search/suggest?section_id=` (predictive_search global), `/recommendations/products?section_id=` (recommendations global),
  `?section_id=` and `?sections=` including group ids (`sections--header-group__cart-drawer`).
- Restart only your own instance: `lsof -ti tcp:<port> | xargs kill` (never `pkill -f`).
- It is an approximation; check real behaviour with `shopify theme dev` before shipping.
