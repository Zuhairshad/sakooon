// Interaction states: mega menus, sticky header, mobile drawer (+ nested level), card hovers.
// Usage: node scripts/ref/storefront-states.mjs <parachute|tekla>
import fs from 'node:fs';
import { SITES, open, load, warm, out, dismiss, dismissed } from './storefront-lib.mjs';

const site = process.argv[2];
const url = SITES[site].home;
const data = { megaMenus: [], sticky: {}, mobile: {}, hovers: [] };
const shot = (page, name, opts = {}) => page.screenshot({ path: out(site, 'home', 'states', `${name}.png`), ...opts });

const CFG = {
  parachute: {
    triggers: '.cv-header__nav-trigger',
    panel: '.cv-header__dropdown',
    hamburger: '.cv-header__hamburger',
    drawer: '#cv-mobile-drawer',
    drawerItem: '.cv-header__drawer-section-summary',
    nested: 'Bedding',
    header: '.cv-header-section',
    cards: ['.cv-product-card, [class*=product-card]', '#shopify-section-home_category_grid a'],
  },
  tekla: {
    triggers: 'a[id^=desktop-mega-trigger]',
    panel: '[id^=desktop-mega-panel]',
    hamburger: 'button[aria-label="Open menu"]',
    drawer: '#mobile-menu-navigation',
    drawerItem: '#mobile-menu-navigation a, #mobile-menu-navigation button',
    nested: 'Bed',
    header: '.z-header',
    cards: ['#root a[href*="/product/"]', '#root a[href*="/collection"], #root a[href*="/bed"], #root a[href*="/bath"]'],
  },
}[site];

// Walk an open panel and describe columns, link groups and promo cells (structure only).
function describePanel(sel) {
  const vis = (e) => { const r = e.getBoundingClientRect(); const s = getComputedStyle(e); return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && +s.opacity > 0.05; };
  const panels = [...document.querySelectorAll(sel)].filter((e) => vis(e) && e.getBoundingClientRect().height > 60);
  const p = panels.sort((a, b) => b.getBoundingClientRect().height - a.getBoundingClientRect().height)[0];
  if (!p) return null;
  const r = p.getBoundingClientRect(); const s = getComputedStyle(p);
  // columns = the element with the most side-by-side visible children
  let row = p, best = 0;
  for (const e of [p, ...p.querySelectorAll('*')]) {
    const k = [...e.children].filter(vis); if (k.length < 2) continue;
    const t = k[0].getBoundingClientRect().top; const n = k.filter((c) => Math.abs(c.getBoundingClientRect().top - t) < 6).length;
    if (n > best) { best = n; row = e; }
  }
  const T = (e) => { const s = getComputedStyle(e); return `${s.fontSize}/${s.fontWeight} lh${s.lineHeight} ls${s.letterSpacing} ${s.textTransform} ${s.fontFamily.split(',')[0]}`; };
  const cols = [...row.children].filter(vis).map((c) => {
    const cr = c.getBoundingClientRect();
    const img = [...c.querySelectorAll('img,video')].find(vis);
    const links = [...c.querySelectorAll('a')].filter(vis);
    const heads = [...c.querySelectorAll('h2,h3,h4,h5,p,span,div')].filter((e) => vis(e) && e.children.length === 0 && e.innerText.trim() && !e.closest('a'));
    return {
      x: Math.round(cr.x), w: Math.round(cr.width), h: Math.round(cr.height),
      kind: img ? 'promo' : 'links',
      image: img ? { w: Math.round(img.getBoundingClientRect().width), h: Math.round(img.getBoundingClientRect().height), ar: +(img.getBoundingClientRect().width / img.getBoundingClientRect().height).toFixed(3) } : null,
      heading: heads[0] ? { text: heads[0].innerText.trim().slice(0, 40), style: T(heads[0]) } : null,
      linkCount: links.length,
      linkStyle: links[0] ? T(links[0]) : null,
      linkGap: links.length > 1 ? Math.round(links[1].getBoundingClientRect().top - links[0].getBoundingClientRect().bottom) : null,
      labels: links.map((a) => a.innerText.trim().replace(/\s+/g, ' ').slice(0, 40)),
    };
  });
  return { y: Math.round(r.y), h: Math.round(r.height), w: Math.round(r.width), x: Math.round(r.x), bg: s.backgroundColor, pad: s.padding, transition: s.transition, rowGap: getComputedStyle(row).gap, rowPad: getComputedStyle(row).padding, columns: cols };
}

