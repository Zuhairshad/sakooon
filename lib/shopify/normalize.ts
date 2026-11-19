import type { Collection, Image, Product } from './types';
import { isNew } from '../utils';
import { SWATCH_COLORS, isColorOption } from '../content/swatches';

const cents = (m?: { amount: string } | null) => (m ? Math.round(parseFloat(m.amount) * 100) : null);
const gidNum = (gid: string) => Number(gid.split('/').pop()?.split('?')[0]);

/* eslint-disable @typescript-eslint/no-explicit-any */
export function normalizeProduct(p: any): Product {
  const variants = (p.variants?.nodes || []).map((v: any) => ({
    id: v.id,
    numericId: gidNum(v.id),
    title: v.title,
    available: v.availableForSale,
    price: cents(v.price)!,
    compareAtPrice: cents(v.compareAtPrice),
    selectedOptions: v.selectedOptions,
    image: v.image,
  }));
  const cheapest = variants.reduce((a: any, b: any) => (b.price < a.price ? b : a), variants[0]);
  return {
    id: p.id,
    handle: p.handle,
    title: p.title,
    vendor: p.vendor,
    productType: p.productType,
    tags: p.tags,
    description: p.description,
    descriptionHtml: p.descriptionHtml,
    createdAt: p.createdAt,
    isNew: isNew(p.createdAt),
    available: p.availableForSale,
    options: (p.options || []).map((o: any) => ({
      name: o.name,
      values: o.optionValues.map((v: any) => ({
        name: v.name,
        color: v.swatch?.color ?? (isColorOption(o.name) ? SWATCH_COLORS[v.name] ?? null : null),
        swatchImage: v.swatch?.image?.previewImage?.url ?? null,
      })),
    })),
    images: p.images?.nodes || [],
    featuredImage: p.featuredImage,
    variants,
    price: cheapest?.price ?? 0,
    compareAtPrice: cheapest?.compareAtPrice ?? null,
    priceVaries: new Set(variants.map((v: any) => v.price)).size > 1,
    seo: p.seo || { title: null, description: null },
  };
}

export function normalizeCollection(c: any, count = 0): Collection {
  return { ...c, image: c.image as Image | null, productCount: count };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

