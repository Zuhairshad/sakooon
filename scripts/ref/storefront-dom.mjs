// Dump a trimmed DOM outline of a selector (tags/classes/text), for structure study.
import { chromium } from 'playwright';
const [url, sel, w='1440', depth='6'] = process.argv.slice(2);
const b = await chromium.launch();
const ctx = await b.newContext({ viewport:{width:+w,height:900}, deviceScaleFactor:1,
  userAgent:'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'});
const p = await ctx.newPage();
await p.goto(url,{waitUntil:'domcontentloaded',timeout:60000}); await p.waitForTimeout(5000);
const out = await p.evaluate(([sel,depth])=>{
  const lines=[];
  const walk=(e,d)=>{ if(d>depth||['SCRIPT','STYLE','svg','LINK','path','NOSCRIPT'].includes(e.tagName))return;
    const r=e.getBoundingClientRect(); const own=[...e.childNodes].filter(n=>n.nodeType===3).map(n=>n.textContent.trim()).join(' ').slice(0,50);
    lines.push('  '.repeat(d)+e.tagName.toLowerCase()+(e.id?'#'+e.id:'')+(typeof e.className==='string'&&e.className?'.'+e.className.trim().split(/\s+/).slice(0,4).join('.'):'')+` [${Math.round(r.width)}x${Math.round(r.height)}]`+(own?' "'+own+'"':'')+(e.href?' ->'+e.getAttribute('href'):''));
    [...e.children].forEach(c=>walk(c,d+1)); };
  document.querySelectorAll(sel).forEach(e=>walk(e,0)); return lines.join('\n');
},[sel,+depth]);
console.log(out);
await b.close();
