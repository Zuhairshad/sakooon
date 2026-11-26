// Turns the captured *-metrics.json into markdown tables (one block per page) on stdout.
// usage: node scripts/ref/editorial-report.mjs > /tmp/out.md
import fs from 'node:fs';
import path from 'node:path';
const ROOT = '/Users/shad/sakooon-qa/references';
const VWS = [1920, 1440, 1280, 1024, 768, 390, 375];
const t = (c) => c ? `${c.size}/${c.lh} ${c.weight}${c.ls !== 'normal' ? ' ls ' + c.ls : ''}${c.tt !== 'none' ? ' ' + c.tt : ''}` : '–';
const out = [];
for (const site of ['tekla', 'parachute']) for (const key of fs.readdirSync(path.join(ROOT, site)).sort()) {
  const dir = path.join(ROOT, site, key);
  const ms = Object.fromEntries(VWS.map(v => [v, fs.existsSync(`${dir}/${v}-metrics.json`) ? JSON.parse(fs.readFileSync(`${dir}/${v}-metrics.json`)) : null]));
  const any = Object.values(ms).find(Boolean); if (!any) { out.push(`### ${site}/${key}\n\nNo metrics captured.\n`); continue; }
  out.push(`### ${site}/${key}\n\n${any.url} — "${any.title}"\n`);
  out.push('| vw | doc h | h1 | h2 | h3 | h4 | body p | p width (chars) | content x | p gap | sections | images (first 3 w×h ratio) | accordion row h / pad | table row h |');
  out.push('|---|---|---|---|---|---|---|---|---|---|---|---|---|---|');
  for (const v of VWS) {
    const m = ms[v]; if (!m) { out.push(`| ${v} | not captured |||||||||||||`); continue; }
    const h = tag => m.headings.find(x => x.tag === tag);
    const p = m.paras[0];
    const gaps = [...new Set(m.paras.map(x => x.gapToNext).filter(x => x != null))].slice(0, 3).join('/');
    const imgs = m.images.slice(0, 3).map(i => `${i.w}×${i.h} (${i.ratio})`).join(', ');
    const acc = m.disclosure[0] ? `${m.disclosure[0].rowH} / ${m.disclosure[0].pad}` : '–';
    const tr = m.tables[0]?.rows[1] ? `${m.tables[0].rows[1].h} pad ${m.tables[0].rows[1].cellPad}` : '–';
    out.push(`| ${v} | ${m.docH} | ${t(h('h1'))} | ${t(h('h2'))} | ${t(h('h3'))} | ${t(h('h4'))} | ${t(p)} | ${p ? `${p.w}px (${p.chars})` : '–'} | ${p?.x ?? '–'} | ${gaps || '–'} | ${m.sections.length} | ${imgs || '–'} | ${acc} | ${tr} |`);
  }
  const m = ms[1440] || any;
  out.push(`\nSections @${m.vw}: ` + m.sections.map((s, i) => `\n${i + 1}. y${s.y} h${s.h} pad ${s.pt}/${s.pb} bg ${s.bg} ${s.display}${s.gridCols !== 'none' ? ' cols[' + s.gridCols.slice(0, 50) + ']' : ''} gap ${s.gap} imgs ${s.images} — ${s.headings.join(' · ').slice(0, 90)} — kids ${s.children.map(c => `${c.x}+${c.w}${c.img ? 'i' : ''}`).join(' ')}`).join(''));
  const mm = ms[390];
  if (mm) out.push(`\nSections @390: ` + mm.sections.map((s, i) => `\n${i + 1}. h${s.h} pad ${s.pt}/${s.pb} ${s.display} kids ${s.children.slice(0, 4).map(c => `${c.x}+${c.w}`).join(' ')} — ${s.headings.join(' · ').slice(0, 60)}`).join(''));
  out.push(`\nType clusters @${m.vw}: ` + m.typeClusters.slice(0, 12).map(c => `${c.family} ${t(c)} ×${c.count} [${Object.keys(c.tags).join(',')}] "${c.samples[0]}"`).join('; '));
  out.push(`\nRules: ${m.rules.slice(0, 6).map(r => r[0] + ' ×' + r[1]).join('; ') || 'none'}`);
  out.push(`\nTransitions: ${m.transitions.slice(0, 5).map(r => r[0] + ' ×' + r[1]).join('; ') || 'none'}`);
  out.push(`\nSticky: ${m.sticky.map(s => `${s.cls.slice(0, 40)} top ${s.top} h${s.h}`).join('; ')} | anchors: ${m.anchors.length} | tabs: ${m.tabs.length} | disclosures: ${m.disclosure.length} | tables: ${m.tables.length}`);
  if (m.disclosure[0]) out.push(`\nDisclosure sample: ${JSON.stringify(m.disclosure[0])}`);
  if (m.tables[0]) out.push(`\nTable sample: ${JSON.stringify(m.tables[0]).slice(0, 700)}`);
  out.push(`\nLink: ${JSON.stringify(m.linkStyle)}`);
  out.push(`\nCaptions: ${JSON.stringify(m.captions).slice(0, 300)}`);
  out.push(`\nBody: bg ${m.bodyBg} color ${m.bodyColor} font ${m.bodyFont.family}; header ${JSON.stringify(m.header)}; dismissed: ${(m.dismissed || []).join('; ')}`);
  out.push(`\nStates: ${JSON.stringify(ms[1440]?.states || []).slice(0, 900)}\n`);
}
console.log(out.join('\n'));
