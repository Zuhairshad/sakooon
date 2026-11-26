// Slice a tall full-page PNG into viewable chunks (uses Playwright's Chromium to crop, no extra deps).
import { chromium } from 'playwright';
import fs from 'node:fs';
const [src, outPrefix, chunk = '2400', scale = '0.5'] = process.argv.slice(2);
const b = await chromium.launch(); const p = await b.newPage();
const data = fs.readFileSync(src).toString('base64');
await p.setContent(`<img id=i src="data:image/png;base64,${data}">`);
const { w, h } = await p.evaluate(async () => { const i = document.getElementById('i'); await i.decode(); return { w: i.naturalWidth, h: i.naturalHeight }; });
const s = +scale, c = +chunk;
await p.setViewportSize({ width: Math.round(w * s), height: Math.round(c * s) });
await p.addStyleTag({ content: `body{margin:0}img{width:${w * s}px;display:block}` });
for (let y = 0, n = 0; y < h; y += c, n++) {
  await p.evaluate((y) => window.scrollTo(0, y), y * s);
  await p.screenshot({ path: `${outPrefix}-${n}.png`, clip: { x: 0, y: y * s, width: w * s, height: Math.min(c, h - y) * s }, fullPage: true });
}
console.log(w, h); await b.close();
