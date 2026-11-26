// Accessibility self-audit of editorial templates on the local preview.
// Checks: exactly one h1, heading level skips, labelled form controls, named buttons/links,
// aria-current values, visible focus on custom controls, reduced-motion transitions.
// usage: node scripts/ref/editorial-a11y.mjs [--base http://localhost:9303]
import { chromium } from 'playwright';
const args = process.argv.slice(2);
const base = args.includes('--base') ? args[args.indexOf('--base') + 1] : 'http://localhost:9303';
const PATHS = ['/pages/about', '/pages/contact', '/pages/about?view=faq', '/pages/about?view=shipping', '/pages/about?view=returns',
  '/pages/about?view=fabric-guide', '/pages/fabric/percale', '/pages/fabric/sateen', '/pages/about?view=care-guide', '/pages/about?view=care-bedsheets',
  '/pages/size-guide', '/pages/about?view=measurement-guide', '/blogs/journal', '/blogs/journal/tagged/care', '/blogs/journal/how-to-layer-a-bed-for-winter'];
// Custom controls whose focus ring we verify by keyboard-focusing them.
const FOCUS = ['.size-guide__unit input', '.size-guide__index-link', '[data-blog-next]', '.main-blog__tag', '.guide-anchor-nav__link', '.accordion__trigger', '.fabric-guide__chip', '.fabric-compare__scroll', '.size-guide__scroll', '.main-article__copy', '.editorial-gallery__link', '.fabric-card__link'];
const b = await chromium.launch();
let failures = 0;
for (const p of PATHS) {
  const page = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(base + p, { waitUntil: 'load' });
  const r = await page.evaluate(() => {
    const issues = [];
    const main = document.querySelector('main') || document.body;
    const vis = (el) => { const s = getComputedStyle(el); return s.display !== 'none' && s.visibility !== 'hidden' && el.getClientRects().length > 0; };
    const h1 = [...document.querySelectorAll('h1')].filter(vis);
    if (h1.length !== 1) issues.push(`h1 count ${h1.length}: ${h1.map((h) => h.textContent.trim().slice(0, 30)).join(' | ')}`);
    let prev = 0;
    for (const h of [...main.querySelectorAll('h1,h2,h3,h4,h5,h6')].filter(vis)) {
      const lvl = +h.tagName[1];
      if (prev && lvl > prev + 1) issues.push(`heading skip h${prev}→h${lvl} at "${h.textContent.trim().slice(0, 40)}"`);
      prev = lvl;
    }
    const name = (el) => (el.getAttribute('aria-label') || (el.getAttribute('aria-labelledby') || '').split(' ').map((id) => document.getElementById(id)?.textContent || '').join(' ') || el.textContent || el.getAttribute('title') || el.querySelector('img')?.alt || '').trim();
    for (const c of main.querySelectorAll('input:not([type=hidden]), select, textarea')) {
      const labelled = c.labels?.length || c.getAttribute('aria-label') || c.getAttribute('aria-labelledby') || c.closest('label');
      if (!labelled) issues.push(`unlabelled ${c.tagName.toLowerCase()} ${c.name || c.id}`);
    }
    for (const el of [...main.querySelectorAll('a[href], button')].filter(vis).filter((el) => !el.closest('[aria-hidden="true"]'))) if (!name(el)) issues.push(`unnamed ${el.tagName.toLowerCase()} .${String(el.className).split(' ')[0]}`);
    for (const el of main.querySelectorAll('[aria-current]')) if (!['page', 'step', 'location', 'date', 'time', 'true', 'false'].includes(el.getAttribute('aria-current'))) issues.push(`bad aria-current ${el.getAttribute('aria-current')}`);
    const ids = {}; for (const el of document.querySelectorAll('[id]')) ids[el.id] = (ids[el.id] || 0) + 1;
    const dup = Object.entries(ids).filter(([, n]) => n > 1).map(([id]) => id);
    if (dup.length) issues.push(`duplicate ids: ${dup.slice(0, 5).join(', ')}`);
    return issues;
  });
  // Keyboard focus visibility on custom controls
  for (const sel of FOCUS) {
    const loc = page.locator(sel).filter({ visible: true }).first();
    if (!(await loc.count())) continue;
    await page.keyboard.press('Escape');
    await loc.evaluate((el) => { el.scrollIntoView({ block: 'center' }); });
    // Focus via keyboard semantics: focus() then press Shift (no-op) so :focus-visible applies.
    await page.evaluate(() => document.body.focus());
    await loc.focus(); await page.keyboard.press('Shift');
    const ring = await loc.evaluate((el) => {
      const target = el.matches('input') ? el.nextElementSibling || el : el;
      const s = getComputedStyle(target);
      const outline = s.outlineStyle !== 'none' && parseFloat(s.outlineWidth) > 0;
      const shadow = s.boxShadow && s.boxShadow !== 'none';
      return { focused: el.matches(':focus-visible'), outline, shadow };
    });
    if (!ring.focused || !(ring.outline || ring.shadow)) r.push(`focus not visible on ${sel} (${JSON.stringify(ring)})`);
  }
  await page.close();
  // Reduced motion: transitions collapse
  const rm = await b.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  await rm.goto(base + p, { waitUntil: 'load' });
  const slow = await rm.evaluate(() => [...document.querySelectorAll('main *')].filter((el) => { const d = getComputedStyle(el).transitionDuration.split(',').map(parseFloat); return d.some((x) => x > 0.02); }).slice(0, 3).map((el) => el.className));
  if (slow.length) r.push(`reduced-motion: transitions still running on ${slow.join(' | ')}`);
  await rm.close();
  failures += r.length;
  console.log(`${r.length ? 'FAIL' : 'PASS'} ${p}${r.length ? '\n  - ' + r.join('\n  - ') : ''}`);
}
await b.close();
console.log(failures ? `${failures} issue(s)` : 'all clear');
process.exitCode = failures ? 1 : 0;
