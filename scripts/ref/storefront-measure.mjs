// Full-page capture + computed-style measurements per viewport.
// Usage: node scripts/ref/storefront-measure.mjs <parachute|tekla> [page=home] [url]
import fs from 'node:fs';
import { SITES, VIEWPORTS, open, load, warm, freeze, out, dismissed, dismiss } from './storefront-lib.mjs';

const [site, pageName = 'home', urlArg] = process.argv.slice(2);
const url = urlArg || SITES[site][pageName];
const only = process.env.VW ? process.env.VW.split(',').map(Number) : null;

const SEL = {
  parachute: {
    announce: '.cv-announcement-bar-section',
    header: '.cv-header-section',
    headerBar: '.cv-header__desktop-bar, .cv-header__mobile-bar',
    logo: '.cv-header__logo img',
    nav: '.cv-header__nav-trigger',
    footer: '.shopify-section-group-footer-group',
    sections: 'main#MainContent > .shopify-section',
  },
  tekla: {
    announce: '.z-promotional',
    header: '.z-header',
    headerBar: '.z-header > div',
    logo: '#desktop-logo-link, .z-header a[href="/"]',
    nav: '.z-header nav:not(.sr-only) a, .z-header nav:not(.sr-only) button',
    footer: 'footer',
    sections: null, // auto-detected
  },
}[site];

