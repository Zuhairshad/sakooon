// White-on-image contrast: hides the given text elements, screenshots, and computes contrast of white against the
// pixels behind each box (mean and brightest 10%). Usage: node scripts/ref/storefront-contrast.mjs "<selectors>" [path=/] [widths=1920,1440,390]
import { chromium } from 'playwright';
const [sel, route = '/', widths = '1920,1440,390'] = process.argv.slice(2);
const lum = (r, g, b) => { const f = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
const b = await chromium.launch();
for (const w of widths.split(',').map(Number)) {
  const m = w < 768; const p = await b.newPage({ viewport: { width: w, height: m ? 844 : 900 }, isMobile: m });
  await p.goto('http://localhost:9301' + route, { waitUntil: 'networkidle' });
  await p.locator(sel).first().scrollIntoViewIfNeeded(); await p.waitForTimeout(1200);
  const boxes = await p.$$eval(sel, (els) => els.map((e) => { const r = e.getBoundingClientRect(); return { cls: (e.className || e.tagName).toString().split(' ')[0], x: r.x, y: r.y, w: r.width, h: r.height, fs: getComputedStyle(e).fontSize }; }));
  await p.addStyleTag({ content: `${sel} { visibility: hidden !important; } .section-header { visibility: hidden !important; }` }); await p.waitForTimeout(200);
  const buf = await p.screenshot();
  const res = await p.evaluate(async ({ b64, boxes }) => { const img = new Image(); img.src = 'data:image/png;base64,' + b64; await img.decode(); const c = document.createElement('canvas'); c.width = img.width; c.height = img.height; const x = c.getContext('2d'); x.drawImage(img, 0, 0);
    return boxes.map((bx) => { const d = x.getImageData(Math.max(0, bx.x), Math.max(0, bx.y), Math.max(1, bx.w), Math.max(1, bx.h)).data; const px = []; for (let k = 0; k < d.length; k += 4) px.push([d[k], d[k + 1], d[k + 2]]); return { ...bx, px }; }); }, { b64: buf.toString('base64'), boxes });
  console.log(w, res.map((r) => { const ls = r.px.map(([R, G, B]) => lum(R, G, B)).sort((a, c) => a - c); const p90 = ls[Math.floor(ls.length * 0.9)]; const mean = ls.reduce((a, v) => a + v, 0) / ls.length; return `${r.cls} ${r.fs}: mean ${(1.05 / (mean + 0.05)).toFixed(2)} worst10% ${(1.05 / (p90 + 0.05)).toFixed(2)}`; }).join(' | '));
  await p.close();
}
await b.close();
