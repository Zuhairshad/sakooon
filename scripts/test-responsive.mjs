#!/usr/bin/env node
/**
 * Responsive sanity for the theme: no horizontal overflow, no console/page errors, no 4xx/5xx assets, one h1, all images have alt.
 * Usage: node scripts/test-responsive.mjs --base http://localhost:9292 [--paths /,/collections/all,/cart] [--viewports 1440,390]
 * Exit code 1 on any failure. Writes /Users/shad/sakooon-qa/theme/responsive-report.json
 */
import path from 'node:path';
import { QA_DIR, pickViewports, launch, newPage, gotoPolite, primeLazyContent, measureGeometry, writeJson, parseArgs } from './lib/common.mjs';

const args = parseArgs(process.argv.slice(2));
const base = (args.base || process.env.SAKOOON_THEME_URL || 'http://localhost:9292').replace(/\/$/, '');
const paths = (args.paths ? String(args.paths).split(',') : ['/', '/collections/all', '/cart', '/search?q=sheet', '/pages/about', '/account/login', '/this-does-not-exist']);
const viewports = pickViewports(args.viewports ? String(args.viewports).split(',') : null);
const browser = await launch();
const results = []; let failures = 0;
for (const p of paths) for (const vp of viewports) {
  const { page, context } = await newPage(browser, vp);
  const issues = [];
  page.on('console', (m) => { if (m.type() === 'error') issues.push(`console: ${m.text().slice(0, 200)}`); });
  page.on('pageerror', (e) => issues.push(`pageerror: ${String(e).slice(0, 200)}`));
  page.on('response', (r) => { if (r.status() >= 400 && !/favicon|\/cart\.js|predictive_search/.test(r.url()) && r.url().startsWith(base)) issues.push(`http ${r.status()}: ${r.url().replace(base, '')}`); });
  try {
    await gotoPolite(page, base + p, { settle: 500 });
    await primeLazyContent(page, 900);
    const g = await measureGeometry(page);
    if (g.scrollWidth > g.viewport.w) issues.push(`overflow: scrollWidth ${g.scrollWidth} > ${g.viewport.w}`);
    if (g.h1Count !== 1) issues.push(`h1 count: ${g.h1Count}`);
    if (g.imagesMissingAlt) issues.push(`images missing alt: ${g.imagesMissingAlt}`);
    const focusables = await page.evaluate(() => Array.from(document.querySelectorAll('a,button,input,select,textarea')).filter((e) => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && r.height < 24 && e.closest('nav, header, footer, .product-form'); }).length);
    if (focusables > 0 && vp.mobile) issues.push(`small touch targets (<24px tall) in nav/header/footer: ${focusables}`);
  } catch (e) { issues.push(`load failed: ${e.message}`); }
  finally { await context.close(); }
  const ok = issues.length === 0; if (!ok) failures++;
  results.push({ path: p, viewport: vp.name, ok, issues });
  console.log(`${ok ? 'PASS' : 'FAIL'} ${p} @${vp.name}${ok ? '' : '\n  - ' + issues.join('\n  - ')}`);
}
await browser.close();
writeJson(path.join(QA_DIR, 'theme', 'responsive-report.json'), { base, generatedAt: new Date().toISOString(), results });
console.log(`${results.length - failures}/${results.length} passed`);
process.exit(failures ? 1 : 0);
