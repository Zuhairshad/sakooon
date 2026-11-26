import { chromium } from 'playwright';
const url = process.argv[2];
const b = await chromium.launch();
const ctx = await b.newContext({ viewport:{width:1440,height:900}, deviceScaleFactor:1, locale:'en-US',
  userAgent:'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'});
const p = await ctx.newPage();
const r = await p.goto(url,{waitUntil:'domcontentloaded',timeout:60000});
console.log('status', r.status(), p.url());
await p.waitForTimeout(6000);
console.log('title', await p.title());
const info = await p.evaluate(()=>{
  const vis = e=>{const r=e.getBoundingClientRect();const s=getComputedStyle(e);return r.width>0&&r.height>0&&s.visibility!=='hidden'&&s.display!=='none'};
  const fixed=[...document.querySelectorAll('body *')].filter(e=>{const s=getComputedStyle(e);return (s.position==='fixed')&&vis(e)&&e.getBoundingClientRect().width>200}).map(e=>({tag:e.tagName,id:e.id,cls:(e.className+'').slice(0,80),z:getComputedStyle(e).zIndex,r:e.getBoundingClientRect().toJSON(),txt:e.innerText.slice(0,120)}));
  const header=document.querySelector('header')||document.querySelector('[class*=header]');
  const top=[...document.body.children].map(e=>({tag:e.tagName,id:e.id,cls:(e.className+'').slice(0,80),h:Math.round(e.getBoundingClientRect().height)})).slice(0,40);
  return {fixed, top, header: header && header.outerHTML.slice(0,3000)};
});
console.log(JSON.stringify(info,null,1).slice(0,9000));
await p.screenshot({path:process.argv[3]||'/tmp/x.png'});
await b.close();
