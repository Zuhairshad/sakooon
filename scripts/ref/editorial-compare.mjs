// Measures editorial templates on the preview with the same probes used on the references, and prints
// them next to the governing Tekla/Parachute capture so the visual pass compares numbers, not impressions.
// usage: node scripts/ref/editorial-compare.mjs [--base http://localhost:9303]
import { chromium } from 'playwright';
import fs from 'node:fs';
const args = process.argv.slice(2);
const base = args.includes('--base') ? args[args.indexOf('--base') + 1] : 'http://localhost:9303';
const REF = '/Users/shad/sakooon-qa/references';
const PAIRS = [
  ['/pages/about', 'tekla/about'], ['/pages/faq', 'tekla/shipping-and-returns'], ['/pages/shipping', 'tekla/shipping-and-returns'],
  ['/pages/contact', 'tekla/contact'], ['/pages/fabric-guide', 'tekla/textile-care'], ['/pages/fabric/cotton-satin', 'tekla/textile-care-percale'],
  ['/pages/care-guide', 'tekla/care-guide'], ['/pages/care-bedsheets', 'tekla/product-care'], ['/pages/size-guide', 'tekla/size-guide'],
  ['/blogs/journal', 'tekla/stories'], ['/blogs/journal/how-to-layer-a-bed-for-winter', 'tekla/story-guide-to-down'],
];
function probe() {
  const vis = (el) => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0 && getComputedStyle(el).visibility !== 'hidden'; };
  const t = (el) => { if (!el) return null; const s = getComputedStyle(el); return `${parseFloat(s.fontSize)}/${s.lineHeight === 'normal' ? 'n' : Math.round(parseFloat(s.lineHeight) * 10) / 10} ${s.fontWeight}`; };
  const root = document.querySelector('main') || document.body;
  const h1 = [...root.querySelectorAll('h1')].find(vis);
  const p = [...root.querySelectorAll('p')].filter(vis).find((x) => x.innerText.length > 60 && !x.closest('header.section-heading, .article-card, .fabric-card'));
  const ps = [...root.querySelectorAll('p')].filter((x) => vis(x) && x.innerText.length > 40);
  let gap = null; for (const x of ps) { const n = x.nextElementSibling; if (n && n.tagName === 'P' && vis(n)) { gap = Math.round(n.getBoundingClientRect().top - x.getBoundingClientRect().bottom); break; } }
  const img = [...root.querySelectorAll('img, .placeholder')].filter(vis).filter((i) => i.getBoundingClientRect().width > 150)[0];
  const ir = img?.getBoundingClientRect();
  return { h1: t(h1), h1x: h1 ? Math.round(h1.getBoundingClientRect().left) : null, body: t(p), pW: p ? Math.round(p.getBoundingClientRect().width) : null, pX: p ? Math.round(p.getBoundingClientRect().left) : null, gap, img: ir ? `${Math.round(ir.width)}x${Math.round(ir.height)} (${(ir.width / ir.height).toFixed(2)})` : null, h1Top: h1 ? Math.round(h1.getBoundingClientRect().top + scrollY) : null, docH: document.documentElement.scrollHeight };
}
const refRow = (key, vw) => {
  const f = `${REF}/${key}/${vw}-metrics.json`; if (!fs.existsSync(f)) return null;
  const m = JSON.parse(fs.readFileSync(f)); const h1 = m.headings.find((h) => h.tag === 'h1'); const p = m.paras[0]; const i = m.images[0];
  return { h1: h1 ? `${h1.size}/${h1.lh} ${h1.weight}` : null, body: p ? `${p.size}/${p.lh} ${p.weight}` : null, pW: p?.w ?? null, pX: p?.x ?? null, gap: m.paras.find((x) => x.gapToNext != null)?.gapToNext ?? null, img: i ? `${i.w}x${i.h} (${i.ratio})` : null, docH: m.docH };
};
const b = await chromium.launch();
for (const [path, key] of PAIRS) for (const vw of [1440, 390]) {
  const page = await b.newPage({ viewport: { width: vw, height: vw < 500 ? 844 : 900 } });
  await page.goto(base + path, { waitUntil: 'load' });
  const ours = await page.evaluate(probe); await page.close();
  const ref = refRow(key, vw);
  console.log(`\n${path} @${vw}  vs ${key}`);
  for (const k of ['h1', 'body', 'pW', 'pX', 'gap', 'img']) console.log(`  ${k.padEnd(5)} ours ${String(ours[k]).padEnd(22)} ref ${ref ? ref[k] : '-'}`);
}
await b.close();
