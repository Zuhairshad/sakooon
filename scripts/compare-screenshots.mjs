#!/usr/bin/env node
/**
 * Compare a reference capture with a theme capture: pixel diff (informational) + geometry report (pass criterion).
 * Usage:
 *   node scripts/compare-screenshots.mjs --ref parachute/home --theme home [--viewports 1440,390] [--tolerance 2]
 * Reads  /Users/shad/sakooon-qa/references/<ref>/<vp>-full.png + -geometry.json
 *        /Users/shad/sakooon-qa/theme/<theme>/<vp>-full.png + -geometry.json
 * Writes /Users/shad/sakooon-qa/diff/<ref>__<theme>/<vp>-diff.png, <vp>-side-by-side.png, <vp>-report.json, summary.md
 * Never alters the input screenshots.
 */
import fs from 'node:fs';
import path from 'node:path';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';
import { QA_DIR, pickViewports, parseArgs, readJson, writeJson, ensureDir } from './lib/common.mjs';

const args = parseArgs(process.argv.slice(2));
if (!args.ref || !args.theme) { console.error('Usage: --ref <site/page> --theme <name>'); process.exit(1); }
const tol = Number(args.tolerance || 2);
const refDir = path.join(QA_DIR, 'references', args.ref);
const themeDir = path.join(QA_DIR, 'theme', args.theme);
const outDir = ensureDir(path.join(QA_DIR, 'diff', `${args.ref.replace(/\//g, '-')}__${args.theme}`));
const viewports = pickViewports(args.viewports ? String(args.viewports).split(',') : null);

const readPng = (f) => PNG.sync.read(fs.readFileSync(f));
function fit(png, w, h) {
  const out = new PNG({ width: w, height: h }); out.data.fill(255);
  for (let y = 0; y < Math.min(h, png.height); y++) for (let x = 0; x < Math.min(w, png.width); x++) {
    const si = (png.width * y + x) << 2, di = (w * y + x) << 2; png.data.copy(out.data, di, si, si + 4);
  }
  return out;
}
function sideBySide(a, b) {
  const h = Math.max(a.height, b.height), gap = 16, w = a.width + gap + b.width;
  const out = new PNG({ width: w, height: h }); out.data.fill(230);
  const blit = (src, ox) => { for (let y = 0; y < src.height; y++) for (let x = 0; x < src.width; x++) { const si = (src.width * y + x) << 2, di = (w * y + x + ox) << 2; src.data.copy(out.data, di, si, si + 4); } };
  blit(a, 0); blit(b, a.width + gap); return out;
}
const near = (a, b, t = tol) => a != null && b != null && Math.abs(a - b) <= t;

const summary = [`# Compare ${args.ref} vs theme/${args.theme}`, '', `Tolerance ${tol}px. Pixel diff is informational (content differs by design); geometry rows drive pass/fail.`, ''];
for (const vp of viewports) {
  const refPng = path.join(refDir, `${vp.name}-full.png`), thPng = path.join(themeDir, `${vp.name}-full.png`);
  const refGeo = path.join(refDir, `${vp.name}-geometry.json`), thGeo = path.join(themeDir, `${vp.name}-geometry.json`);
  if (!fs.existsSync(refPng) || !fs.existsSync(thPng)) { summary.push(`## ${vp.name}: missing capture (${!fs.existsSync(refPng) ? 'reference' : 'theme'})`); continue; }
  const a = readPng(refPng), b = readPng(thPng);
  const w = Math.max(a.width, b.width), h = Math.max(a.height, b.height);
  const A = fit(a, w, h), B = fit(b, w, h), D = new PNG({ width: w, height: h });
  const mismatched = pixelmatch(A.data, B.data, D.data, w, h, { threshold: 0.12, includeAA: false });
  fs.writeFileSync(path.join(outDir, `${vp.name}-diff.png`), PNG.sync.write(D));
  fs.writeFileSync(path.join(outDir, `${vp.name}-side-by-side.png`), PNG.sync.write(sideBySide(a, b)));
  const report = { viewport: vp.name, pixelMismatchPct: +((mismatched / (w * h)) * 100).toFixed(2), checks: [], refHeight: a.height, themeHeight: b.height };
  report.checks.push({ label: 'page height', reference: a.height, theme: b.height, pass: near(a.height, b.height, Math.round(a.height * 0.1)) });
  if (fs.existsSync(refGeo) && fs.existsSync(thGeo)) {
    const r = readJson(refGeo), t = readJson(thGeo);
    const check = (label, rv, tv, t2 = tol) => report.checks.push({ label, reference: rv, theme: tv, pass: near(rv, tv, t2) });
    check('header height', r.header?.h, t.header?.h);
    check('content width', r.contentWidth, t.contentWidth, 8);
    check('document height', r.docHeight, t.docHeight, Math.round(r.docHeight * 0.08));
    ['h1', 'h2', 'h3', 'p', 'a'].forEach((k) => { if (r.type[k] && t.type[k]) { check(`${k} size`, r.type[k].size, t.type[k].size, 1); check(`${k} line-height`, r.type[k].lh, t.type[k].lh, 2); } });
    const n = Math.min(r.sections.length, t.sections.length, 12);
    for (let i = 0; i < n; i++) { check(`section ${i + 1} top`, r.sections[i].y, t.sections[i].y, 24); check(`section ${i + 1} height`, r.sections[i].h, t.sections[i].h, 24); }
    if (r.grids[0] && t.grids[0]) { check('first grid columns', r.grids[0].cols, t.grids[0].cols, 0); check('first grid gap', r.grids[0].gap, t.grids[0].gap, 4); }
    if (r.imgs[0] && t.imgs[0]) check('first image ratio x100', Math.round(r.imgs[0].ratio * 100), Math.round(t.imgs[0].ratio * 100), 5);
    report.themeOverflow = t.scrollWidth > t.viewport.w;
  }
  writeJson(path.join(outDir, `${vp.name}-report.json`), report);
  const fails = report.checks.filter((c) => !c.pass);
  summary.push(`## ${vp.name}: pixel mismatch ${report.pixelMismatchPct}% | geometry ${report.checks.length - fails.length}/${report.checks.length} pass${report.themeOverflow ? ' | THEME HAS HORIZONTAL OVERFLOW' : ''}`);
  fails.forEach((c) => summary.push(`- FAIL ${c.label}: reference ${c.reference} vs theme ${c.theme}`));
  summary.push('');
  console.log(summary.slice(-2 - fails.length).join('\n'));
}
fs.writeFileSync(path.join(outDir, 'summary.md'), summary.join('\n'));
console.log(`-> ${outDir}/summary.md`);
