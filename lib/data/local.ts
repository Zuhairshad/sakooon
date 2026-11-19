import 'server-only';
/**
 * Local sample data — the frontend's data source until a Shopify store is
 * connected (see SHOPIFY_ENABLED in lib/shopify/client.ts). Mirrors the
 * Storefront API functions over data/store.json, a snapshot taken with
 * scripts/snapshot-store.mjs. Images live in public/images.
 */
import snapshot from '@/data/store.json';
import extras from '@/data/extras.json';
import { normalizeCollection, normalizeProduct } from '../shopify/normalize';
import type { Collection, Page, Product } from '../shopify/types';

/* eslint-disable @typescript-eslint/no-explicit-any */
/** Snapshot + hand-maintained extras (menu collections, policies). */
const store = {
  ...snapshot,
  collections: [...snapshot.collections, ...extras.collections.filter((x) => !snapshot.collections.some((c) => c.handle === x.handle))],
};
export type Policy = { handle: string; title: string; body: string };
export const getPolicy = (handle: string): Policy | null => extras.policies.find((p) => p.handle === handle) ?? null;
export const getPolicies = (): Policy[] => extras.policies;
type RawProduct = (typeof store.products)[number] & { collections?: { nodes: { handle: string; title: string }[] } };
const raw = store.products as RawProduct[];
const PRODUCTS: Product[] = raw.map(normalizeProduct); // best-selling order
const byHandle = new Map(PRODUCTS.map((p) => [p.handle, p]));

const norm = (s: string) => s.toLowerCase().normalize('NFKD');
const matches = (p: Product, q: string) => {
  const hay = norm([p.title, p.productType, p.vendor, p.tags.join(' '), p.description].join(' '));
  return norm(q).split(/\s+/).filter(Boolean).every((t) => hay.includes(t));
};

function sortProducts(list: Product[], sortKey = 'BEST_SELLING', reverse = false): Product[] {
  const out = [...list];
  const best = (p: Product) => PRODUCTS.indexOf(p);
  const cmp: Record<string, (a: Product, b: Product) => number> = {
    BEST_SELLING: (a, b) => best(a) - best(b),
    COLLECTION_DEFAULT: () => 0,
    MANUAL: () => 0,
    RELEVANCE: () => 0,
    CREATED: (a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt),
    CREATED_AT: (a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt),
    PRICE: (a, b) => a.price - b.price,
    TITLE: (a, b) => a.title.localeCompare(b.title),
  };
  out.sort(cmp[sortKey] || cmp.BEST_SELLING);
  return reverse ? out.reverse() : out;
}

/* ---------------- products ---------------- */
export const getProduct = (handle: string) => byHandle.get(handle) ?? null;

export function getProducts(opts: { first?: number; sortKey?: string; reverse?: boolean; query?: string } = {}): Product[] {
  const { first = 50, sortKey = 'BEST_SELLING', reverse = false, query } = opts;
  const list = query ? PRODUCTS.filter((p) => matches(p, query)) : PRODUCTS;
  return sortProducts(list, sortKey, reverse).slice(0, first);
}

export const getProductHandles = () => PRODUCTS.map((p) => p.handle);

export function getProductCollections(handle: string) {
  return store.collections.filter((c) => c.productHandles.includes(handle)).map((c) => ({ handle: c.handle, title: c.title }));
}

/** Products sharing a collection, then the rest by best-selling. */
export function getRecommendations(productId: string): Product[] {
  const p = PRODUCTS.find((x) => x.id === productId);
  if (!p) return [];
  const mine = new Set(store.collections.filter((c) => c.productHandles.includes(p.handle)).flatMap((c) => c.productHandles));
  const others = PRODUCTS.filter((x) => x.handle !== p.handle);
  return [...others.filter((x) => mine.has(x.handle)), ...others.filter((x) => !mine.has(x.handle))];
}

export const searchProducts = (q: string, first = 50) => PRODUCTS.filter((p) => matches(p, q)).slice(0, first);

/* ---------------- collections ---------------- */
const COLLECTIONS: Collection[] = store.collections.map(({ productHandles, ...c }) => normalizeCollection(c, productHandles.length));

export const getCollections = () => [...COLLECTIONS].sort((a, b) => a.title.localeCompare(b.title));

