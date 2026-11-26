// Collection page: filter drawer, Section Rendering apply, pills, clear, sort, back/forward, card hover.
// Usage: node scripts/ref/commerce-test-collection.mjs --base http://localhost:9302 [--path /collections/all] [--shots dir]
import { chromium } from 'playwright';

const arg = (k, d) => { const i = process.argv.indexOf(`--${k}`); return i > -1 ? process.argv[i + 1] : d; };
const BASE = arg('base', 'http://localhost:9302');
const PATH = arg('path', '/collections/all');
const SHOTS = arg('shots', null);
const results = [];
const check = (name, ok, detail = '') => { results.push({ name, ok, detail }); console.log(`${ok ? 'PASS' : 'FAIL'} ${name}${detail ? ` (${detail})` : ''}`); };

const browser = await chromium.launch();
for (const width of [1440, 768, 390]) {
  const ctx = await browser.newContext({ viewport: { width, height: 900 } });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  await page.goto(`${BASE}${PATH}`, { waitUntil: 'networkidle' });
  await page.evaluate(() => { window.__noReload = true; }); // survives pushState, lost on a real navigation
  const tag = `@${width}`;
  const cards0 = await page.locator('[data-facets-section] .product-card').count();
  check(`grid renders cards ${tag}`, cards0 > 0, `${cards0}`);
  const cols = await page.$eval('.product-grid', (g) => getComputedStyle(g).gridTemplateColumns.split(' ').length);
  check(`grid columns ${tag}`, cols === (width >= 1024 ? 4 : width >= 768 ? 3 : 2), `${cols}`);
  check(`no horizontal scroll ${tag}`, await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth));

  await page.locator('[data-drawer-open="facets-drawer"]').click();
  await page.waitForTimeout(500);
  check(`filter drawer opens ${tag}`, await page.locator('#facets-drawer[open]').count() === 1);
  const dw = (await page.locator('#facets-drawer .drawer').boundingBox()).width;
  check(`drawer width ${tag}`, width >= 768 ? Math.round(dw) === Math.min(600, width / 2) : Math.round(dw) === width, `${Math.round(dw)}px`);
  if (SHOTS) await page.screenshot({ path: `${SHOTS}/collection-filters-open-${width}.png` });

  // pick the first enabled checkbox of a list filter + a sort option
  const box = page.locator('#facets-drawer input[type="checkbox"]:not([disabled])').first();
  const boxName = await box.getAttribute('name'); const boxValue = await box.getAttribute('value');
  await box.check({ force: true });
  await page.locator('#facets-drawer input[name="sort_by"][value="price-ascending"]').check({ force: true }).catch(() => {});
  const req = page.waitForResponse((r) => r.url().includes('section_id='), { timeout: 5000 }).catch(() => null);
  await page.locator('#facets-drawer .facets__apply').click();
  const res = await req;
  await page.waitForTimeout(400);
  check(`apply uses Section Rendering API ${tag}`, !!res);
  check(`no full page navigation ${tag}`, await page.evaluate(() => window.__noReload === true));
  const url = new URL(page.url());
  check(`URL carries filter + sort ${tag}`, url.searchParams.getAll(boxName).includes(boxValue) && url.searchParams.get('sort_by') === 'price-ascending', url.search);
  check(`drawer closed after apply ${tag}`, await page.locator('#facets-drawer[open]').count() === 0);
  check(`active pill shown ${tag}`, await page.locator('.facets__pill').count() >= 1);
  check(`button shows active count ${tag}`, /\(\d+\)/.test(await page.locator('.main-collection__filter-button').textContent()));
  const cards1 = await page.locator('[data-facets-section] .product-card').count();
  check(`results filtered ${tag}`, cards1 <= cards0, `${cards0} -> ${cards1}`);
  const prices = await page.$$eval('[data-facets-section] .product-card .price__current', (els) => els.map((e) => Number(e.textContent.replace(/[^0-9.]/g, '').split('.').slice(0, 2).join('.'))));
  check(`sorted by price ascending ${tag}`, prices.every((p, i) => i === 0 || p >= prices[i - 1] || Number.isNaN(p)), prices.slice(0, 5).join(','));
  check(`focus moved to result count ${tag}`, await page.evaluate(() => document.activeElement && document.activeElement.hasAttribute('data-facets-count')));
  if (SHOTS) await page.screenshot({ path: `${SHOTS}/collection-filtered-${width}.png` });

  // back button restores the unfiltered grid
  await page.goBack();
  await page.waitForTimeout(800);
  check(`back restores URL ${tag}`, !new URL(page.url()).search, page.url().replace(BASE, ''));
  check(`back restores grid ${tag}`, await page.locator('[data-facets-section] .product-card').count() === cards0);
  await page.goForward();
  await page.waitForTimeout(800);
  check(`forward re-applies ${tag}`, await page.locator('.facets__pill').count() >= 1);

  // remove via pill and clear all
  await page.locator('.facets__clear').click();
  await page.waitForTimeout(800);
  check(`clear all removes filters ${tag}`, (await page.locator('.facets__pill').count()) === 0 && !new URL(page.url()).searchParams.has(boxName));

  if (width >= 1024) {
    const card = page.locator('.product-card--has-secondary').first();
    if (await card.count()) {
      await card.locator('.product-card__media').hover();
      await page.waitForTimeout(350);
      check(`card hover shows secondary image ${tag}`, (await card.locator('.product-card__image--secondary').evaluate((e) => getComputedStyle(e).opacity)) === '1');
    }
  }
  check(`no console errors ${tag}`, errors.length === 0, errors.slice(0, 3).join(' | '));
  await ctx.close();
}
await browser.close();
const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} passed`);
process.exit(failed.length ? 1 : 0);
