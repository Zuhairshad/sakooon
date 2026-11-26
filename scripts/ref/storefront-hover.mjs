import { chromium } from 'playwright';
const [url, idx='2', out] = process.argv.slice(2);
const b = await chromium.launch();
const ctx = await b.newContext({ viewport:{width:1440,height:900}, deviceScaleFactor:1,
  userAgent:'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'});
const p = await ctx.newPage();
await p.goto(url,{waitUntil:'domcontentloaded',timeout:60000}); await p.waitForTimeout(5000);
await p.locator('.cv-header__nav-trigger').nth(+idx).hover(); await p.waitForTimeout(1200);
const d = await p.evaluate(()=>{
  const dd=[...document.querySelectorAll('.cv-header__dropdown')].find(e=>e.getBoundingClientRect().height>0);
  if(!dd) return 'none';
  const lines=[];
  const walk=(e,d)=>{ if(['SCRIPT','STYLE','svg','path'].includes(e.tagName))return; const r=e.getBoundingClientRect(); const s=getComputedStyle(e);
    const own=[...e.childNodes].filter(n=>n.nodeType===3).map(n=>n.textContent.trim()).join(' ').slice(0,40);
    lines.push('  '.repeat(d)+e.tagName.toLowerCase()+'.'+(e.className+'').trim().split(/\s+/).slice(0,2).join('.')+` [${Math.round(r.x)},${Math.round(r.y)} ${Math.round(r.width)}x${Math.round(r.height)}] fs=${s.fontSize} fw=${s.fontWeight} ls=${s.letterSpacing} lh=${s.lineHeight} pad=${s.padding} gap=${s.gap}`+(own?' "'+own+'"':''));
    [...e.children].forEach(c=>walk(c,d+1));};
  walk(dd,0); const s=getComputedStyle(dd); return `transition=${s.transition}\n`+lines.join('\n');});
console.log(d);
await p.screenshot({path:out});
await b.close();
