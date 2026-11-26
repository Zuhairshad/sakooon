# Editorial content sources (Phase 2)

Owner: shad-8b. This page lists where every factual sentence in the editorial templates and fixtures comes from. Sentences that are pure tone, with no factual claim (for example "A little care keeps bedding soft"), are not listed.

Source keys:
- **P:<handle>**: the Shopify product description of that product in `/Users/shad/sakooon/data/store.json` (snapshot 2026-11-19). Quoted or closely paraphrased, never extended.
- **B**: brand facts in `docs/design-system.md` §Brand and `docs/reference/phase2-inputs.md` §Verified: the name, "sukoon" = calm / peace of mind in Urdu, the tagline, "designed in Pakistan", the contact mailbox and the live collections.
- **G**: general textile-care or bedding knowledge, not about a Sakooon product. Wherever it appears it is labelled as general guidance or "for comparison only".
- **Pending**: no source yet. The theme renders "Details coming soon." (`editorial.faq.details_coming_soon`) and the question is listed in editorial-admin.md §8.

## Fabric metaobjects (`tools/preview/fixtures/metaobjects.json`)
| Fabric | Statement | Source |
|---|---|---|
| cotton-satin | Composition "Cotton satin"; smooth finish, gentle on the skin, subtle sheen | P:yarn-dyed-cotton-satin-bed-sheet-set-king, P:two-tone-duvet-cover-set-king |
| cotton-satin | Yarn-dyed fabric is coloured before it is woven, giving rich, long-lasting colour | P:yarn-dyed-cotton-satin-bed-sheet-set-king |
| cotton-satin | Two-tone covers: a deep shade on one side and a lighter tone on the other; flip to change the mood | P:two-tone-duvet-cover-set-king |
| cotton-satin | The bed sheets in both sets resist wrinkles | P: both products ("wrinkle-resistant bed sheet") |
| quilted-cotton | Composition "Cotton"; ultrasonic quilting; raised, embossed pattern; no stitches or loose threads | P:quilted-bed-sheet-set-king |
| quilted-cotton | Light enough for summer, a cosy layer in winter, so all-season; resists wrinkles | P:quilted-bed-sheet-set-king |
| quilted-cotton | Care "Machine wash at 40°C. Do not bleach. Tumble dry on low." and its three symbols | P:quilted-bed-sheet-set-king |
| microfibre-fill | Composition "Microfibre shell, 100% polyester fill"; silky, breathable shell; light, evenly spread fill; white | P:duvet-comfort-filling-220-gsm |
| microfibre-fill | 220 GSM fill weight, winter warmth, balanced loft; definition of GSM; season "cold-weather" (Season: Winter) | P:duvet-comfort-filling-220-gsm |
| cotton-microfibre | Composition "100% cotton cover, 100% polyester microfibre fill"; holds its shape; comfortable in every season; white | P:duvet-comfort-pillow-pack-of-2 |
| all | Thread count, GSM field, weave, origin, ratings, swatch colour, certifications | **empty** (phase2-inputs §Still needed #3) |

## Care guides (`page.care-*.json`)
| Statement | Source |
|---|---|
| Every washing, drying, ironing, storing and replacement instruction on the care hub, bed sheets, duvets and pillows pages, plus their FAQs | G. Each hero says "General guidance … not specific to one product. Always follow the care label" |
| "Care label: Quilted Bed Sheet Set": wash 40°C, no bleach, tumble dry low | P:quilted-bed-sheet-set-king |
| Care symbol meanings on the hub | G (standard laundry symbols) |

## Size and measuring guides
| Statement | Source |
|---|---|
| Bed sheets: yarn-dyed 94 × 96 in, quilted 96 × 106 in; pillow covers 19 × 29 in, two per set; both King; flat sheet | P:yarn-dyed-cotton-satin-bed-sheet-set-king, P:quilted-bed-sheet-set-king |
| Duvet cover set: cover 90 × 100 in, sheet 94 × 96 in, 4 pillow covers 19 × 29 in; filling not included | P:two-tone-duvet-cover-set-king |
| Duvet filling: Single 60 × 90 in (152 × 240 cm), Queen 90 × 95 in (230 × 240 cm), King 104 × 94 in (265 × 240 cm); choose a filling close to the cover size | P:duvet-comfort-filling-220-gsm. Printed verbatim; the Single in/cm mismatch is Still needed #9 |
| Pillow: 20 × 30 in (48 × 76 cm), pack of two | P:duvet-comfort-pillow-pack-of-2 (same question, #9) |
| Common mattress sizes in Pakistan (36/42/60/72/78 in wide; 78/84 in long) | G, labelled "For comparison only … not Sakooon products". Confirmation is Still needed #11 |
| Measuring steps; flat-sheet allowance (depth plus about 15 cm / 6 in each side) | G |

## FAQ, shipping, returns, contact
| Statement | Source |
|---|---|
| Duvet filling not included with the duvet cover set; what the set contains | P:two-tone-duvet-cover-set-king |
| Yarn-dyed set has a flat sheet | P:yarn-dyed-cotton-satin-bed-sheet-set-king |
| GSM definition; 220 GSM for winter warmth | P:duvet-comfort-filling-220-gsm |
| Yarn-dyed definition | P:yarn-dyed-cotton-satin-bed-sheet-set-king |
| Ultrasonic quilting definition | P:quilted-bed-sheet-set-king |
| Orders, payment, delivery, COD, tracking, damage, exchanges, returns, refunds (17 questions) | **Pending** (editorial-admin.md §8) |
| hello@sakooon.com | B, flagged for confirmation (Still needed #12) |
| WhatsApp button | renders only from `settings.social_whatsapp_link` (empty today) |

## About (`page.about.json`)
| Statement | Source |
|---|---|
| Name from "sukoon", Urdu for calm and peace of mind; "The comfort in every thread" | B |
| A bedding brand designed in Pakistan | B (phase2-brief §shad-2d, "Designed in Pakistan") |
| Mostly cotton; sheet sets in cotton satin and quilted cotton; a duvet filling and pillows | P: all five products (the duvet is polyester, hence "mostly") |
| Designs: colours, checks, stripes, prints | P:yarn-dyed-cotton-satin-bed-sheet-set-king ("checks and stripes to florals, geometrics and playful prints"), P:quilted-bed-sheet-set-king (colours) |
| Gallery links: bed-sheets, duvet-covers, duvets, pillows | B (live collections) |
| No founding year, city, team size or figures | intentional |

## Journal (`tools/preview/fixtures/blogs.json`)
| Statement | Source |
|---|---|
| "Choosing a duvet for winter": regional climate differences, sleeping warm or cool, GSM as a general rule, layering, sizing, storing | G. The only product reference is a link to the size and care guides |
| "How to make a bed with a two-tone duvet cover": sheet tucking, inside-out cover method, choosing a side, fold-back, pillow arrangement, washing colours | G. "Deeper shade on one side, lighter on the other" and "pillow covers in both tones" are from P:two-tone-duvet-cover-set-king |
| Images | real packshots and the one lifestyle shot from `/images/` |
