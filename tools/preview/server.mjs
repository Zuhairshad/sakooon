/**
 * Local preview for the Sakooon theme, without a Shopify store.
 *
 * Renders the theme's real Liquid (layout, JSON templates, section groups,
 * sections, snippets) with LiquidJS, using Shopify-shaped objects built from
 * the headless repo's sample catalogue (../sakooon/data/store.json) and images
 * (../sakooon/public/images). Shopify-only filters/tags are shimmed. This is a
 * dev tool: Liquid output is close to Shopify's but not identical, so check
 * real behaviour with `shopify theme dev` before shipping.
 *
 *   node tools/preview/server.mjs        # http://localhost:9292
 *   PORT=9300 HEADLESS=/path/to/sakooon node tools/preview/server.mjs
 */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Liquid, Tag, Hash } from 'liquidjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const THEME = path.resolve(__dirname, '..', '..');
const HEADLESS_CANDIDATES = [process.env.HEADLESS, path.join(THEME, '..', 'sakooon'), path.join(THEME, '..', '..', 'sakooon'), '/Users/shad/sakooon'].filter(Boolean).map((p) => path.resolve(p));
const HEADLESS = HEADLESS_CANDIDATES.find((p) => fs.existsSync(path.join(p, 'data', 'store.json'))) || HEADLESS_CANDIDATES[0];
const PORT = Number(process.env.PORT || 9292);
const IMAGES = path.join(HEADLESS, 'public', 'images');

