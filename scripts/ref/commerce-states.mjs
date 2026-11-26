// Interaction states on Parachute: collection, product, cart, search.
// Usage: node scripts/ref/commerce-states.mjs <collection|product|cart|search> <viewport>
import { open, gotoPolite, shot, measure, saveJSON, saveLog, note, BASE } from './commerce-lib.mjs';

const which = process.argv[2];
const w = +(process.argv[3] || 1440);
const mobile = w < 768;
const results = {};
const t0 = () => performance.now();

// Watch an element's rect over time to estimate transition duration.
async function settleTime(page, sel, ms = 1500) {
  return page.evaluate(async ([sel, ms]) => {
    const start = performance.now(); let last = null, lastChange = 0;
    while (performance.now() - start < ms) {
      const e = document.querySelector(sel); const r = e ? e.getBoundingClientRect() : null;
      const k = r ? `${Math.round(r.x)},${Math.round(r.y)},${Math.round(r.width)},${getComputedStyle(e).opacity}` : 'none';
      if (k !== last) { last = k; lastChange = performance.now() - start; }
      await new Promise(r => requestAnimationFrame(r));
    }
    return Math.round(lastChange);
  }, [sel, ms]);
}

async function collection() {
  const { browser, page } = await open(w, `${BASE}/collections/sheet-sets`);
  const P = 'collection';
  // Card hover image + swatch hover (pointer devices only)
  if (!mobile) {
    const card = page.locator('li.cv-product-grid-card').first();
    await card.scrollIntoViewIfNeeded(); await page.waitForTimeout(500);
    const before = await page.$eval('.cv-product-card__image--hover', e => ({ op: getComputedStyle(e).opacity, tr: getComputedStyle(e).transition }));
    await page.hover('.cv-product-card__media >> nth=0', { force: true });
    await page.waitForTimeout(700);
    const after = await page.$eval('.cv-product-card__image--hover', e => getComputedStyle(e).opacity);
    results.cardHover = { before, afterOpacity: after };
    await card.screenshot({ path: `/Users/shad/sakooon-qa/references/parachute/${P}/states/card-hover-${w}.png` }).catch(() => {});
    const srcBefore = await page.$eval('.cv-product-card__image', e => e.currentSrc);
    const linkBefore = await page.$eval('.cv-product-card__link', e => e.href);
    await page.hover('.cv-product-card__swatches .cv-product-swatch__link >> nth=0', { force: true });
    await page.waitForTimeout(800);
    results.swatchHover = {
      imageChanged: srcBefore !== await page.$eval('.cv-product-card__image', e => e.currentSrc),
      linkChanged: linkBefore !== await page.$eval('.cv-product-card__link', e => e.href),
      chipStyles: await page.$eval('.cv-product-card__swatches .cv-product-swatch__link', e => { const c = getComputedStyle(e), a = getComputedStyle(e, '::after'), b = getComputedStyle(e, '::before'); return { outline: c.outline, boxShadow: c.boxShadow, border: c.border, after: a.content !== 'none' ? `${a.width}x${a.height} ${a.border} ${a.borderRadius}` : null, before: b.content !== 'none' ? `${b.width}x${b.height} ${b.border} ${b.boxShadow}` : null }; }),
      selectedStyles: await page.$eval('cv-product-swatch[selected] .cv-product-swatch__link', e => { const a = getComputedStyle(e, '::after'), b = getComputedStyle(e, '::before'); return { after: `${a.content} ${a.width}x${a.height} ${a.border} ${a.borderRadius} ${a.inset}`, before: `${b.content} ${b.width}x${b.height} ${b.border} ${b.boxShadow}` }; }),
    };
    await card.screenshot({ path: `/Users/shad/sakooon-qa/references/parachute/${P}/states/swatch-hover-${w}.png` }).catch(() => {});
  }
  // Pagination markup
  results.pagination = await page.evaluate(() => { const g = document.querySelector('.cv-collection-product-grid'); const n = g && [...g.children].filter(c => c.id !== 'product-grid'); return n ? n.map(c => c.outerHTML.replace(/\s+/g, ' ').slice(0, 600)) : null; });
  // Filter drawer
  await page.evaluate(() => scrollTo(0, 0));
  await page.click('.cv-collection-filters .cv-drawer__button');
  const dur = await settleTime(page, '.cv-collection-filters dialog');
  await page.waitForTimeout(400);
  results.filterDrawer = { settleMs: dur, ...(await measure(page, {
    dialog: '.cv-collection-filters dialog[open]', backdrop: '.cv-collection-filters dialog[open]', form: '.cv-collection-filters__form',
    close: '.cv-collection-filters dialog[open] button[class*=close], .cv-collection-filters dialog[open] button',
    sortOption: '.cv-collection-filters__form input[type=radio]', sortLabel: '.cv-collection-filters__form label',
    groupHeading: '.cv-collection-filters__form legend, .cv-collection-filters__form h3, .cv-collection-filters__form [class*=heading]',
    checkbox: '.cv-collection-filters__form input[type=checkbox]', colorStrip: '.cv-collection-filters__form [class*=chip], .cv-collection-filters__form [class*=swatch]',
    count: '.cv-collection-filters__form [class*=count]', reset: '.cv-collection-filters__form button[type=reset], .cv-collection-filters__form a[href*=sheet-sets]',
    apply: '.cv-collection-filters__form button[type=submit]',
  })) };
  results.filterDrawer.backdrop = await page.$eval('.cv-collection-filters dialog[open]', d => getComputedStyle(d, '::backdrop').backgroundColor).catch(() => null);
  results.filterFormFields = await page.$$eval('.cv-collection-filters__form input', is => is.slice(0, 40).map(i => `${i.type} ${i.name}=${i.value}`));
  await shot(page, P, `filter-drawer-open-${w}.png`, { states: true });
  // Sort + facet then apply
  await page.locator('.cv-collection-filters__form label:has-text("Price ascending")').first().click().catch(e => note('sort click: ' + e.message.split('\n')[0]));
  await page.locator('.cv-collection-filters__form label:has-text("Linen")').first().click().catch(e => note('facet click: ' + e.message.split('\n')[0]));
  await page.waitForTimeout(800);
  results.liveUpdateBeforeApply = await page.evaluate(() => location.href);
  await shot(page, P, `sort-and-filter-selected-${w}.png`, { states: true });
  const t = t0();
  await page.click('.cv-collection-filters__form button[type=submit]');
  await page.waitForLoadState('domcontentloaded'); await page.waitForTimeout(3000);
  results.afterApply = { url: page.url(), ms: Math.round(t0() - t), cards: await page.$$eval('li.cv-product-grid-card', l => l.length), activeChips: await page.$$eval('[class*=active-filter], [class*=applied], .cv-collection-filters [class*=pill], .cv-collection-filters__label', e => e.map(x => x.innerText.trim()).filter(Boolean)) };
  await shot(page, P, `filtered-results-${w}.png`, { states: true });
  // Empty state: impossible filter combination via real URL params
  await gotoPolite(page, `${BASE}/collections/sheet-sets?filter.v.price.gte=5000`);
  results.emptyState = await page.evaluate(() => { const g = document.querySelector('.cv-collection-product-grid, main'); return g ? g.innerText.trim().slice(0, 300) : null; });
  await shot(page, P, `empty-state-${w}.png`, { states: true });
  await browser.close();
}

