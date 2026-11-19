/**
 * Lightweight handle index used by proxy.ts to answer unknown URLs with a real
 * 404 before the page starts streaming (with Cache Components a notFound()
 * inside the page can only produce a 200 + noindex). Kept in module memory.
 */
import { handleIndex as localIndex } from '../data/local';

const DOMAIN = process.env.SHOPIFY_STORE_DOMAIN || '';
const VERSION = process.env.SHOPIFY_API_VERSION || '2026-10';
const TTL = 5 * 60_000;
const MISS_RECHECK = 30_000;

export type HandleIndex = { products: Set<string>; collections: Set<string>; pages: Set<string>; policies?: Set<string>; blogs: Map<string, Set<string>>; at: number };

let index: HandleIndex | null = null;
let inflight: Promise<HandleIndex | null> | null = null;

type Page<T> = { nodes: T[]; pageInfo: { hasNextPage: boolean; endCursor: string | null } };

async function gql<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (process.env.SHOPIFY_STOREFRONT_PRIVATE_TOKEN) headers['Shopify-Storefront-Private-Token'] = process.env.SHOPIFY_STOREFRONT_PRIVATE_TOKEN;
  else if (process.env.SHOPIFY_STOREFRONT_TOKEN) headers['X-Shopify-Storefront-Access-Token'] = process.env.SHOPIFY_STOREFRONT_TOKEN;
  const res = await fetch(`https://${DOMAIN}/api/${VERSION}/graphql.json`, { method: 'POST', headers, body: JSON.stringify({ query, variables }), signal: AbortSignal.timeout(4000) });
  const json = await res.json();
  if (!res.ok || json.errors) throw new Error('handle index fetch failed');
  return json.data as T;
}

async function all(field: 'products' | 'collections' | 'pages'): Promise<Set<string>> {
  const out = new Set<string>();
  let after: string | null = null;
  for (let i = 0; i < 20; i++) {
    const d: Record<string, Page<{ handle: string }>> = await gql(
      `query($after: String) { ${field}(first: 250, after: $after) { nodes { handle } pageInfo { hasNextPage endCursor } } }`,
      { after },
    );
    d[field].nodes.forEach((n) => out.add(n.handle));
    if (!d[field].pageInfo.hasNextPage) break;
    after = d[field].pageInfo.endCursor;
  }
  return out;
}

async function load(): Promise<HandleIndex | null> {
  try {
    const [products, collections, pages, b] = await Promise.all([
      all('products'),
      all('collections'),
      all('pages'),
      gql<{ blogs: { nodes: { handle: string; articles: { nodes: { handle: string }[] } }[] } }>(
        `{ blogs(first: 20) { nodes { handle articles(first: 250) { nodes { handle } } } } }`,
      ),
    ]);
    const blogs = new Map(b.blogs.nodes.map((x) => [x.handle, new Set(x.articles.nodes.map((a) => a.handle))]));
    index = { products, collections, pages, blogs, at: Date.now() };
    return index;
  } catch {
    return index; // keep the stale index (or null → fail open)
  } finally {
    inflight = null;
  }
}

export async function getHandleIndex(forceIfOlderThan = TTL): Promise<HandleIndex | null> {
  if (!DOMAIN) return (index ||= localIndex());
  if (index && Date.now() - index.at < forceIfOlderThan) return index;
  return (inflight ||= load());
}

/** true = exists, false = definitely unknown, null = could not tell (fail open). */
export async function handleExists(kind: 'products' | 'collections' | 'pages' | 'policies', handle: string, extra: string[] = []): Promise<boolean | null> {
  if (extra.includes(handle)) return true;
  let ix = await getHandleIndex();
  if (!ix) return null;
  if (ix[kind]?.has(handle)) return true;
  ix = await getHandleIndex(MISS_RECHECK); // maybe it was just created
  return ix ? !!ix[kind]?.has(handle) : null;
}

export async function articleExists(blog: string, article?: string): Promise<boolean | null> {
  let ix = await getHandleIndex();
  if (!ix) return null;
  const check = (i: HandleIndex) => i.blogs.has(blog) && (!article || i.blogs.get(blog)!.has(article));
  if (check(ix)) return true;
  ix = await getHandleIndex(MISS_RECHECK);
  return ix ? check(ix) : null;
}
