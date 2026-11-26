# Local theme preview

Renders this theme on your machine without a Shopify store, so theme work can run in parallel with the headless app.

```bash
cd local-preview
npm install --ignore-scripts
npm start            # http://localhost:9292
```

- Renders the real `layout/`, `templates/*.json`, section groups, `sections/` and `snippets/` with [LiquidJS](https://liquidjs.com).
- Uses the sample catalogue and images in the headless repo (`../sakooon/data/store.json`, `../sakooon/public/images`). Point `HEADLESS=/path/to/sakooon` at it if your checkout lives elsewhere.
- Shopify-only filters and tags (`image_url`, `money`, `t`, `form`, `paginate`, `section(s)`, …) and the AJAX endpoints the theme JS calls (`/cart/*.js`, `/products/<handle>.js`, `/search/suggest.json`, `?section_id=`) are stubbed. The cart is held in memory.
- Theme files are re-read on every request, so refresh to see Liquid/CSS/JS edits. `npm run dev` restarts the server when `server.mjs` changes.

It is an approximation: Liquid edge cases, customer accounts, checkout and real filtering behave differently on Shopify. Check with `shopify theme dev` before shipping. `.shopifyignore` keeps this folder out of theme uploads.