async function product() {
  const P = 'product';
  // Find a product in the collection with a sold-out variant (public product.js)
  const { browser, page } = await open(w, `${BASE}/products/percale-sheet-set-evergreen-f-q`);
  const soldOut = await page.evaluate(async () => {
    const r = await fetch('/collections/sheet-sets/products.json?limit=60').then(r => r.json());
    for (const p of r.products) { const v = p.variants.find(v => !v.available); if (v) return { handle: p.handle, variant: v.id, title: v.title }; }
    const r2 = await fetch('/collections/duvet-covers/products.json?limit=60').then(r => r.json());
    for (const p of r2.products) { const v = p.variants.find(v => !v.available); if (v) return { handle: p.handle, variant: v.id, title: v.title }; }
    return null;
  });
  results.soldOutCandidate = soldOut;
  // Swatch hover + selected
  if (!mobile) {
    const sw = page.locator('.cv-product-swatches--product-page .cv-product-swatch__link').nth(0);
    await sw.hover({ force: true }); await page.waitForTimeout(600);
    results.swatchHover = { label: await page.$eval('.cv-product-swatches__label', e => e.innerText), tooltip: await page.evaluate(() => [...document.querySelectorAll('[role=tooltip],[class*=tooltip]')].filter(e => e.offsetParent).map(e => e.innerText).join('|')) };
    await page.locator('.cv-product-swatches--product-page').screenshot({ path: `/Users/shad/sakooon-qa/references/parachute/${P}/states/swatch-hover-${w}.png` }).catch(() => {});
  }
  results.swatchSelected = await page.$eval('.cv-product-swatches--product-page cv-product-swatch[selected] .cv-product-swatch__link', e => { const a = getComputedStyle(e, '::after'), b = getComputedStyle(e, '::before'); return { after: `${a.content} ${a.width}x${a.height} ${a.border} ${a.borderRadius}`, before: `${b.content} ${b.width}x${b.height} ${b.border} ${b.boxShadow}`, outline: getComputedStyle(e).outline }; }).catch(e => e.message);
  results.swatchIsLink = await page.$eval('.cv-product-swatches--product-page .cv-product-swatch__link', e => e.tagName + ' ' + e.getAttribute('href'));
  await page.locator('.cv-buy-box').screenshot({ path: `/Users/shad/sakooon-qa/references/parachute/${P}/states/buy-box-default-${w}.png` }).catch(() => {});
  // Size selected
  const urlBefore = page.url(); const priceBefore = await page.$eval('.cv-buy-buttons__prices', e => e.innerText);
  const imgBefore = await page.$eval('.cv-media-gallery__slide img', e => e.currentSrc).catch(() => null);
  await page.selectOption('select[id$="-size"]', { label: 'King' });
  await page.waitForTimeout(1500);
  results.sizeSelected = { urlBefore, urlAfter: page.url(), priceBefore, priceAfter: await page.$eval('.cv-buy-buttons__prices', e => e.innerText), galleryChanged: imgBefore !== await page.$eval('.cv-media-gallery__slide img', e => e.currentSrc).catch(() => null), lowStock: await page.$eval('.cv-low-stock-note', e => e.innerText).catch(() => '') };
  await page.locator('.cv-buy-box').screenshot({ path: `/Users/shad/sakooon-qa/references/parachute/${P}/states/size-selected-${w}.png` }).catch(() => {});
  // Gallery
  if (!mobile) {
    await page.click('.cv-carousel__arrow >> nth=1'); const ms = await settleTime(page, '.cv-media-gallery__slide', 1200);
    results.galleryArrow = { settleMs: ms, count: await page.$eval('.cv-carousel__slide-count', e => e.innerText) };
  } else {
    const track = await page.$('.cv-media-gallery ul');
    const box = await track.boundingBox();
    await page.evaluate(() => { const u = document.querySelector('.cv-media-gallery ul'); const s = getComputedStyle(u); window.__snap = { overflowX: s.overflowX, snap: s.scrollSnapType, sw: u.scrollWidth, cw: u.clientWidth }; u.scrollBy({ left: u.clientWidth, behavior: 'smooth' }); });
    await page.waitForTimeout(1000);
    results.gallerySwipe = { box, ...(await page.evaluate(() => window.__snap)), count: await page.$eval('.cv-carousel__slide-count', e => e.innerText).catch(() => null) };
  }
  await page.waitForTimeout(500);
  await shot(page, P, `gallery-next-${w}.png`, { states: true });
  // Zoom / lightbox
  await page.click('.cv-media-gallery__slide__media a >> nth=0', { timeout: 5000 }).catch(() => {});
  await page.waitForTimeout(1200);
  results.zoom = await page.evaluate(() => [...document.querySelectorAll('dialog[open],[class*=lightbox],[class*=zoom]')].filter(e => e.getBoundingClientRect().width > 200).map(e => `${e.tagName}.${String(e.className).slice(0, 60)} ${Math.round(e.getBoundingClientRect().width)}x${Math.round(e.getBoundingClientRect().height)}`));
  results.zoomUrl = page.url();
  await shot(page, P, `gallery-zoom-${w}.png`, { states: true });
  await page.keyboard.press('Escape'); await page.waitForTimeout(600);
  if (!page.url().includes('percale-sheet-set')) await page.goBack();
  // Detail drawer (accordion equivalent)
  await page.evaluate(() => scrollTo(0, 0));
  const rows = await page.$$eval('.cv-product-details__text', e => e.map(x => x.innerText.replace(/\n/g, ' / ')));
  results.detailRows = rows;
  await page.click('.cv-product-details .cv-drawer__button >> nth=1');
  const dd = await settleTime(page, '.cv-product-details dialog[open]', 1200);
  await page.waitForTimeout(400);
  results.detailDrawer = { settleMs: dd, ...(await measure(page, { dialog: '.cv-product-details dialog[open]', heading: '.cv-product-details dialog[open] h2, .cv-product-details dialog[open] h3', body: '.cv-product-details dialog[open] [class*=content]', section: '.cv-product-details dialog[open] details, .cv-product-details dialog[open] [class*=accordion]', summary: '.cv-product-details dialog[open] summary' })) };
  results.detailDrawerText = await page.$eval('.cv-product-details dialog[open]', d => d.innerText.slice(0, 1500)).catch(() => null);
  await shot(page, P, `details-drawer-open-${w}.png`, { states: true });
  const summ = page.locator('.cv-product-details dialog[open] summary').first();
  if (await summ.isVisible().catch(() => false)) { await summ.click(); await page.waitForTimeout(500); await shot(page, P, `accordion-open-${w}.png`, { states: true }); }
  await page.keyboard.press('Escape'); await page.waitForTimeout(500);
  await page.click('.cv-product-details .cv-drawer__button >> nth=0'); await page.waitForTimeout(900);
  results.sizeGuideText = await page.$eval('.cv-product-details dialog[open]', d => d.innerText.slice(0, 800)).catch(() => null);
  await shot(page, P, `size-guide-open-${w}.png`, { states: true });
  await page.keyboard.press('Escape'); await page.waitForTimeout(500);
  // Sticky buy bar
  await page.evaluate(() => scrollTo(0, 1600)); await page.waitForTimeout(1200);
  results.sticky = await page.evaluate(() => [...document.querySelectorAll('body *')].filter(e => { const s = getComputedStyle(e); const r = e.getBoundingClientRect(); return (s.position === 'fixed' || s.position === 'sticky') && r.height > 30 && r.height < 200 && r.width > 200 && r.bottom > 0 && r.y < innerHeight && s.visibility !== 'hidden' && +s.opacity > 0; }).map(e => `${e.tagName}.${String(e.className).slice(0, 60)} pos=${getComputedStyle(e).position} [${Math.round(e.getBoundingClientRect().x)},${Math.round(e.getBoundingClientRect().y)} ${Math.round(e.getBoundingClientRect().width)}x${Math.round(e.getBoundingClientRect().height)}] text=${e.innerText.replace(/\s+/g, ' ').slice(0, 80)}`));
  results.infoColSticky = await page.$eval('.product__info-container', e => ({ pos: getComputedStyle(e).position, top: getComputedStyle(e).top }));
  await shot(page, P, `scrolled-1600-sticky-${w}.png`, { states: true });
  // Sold-out variant
  if (soldOut) {
    await gotoPolite(page, `${BASE}/products/${soldOut.handle}?variant=${soldOut.variant}`);
    results.soldOut = { ...soldOut, button: await page.$eval('cv-buy-buttons button', b => ({ text: b.innerText.replace(/\s+/g, ' '), disabled: b.disabled, bg: getComputedStyle(b).backgroundColor })).catch(e => e.message), options: await page.$$eval('cv-variant-picker select', ss => ss.map(s => [...s.options].map(o => o.text.trim() + (o.disabled ? '(disabled)' : '')).join(' | '))) };
    await page.locator('.cv-buy-box').screenshot({ path: `/Users/shad/sakooon-qa/references/parachute/${P}/states/sold-out-variant-${w}.png` }).catch(() => {});
  } else note('no sold-out variant found in sheet-sets / duvet-covers');
  await browser.close();
}

