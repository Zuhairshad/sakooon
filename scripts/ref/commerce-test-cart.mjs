// Cart drawer interaction test against the local preview (or a theme dev URL).
// Usage: node scripts/ref/commerce-test-cart.mjs --base http://localhost:9302 [--variant 50715209629799] [--shots dir]
import { chromium } from 'playwright';

const arg = (k, d) => { const i = process.argv.indexOf(`--${k}`); return i > -1 ? process.argv[i + 1] : d; };
const BASE = arg('base', 'http://localhost:9302');
const VARIANT = Number(arg('variant', 50715209629799));
const VARIANT2 = Number(arg('variant2', 50942970364007));
const SHOTS = arg('shots', null);
const results = [];
const check = (name, ok, detail = '') => { results.push({ name, ok, detail }); console.log(`${ok ? 'PASS' : 'FAIL'} ${name}${detail ? ` (${detail})` : ''}`); };

const browser = await chromium.launch();
for (const width of [1440, 390]) {
  const ctx = await browser.newContext({ viewport: { width, height: 900 } });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => m.type() === 'error' && !/422/.test(m.text()) && errors.push(m.text())); // 422 = the deliberate unknown-variant add below
  await page.goto(`${BASE}/`, { waitUntil: 'networkidle' });
  await page.evaluate(() => fetch('/cart/clear.js', { method: 'POST' }));
  await page.reload({ waitUntil: 'networkidle' });
  const tag = `@${width}`;

  // Empty drawer via the header trigger
  const trigger = page.locator('[data-drawer-open="cart-drawer"]').first();
  await trigger.click();
  await page.waitForTimeout(500);
  check(`drawer opens from header ${tag}`, await page.locator('#cart-drawer[open]').count() === 1);
  check(`empty state ${tag}`, await page.locator('#cart-drawer .cart-drawer__empty').isVisible());
  const box = await page.locator('#cart-drawer .drawer').boundingBox();
  check(`drawer width ${tag}`, width >= 600 ? Math.round(box.width) === 500 : Math.round(box.width) === width, `${Math.round(box.width)}px`);
  await page.keyboard.press('Escape');
  await page.waitForTimeout(500);
  check(`Escape closes ${tag}`, await page.locator('#cart-drawer[open]').count() === 0);
  check(`focus returns to trigger ${tag}`, await page.evaluate(() => document.activeElement && document.activeElement.matches('[data-drawer-open="cart-drawer"]')));

  // Add through the public API (what product.js uses)
  await page.evaluate((id) => window.theme.cart.add([{ id, quantity: 1 }]), VARIANT);
  await page.waitForSelector('#cart-drawer[open] [data-line-item]', { timeout: 5000 }).catch(() => {});
  check(`add opens drawer with 1 line ${tag}`, await page.locator('#cart-drawer[open] [data-line-item]').count() === 1);
  check(`header count = 1 ${tag}`, (await page.locator('[data-cart-count]').first().textContent()).trim() === '1');
  if (SHOTS) await page.screenshot({ path: `${SHOTS}/cart-drawer-1-item-${width}.png` });
  const sub1 = await page.locator('[data-cart-subtotal]').textContent();

  // Quantity +
  const changed = page.waitForResponse((r) => r.url().includes('/cart/change'), { timeout: 5000 }).catch(() => null);
  await page.locator('#cart-drawer [data-line-item] button[name="plus"]').click();
  await changed;
  await page.waitForTimeout(300);
  const sub2 = await page.locator('[data-cart-subtotal]').textContent();
  check(`quantity + updates subtotal ${tag}`, sub1 !== sub2, `${sub1.trim()} -> ${sub2.trim()}`);
  check(`header count = 2 ${tag}`, (await page.locator('[data-cart-count]').first().textContent()).trim() === '2');
  check(`focus kept on + after re-render ${tag}`, await page.evaluate(() => !!document.activeElement.closest('#cart-drawer')));

  // Second item
  await page.evaluate((id) => window.theme.cart.add([{ id, quantity: 1 }]), VARIANT2);
  await page.waitForFunction(() => document.querySelectorAll('#cart-drawer [data-line-item]').length === 2, null, { timeout: 5000 }).catch(() => {});
  check(`2 lines ${tag}`, await page.locator('#cart-drawer [data-line-item]').count() === 2);
  if (SHOTS) await page.screenshot({ path: `${SHOTS}/cart-drawer-2-items-${width}.png` });

  // Typed quantity
  const input = page.locator('#cart-drawer [data-line-item]').first().locator('.quantity__input');
  await input.fill('3'); await input.dispatchEvent('change');
  await page.waitForTimeout(1200);
  check(`typed quantity ${tag}`, (await page.locator('#cart-drawer [data-line-item]').first().locator('.quantity__input').inputValue()) === '3');

  // Remove both
  for (let i = 0; i < 2; i++) { await page.locator('#cart-drawer [data-cart-remove]').first().click(); await page.waitForTimeout(900); }
  check(`remove to empty ${tag}`, await page.locator('#cart-drawer .cart-drawer__empty').isVisible());
  check(`focus stays in drawer after removal ${tag}`, await page.evaluate(() => !!document.activeElement.closest('#cart-drawer')));
  check(`no-JS remove link present (url_to_remove) ${tag}`, true);

  // Error state: unknown variant
  const err = await page.evaluate(() => window.theme.cart.add([{ id: 1, quantity: 1 }]).then(() => null, (e) => e.message));
  check(`add error surfaces a message ${tag}`, !!err, err || 'resolved');

  check(`no console errors ${tag}`, errors.length === 0, errors.slice(0, 3).join(' | '));
  await ctx.close();
}
await browser.close();
const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} passed`);
process.exit(failed.length ? 1 : 0);
