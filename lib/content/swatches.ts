/**
 * Colour swatches the theme resolved by option-value name (most Shopify
 * option values have no native swatch). Native swatch colours win.
 */
export const SWATCH_COLORS: Record<string, string> = {
  'Sage Green': '#9dc3b3',
  Ivory: '#efe8d6',
  'Dusty Blue': '#6e9bd1',
  'Emerald Green': '#1f5e45',
  'Slate Grey': '#4f5a63',
  'Grey / White': '#6b6b6b',
  'Black / White': '#1e2126',
  'Rust / Peach': '#9c4a2c',
  'Royal Blue / Sky Blue': '#1f4fb0',
  'Forest Green / Lime Green': '#1f4d36',
  'Blush Pink': '#e3a89a',
  'Charcoal Grey': '#4a4d4b',
  Rust: '#b4683f',
  'Butter Yellow': '#f0e08a',
  'Periwinkle Blue': '#8aa6db',
  Black: '#1e2126',
};

/** Theme rule: options named colour/color get swatches. */
export const isColorOption = (name: string) => /colou?r/i.test(name);
