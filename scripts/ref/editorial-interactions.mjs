// Page-specific interaction states that the generic capture can't find (Tekla has no <main>,
// size-guide rows are buttons opening a panel, stories filters are links).
// usage: node scripts/ref/editorial-interactions.mjs
import { chromium } from 'playwright';
import fs from 'node:fs/promises';
const OUT = '/Users/shad/sakooon-qa/references/tekla';
const b = await chromium.launch();
const results = {};
const frames = async (page, dir, name, times) => { for (const t of times) { await page.waitForTimeout(t.wait); await page.screenshot({ path: `${dir}/${name}-${t.label}.png` }); } };

async function open(url, vw) {
  const ctx = await b.newContext({ viewport: { width: vw, height: vw <= 400 ? 844 : 900 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: 'load' }); await page.waitForTimeout(2000);
  const btn = page.getByRole('button', { name: /^only necessary$/i }); if (await btn.isVisible().catch(() => false)) { await btn.click(); await page.waitForTimeout(500); }
  return { ctx, page };
}

for (const vw of [1440, 390]) {
  // 1. Size guide: category rows
  { const dir = `${OUT}/size-guide/states`; await fs.mkdir(dir, { recursive: true });
    const { ctx, page } = await open('https://teklafabrics.com/size-guide', vw);
    const row = page.getByText('Bedroom', { exact: true }).first();
    const rowInfo = await row.evaluate(el => { const r = el.closest('button, a, li, div[role]') || el.parentElement; const s = getComputedStyle(r), bb = r.getBoundingClientRect(); return { tag: r.tagName, h: Math.round(bb.height), w: Math.round(bb.width), pad: s.padding, borderTop: s.borderTop, borderBottom: s.borderBottom, font: `${getComputedStyle(el).fontSize}/${getComputedStyle(el).lineHeight} ${getComputedStyle(el).fontWeight}`, transition: s.transition }; });
    await page.screenshot({ path: `${dir}/${vw}-rows-default.png` });
    await row.hover(); await page.waitForTimeout(400); await page.screenshot({ path: `${dir}/${vw}-row-hover.png` });
    const before = page.url();
    await row.click(); await frames(page, dir, `${vw}-row-open`, [{ wait: 100, label: '100ms' }, { wait: 250, label: '350ms' }, { wait: 900, label: 'settled' }]);
    const after = await page.evaluate(() => {
      const dlg = [...document.querySelectorAll('[role="dialog"], aside, [class*="drawer" i], [class*="modal" i]')].find(el => { const r = el.getBoundingClientRect(); return r.width > 200 && r.height > 200 && getComputedStyle(el).visibility !== 'hidden'; });
      const tables = [...document.querySelectorAll('table')].filter(t => t.getBoundingClientRect().width > 0).slice(0, 2).map(t => ({ w: Math.round(t.getBoundingClientRect().width), rows: t.rows.length, cols: t.rows[0]?.cells.length, head: [...(t.rows[0]?.cells || [])].map(c => c.innerText.trim()).slice(0, 6), rowH: [...t.rows].slice(0, 3).map(r => Math.round(r.getBoundingClientRect().height)), cell: (() => { const c = t.rows[1]?.cells[0]; if (!c) return null; const s = getComputedStyle(c); return { pad: s.padding, border: s.borderBottom, font: `${s.fontSize}/${s.lineHeight} ${s.fontWeight}`, align: s.textAlign }; })() }));
      const toggles = [...document.querySelectorAll('button, [role="tab"], select, input[type="radio"]')].filter(e => /^(cm|in|inch|eu|us|uk|dk)/i.test((e.innerText || e.value || '').trim())).map(e => (e.innerText || e.value).trim()).slice(0, 8);
      return { dialog: dlg ? { cls: String(dlg.className).slice(0, 80), w: Math.round(dlg.getBoundingClientRect().width), h: Math.round(dlg.getBoundingClientRect().height), x: Math.round(dlg.getBoundingClientRect().left), transition: getComputedStyle(dlg).transition } : null, tables, toggles, text: (dlg || document.body).innerText.slice(0, 400) };
    });
    results[`size-guide@${vw}`] = { rowInfo, navigated: page.url() !== before ? page.url() : false, after };
    if (page.url() !== before) await page.screenshot({ path: `${dir}/${vw}-category-page-full.png`, fullPage: true });
    await ctx.close(); }

  // 2. Shipping and returns: accordion
  { const dir = `${OUT}/shipping-and-returns/states`; await fs.mkdir(dir, { recursive: true });
    const { ctx, page } = await open('https://teklafabrics.com/shipping-and-returns', vw);
    const q = page.getByText('Shipping rates and delivery estimates').first();
    await q.scrollIntoViewIfNeeded(); await page.waitForTimeout(300);
    const info = await q.evaluate(el => { const btn = el.closest('button, summary, [aria-expanded]') || el.parentElement; const row = btn.parentElement; const s = getComputedStyle(btn); const icon = btn.querySelector('svg'); return { tag: btn.tagName, ariaExpanded: btn.getAttribute('aria-expanded'), h: Math.round(btn.getBoundingClientRect().height), w: Math.round(btn.getBoundingClientRect().width), pad: s.padding, borderBottom: getComputedStyle(row).borderBottom + ' / btn ' + s.borderBottom, font: `${getComputedStyle(el).fontSize}/${getComputedStyle(el).lineHeight} ${getComputedStyle(el).fontWeight}`, icon: icon ? { w: icon.getBoundingClientRect().width, transition: getComputedStyle(icon).transition } : null }; });
    await page.screenshot({ path: `${dir}/${vw}-accordion-closed.png` });
    await q.click(); await frames(page, dir, `${vw}-accordion-open`, [{ wait: 60, label: '60ms' }, { wait: 140, label: '200ms' }, { wait: 800, label: 'settled' }]);
    const panel = await q.evaluate(el => { const btn = el.closest('button, summary, [aria-expanded]') || el.parentElement; const id = btn.getAttribute('aria-controls'); const p = id ? document.getElementById(id) : btn.nextElementSibling; if (!p) return null; const s = getComputedStyle(p); const firstP = p.querySelector('p') || p; const fs = getComputedStyle(firstP); return { expanded: btn.getAttribute('aria-expanded'), h: Math.round(p.getBoundingClientRect().height), pad: s.padding, transition: s.transition, gridRows: s.gridTemplateRows, font: `${fs.fontSize}/${fs.lineHeight} ${fs.fontWeight} ${fs.color}`, w: Math.round(firstP.getBoundingClientRect().width), text: p.innerText.slice(0, 120) }; });
    // section heading vs group label
    const labels = await page.evaluate(() => ['Shipping and delivery', 'Returns', 'Returns and exchanges'].map(t => { const el = [...document.querySelectorAll('h1,h2,h3,h4,p,span,div')].filter(e => e.children.length === 0 && e.innerText.trim() === t).pop(); if (!el) return null; const s = getComputedStyle(el); const r = el.getBoundingClientRect(); return { t, tag: el.tagName, font: `${s.fontSize}/${s.lineHeight} ${s.fontWeight}`, x: Math.round(r.left), y: Math.round(r.top + scrollY) }; }));
    results[`shipping@${vw}`] = { info, panel, labels };
    await ctx.close(); }

  // 3. Stories: filter + show more
  { const dir = `${OUT}/stories/states`; await fs.mkdir(dir, { recursive: true });
    const { ctx, page } = await open('https://teklafabrics.com/projects', vw);
    const tab = page.getByText('Projects', { exact: true }).filter({ visible: true }).last();
    const tabs = await page.evaluate(() => [...document.querySelectorAll('a, button')].filter(e => ['All stories', 'Projects', 'People', 'Places'].includes(e.innerText.trim()) && e.getBoundingClientRect().top > 100).map(e => { const s = getComputedStyle(e); const r = e.getBoundingClientRect(); return { t: e.innerText.trim(), tag: e.tagName, x: Math.round(r.left), w: Math.round(r.width), h: Math.round(r.height), font: `${s.fontSize}/${s.lineHeight} ${s.fontWeight}`, deco: s.textDecoration, offset: s.textUnderlineOffset, borderBottom: s.borderBottom, color: s.color }; }));
    const card = await page.evaluate(() => { const img = [...document.querySelectorAll('img')].find(i => i.getBoundingClientRect().top > 200 && i.getBoundingClientRect().width > 150); if (!img) return null; const a = img.closest('a') || img.parentElement; const texts = [...a.querySelectorAll('*')].filter(e => e.children.length === 0 && e.innerText?.trim()).map(e => { const s = getComputedStyle(e); return { t: e.innerText.trim().slice(0, 30), font: `${s.fontSize}/${s.lineHeight} ${s.fontWeight}`, color: s.color, y: Math.round(e.getBoundingClientRect().top - img.getBoundingClientRect().bottom) }; }); return { img: `${Math.round(img.getBoundingClientRect().width)}x${Math.round(img.getBoundingClientRect().height)}`, texts }; });
    await page.screenshot({ path: `${dir}/${vw}-filter-all.png` });
    await tab.hover(); await page.waitForTimeout(400); await page.screenshot({ path: `${dir}/${vw}-filter-hover.png` });
    const before = page.url(); await tab.click(); await page.waitForTimeout(1800); await page.screenshot({ path: `${dir}/${vw}-filter-projects.png` });
    const after = page.url();
    const more = page.getByRole('button', { name: /show more/i });
    let moreInfo = null;
    if (await more.count()) { await more.first().scrollIntoViewIfNeeded(); await page.waitForTimeout(300);
      moreInfo = await more.first().evaluate(e => { const s = getComputedStyle(e); const r = e.getBoundingClientRect(); return { w: Math.round(r.width), h: Math.round(r.height), pad: s.padding, border: s.border, font: `${s.fontSize}/${s.lineHeight} ${s.fontWeight}`, bg: s.backgroundColor, transition: s.transition }; });
      await page.screenshot({ path: `${dir}/${vw}-show-more-default.png` }); await more.first().hover(); await page.waitForTimeout(400); await page.screenshot({ path: `${dir}/${vw}-show-more-hover.png` });
      const h0 = await page.evaluate(() => document.documentElement.scrollHeight); await more.first().click(); await page.waitForTimeout(2500);
      moreInfo.docHBefore = h0; moreInfo.docHAfter = await page.evaluate(() => document.documentElement.scrollHeight); await page.screenshot({ path: `${dir}/${vw}-show-more-loaded.png` }); }
    results[`stories@${vw}`] = { tabs, card, filterNavigates: after !== before ? after : 'same url (client filter)', moreInfo };
    await ctx.close(); }

  // 4. Article: alternating image/text + product carousel
  { const dir = `${OUT}/story-guide-to-down/states`; await fs.mkdir(dir, { recursive: true });
    const { ctx, page } = await open('https://teklafabrics.com/projects/a-guide-to-down', vw);
    for (let y = 0; y < 5000; y += 600) { await page.evaluate(y => scrollTo(0, y), y); await page.waitForTimeout(150); }
    const alt = await page.evaluate(() => {
      const imgs = [...document.querySelectorAll('img, video')].filter(i => i.getBoundingClientRect().width > 150);
      return imgs.slice(0, 8).map(i => { const r = i.getBoundingClientRect(); const row = i.closest('div')?.parentElement?.parentElement; const txt = row ? [...row.querySelectorAll('p, h2, h3')].filter(p => p.getBoundingClientRect().width > 0)[0] : null; const tr = txt?.getBoundingClientRect(); const ts = txt ? getComputedStyle(txt) : null; return { img: `${Math.round(r.left)}+${Math.round(r.width)}x${Math.round(r.height)} (${(r.width / r.height).toFixed(3)})`, y: Math.round(r.top + scrollY), text: tr ? `${Math.round(tr.left)}+${Math.round(tr.width)} "${txt.innerText.slice(0, 25)}" ${ts.fontSize}/${ts.lineHeight} ${ts.fontWeight}` : null }; });
    });
    const next = page.locator('button[aria-label*="next" i], button:has(svg)').filter({ visible: true }).last();
    let carousel = null;
    const rail = page.getByText('Discover the down collection').first();
    if (await rail.count()) { await rail.scrollIntoViewIfNeeded(); await page.waitForTimeout(500); await page.screenshot({ path: `${dir}/${vw}-carousel-default.png` });
      const nb = page.locator('button').filter({ visible: true }).filter({ hasNotText: /./ });
      const n = await nb.count(); if (n) { await nb.last().click().catch(() => {}); await page.waitForTimeout(900); await page.screenshot({ path: `${dir}/${vw}-carousel-next.png` }); carousel = `clicked icon button (${n} candidates)`; } }
    results[`article@${vw}`] = { alt, carousel };
    await ctx.close(); }
}
await b.close();
await fs.writeFile(`${OUT}/editorial-interactions.json`, JSON.stringify(results, null, 1));
console.log(JSON.stringify(results, null, 1));
