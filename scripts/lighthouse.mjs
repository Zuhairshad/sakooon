#!/usr/bin/env node
/**
 * Lighthouse runs for the standard template list, mobile and desktop. Uses the npx-cached lighthouse if present, else `npx lighthouse`.
 * Usage: node scripts/lighthouse.mjs --base http://localhost:9292 [--paths /,/products/x] [--only mobile|desktop]
 * Output: /Users/shad/sakooon-qa/lighthouse/<name>-<form>.report.{json,html} and summary.md
 * Note: against the LiquidJS preview the numbers are indicative (no Shopify CDN, no image resizing); run against `shopify theme dev` for real figures.
 */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { QA_DIR, parseArgs, slug } from './lib/common.mjs';

const args = parseArgs(process.argv.slice(2));
const base = (args.base || process.env.SAKOOON_THEME_URL || 'http://localhost:9292').replace(/\/$/, '');
const paths = args.paths ? String(args.paths).split(',') : ['/', '/collections/all', '/collections/bed-sheets', '/products/quilted-bed-sheet-set-king', '/products/duvet-comfort-pillow-pack-of-2', '/pages/fabric/cotton-satin', '/pages/fabric-guide', '/blogs/journal'];
const forms = args.only ? [String(args.only)] : ['mobile', 'desktop'];
const outDir = path.join(QA_DIR, 'lighthouse'); fs.mkdirSync(outDir, { recursive: true });
const cached = fs.existsSync('/Users/shad/.npm/_npx') ? fs.readdirSync('/Users/shad/.npm/_npx').map((d) => path.join('/Users/shad/.npm/_npx', d, 'node_modules/.bin/lighthouse')).find(fs.existsSync) : null;
const bin = cached || 'npx'; const pre = cached ? [] : ['--yes', 'lighthouse'];
const chrome = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const rows = ['| page | form | perf | a11y | best | seo | LCP | CLS | TBT |', '|---|---|---|---|---|---|---|---|---|'];
for (const p of paths) for (const form of forms) {
  const name = `${slug(p) || 'home'}-${form}`;
  const out = path.join(outDir, name);
  const flags = [...pre, base + p, '--quiet', '--chrome-flags=--headless=new --no-sandbox', '--output', 'json', '--output', 'html', '--output-path', out, '--only-categories=performance,accessibility,best-practices,seo'];
  if (form === 'desktop') flags.push('--preset=desktop'); else flags.push('--form-factor=mobile', '--screenEmulation.mobile');
  try { execFileSync(bin, flags, { stdio: 'pipe', env: { ...process.env, CHROME_PATH: chrome } }); } catch (e) { rows.push(`| ${p} | ${form} | error | | | | | | |`); console.error(`${name}: ${String(e.stderr || e.message).slice(0, 200)}`); continue; }
  const r = JSON.parse(fs.readFileSync(`${out}.report.json`, 'utf8'));
  const c = (k) => Math.round((r.categories[k]?.score || 0) * 100); const a = (k) => r.audits[k]?.displayValue || '';
  rows.push(`| ${p} | ${form} | ${c('performance')} | ${c('accessibility')} | ${c('best-practices')} | ${c('seo')} | ${a('largest-contentful-paint')} | ${a('cumulative-layout-shift')} | ${a('total-blocking-time')} |`);
  console.log(rows[rows.length - 1]);
}
fs.writeFileSync(path.join(outDir, 'summary.md'), `# Lighthouse (${base}, ${new Date().toISOString()})\n\n${rows.join('\n')}\n`);
console.log(`-> ${outDir}/summary.md`);
