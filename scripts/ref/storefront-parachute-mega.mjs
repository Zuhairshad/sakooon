// Parachute mega menu: open each panel with a realistic pointer path and measure it (one page load, paced).
import fs from 'node:fs';
import { open, load, out, dismiss } from './storefront-lib.mjs';

const { browser, page } = await open({ w: 1440, h: 900 });
await load(page, 'https://parachutehome.com/');
const triggers = page.locator('.cv-header__nav-trigger');
const n = await triggers.count();
const results = [];
for (let i = 0; i < n; i++) {
  await dismiss(page);
  const t = triggers.nth(i);
  const box = await t.boundingBox();
  const label = (await t.innerText()).trim();
  await page.mouse.move(box.x - 30, box.y + box.height / 2);
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, { steps: 8 });
  const t0 = Date.now();
  let state = null;
  for (let k = 0; k < 20; k++) {
    await page.waitForTimeout(100);
    state = await page.evaluate((id) => {
      const trig = document.querySelectorAll('.cv-header__nav-trigger')[id];
      const panel = document.getElementById(trig.getAttribute('aria-controls'));
      const r = panel ? panel.getBoundingClientRect() : null;
      return { expanded: trig.getAttribute('aria-expanded'), h: r ? Math.round(r.height) : null };
    }, i);
    if (state.h > 40) break;
  }
  const openedAfter = Date.now() - t0;
  if (!(state.h > 40)) { results.push({ label, opened: false, state }); continue; }
  await page.waitForTimeout(500);
  const m = await page.evaluate((id) => {
    const T = (e) => { const s = getComputedStyle(e); return `${s.fontSize}/${s.fontWeight} lh${s.lineHeight} ls${s.letterSpacing} ${s.textTransform} ${s.fontFamily.split(',')[0]} ${s.color}`; };
    const vis = (e) => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
    const trig = document.querySelectorAll('.cv-header__nav-trigger')[id];
    const panel = document.getElementById(trig.getAttribute('aria-controls'));
    const inner = panel.querySelector('.cv-header__dropdown-inner') || panel;
    const row = panel.querySelector('.cv-stack') || inner;
    const pr = panel.getBoundingClientRect(); const ps = getComputedStyle(panel);
    const cols = [...row.children].filter(vis).map((c) => {
      const r = c.getBoundingClientRect(); const img = c.querySelector('img'); const links = [...c.querySelectorAll('a')].filter(vis);
      const heads = [...c.querySelectorAll('p,h2,h3,h4,span,div')].filter((e) => vis(e) && e.children.length === 0 && e.innerText.trim());
      return { x: Math.round(r.x), w: Math.round(r.width), h: Math.round(r.height), promo: c.classList.contains('cv-header__nav-promo') || !!img,
        img: img && vis(img) ? { w: Math.round(img.getBoundingClientRect().width), h: Math.round(img.getBoundingClientRect().height) } : null,
        firstText: heads[0] ? { style: T(heads[0]) } : null, links: links.length, linkStyle: links[1] ? T(links[1]) : links[0] ? T(links[0]) : null,
        pitch: links.length > 2 ? Math.round(links[2].getBoundingClientRect().top - links[1].getBoundingClientRect().top) : null };
    });
    const hdr = document.querySelector('cv-header');
    return { panel: { y: Math.round(pr.y), h: Math.round(pr.height), bg: ps.backgroundColor, transition: ps.transition, innerPad: getComputedStyle(inner).padding, rowGap: getComputedStyle(row).gap },
      header: { bg: getComputedStyle(hdr).backgroundColor, color: getComputedStyle(hdr).color, cls: hdr.className }, cols };
  }, i);
  const slug = label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  await page.screenshot({ path: out('parachute', 'home', 'states', `mega-open-${String(i).padStart(2, '0')}-${slug}.png`) });
  results.push({ label, opened: true, openedAfterMs: openedAfter, ...m });
  console.log(label, 'opened in', openedAfter, 'ms', m.cols.length, 'cols, panel h', m.panel.h);
  await page.mouse.move(700, 880, { steps: 5 }); await page.waitForTimeout(700);
}
fs.writeFileSync(out('parachute', 'home', 'mega-open.json'), JSON.stringify(results, null, 1));
console.log(results.filter((r) => !r.opened).map((r) => `${r.label}: not opened ${JSON.stringify(r.state)}`).join('\n'));
await browser.close();
