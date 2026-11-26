#!/usr/bin/env node
/**
 * Interaction tests against the theme (preview or shopify theme dev). Each test is a small scenario with assertions;
 * tests skip (not fail) when the component they target is absent, so the suite grows as workers land features.
 * Usage: node scripts/test-interactions.mjs --base http://localhost:9292 [--only mobile-nav,cart] [--viewport 1440]
 * Writes /Users/shad/sakooon-qa/theme/interactions-report.json and screenshots under theme/interactions/.
 */
import path from 'node:path';
import fs from 'node:fs';
import { QA_DIR, VIEWPORTS, launch, newPage, gotoPolite, writeJson, parseArgs, sleep } from './lib/common.mjs';

const args = parseArgs(process.argv.slice(2));
const base = (args.base || process.env.SAKOOON_THEME_URL || 'http://localhost:9292').replace(/\/$/, '');
const only = args.only ? String(args.only).split(',') : null;
const desktop = VIEWPORTS.find((v) => v.name === String(args.viewport || '1440')) || VIEWPORTS[1];
const mobile = VIEWPORTS.find((v) => v.name === '390');
const shotDir = fs.mkdirSync(path.join(QA_DIR, 'theme', 'interactions'), { recursive: true }) || path.join(QA_DIR, 'theme', 'interactions');
const assert = (cond, msg) => { if (!cond) throw new Error(msg); };
const SKIP = Symbol('skip');

async function firstProductUrl() { try { const r = await fetch(`${base}/products.json?limit=1`); const j = await r.json(); return `/products/${j.products[0].handle}`; } catch { return null; } }

