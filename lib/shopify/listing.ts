import 'server-only';
import { cacheLife, cacheTag } from 'next/cache';
import { SHOPIFY_ENABLED, shopifyFetch } from './client';
import * as local from '../data/local';
import { TAGS } from './index';
import type { Product } from './types';

export type Doc = { type: 'page' | 'article'; title: string; url: string; excerpt: string; image: string | null };

/** Pages + journal articles matching a query (search "Pages" / "Journal" tabs). */
export async function searchDocs(q: string): Promise<Doc[]> {
  'use cache';
  cacheLife('minutes');
  cacheTag(TAGS.pages);
  if (!SHOPIFY_ENABLED) return local.searchDocs(q);
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const d = await shopifyFetch<{ search: { nodes: any[] } }>(
    `query($q: String!) { search(query: $q, first: 20, types: [PAGE, ARTICLE], prefix: LAST) { nodes {
      __typename
      ... on Page { handle title bodySummary }
      ... on Article { handle title excerpt blog { handle } image { url } }
    } } }`,
    { q },
  );
  return d.search.nodes.map((n: any) =>
    n.__typename === 'Page'
      ? { type: 'page' as const, title: n.title, url: `/pages/${n.handle}`, excerpt: n.bodySummary || '', image: null }
      : { type: 'article' as const, title: n.title, url: `/blogs/${n.blog.handle}/${n.handle}`, excerpt: n.excerpt || '', image: n.image?.url ?? null },
  );
  /* eslint-enable @typescript-eslint/no-explicit-any */
}

export type SortOption = { value: string; label: string };

export const COLLECTION_SORTS: SortOption[] = [
  { value: 'manual', label: 'Featured' },
  { value: 'best-selling', label: 'Best selling' },
  { value: 'title-ascending', label: 'Alphabetically, A–Z' },
  { value: 'title-descending', label: 'Alphabetically, Z–A' },
  { value: 'price-ascending', label: 'Price, low to high' },
  { value: 'price-descending', label: 'Price, high to low' },
  { value: 'created-ascending', label: 'Date, old to new' },
  { value: 'created-descending', label: 'Date, new to old' },
];

export const SEARCH_SORTS: SortOption[] = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'price-ascending', label: 'Price, low to high' },
  { value: 'price-descending', label: 'Price, high to low' },
];

export type ListingParams = { sort: string; avail: string[]; gte: number | null; lte: number | null };

type SP = Record<string, string | string[] | undefined>;
const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);
const all = (v: string | string[] | undefined) => (Array.isArray(v) ? v : v ? [v] : []);

export function readListingParams(sp: SP, sorts: SortOption[]): ListingParams {
  const sort = first(sp.sort_by) || sorts[0].value;
  const num = (v?: string) => (v && /^\d+(\.\d+)?$/.test(v) ? Math.floor(parseFloat(v)) : null);
  return {
    sort: sorts.some((s) => s.value === sort) ? sort : sorts[0].value,
    avail: all(sp['filter.v.availability']).filter((v) => v === '1' || v === '0'),
    gte: num(first(sp['filter.v.price.gte'])),
    lte: num(first(sp['filter.v.price.lte'])),
  };
}

/** Facet counts + filtering + sorting, done on the cached product list (catalogue is small). */
export function applyListing(products: Product[], p: ListingParams) {
  const priceMax = Math.max(0, ...products.map((x) => Math.floor(x.price / 100)));
  const counts = { inStock: products.filter((x) => x.available).length, outOfStock: products.filter((x) => !x.available).length };
  let list = products.filter((x) => {
    if (p.avail.length === 1 && (p.avail[0] === '1') !== x.available) return false;
    const rs = x.price / 100;
    if (p.gte != null && rs < p.gte) return false;
    if (p.lte != null && rs > p.lte) return false;
    return true;
  });
  const by = {
    'title-ascending': (a: Product, b: Product) => a.title.localeCompare(b.title),
    'title-descending': (a: Product, b: Product) => b.title.localeCompare(a.title),
    'price-ascending': (a: Product, b: Product) => a.price - b.price,
    'price-descending': (a: Product, b: Product) => b.price - a.price,
    'created-ascending': (a: Product, b: Product) => Date.parse(a.createdAt) - Date.parse(b.createdAt),
    'created-descending': (a: Product, b: Product) => Date.parse(b.createdAt) - Date.parse(a.createdAt),
  } as Record<string, (a: Product, b: Product) => number>;
  if (by[p.sort]) list = [...list].sort(by[p.sort]);
  const active = p.avail.length > 0 || p.gte != null || p.lte != null;
  return { list, counts, priceMax, active };
}
