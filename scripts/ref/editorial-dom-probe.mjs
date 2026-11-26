import { chromium } from 'playwright';
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
for (const u of process.argv.slice(2)) {
await p.goto(u, { waitUntil: 'load' }); await p.waitForTimeout(2000);
console.log(u, await p.evaluate(() => {
  const h1 = document.querySelector('h1'); const chain = []; let el = h1;
  while (el && el !== document.body) { chain.push(`${el.tagName}.${String(el.className).slice(0, 50)} kids=${el.children.length} h=${Math.round(el.getBoundingClientRect().height)}`); el = el.parentElement; }
  return chain.join('\n  ');
}));
}
await b.close();
