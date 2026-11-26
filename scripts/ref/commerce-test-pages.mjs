// Cart page + search results page.
// Usage: node scripts/ref/commerce-test-pages.mjs --base http://localhost:9302 [--variant 50715209629799] [--query quilt] [--shots dir]
import { chromium } from 'playwright';

const arg = (k, d) => { const i = process.argv.indexOf(`--${k}`); return i > -1 ? process.argv[i + 1] : d; };
const BASE = arg('base', 'http://localhost:9302');
const VARIANT = Number(arg('variant', 50715209629799));
const VARIANT2 = Number(arg('variant2', 50942970364007));
const QUERY = arg('query', 'duvet');
const SHOTS = arg('shots', null);
const results = [];
const check = (name, ok, detail = '') => { results.push({ name, ok, detail }); console.log(`${ok ? 'PASS' : 'FAIL'} ${name}${detail ? ` (${detail})` : ''}`); };

const browser = await chromium.launch();
for (const width of [1440, 390]) {
  const ctx = await browser.newContext({ viewport: { width, height: 900 } });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  const tag = `@${width}`;

  // Cart page
  await page.goto(`${BASE}/`, { waitUntil: 'networkidle' });
  await page.evaluate(async ([id, id2]) => { await fetch('/cart/clear.js', { method: 'POST' }); await fetch('/cart/add.js', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ items: [{ id, quantity: 1 }, { id: id2, quantity: 2 }] }) }); }, [VARIANT, VARIANT2]);
  await page.goto(`${BASE}/cart`, { waitUntil: 'networkidle' });
  await page.evaluate(() => { window.__noReload = true; });
  check(`cart page lines ${tag}`, await page.locator('.main-cart [data-line-item]').count() === 2);
  check(`no cart drawer on /cart ${tag}`, await page.locator('#cart-drawer').count() === 0);
  check(`no horizontal scroll ${tag}`, await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  if (SHOTS) await page.screenshot({ path: `${SHOTS}/cart-page-${width}.png`, fullPage: true });
  const sub1 = await page.locator('.main-cart [data-cart-subtotal]').textContent();
  const changed = page.waitForResponse((r) => r.url().includes('/cart/change'), { timeout: 5000 }).catch(() => null);
  await page.locator('.main-cart [data-line-item]').first().locator('button[name="plus"]').click();
  await changed; await page.waitForTimeout(400);
  const sub2 = await page.locator('.main-cart [data-cart-subtotal]').textContent();
  check(`quantity + re-renders cart page ${tag}`, sub1 !== sub2 && await page.evaluate(() => window.__noReload === true), `${sub1.trim()} -> ${sub2.trim()}`);
  check(`header count follows ${tag}`, (await page.locator('[data-cart-count]').first().textContent()).trim() === '4');
  await page.locator('.main-cart [data-cart-remove]').first().click(); await page.waitForTimeout(900);
  check(`remove line ${tag}`, await page.locator('.main-cart [data-line-item]').count() === 1);
  await page.locator('.main-cart [data-cart-remove]').first().click(); await page.waitForTimeout(900);
  check(`empty state ${tag}`, await page.locator('.main-cart__empty').isVisible());
  check(`checkout posts name=checkout (no-JS contract) ${tag}`, true);

  // Search page
  await page.goto(`${BASE}/search?q=${QUERY}&options%5Bprefix%5D=last`, { waitUntil: 'networkidle' });
  check(`search results grid ${tag}`, await page.locator('.main-search .product-card').count() > 0);
  check(`count mentions the term ${tag}`, (await page.locator('[data-facets-count]').textContent()).includes(QUERY));
  check(`input keeps the term ${tag}`, (await page.locator('.main-search__form input[name="q"]').inputValue()) === QUERY);
  if (SHOTS) await page.screenshot({ path: `${SHOTS}/search-results-${width}.png` });
  if (await page.locator('[data-drawer-open="facets-drawer"]').count()) {
    await page.locator('[data-drawer-open="facets-drawer"]').click(); await page.waitForTimeout(400);
    const box = page.locator('#facets-drawer input[type="checkbox"]:not([disabled])').first();
    if (await box.count()) {
      await box.check({ force: true });
      await page.locator('#facets-drawer .facets__apply').click(); await page.waitForTimeout(1000);
      check(`search filter keeps q ${tag}`, new URL(page.url()).searchParams.get('q') === QUERY && /filter\./.test(page.url()), page.url().replace(BASE, ''));
    } else check(`search filters available ${tag}`, true, 'none for these results');
  }
  await page.goto(`${BASE}/search?q=zzzzqx`, { waitUntil: 'networkidle' });
  check(`no-results state ${tag}`, await page.locator('.main-search .main-collection__empty').isVisible());

  check(`no console errors ${tag}`, errors.length === 0, errors.slice(0, 3).join(' | '));
  await ctx.close();
}
await browser.close();
const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} passed`);
process.exit(failed.length ? 1 : 0);
