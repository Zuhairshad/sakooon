// Header media network check: /images/ requests before and after opening the menus (desktop mega panel, mobile level 2).
// Usage: node scripts/ref/storefront-netcheck.mjs [path=/pages/faq] [base=http://localhost:9301]
import { chromium } from 'playwright';
const [route = '/pages/faq', base = 'http://localhost:9301'] = process.argv.slice(2);
const b = await chromium.launch();
for (const w of [1440, 390]) {
  const mobile = w < 768;
  const ctx = await b.newContext({ viewport: { width: w, height: mobile ? 844 : 900 }, isMobile: mobile, hasTouch: mobile });
  const p = await ctx.newPage(); const reqs = [];
  p.on('request', (r) => { if (/\/images\//.test(r.url())) reqs.push(r.url().replace(base, '')); });
  await p.goto(base + route, { waitUntil: 'networkidle' }); await p.waitForTimeout(1500);
  const before = reqs.length; const beforeList = [...reqs];
  if (mobile) {
    await p.locator('.header__menu-toggle').click(); await p.waitForTimeout(500);
    await p.locator('#mobile-nav [data-level-open]').first().click();
  } else {
    await p.locator('[data-mega-trigger]').first().hover();
  }
  await p.waitForTimeout(1500);
  const shown = await p.$$eval(mobile ? '#mobile-nav .mobile-nav__promo img' : '.mega-menu.is-open .mega-menu__promo img', (els) => els.map((i) => i.complete && i.naturalWidth > 0).filter(Boolean).length);
  console.log(`${w}: /images/ requests before interaction = ${before}${before ? ' ' + JSON.stringify(beforeList) : ''}; after opening = ${reqs.length - before}; promo images rendered = ${shown}`);
  await ctx.close();
}
await b.close();
