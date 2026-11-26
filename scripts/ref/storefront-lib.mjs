// Shared helpers for storefront reference capture (Playwright).
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

export const QA = '/Users/shad/sakooon-qa/references';
export const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';
export const UA_MOBILE = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1';

export const VIEWPORTS = [
  { w: 1920, h: 900 }, { w: 1440, h: 900 }, { w: 1280, h: 900 }, { w: 1024, h: 900 },
  { w: 768, h: 900 }, { w: 390, h: 844 }, { w: 375, h: 844 },
];

export const SITES = {
  parachute: { home: 'https://parachutehome.com/' },
  tekla: { home: 'https://teklafabrics.com/' },
};

export function out(site, ...parts) {
  const p = path.join(QA, site, ...parts);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  return p;
}

export async function open(vp) {
  const browser = await chromium.launch();
  const mobile = vp.w < 768;
  const ctx = await browser.newContext({
    viewport: { width: vp.w, height: vp.h }, deviceScaleFactor: 1, locale: 'en-US',
    userAgent: mobile ? UA_MOBILE : UA, isMobile: mobile, hasTouch: mobile,
  });
  const page = await ctx.newPage();
  return { browser, ctx, page };
}

// Records every popup we dismiss so the report can list them.
export const dismissed = new Set();

export async function dismiss(page) {
  for (let i = 0; i < 3; i++) {
    const hit = await page.evaluate(() => {
      const vis = (e) => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
      const found = [];
      // Tekla cookie consent
      for (const b of document.querySelectorAll('button')) {
        const t = b.innerText.trim();
        if (vis(b) && /^(only necessary|reject all|decline)$/i.test(t)) { b.click(); found.push('cookie consent ("' + t + '")'); }
      }
      // Alia promo popup and generic dialogs with a close control
      for (const b of document.querySelectorAll('[id^=alia-root] button[aria-label], [role=dialog] button[aria-label], [aria-modal=true] button[aria-label]')) {
        const l = b.getAttribute('aria-label') || '';
        if (vis(b) && /close (popup|dialog|modal)|^close$|dismiss/i.test(l) && !b.closest('cart-drawer,.drawer,.cv-header__drawer,.rebuy-cart__flyout,#tekla-chat-drawer')) {
          b.click(); found.push('popup "' + l + '" in ' + (b.closest('[id^=alia-root]') ? 'Alia promo popup' : 'dialog'));
        }
      }
      // Klaviyo modal forms
      for (const b of document.querySelectorAll('.needsclick.klaviyo-close-form, [aria-label="Close dialog"]')) {
        if (vis(b)) { b.click(); found.push('Klaviyo modal'); }
      }
      return found;
    });
    hit.forEach((h) => dismissed.add(h));
    if (!hit.length) break;
    await page.waitForTimeout(600);
  }
}

export class Blocked extends Error {}

// Bot-protection interstitial (e.g. Cloudflare "Just a moment..."). We never try to solve or evade it:
// wait passively in case it clears by itself, otherwise report the state as inaccessible.
export async function challenged(page) {
  const t = await page.title().catch(() => '');
  return /just a moment|attention required|access denied|verify you are human|^429/i.test(t);
}

// Polite pacing shared across processes: at least MIN_GAP ms between page loads per host,
// and a 90s back-off after a 429. State lives in the shared QA folder.
const MIN_GAP = 20000;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function pace(host) {
  const f = path.join(QA, `.pace-${host}`);
  for (;;) {
    let last = 0; try { last = +fs.readFileSync(f, 'utf8') || 0; } catch {}
    const wait = last + MIN_GAP - Date.now();
    if (wait <= 0) { fs.writeFileSync(f, String(Date.now())); return; }
    await sleep(wait + Math.random() * 1000);
  }
}
function backoff(host, ms = 90000) { fs.writeFileSync(path.join(QA, `.pace-${host}`), String(Date.now() + ms - MIN_GAP)); }

export async function load(page, url) {
  const host = new URL(url).host;
  for (let attempt = 0; ; attempt++) {
    await pace(host);
    const res = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
    if (res && res.status() === 429) {
      backoff(host);
      if (attempt >= 2) throw new Blocked(`HTTP 429 at ${url} after ${attempt + 1} attempts`);
      console.log(`429 at ${url}; backing off 90s`);
      continue;
    }
    break;
  }
  await page.waitForTimeout(4000);
  for (let i = 0; i < 6 && (await challenged(page)); i++) await page.waitForTimeout(5000);
  if (await challenged(page)) { backoff(host); throw new Blocked(`bot-protection challenge at ${url} (${await page.title()})`); }
  await dismiss(page);
  // Popups like Alia appear on a delay; wait for it, then dismiss again.
  await page.waitForTimeout(5000);
  await dismiss(page);
}

// Scroll the whole page in steps so lazy images/sections load, then return to top.
export async function warm(page) {
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  const vh = page.viewportSize().height;
  for (let y = 0; y < h; y += Math.round(vh * 0.7)) {
    await page.evaluate((y) => window.scrollTo(0, y), y);
    await page.waitForTimeout(250);
  }
  await page.waitForTimeout(800);
  await dismiss(page);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(800);
  if (h <= vh) throw new Blocked(`document height ${h} equals viewport; capture discarded (likely an interstitial)`);
}

// Freeze animations/carousels so a full-page screenshot is stable.
export async function freeze(page) {
  await page.addStyleTag({ content: '*{animation-play-state:paused!important;caret-color:transparent!important}' });
  await page.evaluate(() => document.querySelectorAll('video').forEach((v) => { try { v.pause(); } catch {} }));
}
