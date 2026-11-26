// Editorial reference capture: full-page screenshots, interaction states and computed-style
// metrics for the Tekla / Parachute editorial pages. Output goes to the shared QA folder.
// usage: node scripts/ref/editorial-capture.mjs [pageKey ...]   (no args = all pages)
import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';

const OUT = '/Users/shad/sakooon-qa/references';
const VIEWPORTS = [1920, 1440, 1280, 1024, 768, 390, 375];
const STATE_VIEWPORTS = [1440, 390];
const PAGES = [
  ['tekla', 'esg', 'https://teklafabrics.com/esg'],
  ['tekla', 'care-guide', 'https://teklafabrics.com/care-guide'],
  ['tekla', 'textile-care', 'https://teklafabrics.com/care-guide/textile-care'],
  ['tekla', 'textile-care-percale', 'https://teklafabrics.com/care-guide/textile-care/percale-bedding'],
  ['tekla', 'product-care', 'https://teklafabrics.com/care-guide/product-care'],
  ['tekla', 'about', 'https://teklafabrics.com/about-tekla'],
  ['tekla', 'stories', 'https://teklafabrics.com/projects'],
  ['tekla', 'story-guide-to-down', 'https://teklafabrics.com/projects/a-guide-to-down'],
  ['tekla', 'size-guide', 'https://teklafabrics.com/size-guide'],
  ['tekla', 'shipping-and-returns', 'https://teklafabrics.com/shipping-and-returns'],
  ['tekla', 'contact', 'https://teklafabrics.com/contact'],
  ['parachute', 'our-fabrics-detail', 'https://parachutehome.com/pages/our-fabrics-detail'],
  ['parachute', 'fabrics', 'https://parachutehome.com/pages/fabrics'],
  ['parachute', 'care', 'https://parachutehome.com/pages/care-2026'],
  ['parachute', 'faq', 'https://parachutehome.com/pages/faq'],
  ['parachute', 'returns', 'https://parachutehome.com/pages/returns'],
  ['parachute', 'our-story', 'https://parachutehome.com/pages/our-story'],
  ['parachute', 'blog', 'https://parachutehome.com/blogs/posts'],
  ['parachute', 'contact', 'https://shop.parachutehome.com/pages/contact?view=contact'],
];
const only = process.argv.slice(2);
const todo = PAGES.filter(p => !only.length || only.includes(`${p[0]}/${p[1]}`) || only.includes(p[1]));
const CONCURRENCY = +(process.env.CONCURRENCY || 3);
// Politeness: minimum gap between page loads, back-off on HTTP 429, skip viewports already captured.
const THROTTLE_MS = +(process.env.THROTTLE_MS || 0);
const BACKOFF_MS = +(process.env.BACKOFF_MS || 90000);
const SKIP_EXISTING = !!process.env.SKIP_EXISTING;
let lastLoad = 0;
async function politeGoto(page, url) {
  for (let attempt = 0; attempt < 3; attempt++) {
    const wait = lastLoad + THROTTLE_MS - Date.now(); if (wait > 0) await new Promise(r => setTimeout(r, wait));
    lastLoad = Date.now();
    const resp = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
    const title = await page.title().catch(() => '');
    if (resp?.status() !== 429 && title.trim() !== '429') return resp;
    process.stdout.write(`429 on ${url}, backing off ${BACKOFF_MS / 1000}s\n`);
    await new Promise(r => setTimeout(r, BACKOFF_MS));
  }
  return { status: () => 429 };
}

