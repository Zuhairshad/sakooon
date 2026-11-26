// Product page: variant picker (colour radios + size select), section re-render, sold-out state, add to cart,
// sticky bar, accordions, gallery arrows, zoom, size guide.
// Real catalogue (store.json): colour on the quilted set, size/price on the duvet filling, sold out on the pillow pack.
// Usage: node scripts/ref/commerce-test-product.mjs --base http://localhost:9302 [--product /products/quilted-bed-sheet-set-king]
//        [--sized /products/<handle with a size select>] [--soldout /products/<sold-out handle>]
//        [--gallery /products/<handle with several images>] [--guide /products/<handle with sakooon.size_guide>] [--shots dir]
import { chromium } from 'playwright';

const arg = (k, d) => { const i = process.argv.indexOf(`--${k}`); return i > -1 ? process.argv[i + 1] : d; };
const BASE = arg('base', 'http://localhost:9302');
const PRODUCT = arg('product', '/products/quilted-bed-sheet-set-king');
const SIZED = arg('sized', '/products/duvet-comfort-filling-220-gsm');
const SOLDOUT = arg('soldout', '/products/duvet-comfort-pillow-pack-of-2');
const GALLERY = arg('gallery', '/products/duvet-comfort-filling-220-gsm');
const GUIDE = arg('guide', '/products/two-tone-duvet-cover-set-king');
const SHOTS = arg('shots', null);
const results = [];
const check = (name, ok, detail = '') => { results.push({ name, ok, detail }); console.log(`${ok ? 'PASS' : 'FAIL'} ${name}${detail ? ` (${detail})` : ''}`); };

