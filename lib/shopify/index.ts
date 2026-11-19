import 'server-only';
import { cacheLife, cacheTag } from 'next/cache';
import { COLLECTION, IMAGE, PRODUCT } from './queries';
import type { Collection, Page, Product } from './types';
import { normalizeCollection, normalizeProduct } from './normalize';
import * as local from '../data/local';
import { SHOPIFY_ENABLED, shopifyFetch } from './client';

export * from './types';
export { normalizeProduct } from './normalize';

export const TAGS = { products: 'products', collections: 'collections', pages: 'pages' } as const;

export type ProductSort = 'BEST_SELLING' | 'CREATED_AT' | 'PRICE' | 'TITLE' | 'RELEVANCE' | 'MANUAL' | 'COLLECTION_DEFAULT';

export async function getProduct(handle: string): Promise<Product | null> {
  'use cache';
  cacheLife('hours');
  cacheTag(TAGS.products, `product:${handle}`);
  if (!SHOPIFY_ENABLED) return local.getProduct(handle);
  const d = await shopifyFetch<{ product: unknown }>(
    `query($h: String!) { product(handle: $h) { ...ProductFields } } ${PRODUCT}`,
    { h: handle },
  );
  return d.product ? normalizeProduct(d.product) : null;
}

export async function getProducts(opts: { first?: number; sortKey?: Exclude<ProductSort, 'MANUAL' | 'COLLECTION_DEFAULT' | 'PRICE'> | 'PRICE'; reverse?: boolean; query?: string } = {}): Promise<Product[]> {
  'use cache';
  cacheLife('hours');
  cacheTag(TAGS.products);
  if (!SHOPIFY_ENABLED) return local.getProducts(opts);
  const { first = 50, sortKey = 'BEST_SELLING', reverse = false, query } = opts;
  const d = await shopifyFetch<{ products: { nodes: unknown[] } }>(
    `query($first: Int!, $sortKey: ProductSortKeys, $reverse: Boolean, $query: String) {
      products(first: $first, sortKey: $sortKey, reverse: $reverse, query: $query) { nodes { ...ProductFields } }
    } ${PRODUCT}`,
    { first, sortKey, reverse, query: query ?? null },
  );
  return d.products.nodes.map(normalizeProduct);
}

export async function getProductsByHandles(handles: string[]): Promise<Product[]> {
  const all = await Promise.all(handles.map((h) => getProduct(h)));
  return all.filter((p): p is Product => !!p);
}

export async function getCollections(): Promise<Collection[]> {
  'use cache';
  cacheLife('hours');
  cacheTag(TAGS.collections);
  if (!SHOPIFY_ENABLED) return local.getCollections();
  const d = await shopifyFetch<{ collections: { nodes: (Record<string, unknown> & { products: { nodes: unknown[] } })[] } }>(
    `query { collections(first: 100, sortKey: TITLE) { nodes { ...CollectionFields products(first: 250) { nodes { id } } } } } ${COLLECTION} ${IMAGE}`,
  );
  return d.collections.nodes.map(({ products, ...c }) => normalizeCollection(c, products.nodes.length));
}

export async function getCollection(
  handle: string,
  opts: { sortKey?: string; reverse?: boolean; first?: number } = {},
): Promise<{ collection: Collection; products: Product[] } | null> {
  'use cache';
  cacheLife('hours');
  cacheTag(TAGS.collections, TAGS.products, `collection:${handle}`);
  if (!SHOPIFY_ENABLED) return local.getCollection(handle, opts);
  const { sortKey = 'COLLECTION_DEFAULT', reverse = false, first = 100 } = opts;
  if (handle === 'all') {
    const map: Record<string, string> = { COLLECTION_DEFAULT: 'BEST_SELLING', MANUAL: 'BEST_SELLING', RELEVANCE: 'BEST_SELLING', CREATED: 'CREATED_AT' };
    const products = await getProducts({ first, sortKey: (map[sortKey] || sortKey) as 'BEST_SELLING', reverse });
    return {
      collection: { id: 'all', handle: 'all', title: 'All products', description: '', descriptionHtml: '', image: null, productCount: products.length, seo: { title: 'All products', description: null } },
      products,
    };
  }
  const d = await shopifyFetch<{ collection: (Record<string, unknown> & { products: { nodes: unknown[] } }) | null }>(
    `query($h: String!, $first: Int!, $sortKey: ProductCollectionSortKeys, $reverse: Boolean) {
      collection(handle: $h) { ...CollectionFields products(first: $first, sortKey: $sortKey, reverse: $reverse) { nodes { ...ProductFields } } }
    } ${COLLECTION} ${PRODUCT}`,
    { h: handle, first, sortKey, reverse },
  );
  if (!d.collection) return null;
  const { products, ...c } = d.collection;
  const list = products.nodes.map(normalizeProduct);
  return { collection: normalizeCollection(c, list.length), products: list };
}