const readJson = (file) => {
  const src = fs.readFileSync(file, 'utf8').replace(/^\s*\/\*[\s\S]*?\*\//, '');
  return JSON.parse(src);
};
const exists = (f) => fs.existsSync(f);

/* ------------------------------------------------------------------ data */

const snapshot = readJson(path.join(HEADLESS, 'data', 'store.json'));
const extras = exists(path.join(HEADLESS, 'data', 'extras.json')) ? readJson(path.join(HEADLESS, 'data', 'extras.json')) : { collections: [], policies: [] };
const gidNum = (gid) => Number(String(gid || '').split('/').pop()) || 0;
const cents = (m) => Math.round(Number(m?.amount ?? m ?? 0) * 100);

function image(img, id = 0) {
  if (!img) return null;
  const src = img.url || img.src;
  return {
    id, src, url: src, alt: img.altText || img.alt || '', width: img.width || 1200, height: img.height || 1500,
    aspect_ratio: (img.width || 1200) / (img.height || 1500), media_type: 'image', presentation: {},
    preview_image: { src, url: src, alt: img.altText || '', width: img.width, height: img.height, aspect_ratio: (img.width || 1200) / (img.height || 1500) },
    toString() { return src; },
  };
}

/** shopify://shop_images/name.jpg → the matching local .webp, else nil (theme falls back to its SVG art). */
function shopImage(ref) {
  const m = /^shopify:\/\/shop_images\/(.+)$/.exec(ref || '');
  if (!m) return null;
  const base = m[1].replace(/\.[a-z0-9]+$/i, '');
  const file = fs.readdirSync(IMAGES).find((f) => f.replace(/\.[a-z0-9]+$/i, '') === base);
  return file ? image({ url: `/images/${file}`, altText: '', width: 1600, height: 1200 }) : null;
}

/* Fixtures (tools/preview/fixtures/*.json) extend the sample catalogue with shapes the snapshot lacks (colour x size variants, metafields). */
const FIXTURE_DIR = path.join(__dirname, 'fixtures');
const FIXTURES = exists(FIXTURE_DIR) ? fs.readdirSync(FIXTURE_DIR).filter((f) => f.endsWith('.json')).map((f) => readJson(path.join(FIXTURE_DIR, f))) : [];
const FIXTURE_METAFIELDS = {};
for (const fx of FIXTURES) {
  for (const fp of fx.products || []) if (!snapshot.products.some((p) => p.handle === fp.handle)) snapshot.products.push(fp);
  for (const [handle, handles] of Object.entries(fx.collectionProducts || {})) { const c = snapshot.collections.find((x) => x.handle === handle); if (c) c.productHandles = [...new Set([...(c.productHandles || []), ...handles])]; }
  Object.assign(FIXTURE_METAFIELDS, fx.metafields || {});
}
const collectionsRaw = [...snapshot.collections, ...extras.collections.filter((x) => !snapshot.collections.some((c) => c.handle === x.handle))];

const PRODUCTS = snapshot.products.map((p) => {
  const imgs = (p.images?.nodes || []).map((im, i) => image(im, gidNum(p.id) * 10 + i));
  const opts = p.options || [];
  const variants = (p.variants?.nodes || []).map((v, i) => {
    const values = opts.map((o) => v.selectedOptions?.find((s) => s.name === o.name)?.value);
    return {
      id: gidNum(v.id), title: v.title, price: cents(v.price), compare_at_price: v.compareAtPrice ? cents(v.compareAtPrice) : null,
      available: !!v.availableForSale, options: values, option1: values[0] ?? null, option2: values[1] ?? null, option3: values[2] ?? null,
      featured_image: image(v.image), featured_media: image(v.image), image: image(v.image), sku: '', inventory_quantity: v.availableForSale ? 10 : 0,
      inventory_management: 'shopify', inventory_policy: 'deny', requires_shipping: true, weight: 0, position: i + 1,
      url: `/products/${p.handle}?variant=${gidNum(v.id)}`, selected: i === 0,
    };
  });
  const first = variants.find((v) => v.available) || variants[0];
  const prices = variants.map((v) => v.price);
  const compares = variants.map((v) => v.compare_at_price || 0);
  return {
    id: gidNum(p.id), handle: p.handle, title: p.title, vendor: p.vendor, type: p.productType, tags: p.tags || [],
    description: p.descriptionHtml || p.description || '', content: p.descriptionHtml || '', url: `/products/${p.handle}`,
    created_at: p.createdAt, published_at: p.createdAt, available: !!p.availableForSale,
    price: Math.min(...prices), price_min: Math.min(...prices), price_max: Math.max(...prices), price_varies: new Set(prices).size > 1,
    compare_at_price: Math.max(...compares) || null, compare_at_price_min: Math.min(...compares) || null, compare_at_price_max: Math.max(...compares) || null,
    featured_image: imgs[0] || null, featured_media: imgs[0] || null, images: imgs, media: imgs,
    variants, first_available_variant: first, selected_variant: null, selected_or_first_available_variant: first,
    has_only_default_variant: variants.length === 1 && variants[0].title === 'Default Title',
    options: opts.map((o) => o.name),
    options_with_values: opts.map((o, i) => ({
      name: o.name, position: i + 1, values: o.optionValues.map((v) => v.name), selected_value: first?.options[i],
    })),
    options_by_name: Object.fromEntries(opts.map((o, i) => [o.name, { name: o.name, values: o.optionValues.map((v) => v.name), selected_value: first?.options[i] }])),
    object_type: 'product', collections: [], metafields: FIXTURE_METAFIELDS[p.handle] || {}, seo: p.seo, template_suffix: null, requires_selling_plan: false, selling_plan_groups: [],
  };
});
const productByHandle = Object.fromEntries(PRODUCTS.map((p) => [p.handle, p]));

const COLLECTIONS = collectionsRaw.map((c) => {
  const products = (c.productHandles || []).map((h) => productByHandle[h]).filter(Boolean);
  return {
    id: gidNum(c.id), handle: c.handle, title: c.title, description: c.descriptionHtml || '', url: `/collections/${c.handle}`,
    image: image(c.image), featured_image: image(c.image) || products[0]?.featured_image || null,
    products, products_count: products.length, all_products_count: products.length, all_tags: [],
    filters: [], sort_options: SORT_OPTIONS(), sort_by: '', default_sort_by: 'best-selling', template_suffix: null,
  };
});
function SORT_OPTIONS() {
  return [['manual', 'Featured'], ['best-selling', 'Best selling'], ['title-ascending', 'Alphabetically, A-Z'], ['price-ascending', 'Price, low to high'], ['price-descending', 'Price, high to low'], ['created-descending', 'Date, new to old']]
    .map(([value, name]) => ({ value, name }));
}
for (const p of PRODUCTS) p.collections = COLLECTIONS.filter((c) => c.products.includes(p));
const ALL = { id: 0, handle: 'all', title: 'All products', description: '', url: '/collections/all', products: PRODUCTS, products_count: PRODUCTS.length, all_products_count: PRODUCTS.length, filters: [], sort_options: SORT_OPTIONS(), all_tags: [] };
const collectionByHandle = Object.fromEntries([...COLLECTIONS, ALL].map((c) => [c.handle, c]));

const PAGES = [...snapshot.pages, ...(extras.policies || []).map((p) => ({ handle: p.handle, title: p.title, body: p.body }))].map((p) => ({
  id: gidNum(p.id), handle: p.handle, title: p.title, content: p.body || p.bodyHtml || '', url: `/pages/${p.handle}`, template_suffix: null,
}));
const pageByHandle = Object.fromEntries(PAGES.map((p) => [p.handle, p]));

/* ---------------------------------------------------- metaobjects / metafields (fixtures)
   fixtures: { "metaobjects": { "fabric": [ { "handle": "percale", "fields": { "name": "Percale", "softness": { "rating": 4 }, "texture_image": "image:file.webp",
              "related_products": ["product:handle"], "collection": "collection:bed-sheets", "care_guide": "page:about", "certifications": ["metaobject:certification/oeko"] } } ] },
              "metafields": { "<product handle>": { "sakooon": { "fabric": "metaobject:fabric/percale", "dimensions": "<p>..</p>" } } } }
   Values render like Shopify: `{{ obj.field }}` prints the value, `obj.field.value` is the resolved object/list, `metafield_tag` renders HTML. */
const METAOBJECTS = {};
function resolveMetaValue(raw) {
  if (Array.isArray(raw)) return raw.map(resolveMetaValue);
  if (raw && typeof raw === 'object') {
    if ('rating' in raw) return { rating: Number(raw.rating), scale_min: raw.scale_min ?? 1, scale_max: raw.scale_max ?? 5, toString() { return String(raw.rating); } };
    return raw;
  }
  if (typeof raw !== 'string') return raw;
  let m;
  if ((m = /^image:(.+)$/.exec(raw))) return shopImage(`shopify://shop_images/${m[1]}`) || image({ url: `/images/${m[1]}`, altText: '', width: 1600, height: 2000 });
  if ((m = /^product:(.+)$/.exec(raw))) return productByHandle[m[1]] || null;
  if ((m = /^collection:(.+)$/.exec(raw))) return collectionByHandle[m[1]] || null;
  if ((m = /^page:(.+)$/.exec(raw))) return pageByHandle[m[1]] || null;
  if ((m = /^metaobject:([a-z0-9_]+)\/(.+)$/.exec(raw))) return METAOBJECTS[m[1]]?.[m[2]] || null;
  return raw;
}
const metaString = (v) => (v == null ? '' : Array.isArray(v) ? v.map(metaString).join(', ') : typeof v === 'object' ? (v.title || v.name || v.src || v.toString()) : String(v));
function metafield(raw, key = '') {
  if (raw === undefined || raw === null || raw === '') return null;
  const value = resolveMetaValue(raw);
  const list = Array.isArray(value);
  const type = list ? 'list.' : /^<[a-z]/.test(String(raw)) ? 'rich_text_field' : typeof raw === 'number' ? 'number_integer' : 'single_line_text_field';
  return { key, value, type, list_type: list, toString() { return metaString(value); }, toJSON() { return value; } };
}
function wrapNamespaces(obj = {}) {
  return Object.fromEntries(Object.entries(obj).map(([ns, fields]) => [ns, Object.fromEntries(Object.entries(fields || {}).map(([k, v]) => [k, metafield(v, k)]))]));
}
for (const fx of FIXTURES) for (const [type, entries] of Object.entries(fx.metaobjects || {})) {
  METAOBJECTS[type] = METAOBJECTS[type] || {};
  for (const e of entries) {
    const obj = { system: { type, handle: e.handle, id: `gid://shopify/Metaobject/${type}-${e.handle}`, url: `/pages/${type}/${e.handle}`, published: e.published !== false }, toString() { return metaString(obj.name?.value || e.handle); } };
    METAOBJECTS[type][e.handle] = obj;
    obj._fields = e.fields || {};
  }
}
for (const [type, byHandle] of Object.entries(METAOBJECTS)) for (const obj of Object.values(byHandle)) { for (const [k, v] of Object.entries(obj._fields)) obj[k] = metafield(v, k); delete obj._fields; }
const SHOP_METAOBJECTS = Object.fromEntries(Object.entries(METAOBJECTS).map(([type, byHandle]) => [type, { ...byHandle, values: Object.values(byHandle).filter((o) => o.system.published) }]));
for (const p of PRODUCTS) p.metafields = wrapNamespaces(FIXTURE_METAFIELDS[p.handle]);
for (const v of PRODUCTS.flatMap((p) => p.variants)) v.metafields = v.metafields || {};
for (const c of COLLECTIONS) c.metafields = wrapNamespaces(FIXTURE_METAFIELDS[`collection:${c.handle}`]);
for (const pg of PAGES) pg.metafields = wrapNamespaces(FIXTURE_METAFIELDS[`page:${pg.handle}`]);

const BLOGS = snapshot.blogs.map((b) => ({
  handle: b.handle, title: b.title, url: `/blogs/${b.handle}`, all_tags: [], tags: [],
  articles: (b.articles || []).map((a) => ({ ...a, url: `/blogs/${b.handle}/${a.handle}`, image: image(a.image), tags: a.tags || [] })),
  articles_count: (b.articles || []).length,
}));
const blogByHandle = Object.fromEntries(BLOGS.map((b) => [b.handle, b]));

/* Linklists: theme settings leave the menu blank (header uses its own blocks), but provide the usual handles. */
const link = (title, url, links = []) => ({ title, url, links, active: false, child_active: false, current: false, type: 'http_link' });
const LINKLISTS = {
  'main-menu': { handle: 'main-menu', title: 'Main menu', links: [link('Home', '/'), link('Shop', '/collections/all', COLLECTIONS.map((c) => link(c.title, c.url))), link('About', '/pages/about'), link('Contact', '/pages/contact')] },
  footer: { handle: 'footer', title: 'Footer', links: PAGES.map((p) => link(p.title, p.url)) },
};
/* Fixture link lists (tools/preview/fixtures/*.json "linklists": { handle: { title, links: [{ title, url, links: [...] }] } }) override the defaults. */
const fixtureLink = (l, level = 1) => ({ ...link(l.title, l.url, (l.links || []).map((c) => fixtureLink(c, level + 1))), levels: depth(l), handle: String(l.title).toLowerCase().replace(/[^a-z0-9]+/g, '-') });
function depth(l) { return l.links && l.links.length ? 1 + Math.max(...l.links.map(depth)) : 0; }
for (const fx of FIXTURES) for (const [handle, ll] of Object.entries(fx.linklists || {})) LINKLISTS[handle] = { handle, title: ll.title || handle, links: (ll.links || []).map((l) => fixtureLink(l)), levels: Math.max(0, ...(ll.links || []).map(depth)) + 1 };
for (const ll of Object.values(LINKLISTS)) if (ll.levels === undefined) ll.levels = Math.max(0, ...ll.links.map(depth)) + 1;

/* ------------------------------------------------------------- settings */

const LOCALE_FILE = path.join(THEME, 'locales', 'en.default.json');
let localeCache = { mtime: 0, data: {} };
function getLocale() {
  try { const mt = fs.statSync(LOCALE_FILE).mtimeMs; if (mt !== localeCache.mtime) localeCache = { mtime: mt, data: readJson(LOCALE_FILE) }; } catch (e) { /* keep last good */ }
  return localeCache.data;
}
const settingsSchema = readJson(path.join(THEME, 'config', 'settings_schema.json'));
const settingsData = readJson(path.join(THEME, 'config', 'settings_data.json'));
const SETTING_DEFAULTS = {};
for (const group of settingsSchema) for (const s of group.settings || []) if (s.id && s.default !== undefined) SETTING_DEFAULTS[s.id] = s.default;
const current = typeof settingsData.current === 'string' ? settingsData.presets?.[settingsData.current] || {} : settingsData.current || {};
const SETTING_TYPES = Object.fromEntries(settingsSchema.flatMap((g) => (g.settings || []).filter((s) => s.id).map((s) => [s.id, s.type])));
const THEME_SETTINGS = resolveSettings({ ...SETTING_DEFAULTS, ...current }, SETTING_TYPES);
delete THEME_SETTINGS.sections;
delete THEME_SETTINGS.content_for_index;

/** Shopify-shaped colour: prints as the hex string, exposes .red/.green/.blue/.alpha. */
function colorObject(hex) {
  if (!hex || typeof hex !== 'string') return hex;
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return hex;
  const n = parseInt(m[1], 16);
  return { red: (n >> 16) & 255, green: (n >> 8) & 255, blue: n & 255, alpha: 1, hex: `#${m[1]}`, toString() { return `#${m[1]}`; }, toJSON() { return `#${m[1]}`; } };
}
/** Shopify-shaped font from a font_picker handle like "inter_n4" (family_weight-style). Approximation: Google Fonts in the preview. */
function fontObject(handle) {
  if (!handle || typeof handle !== 'string') return handle;
  const m = /^(.*)_([ni])(\d)$/.exec(handle);
  const family = (m ? m[1] : handle).split('_').map((w) => w[0].toUpperCase() + w.slice(1)).join(' ');
  const weight = m ? Number(m[3]) * 100 : 400;
  const style = m && m[2] === 'i' ? 'italic' : 'normal';
  return { family, fallback_families: 'sans-serif', weight, style, system: false, 'system?': false, baseline_ratio: 0.5, handle, toString() { return family; } };
}
/** Turn stored setting values (handles, shopify:// refs) into the objects Liquid sees. */
function resolveSettings(values, types) {
  const out = {};
  for (const [k, v] of Object.entries(values)) {
    const t = types[k];
    if (t === 'image_picker') out[k] = shopImage(v);
    else if (t === 'collection') out[k] = collectionByHandle[v] || null;
    else if (t === 'product') out[k] = productByHandle[v] || null;
    else if (t === 'page') out[k] = pageByHandle[v] || null;
    else if (t === 'blog') out[k] = blogByHandle[v] || null;
    else if (t === 'link_list') out[k] = LINKLISTS[v] || null;
    else if (t === 'collection_list') out[k] = (v || []).map((h) => collectionByHandle[h]).filter(Boolean);
    else if (t === 'product_list') out[k] = (v || []).map((h) => productByHandle[h]).filter(Boolean);
    else if (t === 'video') out[k] = null;
    else if (t === 'font_picker') out[k] = fontObject(v);
    else if (t === 'color_scheme_group') out[k] = Object.entries(v || {}).map(([id, def]) => ({ id, settings: Object.fromEntries(Object.entries(def.settings || {}).map(([sk, sv]) => [sk, colorObject(sv)])), toString() { return id; } }));
    else if (t === 'color') out[k] = colorObject(v);
    else out[k] = typeof v === 'string' && v.startsWith('t:') ? tr(v.slice(2)) : v;
  }
  return out;
}

/* ---------------------------------------------------------------- cart */

const cart = { lines: [], note: '' };
function cartObject() {
  const items = cart.lines.map((l, i) => {
    const p = PRODUCTS.find((x) => x.variants.some((v) => v.id === l.id));
    const v = p.variants.find((x) => x.id === l.id);
    return {
      key: `${v.id}:local`, id: v.id, variant_id: v.id, product_id: p.id, product: p, variant: v, quantity: l.quantity,
      title: p.title, product_title: p.title, variant_title: v.title === 'Default Title' ? null : v.title, handle: p.handle,
      price: v.price, original_price: v.price, final_price: v.price, line_price: v.price * l.quantity, final_line_price: v.price * l.quantity,
      original_line_price: v.price * l.quantity, image: v.featured_image || p.featured_image, featured_image: v.featured_image || p.featured_image,
      url: v.url, options_with_values: p.options.map((name, j) => ({ name, value: v.options[j] })), properties: {}, discounts: [], line_level_discount_allocations: [],
      index: i + 1,
    };
  });
  const total = items.reduce((s, it) => s + it.line_price, 0);
  return {
    token: 'local', note: cart.note, attributes: {}, items, item_count: items.reduce((s, it) => s + it.quantity, 0),
    total_price: total, original_total_price: total, items_subtotal_price: total, total_discount: 0, total_weight: 0,
    currency: { iso_code: 'PKR', symbol: 'Rs.' }, requires_shipping: items.length > 0, cart_level_discount_applications: [],
  };
}
const cartJson = () => JSON.parse(JSON.stringify(cartObject(), (k, v) => (k === 'product' || k === 'variant' ? undefined : v)));

/* -------------------------------------------------------------- liquid */

function tr(key, vars = {}) {
  const val = key.split('.').reduce((o, k) => (o == null ? o : o[k]), getLocale());
  if (typeof val !== 'string') return key.includes('.') ? titleCase(key.split('.').pop()) : key;
  return val.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, n) => (vars[n] ?? ''));
}
const titleCase = (s) => s.replace(/_/g, ' ').replace(/^\w/, (c) => c.toUpperCase());
const kw = (args) => Object.fromEntries(args.filter(Array.isArray));
const pos = (args) => args.filter((a) => !Array.isArray(a));
const srcOf = (x) => (x == null ? '' : typeof x === 'string' ? x : x.src || x.url || x.featured_image?.src || x.preview_image?.src || '');