export function getCollection(handle: string, opts: { sortKey?: string; reverse?: boolean; first?: number } = {}) {
  const { sortKey = 'COLLECTION_DEFAULT', reverse = false, first = 100 } = opts;
  if (handle === 'all') {
    const products = sortProducts(PRODUCTS, sortKey === 'COLLECTION_DEFAULT' ? 'BEST_SELLING' : sortKey, reverse).slice(0, first);
    return {
      collection: { id: 'all', handle: 'all', title: 'All products', description: '', descriptionHtml: '', image: null, productCount: products.length, seo: { title: 'All products', description: null } } as Collection,
      products,
    };
  }
  const c = store.collections.find((x) => x.handle === handle);
  if (!c) return null;
  const members = c.productHandles.map((h) => byHandle.get(h)).filter((p): p is Product => !!p);
  const products = sortProducts(members, sortKey, reverse).slice(0, first);
  return { collection: COLLECTIONS.find((x) => x.handle === handle)!, products };
}

/* ---------------- pages + blogs ---------------- */
export const getPage = (handle: string): Page | null => (store.pages.find((p) => p.handle === handle) as Page | undefined) ?? null;
export const getPages = () => store.pages.map((p) => ({ handle: p.handle, title: p.title, updatedAt: store.takenAt }));

const toSummary = (a: any) => ({ handle: a.handle, title: a.title, excerpt: a.excerpt || '', publishedAt: a.publishedAt, image: a.image ?? null, author: a.authorV2?.name ?? null });

export const getBlogs = () => store.blogs.map((b: any) => ({ handle: b.handle, title: b.title, articles: b.articles.map((a: any) => ({ handle: a.handle, publishedAt: a.publishedAt })) }));

export function getBlog(handle: string) {
  const b: any = store.blogs.find((x) => x.handle === handle);
  if (!b) return null;
  const articles = [...b.articles].sort((x: any, y: any) => Date.parse(y.publishedAt) - Date.parse(x.publishedAt)).map(toSummary);
  return { handle: b.handle, title: b.title, seo: { title: null, description: null }, articles };
}

export function getArticle(blog: string, handle: string) {
  const b: any = store.blogs.find((x) => x.handle === blog);
  const a: any = b?.articles.find((x: any) => x.handle === handle);
  if (!a) return null;
  return { ...toSummary(a), contentHtml: a.contentHtml, tags: a.tags || [], seo: a.seo || { title: null, description: null }, blog: { handle: b.handle, title: b.title } };
}

/* ---------------- search ---------------- */
export function searchDocs(q: string) {
  const n = norm(q);
  const pages = store.pages
    .filter((p) => norm(p.title + ' ' + p.bodySummary).includes(n))
    .map((p) => ({ type: 'page' as const, title: p.title, url: `/pages/${p.handle}`, excerpt: p.bodySummary || '', image: null }));
  const articles = store.blogs.flatMap((b: any) =>
    b.articles
      .filter((a: any) => norm(a.title + ' ' + (a.excerpt || '')).includes(n))
      .map((a: any) => ({ type: 'article' as const, title: a.title, url: `/blogs/${b.handle}/${a.handle}`, excerpt: a.excerpt || '', image: a.image?.url ?? null })),
  );
  return [...pages, ...articles];
}

export function predictiveSearch(q: string) {
  const n = norm(q);
  return {
    products: searchProducts(q, 6).map((p) => ({ title: p.title, url: `/products/${p.handle}`, image: p.featuredImage?.url ?? null, price: (p.price / 100).toFixed(2) })),
    collections: COLLECTIONS.filter((c) => norm(c.title).includes(n)).slice(0, 6).map((c) => ({ title: c.title, url: `/collections/${c.handle}` })),
    pages: store.pages.filter((p) => norm(p.title).includes(n)).slice(0, 6).map((p) => ({ title: p.title, url: `/pages/${p.handle}` })),
    articles: store.blogs.flatMap((b: any) => b.articles.filter((a: any) => norm(a.title).includes(n)).map((a: any) => ({ title: a.title, url: `/blogs/${b.handle}/${a.handle}` }))).slice(0, 6),
  };
}

/* ---------------- handle index (proxy 404s) ---------------- */
export const handleIndex = () => ({
  products: new Set(PRODUCTS.map((p) => p.handle)),
  collections: new Set(store.collections.map((c) => c.handle)),
  pages: new Set(store.pages.map((p) => p.handle)),
  policies: new Set(extras.policies.map((p) => p.handle)),
  blogs: new Map(store.blogs.map((b: any) => [b.handle, new Set<string>(b.articles.map((a: any) => a.handle))])),
  at: Date.now(),
});

/** Variant lookup for the local cart. */
export function findVariant(id: string) {
  for (const p of PRODUCTS) {
    const v = p.variants.find((x) => x.id === id || String(x.numericId) === id);
    if (v) return { product: p, variant: v };
  }
  return null;
}
/* eslint-enable @typescript-eslint/no-explicit-any */