async function cart() {
  const P = 'cart';
  const { browser, page } = await open(w, `${BASE}/products/percale-sheet-set-evergreen-f-q`);
  const reqs = [];
  page.on('request', r => { const u = r.url(); if (/\/cart(\/|\.js|\?)|section|rebuy/.test(u) && r.resourceType() !== 'image') reqs.push(`${r.method()} ${u.replace(BASE, '').slice(0, 140)}`); });
  await page.click('cv-buy-buttons button[type=submit], cv-buy-buttons button');
  const ms = await settleTime(page, '.rebuy-cart__flyout', 2500);
  await page.waitForTimeout(1500);
  const spec = { flyout: '.rebuy-cart__flyout', header: '.rebuy-cart__flyout-header', title: '.rebuy-cart__flyout-title, .rebuy-cart__flyout-header h2, .rebuy-cart__flyout-header h3', close: '.rebuy-cart__flyout-close', progress: '[class*=progress-bar], [class*=tiered]', item: '.rebuy-cart__flyout-item', itemMedia: '.rebuy-cart__flyout-item-media img, .rebuy-cart__flyout-item-media', itemTitle: '.rebuy-cart__flyout-item-product-title', itemVariant: '.rebuy-cart__flyout-item-variant-title', itemPrice: '.rebuy-cart__flyout-item-price, .rebuy-cart__flyout-item-price .rebuy-money', qty: '.rebuy-cart__flyout-item-quantity, [class*=quantity-widget]', qtyBtn: '.rebuy-cart__flyout-item-quantity button, [class*=quantity-widget] button', remove: '.rebuy-cart__flyout-item-remove', recs: '.rebuy-cart__flyout-recommendations, [class*=recommend]', footer: '.rebuy-cart__flyout-footer', subtotal: '.rebuy-cart__flyout-subtotal', checkout: '.rebuy-cart__checkout-button', backdrop: '.rebuy-cart__background' };
  results.oneItem = { openSettleMs: ms, ...(await measure(page, spec)) };
  results.oneItemText = await page.$eval('.rebuy-cart__flyout', e => e.innerText.slice(0, 1200)).catch(() => null);
  await shot(page, P, `drawer-1-item-${w}.png`, { states: true });
  // Quantity +
  const plus = page.locator('.rebuy-cart__flyout-item button[aria-label*=increase i], .rebuy-cart__flyout-item button[aria-label*=plus i], .rebuy-cart__flyout-item .rebuy-cart__flyout-item-quantity-widget-button').last();
  const t = t0();
  await plus.click().catch(e => note('qty+ ' + e.message.split('\n')[0]));
  await page.waitForTimeout(400); await shot(page, P, `quantity-loading-${w}.png`, { states: true });
  await page.waitForTimeout(1800);
  results.qtyChange = { ms: Math.round(t0() - t), text: await page.$eval('.rebuy-cart__flyout-item', e => e.innerText.replace(/\s+/g, ' ')).catch(() => null) };
  await shot(page, P, `quantity-changed-${w}.png`, { states: true });
  // Second item
  await gotoPolite(page, `${BASE}/products/down-pillow`);
  await page.click('cv-buy-buttons button').catch(e => note('2nd add ' + e.message.split('\n')[0]));
  await page.waitForTimeout(3500);
  results.twoItems = await measure(page, { flyout: '.rebuy-cart__flyout', item: '.rebuy-cart__flyout-item', items: '.rebuy-cart__flyout-items' });
  await shot(page, P, `drawer-2-items-${w}.png`, { states: true });
  // Cart page
  await gotoPolite(page, `${BASE}/cart`);
  results.cartPage = { url: page.url(), text: await page.evaluate(() => (document.querySelector('main') || document.body).innerText.slice(0, 800)), flyoutOpen: await page.$eval('.rebuy-cart__flyout', e => getComputedStyle(e).transform + ' ' + e.getBoundingClientRect().x).catch(() => null) };
  await shot(page, P, `cart-page-${w}.png`, { states: true }); await shot(page, P, `cart-page-full-${w}.png`, { states: true, full: true });
  // Remove all → empty
  for (let i = 0; i < 4; i++) { const r = page.locator('.rebuy-cart__flyout-item-remove, main a[href*="quantity=0"], main button[name*=remove i]').first(); if (await r.isVisible().catch(() => false)) { await r.click().catch(() => {}); await page.waitForTimeout(2000); } }
  await gotoPolite(page, `${BASE}/cart/clear`).catch(() => {}); // public endpoint: empties this browser's cart only
  await gotoPolite(page, `${BASE}/cart`);
  results.emptyCart = await page.evaluate(() => (document.querySelector('main') || document.body).innerText.slice(0, 400));
  await shot(page, P, `cart-empty-${w}.png`, { states: true });
  results.requests = [...new Set(reqs)].slice(0, 60);
  await browser.close();
}

