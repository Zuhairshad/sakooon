// Local QA captures of storefront components on a theme preview (no rate limits: local server).
// Usage: node scripts/ref/storefront-qa.mjs [--base http://localhost:9301] [--path /] [--only header,mega,mobile,sticky,full]
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const args = Object.fromEntries(process.argv.slice(2).join(' ').split('--').filter(Boolean).map((s) => { const [k, ...v] = s.trim().split(/\s+/); return [k, v.join(' ') || true]; }));
const base = (args.base || 'http://localhost:9301').replace(/\/$/, '');
const route = args.path || '/';
const only = args.only ? String(args.only).split(',') : null;
const OUT = path.join('/Users/shad/sakooon-qa/theme/storefront', route === '/' ? 'home' : route.replace(/\W+/g, '-').replace(/^-|-$/g, ''));
fs.mkdirSync(OUT, { recursive: true });
const want = (k) => !only || only.includes(k);
const browser = await chromium.launch();
const errors = [];

async function page(w, h = 900) {
  const mobile = w < 768;
  const ctx = await browser.newContext({ viewport: { width: w, height: mobile ? 844 : h }, deviceScaleFactor: 1, isMobile: mobile, hasTouch: mobile });
  const p = await ctx.newPage();
  p.on('pageerror', (e) => errors.push(`${w}: ${e.message}`));
  p.on('console', (m) => { if (m.type() === 'error') errors.push(`${w}: console ${m.text().slice(0, 160)}`); });
  await p.goto(base + route, { waitUntil: 'networkidle' });
  await p.waitForTimeout(300);
  return { ctx, p };
}
const shot = (p, name, opts = {}) => p.screenshot({ path: path.join(OUT, `${name}.png`), ...opts });

if (want('full')) {
  for (const w of [1440, 390]) {
    const { ctx, p } = await page(w);
    await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); } window.scrollTo(0, 0); });
    await p.waitForTimeout(400);
    await shot(p, `full-${w}`, { fullPage: true });
    await ctx.close();
  }
}
if (want('header')) {
  for (const w of [1920, 1440, 1280, 1024, 768, 390, 375]) {
    const { ctx, p } = await page(w);
    await shot(p, `fold-${w}`);
    const m = await p.evaluate(() => {
      const h = document.querySelector('.header'); const r = h.getBoundingClientRect(); const a = document.querySelector('.announcement-bar');
      return { header: Math.round(r.height), top: Math.round(r.top), announcement: a ? Math.round(a.getBoundingClientRect().height) : 0, overflow: document.documentElement.scrollWidth > innerWidth, bg: getComputedStyle(h).backgroundColor, color: getComputedStyle(h).color };
    });
    console.log('header', w, JSON.stringify(m));
    await ctx.close();
  }
}
if (want('mega')) {
  const { ctx, p } = await page(1440);
  const n = await p.locator('[data-mega-trigger]').count();
  for (let i = 0; i < n; i++) {
    const t = p.locator('[data-mega-trigger]').nth(i);
    await t.hover(); await p.waitForTimeout(450);
    const state = await p.evaluate(() => ({ open: document.querySelectorAll('.mega-menu.is-open').length, expanded: [...document.querySelectorAll('[data-mega-trigger]')].map((b) => b.getAttribute('aria-expanded')).join(','), menuOpen: document.querySelector('.header').hasAttribute('data-menu-open') }));
    console.log('mega', i, (await t.innerText()).trim(), JSON.stringify(state));
    await shot(p, `mega-${i}`);
  }
  await p.mouse.move(700, 800); await p.waitForTimeout(500);
  console.log('mega after leave open=', await p.locator('.mega-menu.is-open').count());
  // keyboard
  await p.locator('[data-mega-trigger]').first().focus(); await p.keyboard.press('Enter'); await p.waitForTimeout(300);
  console.log('mega kb Enter open=', await p.locator('.mega-menu.is-open').count());
  await p.keyboard.press('Tab'); await p.waitForTimeout(100);
  console.log('mega kb Tab focus in panel=', await p.evaluate(() => !!document.activeElement.closest('.mega-menu')));
  await p.keyboard.press('Escape'); await p.waitForTimeout(300);
  console.log('mega kb Escape open=', await p.locator('.mega-menu.is-open').count(), 'focus on trigger=', await p.evaluate(() => document.activeElement.hasAttribute('data-mega-trigger')));
  await ctx.close();
}
if (want('mobile')) {
  for (const w of [390, 768]) {
    const { ctx, p } = await page(w);
    await p.locator('[data-drawer-open="mobile-nav"]').click(); await p.waitForTimeout(600);
    await shot(p, `mobile-nav-${w}`);
    const opener = p.locator('#mobile-nav [data-level-open]').nth(1);
    if (await opener.count()) {
      await opener.click(); await p.waitForTimeout(600);
      await shot(p, `mobile-nav-${w}-level2`);
      console.log('mobile', w, 'level focus on back=', await p.evaluate(() => document.activeElement.hasAttribute('data-level-back')));
      await p.keyboard.press('Escape'); await p.waitForTimeout(500);
      console.log('mobile', w, 'after Esc: level open=', await p.locator('.mobile-nav__level.is-open').count(), 'drawer open=', await p.locator('#mobile-nav[open]').count());
    }
    await ctx.close();
  }
}
if (want('sticky')) {
  for (const w of [1440, 390]) {
    const { ctx, p } = await page(w);
    for (const y of [0, 20, 200, 1200]) {
      await p.evaluate((y) => window.scrollTo(0, y), y); await p.waitForTimeout(350);
      const s = await p.evaluate(() => { const h = document.querySelector('.header'); const r = h.getBoundingClientRect(); return { top: Math.round(r.top), scrolled: h.hasAttribute('data-scrolled'), hidden: h.hasAttribute('data-hidden'), bg: getComputedStyle(h).backgroundColor, hv: getComputedStyle(document.documentElement).getPropertyValue('--header-height') }; });
      console.log('sticky', w, y, JSON.stringify(s));
    }
    await shot(p, `sticky-${w}`);
    await ctx.close();
  }
}
await browser.close();
console.log(errors.length ? 'ERRORS:\n' + [...new Set(errors)].join('\n') : 'no page errors');
