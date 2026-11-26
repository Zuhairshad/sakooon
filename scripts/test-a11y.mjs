#!/usr/bin/env node
/**
 * Accessibility audit (axe-core via Playwright) for the theme preview or `shopify theme dev` URL.
 * Usage: node scripts/test-a11y.mjs --base http://localhost:9292 [--paths /,/collections/all] [--viewports 1440,390] [--open mobile-nav,cart-drawer]
 * Reports serious/critical violations (and moderate as warnings). Exit 1 on serious/critical.
 * Writes /Users/shad/sakooon-qa/theme/a11y-report.json
 */
import path from 'node:path';
import { AxeBuilder } from '@axe-core/playwright';
import { QA_DIR, pickViewports, launch, newPage, gotoPolite, writeJson, parseArgs, sleep } from './lib/common.mjs';

const args = parseArgs(process.argv.slice(2));
const base = (args.base || process.env.SAKOOON_THEME_URL || 'http://localhost:9292').replace(/\/$/, '');
const paths = args.paths ? String(args.paths).split(',') : ['/', '/collections/all', '/products/fixture-quilted-bed-sheet-set', '/cart', '/search?q=sheet', '/pages/about', '/pages/about?view=faq', '/pages/fabric/percale', '/pages/size-guide', '/blogs/journal', '/account/login', '/nope'];
const viewports = pickViewports(args.viewports ? String(args.viewports).split(',') : ['1440', '390']);
const openers = args.open ? String(args.open).split(',') : [];
const browser = await launch();
const results = []; let serious = 0;
for (const p of paths) for (const vp of viewports) {
  const { page, context } = await newPage(browser, vp);
  try {
    await gotoPolite(page, base + p, { settle: 400 });
    const run = async (label) => {
      const r = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice']).exclude('#LiveRegion').analyze();
      const v = r.violations.map((x) => ({ id: x.id, impact: x.impact, help: x.help, nodes: x.nodes.length, sample: x.nodes[0]?.target?.join(' ') }));
      const bad = v.filter((x) => ['serious', 'critical'].includes(x.impact)); serious += bad.length;
      results.push({ path: p, viewport: vp.name, state: label, violations: v });
      console.log(`${bad.length ? 'FAIL' : 'PASS'} ${p} @${vp.name}${label ? ' [' + label + ']' : ''}: ${v.length} violations (${bad.length} serious/critical)`);
      bad.forEach((x) => console.log(`  - ${x.impact} ${x.id}: ${x.help} (${x.nodes}x, e.g. ${x.sample})`));
    };
    await run('');
    for (const id of openers) { const b = page.locator(`[data-drawer-open="${id}"]`).first(); if (await b.count() && await b.isVisible()) { await b.click(); await sleep(500); await run(id); await page.keyboard.press('Escape'); await sleep(300); } }
  } catch (e) { results.push({ path: p, viewport: vp.name, error: e.message }); console.log(`ERR  ${p} @${vp.name}: ${e.message}`); }
  finally { await context.close(); }
}
await browser.close();
writeJson(path.join(QA_DIR, 'theme', 'a11y-report.json'), { base, generatedAt: new Date().toISOString(), results });
process.exit(serious ? 1 : 0);
