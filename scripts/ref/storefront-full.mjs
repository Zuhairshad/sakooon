// Full-page capture of the local preview (9301) with every lazy image forced in. Usage: node scripts/ref/storefront-full.mjs <width> <out.png> [path=/]
import { chromium } from 'playwright';
const [w, out, route = '/'] = process.argv.slice(2);
const b = await chromium.launch(); const mobile = +w < 768;
const ctx = await b.newContext({ viewport: { width: +w, height: mobile ? 844 : 900 }, isMobile: mobile, hasTouch: mobile });
const p = await ctx.newPage(); p.on('pageerror', (e) => console.log('pageerror', e.message));
p.on('console', (m) => m.type() === 'error' && console.log('console', m.text()));
await p.goto('http://localhost:9301' + route, { waitUntil: 'networkidle' });
await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 500) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 400)); } window.scrollTo(0, 0); });
await p.evaluate(async () => { document.querySelectorAll('img[loading="lazy"]').forEach((i) => { i.loading = 'eager'; }); await Promise.all([...document.images].map((i) => (i.complete ? 0 : new Promise((r) => { i.onload = i.onerror = r; })))); });
await p.waitForLoadState('networkidle'); await p.waitForTimeout(1500);
await p.screenshot({ path: out, fullPage: true }); await b.close();
