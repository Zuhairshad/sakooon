import { chromium } from 'playwright';
const SP = process.env.SP, url = process.argv[2], w = +(process.argv[3]||1440);
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: w, height: 900 }, deviceScaleFactor: 1 });
const p = await ctx.newPage();
await p.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
await p.waitForTimeout(8000);
// visible overlays
const ov = await p.evaluate(() => [...document.querySelectorAll('body *')].filter(e => { const s = getComputedStyle(e); if (!['fixed'].includes(s.position)) return false; const r = e.getBoundingClientRect(); return r.width > 200 && r.height > 150 && s.visibility!=='hidden' && s.display!=='none' && +s.opacity>0; }).map(e => `${e.tagName}#${e.id}.${(e.className+'').slice(0,60)} ${Math.round(e.getBoundingClientRect().width)}x${Math.round(e.getBoundingClientRect().height)} z=${getComputedStyle(e).zIndex}`));
console.log('fixed overlays:', ov);
await p.screenshot({ path: `${SP}/probe-${w}.png` });
// outline main
const out = await p.evaluate(([ROOT,DEPTH,LINES]) => { const m = document.querySelector(ROOT) || document.body; const lines=[]; const walk=(e,d)=>{ if(d>DEPTH) return; for (const c of e.children){ const r=c.getBoundingClientRect(); if(r.height<5) continue; lines.push(' '.repeat(d*2)+c.tagName.toLowerCase()+(c.id?'#'+c.id:'')+'.'+(c.className+'').split(' ').slice(0,3).join('.')+` [${Math.round(r.x)},${Math.round(r.y+scrollY)} ${Math.round(r.width)}x${Math.round(r.height)}]`); walk(c,d+1);} }; walk(m,0); return lines.slice(0,LINES).join('\n'); }, [process.env.ROOT||'main', +(process.env.DEPTH||5), +(process.env.LINES||160)]);
console.log(out);
await b.close();
