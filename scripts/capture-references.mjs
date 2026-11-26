#!/usr/bin/env node
/**
 * Capture reference websites at all viewports, full page, plus optional interaction states.
 * Usage:
 *   node scripts/capture-references.mjs --site parachute --url https://parachutehome.com/ --name home [--viewports 1440,390] [--states scripts/states/parachute-home.mjs]
 * Output: /Users/shad/sakooon-qa/references/<site>/<name>/<viewport>-full.png (+ geometry.json, states/)
 * Politeness: one browser, >= SAKOOON_MIN_DELAY_MS between loads (default 20s), 90s backoff on 429, never saves blocked pages.
 */
import path from 'node:path';
import fs from 'node:fs';
import { QA_DIR, pickViewports, launch, newPage, gotoPolite, dismissOverlays, primeLazyContent, measureGeometry, isBlocked, sleep, MIN_DELAY_MS, writeJson, parseArgs, slug } from './lib/common.mjs';

const args = parseArgs(process.argv.slice(2));
if (!args.url) { console.error('Missing --url'); process.exit(1); }
const site = args.site || slug(new URL(args.url).hostname.replace(/^www\./, '').split('.')[0]);
const name = args.name || slug(new URL(args.url).pathname) || 'home';
const outDir = path.join(QA_DIR, 'references', site, name);
const viewports = pickViewports(args.viewports ? String(args.viewports).split(',') : null);
const states = args.states ? (await import(path.resolve(args.states))).default : null;

const browser = await launch();
const log = { url: args.url, captured: [], skipped: [], dismissed: [], startedAt: new Date().toISOString() };
let first = true;
for (const vp of viewports) {
  const { page, context } = await newPage(browser, vp);
  try {
    if (!first) await sleep(MIN_DELAY_MS); first = false;
    let res = await gotoPolite(page, args.url);
    if (res && res.status() === 429) { console.warn(`429 at ${vp.name}, backing off 90s`); await sleep(90000); res = await gotoPolite(page, args.url); }
    if (await isBlocked(page)) { log.skipped.push({ viewport: vp.name, reason: `blocked (${page._lastStatus})` }); console.warn(`skip ${vp.name}: blocked`); continue; }
    const dismissed = await dismissOverlays(page); if (dismissed.length) log.dismissed.push({ viewport: vp.name, dismissed });
    await primeLazyContent(page);
    fs.mkdirSync(outDir, { recursive: true });
    const file = path.join(outDir, `${vp.name}-full.png`);
    await page.screenshot({ path: file, fullPage: true });
    const geo = await measureGeometry(page);
    writeJson(path.join(outDir, `${vp.name}-geometry.json`), geo);
    log.captured.push({ viewport: vp.name, file, docHeight: geo.docHeight });
    console.log(`captured ${site}/${name} @${vp.name} (${geo.docHeight}px)`);
    if (states) {
      const stateDir = path.join(outDir, 'states'); fs.mkdirSync(stateDir, { recursive: true });
      for (const st of states) {
        if (st.only && !st.only.includes(vp.name)) continue;
        try { await st.run(page, vp); await sleep(st.settle || 600); await page.screenshot({ path: path.join(stateDir, `${st.name}-${vp.name}.png`), fullPage: !!st.fullPage }); console.log(`  state ${st.name}`); if (st.reset) await st.reset(page); }
        catch (e) { log.skipped.push({ viewport: vp.name, state: st.name, reason: String(e.message || e).slice(0, 200) }); console.warn(`  state ${st.name} failed: ${e.message}`); }
      }
    }
  } catch (e) { log.skipped.push({ viewport: vp.name, reason: String(e.message || e).slice(0, 200) }); console.error(`error ${vp.name}:`, e.message); }
  finally { await context.close(); }
}
await browser.close();
log.finishedAt = new Date().toISOString();
writeJson(path.join(outDir, 'capture-log.json'), log);
console.log(`done: ${log.captured.length} captured, ${log.skipped.length} skipped -> ${outDir}`);
