# Sakooon theme: project specification

Status: Phase 1 (reference-based recreation). Updated 2026-11-26.

## What we are building

A production-ready, native Shopify Online Store 2.0 theme for Sakooon, a premium bedding and home
textiles brand based in Pakistan. The experience must read as an established international brand:
sophisticated, minimalist, editorial, customer-focused.

Technology (mandatory): Shopify Liquid, HTML, CSS, modern vanilla JavaScript, JSON templates,
sections and blocks, section groups, metafields and metaobjects, native Shopify commerce
(cart AJAX API, predictive search, storefront filtering, section rendering), Shopify CLI.
No React, Next.js, Hydrogen, headless storefront or static-HTML-then-convert. No third-party JS
libraries in the theme. Everything reasonably configurable is editable in the theme editor.

## References and how they are used

| Reference | Governs |
| --- | --- |
| parachutehome.com | Shopping experience: header/mega menu, homepage commerce sections, collection grid, product page, cart, search, footer structure |
| teklafabrics.com/esg | Editorial layouts, storytelling, transparency pages, typographic rhythm |
| teklafabrics.com/care-guide/textile-care | Customer education: care guides, anchor nav, accordion/table patterns |
| parachutehome.com/pages/our-fabrics-detail | Fabric education with commerce hand-off |
| teklafabrics.com | Brand-level typography and whitespace, editorial homepage patterns (secondary for storefront) |

Design language is unified in docs/design-system.md; the references are not mixed ad hoc.
The per-template mapping lives in docs/reference-map.md and is filled from each worker's
docs/reference/*.md investigation.

## Phases

1. Reference-based recreation (now). Original code, neutral placeholders, licensed/Shopify fonts.
   Ends with the user's approval of the layout foundation.
2. Sakooon identity (after approval only): logo, palette, typography, photography, copy, products,
   verified material specs, Pakistani customer positioning, SEO content, shipping/payment/returns.
3. Production readiness: functional testing, accessibility, performance, SEO, launch prep.
   Never publish or overwrite the live theme without explicit authorization.

## Store facts (read-only observations, 2026-11-26)

- Live store: sakooon.com = `juj1hc-qf.myshopify.com`, live theme "Sakooon Nocturne" (id 166925729895).
- Public collections today: bed-covers, bed-sheets, duvet-covers, duvets, pillows (plus nav links to
  bath-sheets, bath-towels, cushion-covers, fitted-sheets, flat-sheets). Catalogue is ~15 products,
  several with colour and size variants.
- Shopify CLI on this Mac is NOT authenticated for this store. `shopify theme dev` needs the user to
  log in interactively once. Until then the LiquidJS preview in tools/preview is the dev preview.
- Sample catalogue for the preview: /Users/shad/sakooon/data/store.json (5 products, size option only).

## Repository

- GitHub: github.com/Zuhairshad/sakooon. `main` = Next.js headless mirror (not our concern).
  `theme-code` = the live Nocturne theme (do not modify).
- Our branches, all from `theme-code`: sakooon/foundation (Fable), sakooon/storefront (shad-2d),
  sakooon/commerce (shad-d8), sakooon/editorial (shad-8b), sakooon/integration (merge target).
- Worktrees: /Users/shad/sakooon-wt/{foundation,storefront,commerce,editorial}.
- Theme files live at the repo root (Shopify GitHub-integration compatible). Dev-only material lives
  in docs/, scripts/, tools/ and is excluded by .shopifyignore.
- Shared non-git QA output: /Users/shad/sakooon-qa/{references,theme,diff}.

## Non-negotiables

- Never display fabricated fabric composition, thread count, GSM, certifications, dimensions.
- No hardcoded store URLs or product IDs. No secrets in source.
- Mobile-first, semantic HTML, keyboard accessible, visible focus, ARIA where needed,
  prefers-reduced-motion respected, no layout shift, optimized responsive images.
- JS components must survive theme-editor section load/reorder (shopify:section:load etc.).
- Graceful empty and missing-data states everywhere.
- Never manipulate screenshots or hide defects to improve comparisons.