async function dismiss(page) {
  const notes = [];
  const tryClick = async (loc, label) => {
    try { if (await loc.first().isVisible({ timeout: 500 })) { await loc.first().click({ timeout: 2000 }); notes.push(label); await page.waitForTimeout(600); } } catch {}
  };
  await tryClick(page.getByRole('button', { name: /^only necessary$/i }), 'cookie: Only necessary');
  await tryClick(page.getByRole('button', { name: /^(reject all|decline|necessary only)$/i }), 'cookie: reject');
  await tryClick(page.getByRole('button', { name: /^(accept|accept all|got it|ok)$/i }), 'cookie: accept');
  await tryClick(page.locator('[aria-label*="close" i][role="button"], button[aria-label*="close" i], button[aria-label*="dismiss" i]').filter({ visible: true }), 'modal: close button');
  await tryClick(page.getByRole('button', { name: /no,? thanks|maybe later|not now/i }), 'modal: no thanks');
  await page.keyboard.press('Escape').catch(() => {});
  // Parachute's Rebuy cart flyout renders open in full-page captures even when closed in the viewport,
  // so hide that cart chrome outright (recorded in the capture notes).
  if (await page.locator('.rebuy-cart__flyout').count()) {
    await page.addStyleTag({ content: '.rebuy-cart__flyout, .rebuy-cart__background, .rebuy-cart__overlay { display: none !important; }' });
    notes.push('cart flyout: hidden with CSS');
  }
  // Report remaining large fixed overlays (do not remove site UI silently; only hide obvious modals)
  const left = await page.evaluate(() => [...document.querySelectorAll('body *')].filter(el => {
    const s = getComputedStyle(el), r = el.getBoundingClientRect();
    return s.position === 'fixed' && r.width * r.height > innerWidth * innerHeight * 0.3 && s.display !== 'none' && s.visibility !== 'hidden' && +s.opacity > 0.1 && el.innerText.trim().length > 0;
  }).map(el => (el.id || String(el.className).slice(0, 60)) + ': ' + el.innerText.slice(0, 60).replace(/\s+/g, ' ')));
  if (left.length) notes.push('remaining overlays: ' + left.join(' || '));
  return notes;
}

async function settle(page) {
  // Scroll through to trigger lazy images / reveal animations, then return to top.
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  const vh = page.viewportSize().height;
  for (let y = 0; y < h; y += Math.round(vh * 0.7)) { await page.evaluate(y => scrollTo(0, y), y); await page.waitForTimeout(220); }
  await page.evaluate(() => scrollTo(0, document.documentElement.scrollHeight));
  await page.waitForTimeout(800);
  await page.evaluate(() => scrollTo(0, 0));
  await page.waitForTimeout(800);
  await page.evaluate(async () => { await Promise.all([...document.images].filter(i => !i.complete).map(i => new Promise(r => { i.onload = i.onerror = r; setTimeout(r, 4000); }))); });
}

