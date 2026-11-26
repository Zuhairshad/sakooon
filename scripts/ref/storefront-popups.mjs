import { chromium } from 'playwright';
const b = await chromium.launch();
const ctx = await b.newContext({ viewport:{width:1440,height:900}, userAgent:'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'});
const p = await ctx.newPage();
await p.goto(process.argv[2],{waitUntil:'domcontentloaded'}); await p.waitForTimeout(9000);
console.log(await p.evaluate(()=>[...document.querySelectorAll('[role=dialog],[aria-modal=true],[id*=alia],[class*=popup],[class*=modal],[id*=onetrust],[class*=cookie],[id*=klaviyo],[class*=klaviyo]')].filter(e=>e.getBoundingClientRect().height>0).map(e=>e.tagName+'#'+e.id+'.'+(e.className+'').slice(0,60)+' btns:'+[...e.querySelectorAll('button,[role=button]')].map(x=>(x.getAttribute('aria-label')||x.innerText).trim().slice(0,30)).join('|')).join('\n')));
await p.screenshot({path:process.argv[3]}); await b.close();