async function search() {
  const P = 'search';
  const { browser, page } = await open(w, `${BASE}/collections/sheet-sets`);
  const reqs = [];
  page.on('request', r => { const u = r.url(); if (/search|suggest|rebuy/.test(u) && r.resourceType() !== 'image') reqs.push(`${r.method()} ${u.replace(BASE, '').slice(0, 160)}`); });
  if (mobile) {
    const menu = page.locator('header button[aria-label*=menu i], .cv-header__menu-toggle, header [class*=hamburger]').locator('visible=true').first();
    const s = page.locator('a.cv-header__utility-link[aria-label=Search]').locator('visible=true').first();
    if (await s.count()) await s.click(); else { await menu.click(); await page.waitForTimeout(800); }
  } else await page.locator('a.cv-header__utility-link[aria-label=Search]').locator('visible=true').first().click();
  const ms = await settleTime(page, '#searchInput', 1500);
  await page.waitForTimeout(1200);
  const spec = { input: '#searchInput', overlay: '.rebuy-quick-view__overlay, [class*=smart-search]', heading: '[class*=smart-search] h2, [class*=smart-search] h3, [class*=smart-search] [class*=title]', card: '.rebuy-smart-search__product, [class*=smart-search] [class*=product]', image: '.rebuy-quick-view_image', close: '[class*=smart-search] [class*=close], [aria-label*=close i]' };
  results.openEmpty = { settleMs: ms, ...(await measure(page, spec)), text: await page.evaluate(() => { const o = document.querySelector('[class*=smart-search]'); return o ? o.innerText.slice(0, 600) : null; }) };
  await shot(page, P, `overlay-open-empty-${w}.png`, { states: true });
  await page.keyboard.type('linen', { delay: 90 });
  await page.waitForTimeout(2500);
  results.typed = { ...(await measure(page, spec)), text: await page.evaluate(() => { const o = document.querySelector('[class*=smart-search]'); return o ? o.innerText.slice(0, 900) : null; }) };
  await shot(page, P, `overlay-typed-${w}.png`, { states: true });
  await page.keyboard.press('Enter'); await page.waitForTimeout(5000);
  results.enterUrl = page.url();
  await shot(page, P, `results-after-enter-${w}.png`, { states: true });
  await gotoPolite(page, `${BASE}/search?q=zzzzqx`);
  results.noResults = await page.evaluate(() => (document.querySelector('main') || document.body).innerText.slice(0, 300));
  await shot(page, P, `no-results-${w}.png`, { states: true });
  results.requests = [...new Set(reqs)].slice(0, 40);
  await browser.close();
}

try { await ({ collection, product, cart, search })[which](); }
catch (e) { note(`${which} states @${w} ERROR ${e.message.split('\n')[0]}`); results._error = e.message.split('\n')[0]; }
saveJSON(which, `states-${w}.json`, results);
saveLog(`${which}-states`);
console.log(JSON.stringify(results, null, 1).slice(0, 6000));
process.exit(0); // browsers left open by a failed step must not keep the run alive
