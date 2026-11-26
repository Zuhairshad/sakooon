// Screenshot one element (or the viewport) of the local preview at a given width.
// Usage: node scripts/ref/storefront-shot.mjs <selector|-> <width> <out.png> [path=/] [base=http://localhost:9301]
import { chromium } from 'playwright';
const [sel, w, out, route = '/', base = 'http://localhost:9301'] = process.argv.slice(2);
const b = await chromium.launch();
const mobile = +w < 768;
const ctx = await b.newContext({ viewport: { width: +w, height: mobile ? 844 : 900 }, deviceScaleFactor: 1, isMobile: mobile, hasTouch: mobile });
const p = await ctx.newPage();
p.on('pageerror', (e) => console.log('pageerror', e.message));
await p.goto(base + route, { waitUntil: 'networkidle' });
await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 700) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 50)); } window.scrollTo(0, 0); });
await p.waitForTimeout(300);
if (sel === '-') await p.screenshot({ path: out });
else { const el = p.locator(sel).first(); await el.scrollIntoViewIfNeeded(); await el.screenshot({ path: out }); console.log(JSON.stringify(await el.boundingBox())); }
await b.close();
