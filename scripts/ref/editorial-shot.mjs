// Quick visual check of editorial pages on the local preview.
// usage: node scripts/ref/editorial-shot.mjs [--base http://localhost:9303] [--vw 1440,390] path ...
import { chromium } from 'playwright';
import fs from 'node:fs/promises';
const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf(k); if (i < 0) return d; const v = args[i + 1]; args.splice(i, 2); return v; };
const base = opt('--base', 'http://localhost:9303');
const vws = opt('--vw', '1440,390').split(',').map(Number);
const OUT = '/Users/shad/sakooon-qa/theme/editorial';
await fs.mkdir(OUT, { recursive: true });
const b = await chromium.launch();
for (const p of args) for (const vw of vws) {
  const page = await b.newPage({ viewport: { width: vw, height: vw < 500 ? 844 : 900 } });
  const errors = []; page.on('pageerror', (e) => errors.push(e.message)); page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  await page.goto(base + p, { waitUntil: 'load' }); await page.waitForTimeout(500);
  const name = p.replace(/[/?=&]+/g, '_').replace(/^_/, '') + `-${vw}.png`;
  await page.screenshot({ path: `${OUT}/${name}`, fullPage: true });
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  console.log(`${p} @${vw}: ${OUT}/${name} overflowX=${overflow}${errors.length ? ' errors=' + JSON.stringify(errors.slice(0, 3)) : ''}`);
  await page.close();
}
await b.close();
