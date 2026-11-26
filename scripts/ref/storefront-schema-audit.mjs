// Audit storefront section schemas for theme-editor readiness.
import fs from 'node:fs';
const files = ['announcement-bar','header','footer','hero-full','hero-split','rich-text','featured-collection','product-highlights','editorial-grid','image-banner','collection-list','fabric-discovery','newsletter','service-info','image-with-text','comparison-highlights','room-collection','brand-values'];
let problems = 0;
for (const f of files) {
  const src = fs.readFileSync(`sections/${f}.liquid`, 'utf8');
  const schema = JSON.parse(/\{%-?\s*schema\s*-?%\}([\s\S]*?)\{%-?\s*endschema/.exec(src)[1]);
  const issues = [];
  const group = !!schema.enabled_on?.groups;
  if (!group && !schema.presets?.length) issues.push('no presets');
  const check = (list, where) => (list || []).forEach((s) => {
    if (!s.id) return;
    if (['select', 'range', 'checkbox', 'color_scheme'].includes(s.type) && s.default === undefined) issues.push(`${where}.${s.id}: no default`);
    if (s.type === 'select' && s.default !== undefined && !s.options.some((o) => o.value === s.default)) issues.push(`${where}.${s.id}: default not an option`);
    if (s.type === 'range' && s.default !== undefined && (s.default < s.min || s.default > s.max || (s.default - s.min) % s.step)) issues.push(`${where}.${s.id}: range default off-step/out of bounds`);
    if (s.type === 'range' && (s.max - s.min) / s.step > 101) issues.push(`${where}.${s.id}: range has >101 steps`);
    if (s.id.match(/padding_top|padding_bottom|color_scheme/) === null) {}
  });
  check(schema.settings, 'settings');
  if (!group && !['header','footer'].includes(f)) for (const req of ['color_scheme']) if (!(schema.settings || []).some((s) => s.id === req)) issues.push(`missing ${req}`);
  const flush = /section--flush/.test(src);
  if (!group && !flush) for (const req of ['padding_top', 'padding_bottom']) if (!(schema.settings || []).some((s) => s.id === req)) issues.push(`missing ${req}`);
  for (const b of schema.blocks || []) {
    check(b.settings, `block ${b.type}`);
    if (!group && !(schema.presets || []).some((p) => (p.blocks || []).some((pb) => pb.type === b.type))) issues.push(`block ${b.type} not in any preset`);
  }
  const ids = new Set(); for (const s of schema.settings || []) if (s.id) { if (ids.has(s.id)) issues.push(`duplicate id ${s.id}`); ids.add(s.id); }
  if (issues.length) problems += issues.length;
  console.log(`${issues.length ? 'FIX ' : 'ok  '} ${f}${issues.length ? ': ' + issues.join('; ') : ''}`);
}
process.exit(problems ? 1 : 0);
