/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Ported section scripts for the content pages (about, contact, size guide,
 * quiz, 404). Each init receives the section root and an `on()` helper that
 * registers window/document listeners so they are removed on unmount.
 */
import { whenIdle } from '@/lib/theme/lite';
type On = (t: EventTarget, ev: string, fn: (e: any) => void, o?: AddEventListenerOptions | boolean) => void;
type Init = (r: HTMLElement, on: On) => void | (() => void);

const still = () => document.body.getAttribute('data-motion') === 'off' || matchMedia('(prefers-reduced-motion: reduce)').matches;
const $$ = <T extends Element = HTMLElement>(s: string, r: ParentNode) => Array.from(r.querySelectorAll<T>(s));
const onScroll = (on: On, fn: () => void) => {
  let tk = false;
  on(window, 'scroll', () => { if (!tk) { tk = true; requestAnimationFrame(() => { tk = false; fn(); }); } }, { passive: true });
};

/* page banner: moon arc + parallax */
const banner: Init = (r, on) => {
  const m = r.querySelector('[data-snph-moon]'), bg = r.querySelector<HTMLElement>('[data-snph-bg]');
  const s = still();
  const upd = () => {
    const b = r.getBoundingClientRect(), p = Math.min(1, Math.max(0, -b.top / Math.max(1, b.height)));
    if (m) r.style.setProperty('--mp', (0.15 + p * 0.7).toFixed(3));
    if (bg && !s) bg.style.transform = 'translateY(' + (p * 12).toFixed(2) + '%)';
  };
  onScroll(on, upd);
  upd();
  if (m && !s) whenIdle(() => {
    const t0 = performance.now();
    const intro = (t: number) => {
      const k = Math.min(1, (t - t0) / 1800), e = 1 - Math.pow(1 - k, 3);
      if (r.getBoundingClientRect().top >= -2) r.style.setProperty('--mp', (0.02 + e * 0.13).toFixed(3));
      if (k < 1 && r.isConnected) requestAnimationFrame(intro);
    };
    requestAnimationFrame(intro);
  });
};

/* about/craft: parallax images + count-up */
const craft: Init = (r, on) => {
  if (still()) return;
  const els = $$('[data-px]', r);
  const upd = () => {
    const b = r.getBoundingClientRect(), c = Math.max(-innerHeight, Math.min(innerHeight, b.top + b.height / 2 - innerHeight / 2));
    els.forEach((e) => (e.style.translate = '0 ' + (c * parseFloat(e.getAttribute('data-px')!)).toFixed(1) + 'px'));
  };
  onScroll(on, upd);
  upd();
  const n = r.querySelector('[data-snit-count]');
  if (!n) return;
  const raw = n.getAttribute('data-snit-count')!, m = raw.match(/[\d.,]+/);
  if (!m) return;
  const target = parseFloat(m[0].replace(/,/g, '')), pre = raw.slice(0, m.index), post = raw.slice(m.index! + m[0].length), dec = (m[0].split('.')[1] || '').length;
  const io = new IntersectionObserver((es, o) => {
    if (!es[0].isIntersecting) return;
    o.disconnect();
    const t0 = performance.now();
    const f = (t: number) => {
      const k = Math.min(1, (t - t0) / 1800), e = 1 - Math.pow(1 - k, 3);
      n.textContent = pre + (target * e).toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec }) + post;
      if (k < 1) requestAnimationFrame(f);
    };
    requestAnimationFrame(f);
  });
  io.observe(n);
  return () => io.disconnect();
};

