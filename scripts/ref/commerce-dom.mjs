import { chromium } from 'playwright';
const [url, sel, w='1440'] = process.argv.slice(2);
const b = await chromium.launch();
const p = await (await b.newContext({ viewport: { width: +w, height: 900 } })).newPage();
await p.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
await p.waitForTimeout(7000);
const h = await p.$eval(sel, e => e.outerHTML).catch(e => 'ERR ' + e.message);
console.log(h.replace(/\s+/g, ' ').replace(/(srcset|sizes|src)="[^"]*"/g, '$1=…').slice(0, +(process.env.N||6000)));
await b.close();
