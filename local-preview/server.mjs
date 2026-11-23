/**
 * Local preview for the Sakooon Nocturne theme, without a Shopify store.
 *
 * Renders the theme's real Liquid (layout, JSON templates, section groups,
 * sections, snippets) with LiquidJS, using Shopify-shaped objects built from
 * the headless repo's sample catalogue (../sakooon/data/store.json) and images
 * (../sakooon/public/images). Shopify-only filters/tags are shimmed. This is a
 * dev tool: Liquid output is close to Shopify's but not identical, so check
 * real behaviour with `shopify theme dev` before shipping.
 *
 *   node local-preview/server.mjs        # http://localhost:9292
 *   PORT=9300 HEADLESS=/path/to/sakooon node local-preview/server.mjs
 */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Liquid, Tag, Hash } from 'liquidjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const THEME = path.resolve(__dirname, '..');
const HEADLESS = path.resolve(process.env.HEADLESS || path.join(THEME, '..', 'sakooon'));
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
    collections: [], metafields: {}, seo: p.seo, template_suffix: null, requires_selling_plan: false, selling_plan_groups: [],
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

/* ------------------------------------------------------------- settings */

const locale = readJson(path.join(THEME, 'locales', 'en.default.json'));
const settingsSchema = readJson(path.join(THEME, 'config', 'settings_schema.json'));
const settingsData = readJson(path.join(THEME, 'config', 'settings_data.json'));
const SETTING_DEFAULTS = {};
for (const group of settingsSchema) for (const s of group.settings || []) if (s.id && s.default !== undefined) SETTING_DEFAULTS[s.id] = s.default;
const current = typeof settingsData.current === 'string' ? settingsData.presets?.[settingsData.current] || {} : settingsData.current || {};
const SETTING_TYPES = Object.fromEntries(settingsSchema.flatMap((g) => (g.settings || []).filter((s) => s.id).map((s) => [s.id, s.type])));
const THEME_SETTINGS = resolveSettings({ ...SETTING_DEFAULTS, ...current }, SETTING_TYPES);
delete THEME_SETTINGS.sections;
delete THEME_SETTINGS.content_for_index;

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
  const val = key.split('.').reduce((o, k) => (o == null ? o : o[k]), locale);
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
  font_face: () => '', font_url: () => '', font_modify: (f) => f, inline_asset_content: (name) => {
    const f = path.join(THEME, 'assets', String(name));
    return exists(f) ? fs.readFileSync(f, 'utf8') : '';
  },
  structured_data: () => '',
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

const escapeHtml = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

/* -------------------------------------------------------------- routing */

const SHOP = {
  name: 'Sakooon', url: `http://localhost:${PORT}`, secure_url: `http://localhost:${PORT}`, domain: `localhost:${PORT}`, permanent_domain: 'sakooon.myshopify.com',
  money_format: 'Rs.{{amount}}', money_with_currency_format: 'Rs.{{amount}} PKR', currency: 'PKR', email: THEME_SETTINGS.email || '',
  customer_accounts_enabled: true, customer_accounts_optional: true, password_message: '', description: '', locale: 'en',
  policies: (extras.policies || []).map((p) => ({ title: p.title, url: `/policies/${p.handle}`, body: p.body })),
  enabled_payment_types: [], brand: {},
};
const ROUTES = {
  root_url: '/', root: '/', account_url: '/account', account_login_url: '/account/login', account_logout_url: '/account/logout',
  account_register_url: '/account/register', account_addresses_url: '/account/addresses', account_recover_url: '/account/recover',
  collections_url: '/collections', all_products_collection_url: '/collections/all', search_url: '/search',
  predictive_search_url: '/search/suggest', cart_url: '/cart', cart_add_url: '/cart/add', cart_change_url: '/cart/change',
  cart_update_url: '/cart/update', cart_clear_url: '/cart/clear', product_recommendations_url: '/recommendations/products',
};

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
    const collection = collectionByHandle[m[1]];
    return { name: 'collection', ...tplFor('collection'), page_type: 'collection', title: collection.title, vars: { collection, current_tags: null } };
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

function globalsFor(route, url) {
  return {
    shop: SHOP, settings: THEME_SETTINGS, routes: ROUTES, cart: cartObject(), customer: null,
    linklists: LINKLISTS, collections: { ...collectionByHandle, size: COLLECTIONS.length }, all_products: productByHandle,
    pages: pageByHandle, blogs: blogByHandle, images: {}, localization: { language: { iso_code: 'en' }, country: { iso_code: 'PK', currency: { iso_code: 'PKR' } }, available_languages: [], available_countries: [] },
    request: { locale: { iso_code: 'en', primary: true }, page_type: route.page_type, path: url.pathname, host: url.host, origin: `http://${url.host}`, design_mode: false, visual_preview_mode: false },
    template: { name: route.name.replace(/^customers\//, ''), suffix: route.suffix, directory: route.name.startsWith('customers/') ? 'customers' : null },
    page_title: route.title, page_description: route.description || null, canonical_url: `http://${url.host}${url.pathname}`,
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
      return sendJson(res, cartJson().items.find((i) => i.id === Number(items[0].id)));
    }
    if (p === '/cart/change.js' || p === '/cart/update.js') {
      const body = await readBody(req);
      if (body.note !== undefined) cart.note = body.note;
      const ref = body.line ? cart.lines[Number(body.line) - 1] : cart.lines.find((l) => String(l.id) === String(body.id).split(':')[0]);
      if (ref && body.quantity !== undefined) {
        ref.quantity = Number(body.quantity);
        cart.lines = cart.lines.filter((l) => l.quantity > 0);
      }
      return sendJson(res, cartJson());
    }
    if (p === '/cart/clear.js') { cart.lines = []; return sendJson(res, cartJson()); }
    let m;
    if ((m = /^\/products\/([^/]+)\.js$/.exec(p)) && productByHandle[m[1]]) return sendJson(res, productJs(productByHandle[m[1]]));
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
      return send(res, 200, await renderSection(sectionId, { type: sectionId }, globalsFor(route, url), sectionId));
    }
    const sectionsParam = url.searchParams.get('sections');
    if (sectionsParam) {
      const route = resolveRoute(url);
      const g = globalsFor(route, url);
      const out = {};
      for (const id of sectionsParam.split(',')) out[id] = await renderSection(id, { type: id }, g, id);
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
