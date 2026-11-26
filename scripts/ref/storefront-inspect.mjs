// Ad-hoc inspector: load, optionally hover/click a selector, then print elements matching a probe.
import { open, load } from './storefront-lib.mjs';
const [url, w, action, target, probe] = process.argv.slice(2);
const { browser, page } = await open({ w: +w, h: w < 768 ? 844 : 900 });
await load(page, url);
if (action === 'hover') await page.locator(target).first().hover();
if (action === 'click') await page.locator(target).first().click();
await page.waitForTimeout(1200);
console.log(await page.evaluate(new Function('return (' + probe + ')()')));
await browser.close();