const browser = await chromium.launch();
for (const width of [1440, 390]) {
  const ctx = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  const tag = `@${width}`;
  await page.goto(`${BASE}/`, { waitUntil: 'networkidle' });
  await page.evaluate(() => fetch('/cart/clear.js', { method: 'POST' }));
  await page.goto(`${BASE}${PRODUCT}`, { waitUntil: 'networkidle' });
  await page.evaluate(() => { window.__noReload = true; });
  if (SHOTS) await page.screenshot({ path: `${SHOTS}/pdp-default-${width}.png` });

  // Layout
  const grid = await page.$eval('.main-product__grid', (g) => getComputedStyle(g).gridTemplateColumns.split(' ').length);
  check(`layout columns ${tag}`, grid === (width >= 1024 ? 2 : 1), `${grid}`);
  check(`no horizontal scroll ${tag}`, await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));

  // Colour change
  const colour = page.locator('.variant-picker__option--colour label', { hasText: 'Dusty Blue' }).first();
  const rendered = page.waitForResponse((r) => r.url().includes('section_id='), { timeout: 5000 }).catch(() => null);
  await colour.click();
  await rendered; await page.waitForTimeout(300);
  check(`colour change re-renders via section API without reload ${tag}`, await page.evaluate(() => window.__noReload === true));
  check(`URL has variant ${tag}`, /variant=\d+/.test(page.url()), page.url().replace(BASE, ''));
  check(`gallery shows Dusty Blue ${tag}`, (await page.getAttribute('product-gallery', 'data-colour')) === 'Dusty Blue' && /dusty-blue/.test(await page.locator('.product-gallery__slide img').first().getAttribute('src')));
  check(`selected value label updated ${tag}`, (await page.locator('.variant-picker__option--colour [data-selected-value]').first().textContent()).trim() === 'Dusty Blue');
  check(`focus stays on the chosen swatch ${tag}`, await page.evaluate(() => document.activeElement && document.activeElement.value === 'Dusty Blue'));

  // Size change updates price (duvet filling: Single / Queen / King)
  await page.goto(`${BASE}${SIZED}`, { waitUntil: 'networkidle' });
  await page.evaluate(() => { window.__noReload = true; });
  const before = (await page.locator('.buy-buttons__price').first().textContent()).trim();
  const r2 = page.waitForResponse((r) => r.url().includes('section_id='), { timeout: 5000 }).catch(() => null);
  if (await page.locator('.variant-picker__select').count()) await page.locator('.variant-picker__select').first().selectOption({ label: 'King' });
  else await page.locator('.variant-picker__pill', { hasText: 'King' }).first().click();
  await r2; await page.waitForTimeout(300);
  const after = (await page.locator('.buy-buttons__price').first().textContent()).trim();
  check(`size change updates price ${tag}`, before !== after && /6,999/.test(after), `${before} -> ${after}`);
  check(`compare-at shown ${tag}`, /7,999/.test(await page.locator('.buy-buttons__price').first().textContent()));
  const id = new URL(page.url()).searchParams.get('variant');
  check(`form id matches URL variant ${tag}`, (await page.locator('input[data-variant-id]').first().inputValue()) === id, id);

  // Sold out (pillow pack: every variant unavailable in the store)
  await page.goto(`${BASE}${SOLDOUT}`, { waitUntil: 'networkidle' });
  const soldAdd = page.locator('[data-add-button]').first();
  check(`sold-out product disables add ${tag}`, await soldAdd.isDisabled() && /sold out/i.test(await soldAdd.textContent()));
  check(`no notify-me or fake stock on sold out ${tag}`, !/notify|back in stock|only \d+ left/i.test(await page.locator('.main-product__info').first().textContent()));
  check(`sold-out button keeps the price ${tag}`, /2,499/.test(await soldAdd.textContent()));
  check(`sold-out badge ${tag}`, /sold out/i.test(await page.locator('.main-product__info').first().textContent()));
  if (SHOTS) await page.screenshot({ path: `${SHOTS}/pdp-sold-out-${width}.png` });

  // Add to cart (duvet filling, Queen)
  await page.goto(`${BASE}${SIZED}`, { waitUntil: 'networkidle' });
  const r4 = page.waitForResponse((r) => r.url().includes('section_id='), { timeout: 5000 }).catch(() => null);
  if (await page.locator('.variant-picker__select').count()) await page.locator('.variant-picker__select').first().selectOption({ label: 'Queen' });
  else await page.locator('.variant-picker__pill', { hasText: 'Queen' }).first().click();
  await r4; await page.waitForTimeout(300);
  check(`available ${tag}`, !(await page.locator('[data-add-button]').first().isDisabled()));
  await page.locator('[data-add-button]').first().click();
  await page.waitForSelector('#cart-drawer[open] [data-line-item]', { timeout: 5000 }).catch(() => {});
  check(`add to cart opens drawer with the line ${tag}`, await page.locator('#cart-drawer[open] [data-line-item]').count() === 1);
  check(`line is Queen ${tag}`, /Queen/.test(await page.locator('#cart-drawer [data-line-item]').first().textContent()));
  if (SHOTS) await page.screenshot({ path: `${SHOTS}/pdp-added-${width}.png` });
  await page.keyboard.press('Escape'); await page.waitForTimeout(300);

  // Sticky bar
  await page.evaluate(() => window.scrollTo(0, document.querySelector('[data-add-button]').getBoundingClientRect().bottom + window.scrollY + 400));
  await page.waitForTimeout(500);
  check(`sticky bar visible after scrolling past add ${tag}`, await page.locator('sticky-buy-bar:not([hidden])').count() === 1);
  if (SHOTS) await page.screenshot({ path: `${SHOTS}/pdp-sticky-${width}.png` });
  await page.locator('[data-sticky-add]').click();
  await page.waitForFunction(() => document.querySelector('[data-cart-count]')?.textContent.trim() === '2', null, { timeout: 5000 }).catch(() => {});
  check(`sticky add adds to cart ${tag}`, (await page.locator('[data-cart-count]').first().textContent()).trim() === '2');
  await page.keyboard.press('Escape'); await page.waitForTimeout(300);
  await page.evaluate(() => window.scrollTo(0, 0)); await page.waitForTimeout(400);
  check(`sticky bar hidden at top ${tag}`, await page.locator('sticky-buy-bar[hidden]').count() === 1);

  // Accordion (a closed row: Description starts open)
  const trig = page.locator('.product-accordion__trigger[aria-expanded="false"]').first();
  const panelSel = await trig.getAttribute('aria-controls');
  await trig.click(); await page.waitForTimeout(300);
  check(`accordion opens ${tag}`, (await page.locator(`[aria-controls="${panelSel}"]`).getAttribute('aria-expanded')) === 'true');
  const panelH = await page.locator(`#${panelSel}`).evaluate((e) => e.getBoundingClientRect().height);
  check(`open panel has height ${tag}`, panelH > 10, `${Math.round(panelH)}px`);
  await page.locator(`[aria-controls="${panelSel}"]`).click(); await page.waitForTimeout(300);
  const closedH = await page.locator(`#${panelSel}`).evaluate((e) => e.getBoundingClientRect().height);
  check(`closed panel collapses to 0 ${tag}`, closedH < 1, `${closedH}px`);

  // Description split into accordion rows by its headings (real copy)
  await page.goto(`${BASE}${SIZED}`, { waitUntil: 'networkidle' });
  const titles = (await page.locator('.product-accordion__title').allTextContents()).map((t) => t.trim());
  check(`description rows by heading ${tag}`, ['Description', 'Available sizes', "Why you'll love it", 'Specifications', 'Frequently asked questions'].every((h) => titles.includes(h)), titles.join(' | '));
  check(`description row open by default ${tag}`, (await page.locator('.product-accordion__trigger').first().getAttribute('aria-expanded')) === 'true');
  check(`no heading text left inside rows ${tag}`, await page.locator('.product-accordion__rte h3').count() === 0);
  await page.goto(`${BASE}${PRODUCT}`, { waitUntil: 'networkidle' });
  const qTitles = (await page.locator('.product-accordion__title').allTextContents()).map((t) => t.trim());
  check(`care heading rendered once ${tag}`, qTitles.filter((t) => /^care$/i.test(t)).length === 1, qTitles.join(' | '));
  check(`single-value option is a static line ${tag}`, await page.locator('.variant-picker__option--static').count() === 1 && /King/.test(await page.locator('.variant-picker__option--static').textContent()));

  // Gallery arrows + zoom (product with several images)
  await page.goto(`${BASE}${GALLERY}`, { waitUntil: 'networkidle' });
  const next = page.locator('[data-gallery-next]');
  if (await next.count()) {
    await next.click(); await page.waitForTimeout(600);
    check(`gallery next updates counter ${tag}`, (await page.locator('[data-gallery-counter]').textContent()).startsWith('2/'));
    await page.locator('.product-gallery__zoom').nth(1).click(); await page.waitForTimeout(500);
    check(`zoom dialog opens ${tag}`, await page.locator('theme-dialog.product-zoom[open]').count() === 1);
    await page.keyboard.press('Escape'); await page.waitForTimeout(300);
    check(`zoom closes on Escape ${tag}`, await page.locator('theme-dialog.product-zoom[open]').count() === 0);
  } else check(`gallery has arrows ${tag}`, false, 'no multi-image product');

  // Size guide (product with sakooon.size_guide)
  await page.goto(`${BASE}${GUIDE}`, { waitUntil: 'networkidle' });
  const guide = page.locator('[data-size-guide-open]').first();
  if (await guide.count()) {
    await guide.click(); await page.waitForTimeout(1200);
    const opened = await page.locator('theme-dialog.size-guide-dialog[open] [data-size-guide]').count();
    const navigated = !page.url().includes(GUIDE);
    check(`size guide opens inline or falls back to the page ${tag}`, opened === 1 || navigated, opened ? 'dialog' : page.url().replace(BASE, ''));
  } else check(`size guide trigger present ${tag}`, false);

  check(`no console errors ${tag}`, errors.length === 0, errors.slice(0, 3).join(' | '));
  await ctx.close();
}
await browser.close();
const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} passed`);
process.exit(failed.length ? 1 : 0);
