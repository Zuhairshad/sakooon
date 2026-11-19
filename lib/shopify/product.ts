import 'server-only';
import { cacheLife, cacheTag } from 'next/cache';
import { SHOPIFY_ENABLED, shopifyFetch } from './client';
import * as local from '../data/local';
import { getProducts, getRecommendations, TAGS } from './index';
import type { Product } from './types';

export async function getProductHandles(): Promise<string[]> {
  'use cache';
  cacheLife('hours');
  cacheTag(TAGS.products);
  if (!SHOPIFY_ENABLED) return local.getProductHandles();
  const d = await shopifyFetch<{ products: { nodes: { handle: string }[] } }>(`query { products(first: 250) { nodes { handle } } }`);
  return d.products.nodes.map((n) => n.handle);
}

/** Collections a product belongs to (breadcrumb fallback). */
export async function getProductCollections(handle: string): Promise<{ handle: string; title: string }[]> {
  'use cache';
  cacheLife('hours');
  cacheTag(TAGS.products, TAGS.collections);
  if (!SHOPIFY_ENABLED) return local.getProductCollections(handle);
  const d = await shopifyFetch<{ product: { collections: { nodes: { handle: string; title: string }[] } } | null }>(
    `query($h: String!) { product(handle: $h) { collections(first: 20) { nodes { handle title } } } }`,
    { h: handle },
  );
  return d.product?.collections.nodes || [];
}

/** Shopify related products (falls back to bestsellers when Shopify returns none). */
export async function getRelated(p: Product, limit = 8): Promise<Product[]> {
  const [recs, best] = await Promise.all([getRecommendations(p.id).catch(() => []), getProducts({ first: 20 }).catch(() => [])]);
  const out: Product[] = [];
  for (const x of recs.length ? recs : best) if (x.handle !== p.handle && !out.some((o) => o.handle === x.handle)) out.push(x);
  return out.slice(0, limit);
}