function measure(SEL) {
  const vis = (e) => { if (!e) return false; const r = e.getBoundingClientRect(); const s = getComputedStyle(e); return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none' && +s.opacity > 0; };
  const first = (sel, root = document) => [...root.querySelectorAll(sel)].find(vis);
  const R = (e) => { const r = e.getBoundingClientRect(); return { x: Math.round(r.x), y: Math.round(r.y + scrollY), w: Math.round(r.width), h: Math.round(r.height) }; };
  const T = (e) => { const s = getComputedStyle(e); return { ff: s.fontFamily.split(',')[0].replace(/["']/g, ''), fs: s.fontSize, fw: s.fontWeight, lh: s.lineHeight, ls: s.letterSpacing, tt: s.textTransform, color: s.color }; };
  const box = (e) => { const s = getComputedStyle(e); return { pad: s.padding, margin: s.margin, bg: s.backgroundColor, border: s.border, radius: s.borderRadius }; };
  const res = { vw: innerWidth, docH: document.documentElement.scrollHeight };

  const a = first(SEL.announce); if (a) res.announcement = { ...R(a), ...T(a.querySelector('p,a,span') || a), bg: getComputedStyle(a).backgroundColor };
  const h = first(SEL.header);
  if (h) {
    const s = getComputedStyle(h);
    const bar = first(SEL.headerBar, h) || h;
    res.header = { ...R(h), position: s.position, top: s.top, z: s.zIndex, bg: getComputedStyle(bar).backgroundColor, barPad: getComputedStyle(bar).padding, transition: getComputedStyle(bar).transition };
  }
  const lg = first(SEL.logo); if (lg) res.logo = R(lg);
  const navs = [...document.querySelectorAll(SEL.nav)].filter(vis);
  if (navs.length) {
    const n = navs[0]; const xs = navs.map((e) => e.getBoundingClientRect());
    res.nav = { count: navs.length, labels: navs.map((e) => e.innerText.trim()).filter(Boolean), ...T(n), firstX: Math.round(xs[0].x), gapBetween: xs.length > 1 ? Math.round(xs[1].x - xs[0].right) : null, pad: getComputedStyle(n).padding, deco: getComputedStyle(n).textDecorationLine, transition: getComputedStyle(n).transition };
  }
  // Utility icons in header
  if (h) res.headerIcons = [...h.querySelectorAll('a,button')].filter(vis).filter((e) => !e.innerText.trim() || e.querySelector('svg,img,span[class*=icon]')).slice(0, 8).map((e) => ({ label: e.getAttribute('aria-label') || e.getAttribute('href') || e.className, ...R(e) }));

  // Typography samples
  const main = document.querySelector('main') || document.querySelector('#root') || document.body;
  res.type = {};
  for (const t of ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']) {
    const els = [...main.querySelectorAll(t)].filter(vis);
    if (els.length) res.type[t] = { n: els.length, samples: [...new Map(els.map((e) => { const x = T(e); return [x.fs + x.fw + x.ff, { ...x, text: e.innerText.trim().slice(0, 40) }]; })).values()].slice(0, 4) };
  }
  const ps = [...main.querySelectorAll('p')].filter((e) => vis(e) && e.innerText.trim().length > 30);
  res.type.body = [...new Map(ps.map((e) => { const x = T(e); return [x.fs + x.ff + x.fw, { ...x, text: e.innerText.trim().slice(0, 40) }]; })).values()].slice(0, 5);
  // Headline-ish elements that are not h-tags (common on headless sites)
  const big = [...main.querySelectorAll('p,div,span,a')].filter((e) => vis(e) && e.children.length === 0 && parseFloat(getComputedStyle(e).fontSize) >= 22 && e.innerText.trim());
  res.type.display = [...new Map(big.map((e) => { const x = T(e); return [x.fs + x.ff, { ...x, tag: e.tagName, text: e.innerText.trim().slice(0, 40) }]; })).values()].slice(0, 8);

  // Buttons
  const btns = [...main.querySelectorAll('a,button')].filter((e) => { if (!vis(e)) return false; const s = getComputedStyle(e); return (s.backgroundColor !== 'rgba(0, 0, 0, 0)' || parseFloat(s.borderTopWidth) > 0) && e.innerText.trim() && e.getBoundingClientRect().height >= 28 && e.getBoundingClientRect().height < 80; });
  res.buttons = [...new Map(btns.map((e) => { const s = getComputedStyle(e); const r = e.getBoundingClientRect(); return [s.backgroundColor + s.border + Math.round(r.height), { text: e.innerText.trim().slice(0, 30), h: Math.round(r.height), w: Math.round(r.width), pad: s.padding, bg: s.backgroundColor, color: s.color, border: s.border, radius: s.borderRadius, ...T(e), transition: s.transition }]; })).values()].slice(0, 6);

  // Text links (underline treatment)
  const links = [...main.querySelectorAll('a')].filter((e) => vis(e) && e.innerText.trim() && e.children.length === 0 && getComputedStyle(e).backgroundColor === 'rgba(0, 0, 0, 0)' && parseFloat(getComputedStyle(e).borderTopWidth) === 0);
  res.links = [...new Map(links.map((e) => { const s = getComputedStyle(e); return [s.textDecorationLine + s.fontSize + s.borderBottom, { text: e.innerText.trim().slice(0, 30), deco: s.textDecorationLine, thick: s.textDecorationThickness, offset: s.textUnderlineOffset, borderBottom: s.borderBottom, ...T(e), transition: s.transition }]; })).values()].slice(0, 6);

  // Fonts in use
  const fams = new Map();
  for (const e of document.querySelectorAll('body *')) { if (!e.childNodes.length || ![...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) continue; if (!vis(e)) continue; const f = getComputedStyle(e).fontFamily; fams.set(f, (fams.get(f) || 0) + 1); }
  res.fonts = [...fams.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8);
  res.fontFaces = [...document.fonts].filter((f) => f.status === 'loaded').map((f) => `${f.family} ${f.weight} ${f.style}`).filter((v, i, a) => a.indexOf(v) === i).slice(0, 20);

  // Section inventory
  let secs;
  if (SEL.sections) secs = [...document.querySelectorAll(SEL.sections)];
  else {
    let root = document.querySelector('main') || document.querySelector('#root');
    while (root && [...root.children].filter(vis).length === 1) root = [...root.children].find(vis);
    secs = root ? [...root.children] : [];
    // Expand tall wrappers whose children are the real sections.
    for (let pass = 0; pass < 3; pass++) secs = secs.flatMap((e) => { let w = e; while ([...w.children].filter(vis).length === 1) w = [...w.children].find(vis); const k = [...w.children].filter((c) => vis(c) && c.getBoundingClientRect().height > 100); return vis(e) && e.getBoundingClientRect().height > innerHeight * 1.5 && k.length >= 2 ? k : [e]; });
  }
  const grid = (sec) => {
    // Find the repeated-item row: element with >=2 visible children of similar width laid out side by side.
    let best = null;
    for (const e of [sec, ...sec.querySelectorAll('*')]) {
      const kids = [...e.children].filter(vis); if (kids.length < 2) continue;
      const rs = kids.map((k) => k.getBoundingClientRect());
      const row = rs.filter((r) => Math.abs(r.top - rs[0].top) < 4);
      if (row.length < 2) continue;
      const w0 = row[0].width; if (w0 < 80 || !row.every((r) => Math.abs(r.width - w0) < w0 * 0.15)) continue;
      if (row[1].left - row[0].right < -1) continue; // stacked layers, not columns
      const span = row[row.length - 1].right - row[0].left;
      if (!best || span * row.length > best.score) {
        const s = getComputedStyle(e);
        const inView = row.filter((r) => r.left < innerWidth - 1);
        best = { score: Math.min(span, innerWidth) * inView.length, cols: row.length, visibleCols: +inView.reduce((n, r) => n + Math.max(0, Math.min(1, (innerWidth - r.left) / r.width)), 0).toFixed(2), itemW: Math.round(w0), gap: Math.round(row[1].left - row[0].right), visibleItems: kids.length, display: s.display, gtc: s.gridTemplateColumns.split(' ').length > 1 ? s.gridTemplateColumns : null, overflowX: s.overflowX, firstX: Math.round(row[0].left), lastRight: Math.round(row[row.length - 1].right) };
      }
    }
    if (best) delete best.score; return best;
  };
  const container = (sec) => {
    const sw = sec.getBoundingClientRect().width;
    for (const e of sec.querySelectorAll('*')) { const r = e.getBoundingClientRect(); if (vis(e) && r.width < sw - 8 && r.height > 20) return { x: Math.round(r.x), w: Math.round(r.width), maxW: getComputedStyle(e).maxWidth }; }
    return null;
  };
  const sectionPad = (sec) => {
    // Distance from section edge to first/last visible content
    const sr = sec.getBoundingClientRect(); let minT = Infinity, maxB = -Infinity;
    for (const e of sec.querySelectorAll('img,video,h1,h2,h3,h4,p,a,button,picture')) { if (!vis(e)) continue; const r = e.getBoundingClientRect(); minT = Math.min(minT, r.top); maxB = Math.max(maxB, r.bottom); }
    return minT === Infinity ? null : { top: Math.round(minT - sr.top), bottom: Math.round(sr.bottom - maxB) };
  };
  res.sections = secs.filter(vis).map((sec, i) => {
    const s = getComputedStyle(sec);
    const inner = sec.firstElementChild && vis(sec.firstElementChild) ? getComputedStyle(sec.firstElementChild) : s;
    const imgs = [...sec.querySelectorAll('img,video')].filter(vis).map((m) => { const r = m.getBoundingClientRect(); return { tag: m.tagName, w: Math.round(r.width), h: Math.round(r.height), ar: +(r.width / r.height).toFixed(3), fit: getComputedStyle(m).objectFit }; });
    const heads = [...sec.querySelectorAll('h1,h2,h3,h4,h5,h6,p,a,span,button')].filter((e) => vis(e) && e.children.length === 0 && e.innerText.trim()).slice(0, 6).map((e) => ({ tag: e.tagName, text: e.innerText.trim().slice(0, 50), ...T(e) }));
    return {
      i, id: (sec.id || '').replace(/^shopify-section-(template--\d+__|sections--\d+__)?/, ''), cls: (sec.className + '').split(/\s+/).filter((c) => !/^shopify-section$/.test(c)).slice(0, 3).join(' '),
      ...R(sec), bg: s.backgroundColor === 'rgba(0, 0, 0, 0)' ? inner.backgroundColor : s.backgroundColor,
      padCss: s.padding !== '0px' ? s.padding : inner.padding, contentInset: sectionPad(sec), container: container(sec), grid: grid(sec),
      images: imgs.length, imageSamples: [...new Map(imgs.map((m) => [m.ar, m])).values()].slice(0, 4), text: heads,
    };
  });

  const f = first(SEL.footer);
  if (f) {
    const cols = grid(f);
    const heads = [...f.querySelectorAll('h2,h3,h4,p,a,span,button,summary')].filter((e) => vis(e) && e.children.length === 0 && e.innerText.trim());
    res.footer = { ...R(f), bg: getComputedStyle(f).backgroundColor || getComputedStyle(f.firstElementChild).backgroundColor, pad: getComputedStyle(f.firstElementChild || f).padding, grid: cols, textStyles: [...new Map(heads.map((e) => { const x = T(e); return [x.fs + x.fw + x.tt, { tag: e.tagName, text: e.innerText.trim().slice(0, 30), ...x }]; })).values()].slice(0, 6), links: heads.filter((e) => e.tagName === 'A').length };
  }
  return res;
}

const results = {};
for (const vp of VIEWPORTS.filter((v) => !only || only.includes(v.w))) {
  const { browser, page } = await open(vp);
  try {
    await load(page, url);
    await warm(page);
    results[vp.w] = await page.evaluate(measure, SEL);
    await page.waitForTimeout(1500); await dismiss(page);
    await freeze(page);
    await dismiss(page);
    await page.screenshot({ path: out(site, pageName, `${vp.w}-full.png`), fullPage: true, timeout: 120000 });
    await page.screenshot({ path: out(site, pageName, `${vp.w}-fold.png`) });
    console.log(site, pageName, vp.w, 'ok', results[vp.w].docH, 'sections', results[vp.w].sections.length);
  } catch (e) { console.log(site, pageName, vp.w, 'FAIL', e.message.split('\n')[0]); results[vp.w] = { error: e.message }; }
  await browser.close();
}
const file = out(site, pageName, 'measure.json');
const prev = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : {};
fs.writeFileSync(file, JSON.stringify({ ...prev, ...results, _url: url, _dismissed: [...new Set([...(prev._dismissed || []), ...dismissed])] }, null, 1));
console.log('dismissed:', [...dismissed]);
