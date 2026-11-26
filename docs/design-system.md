# Design system

Owner: Fable. Source of truth for tokens is assets/base.css (`:root`) fed by config/settings_schema.json.
Values marked (provisional) are replaced by measured reference values from docs/reference/*.md.
Workers use the tokens, never raw values, except for one-off geometry that a section's own setting controls.

## Principles
1. Quiet surfaces, strong imagery. Warm off-white paper, ink text, hairline rules. No shadows, no gradients.
2. One typeface family (grotesk sans). Hierarchy by size, weight 400/500 and letter-spacing, not by font changes.
3. Square corners (0 to 2px). Buttons are rectangles with 1px borders or solid ink fills.
4. Rhythm: section padding tokens, not per-section magic numbers. Mobile-first.
5. Motion is functional: 200ms ease for hover/focus, 300-400ms for drawers, no decorative loops. Honour reduced motion.

## Tokens (CSS custom properties on :root)

### Colour (per colour scheme; scheme applied via `.color-scheme-<id>` class, see below)
--color-background, --color-foreground, --color-foreground-muted, --color-border,
--color-accent (interactive ink), --color-accent-contrast, --color-button-bg, --color-button-text,
--color-button-border, --color-sale, --color-error, --color-success.
Schemes (provisional): `paper` (#F6F4F0 / #1C1B19), `white` (#FFFFFF / #1C1B19), `sand` (#E9E3DA / #1C1B19), `ink` (#1C1B19 / #F6F4F0).
Muted text must hold AA on its background (min 4.5:1 for body, 3:1 for >=24px).

### Typography
--font-body-family, --font-heading-family (Shopify font picker; default Inter), --font-body-weight 400,
--font-heading-weight 300 (measured: Tekla 300 everywhere, Parachute display 300; setting), --font-body-size 14px (measured: Tekla 14/21, Parachute UI 14/19.6; setting 14-18).
Scale (provisional, fluid with clamp(), mobile -> desktop):
--text-xs 12px, --text-sm 13/14px, --text-base 15/16px, --text-md 17/18px, --text-lg 20/22px,
--text-xl 24/28px, --text-2xl 30/36px, --text-3xl 36/48px, --text-4xl 44/64px.
--leading-tight 1.1, --leading-snug 1.25, --leading-normal 1.5, --leading-relaxed 1.65.
--tracking-tight -0.01em, --tracking-normal 0, --tracking-wide 0.04em, --tracking-caps 0.08em.
Utility classes: .h0 .h1 .h2 .h3 .h4 .h5, .text-body, .text-small, .text-caption, .eyebrow (uppercase caps tracking),
.measure (max-width 65ch), .measure-narrow (45ch).

### Spacing
--space-1 4px, --space-2 8px, --space-3 12px, --space-4 16px, --space-5 20px, --space-6 24px, --space-8 32px,
--space-10 40px, --space-12 48px, --space-16 64px, --space-20 80px, --space-24 96px, --space-32 128px.
Section vertical padding (measured, D14): --section-padding-sm (24->40), --section-padding (40->64), --section-padding-lg (48->88), --section-padding-xl (64->160, editorial intros/discovery).
Sections take `padding_top` / `padding_bottom` range settings (0-160, step 4) with these as defaults.

### Layout
--page-width 1440px (setting 1200-1920), --page-gutter 16px mobile / 24px desktop (measured: Parachute 24/16, Tekla 16; settings page_gutter_*). Rails and editorial-narrow sections set their own wider insets (48 / 120) via section settings.
.page-width { max-width: var(--page-width); margin-inline:auto; padding-inline: var(--page-gutter) }
.page-width--full (no max), .page-width--narrow (max 960), .page-width--text (max 720).
Grid: .grid with --grid-columns (1 mobile default), --grid-gap 8px mobile / 16px desktop (measured: Parachute 8 tiles / 16 cards, Tekla 2; settings grid_gap_*); tile sections may set --grid-gap: 8px or 2px inline.
Breakpoints (provisional, min-width): --bp-sm 600, --bp-md 768, --bp-lg 1024, --bp-xl 1280, --bp-2xl 1440.
Media queries in CSS use these literal px values (custom properties cannot be used in @media).

### Borders and radius
--border-width 1px, --border-color = --color-border, --radius 0px (setting 0-8), --radius-pill 999px (only for tags).

### Buttons and inputs
Buttons: height 48px (desktop) / 44px (mobile), padding-inline --space-6, font --text-sm, uppercase optional via setting,
variants .button (solid), .button--secondary (outline), .button--tertiary (underlined text link), .button--small (40px).
Inputs: height 48px, 1px border, no radius, label above (or floating per setting), focus = 2px outline accent offset 2px.
Links: underline 1px, underline-offset 3px; .link--hover-underline for nav.

### Icons
snippets/icon.liquid, 24px grid, 1.5px stroke, currentColor. Sizes --icon-sm 16, --icon 20, --icon-lg 24.

### Motion
--duration-fast 150ms, --duration 250ms, --duration-slow 400ms, --ease cubic-bezier(.2,.6,.2,1).
@media (prefers-reduced-motion: reduce) sets all durations to 0.01ms.

### Z-index
--z-sticky 10 (sticky header), --z-dropdown 20 (mega menu), --z-overlay 30, --z-drawer 40, --z-modal 50, --z-toast 60.

## Images
Always via snippets/image.liquid (responsive srcset, sizes, lazy by default, `priority: true` for LCP).
Aspect ratios via `aspect-ratio` CSS and the wrapper class .media with --aspect custom property.
Placeholder when missing: snippets/placeholder.liquid renders `placeholder_svg_tag` in a neutral tone.

## Accessibility baseline
Skip link, landmark roles, visible focus ring everywhere (`:focus-visible`), 44px min hit targets on touch,
`aria-expanded`/`aria-controls` on disclosures, dialogs with focus trap and Escape, live regions for cart/search updates,
reduced-motion support, no information by colour alone (swatches have names).