function money(c, fmt = SHOP.money_format) {
  const n = Number(c || 0) / 100;
  const withDec = n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const noDec = Math.round(n).toLocaleString('en-US');
  return fmt.replace(/\{\{\s*(\w+)\s*\}\}/, (_, k) => (k.includes('no_decimals') ? noDec : withDec));
}

const engine = new Liquid({
  root: [path.join(THEME, 'snippets')],
  partials: [path.join(THEME, 'snippets')],
  extname: '.liquid',
  strictFilters: false,
  strictVariables: false,
  ownPropertyOnly: false,
  outputEscape: undefined,
  cache: false,
});

const F = {
  t: (key, ...args) => tr(String(key), kw(args)),
  asset_url: (name) => `/assets/${name}`,
  shopify_asset_url: (name) => `/assets/${name}`,
  file_url: (name) => `/assets/${name}`,
  asset_img_url: (name) => `/assets/${name}`,
  stylesheet_tag: (url) => `<link href="${url}" rel="stylesheet" type="text/css" media="all">`,
  script_tag: (url) => `<script src="${url}" type="text/javascript"></script>`,
  image_url: (x, ...args) => {
    const src = srcOf(x);
    if (!src) return '';
    const { width } = kw(args);
    return width ? `${src}${src.includes('?') ? '&' : '?'}width=${width}` : src;
  },
  img_url: (x) => srcOf(x),
  image_tag: (url, ...args) => {
    const a = kw(args);
    const attrs = Object.entries(a).filter(([k]) => !['widths', 'preload'].includes(k)).map(([k, v]) => ` ${k}="${v}"`).join('');
    return `<img src="${url}"${attrs}>`;
  },
  placeholder_svg_tag: (_, cls = '') => `<svg class="${cls}" viewBox="0 0 525 525" xmlns="http://www.w3.org/2000/svg"><rect width="525" height="525" fill="#E8DECF"/></svg>`,
  money: (c) => money(c),
  money_with_currency: (c) => `${money(c)} PKR`,
  money_without_currency: (c) => money(c, '{{amount}}'),
  money_without_trailing_zeros: (c) => money(c).replace(/\.00$/, ''),
  handleize: (s) => String(s ?? '').toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
  handle: (s) => F.handleize(s),
  pluralize: (n, one, many) => (Number(n) === 1 ? one : many),
  json: (v) => {
    // Shopify serialises a product as its /products/handle.js shape; elsewhere drop cycles (product ↔ collection).
    if (v && v.variants && v.handle) v = productJs(v);
    const seen = new WeakSet();
    return JSON.stringify(v ?? null, (k, val) => {
      if (typeof val === 'function') return undefined;
      if (val && typeof val === 'object') { if (seen.has(val)) return undefined; seen.add(val); }
      return val;
    });
  },
  default_errors: (errs) => (errs ? `<ul class="sn-errors">${[].concat(errs.messages || errs).map((m) => `<li>${m}</li>`).join('')}</ul>` : ''),
  format_address: (a) => (a ? [a.name, a.address1, a.city, a.country].filter(Boolean).join('<br>') : ''),
  link_to: (text, url) => `<a href="${url}">${text}</a>`,
  within: (url) => url,
  time_tag: (d, fmt) => `<time datetime="${d}">${new Date(d).toDateString()}</time>`,
  video_tag: () => '', external_video_tag: () => '', external_video_url: () => '', media_tag: (m) => (m?.src ? `<img src="${m.src}" alt="">` : ''),
  model_viewer_tag: () => '', payment_button: () => '', payment_terms: () => '', payment_type_svg_tag: () => '',
  highlight: (s) => s, color_to_rgb: (s) => s, color_modify: (s) => s, color_brightness: () => 128,
  font_face: (f) => (f && f.family ? `@import url('https://fonts.googleapis.com/css2?family=${encodeURIComponent(f.family).replace(/%20/g, '+')}:ital,wght@${f.style === 'italic' ? 1 : 0},${f.weight || 400}&display=swap');` : ''),
  font_url: (f) => '', font_modify: (f, prop, val) => {
    if (!f || !f.family) return f;
    const out = { ...f, toString() { return f.family; } };
    if (prop === 'weight') out.weight = val === 'bolder' ? Math.min((f.weight || 400) + 300, 900) : val === 'lighter' ? Math.max((f.weight || 400) - 300, 100) : Number(val) || f.weight;
    if (prop === 'style') out.style = val;
    return out;
  }, preload_tag: () => '', inline_asset_content: (name) => {
    const f = path.join(THEME, 'assets', String(name));
    return exists(f) ? fs.readFileSync(f, 'utf8') : '';
  },
  structured_data: () => '',
  metafield_tag: (mf) => {
    const v = mf && mf.value !== undefined ? mf.value : mf;
    if (v == null) return '';
    if (Array.isArray(v)) return `<ul class="list-unstyled">${v.map((x) => `<li>${metaString(x)}</li>`).join('')}</ul>`;
    if (typeof v === 'object' && v.src) return `<img src="${v.src}" alt="${v.alt || ''}">`;
    if (typeof v === 'object' && v.url && v.title) return `<a href="${v.url}">${v.title}</a>`;
    if (typeof v === 'object' && 'rating' in v) return `<span class="metafield-rating">${v.rating}/${v.scale_max}</span>`;
    return String(v);
  },
  metafield_text: (mf) => metaString(mf && mf.value !== undefined ? mf.value : mf),
};
for (const [name, fn] of Object.entries(F)) engine.registerFilter(name, fn);