/* about/story: thread drawn through the timeline knots */
const story: Init = (r, on) => {
  const wrap = r.querySelector<HTMLElement>('[data-snst-wrap]'), svg = r.querySelector('[data-snst-svg]'), bg = r.querySelector('[data-snst-bg]');
  const fg = r.querySelector<SVGPathElement>('[data-snst-fg]'), nd = r.querySelector<HTMLElement>('[data-snst-needle]');
  if (!wrap || !svg || !bg || !fg || !nd) return;
  const knots = $$('[data-snst-knot]', r);
  let len = 0;
  const upd = () => {
    if (!len) return;
    const b = wrap.getBoundingClientRect(), p = Math.min(1, Math.max(0, (innerHeight * 0.6 - b.top) / b.height));
    fg.style.setProperty('--off', (1000 - p * 1000).toFixed(1));
    const pt = fg.getPointAtLength(p * len), pt2 = fg.getPointAtLength(Math.min(len, p * len + 2));
    const ang = (Math.atan2(pt2.y - pt.y, pt2.x - pt.x) * 180) / Math.PI - 45;
    nd.style.setProperty('--nx', pt.x + 'px');
    nd.style.setProperty('--ny', pt.y + 'px');
    nd.style.setProperty('--nr', ang + 'deg');
    nd.style.opacity = p > 0 && p < 1 ? '1' : '.4';
    knots.forEach((k) => k.classList.toggle('is-on', k.getBoundingClientRect().top < innerHeight * 0.6));
  };
  const build = () => {
    const W = wrap.offsetWidth, H = wrap.offsetHeight, wr = wrap.getBoundingClientRect();
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    const pts = knots.map((k) => { const b = k.getBoundingClientRect(); return [b.left - wr.left + b.width / 2, b.top - wr.top + b.height / 2]; });
    if (!pts.length) return;
    let prev = [pts[0][0], Math.max(0, pts[0][1] - 80)];
    let d = `M${prev[0]} ${prev[1]}`;
    pts.forEach((p) => { const dy = p[1] - prev[1]; d += ` C${prev[0]} ${prev[1] + dy * 0.8} ${p[0]} ${p[1] - dy * 0.8} ${p[0]} ${p[1]}`; prev = p; });
    d += ` C${prev[0]} ${prev[1] + 80} ${prev[0]} ${prev[1] + 120} ${prev[0]} ${prev[1] + 160}`;
    bg.setAttribute('d', d);
    fg.setAttribute('d', d);
    len = fg.getTotalLength();
    upd();
  };
  onScroll(on, upd);
  on(window, 'resize', build);
  const t = setTimeout(build, 300);
  build();
  const ro = new ResizeObserver(build);
  ro.observe(wrap);
  return () => { clearTimeout(t); ro.disconnect(); };
};

/* about/steps: progress thread */
const steps: Init = (r, on) => {
  const l = r.querySelector<HTMLElement>('[data-snst]');
  const th = l?.querySelector<HTMLElement>('.snst__thread');
  if (!l || !th) return;
  const st = $$('[data-snst-step]', l), s = still();
  const upd = () => {
    const b = l.getBoundingClientRect(), p = s ? 1 : Math.min(1, Math.max(0, (innerHeight * 0.78 - b.top) / (b.height * 0.9 + innerHeight * 0.2)));
    th.style.setProperty('--p', p.toFixed(3));
    st.forEach((x, i) => x.classList.toggle('is-lit', p >= (st.length > 1 ? i / (st.length - 1) : 0) - 0.02));
  };
  onScroll(on, upd);
  on(window, 'resize', upd);
  upd();
};

/* promise / features: orbiting moon */
const orbit: Init = (r, on) => {
  const o = r.querySelector('[data-snft-orbit]');
  const m = o?.querySelector<HTMLElement>('.snft__moon i');
  if (!o || !m) return;
  const upd = () => {
    const b = o.getBoundingClientRect(), p = 1 - Math.min(1, Math.max(0, (b.top + b.height / 2) / innerHeight));
    m.style.setProperty('--mx', (62 + p * 70).toFixed(1) + '%');
  };
  onScroll(on, upd);
  upd();
};

/* about/video: no video configured in the theme → same toast as live */
const video: Init = (r, on) => {
  const b = r.querySelector('[data-snvd-play]'), tpl = r.querySelector('[data-snvd-tpl]');
  if (!b || !tpl) return;
  const ov = r.querySelector<HTMLElement>('.snvd__ov');
  on(b, 'click', () => {
    const html = tpl.innerHTML.trim();
    if (!html) { window.SN?.toast?.('Add a video in the theme editor', 'info'); return; }
    if (ov) { ov.querySelector('[data-snvd-frame]')!.innerHTML = html; window.SN?.open?.(ov); }
  });
};

