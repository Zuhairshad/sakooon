import { chromium } from 'playwright';
const SP = '/private/tmp/claude-501/-Users-shad/a350c532-bb9b-4e1a-bc19-ce54530650a2/scratchpad';
const b = await chromium.launch();
const p = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
await p.goto('https://parachutehome.com/products/percale-sheet-set-evergreen-f-q', { waitUntil: 'domcontentloaded', timeout: 60000 });
await p.waitForTimeout(7000);
console.log(await p.$$eval('header a, header button', es => es.filter(e=>e.offsetParent).map(e => `${e.tagName} ${e.getAttribute('aria-label')||''} ${e.className.toString().slice(0,50)} ${e.getAttribute('href')||''}`).slice(-12)));
// size select options
console.log(await p.$$eval('cv-variant-picker select', ss => ss.map(s => s.id + ': ' + [...s.options].map(o => o.text.trim() + (o.disabled?'(dis)':'')).join(' | '))));
// search
const sb = p.locator('a.cv-header__utility-link[aria-label=Search]').locator('visible=true').first();
await sb.click(); await p.waitForTimeout(1500);
await p.screenshot({ path: `${SP}/search-open.png` });
console.log('focused', await p.evaluate(() => document.activeElement.outerHTML.slice(0,300)));
await p.keyboard.type('sheet', { delay: 80 }); await p.waitForTimeout(2500);
await p.screenshot({ path: `${SP}/search-typed.png` });
const ov = await p.evaluate(() => [...document.querySelectorAll('body *')].filter(e => { const s=getComputedStyle(e); const r=e.getBoundingClientRect(); return (s.position==='fixed'||s.position==='absolute') && r.width>300 && r.height>200 && s.visibility!=='hidden' && s.display!=='none' && +s.opacity>0 && r.right>0 && r.x<innerWidth; }).slice(0,6).map(e => `${e.tagName}.${(e.className+'').slice(0,60)} [${Math.round(e.getBoundingClientRect().x)},${Math.round(e.getBoundingClientRect().y)} ${Math.round(e.getBoundingClientRect().width)}x${Math.round(e.getBoundingClientRect().height)}] tr=${getComputedStyle(e).transition.slice(0,60)}`));
console.log(ov);
await b.close();
