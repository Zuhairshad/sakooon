#!/usr/bin/env node
/**
 * Capture the Sakooon theme (local preview or `shopify theme dev` URL) at all viewports.
 * Usage:
 *   node scripts/capture-theme.mjs --base http://localhost:9292 --path / --name home [--viewports 1440,390] [--states scripts/states/theme-home.mjs]
 *   node scripts/capture-theme.mjs --base http://127.0.0.1:9292 --all     (captures the standard template list below)
 * Output: /Users/shad/sakooon-qa/theme/<name>/<viewport>-full.png + geometry.json + console.json
 */
import path from 'node:path';
import fs from 'node:fs';
import { QA_DIR, pickViewports, launch, newPage, gotoPolite, primeLazyContent, measureGeometry, sleep, writeJson, parseArgs } from './lib/common.mjs';

const args = parseArgs(process.argv.slice(2));
const base = (args.base || process.env.SAKOOON_THEME_URL || 'http://localhost:9292').replace(/\/$/, '');
const STANDARD = [
  { name: 'home', path: '/' }, { name: 'collection', path: '/collections/all' }, { name: 'product', path: '/products/__first__' },
  { name: 'cart', path: '/cart' }, { name: 'search', path: '/search?q=sheet' }, { name: 'page-about', path: '/pages/about' },
  { name: 'page-faq', path: '/pages/faq' }, { name: 'page-size-guide', path: '/pages/size-guide' }, { name: 'page-contact', path: '/pages/contact' },
  { name: '404', path: '/this-page-does-not-exist' }, { name: 'login', path: '/account/login' },
];
const targets = args.all ? STANDARD : [{ name: args.name || 'home', path: args.path || '/' }];
const viewports = pickViewports(args.viewports ? String(args.viewports).split(',') : null);
const states = args.states ? (await import(path.resolve(args.states))).default : null;

const browser = await launch();
for (const t of targets) {
  let urlPath = t.path;
  if (urlPath.includes('__first__')) {
    try { const r = await fetch(`${base}/products.json?limit=1`); const j = await r.json(); urlPath = urlPath.replace('__first__', j.products[0].handle); } catch { urlPath = urlPath.replace('__first__', 'example'); }
  }
  const outDir = path.join(QA_DIR, 'theme', t.name); fs.mkdirSync(outDir, { recursive: true });
  for (const vp of viewports) {
    const { page, context } = await newPage(browser, vp);
    const consoleLog = [];
    page.on('console', (m) => { if (['error', 'warning'].includes(m.type())) consoleLog.push({ type: m.type(), text: m.text().slice(0, 300) }); });
    page.on('pageerror', (e) => consoleLog.push({ type: 'pageerror', text: String(e).slice(0, 300) }));
    page.on('response', (r) => { if (r.status() >= 400 && !/favicon/.test(r.url())) consoleLog.push({ type: 'http', text: `${r.status()} ${r.url()}` }); });
    try {
      await gotoPolite(page, base + urlPath, { settle: 800 });
      await primeLazyContent(page, 800);
      await page.screenshot({ path: path.join(outDir, `${vp.name}-full.png`), fullPage: true });
      const geo = await measureGeometry(page);
      writeJson(path.join(outDir, `${vp.name}-geometry.json`), geo);
      writeJson(path.join(outDir, `${vp.name}-console.json`), consoleLog);
      const overflow = geo.scrollWidth > geo.viewport.w ? ` OVERFLOW ${geo.scrollWidth}>${geo.viewport.w}` : '';
      console.log(`theme ${t.name} @${vp.name}: ${geo.docHeight}px, ${consoleLog.length} console issues${overflow}`);
      if (states) {
        const stateDir = path.join(outDir, 'states'); fs.mkdirSync(stateDir, { recursive: true });
        for (const st of states) {
          if (st.only && !st.only.includes(vp.name)) continue;
          try { await st.run(page, vp); await sleep(st.settle || 400); await page.screenshot({ path: path.join(stateDir, `${st.name}-${vp.name}.png`), fullPage: !!st.fullPage }); if (st.reset) await st.reset(page); }
          catch (e) { console.warn(`  state ${st.name} failed: ${e.message}`); }
        }
      }
    } catch (e) { console.error(`theme ${t.name} @${vp.name} failed: ${e.message}`); }
    finally { await context.close(); }
  }
}
await browser.close();