export async function getPage(handle: string): Promise<Page | null> {
  'use cache';
  cacheLife('days');
  cacheTag(TAGS.pages, `page:${handle}`);
  if (!SHOPIFY_ENABLED) return local.getPage(handle);
  const d = await shopifyFetch<{ page: Page | null }>(
    `query($h: String!) { page(handle: $h) { id handle title body bodySummary seo { title description } } }`,
    { h: handle },
  );
  return d.page;
}

export async function getRecommendations(productId: string, intent: 'RELATED' | 'COMPLEMENTARY' = 'RELATED'): Promise<Product[]> {
  'use cache';
  cacheLife('hours');
  cacheTag(TAGS.products);
  if (!SHOPIFY_ENABLED) return local.getRecommendations(productId);
  const d = await shopifyFetch<{ productRecommendations: unknown[] | null }>(
    `query($id: ID!, $intent: ProductRecommendationIntent) { productRecommendations(productId: $id, intent: $intent) { ...ProductFields } } ${PRODUCT}`,
    { id: productId, intent },
  );
  return (d.productRecommendations || []).map(normalizeProduct);
}

export async function searchProducts(q: string, first = 50): Promise<Product[]> {
  'use cache';
  cacheLife('minutes');
  cacheTag(TAGS.products);
  if (!SHOPIFY_ENABLED) return local.searchProducts(q, first);
  const d = await shopifyFetch<{ search: { nodes: unknown[] } }>(
    `query($q: String!, $first: Int!) { search(query: $q, first: $first, types: [PRODUCT], prefix: LAST) { nodes { ... on Product { ...ProductFields } } } } ${PRODUCT}`,
    { q, first },
  );
  return d.search.nodes.map(normalizeProduct);
}

export type Suggest = {
  products: { title: string; url: string; image: string | null; price: string }[];
  collections: { title: string; url: string }[];
  pages: { title: string; url: string }[];
  articles: { title: string; url: string }[];
};

export async function predictiveSearch(q: string): Promise<Suggest> {
  'use cache';
  cacheLife('minutes');
  cacheTag(TAGS.products);
  if (!SHOPIFY_ENABLED) return local.predictiveSearch(q);
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const d = await shopifyFetch<{ predictiveSearch: any }>(
    `query($q: String!) { predictiveSearch(query: $q, limit: 6, types: [PRODUCT, COLLECTION, PAGE, ARTICLE]) {
      products { title handle featuredImage { url } priceRange { minVariantPrice { amount } } }
      collections { title handle }
      pages { title handle }
      articles { title handle blog { handle } }
    } }`,
    { q },
  );
  const r = d.predictiveSearch || {};
  return {
    products: (r.products || []).map((p: any) => ({ title: p.title, url: `/products/${p.handle}`, image: p.featuredImage?.url ?? null, price: p.priceRange.minVariantPrice.amount })),
    collections: (r.collections || []).map((c: any) => ({ title: c.title, url: `/collections/${c.handle}` })),
    pages: (r.pages || []).map((c: any) => ({ title: c.title, url: `/pages/${c.handle}` })),
    articles: (r.articles || []).map((c: any) => ({ title: c.title, url: `/blogs/${c.blog.handle}/${c.handle}` })),
  };
  /* eslint-enable @typescript-eslint/no-explicit-any */
}