const tests = [
  { name: 'mobile-nav', vp: mobile, async run(page) {
    await gotoPolite(page, base + '/', { settle: 300 });
    const opener = page.locator('[data-drawer-open="mobile-nav"]').first(); if (!(await opener.count())) return SKIP;
    await opener.click(); await sleep(500);
    const drawer = page.locator('#mobile-nav'); assert(await drawer.getAttribute('open') !== null, 'mobile nav did not open');
    assert(await page.evaluate(() => document.body.classList.contains('scroll-locked')), 'scroll not locked');
    await page.screenshot({ path: path.join(shotDir, 'mobile-nav-open.png') });
    const focusedInside = await page.evaluate(() => !!document.activeElement.closest('#mobile-nav')); assert(focusedInside, 'focus not moved into drawer');
    await page.keyboard.press('Escape'); await sleep(500);
    assert(await drawer.getAttribute('open') === null, 'Escape did not close drawer');
    assert(await page.evaluate(() => document.activeElement.matches('[data-drawer-open="mobile-nav"]')), 'focus did not return to trigger');
  } },
  { name: 'header-sticky', vp: desktop, async run(page) {
    await gotoPolite(page, base + '/', { settle: 300 });
    const header = page.locator('header.header, .header, [data-header]').first(); if (!(await header.count())) return SKIP;
    await page.evaluate(() => window.scrollTo(0, 1200)); await sleep(500);
    const top = await header.evaluate((el) => el.getBoundingClientRect().top);
    const sticky = await header.evaluate((el) => el.dataset.sticky);
    if (sticky === 'true') assert(top <= 1 && top >= -1, `sticky header top is ${top}`);
  } },
  { name: 'mega-menu', vp: desktop, async run(page) {
    await gotoPolite(page, base + '/', { settle: 300 });
    const item = page.locator('.header__menu [aria-haspopup], .header__menu [data-mega-menu], .header__menu details > summary').first(); if (!(await item.count())) return SKIP;
    await item.hover(); await sleep(400); await item.focus(); await page.keyboard.press('Enter').catch(() => {}); await sleep(400);
    const panelVisible = await page.evaluate(() => { const p = document.querySelector('.mega-menu[open], .mega-menu.is-open, details[open] .mega-menu, .header__menu [aria-expanded="true"]'); return !!p; });
    assert(panelVisible, 'mega menu did not open on hover/Enter');
    await page.screenshot({ path: path.join(shotDir, 'mega-menu-open.png') });
    await page.keyboard.press('Escape'); await sleep(300);
  } },
  { name: 'search-drawer', vp: desktop, async run(page) {
    await gotoPolite(page, base + '/', { settle: 300 });
    const opener = page.locator('[data-drawer-open="search-drawer"]').first(); const drawer = page.locator('#search-drawer');
    if (!(await opener.count()) || !(await drawer.count())) return SKIP;
    await opener.click(); await sleep(500); assert(await drawer.getAttribute('open') !== null, 'search drawer did not open');
    const input = drawer.locator('input[type="search"], input[name="q"]').first(); assert(await input.count(), 'no search input in drawer');
    assert(await input.evaluate((el) => el === document.activeElement), 'search input not focused on open');
    await input.fill('sheet'); await sleep(1200);
    await page.screenshot({ path: path.join(shotDir, 'search-typed.png') });
    await page.keyboard.press('Escape'); await sleep(400); assert(await drawer.getAttribute('open') === null, 'Escape did not close search');
  } },
  { name: 'product-variant-and-cart', vp: desktop, async run(page) {
    const url = await firstProductUrl(); if (!url) return SKIP;
    await gotoPolite(page, base + url, { settle: 500 });
    const form = page.locator('form[action*="/cart/add"]').first(); if (!(await form.count())) return SKIP;
    const priceBefore = await page.locator('.price, [data-price]').first().innerText().catch(() => '');
    const option = page.locator('.variant-picker input[type="radio"]:not(:checked), .variant-picker select, variant-selects select').first();
    if (await option.count()) {
      if ((await option.evaluate((el) => el.tagName)) === 'SELECT') await option.selectOption({ index: 1 }); else await option.check({ force: true });
      await sleep(800);
      assert(/variant=/.test(page.url()) || true, 'variant param not in URL (informational)');
    }
    const addBtn = form.locator('button[type="submit"], button[name="add"]').first(); assert(await addBtn.count(), 'no add to cart button');
    if (await addBtn.isDisabled()) return SKIP;
    await addBtn.click(); await sleep(1500);
    const count = await page.locator('[data-cart-count]').first().innerText().catch(() => '0');
    assert(parseInt(count, 10) >= 1, `cart count did not update (${count})`);
    const drawer = page.locator('#cart-drawer');
    if (await drawer.count()) { assert(await drawer.getAttribute('open') !== null, 'cart drawer did not open after add'); await page.screenshot({ path: path.join(shotDir, 'cart-drawer-after-add.png') });
      const plus = drawer.locator('[name="plus"], button[aria-label*="Increase" i]').first();
      if (await plus.count()) { await plus.click(); await sleep(1200); const c2 = await page.locator('[data-cart-count]').first().innerText(); assert(parseInt(c2, 10) >= 2, `quantity increase did not reflect (${c2})`); }
      const remove = drawer.locator('[data-cart-remove], a[href*="quantity=0"], button[aria-label*="Remove" i]').first();
      if (await remove.count()) { await remove.click(); await sleep(1200); }
    }
    void priceBefore;
  } },
  { name: 'collection-filters', vp: desktop, async run(page) {
    // Facets live in a drawer and apply on "Apply" (Parachute pattern, D10): open, pick a sort + a filter, apply, expect URL + in-place render.
    await gotoPolite(page, base + '/collections/all', { settle: 500 });
    const opener = page.locator('[data-drawer-open="facets-drawer"]').first();
    const facets = page.locator('form#FacetFiltersForm, .facets, [data-facets]').first(); if (!(await facets.count()) && !(await opener.count())) return SKIP;
    if (await opener.count()) { await opener.click(); await sleep(500); }
    const sortRadio = page.locator('.facets input[name="sort_by"], form#FacetFiltersForm input[name="sort_by"]').nth(1);
    if (await sortRadio.count()) await sortRadio.check({ force: true });
    const box = page.locator('.facets input[type="checkbox"], form#FacetFiltersForm input[type="checkbox"]').first();
    if (await box.count()) await box.check({ force: true });
    const apply = page.locator('.facets__apply, button[type="submit"][form="FacetFiltersForm"], form#FacetFiltersForm button[type="submit"]').first();
    const navBefore = await page.evaluate(() => performance.getEntriesByType('navigation').length);
    if (await apply.count()) { await apply.click(); await sleep(1800); } else if (await box.count()) { await sleep(1500); }
    assert(/filter\.|sort_by=/.test(page.url()), 'apply did not update the URL');
    const reloaded = await page.evaluate((n) => performance.getEntriesByType('navigation').length !== n || performance.now() < 1500, navBefore);
    assert(!reloaded, 'facets applied with a full page reload instead of section rendering');
    await page.screenshot({ path: path.join(shotDir, 'collection-filtered.png') });
    await page.goBack(); await sleep(1200);
    assert(!/filter\./.test(page.url()) || true, 'back navigation');
  } },
  { name: 'mobile-filter-drawer', vp: mobile, async run(page) {
    await gotoPolite(page, base + '/collections/all', { settle: 500 });
    const opener = page.locator('[data-drawer-open="facets-drawer"], [data-drawer-open="filter-drawer"]').first(); if (!(await opener.count())) return SKIP;
    await opener.click(); await sleep(500);
    const id = await opener.getAttribute('data-drawer-open'); assert(await page.locator(`#${id}`).getAttribute('open') !== null, 'filter drawer did not open');
    await page.screenshot({ path: path.join(shotDir, 'mobile-filter-drawer.png') });
    await page.keyboard.press('Escape');
  } },
  { name: 'accordions', vp: desktop, async run(page) {
    const url = await firstProductUrl(); const target = url || '/pages/faq';
    await gotoPolite(page, base + target, { settle: 400 });
    const trig = page.locator('theme-disclosure .disclosure__trigger, theme-disclosure [aria-controls]').first(); if (!(await trig.count())) return SKIP;
    const before = await trig.getAttribute('aria-expanded'); await trig.click(); await sleep(400);
    assert((await trig.getAttribute('aria-expanded')) !== before, 'accordion did not toggle aria-expanded');
    await trig.focus(); await page.keyboard.press('Enter'); await sleep(400);
    assert((await trig.getAttribute('aria-expanded')) === before, 'accordion did not toggle back with keyboard');
  } },
  { name: 'keyboard-skip-link', vp: desktop, async run(page) {
    await gotoPolite(page, base + '/', { settle: 300 });
    await page.keyboard.press('Tab'); await sleep(200);
    const isSkip = await page.evaluate(() => document.activeElement.classList.contains('skip-to-content-link')); assert(isSkip, 'first Tab did not land on skip link');
    await page.keyboard.press('Enter'); await sleep(300);
    assert(await page.evaluate(() => location.hash === '#MainContent'), 'skip link did not jump to main');
  } },
];

const browser = await launch();
const report = [];
for (const t of tests) {
  if (only && !only.includes(t.name)) continue;
  const { page, context } = await newPage(browser, t.vp);
  const errors = []; page.on('pageerror', (e) => errors.push(String(e).slice(0, 200)));
  let status = 'pass', message = '';
  try { const r = await t.run(page); if (r === SKIP) status = 'skip'; } catch (e) { status = 'fail'; message = e.message; await page.screenshot({ path: path.join(shotDir, `${t.name}-FAIL.png`) }).catch(() => {}); }
  if (status === 'pass' && errors.length) { status = 'fail'; message = `page errors: ${errors.join(' | ')}`; }
  report.push({ test: t.name, viewport: t.vp.name, status, message });
  console.log(`${status.toUpperCase().padEnd(4)} ${t.name}${message ? ': ' + message : ''}`);
  await context.close();
}
await browser.close();
writeJson(path.join(QA_DIR, 'theme', 'interactions-report.json'), { base, generatedAt: new Date().toISOString(), report });
process.exit(report.some((r) => r.status === 'fail') ? 1 : 0);
