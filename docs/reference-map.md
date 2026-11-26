# Reference map

Which reference page governs each Sakooon template/section. Filled from docs/reference/{storefront,commerce,editorial}.md.
Status: skeleton (2026-11-26). Measured values will be added per row.

| Sakooon template / section | Governing reference | Secondary | Owner | Notes |
| --- | --- | --- | --- | --- |
| layout: header, announcement, mega menu, mobile nav | parachutehome.com header | teklafabrics.com header | shad-2d | Parachute 37+56px, nav left / logo+icons right, transparent over hero; Tekla 40+52px, hide-on-scroll; nav breakpoint 1024; mobile sub-nav row (Parachute) |
| layout: footer | parachutehome.com footer | teklafabrics.com footer | shad-2d | |
| templates/index.json | parachutehome.com | teklafabrics.com (editorial blocks) | shad-2d | hero 100svh-90px; promo band 800px; product rails 256px cards 3:4 16px gap; split tiles 8px gap 24px gutters; lifestyle feature with hotspot; campaign banner 1.84; shop-by-category 4 tiles (hidden <768); fabric discovery 9:16 rail with 120px gutters; Tekla 2px-gap 4:5 2-up and 4-up |
| templates/collection.json | parachutehome.com collection | | shad-d8 | measured 1920/1440: 12-col page grid, 8px col gap, 20px outer pad; 4-col product grid, 3:4 cards, row gap 32; filter drawer 600px left; details in docs/reference/commerce.md |
| templates/product.json | parachutehome.com product | | shad-d8 | 50/50 split, 3:4 gallery carousel, 460px buy box sticky top 32, 44px controls radius 4, detail rows 64px opening side drawers |
| cart drawer / templates/cart.json | parachutehome.com cart | | shad-d8 | right flyout 500px at 1440; opens after add to cart |
| search drawer / templates/search.json | parachutehome.com search | | shad-d8 | top sheet below announcement, full width, 750px tall, 44px input, 4-col square results |
| page.fabric-guide, metaobject/fabric | parachutehome.com/pages/our-fabrics-detail | teklafabrics.com editorial | shad-8b | |
| page.care-guide (+ per product type) | teklafabrics.com/care-guide/textile-care | | shad-8b | |
| page.about / story / materials / quality / sourcing | teklafabrics.com/esg | | shad-8b | |
| blog.json, article.json | teklafabrics.com journal (if accessible) | parachute blog | shad-8b | |
| page.size-guide, page.measurement-guide, page.faq, shipping, returns, contact | parachutehome.com help pages | teklafabrics.com | shad-8b | |
| customers/*, 404, password, gift card | design-system defaults | | Fable | no reference; restrained, functional |

## Token candidates from measurements (pending storefront/editorial data before changing design-system defaults)
- Parachute: text rgb(53,51,49), muted rgb(105,102,99), divider rgba(53,51,49,.25), neutral fill #F1EEE9, radius 4 (controls) / 2 (tags), transitions 0.3s linear (UI) and 0.2s (drawers/opacity), announcement 37px + header 56px.
- Typography on Parachute: serif display at weight 300 (titles, collection headers 80/68, PDP title 28/33.6, card title 16/17.6) with a sans for UI/body (14/19.6, 18/25.2 descriptions). Our D4 default is one grotesk; `type_heading_font` + `heading_weight` settings allow a serif display without code changes. Decide after the Tekla measurements land.
