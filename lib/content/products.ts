/**
 * Per-product content that the Liquid theme read from metafields / theme
 * logic. Tokenless Storefront API access cannot read metafields, so the
 * live values are mirrored here. Once a Storefront token with
 * `unauthenticated_read_metafields` is configured these can move to
 * metafields.
 */
export type Spec = { b: string; s: string };

export const PRODUCT_SPECS: Record<string, Spec[]> = {
  'quilted-bed-sheet-set-king': [
    { b: 'Cotton', s: 'Fabric' },
    { b: 'Ultrasonic', s: 'Quilted' },
    { b: '96×106 in', s: 'King size' },
  ],
  'two-tone-duvet-cover-set-king': [
    { b: 'Cotton satin', s: 'Fabric' },
    { b: 'Reversible', s: 'Duvet cover' },
    { b: '6 pcs', s: 'Set' },
  ],
  'yarn-dyed-cotton-satin-bed-sheet-set-king': [
    { b: 'Yarn-dyed', s: 'Cotton satin' },
    { b: '94×96 in', s: 'King size' },
    { b: '3 pcs', s: 'Set' },
  ],
  'duvet-comfort-pillow-pack-of-2': [
    { b: '100% cotton', s: 'Cover' },
    { b: 'Microfibre', s: 'Filling' },
    { b: 'Pack of 2', s: '20×30 in' },
  ],
  'duvet-comfort-filling-220-gsm': [
    { b: '220 GSM', s: 'Winter fill' },
    { b: 'Microfibre', s: 'Shell' },
    { b: '100% polyester', s: 'Filling' },
  ],
};

/** Breadcrumb collection shown on the live product pages. */
export const PRODUCT_CRUMB: Record<string, string> = {
  'quilted-bed-sheet-set-king': 'bed-covers',
  'two-tone-duvet-cover-set-king': 'bed-sheets',
  'yarn-dyed-cotton-satin-bed-sheet-set-king': 'bed-sheets',
  'duvet-comfort-pillow-pack-of-2': 'pillows',
  'duvet-comfort-filling-220-gsm': 'duvets',
};

export const WHATSAPP_NUMBER = '923000000000';
