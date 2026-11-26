// Sticky header behaviour: sample header position/transform while scrolling down then up.
import fs from 'node:fs';
import { SITES, open, load, out } from './storefront-lib.mjs';
const [site, w = '1440'] = process.argv.slice(2);
const HDR = { parachute: '.cv-header-section', tekla: '.z-header' }[site];
const INNER = { parachute: 'cv-header', tekla: '.z-header > div' }[site];
const { browser, page } = await open({ w: +w, h: +w < 768 ? 844 : 900 });
await load(page, SITES[site].home);
const probe = () => page.evaluate(([h, i]) => { const o = document.querySelector(h), n = document.querySelector(i); const r = n.getBoundingClientRect(), s = getComputedStyle(n); return { scrollY: Math.round(scrollY), outerTop: Math.round(o.getBoundingClientRect().top), innerTop: Math.round(r.top), innerH: Math.round(r.height), transform: s.transform, bg: s.backgroundColor, color: s.color, shadow: s.boxShadow, border: s.borderBottom, cls: (n.className + '').slice(0, 120) }; }, [HDR, INNER]);
const seq = [];
for (const y of [0, 30, 60, 100, 300, 900, 1500]) { await page.mouse.wheel(0, y - (seq.at(-1)?.scrollY ?? 0)); await page.waitForTimeout(700); seq.push({ dir: 'down', ...(await probe()) }); }
for (const d of [-40, -200, -600]) { await page.mouse.wheel(0, d); await page.waitForTimeout(700); seq.push({ dir: 'up', ...(await probe()) }); }
await page.screenshot({ path: out(site, 'home', 'states', `sticky-${w}-after-scroll-up.png`) });
fs.writeFileSync(out(site, 'home', `sticky-${w}.json`), JSON.stringify(seq, null, 1));
for (const s of seq) console.log(s.dir, s.scrollY, 'outer', s.outerTop, 'inner', s.innerTop, s.innerH, s.transform, s.bg, s.shadow !== 'none' ? 'shadow' : '', s.border);
await browser.close();
