// Tekla desktop mega menu, second level: hover "Shop", then each left-list category.
import fs from 'node:fs';
import { open, load, out, dismiss } from './storefront-lib.mjs';
const { browser, page } = await open({ w: 1440, h: 900 });
await load(page, 'https://teklafabrics.com/');
await page.locator('a[id^=desktop-mega-trigger]', { hasText: 'Shop' }).first().hover();
await page.waitForTimeout(800);
const res = {};
const panel = page.locator('[id^=desktop-mega-panel]').filter({ visible: true }).first();
res.leftColumn = await panel.evaluate((p) => { const c = p.firstElementChild; const s = getComputedStyle(c); const items = [...c.querySelectorAll('a,button')].filter((e) => e.getBoundingClientRect().height > 0); const T = (e) => { const s = getComputedStyle(e); return `${s.fontSize}/${s.fontWeight} lh${s.lineHeight} color ${s.color}`; }; return { w: Math.round(c.getBoundingClientRect().width), pad: s.padding, border: s.borderRight, items: items.map((e) => e.innerText.trim()), itemStyle: T(items[0]), itemH: Math.round(items[0].getBoundingClientRect().height), pitch: Math.round(items[1].getBoundingClientRect().top - items[0].getBoundingClientRect().top), hoverColor: null }; });
for (const label of ['Bed', 'Bath', 'Clothing']) {
  const it = panel.locator('a,button', { hasText: new RegExp(`^${label}$`) }).first();
  await it.hover(); await page.waitForTimeout(700);
  res[label] = await panel.evaluate((p) => {
    const vis = (e) => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && getComputedStyle(e).visibility !== 'hidden' && +getComputedStyle(e).opacity > 0.05; };
    const right = p.children[1]; const T = (e) => { const s = getComputedStyle(e); return `${s.fontSize}/${s.fontWeight} lh${s.lineHeight} color ${s.color}`; };
    const groups = [...right.querySelectorAll('ul, div')].filter((e) => vis(e) && e.querySelectorAll(':scope > li > a, :scope > a').length >= 2 && e.getBoundingClientRect().left >= 360);
    const imgs = [...right.querySelectorAll('img')].filter(vis).map((m) => { const r = m.getBoundingClientRect(); return { x: Math.round(r.x), w: Math.round(r.width), h: Math.round(r.height) }; });
    const heads = [...right.querySelectorAll('p,span,h3,h4')].filter((e) => vis(e) && e.children.length === 0 && !e.closest('a') && e.innerText.trim()).map((e) => ({ t: e.innerText.trim().slice(0, 30), s: T(e), x: Math.round(e.getBoundingClientRect().x) }));
    return { groups: groups.map((g) => { const as = [...g.querySelectorAll('a')].filter(vis); return { x: Math.round(g.getBoundingClientRect().x), w: Math.round(g.getBoundingClientRect().width), n: as.length, style: T(as[0]), pitch: as.length > 1 ? Math.round(as[1].getBoundingClientRect().top - as[0].getBoundingClientRect().top) : null }; }), headings: heads, images: imgs, activeLeft: [...p.firstElementChild.querySelectorAll('a,button')].map((e) => e.innerText.trim() + ':' + getComputedStyle(e).color) };
  });
  await page.screenshot({ path: out('tekla', 'home', 'states', `mega-shop-l2-${label.toLowerCase()}.png`) });
}
fs.writeFileSync(out('tekla', 'home', 'states-l2.json'), JSON.stringify(res, null, 1));
console.log(JSON.stringify(res, null, 1).slice(0, 5000));
await browser.close();
