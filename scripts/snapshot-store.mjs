#!/usr/bin/env node
/**
 * One-off snapshot of the current sakooon.com catalogue so the frontend runs
 * with no Shopify connection (local sample data).
 *
 *   node scripts/snapshot-store.mjs [storeDomain]
 *
 * Writes data/store.json (raw Storefront API nodes) and downloads every
 * product/collection image plus every image hard-coded in the components
 * into public/images/ as a single WebP master (max 1600px). The app resizes
 * them on demand through next/image (see lib/utils.ts → img()).
 */
import fs from 'node:fs';
import path from 'node:path';

const DOMAIN = process.argv[2] || 'sakooon.com';
const API = `https://${DOMAIN}/api/2026-10/graphql.json`;
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const IMG_DIR = path.join(ROOT, 'public/images');
const CDN = /https:\/\/cdn\.shopify\.com\/s\/files\/1\/0792\/8394\/5575\/(?:files|products)\/([A-Za-z0-9._%-]+?\.(?:png|jpe?g|webp|gif|avif))/g;

async function gql(query, variables = {}) {
  const res = await fetch(API, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ query, variables }) });
  const json = await res.json();
  if (json.errors) throw new Error(JSON.stringify(json.errors));
  return json.data;
}

const IMG = 'url altText width height';
const PRODUCT = `
  id handle title vendor productType tags description descriptionHtml createdAt availableForSale
  seo { title description }
  options { name optionValues { name swatch { color image { previewImage { url } } } } }
  featuredImage { ${IMG} }
  images(first: 30) { nodes { ${IMG} } }
  variants(first: 100) { nodes { id title availableForSale price { amount } compareAtPrice { amount } selectedOptions { name value } image { ${IMG} } } }
  collections(first: 20) { nodes { handle title } }`;

// split into several queries to stay under the API's complexity limit
const products = (await gql(`{ products(first: 100, sortKey: BEST_SELLING) { nodes { ${PRODUCT} } } }`)).products;
const collections = (await gql(`{ collections(first: 100, sortKey: TITLE) { nodes { id handle title description descriptionHtml seo { title description } image { ${IMG} } products(first: 250) { nodes { handle } } } } }`)).collections;
const pages = (await gql(`{ pages(first: 100) { nodes { id handle title body bodySummary seo { title description } } } }`)).pages;
const blogs = (await gql(`{ blogs(first: 20) { nodes { handle title articles(first: 100) { nodes { handle title excerpt contentHtml publishedAt image { ${IMG} } authorV2 { name } seo { title description } } } } } }`)).blogs;
const d = { products, collections, pages, blogs };

const store = {
  snapshotOf: DOMAIN,
  takenAt: new Date().toISOString(),
  products: d.products.nodes, // already in best-selling order
  collections: d.collections.nodes.map(({ products, ...c }) => ({ ...c, productHandles: products.nodes.map((p) => p.handle) })),
  pages: d.pages.nodes,
  blogs: d.blogs.nodes.map((b) => ({ handle: b.handle, title: b.title, articles: b.articles.nodes })),
};

/* ---- images: collect from the snapshot and from the source tree ---- */
const names = new Set();
const collect = (s) => { for (const m of s.matchAll(CDN)) names.add(decodeURIComponent(m[1])); };
collect(JSON.stringify(store));
const walk = (dir) => {
  for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, f.name);
    if (f.isDirectory()) walk(p);
    else if (/\.(tsx?|css|json)$/.test(f.name)) collect(fs.readFileSync(p, 'utf8'));
  }
};
['app', 'components', 'lib'].forEach((d) => walk(path.join(ROOT, d)));

// rewrite snapshot image URLs to the local masters
const local = (name) => `/images/${name.replace(/\.[a-z]+$/i, '')}.webp`;
const json = JSON.stringify(store, null, 1).replace(CDN, (_, n) => local(decodeURIComponent(n))).replace(/(\/images\/[^"?]+\.webp)\?v=\d+/g, '$1');
fs.mkdirSync(path.join(ROOT, 'data'), { recursive: true });
fs.writeFileSync(path.join(ROOT, 'data/store.json'), json);

fs.mkdirSync(IMG_DIR, { recursive: true });
let bytes = 0, fetched = 0;
for (const name of names) {
  const out = path.join(IMG_DIR, local(name).slice('/images/'.length));
  if (fs.existsSync(out)) { bytes += fs.statSync(out).size; continue; }
  // the shop domain proxies Shopify's CDN and serves WebP on request
  const res = await fetch(`https://${DOMAIN}/cdn/shop/files/${encodeURIComponent(name)}?width=1600&format=webp`, { headers: { Accept: 'image/webp' } });
  if (!res.ok) { console.warn('skip', name, res.status); continue; }
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(out, buf);
  bytes += buf.length; fetched++;
}
console.log(`products ${store.products.length}, collections ${store.collections.length}, pages ${store.pages.length}, blogs ${store.blogs.length}`);
console.log(`images ${names.size} (${fetched} downloaded), ${(bytes / 1048576).toFixed(1)} MB in public/images`);