/* reviews: constellation stars */
const reviews: Init = (r, on) => {
  const stars = $$('[data-snrv-star]', r), qs = $$('[data-snrv-q]', r);
  if (!stars.length) return;
  let i = 0, hov = false;
  const go = (k: number) => {
    i = k;
    stars.forEach((s, j) => s.classList.toggle('is-on', j === k));
    qs.forEach((q, j) => q.classList.toggle('is-on', j === k));
  };
  stars.forEach((s, j) => { on(s, 'click', () => go(j)); on(s, 'mouseenter', () => go(j)); });
  on(r, 'mouseenter', () => (hov = true));
  on(r, 'mouseleave', () => (hov = false));
  const t = setInterval(() => { if (!hov && !document.hidden) go((i + 1) % stars.length); }, 6000);
  return () => clearInterval(t);
};

/* press quotes */
const press: Init = (r, on) => {
  const p = r.querySelector('[data-snlg]');
  if (!p) return;
  const ts = $$('[data-snlg-t]', p);
  let i = 0, t: ReturnType<typeof setTimeout> | undefined;
  const go = (n: number) => {
    i = (n + ts.length) % ts.length;
    ts.forEach((b, k) => b.classList.toggle('is-on', k === i));
    $$('[data-snlg-q]', p).forEach((q) => q.classList.toggle('is-on', +q.getAttribute('data-snlg-q')! === i));
    clearTimeout(t);
    t = setTimeout(() => go(i + 1), 6000);
  };
  ts.forEach((b, k) => on(b, 'click', () => go(k)));
  go(0);
  return () => clearTimeout(t);
};

