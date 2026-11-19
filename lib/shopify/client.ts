import 'server-only';

/**
 * Storefront API client.
 *
 * SHOPIFY_STORE_DOMAIN — the shop's API host. In production use the
 *   permanent `your-store.myshopify.com` domain (sakooon.com will point at
 *   this Next.js app once it goes live).
 * SHOPIFY_STOREFRONT_TOKEN — optional. Without it the API runs in
 *   tokenless mode, which covers products, collections, pages, search and
 *   cart. Add a token (public or private) for higher rate limits and
 *   metafield access.
 */
/**
 * The frontend runs on local sample data (data/store.json) until a store is
 * configured. Set SHOPIFY_STORE_DOMAIN to switch every data function, the
 * cart and the 404 handle checks over to the Storefront API.
 */
export const SHOPIFY_ENABLED = !!process.env.SHOPIFY_STORE_DOMAIN;
export const SHOPIFY_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN || '';
export const API_VERSION = process.env.SHOPIFY_API_VERSION || '2026-10';
const ENDPOINT = `https://${SHOPIFY_DOMAIN}/api/${API_VERSION}/graphql.json`;

type Vars = Record<string, unknown>;

export class ShopifyError extends Error {
  constructor(message: string, public details?: unknown) {
    super(message);
  }
}

export async function shopifyFetch<T>(query: string, variables: Vars = {}, opts: { buyerIp?: string } = {}): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json', Accept: 'application/json' };
  const pub = process.env.SHOPIFY_STOREFRONT_TOKEN;
  const priv = process.env.SHOPIFY_STOREFRONT_PRIVATE_TOKEN;
  if (priv) headers['Shopify-Storefront-Private-Token'] = priv;
  else if (pub) headers['X-Shopify-Storefront-Access-Token'] = pub;
  if (opts.buyerIp && priv) headers['Shopify-Storefront-Buyer-IP'] = opts.buyerIp;

  let res: Response | undefined;
  for (let attempt = 0; attempt < 3; attempt++) {
    res = await fetch(ENDPOINT, { method: 'POST', headers, body: JSON.stringify({ query, variables }), cache: 'no-store' });
    if (res.status !== 429 && res.status < 500) break;
    await new Promise((r) => setTimeout(r, 300 * (attempt + 1)));
  }
  if (!res) throw new ShopifyError('No response from Shopify');
  const json = (await res.json().catch(() => null)) as { data?: T; errors?: unknown } | null;
  if (!res.ok || !json || json.errors) {
    throw new ShopifyError(`Shopify request failed (${res.status})`, json?.errors ?? json);
  }
  return json.data as T;
}