/* Tags that only matter inside Shopify's editor or are rendered by Shopify itself. */
const stripBlocks = (src) => src.replace(/\{%-?\s*(schema|javascript)\s*-?%\}[\s\S]*?\{%-?\s*end\1\s*-?%\}/g, '');

function blockTag(name, build) {
  engine.registerTag(name, class extends Tag {
    constructor(token, remain, liquid, parser) {
      super(token, remain, liquid);
      this.args = token.args;
      this.tpls = [];
      const stream = parser.parseStream(remain)
        .on(`tag:end${name}`, () => stream.stop())
        .on('template', (t) => this.tpls.push(t))
        .on('end', () => { throw new Error(`tag ${name} not closed`); });
      stream.start();
    }
    *render(ctx, emitter) { yield* build.call(this, ctx, emitter); }
  });
}

blockTag('style', function* (ctx, emitter) {
  emitter.write('<style>');
  yield this.liquid.renderer.renderTemplates(this.tpls, ctx, emitter);
  emitter.write('</style>');
});

const FORM_ACTIONS = {
  product: '/cart/add', contact: '/contact', customer: '/contact#newsletter', customer_login: '/account/login', create_customer: '/account',
  recover_customer_password: '/account/recover', reset_customer_password: '/account/reset', activate_customer_password: '/account/activate',
  customer_address: '/account/addresses', guest_login: '/account/login', new_comment: '/blogs/comments', storefront_password: '/password', localization: '/localization', cart: '/cart',
};
blockTag('form', function* (ctx, emitter) {
  const [, type, rest = ''] = /^\s*['"]([\w-]+)['"]\s*,?\s*([\s\S]*)$/.exec(this.args) || [];
  const hashSrc = rest.replace(/^[\w.[\]'"-]+\s*(,|$)(?!\s*:)/, (m) => (/^[\w-]+\s*:/.test(rest) ? m : ''));
  const attrs = hashSrc.trim() ? yield new Hash(hashSrc).render(ctx) : {};
  const attrStr = Object.entries(attrs).filter(([k]) => !k.startsWith('return_to')).map(([k, v]) => ` ${k.replace(/_/g, '-')}="${v}"`).join('');
  emitter.write(`<form method="post" action="${FORM_ACTIONS[type] || '/'}" accept-charset="UTF-8"${attrStr}><input type="hidden" name="form_type" value="${type}"><input type="hidden" name="utf8" value="✓">`);
  ctx.push({ form: { errors: null, posted_successfully: false, email: '', first_name: '', last_name: '', phone: '', body: '', address: {}, id: type } });
  yield this.liquid.renderer.renderTemplates(this.tpls, ctx, emitter);
  ctx.pop();
  emitter.write('</form>');
});

blockTag('paginate', function* (ctx, emitter) {
  const [, expr, by] = /^\s*([\s\S]+?)\s+by\s+([\s\S]+?)\s*$/.exec(this.args) || [];
  const list = (yield this.liquid.evalValue(expr, ctx)) || [];
  const size = Number(yield this.liquid.evalValue(by, ctx)) || 12;
  const items = Array.isArray(list) ? list.length : 0;
  ctx.push({ paginate: { current_page: 1, current_offset: 0, items, page_size: size, pages: Math.max(1, Math.ceil(items / size)), parts: [], previous: null, next: null } });
  yield this.liquid.renderer.renderTemplates(this.tpls, ctx, emitter);
  ctx.pop();
});

engine.registerTag('section', class extends Tag {
  constructor(token, remain, liquid) { super(token, remain, liquid); this.name = token.args.trim().replace(/^['"]|['"]$/g, ''); }
  *render(ctx, emitter) { emitter.write(yield renderSection(this.name, { type: this.name }, ctx.globals)); }
});
engine.registerTag('sections', class extends Tag {
  constructor(token, remain, liquid) { super(token, remain, liquid); this.name = token.args.trim().replace(/^['"]|['"]$/g, ''); }
  *render(ctx, emitter) { emitter.write(yield renderJsonSections(path.join(THEME, 'sections', `${this.name}.json`), ctx.globals, `sections--${this.name}__`)); }
});
engine.registerTag('layout', class extends Tag {
  constructor(token, remain, liquid) { super(token, remain, liquid); }
  render() { return ''; }
});

/* ------------------------------------------------------------ sections */

const schemaCache = new Map();
function sectionFile(type) {
  const file = path.join(THEME, 'sections', `${type}.liquid`);
  if (!exists(file)) return null;
  const src = fs.readFileSync(file, 'utf8');
  const m = /\{%-?\s*schema\s*-?%\}([\s\S]*?)\{%-?\s*endschema\s*-?%\}/.exec(src);
  let schema = {};
  try { schema = m ? JSON.parse(m[1]) : {}; } catch (e) { console.warn(`schema parse failed: ${type}: ${e.message}`); }
  return { src: stripBlocks(src), schema };
}

function withDefaults(list = [], values = {}) {
  const defaults = Object.fromEntries(list.filter((s) => s.id && s.default !== undefined).map((s) => [s.id, s.default]));
  const types = Object.fromEntries(list.filter((s) => s.id).map((s) => [s.id, s.type]));
  for (const s of list) if (s.id && !(s.id in defaults) && !(s.id in values)) defaults[s.id] = s.type === 'checkbox' ? false : null;
  return resolveSettings({ ...defaults, ...values }, types);
}

async function renderSection(type, data, globals, id = type) {
  const def = sectionFile(type);
  if (!def) return `<!-- missing section ${type} -->`;
  const { schema } = def;
  const blockDefs = Object.fromEntries((schema.blocks || []).map((b) => [b.type, b]));
  const order = data.block_order || Object.keys(data.blocks || {});
  const blocks = order.map((bid) => ({ bid, b: data.blocks[bid] })).filter(({ b }) => b && !b.disabled).map(({ bid, b }) => ({
    id: bid, type: b.type, settings: withDefaults(blockDefs[b.type]?.settings, b.settings), shopify_attributes: '',
  }));
  const section = { id, type, settings: withDefaults(schema.settings, data.settings), blocks, index: 1, location: 'template' };
  for (const st of schema.settings || []) if (st.type === 'liquid' && typeof section.settings[st.id] === 'string' && section.settings[st.id].includes('{')) {
    try { section.settings[st.id] = await engine.parseAndRender(section.settings[st.id], {}, { globals: { ...globals, section } }); } catch (e) { section.settings[st.id] = `<pre>Liquid error: ${escapeHtml(e.message)}</pre>`; }
  }
  let html;
  try {
    html = await engine.parseAndRender(def.src, { section }, { globals });
  } catch (e) {
    console.error(`[${type}] ${e.message}`);
    html = `<pre style="padding:16px;background:#fee;color:#900;white-space:pre-wrap">Liquid error in sections/${type}.liquid: ${escapeHtml(e.message)}</pre>`;
  }
  const tagName = schema.tag || 'div';
  return `<${tagName} id="shopify-section-${id}" class="shopify-section${schema.class ? ` ${schema.class}` : ''}">${html}</${tagName}>`;
}

async function renderJsonSections(file, globals, prefix = '') {
  if (!exists(file)) return '';
  const tpl = readJson(file);
  const order = tpl.order || Object.keys(tpl.sections || {});
  const out = [];
  for (const key of order) {
    const s = tpl.sections[key];
    if (!s || s.disabled) continue;
    out.push(await renderSection(s.type, s, globals, `${prefix}${key}`));
  }
  return out.join('\n');
}

/** Resolve a Section Rendering API id. Group ids look like `sections--header-group__cart-drawer` and carry that entry's settings;
    anything else is treated as a section file name (what Shopify does for predictive search / recommendations). */
function resolveSectionId(id) {
  const m = /^sections--([a-z0-9-]+)__(.+)$/i.exec(id);
  if (m) {
    const file = path.join(THEME, 'sections', `${m[1]}.json`);
    if (exists(file)) { const grp = readJson(file); const entry = grp.sections?.[m[2]]; if (entry) return { type: entry.type, data: entry }; }
  }
  return { type: id, data: { type: id } };
}
async function renderSectionById(id, globals) { const { type, data } = resolveSectionId(id); return renderSection(type, data, globals, id); }
async function renderRequestedSections(list, url) {
  const ids = Array.isArray(list) ? list : String(list || '').split(',').map((x) => x.trim()).filter(Boolean);
  if (!ids.length) return undefined;
  const route = resolveRoute(url);
  const g = globalsFor(route, url);
  const out = {};
  for (const id of ids) out[id] = await renderSectionById(id, g);
  return out;
}

const escapeHtml = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

/* -------------------------------------------------------------- routing */

const SHOP = {
  name: 'Sakooon', url: `http://localhost:${PORT}`, secure_url: `http://localhost:${PORT}`, domain: `localhost:${PORT}`, permanent_domain: 'sakooon.myshopify.com',
  money_format: 'Rs.{{amount}}', money_with_currency_format: 'Rs.{{amount}} PKR', currency: 'PKR', email: THEME_SETTINGS.email || '',
  customer_accounts_enabled: true, customer_accounts_optional: true, password_message: '', description: 'Premium bed sheets, duvets, pillows — woven for deep, peaceful sleep in every Pakistani home.', locale: 'en',
  policies: (extras.policies || []).map((p) => ({ title: p.title, url: `/policies/${p.handle}`, body: p.body })),
  enabled_payment_types: [], brand: {}, metaobjects: SHOP_METAOBJECTS,
};
const ROUTES = {
  root_url: '/', root: '/', account_url: '/account', account_login_url: '/account/login', account_logout_url: '/account/logout',
  account_register_url: '/account/register', account_addresses_url: '/account/addresses', account_recover_url: '/account/recover',
  collections_url: '/collections', all_products_collection_url: '/collections/all', search_url: '/search',
  predictive_search_url: '/search/suggest', cart_url: '/cart', cart_add_url: '/cart/add', cart_change_url: '/cart/change',
  cart_update_url: '/cart/update', cart_clear_url: '/cart/clear', product_recommendations_url: '/recommendations/products',
};

/* Storefront filtering approximation: builds Shopify-shaped `collection.filters` (list filters per option/type/availability + price_range)
   and applies filter.* / sort_by params. Values carry param_name/value/label/count/active/url_to_add/url_to_remove like Shopify. */
function applyFacets(collection, url) {
  const sp = url.searchParams;
  const base = url.pathname;
  const withParams = (mutate) => { const q = new URLSearchParams(sp); q.delete('page'); mutate(q); const str = q.toString(); return base + (str ? `?${str}` : ''); };
  const all = collection.products;
  const optionNames = [...new Set(all.flatMap((p) => p.options))];
  const defs = [
    { label: 'Availability', param: 'filter.v.availability', type: 'list', get: (p) => [p.available ? '1' : '0'], labelFor: (v) => (v === '1' ? 'In stock' : 'Out of stock'), match: (p, vals) => vals.includes(p.available ? '1' : '0') },
    ...optionNames.map((name) => ({ label: name, param: `filter.v.option.${name.toLowerCase()}`, type: 'list', get: (p) => p.options_with_values.find((o) => o.name === name)?.values || [], labelFor: (v) => v, match: (p, vals) => (p.options_with_values.find((o) => o.name === name)?.values || []).some((v) => vals.includes(v)) })),
    { label: 'Product type', param: 'filter.p.product_type', type: 'list', get: (p) => (p.type ? [p.type] : []), labelFor: (v) => v, match: (p, vals) => vals.includes(p.type) },
  ];
  const active = defs.map((d) => ({ d, vals: sp.getAll(d.param) }));
  const gte = Number(sp.get('filter.v.price.gte') || 0) * 100, lte = sp.get('filter.v.price.lte') ? Number(sp.get('filter.v.price.lte')) * 100 : Infinity;
  let products = all.filter((p) => active.every(({ d, vals }) => !vals.length || d.match(p, vals)) && p.price_max >= gte && p.price_min <= lte);
  const sortBy = sp.get('sort_by') || collection.default_sort_by || 'manual';
  const sorters = { 'price-ascending': (a, b) => a.price - b.price, 'price-descending': (a, b) => b.price - a.price, 'title-ascending': (a, b) => a.title.localeCompare(b.title), 'title-descending': (a, b) => b.title.localeCompare(a.title), 'created-descending': (a, b) => new Date(b.created_at) - new Date(a.created_at), 'created-ascending': (a, b) => new Date(a.created_at) - new Date(b.created_at) };
  if (sorters[sortBy]) products = [...products].sort(sorters[sortBy]);
  const filters = defs.map((d) => {
    const selected = sp.getAll(d.param);
    const values = [...new Set(all.flatMap(d.get))].map((v) => {
      const isActive = selected.includes(v);
      const count = all.filter((p) => d.match(p, [v]) && active.every(({ d: od, vals }) => od === d || !vals.length || od.match(p, vals))).length;
      return { label: d.labelFor(v), value: v, param_name: d.param, count, active: isActive, url_to_add: withParams((q) => q.append(d.param, v)), url_to_remove: withParams((q) => { const rest = q.getAll(d.param).filter((x) => x !== v); q.delete(d.param); rest.forEach((x) => q.append(d.param, x)); }), display: null, swatch: null };
    });
    return { label: d.label, param_name: d.param, type: d.type, presentation: 'text', operator: 'OR', values, active_values: values.filter((v) => v.active), inactive_values: values.filter((v) => !v.active), url_to_remove: withParams((q) => q.delete(d.param)), false_value: null, true_value: null, min_value: null, max_value: null, range_max: null };
  }).filter((f) => f.values.length > 1 || f.active_values.length);
  const maxPrice = Math.max(0, ...all.map((p) => p.price_max));
  filters.push({ label: 'Price', param_name: 'filter.v.price', type: 'price_range', presentation: 'text', values: [], active_values: [], inactive_values: [], range_max: maxPrice,
    min_value: { param_name: 'filter.v.price.gte', value: sp.get('filter.v.price.gte') ? Number(sp.get('filter.v.price.gte')) * 100 : null },
    max_value: { param_name: 'filter.v.price.lte', value: sp.get('filter.v.price.lte') ? Number(sp.get('filter.v.price.lte')) * 100 : null },
    url_to_remove: withParams((q) => { q.delete('filter.v.price.gte'); q.delete('filter.v.price.lte'); }) });
  return { ...collection, products, products_count: products.length, all_products_count: all.length, filters, sort_by: sortBy, current_type: null, current_vendor: null };
}

function resolveRoute(url) {
  const p = decodeURIComponent(url.pathname).replace(/\/+$/, '') || '/';
  const view = url.searchParams.get('view');
  const tplFor = (name, suffix) => {
    const s = view || suffix;
    if (s && exists(path.join(THEME, 'templates', `${name}.${s}.json`))) return { file: `${name}.${s}.json`, suffix: s };
    return { file: `${name}.json`, suffix: null };
  };
  let m;
  if (p === '/') return { name: 'index', ...tplFor('index'), page_type: 'index', title: SHOP.name };
  if ((m = /^\/products\/([^/]+)$/.exec(p)) && productByHandle[m[1]]) {
    const product = productByHandle[m[1]];
    const vid = Number(url.searchParams.get('variant'));
    const v = product.variants.find((x) => x.id === vid);
    const pr = v ? { ...product, selected_variant: v, selected_or_first_available_variant: v } : product;
    return { name: 'product', ...tplFor('product'), page_type: 'product', title: product.seo?.title || product.title, description: product.seo?.description, vars: { product: pr } };
  }
  if (p === '/collections') return { name: 'list-collections', ...tplFor('list-collections'), page_type: 'list-collections', title: 'Collections' };
  if ((m = /^\/collections\/([^/]+)$/.exec(p)) && collectionByHandle[m[1]]) {
    const collection = applyFacets(collectionByHandle[m[1]], url);
    return { name: 'collection', ...tplFor('collection'), page_type: 'collection', title: collection.title, vars: { collection, current_tags: null } };
  }
  if ((m = /^\/pages\/([a-z0-9_]+)\/([^/]+)$/.exec(p)) && METAOBJECTS[m[1]]?.[m[2]]?.system.published) {
    const metaobject = METAOBJECTS[m[1]][m[2]];
    const file = `metaobject/${m[1]}.json`;
    return { name: 'metaobject', file, suffix: null, page_type: 'metaobject', title: metaString(metaobject.name?.value || metaobject.system.handle), vars: { metaobject } };
  }
  if ((m = /^\/pages\/([^/]+)$/.exec(p)) && pageByHandle[m[1]]) {
    const page = pageByHandle[m[1]];
    const suffix = { quiz: 'sleep-quiz', favorites: 'wishlist' }[page.handle] || page.handle;
    return { name: 'page', ...tplFor('page', suffix), page_type: 'page', title: page.title, vars: { page } };
  }
  if ((m = /^\/policies\/([^/]+)$/.exec(p)) && pageByHandle[m[1]]) {
    return { name: 'page', ...tplFor('page', 'policy'), page_type: 'page', title: pageByHandle[m[1]].title, vars: { page: pageByHandle[m[1]] } };
  }
  if ((m = /^\/blogs\/([^/]+)$/.exec(p)) && blogByHandle[m[1]]) return { name: 'blog', ...tplFor('blog'), page_type: 'blog', title: blogByHandle[m[1]].title, vars: { blog: blogByHandle[m[1]] } };
  if ((m = /^\/blogs\/([^/]+)\/([^/]+)$/.exec(p)) && blogByHandle[m[1]]) {
    const blog = blogByHandle[m[1]];
    const article = blog.articles.find((a) => a.handle === m[2]);
    if (article) return { name: 'article', ...tplFor('article'), page_type: 'article', title: article.title, vars: { blog, article } };
  }
  if (p === '/cart') return { name: 'cart', ...tplFor('cart'), page_type: 'cart', title: 'Your cart' };
  if (p === '/search') {
    const q = (url.searchParams.get('q') || '').trim();
    const results = q ? PRODUCTS.filter((x) => `${x.title} ${x.type} ${x.tags.join(' ')} ${x.description}`.toLowerCase().includes(q.toLowerCase())) : [];
    const search = { performed: !!q, terms: q, results, results_count: results.length, types: ['product'], filters: [], sort_options: SORT_OPTIONS(), sort_by: 'relevance', default_sort_by: 'relevance' };
    return { name: 'search', ...tplFor('search'), page_type: 'search', title: q ? `Search: ${q}` : 'Search', vars: { search } };
  }
  const account = { '/account': 'account', '/account/login': 'login', '/account/register': 'register', '/account/addresses': 'addresses', '/account/activate': 'activate_account', '/account/reset': 'reset_password' }[p];
  if (account) return { name: `customers/${account}`, file: `customers/${account}.json`, suffix: null, page_type: `customers/${account}`, title: 'Account' };
  if (p === '/password') return { name: 'password', file: 'password.json', suffix: null, page_type: 'password', title: SHOP.name, layout: 'password' };
  return { name: '404', file: '404.json', suffix: null, page_type: '404', title: 'Page not found', status: 404 };
}

const pageExcerpt = (route) => {
  const html = route.vars?.page?.content || route.vars?.product?.description || route.vars?.collection?.description || '';
  const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  return text ? text.slice(0, 160) : null;
};

function globalsFor(route, url) {
  return {
    shop: SHOP, settings: THEME_SETTINGS, routes: ROUTES, cart: cartObject(), customer: null,
    linklists: LINKLISTS, collections: { ...collectionByHandle, size: COLLECTIONS.length }, all_products: productByHandle,
    pages: pageByHandle, blogs: blogByHandle, images: {}, localization: { language: { iso_code: 'en' }, country: { iso_code: 'PK', currency: { iso_code: 'PKR' } }, available_languages: [], available_countries: [] },
    request: { locale: { iso_code: 'en', primary: true }, page_type: route.page_type, path: url.pathname, host: url.host, origin: `http://${url.host}`, design_mode: false, visual_preview_mode: false },
    template: { name: route.name.replace(/^customers\//, ''), suffix: route.suffix, directory: route.name.startsWith('customers/') ? 'customers' : null },
    page_title: route.title,
    // Shopify falls back to the page's own text, then the shop description
    page_description: route.description || pageExcerpt(route) || SHOP.description, canonical_url: `http://${url.host}${url.pathname}`,
    content_for_header: '', content_for_additional_checkout_buttons: '', current_page: 1, current_tags: null, powered_by_link: '',
    product: null, collection: null, page: null, blog: null, article: null, search: null,
    ...(route.vars || {}),
  };
}

async function renderPage(url) {
  const route = resolveRoute(url);
  const globals = globalsFor(route, url);
  const tplPath = path.join(THEME, 'templates', route.file);
  let content;
  if (exists(tplPath)) content = await renderJsonSections(tplPath, globals);
  else if (exists(tplPath.replace(/\.json$/, '.liquid'))) content = await engine.parseAndRender(fs.readFileSync(tplPath.replace(/\.json$/, '.liquid'), 'utf8'), {}, { globals });
  else content = `<div style="padding:120px 24px;text-align:center"><h1>No <code>templates/${route.file}</code> in this theme</h1><p>Shopify would fall back to a default; this preview has nothing to render.</p></div>`;
  const layout = fs.readFileSync(path.join(THEME, 'layout', `${route.layout || 'theme'}.liquid`), 'utf8');
  const html = await engine.parseAndRender(layout, {}, { globals: { ...globals, content_for_layout: content } });
  return { status: route.status || 200, html };
}

/* --------------------------------------------------------------- server */

const MIME = { '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.json': 'application/json' };
function sendFile(res, file) {
  if (!exists(file) || !fs.statSync(file).isFile()) return send(res, 404, 'Not found', 'text/plain');
  res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-cache' });
  fs.createReadStream(file).pipe(res);
}
const send = (res, status, body, type = 'text/html; charset=utf-8') => { res.writeHead(status, { 'Content-Type': type }); res.end(body); };
const sendJson = (res, data, status = 200) => send(res, status, JSON.stringify(data), 'application/json');
const readBody = (req) => new Promise((resolve) => {
  let b = '';
  req.on('data', (c) => (b += c));
  req.on('end', () => {
    if (!b) return resolve({});
    try { resolve(JSON.parse(b)); } catch { resolve(Object.fromEntries(new URLSearchParams(b))); }
  });
});

function productJs(p) {
  return {
    ...p, collections: undefined, metafields: undefined, description: p.description, images: p.images.map((i) => i.src), featured_image: p.featured_image?.src,
    media: p.media.map((m) => ({ id: m.id, src: m.src, alt: m.alt, width: m.width, height: m.height, aspect_ratio: m.aspect_ratio, media_type: 'image', preview_image: m.preview_image })),
    variants: p.variants.map((v) => ({ ...v, featured_image: v.featured_image ? { src: v.featured_image.src } : null, featured_media: undefined, image: undefined })),
    options: p.options_with_values.map((o) => ({ name: o.name, position: o.position, values: o.values })),
  };
}

http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const p = url.pathname;
  const started = Date.now();
  try {
    if (p.startsWith('/assets/')) return sendFile(res, path.join(THEME, 'assets', path.basename(p)));
    if (p.startsWith('/images/')) return sendFile(res, path.join(IMAGES, path.basename(p)));
    if (p === '/cart.js' || p === '/cart.json') return sendJson(res, cartJson());
    if (p === '/cart/add.js' || p === '/cart/add') {
      const body = await readBody(req);
      const items = body.items || [{ id: body.id, quantity: body.quantity }];
      for (const it of items) {
        const id = Number(it.id); const q = Number(it.quantity || 1);
        if (!PRODUCTS.some((x) => x.variants.some((v) => v.id === id))) return sendJson(res, { status: 422, message: 'Cart Error', description: 'Variant not found' }, 422);
        const line = cart.lines.find((l) => l.id === id);
        if (line) line.quantity += q; else cart.lines.push({ id, quantity: q });
      }
      if (p === '/cart/add') { res.writeHead(302, { Location: '/cart' }); return res.end(); }
      const added = { ...cartJson().items.find((i) => i.id === Number(items[0].id)) };
      if (body.sections) { added.sections = await renderRequestedSections(body.sections, new URL(body.sections_url || '/', `http://${req.headers.host}`)); }
      return sendJson(res, added);
    }
    if (p === '/cart/change.js' || p === '/cart/update.js') {
      const body = await readBody(req);
      if (body.note !== undefined) cart.note = body.note;
      const ref = body.line ? cart.lines[Number(body.line) - 1] : cart.lines.find((l) => String(l.id) === String(body.id).split(':')[0]);
      if (ref && body.quantity !== undefined) {
        ref.quantity = Number(body.quantity);
        cart.lines = cart.lines.filter((l) => l.quantity > 0);
      }
      const out = cartJson();
      if (body.sections) out.sections = await renderRequestedSections(body.sections, new URL(body.sections_url || '/', `http://${req.headers.host}`));
      return sendJson(res, out);
    }
    if (p === '/cart/clear.js') { cart.lines = []; return sendJson(res, cartJson()); }
    let m;
    if ((m = /^\/products\/([^/]+)\.js$/.exec(p)) && productByHandle[m[1]]) return sendJson(res, productJs(productByHandle[m[1]]));
    if (p === '/products.json') return sendJson(res, { products: PRODUCTS.slice(0, Number(url.searchParams.get('limit') || 30)).map((x) => ({ id: x.id, handle: x.handle, title: x.title, product_type: x.type, tags: x.tags, variants: x.variants.map((v) => ({ id: v.id, title: v.title, price: (v.price / 100).toFixed(2), available: v.available })), options: x.options_with_values.map((o) => ({ name: o.name, values: o.values })) })) });
    if (p === '/search/suggest' && url.searchParams.get('section_id')) {
      const q = (url.searchParams.get('q') || '').trim();
      const types = (url.searchParams.get('resources[type]') || 'product,collection,query,page,article').split(',');
      const limit = Number(url.searchParams.get('resources[limit]') || 6);
      const ql = q.toLowerCase();
      const products = types.includes('product') && q ? PRODUCTS.filter((x) => `${x.title} ${x.type} ${x.tags.join(' ')}`.toLowerCase().includes(ql)).slice(0, limit) : [];
      const collections = types.includes('collection') && q ? COLLECTIONS.filter((c) => c.title.toLowerCase().includes(ql)).slice(0, limit) : [];
      const pages = types.includes('page') && q ? Object.values(pageByHandle).filter((pg) => `${pg.title} ${pg.content || ''}`.toLowerCase().includes(ql)).slice(0, limit) : [];
      const articles = types.includes('article') && q ? Object.values(blogByHandle).flatMap((b) => b.articles || []).filter((a) => `${a.title} ${a.content || ''}`.toLowerCase().includes(ql)).slice(0, limit) : [];
      const queries = types.includes('query') && q ? [{ text: q, styled_text: `<strong>${escapeHtml(q)}</strong>`, url: `/search?q=${encodeURIComponent(q)}` }] : [];
      const route = resolveRoute(new URL('/search', url));
      const g = { ...globalsFor(route, url), predictive_search: { performed: true, terms: q, resources: { products, collections, pages, articles, queries } } };
      return send(res, 200, await renderSectionById(url.searchParams.get('section_id'), g));
    }
    if (p === '/recommendations/products' && url.searchParams.get('section_id')) {
      const pid = Number(url.searchParams.get('product_id'));
      const intent = url.searchParams.get('intent') || 'related';
      const limit = Number(url.searchParams.get('limit') || 10);
      const self = PRODUCTS.find((x) => x.id === pid);
      let products = PRODUCTS.filter((x) => x.id !== pid);
      if (self) {
        const sameCollection = products.filter((x) => x.collections.some((c) => self.collections.includes(c)));
        products = intent === 'complementary' ? products.filter((x) => !sameCollection.includes(x)).concat(sameCollection) : sameCollection.concat(products.filter((x) => !sameCollection.includes(x)));
      }
      products = products.slice(0, limit);
      const route = resolveRoute(new URL(self ? self.url : '/', url));
      const g = { ...globalsFor(route, url), recommendations: { performed: true, intent, products, products_count: products.length } };
      return send(res, 200, await renderSectionById(url.searchParams.get('section_id'), g));
    }
    if (p === '/search/suggest.json') {
      const q = (url.searchParams.get('q') || '').toLowerCase();
      const products = PRODUCTS.filter((x) => `${x.title} ${x.type} ${x.tags.join(' ')}`.toLowerCase().includes(q)).slice(0, 6)
        .map((x) => ({ title: x.title, handle: x.handle, url: x.url, price: (x.price / 100).toFixed(2), image: x.featured_image?.src, featured_image: { url: x.featured_image?.src, alt: x.featured_image?.alt }, available: x.available, vendor: x.vendor }));
      const collections = COLLECTIONS.filter((c) => c.title.toLowerCase().includes(q)).map((c) => ({ title: c.title, url: c.url, handle: c.handle }));
      return sendJson(res, { resources: { results: { products, collections, pages: [], articles: [], queries: q ? [{ text: q, styled_text: q, url: `/search?q=${encodeURIComponent(q)}` }] : [] } } });
    }
    if (req.method === 'POST') { res.writeHead(302, { Location: p.includes('account') ? '/account' : `${p}?posted=1` }); return res.end(); }

    const sectionId = url.searchParams.get('section_id');
    if (sectionId) {
      const route = resolveRoute(url);
      return send(res, 200, await renderSectionById(sectionId, globalsFor(route, url)));
    }
    const sectionsParam = url.searchParams.get('sections');
    if (sectionsParam) {
      const route = resolveRoute(url);
      const g = globalsFor(route, url);
      const out = {};
      for (const id of sectionsParam.split(',')) out[id] = await renderSectionById(id, g);
      return sendJson(res, out);
    }

    const { status, html } = await renderPage(url);
    send(res, status, html);
  } catch (e) {
    console.error(e);
    send(res, 500, `<pre style="padding:24px;white-space:pre-wrap">${escapeHtml(e.stack || e.message)}</pre>`);
  } finally {
    console.log(`${req.method} ${req.url} ${res.statusCode} ${Date.now() - started}ms`);
  }
}).listen(PORT, () => {
  console.log(`Sakooon theme preview: http://localhost:${PORT}  (data: ${path.relative(THEME, HEADLESS) || '.'})`);
});