/* contact/stores: switch map */
const stores: Init = (r, on) => {
  const f = r.querySelector<HTMLIFrameElement>('[data-snsr-frame]'), m = r.querySelector('.snsr__map'), bs = $$('[data-snsr]', r);
  const pick = (b: HTMLElement) => {
    bs.forEach((x) => { x.classList.toggle('is-on', x === b); x.setAttribute('aria-selected', String(x === b)); });
    if (!f || !m) return;
    m.classList.add('is-loading');
    f.onload = () => m.classList.remove('is-loading');
    f.src = 'https://maps.google.com/maps?q=' + b.getAttribute('data-snsr') + '&z=14&output=embed';
  };
  bs.forEach((b) => {
    on(b, 'click', (e) => { if (!(e.target as HTMLElement).closest('a')) pick(b); });
    on(b, 'keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(b); } });
  });
};

/* FAQ: category tabs, search, single-open accordion */
const faq: Init = (r, on) => {
  const qs = $$<HTMLDetailsElement>('.snfq__q', r), none = r.querySelector<HTMLElement>('[data-snfq-none]');
  let cat = '*', term = '';
  const apply = () => {
    let shown = 0;
    qs.forEach((q) => {
      const ok = (cat === '*' || q.getAttribute('data-cat') === cat) && (!term || q.textContent!.toLowerCase().includes(term));
      q.classList.toggle('is-hide', !ok);
      if (ok) { shown++; q.classList.add('is-in'); }
    });
    if (none) none.hidden = shown > 0;
  };
  const tabs = r.querySelector<HTMLElement>('.snfq__tabs');
  const pill = () => tabs && window.SN?.pill?.(tabs);
  if (tabs) {
    on(tabs, 'click', (e) => {
      const b = (e.target as HTMLElement).closest('[data-snfq-cat]');
      if (!b) return;
      cat = b.getAttribute('data-snfq-cat')!;
      $$('button', tabs).forEach((x) => x.classList.toggle('is-on', x === b));
      pill();
      apply();
    });
    pill();
    const t = setTimeout(pill, 500);
    on(window, 'resize', pill);
    on(window, 'load', pill);
    void t;
  }
  const q = r.querySelector<HTMLInputElement>('[data-snfq-q]');
  if (q)
    on(q, 'input', () => {
      term = q.value.trim().toLowerCase();
      apply();
      if (term) qs.forEach((d) => { if (!d.classList.contains('is-hide')) d.open = true; });
    });
  qs.forEach((d) => on(d, 'toggle', () => { if (d.open) qs.forEach((o) => { if (o !== d) o.open = false; }); }));
};

/* size-guide/sizes: bed size explorer with in/cm toggle */
const sizes: Init = (r, on) => {
  const tabs = $$('[data-snsg-tab]', r), cards = $$('[data-snsg-card]', r);
  const bed = r.querySelector<HTMLElement>('[data-snsg-bed]'), pills = r.querySelector<HTMLElement>('[data-snsg-pills]'), mark = r.querySelector<HTMLElement>('[data-snsg-mark]'), ub = r.querySelector('.snsg__unit');
  if (!bed || !pills) return;
  const maxw = +(r.getAttribute('data-maxw') || 0) || 80, maxl = +(r.getAttribute('data-maxl') || 0) || 84;
  let unit = 'in', cur = 0;
  try { unit = localStorage.getItem('sn-unit') || 'in'; } catch {}
  const f = (v: number) => (unit === 'cm' ? Math.round(v * 2.54) + ' cm' : v + '″');
  const conv = (o: string) =>
    unit === 'in' ? o : o.replace(/(\d+(?:\.\d+)?)/g, (m) => String(Math.round(parseFloat(m) * 2.54))).replace(/\s?(in|inch|inches)\b/gi, ' cm').replace(/[″"]/g, ' cm');
  const paint = () => {
    const t = tabs[cur];
    if (!t) return;
    const w = +t.getAttribute('data-w')!, l = +t.getAttribute('data-l')!, p = +(t.getAttribute('data-p') || 0) || 2;
    bed.style.setProperty('--bw', ((w / maxw) * 56).toFixed(1) + '%');
    bed.style.setProperty('--bl', ((l / maxl) * 70).toFixed(1) + '%');
    r.querySelector('[data-snsg-w]')!.textContent = f(w);
    r.querySelector('[data-snsg-l]')!.textContent = f(l);
    let h = '';
    for (let i = 0; i < Math.min(4, p); i++) h += `<i style="--k:${i}"></i>`;
    pills.innerHTML = h;
    tabs.forEach((b) => {
      const d = b.querySelector('[data-snsg-dim]');
      const bw = +b.getAttribute('data-w')!, bl = +b.getAttribute('data-l')!;
      if (d) d.textContent = unit === 'cm' ? `${Math.round(bw * 2.54)} × ${Math.round(bl * 2.54)} cm` : `${bw} × ${bl} in`;
    });
    $$('[data-snsg-conv]', r).forEach((el) => { if (!el.dataset.o) el.dataset.o = el.textContent || ''; el.textContent = conv(el.dataset.o); });
    if (mark) mark.style.left = t.offsetLeft + t.offsetWidth / 2 + 'px';
  };
  const show = (k: number) => {
    cur = k;
    tabs.forEach((b, j) => { b.classList.toggle('is-on', j === k); b.setAttribute('aria-selected', String(j === k)); });
    cards.forEach((c, j) => { c.hidden = j !== k; c.classList.toggle('is-on', j === k); });
    paint();
  };
  const sync = () => {
    $$('[data-snsg-u]', r).forEach((x) => x.classList.toggle('is-on', x.getAttribute('data-snsg-u') === unit));
    ub?.classList.toggle('is-cm', unit === 'cm');
  };
  tabs.forEach((b, j) => on(b, 'click', () => show(j)));
  $$('[data-snsg-u]', r).forEach((b) =>
    on(b, 'click', () => {
      unit = b.getAttribute('data-snsg-u')!;
      try { localStorage.setItem('sn-unit', unit); } catch {}
      sync();
      paint();
    }),
  );
  sync();
  show(+(r.getAttribute('data-start') || 0) || 0);
  on(window, 'resize', paint);
};

/* size-guide/threads: canvas weave demo (only animates while visible, then stops) */
const threads: Init = (r, on) => {
  const tabs = $$('[data-sntg-tab]', r), panels = $$('[data-sntg-panel]', r);
  const cv = r.querySelector<HTMLCanvasElement>('[data-sntg-cv]'), numEl = r.querySelector('[data-sntg-num]'), wv = r.querySelector('[data-sntg-weave]');
  if (!cv || !tabs.length) return;
  const ctx = cv.getContext('2d')!;
  const reduce = still();
  const AC = getComputedStyle(r).getPropertyValue('--ac').trim() || '#A8834F';
  const W = cv.width, H = cv.height;
  let cols = 30, row = 0, rows = 0, gap = 0, tone = '#F4EEE2', pattern = 'plain', raf: number | null = null, vis = false, shown = 0, target = 0;
  const hex = (c: string) => { c = c.replace('#', ''); if (c.length === 3) c = c.replace(/./g, '$&$&'); const n = parseInt(c, 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; };
  const shade = (c: string, k: number) => 'rgb(' + hex(c).map((v) => Math.max(0, Math.min(255, Math.round(v * k)))).join(',') + ')';
  const setup = (btn: HTMLElement) => {
    const n = parseFloat(btn.getAttribute('data-n') || '') || 200;
    target = n;
    tone = btn.getAttribute('data-tone') || '#F4EEE2';
    const w = btn.getAttribute('data-w') || '';
    pattern = /sateen|satin/i.test(w) ? 'sateen' : /terry|loop|gsm/i.test(w) ? 'terry' : 'plain';
    cols = Math.round(n / 9); gap = W / cols; rows = Math.ceil(H / gap) + 1; row = 0;
    if (wv) wv.textContent = w;
    ctx.fillStyle = shade(tone, 0.55);
    ctx.fillRect(0, 0, W, H);
    for (let c = 0; c < cols; c++) {
      const x = c * gap, g = ctx.createLinearGradient(x, 0, x + gap, 0);
      g.addColorStop(0, shade(tone, 0.78)); g.addColorStop(0.5, shade(tone, 0.95)); g.addColorStop(1, shade(tone, 0.7));
      ctx.fillStyle = g;
      ctx.fillRect(x + gap * 0.08, 0, gap * 0.84, H);
    }
  };
  const over = (c: number, rr: number) => (pattern === 'sateen' ? (c + rr * 2) % 5 !== 0 : (c + rr) % 2 === 0);
  const weaveRow = (rr: number) => {
    const y = rr * gap, th = gap * 0.86;
    if (pattern === 'terry') {
      for (let c = 0; c < cols; c++) {
        const x = c * gap + (rr % 2 ? gap / 2 : 0) + gap / 2, cy = y + gap / 2;
        const g = ctx.createRadialGradient(x - th * 0.2, cy - th * 0.25, 1, x, cy, th * 0.65);
        g.addColorStop(0, shade(tone, 1.06)); g.addColorStop(0.6, shade(tone, 0.95)); g.addColorStop(1, shade(tone, 0.62));
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, cy, th * 0.58, 0, 6.283); ctx.fill();
      }
      return;
    }
    for (let c = 0; c < cols; c++) {
      if (!over(c, rr)) continue;
      const x = c * gap - gap * 0.06, g = ctx.createLinearGradient(0, y, 0, y + th);
      g.addColorStop(0, shade(tone, 1.08)); g.addColorStop(0.45, shade(tone, 1)); g.addColorStop(1, shade(tone, 0.72));
      ctx.fillStyle = g;
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(x, y + gap * 0.07, gap * 1.12, th, th / 2); else ctx.rect(x, y + gap * 0.07, gap * 1.12, th);
      ctx.fill();
    }
    if (pattern === 'sateen') { ctx.fillStyle = 'rgba(255,255,255,.07)'; ctx.fillRect(0, y + gap * 0.2, W, gap * 0.18); }
  };
  void AC;
  const frame = () => {
    raf = null;
    if (!vis || document.hidden || !r.isConnected) return;
    const per = Math.max(1, Math.round(rows / 70));
    for (let k = 0; k < per && row < rows; k++) { weaveRow(row); row++; }
    shown += (target - shown) * 0.08;
    if (numEl) numEl.textContent = String(Math.round(shown));
    if (row < rows) raf = requestAnimationFrame(frame);
    else if (numEl) numEl.textContent = String(target);
  };
  const show = (k: number) => {
    tabs.forEach((b, j) => { b.classList.toggle('is-on', j === k); b.setAttribute('aria-selected', String(j === k)); });
    panels.forEach((p, j) => { p.hidden = j !== k; p.classList.toggle('is-on', j === k); });
    setup(tabs[k]);
    if (reduce) { for (let i = 0; i < rows; i++) weaveRow(i); row = rows; if (numEl) numEl.textContent = String(target); return; }
    if (!raf) raf = requestAnimationFrame(frame);
  };
  tabs.forEach((b, j) => on(b, 'click', () => show(j)));
  const start = parseInt(r.getAttribute('data-start') || '', 10) || 0;
  setup(tabs[start]);
  const io = new IntersectionObserver((es) => {
    const was = vis;
    vis = es[0].isIntersecting;
    if (vis && !was) { if (row === 0) show(start); else if (!raf) raf = requestAnimationFrame(frame); }
  }, { threshold: 0.2 });
  io.observe(cv);
  return () => { io.disconnect(); if (raf) cancelAnimationFrame(raf); };
};

/* size-guide/compare: equalise card tops on desktop */
const compare: Init = (r, on) => {
  const fit = () => {
    let m = 0;
    const tops = $$('.sncp__top', r);
    tops.forEach((t) => { t.style.height = 'auto'; m = Math.max(m, t.offsetHeight); });
    r.querySelector<HTMLElement>('.sncp__grid')?.style.setProperty('--toph', m + 'px');
    tops.forEach((t) => (t.style.height = ''));
  };
  if (matchMedia('(min-width: 900px)').matches) { fit(); on(window, 'load', fit); on(window, 'resize', fit); }
};

/* quiz deck */
const quiz: Init = (r, on) => {
  const qs = $$('.snqz__card[data-step]:not(.snqz__intro):not(.snqz__res)', r), res = r.querySelector<HTMLElement>('.snqz__res')!;
  let picks: string[] = [], cur: HTMLElement | null = r.querySelector('.snqz__intro');
  const go = (el: HTMLElement) => {
    if (el === cur) return;
    const old = cur;
    cur = el;
    if (old) { old.classList.add('is-leave'); setTimeout(() => { old.classList.remove('is-leave'); old.hidden = true; }, 520); }
    el.hidden = false;
    el.classList.remove('is-enter');
    void el.offsetWidth;
    el.classList.add('is-enter');
    $$('.snqz__opt', el).forEach((o) => { o.style.animation = 'none'; void o.offsetWidth; o.style.animation = ''; });
  };
  const finish = () => {
    const sc: Record<string, number> = {};
    picks.forEach((p) => (sc[p] = (sc[p] || 0) + 1));
    let best = '1', m = -1;
    Object.keys(sc).sort().forEach((k) => { if (sc[k] > m) { m = sc[k]; best = k; } });
    const rr = $$('[data-r-id]', r), match = r.querySelector<HTMLElement>(`[data-r-id="${best}"]`) || rr[0];
    rr.forEach((x) => (x.hidden = x !== match));
    go(res);
  };
  const startBtn = r.querySelector('[data-snqz-start]');
  if (startBtn) on(startBtn, 'click', () => { picks = []; if (qs[0]) go(qs[0]); else finish(); });
  qs.forEach((q, i) => {
    $$('.snqz__opt', q).forEach((o) =>
      on(o, 'click', () => {
        $$('.snqz__opt', q).forEach((x) => x.classList.toggle('is-picked', x === o));
        picks[i] = o.getAttribute('data-to')!;
        picks.length = i + 1;
        setTimeout(() => (qs[i + 1] ? go(qs[i + 1]) : finish()), 420);
      }),
    );
    const b = q.querySelector('[data-snqz-back]');
    if (b) on(b, 'click', () => go(qs[i - 1]));
  });
  $$('[data-snqz-again]', r).forEach((b) =>
    on(b, 'click', () => {
      picks = [];
      $$('.is-picked', r).forEach((x) => x.classList.remove('is-picked'));
      go(qs[0] || r.querySelector('.snqz__intro')!);
    }),
  );
};

/* product rail with prev/next (quiz bestsellers) */
const rail: Init = (r, on) => {
  const vis = () => r.querySelector<HTMLElement>('.snp__panel:not([hidden]) [data-sn-rail]');
  const step = (el: HTMLElement) => { const c = el.querySelector('.snp__item'); return c ? c.getBoundingClientRect().width + 22 : 300; };
  const p = r.querySelector('[data-snp-prev]'), n = r.querySelector('[data-snp-next]');
  if (p) on(p, 'click', () => { const v = vis(); v?.scrollBy({ left: -step(v), behavior: 'smooth' }); });
  if (n) on(n, 'click', () => { const v = vis(); v?.scrollBy({ left: step(v), behavior: 'smooth' }); });
};

/* 404 moon follows the pointer */
const notFound: Init = (r, on) => {
  const m = r.querySelector<HTMLElement>('.sn404__moon');
  if (!m || !matchMedia('(hover: hover)').matches) return;
  on(r, 'pointermove', (e: PointerEvent) => {
    const b = r.getBoundingClientRect();
    m.style.setProperty('--mx', ((e.clientX - b.left) / b.width - 0.5) * 30 + 'px');
    m.style.setProperty('--my', ((e.clientY - b.top) / b.height - 0.5) * 20 + 'px');
  });
};

/* contact form → /api/contact (no-JS fallback posts the form and redirects) */
const contactForm: Init = (r, on) => {
  const form = r.querySelector<HTMLFormElement>('form');
  if (!form) return;
  const sp = new URLSearchParams(location.search);
  const done = () => {
    form.innerHTML =
      '<p class="sn-h sn-h--s snct__ft">Thank you — message received.</p><p class="sn-small">We reply within a few hours, 10am to 10pm. For anything urgent, message us on WhatsApp.</p>';
  };
  if (sp.get('sent')) done();
  on(form, 'submit', async (e: SubmitEvent) => {
    e.preventDefault();
    const btn = form.querySelector('button[type=submit]');
    btn?.classList.add('is-busy');
    const data: Record<string, string> = {};
    new FormData(form).forEach((v, k) => (data[k.replace(/^contact\[(.*)\]$/, '$1')] = String(v)));
    try {
      const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      if (!res.ok) throw new Error((await res.json().catch(() => ({})))?.error || 'Could not send');
      done();
      window.SN?.toast?.('Message sent — we’ll be in touch soon.');
    } catch (err) {
      window.SN?.toast?.((err as Error).message || 'Could not send — please try again.', 'close');
    } finally {
      btn?.classList.remove('is-busy');
    }
  });
};

/* page template: build the table of contents from h2/h3 */
const toc: Init = (r) => {
  const t = r.querySelector<HTMLElement>('[data-snpg-toc]'), body = r.querySelector('[data-snpg-body]');
  if (!t || !body) return;
  const hs = $$('h2, h3', body);
  if (hs.length < 2) return;
  const ol = t.querySelector('ol')!;
  ol.innerHTML = '';
  hs.forEach((h, i) => {
    if (!h.id) h.id = 'sec-' + i + '-' + h.textContent!.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 40);
    const li = document.createElement('li'), a = document.createElement('a');
    a.href = '#' + h.id;
    a.textContent = h.textContent;
    if (h.tagName === 'H3') { a.style.paddingLeft = '28px'; a.style.fontSize = '13px'; }
    li.appendChild(a);
    ol.appendChild(li);
  });
  t.hidden = false;
  const links = $$('a', ol);
  const io = new IntersectionObserver(
    (es) => es.forEach((e) => { if (e.isIntersecting) links.forEach((l) => l.classList.toggle('is-on', l.getAttribute('href') === '#' + e.target.id)); }),
    { rootMargin: '-20% 0px -70% 0px' },
  );
  hs.forEach((h) => io.observe(h));
  return () => io.disconnect();
};

export const behaviors = { toc, contactForm, banner, craft, story, steps, orbit, video, reviews, press, stores, faq, sizes, threads, compare, quiz, rail, notFound } satisfies Record<string, Init>;
export type BehaviorName = keyof typeof behaviors;