// Content root: <main> when it holds only content; otherwise climb from the h1 until the next
// ancestor would swallow the site header/footer (Tekla renders no <main>). Tagged data-ed-root.
const ROOT_FN = `window.contentRoot = function () {
  const chrome = 'footer, header, [class*="z-header"], [class*="footer" i]';
  let m = document.querySelector('main');
  if (m && !m.querySelector(chrome)) { m.setAttribute('data-ed-root', ''); return m; }
  let el = document.querySelector('main h1, h1') || document.querySelector('h2') || document.body;
  while (el.parentElement && el.parentElement !== document.body && !el.parentElement.querySelector(chrome)) el = el.parentElement;
  el.setAttribute('data-ed-root', ''); return el;
};`;
// Runs in the page: collects computed-style metrics.
function measure() {
  const px = v => Math.round(parseFloat(v) * 10) / 10;
  const vis = el => { const r = el.getBoundingClientRect(); const s = getComputedStyle(el); return r.width > 0 && r.height > 0 && s.display !== 'none' && s.visibility !== 'hidden'; };
  const sy = scrollY;
  const box = el => { const r = el.getBoundingClientRect(); return { x: Math.round(r.left), y: Math.round(r.top + sy), w: Math.round(r.width), h: Math.round(r.height) }; };
  const txt = el => (el.innerText || '').trim().replace(/\s+/g, ' ').slice(0, 70);
  const canvas = document.createElement('canvas').getContext('2d');
  const charW = s => { canvas.font = `${s.fontStyle} ${s.fontWeight} ${s.fontSize} ${s.fontFamily}`; const sample = 'the quick brown fox jumps over the lazy dog'; return canvas.measureText(sample).width / sample.length; };
  const typo = el => { const s = getComputedStyle(el); return { family: s.fontFamily.split(',')[0].replace(/["']/g, '').trim(), size: px(s.fontSize), weight: s.fontWeight, lh: s.lineHeight === 'normal' ? 'normal' : px(s.lineHeight), ls: s.letterSpacing, tt: s.textTransform, color: s.color, style: s.fontStyle }; };
  const main = contentRoot();
  const header = document.querySelector('header');
  const footer = document.querySelector('footer');

  // Typographic clusters: every leaf-ish text element in main.
  const clusters = {};
  const textEls = [...main.querySelectorAll('h1,h2,h3,h4,h5,h6,p,li,a,span,button,summary,label,td,th,figcaption,blockquote,dt,dd,div')].filter(el => vis(el) && [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim().length > 1));
  for (const el of textEls) {
    const t = typo(el);
    const key = `${t.family}|${t.size}|${t.weight}|${t.lh}|${t.ls}|${t.tt}|${t.style}`;
    (clusters[key] ||= { ...t, count: 0, tags: {}, samples: [] }).count++;
    clusters[key].tags[el.tagName] = (clusters[key].tags[el.tagName] || 0) + 1;
    if (clusters[key].samples.length < 3) clusters[key].samples.push(txt(el).slice(0, 40));
  }
  const headings = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].map(tag => [...main.querySelectorAll(tag)].filter(vis).slice(0, 4).map(el => ({ tag, text: txt(el), ...typo(el), mt: getComputedStyle(el).marginTop, mb: getComputedStyle(el).marginBottom, w: Math.round(el.getBoundingClientRect().width) }))).flat();

  // Paragraph columns: width, measure in characters, spacing to next paragraph.
  const paras = [...main.querySelectorAll('p')].filter(el => vis(el) && el.innerText.trim().length > 60).slice(0, 25).map(el => {
    const s = getComputedStyle(el), r = el.getBoundingClientRect();
    const next = el.nextElementSibling; let gap = null;
    if (next && vis(next)) gap = Math.round(next.getBoundingClientRect().top - r.bottom);
    const lines = s.lineHeight !== 'normal' ? Math.round(r.height / parseFloat(s.lineHeight)) : null;
    return { text: txt(el).slice(0, 40), w: Math.round(r.width), x: Math.round(r.left), maxW: s.maxWidth, chars: Math.round(r.width / charW(s)), lines, ...typo(el), mb: s.marginBottom, mt: s.marginTop, gapToNext: gap, nextTag: next?.tagName || null };
  });

  // Section inventory: walk down from main until we find a level with multiple block children.
  let level = main; for (let i = 0; i < 4; i++) { const kids = [...level.children].filter(vis); if (kids.length === 1) level = kids[0]; else break; }
  const sections = [...level.children].filter(vis).map(el => {
    const s = getComputedStyle(el), b = box(el);
    const imgs = [...el.querySelectorAll('img,video,picture')].filter(vis);
    const hs = [...el.querySelectorAll('h1,h2,h3,h4')].filter(vis).slice(0, 3).map(txt);
    // columns: distinct left positions of the direct grid/flex row children that hold content
    let row = el; for (let i = 0; i < 4; i++) { const k = [...row.children].filter(vis); if (k.length === 1) row = k[0]; else break; }
    const kids = [...row.children].filter(vis).map(c => { const r = c.getBoundingClientRect(); return { x: Math.round(r.left), y: Math.round(r.top + sy), w: Math.round(r.width), h: Math.round(r.height), img: !!c.querySelector('img,video'), text: (c.innerText || '').trim().length }; });
    const rs = getComputedStyle(row);
    return { tag: el.tagName, cls: String(el.className).slice(0, 90), ...b, bg: s.backgroundColor, pt: s.paddingTop, pb: s.paddingBottom, mt: s.marginTop, mb: s.marginBottom, headings: hs, images: imgs.length, display: rs.display, gridCols: rs.gridTemplateColumns, gap: rs.gap, children: kids.slice(0, 8), textLen: (el.innerText || '').length };
  });

  // Images
  const images = [...main.querySelectorAll('img,video')].filter(vis).slice(0, 40).map(el => { const r = el.getBoundingClientRect(), s = getComputedStyle(el); return { tag: el.tagName, w: Math.round(r.width), h: Math.round(r.height), ratio: Math.round(r.width / r.height * 1000) / 1000, x: Math.round(r.left), y: Math.round(r.top + sy), fit: s.objectFit, radius: s.borderRadius, natural: el.naturalWidth ? `${el.naturalWidth}x${el.naturalHeight}` : null, alt: (el.alt || '').slice(0, 40) }; });

  // Accordions / disclosure
  const disc = [...main.querySelectorAll('details, [aria-expanded], summary')].filter(vis).slice(0, 20).map(el => {
    const tgt = el.tagName === 'DETAILS' ? el.querySelector('summary') : el;
    const s = getComputedStyle(tgt), r = tgt.getBoundingClientRect();
    const row = el.closest('li, details, [class*="accordion" i], [class*="faq" i]') || el.parentElement;
    const rs = getComputedStyle(row);
    return { tag: el.tagName, expanded: el.getAttribute('aria-expanded') ?? (el.open ? 'open' : 'closed'), text: txt(tgt).slice(0, 50), h: Math.round(r.height), w: Math.round(r.width), pad: `${s.paddingTop} ${s.paddingRight} ${s.paddingBottom} ${s.paddingLeft}`, ...typo(tgt), rowBorderTop: `${rs.borderTopWidth} ${rs.borderTopStyle} ${rs.borderTopColor}`, rowBorderBottom: `${rs.borderBottomWidth} ${rs.borderBottomStyle} ${rs.borderBottomColor}`, rowH: Math.round(row.getBoundingClientRect().height), transition: s.transition };
  });

  // Tables
  const tables = [...main.querySelectorAll('table')].filter(vis).slice(0, 4).map(t => {
    const rows = [...t.rows].slice(0, 4).map(r => { const c = r.cells[0]; const cs = getComputedStyle(c); return { h: Math.round(r.getBoundingClientRect().height), cellPad: cs.padding, border: `${cs.borderBottomWidth} ${cs.borderBottomStyle} ${cs.borderBottomColor}`, ...typo(c), text: txt(r).slice(0, 60) }; });
    return { w: Math.round(t.getBoundingClientRect().width), cols: t.rows[0]?.cells.length, rowsN: t.rows.length, collapse: getComputedStyle(t).borderCollapse, rows };
  });
  // Div-based "tables" (grid rows with borders) are caught by rules below.

  // Rules / borders
  const rules = {};
  for (const el of main.querySelectorAll('*')) {
    if (!vis(el)) continue; const s = getComputedStyle(el);
    for (const side of ['Top', 'Bottom', 'Left', 'Right']) { const w = s[`border${side}Width`]; if (parseFloat(w) > 0 && s[`border${side}Style`] !== 'none') { const k = `${side.toLowerCase()} ${w} ${s[`border${side}Style`]} ${s[`border${side}Color`]}`; rules[k] = (rules[k] || 0) + 1; } }
  }
  // Transitions / animations
  const trans = {};
  for (const el of document.querySelectorAll('[data-ed-root] *, header *')) { const s = getComputedStyle(el); if (s.transitionDuration !== '0s') { const k = `${s.transitionProperty} | ${s.transitionDuration} | ${s.transitionTimingFunction}`.slice(0, 160); trans[k] = (trans[k] || 0) + 1; } if (s.animationName !== 'none') { const k = `anim ${s.animationName} ${s.animationDuration}`; trans[k] = (trans[k] || 0) + 1; } }
  // Anchor navigation / sticky
  const anchors = [...main.querySelectorAll('a[href^="#"], a[href*="#"]')].filter(vis).filter(a => a.hash && a.pathname === location.pathname).slice(0, 20).map(a => ({ text: txt(a), href: a.hash, ...box(a) }));
  const sticky = [...document.querySelectorAll('body *')].filter(el => { const s = getComputedStyle(el); return s.position === 'sticky' && vis(el); }).map(el => ({ cls: String(el.className).slice(0, 80), top: getComputedStyle(el).top, ...box(el), text: txt(el).slice(0, 50) }));
  const tabs = [...main.querySelectorAll('[role="tab"], [role="tablist"] button')].filter(vis).slice(0, 12).map(t => ({ text: txt(t), sel: t.getAttribute('aria-selected'), ...typo(t), h: Math.round(t.getBoundingClientRect().height), borderBottom: getComputedStyle(t).borderBottom }));
  // Links in body copy
  const link = [...main.querySelectorAll('p a, li a')].filter(vis)[0];
  const linkStyle = link ? { text: txt(link), ...typo(link), deco: getComputedStyle(link).textDecoration, underlineOffset: getComputedStyle(link).textUnderlineOffset, transition: getComputedStyle(link).transition } : null;
  // Captions
  const captions = [...main.querySelectorAll('figcaption, [class*="caption" i]')].filter(vis).slice(0, 4).map(el => ({ text: txt(el), ...typo(el), mt: getComputedStyle(el).marginTop }));
  const contentLeft = Math.min(...paras.map(p => p.x).concat(headings.map(() => 9999)));
  return {
    url: location.href, title: document.title, docH: document.documentElement.scrollHeight, vw: innerWidth,
    bodyBg: getComputedStyle(document.body).backgroundColor, bodyColor: getComputedStyle(document.body).color, bodyFont: typo(document.body),
    header: header ? { ...box(header), pos: getComputedStyle(header).position } : null, footer: footer ? box(footer) : null,
    headings, paras, sections, images, disclosure: disc, tables, rules: Object.entries(rules).sort((a, b) => b[1] - a[1]).slice(0, 15),
    transitions: Object.entries(trans).sort((a, b) => b[1] - a[1]).slice(0, 15), anchors, sticky, tabs, linkStyle, captions,
    typeClusters: Object.values(clusters).sort((a, b) => b.size - a.size).slice(0, 30), contentLeft,
  };
}

async function states(page, dir, vw) {
  const sdir = path.join(dir, 'states'); await fs.mkdir(sdir, { recursive: true });
  const log = [];
  const shot = async (name, opts = {}) => { await page.screenshot({ path: path.join(sdir, `${vw}-${name}.png`), ...opts }); log.push(name); };
  // Scroll-reveal probe: opacity/transform of elements before entering viewport.
  await page.evaluate(() => scrollTo(0, 0)); await page.waitForTimeout(400);
  const reveal = await page.evaluate(async () => {
    const cand = [...document.querySelectorAll('[data-ed-root] *')].filter(el => { const r = el.getBoundingClientRect(); return r.top > innerHeight * 1.2 && r.height > 40; });
    const before = cand.map(el => { const s = getComputedStyle(el); return [s.opacity, s.transform]; });
    const hidden = cand.filter((el, i) => +before[i][0] < 1 || before[i][1] !== 'none');
    return { candidates: cand.length, hiddenBeforeScroll: hidden.length, sample: hidden.slice(0, 5).map(el => ({ cls: String(el.className).slice(0, 80), opacity: getComputedStyle(el).opacity, transform: getComputedStyle(el).transform, transition: getComputedStyle(el).transition })) };
  });
  log.push({ reveal });
  await shot('above-fold');
  // Sticky / header state after scrolling 1.5 viewports
  await page.evaluate(() => scrollTo(0, innerHeight * 1.5)); await page.waitForTimeout(900);
  await shot('scrolled-sticky');
  // Scroll back up a little: does header reappear (hide-on-scroll)?
  await page.evaluate(() => scrollBy(0, -200)); await page.waitForTimeout(900);
  await shot('scrolled-up');
  // Accordion: first collapsed disclosure inside main
  const acc = page.locator('[data-ed-root] [aria-expanded="false"], [data-ed-root] details:not([open]) > summary').filter({ visible: true });
  if (await acc.count()) {
    const a = acc.first();
    await a.scrollIntoViewIfNeeded(); await page.waitForTimeout(300);
    const clip = async () => { const b = await a.boundingBox(); if (!b) return undefined; return { x: 0, y: Math.max(0, b.y - 80), width: page.viewportSize().width, height: Math.min(page.viewportSize().height, 700) }; };
    await shot('accordion-closed', { clip: await clip() });
    const t0 = Date.now();
    await a.click({ timeout: 3000 }).catch(e => log.push('accordion click failed: ' + e.message.slice(0, 80)));
    await page.waitForTimeout(120); await shot('accordion-opening-120ms', { clip: await clip() });
    await page.waitForTimeout(700); await shot('accordion-open', { clip: await clip() });
    const panel = await page.evaluate(() => { const b = document.querySelector('[data-ed-root] [aria-expanded="true"]'); const id = b?.getAttribute('aria-controls'); const p = id ? document.getElementById(id) : b?.nextElementSibling; if (!p) return null; const s = getComputedStyle(p); return { h: Math.round(p.getBoundingClientRect().height), pad: s.padding, transition: s.transition, overflow: s.overflow }; });
    log.push({ accordionPanel: panel, clickMs: Date.now() - t0 });
  } else log.push('no accordion in main');
  // Tabs
  const tab = page.locator('[data-ed-root] [role="tab"][aria-selected="false"]').filter({ visible: true });
  if (await tab.count()) { await tab.first().scrollIntoViewIfNeeded(); await shot('tab-default'); await tab.first().click().catch(() => {}); await page.waitForTimeout(600); await shot('tab-second'); } else log.push('no role=tab in main');
  // Hover on a body-copy link and on a card/image link
  const bodyLink = page.locator('[data-ed-root] p a, main li a').filter({ visible: true });
  if (await bodyLink.count()) {
    const l = bodyLink.first(); await l.scrollIntoViewIfNeeded(); const b = await l.boundingBox();
    const clip = b ? { x: Math.max(0, b.x - 40), y: Math.max(0, b.y - 30), width: Math.min(500, page.viewportSize().width - Math.max(0, b.x - 40)), height: 90 } : undefined;
    await shot('link-default', { clip }); await l.hover(); await page.waitForTimeout(500); await shot('link-hover', { clip });
  }
  const cardLink = page.locator('[data-ed-root] a:has(img)').filter({ visible: true });
  if (await cardLink.count()) {
    const l = cardLink.first(); await l.scrollIntoViewIfNeeded(); await page.mouse.move(0, 0); await page.waitForTimeout(300);
    const b = await l.boundingBox(); const clip = b ? { x: Math.max(0, b.x), y: Math.max(0, b.y), width: Math.min(b.width, page.viewportSize().width - b.x), height: Math.min(b.height + 120, 900) } : undefined;
    try { await shot('card-default', { clip }); await l.hover(); await page.waitForTimeout(800); await shot('card-hover', { clip }); } catch (e) { log.push('card shot failed ' + e.message.slice(0, 60)); }
  }
  // In-page anchor nav click
  const anchor = page.locator('[data-ed-root] a[href^="#"]').filter({ visible: true });
  if (await anchor.count()) { await anchor.first().click().catch(() => {}); await page.waitForTimeout(1200); await shot('anchor-jump'); log.push({ anchorScrollY: await page.evaluate(() => scrollY) }); }
  return log;
}

async function run([site, key, url]) {
  const dir = path.join(OUT, site, key); await fs.mkdir(dir, { recursive: true });
  const browser = await chromium.launch();
  const result = { site, key, url, viewports: {}, notes: [] };
  try {
    for (const vw of VIEWPORTS) {
      if (SKIP_EXISTING) { try { await fs.access(path.join(dir, `${vw}-metrics.json`)); result.viewports[vw] = { ok: true, skipped: 'existing' }; continue; } catch {} }
      const ctx = await browser.newContext({ viewport: { width: vw, height: vw <= 400 ? 844 : vw <= 1024 ? 1024 : 900 }, deviceScaleFactor: 1, locale: 'en-US', isMobile: false, hasTouch: vw <= 768, userAgent: undefined });
      const page = await ctx.newPage();
      try {
        const resp = await politeGoto(page, url);
        await page.waitForLoadState('load', { timeout: 20000 }).catch(() => {});
        await page.waitForTimeout(2500);
        const status = resp?.status();
        const title = await page.title();
        if (status >= 400 || title.trim() === '429' || /just a moment|access denied|captcha|attention required/i.test(title)) { result.viewports[vw] = { blocked: true, status, title }; await ctx.close(); continue; }
        const dismissed = await dismiss(page);
        await settle(page);
        const late = await dismiss(page); // popups that appear on scroll/delay
        const docH = await page.evaluate(() => document.documentElement.scrollHeight);
        if (docH <= page.viewportSize().height) { result.viewports[vw] = { invalid: true, reason: 'document height equals viewport height (error/blocked page)', docH }; await ctx.close(); continue; }
        await page.screenshot({ path: path.join(dir, `${vw}-full.png`), fullPage: true, timeout: 90000 });
        await page.evaluate(ROOT_FN); await page.evaluate(() => contentRoot());
        const m = await page.evaluate(measure);
        m.status = status; m.dismissed = [...dismissed, ...late];
        if (STATE_VIEWPORTS.includes(vw)) m.states = await states(page, dir, vw).catch(e => ['states failed: ' + e.message.slice(0, 120)]);
        await fs.writeFile(path.join(dir, `${vw}-metrics.json`), JSON.stringify(m, null, 1));
        result.viewports[vw] = { ok: true, docH: m.docH, dismissed: m.dismissed };
      } catch (e) { result.viewports[vw] = { error: e.message.slice(0, 200) }; }
      await ctx.close();
      process.stdout.write(`${site}/${key}@${vw} ${JSON.stringify(result.viewports[vw]).slice(0, 160)}\n`);
    }
  } finally { await browser.close(); }
  await fs.writeFile(path.join(dir, 'capture-log.json'), JSON.stringify(result, null, 1));
  return result;
}

const queue = [...todo]; const all = [];
await Promise.all(Array.from({ length: CONCURRENCY }, async () => { while (queue.length) all.push(await run(queue.shift())); }));
console.log('DONE', all.length);
