# Phase 2 inputs inventory (Fable, 2026-11-26)

Everything Phase 2 may draw on, sorted by how much we can trust it. **Only the "verified" rows may become facts on the storefront.**
Anything else is a hint for structure or tone, or a question for the user.

## Verified (Shopify store data, owned by Sakooon)
| Input | Where | Notes |
| --- | --- | --- |
| 5 live products with titles, descriptions, options, variants, PKR prices, compare-at prices, images | `/Users/shad/sakooon/data/store.json` (snapshot 2026-11-19, already loaded by the preview) | duvet-comfort-filling-220-gsm (Single/Queen/King, Rs 4,499–6,999), duvet-comfort-pillow-pack-of-2 (sold out), yarn-dyed-cotton-satin-bed-sheet-set-king (11 designs), two-tone-duvet-cover-set-king (5 colourways), quilted-bed-sheet-set-king (11 colours) |
| Product facts inside those descriptions | same | e.g. duvet insert: microfibre shell, 100% polyester fill, 220 GSM, sizes in inches and cm; quilted set and yarn-dyed set compositions as written there. Quote them, do not extend them. |
| Live collections | `https://juj1hc-qf.myshopify.com/collections.json` | bed-covers (1), bed-sheets (3), duvet-covers (1), duvets (1), pillows (1). The T200/T250/T300, bath, kids, fitted, pillow-cover collections linked by the live menus **do not exist** in Shopify. |
| Product photography | `/Users/shad/sakooon/public/images/*.webp` (39 files, served by the preview as `/images/<file>`) | Packshots per colour/design plus one lifestyle shot (`sakooon-white-bedding-bedroom.webp`). No campaign photography yet. |
| Logo | `/Users/shad/Downloads/SAKOOON logo.png` (1254×1254, white background) | Arabic/Urdu calligraphy "سکون" + serif wordmark SAKOOON + tagline "THE COMFORT IN EVERY THREAD", single green. Measured dominant colour `#204830`. Derived assets in `assets/sakooon-*.png` (see design-system.md). |
| Store | sakooon.com = juj1hc-qf.myshopify.com, currency PKR, live theme "Nocturne v2" (do not modify) | Privacy policy exists (Shopify template). Refund, shipping and terms policies return 404: **not written yet**. |
| Contact email | `hello@sakooon.com` (Nocturne settings + live footer) | Treat as the brand mailbox; confirm with the user before printing it on the contact page. |

## Unverified: live-site copy (Nocturne demo content)
Extracted text: `docs/reference/live-site/*.txt`. The Nocturne theme shipped with demo copy that was never replaced. Signs: placeholder phone `+92 3XX XXXXXXX`, WhatsApp `923000000000`,
three "studios" (Lahore Gulberg, Karachi DHA, Islamabad F-7), "12,000+ happy sleepers", "4.9★", "OEKO-TEX certified dyes", "300 threads", T200/T250/T300 weave families, bath towels.
None of it is backed by store data. **Do not reuse any number, certification, address, phone, or claim from it.** Usable as tone/structure hints only:
- Positioning phrases that are generic enough: "Luxury bedding & bath · Pakistan" (bath is not in the catalogue, so drop it), "Sleep, softly woven", "Sukoon means peace of mind" (sukoon = calm/peace in Urdu; this is a true meaning and a good brand hook).
- Service promises that need user confirmation before use: free delivery over Rs 5,000, Rs 250 delivery, cash on delivery, 7-day exchange, WhatsApp support hours, "Lahore · Est. 2026".
- Size guide table (Single 36×78 in … Super King 78×84 in with fitted/flat/duvet/pillow sizes). Standard Pakistani mattress sizes, but the sheet dimensions must be confirmed against actual products. Our verified product sizes: duvet insert Single 60×90 in, Queen 90×95 in, King 104×94 in.

## Nocturne palette (hint only; superseded)
Navy ink `#1B2130`, paper `#F4EEE4`, gold accent `#A8834F`, sage `#B3C2A7`, moon `#E3C793`, signal green `#5E8C6A`; Fraunces + Figtree.
The logo is green, not navy/gold, so Phase 2 derives the palette from the logo (decision D17). Fraunces/Figtree are not kept (D16: grotesk).

## Still needed from the user (ask when they are back)
1. Palette sign-off on the logo-green proposal (or hex values of their own).
2. Lifestyle/campaign photography (hero, room, editorial). Until then the hero uses the single bedroom shot and packshots.
3. Fabric facts beyond the product descriptions: composition, thread count/GSM, weave, origin, certifications (issuer, licence number, certificate URL). Without them the Fabric metaobjects stay at what the descriptions already say.
4. Policies: delivery fees and zones, COD, delivery times, exchange/return window and conditions, payment methods (COD, card, bank transfer, Easypaisa/JazzCash?).
5. Real contact channels: WhatsApp number, phone, hours, city/address, social handles.
6. Shopify CLI login for the development theme (`shopify theme dev --store juj1hc-qf.myshopify.com`), never a publish.
7. (shad-d8) Pillow pack: the product `duvet-comfort-pillow-pack-of-2` sells "Pack of 1 Pillow" (Rs 2,499) and "Pack of 2 Pillows" (Rs 4,999), but its title, description and FAQ say a pack holds two pillows. Which is right? Until answered the PDP shows no "What's included" chips for it. Both variants are sold out; is that intended, and when do they return?
8. (shad-d8) Swatch colours: the variant swatch colours were eyedropped from the packshots (docs/metafield-contracts.md §Admin values). Confirm them or send your own hex values.
9. (shad-8b) Duvet filling Single size: the product description says "60 x 90 inches (152 x 240 cm)", but 90 in is about 229 cm. Which is right? The size guide prints both exactly as written until confirmed. Pillow: "20 x 30 inches (48 x 76 cm)" (20 in is about 51 cm), same question.
10. (shad-8b) Care instructions for every product except the Quilted Bed Sheet Set (only that description has care text). Until then care pages are labelled general guidance.
11. (shad-8b) Are the common Pakistani mattress sizes in the size guide (36, 42, 60, 72 and 78 in wide; 78 or 84 in long) the sizes your customers ask about? Any to add or remove?
12. (shad-8b) Confirm `hello@sakooon.com` for the contact page (shown now, flagged). Answers to the 17 FAQ/shipping/returns questions listed in docs/reference/editorial-admin.md §8 (all show "Details coming soon." until answered).
