/** Shop money format is "Rs.{{amount}}" → Rs.2,750.00 */
export function money(cents: number | null | undefined, format = 'Rs.{{amount}}'): string {
  const n = (cents || 0) / 100;
  const dec = n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const whole = Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return format.replace(/\{\{\s*amount_no_decimals\s*\}\}/, whole).replace(/\{\{\s*amount\s*\}\}/, dec);
}

/** Widths the image optimiser accepts (mirrors next.config.ts → images). */
export const IMAGE_WIDTHS = [96, 160, 240, 300, 400, 500, 600, 640, 750, 828, 1080, 1200, 1600, 1920];
const snap = (w: number) => IMAGE_WIDTHS.find((x) => x >= w) ?? IMAGE_WIDTHS[IMAGE_WIDTHS.length - 1];

/**
 * Sized image URL.
 *  - local images (/images/…) go through the Next image optimiser (WebP/AVIF, cached)
 *  - Shopify CDN images get Shopify's own `width` parameter
 */
export function img(src: string | null | undefined, width = 600): string {
  if (!src) return '';
  if (src.startsWith('/')) return `/_next/image?url=${encodeURIComponent(src)}&w=${snap(width)}&q=75`;
  const u = src.startsWith('//') ? 'https:' + src : src;
  const [base, qs = ''] = u.split('?');
  const params = new URLSearchParams(qs);
  params.set('width', String(width));
  return `${base}?${params.toString()}`;
}

export function srcset(src: string | null | undefined, widths: number[]): string {
  if (!src) return '';
  return widths.map((w) => `${img(src, w)} ${w}w`).join(', ');
}

export const discountPct = (price: number, compare: number | null) =>
  compare && compare > price ? Math.floor(((compare - price) / compare) * 100) : 0; // theme floors (Liquid integer maths)

/** Matches the theme's "New" badge window. */
export const isNew = (createdAt: string, days = 90) => Date.now() - Date.parse(createdAt) < days * 864e5;
