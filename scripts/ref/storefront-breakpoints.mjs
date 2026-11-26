// Find layout breakpoints: sweep viewport widths on one loaded page, fingerprint the layout,
// then binary-search each change to the exact pixel.
// Usage: node scripts/ref/storefront-breakpoints.mjs <parachute|tekla>
import fs from 'node:fs';
import { SITES, open, load, warm, out } from './storefront-lib.mjs';

const site = process.argv[2];
const SEC = { parachute: 'main#MainContent > .shopify-section', tekla: null }[site];
const HDR = { parachute: '.cv-header-section', tekla: '.z-header' }[site];
const FOOT = { parachute: '.shopify-section-group-footer-group', tekla: '#root > div.border-t' }[site];

// Returns a map of feature -> value. Values are coarse so that only layout changes register.
function fingerprint([SEC, HDR, FOOT]) {
  const vis = (e) => { if (!e) return false; const r = e.getBoundingClientRect(); const s = getComputedStyle(e); return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none'; };
  const f = {};
  const h = document.querySelector(HDR);
  if (h) {
    const navLinks = [...h.querySelectorAll('nav:not(.sr-only) a')].filter((a) => vis(a) && a.getBoundingClientRect().width > 2);
    f['header.navLinksVisible'] = navLinks.length > 0;
    f['header.hamburger'] = [...h.querySelectorAll('button')].some((b) => vis(b) && /menu|hamburger/i.test((b.getAttribute('aria-label') || '') + b.className));
    const logo = [...h.querySelectorAll('a[href="/"], a[href$=".com/"]')].find(vis);
    if (logo) { const r = logo.getBoundingClientRect(); f['header.logoPos'] = r.left + r.width / 2 < innerWidth * 0.35 ? 'left' : r.left + r.width / 2 > innerWidth * 0.65 ? 'right' : 'center'; f['header.logoW'] = Math.round(r.width); }
    f['header.h'] = Math.round(h.getBoundingClientRect().height);
  }
  let secs;
  if (SEC) secs = [...document.querySelectorAll(SEC)];
  else {
    let root = document.querySelector('#root');
    secs = [...root.children];
    for (let pass = 0; pass < 3; pass++) secs = secs.flatMap((e) => { let w = e; while ([...w.children].filter(vis).length === 1) w = [...w.children].find(vis); const k = [...w.children].filter((c) => vis(c) && c.getBoundingClientRect().height > 100); return vis(e) && e.getBoundingClientRect().height > innerHeight * 1.5 && k.length >= 2 ? k : [e]; });
  }
  secs = secs.filter(vis);
  const cols = (sec) => {
    let best = null;
    for (const e of [sec, ...sec.querySelectorAll('*')]) {
      const kids = [...e.children].filter(vis); if (kids.length < 2) continue;
      const rs = kids.map((k) => k.getBoundingClientRect());
      const row = rs.filter((r) => Math.abs(r.top - rs[0].top) < 4 && r.left < innerWidth);
      if (row.length < 2 || row[1].left - row[0].right < -1) continue;
      const w0 = row[0].width; if (w0 < 60 || !row.every((r) => Math.abs(r.width - w0) < w0 * 0.15)) continue;
      const v = +row.reduce((n, r) => n + Math.max(0, Math.min(1, (innerWidth - r.left) / r.width)), 0).toFixed(1);
      const score = v * w0;
      if (!best || score > best.s) best = { s: score, v, stacked: kids.length > row.length && rs.some((r) => r.top > rs[0].top + 4) };
    }
    return best ? `${best.v}${best.stacked ? '+wrap' : ''}` : '1';
  };
  secs.forEach((sec, i) => {
    f[`s${i}.cols`] = cols(sec);
    // text beside image vs stacked
    const img = [...sec.querySelectorAll('img,video')].find(vis); const hd = [...sec.querySelectorAll('h1,h2,h3,p')].find(vis);
    if (img && hd) { const a = img.getBoundingClientRect(), b = hd.getBoundingClientRect(); f[`s${i}.textVsImage`] = b.top >= a.bottom - 2 ? 'below' : b.bottom <= a.top + 2 ? 'above' : b.left >= a.right - 2 ? 'right' : b.right <= a.left + 2 ? 'left' : 'overlay'; }
    const hs = [...sec.querySelectorAll('h1,h2')].filter(vis)[0]; if (hs) f[`s${i}.headingFs`] = getComputedStyle(hs).fontSize;
    if (img) { const r = img.getBoundingClientRect(); f[`s${i}.imgAR`] = (r.width / r.height).toFixed(1); }
    f[`s${i}.inset`] = (() => { const c = [...sec.querySelectorAll('*')].find((e) => vis(e) && e.getBoundingClientRect().height > 20 && e.getBoundingClientRect().width < sec.getBoundingClientRect().width - 4); return c ? Math.round(c.getBoundingClientRect().left) : 0; })();
  });
  const ft = document.querySelector(FOOT);
  if (ft) f['footer.cols'] = cols(ft);
  return f;
}

const { browser, page } = await open({ w: 1920, h: 900 });
await load(page, SITES[site].home);
await warm(page);
const fp = async (w) => { await page.setViewportSize({ width: w, height: 900 }); await page.waitForTimeout(350); return page.evaluate(fingerprint, [SEC, HDR, FOOT]); };
const diff = (a, b) => Object.keys({ ...a, ...b }).filter((k) => {
  if (a[k] === b[k]) return false;
  // ignore continuously-scaling numeric features
  if (/\.inset$|logoW$|\.h$/.test(k) && typeof a[k] === 'number' && Math.abs(a[k] - b[k]) < 6) return false;
  if (/cols$/.test(k) && Math.abs(parseFloat(a[k]) - parseFloat(b[k])) < 0.6 && String(a[k]).includes('+wrap') === String(b[k]).includes('+wrap')) return false;
  return true;
});

const widths = []; for (let w = 1920; w >= 320; w -= 32) widths.push(w); widths.push(320);
const prints = new Map();
for (const w of widths) prints.set(w, await fp(w));
const changes = [];
for (let i = 1; i < widths.length; i++) {
  const hi = widths[i - 1], lo = widths[i];
  const d = diff(prints.get(hi), prints.get(lo)).filter((k) => !/headingFs|imgAR|\.inset|logoW|header\.h/.test(k) || true);
  if (!d.length) continue;
  // binary search each differing key
  for (const k of d) {
    let a = lo, b = hi, va = prints.get(lo)[k], vb = prints.get(hi)[k];
    while (b - a > 1) { const m = (a + b) >> 1; const v = (await fp(m))[k]; if (JSON.stringify(v) === JSON.stringify(vb)) b = m; else a = m; }
    changes.push({ feature: k, below: a, from: vb, to: va, at: b });
  }
}
// group by pixel
const byPx = {};
for (const c of changes) (byPx[c.at] ||= []).push(`${c.feature}: ${JSON.stringify(c.from)} -> ${JSON.stringify(c.to)} (at <= ${c.below}px)`);
const result = { site, sweep: '1920 -> 320 step 32, then binary search per feature', breakpoints: Object.fromEntries(Object.entries(byPx).sort((a, b) => b[0] - a[0])) };
fs.writeFileSync(out(site, 'home', 'breakpoints.json'), JSON.stringify(result, null, 1));
console.log(JSON.stringify(result.breakpoints, null, 1));
await browser.close();
