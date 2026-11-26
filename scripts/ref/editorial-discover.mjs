// Discovery: load each reference page, report status, title, popups, footer + care-guide links.
import { chromium } from 'playwright';
const urls = process.argv.slice(2);
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1, locale: 'en-US' });
for (const url of urls) {
  const page = await ctx.newPage();
  let status = null;
  try {
    const r = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
    status = r?.status();
    await page.waitForTimeout(5000);
  } catch (e) { console.log(JSON.stringify({ url, error: e.message })); continue; }
  const info = await page.evaluate(() => {
    const vis = el => { const r = el.getBoundingClientRect(); const s = getComputedStyle(el); return r.width > 50 && r.height > 50 && s.visibility !== 'hidden' && s.display !== 'none' && +s.opacity > 0; };
    const overlays = [...document.querySelectorAll('body *')].filter(el => { const s = getComputedStyle(el); return (s.position === 'fixed' || s.position === 'sticky') && vis(el); })
      .map(el => ({ tag: el.tagName, id: el.id, cls: String(el.className).slice(0, 80), text: el.innerText.slice(0, 80).replace(/\s+/g, ' '), z: getComputedStyle(el).zIndex, pos: getComputedStyle(el).position }));
    const footer = document.querySelector('footer') || document.body;
    const links = [...footer.querySelectorAll('a[href]')].map(a => a.innerText.trim().replace(/\s+/g, ' ') + ' | ' + a.href).filter((v, i, arr) => arr.indexOf(v) === i);
    const care = [...document.querySelectorAll('a[href]')].map(a => a.href).filter(h => /care|guide|faq|size|ship|return|about|story|journal|blog|fabric|material|esg|sustain/i.test(h)).filter((v, i, a) => a.indexOf(v) === i);
    return { title: document.title, h: document.documentElement.scrollHeight, overlays, links: links.slice(0, 80), care: care.slice(0, 80), bodyStart: document.body.innerText.slice(0, 300) };
  });
  console.log(JSON.stringify({ url, status, final: page.url(), ...info }, null, 1));
  await page.close();
}
await browser.close();