// Sample a property over time to estimate transition timing.
async function timeline(page, sel, prop, action, ms = 700) {
  await page.evaluate(([sel, prop, ms]) => {
    window.__tl = []; const t0 = performance.now();
    const tick = () => { const els = [...document.querySelectorAll(sel)]; const e = els.find((x) => x.getBoundingClientRect().height > 0) || els[0]; if (e) { const s = getComputedStyle(e); window.__tl.push([Math.round(performance.now() - t0), s[prop], Math.round(e.getBoundingClientRect().height)]); } if (performance.now() - t0 < ms) requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  }, [sel, prop, ms]);
  await action();
  await page.waitForTimeout(ms + 100);
  const tl = await page.evaluate(() => window.__tl);
  // compress: keep changes only
  return tl.filter((x, i) => i === 0 || x[1] !== tl[i - 1][1] || x[2] !== tl[i - 1][2]).slice(0, 30);
}

// ---------- Desktop: mega menus, sticky, hovers ----------
{
  const { browser, page } = await open({ w: 1440, h: 900 });
  try {
  await load(page, url);
  await warm(page);
  const n = await page.locator(CFG.triggers).count();
  data.desktopTriggers = n;
  for (let i = 0; i < n; i++) {
    const t = page.locator(CFG.triggers).nth(i);
    const label = (await t.innerText()).trim();
    if (!(await t.isVisible())) continue;
    await page.mouse.move(700, 600); await page.waitForTimeout(500);
    await dismiss(page);
    let tl = [];
    try {
      tl = await timeline(page, CFG.panel, 'opacity', () => t.hover({ timeout: 5000 }));
    } catch (e) { data.megaMenus.push({ label, error: e.message.split('\n')[0] }); continue; }
    await page.waitForTimeout(400);
    const panel = await page.evaluate(describePanel, CFG.panel);
    const triggerStyle = await t.evaluate((e) => { const s = getComputedStyle(e); return { deco: s.textDecorationLine, offset: s.textUnderlineOffset, borderBottom: s.borderBottom, color: s.color, after: getComputedStyle(e, '::after').height + ' ' + getComputedStyle(e, '::after').backgroundColor }; });
    const header = await page.evaluate((sel) => { const h = document.querySelector(sel); const bar = h && h.querySelector('div'); return h ? { bg: getComputedStyle(h.querySelector('cv-header') || bar || h).backgroundColor, h: Math.round(h.getBoundingClientRect().height) } : null; }, CFG.header);
    const slug = label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    await shot(page, `mega-${String(i).padStart(2, '0')}-${slug}`);
    data.megaMenus.push({ label, panel, openTimeline: tl, triggerHover: triggerStyle, headerWhileOpen: header, screenshot: `states/mega-${String(i).padStart(2, '0')}-${slug}.png` });
    console.log('mega', label, panel ? `${panel.columns.length} cols ${panel.h}px` : 'NO PANEL');
  }
  // close timeline for last menu
  try { data.megaClose = await timeline(page, CFG.panel, 'opacity', () => page.mouse.move(700, 700)); } catch {}

  // Sticky header after scroll
  await page.mouse.move(700, 700);
  for (const y of [120, 900, 2400]) {
    await page.evaluate((y) => window.scrollTo(0, y), y); await page.waitForTimeout(900);
    data.sticky[`1440@${y}`] = await page.evaluate((sel) => { const h = document.querySelector(sel); const r = h.getBoundingClientRect(); const inner = h.querySelector('cv-header') || h.firstElementChild; const s = getComputedStyle(inner); return { top: Math.round(r.top), h: Math.round(r.height), bg: s.backgroundColor, color: s.color, shadow: s.boxShadow, transform: s.transform, borderBottom: s.borderBottom, cls: (inner.className + '').slice(0, 80) }; }, CFG.header);
    await shot(page, `sticky-1440-scroll${y}`);
  }
  // scroll up a bit to detect hide-on-scroll-down/show-on-scroll-up
  await page.evaluate(() => window.scrollTo(0, 2000)); await page.waitForTimeout(900);
  data.sticky['1440@2400->2000(up)'] = await page.evaluate((sel) => { const h = document.querySelector(sel); const r = h.getBoundingClientRect(); return { top: Math.round(r.top), h: Math.round(r.height) }; }, CFG.header);

  // Card hovers
  for (const [k, sel] of CFG.cards.entries()) {
    const loc = page.locator(sel).filter({ has: page.locator('img') });
    const c = await loc.count(); if (!c) { data.hovers.push({ sel, error: 'none found' }); continue; }
    const el = loc.first();
    await el.scrollIntoViewIfNeeded(); await page.waitForTimeout(600);
    const before = await el.evaluate((e) => { const imgs = [...e.querySelectorAll('img')]; return { imgs: imgs.map((i) => ({ src: (i.currentSrc || '').split('/').pop().slice(0, 40), op: getComputedStyle(i).opacity, tf: getComputedStyle(i).transform, tr: getComputedStyle(i).transition })), r: e.getBoundingClientRect().toJSON() }; });
    const box = before.r;
    await page.mouse.move(box.x + box.width / 2, box.y + Math.min(box.height / 2, 200)); await page.waitForTimeout(900);
    const after = await el.evaluate((e) => ({ imgs: [...e.querySelectorAll('img')].map((i) => ({ op: getComputedStyle(i).opacity, tf: getComputedStyle(i).transform })), deco: [...e.querySelectorAll('*')].filter((x) => getComputedStyle(x).textDecorationLine !== 'none').map((x) => x.innerText.trim().slice(0, 30)).slice(0, 3), quickAdd: [...e.querySelectorAll('button')].filter((b) => b.getBoundingClientRect().height > 0 && getComputedStyle(b).opacity > 0.5).map((b) => b.innerText.trim().slice(0, 30)) }));
    const clip = { x: Math.max(0, box.x - 8), y: Math.max(0, box.y - 8), width: Math.min(1440 - Math.max(0, box.x - 8), box.width + 16), height: Math.min(900, box.height + 16) };
    await shot(page, `hover-card-${k}`, { clip });
    data.hovers.push({ sel, count: c, size: { w: Math.round(box.width), h: Math.round(box.height) }, before: before.imgs, after });
  }
  } catch (e) { data.desktopError = e.message.split('\n')[0]; console.log('desktop blocked:', data.desktopError); }
  await browser.close();
}

// ---------- Mobile: sticky, drawer, nested ----------
for (const vp of [{ w: 390, h: 844 }, { w: 768, h: 900 }]) {
  const { browser, page } = await open(vp);
  const key = String(vp.w);
  data.mobile[key] = {};
  try { await load(page, url); } catch (e) { data.mobile[key].error = e.message.split('\n')[0]; console.log(key, 'blocked:', data.mobile[key].error); await browser.close(); continue; }
  await page.evaluate(() => window.scrollTo(0, 1200)); await page.waitForTimeout(900);
  await dismiss(page);
  data.mobile[key].stickyAt1200 = await page.evaluate((sel) => { const h = document.querySelector(sel); const r = h.getBoundingClientRect(); return { top: Math.round(r.top), h: Math.round(r.height) }; }, CFG.header);
  await shot(page, `sticky-${key}-scroll1200`);
  await page.evaluate(() => window.scrollTo(0, 0)); await page.waitForTimeout(600);
  await page.waitForTimeout(4000); await dismiss(page);
  const ham = page.locator(CFG.hamburger).filter({ visible: true }).first();
  if (!(await ham.count())) {
    // fall back: any visible header button without text
    data.mobile[key].hamburger = 'selector not matched';
    data.mobile[key].headerButtons = await page.evaluate((sel) => [...document.querySelector(sel).querySelectorAll('button,a')].filter((b) => b.getBoundingClientRect().height > 0).map((b) => (b.getAttribute('aria-label') || b.innerText || b.className).toString().trim().slice(0, 40)), CFG.header);
  } else {
    let tl = [];
    try { tl = await timeline(page, CFG.drawer, 'transform', () => ham.click(), 900); } catch (e) { data.mobile[key].error = e.message.split('\n')[0]; }
    await page.waitForTimeout(600);
    data.mobile[key].drawerTimeline = tl;
    data.mobile[key].drawer = await page.evaluate(([dsel, isel]) => {
      const vis = (e) => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && getComputedStyle(e).visibility !== 'hidden'; };
      const d = [...document.querySelectorAll(dsel)].find((e) => vis(e) && e.getBoundingClientRect().width > 200);
      if (!d) return null;
      const r = d.getBoundingClientRect(); const s = getComputedStyle(d);
      const items = [...d.querySelectorAll(isel)].filter(vis);
      const T = (e) => { const s = getComputedStyle(e); return `${s.fontSize}/${s.fontWeight} lh${s.lineHeight} ${s.textTransform} ${s.fontFamily.split(',')[0]}`; };
      return { x: Math.round(r.x), w: Math.round(r.width), h: Math.round(r.height), bg: s.backgroundColor, transition: s.transition, pad: s.padding, itemCount: items.length, items: items.map((i) => i.innerText.trim().slice(0, 30)), itemStyle: items[0] && T(items[0]), itemH: items[0] && Math.round(items[0].getBoundingClientRect().height), itemGap: items.length > 1 ? Math.round(items[1].getBoundingClientRect().top - items[0].getBoundingClientRect().bottom) : null, imgs: [...d.querySelectorAll('img')].filter(vis).map((m) => +(m.getBoundingClientRect().width / m.getBoundingClientRect().height).toFixed(2)).slice(0, 6) };
    }, [CFG.drawer, CFG.drawerItem]);
    await shot(page, `mobile-drawer-${key}`);
    // nested level: open an item that has children (prefer 3rd item, typically a category)
    const items = page.locator(CFG.drawerItem).filter({ visible: true });
    const ic = await items.count();
    const labels = await items.allInnerTexts();
    const want = labels.findIndex((t) => t.trim() === CFG.nested);
    for (const idx of [want, 2, 1, 3]) {
      if (idx < 0 || idx >= ic) continue;
      const it = items.nth(idx); const label = (await it.innerText()).trim();
      try { await it.click({ timeout: 4000 }); } catch { continue; }
      await page.waitForTimeout(900);
      if (page.url() !== url && !page.url().startsWith(url + '#')) { data.mobile[key].nestedNote = `item "${label}" navigated to ${page.url()}`; break; }
      data.mobile[key].nested = await page.evaluate(([dsel]) => {
        const vis = (e) => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && getComputedStyle(e).visibility !== 'hidden'; };
        const d = [...document.querySelectorAll(dsel)].find((e) => vis(e) && e.getBoundingClientRect().width > 200);
        if (!d) return null;
        const links = [...d.querySelectorAll('a')].filter((a) => vis(a) && a.getBoundingClientRect().left >= 0 && a.getBoundingClientRect().left < innerWidth);
        const T = (e) => { const s = getComputedStyle(e); return `${s.fontSize}/${s.fontWeight} lh${s.lineHeight} ${s.textTransform}`; };
        const heads = [...d.querySelectorAll('h2,h3,h4,p,summary,span')].filter((e) => vis(e) && e.children.length === 0 && e.innerText.trim() && !e.closest('a') && e.getBoundingClientRect().left >= 0 && e.getBoundingClientRect().left < innerWidth);
        return { linkCount: links.length, links: links.map((a) => a.innerText.trim().replace(/\s+/g, ' ').slice(0, 30)).slice(0, 40), linkStyle: links[0] && T(links[0]), headings: heads.slice(0, 12).map((h) => h.innerText.trim().slice(0, 30) + ' ' + T(h)), promoImgs: [...d.querySelectorAll('img')].filter((m) => vis(m) && m.getBoundingClientRect().left >= 0 && m.getBoundingClientRect().left < innerWidth).map((m) => ({ w: Math.round(m.getBoundingClientRect().width), ar: +(m.getBoundingClientRect().width / m.getBoundingClientRect().height).toFixed(2) })).slice(0, 6) };
      }, [CFG.drawer]);
      data.mobile[key].nestedLabel = label;
      await shot(page, `mobile-drawer-${key}-nested`);
      await shot(page, `mobile-drawer-${key}-nested-full`, { fullPage: false });
      break;
    }
  }
  await browser.close();
}

data.dismissed = [...dismissed];
fs.writeFileSync(out(site, 'home', 'states.json'), JSON.stringify(data, null, 1));
console.log('done', site, 'dismissed', data.dismissed);
