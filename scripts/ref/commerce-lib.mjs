// Shared helpers for the Parachute commerce reference capture (scripts/ref/commerce-*.mjs).
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

export const BASE = 'https://parachutehome.com';
export const OUT = '/Users/shad/sakooon-qa/references/parachute';
export const VIEWPORTS = [1920, 1440, 1280, 1024, 768, 390, 375];

export const log = [];
export function note(msg) { const line = `[${new Date().toISOString().slice(11, 19)}] ${msg}`; log.push(line); console.log(line); }

export async function open(w, url, { height } = {}) {
  const browser = await chromium.launch();
  const mobile = w < 768;
  const ctx = await browser.newContext({
    viewport: { width: w, height: height || (mobile ? 844 : 900) },
    deviceScaleFactor: 1,
    isMobile: mobile,
    hasTouch: mobile,
    userAgent: mobile
      ? 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1'
      : undefined,
  });
  const page = await ctx.newPage();
  await gotoPolite(page, url, w);
  await dismissPopups(page, w);
  return { browser, ctx, page };
}

// One page load at a time, spaced out; on 429 back off and retry rather than push through the rate limit.
let lastLoad = 0;
export async function gotoPolite(page, url, w = page.viewportSize().width) {
  for (let attempt = 1; attempt <= 4; attempt++) {
    const gap = 20000 - (Date.now() - lastLoad);
    if (gap > 0) await page.waitForTimeout(gap);
    lastLoad = Date.now();
    const res = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
    const status = res ? res.status() : 0;
    if (status !== 429) { if (status >= 400) note(`HTTP ${status} for ${url} @${w}`); await page.waitForTimeout(6000); return status; }
    note(`HTTP 429 for ${url} @${w}, backing off 90s (attempt ${attempt})`);
    await page.waitForTimeout(90000);
  }
  throw new Error(`rate limited: ${url}`);
}

// Close marketing popups without bypassing anything: Escape, then visible close buttons inside known popup containers.
export async function dismissPopups(page, w) {
  const found = await page.evaluate(() => {
    const sel = '[class*=klaviyo] [role=dialog], .needsclick[role=dialog], [id*=attentive], [class*=popup]:not([class*=rebuy]), [class*=modal][aria-modal=true]';
    return [...document.querySelectorAll(sel)].filter(e => { const r = e.getBoundingClientRect(); const s = getComputedStyle(e); return r.width > 200 && r.height > 150 && s.display !== 'none' && s.visibility !== 'hidden'; })
      .map(e => `${e.tagName}.${String(e.className).slice(0, 60)}#${e.id}`);
  });
  if (found.length) {
    note(`popup @${w}: ${found.join(', ')}`);
    await page.keyboard.press('Escape');
    for (const s of ['[class*=klaviyo] button[aria-label*=Close i]', '[aria-label="Close dialog"]', '[id*=attentive] button[aria-label*=close i]']) {
      const b = page.locator(s).first();
      if (await b.isVisible().catch(() => false)) await b.click().catch(() => {});
    }
  }
  // The Attentive creative is an iframe; hide nothing, just record it.
  const iframes = await page.$$eval('iframe', fs => fs.filter(f => { const r = f.getBoundingClientRect(); return r.width > 250 && r.height > 250; }).map(f => f.id || f.src.slice(0, 60)));
  if (iframes.length) note(`large iframes @${w}: ${iframes.join(', ')}`);
}

export async function scrollThrough(page) {
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += innerHeight * 0.8) { scrollTo(0, y); await new Promise(r => setTimeout(r, 250)); }
    scrollTo(0, 0);
  });
  await page.waitForTimeout(800);
}

export function dir(...p) { const d = path.join(OUT, ...p); fs.mkdirSync(d, { recursive: true }); return d; }

export async function shot(page, pageName, file, opts = {}) {
  const d = dir(pageName, ...(opts.states ? ['states'] : []));
  await page.screenshot({ path: path.join(d, file), fullPage: !!opts.full, timeout: 60000 }).catch(e => note(`screenshot failed ${pageName}/${file}: ${e.message.split('\n')[0]}`));
}

// Measure first visible match of each selector: rect + typography/box styles.
export async function measure(page, spec) {
  return page.evaluate((spec) => {
    const props = ['fontFamily', 'fontSize', 'fontWeight', 'lineHeight', 'letterSpacing', 'textTransform', 'color', 'backgroundColor',
      'display', 'gridTemplateColumns', 'columnGap', 'rowGap', 'gap', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft',
      'marginTop', 'marginBottom', 'borderTop', 'borderBottom', 'borderRadius', 'aspectRatio', 'objectFit', 'position', 'top', 'transition', 'width', 'height', 'zIndex'];
    const out = {};
    for (const [key, sel] of Object.entries(spec)) {
      const all = [...document.querySelectorAll(sel)];
      const el = all.find(e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0; });
      if (!el) { out[key] = null; continue; }
      const r = el.getBoundingClientRect(); const cs = getComputedStyle(el);
      const st = {}; for (const p of props) { const v = cs[p]; if (v && v !== 'none' && v !== 'normal' && v !== 'auto' && v !== '0px' && v !== 'all' && v !== 'static' && !/^0px none/.test(v) && v !== 'rgba(0, 0, 0, 0)') st[p] = v.length > 120 ? v.slice(0, 120) + '…' : v; }
      out[key] = { count: all.length, x: Math.round(r.x), y: Math.round(r.y + scrollY), w: +r.width.toFixed(1), h: +r.height.toFixed(1), ...st };
    }
    return out;
  }, spec);
}

export function saveJSON(pageName, file, data) { fs.writeFileSync(path.join(dir(pageName), file), JSON.stringify(data, null, 2)); }
export function saveLog(name) { fs.appendFileSync(path.join(dir(), `${name}-log.txt`), log.join('\n') + '\n'); }
