// Search drawer / predictive search interaction test.
// Usage: node scripts/ref/commerce-test-search.mjs --base http://localhost:9302 [--query quilt] [--shots dir]
import { chromium } from 'playwright';

const arg = (k, d) => { const i = process.argv.indexOf(`--${k}`); return i > -1 ? process.argv[i + 1] : d; };
const BASE = arg('base', 'http://localhost:9302');
const QUERY = arg('query', 'quilt');
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
  const suggest = [];
  page.on('request', (r) => r.url().includes('/search/suggest') && suggest.push(r.url()));
  await page.goto(`${BASE}/`, { waitUntil: 'networkidle' });
  const tag = `@${width}`;

  await page.locator('[data-drawer-open="search-drawer"]').first().click();
  await page.waitForTimeout(500);
  check(`drawer opens ${tag}`, await page.locator('#search-drawer[open]').count() === 1);
  check(`input focused ${tag}`, await page.evaluate(() => document.activeElement && document.activeElement.id === 'SearchDrawerInput'));
  check(`idle content visible ${tag}`, await page.locator('#search-drawer [data-search-idle]').isVisible());
  if (SHOTS) await page.screenshot({ path: `${SHOTS}/search-open-empty-${width}.png` });

  await page.keyboard.type(QUERY, { delay: 60 });
  await page.waitForSelector('#search-drawer [data-search-live]:not([hidden]) [data-predictive-results]', { timeout: 5000 }).catch(() => {});
  check(`results render ${tag}`, await page.locator('#search-drawer [data-search-live] .product-card').count() > 0);
  check(`one request per settled query ${tag}`, suggest.length === 1, `${suggest.length} requests`);
  check(`request uses section_id ${tag}`, suggest.every((u) => u.includes('section_id=search-drawer')));
  check(`idle hidden while results show ${tag}`, !(await page.locator('#search-drawer [data-search-idle]').isVisible()));
  if (SHOTS) await page.screenshot({ path: `${SHOTS}/search-typed-${width}.png` });

  await page.keyboard.press('ArrowDown');
  check(`ArrowDown moves into results ${tag}`, await page.evaluate(() => !!document.activeElement.closest('[data-search-live]')));

  await page.locator('#SearchDrawerInput').focus();
  await page.locator('[data-search-reset]').click();
  await page.waitForTimeout(200);
  check(`reset clears and restores idle ${tag}`, (await page.locator('#SearchDrawerInput').inputValue()) === '' && await page.locator('#search-drawer [data-search-idle]').isVisible());

  await page.keyboard.type('zzzzqx', { delay: 40 });
  await page.waitForTimeout(900);
  check(`no-results message ${tag}`, await page.locator('#search-drawer .predictive-search__empty').isVisible());

  await page.keyboard.press('Escape');
  await page.waitForTimeout(500);
  check(`Escape closes ${tag}`, await page.locator('#search-drawer[open]').count() === 0);
  check(`focus returns to trigger ${tag}`, await page.evaluate(() => document.activeElement.matches('[data-drawer-open="search-drawer"]')));

  await page.locator('[data-drawer-open="search-drawer"]').first().click();
  await page.waitForTimeout(400);
  await page.locator('#SearchDrawerInput').fill(QUERY);
  await Promise.all([page.waitForURL(/\/search\?/, { timeout: 5000 }).catch(() => {}), page.keyboard.press('Enter')]);
  check(`Enter submits to /search ${tag}`, /\/search\?q=/.test(page.url()), page.url().replace(BASE, ''));

  check(`no console errors ${tag}`, errors.length === 0, errors.slice(0, 3).join(' | '));
  await ctx.close();
}
await browser.close();
const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} passed`);
process.exit(failed.length ? 1 : 0);
