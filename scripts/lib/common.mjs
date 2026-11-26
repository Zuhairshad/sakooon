/**
 * Shared helpers for the Sakooon QA scripts. Owner: Fable.
 * Output root: /Users/shad/sakooon-qa (override with SAKOOON_QA_DIR).
 */
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

export const QA_DIR = process.env.SAKOOON_QA_DIR || '/Users/shad/sakooon-qa';
export const VIEWPORTS = [
  { name: '1920', width: 1920, height: 1080 },
  { name: '1440', width: 1440, height: 900 },
  { name: '1280', width: 1280, height: 800 },
  { name: '1024', width: 1024, height: 768 },
  { name: '768', width: 768, height: 1024 },
  { name: '390', width: 390, height: 844, mobile: true },
  { name: '375', width: 375, height: 812, mobile: true },
];
export const MIN_DELAY_MS = Number(process.env.SAKOOON_MIN_DELAY_MS || 20000); // politeness between loads on external sites

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
export const ensureDir = (p) => { fs.mkdirSync(p, { recursive: true }); return p; };
export const slug = (s) => String(s).toLowerCase().replace(/^https?:\/\//, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'root';

export function pickViewports(names) {
  if (!names || !names.length) return VIEWPORTS;
  return VIEWPORTS.filter((v) => names.includes(v.name));
}

export async function launch({ headless = true } = {}) {
  const browser = await chromium.launch({ headless });
  return browser;
}

export async function newPage(browser, vp, { mobile } = {}) {
  const isMobile = mobile ?? vp.mobile ?? false;
  const context = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: 1,
    isMobile,
    hasTouch: isMobile,
    userAgent: isMobile
      ? 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
      : undefined,
    reducedMotion: 'reduce',
    locale: 'en-US',
  });
  const page = await context.newPage();
  page.setDefaultTimeout(45000);
  return { page, context };
}

/** Detect anti-bot / rate limit pages so we never save them as references. */
export async function isBlocked(page) {
  const title = (await page.title()) || '';
  const status = page._lastStatus;
  if (status === 429 || status === 403 || /^\s*429|too many requests|access denied|just a moment|verify you are human/i.test(title)) return true;
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  return h <= page.viewportSize().height && (await page.evaluate(() => document.body.innerText.trim().length)) < 200;
}

export async function gotoPolite(page, url, { waitUntil = 'networkidle', timeout = 60000, settle = 1500 } = {}) {
  const res = await page.goto(url, { waitUntil, timeout }).catch(async (e) => { if (/networkidle/.test(String(e))) return page.goto(url, { waitUntil: 'load', timeout }); throw e; });
  page._lastStatus = res ? res.status() : 0;
  await sleep(settle);
  return res;
}

/** Try to dismiss common consent/newsletter/region overlays. Returns labels of what was dismissed. */
export async function dismissOverlays(page) {
  const dismissed = [];
  const selectors = [
    'button#onetrust-accept-btn-handler', 'button[aria-label*="close" i]', 'button[aria-label*="dismiss" i]', 'button:has-text("Accept")',
    'button:has-text("Accept all")', 'button:has-text("Got it")', 'button:has-text("No thanks")', 'button:has-text("Close")', '[class*="modal"] button[class*="close" i]',
    '[class*="popup"] button[class*="close" i]', '[data-testid*="close" i]',
  ];
  for (const sel of selectors) {
    const loc = page.locator(sel).first();
    try { if (await loc.isVisible({ timeout: 300 })) { await loc.click({ timeout: 1000 }); dismissed.push(sel); await sleep(400); } } catch { /* ignore */ }
  }
  await page.keyboard.press('Escape').catch(() => {});
  return dismissed;
}

/** Scroll through the page to trigger lazy content, then return to top. */
export async function primeLazyContent(page, step = 600) {
  await page.evaluate(async (s) => {
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    for (let y = 0; y < document.documentElement.scrollHeight; y += s) { window.scrollTo(0, y); await sleep(80); }
    window.scrollTo(0, 0); await sleep(300);
  }, step);
}

/** Geometry snapshot used by compare-screenshots: header, sections, type, grid. */
export async function measureGeometry(page) {
  return page.evaluate(() => {
    const px = (v) => Math.round(parseFloat(v) || 0);
    const cs = (el) => getComputedStyle(el);
    const rect = (el) => { const r = el.getBoundingClientRect(); return { x: Math.round(r.x), y: Math.round(r.y + window.scrollY), w: Math.round(r.width), h: Math.round(r.height) }; };
    const header = document.querySelector('header, [role="banner"], .header');
    const main = document.querySelector('main') || document.body;
    const sections = Array.from(main.querySelectorAll(':scope > section, :scope > div > section, .shopify-section, section'))
      .filter((s) => s.getBoundingClientRect().height > 40).slice(0, 40)
      .map((s) => ({ tag: s.tagName.toLowerCase(), id: s.id || null, cls: (s.className || '').toString().slice(0, 80), ...rect(s), pt: px(cs(s).paddingTop), pb: px(cs(s).paddingBottom) }));
    const type = {};
    ['h1', 'h2', 'h3', 'h4', 'p', 'a', 'button'].forEach((t) => {
      const el = Array.from(document.querySelectorAll(t)).find((e) => e.getBoundingClientRect().height > 0);
      if (el) { const c = cs(el); type[t] = { size: px(c.fontSize), lh: px(c.lineHeight), weight: c.fontWeight, ls: c.letterSpacing, family: c.fontFamily.split(',')[0].replace(/"/g, '') }; }
    });
    const grids = Array.from(document.querySelectorAll('*')).filter((e) => { const d = cs(e).display; return (d === 'grid') && e.children.length >= 2 && e.getBoundingClientRect().width > 300; }).slice(0, 12)
      .map((g) => { const c = cs(g); return { cls: (g.className || '').toString().slice(0, 60), cols: c.gridTemplateColumns.split(' ').length, gap: px(c.columnGap), ...rect(g) }; });
    const imgs = Array.from(document.images).filter((i) => i.getBoundingClientRect().width > 100).slice(0, 30).map((i) => { const r = i.getBoundingClientRect(); return { w: Math.round(r.width), h: Math.round(r.height), ratio: +(r.width / r.height).toFixed(3) }; });
    return {
      url: location.href, viewport: { w: innerWidth, h: innerHeight }, docHeight: document.documentElement.scrollHeight, scrollWidth: document.documentElement.scrollWidth,
      header: header ? { ...rect(header), position: cs(header).position } : null,
      contentWidth: (() => { const c = document.querySelector('.page-width, .container, [class*="container"], [class*="wrapper"]'); return c ? rect(c).w : null; })(),
      sections, type, grids, imgs, h1Count: Array.from(document.querySelectorAll('h1')).filter((h) => h.getClientRects().length > 0 && !h.closest('[hidden]')).length,
      imagesMissingAlt: Array.from(document.images).filter((i) => !i.hasAttribute('alt')).length,
    };
  });
}

export function writeJson(file, data) { ensureDir(path.dirname(file)); fs.writeFileSync(file, JSON.stringify(data, null, 2)); }
export function readJson(file) { return JSON.parse(fs.readFileSync(file, 'utf8')); }
export function parseArgs(argv) {
  const out = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) { const [k, v] = a.slice(2).split('='); out[k] = v ?? (argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[++i] : true); }
    else out._.push(a);
  }
  return out;
}
