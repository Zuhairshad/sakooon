'use client';

import { useSection } from '@/components/theme/useSection';

const T = 'template--23876058939495__';
const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches || document.body.getAttribute('data-motion') === 'off';

/** rAF-throttled scroll listener bound to the section's abort signal. */
function onScroll(fn: () => void, signal: AbortSignal) {
  let tk = false;
  addEventListener('scroll', () => { if (!tk) { tk = true; requestAnimationFrame(() => { tk = false; fn(); }); } }, { passive: true, signal });
  fn();
}

/** Ports of the homepage section scripts (bestsellers, promise, room, editorial, compare, quiz, reviews, gallery, press). */
export default function HomeBehaviors() {
  // bestsellers: prev/next scroll the visible rail
  useSection(`snp-${T}best`, (r, signal) => {
    const vis = () => r.querySelector<HTMLElement>('.snp__panel:not([hidden]) [data-sn-rail]');
    const step = (el: HTMLElement) => { const c = el.querySelector('.snp__item'); return c ? c.getBoundingClientRect().width + 22 : 300; };
    r.querySelector('[data-snp-prev]')?.addEventListener('click', () => { const v = vis(); v?.scrollBy({ left: -step(v), behavior: 'smooth' }); }, { signal });
    r.querySelector('[data-snp-next]')?.addEventListener('click', () => { const v = vis(); v?.scrollBy({ left: step(v), behavior: 'smooth' }); }, { signal });
  });

  // promise: moon phase follows scroll
  useSection(`snft-${T}promise`, (r, signal) => {
    const o = r.querySelector<HTMLElement>('[data-snft-orbit]');
    const m = o?.querySelector<HTMLElement>('.snft__moon i');
    if (!o || !m) return;
    onScroll(() => {
      const b = o.getBoundingClientRect(), p = 1 - Math.min(1, Math.max(0, (b.top + b.height / 2) / innerHeight));
      m.style.setProperty('--mx', (62 + p * 70).toFixed(1) + '%');
    }, signal);
  });

  // shop the room: hotspots
  useSection(`snr-${T}room`, (r, signal) => {
    const spots = r.querySelectorAll<HTMLElement>('[data-snr-spot]');
    const set = (sp: HTMLElement) => spots.forEach((x) => {
      const on = x === sp && !x.classList.contains('is-on');
      x.classList.toggle('is-on', on);
      x.querySelector('.snr__dot')?.setAttribute('aria-expanded', String(on));
    });
    const hover = matchMedia('(hover: hover)').matches;
    spots.forEach((sp) => {
      sp.querySelector('.snr__dot')?.addEventListener('click', (e) => { e.stopPropagation(); set(sp); }, { signal });
      if (hover) {
        sp.addEventListener('mouseenter', () => spots.forEach((x) => x.classList.toggle('is-on', x === sp)), { signal });
        sp.addEventListener('mouseleave', () => sp.classList.remove('is-on'), { signal });
      }
    });
    document.addEventListener('click', (e) => { if (!r.contains(e.target as Node)) spots.forEach((x) => x.classList.remove('is-on')); }, { signal });
    const fit = () => {
      const W = document.documentElement.clientWidth;
      r.querySelectorAll<HTMLElement>('.snr__pop').forEach((p) => {
        p.style.translate = '0 0';
        const b = p.getBoundingClientRect();
        let dx = 0;
        if (b.right > W - 22) dx = W - 22 - b.right;
        if (b.left + dx < 22) dx = 22 - b.left;
        p.style.translate = dx + 'px 0';
      });
    };
    fit();
    addEventListener('resize', fit, { signal });
    addEventListener('load', fit, { signal });
    const all = r.querySelector<HTMLElement>('[data-snr-all]');
    all?.addEventListener('click', () => {
      const ids = all.getAttribute('data-snr-all')!.split(',').filter(Boolean).map((i) => ({ id: +i, quantity: 1 }));
      all.classList.add('is-busy');
      window.SN.cart.add(ids).catch(() => {}).then(() => all.classList.remove('is-busy'));
    }, { signal });
  });

  // editorial: parallax + count-up numbers
  useSection(`sned-${T}editorial`, (r, signal) => {
    const reduce = reduced();
    const par = r.querySelectorAll<HTMLElement>('[data-sned-par]');
    if (!reduce)
      onScroll(() => {
        const b = r.getBoundingClientRect(), p = Math.max(-1, Math.min(1, (b.top + b.height / 2 - innerHeight / 2) / innerHeight));
        par.forEach((el) => el.style.setProperty('--py', (p * parseFloat(el.getAttribute('data-sned-par')!) * 400).toFixed(1) + 'px'));
      }, signal);
    const nums = r.querySelectorAll<HTMLElement>('[data-sned-count]');
    const fmt = (v: number, dec: number) => v.toFixed(dec).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    const decs = (to: number) => (String(to).split('.')[1] || '').length;
    if (reduce || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (!e.isIntersecting) return;
      io.unobserve(e.target);
      const el = e.target as HTMLElement, to = parseFloat(el.getAttribute('data-sned-count')!);
      if (isNaN(to)) return;
      const dec = decs(to), t0 = performance.now();
      const f = (t: number) => {
        const p = Math.min(1, (t - t0) / 1800), q = 1 - Math.pow(1 - p, 4);
        el.textContent = fmt(to * q, dec);
        if (p < 1 && !signal.aborted) requestAnimationFrame(f);
      };
      f(t0);
    }), { threshold: 0.5 });
    nums.forEach((n) => io.observe(n));
    return () => io.disconnect();
  });

  // compare: equalise card tops on desktop
  useSection(`sncp-${T}compare`, (r, signal) => {
    if (!matchMedia('(min-width: 900px)').matches) return;
    const fit = () => {
      let m = 0;
      const tops = r.querySelectorAll<HTMLElement>('.sncp__top');
      tops.forEach((t) => { t.style.height = 'auto'; m = Math.max(m, t.offsetHeight); });
      r.querySelector<HTMLElement>('.sncp__grid')?.style.setProperty('--toph', m + 'px');
      tops.forEach((t) => (t.style.height = ''));
    };
    fit();
    addEventListener('load', fit, { signal });
    addEventListener('resize', fit, { signal });
  });

  // bedtime quiz deck
  useSection(`snq-${T}quiz`, (r, signal) => {
    const qs = Array.from(r.querySelectorAll<HTMLElement>('.snqz__card[data-step]:not(.snqz__intro):not(.snqz__res)'));
    const res = r.querySelector<HTMLElement>('.snqz__res')!;
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
      el.querySelectorAll<HTMLElement>('.snqz__opt').forEach((o) => { o.style.animation = 'none'; void o.offsetWidth; o.style.animation = ''; });
    };
    const finish = () => {
      const sc: Record<string, number> = {};
      picks.forEach((p) => (sc[p] = (sc[p] || 0) + 1));
      let best = '1', m = -1;
      Object.keys(sc).sort().forEach((k) => { if (sc[k] > m) { m = sc[k]; best = k; } });
      const rr = r.querySelectorAll<HTMLElement>('[data-r-id]');
      const match = r.querySelector<HTMLElement>(`[data-r-id="${best}"]`) || rr[0];
      rr.forEach((x) => (x.hidden = x !== match));
      go(res);
    };
    r.querySelector('[data-snqz-start]')?.addEventListener('click', () => { picks = []; if (qs[0]) go(qs[0]); else finish(); }, { signal });
    qs.forEach((q, i) => {
      q.querySelectorAll<HTMLElement>('.snqz__opt').forEach((o) =>
        o.addEventListener('click', () => {
          q.querySelectorAll('.snqz__opt').forEach((x) => x.classList.toggle('is-picked', x === o));
          picks[i] = o.getAttribute('data-to')!;
          picks.length = i + 1;
          setTimeout(() => (qs[i + 1] ? go(qs[i + 1]) : finish()), 420);
        }, { signal }),
      );
      q.querySelector('[data-snqz-back]')?.addEventListener('click', () => go(qs[i - 1]), { signal });
    });
    r.querySelectorAll('[data-snqz-again]').forEach((b) =>
      b.addEventListener('click', () => {
        picks = [];
        r.querySelectorAll('.is-picked').forEach((x) => x.classList.remove('is-picked'));
        go(qs[0] || r.querySelector('.snqz__intro')!);
      }, { signal }),
    );
  });

  // reviews constellation
  useSection(`snrv-${T}reviews`, (r, signal) => {
    const stars = r.querySelectorAll<HTMLElement>('[data-snrv-star]'), qs = r.querySelectorAll<HTMLElement>('[data-snrv-q]');
    if (!stars.length) return;
    let i = 0, hov = false;
    const go = (k: number) => {
      i = k;
      stars.forEach((s, j) => s.classList.toggle('is-on', j === k));
      qs.forEach((q, j) => q.classList.toggle('is-on', j === k));
    };
    stars.forEach((s, j) => {
      s.addEventListener('click', () => go(j), { signal });
      s.addEventListener('mouseenter', () => go(j), { signal });
    });
    r.addEventListener('mouseenter', () => (hov = true), { signal });
    r.addEventListener('mouseleave', () => (hov = false), { signal });
    const t = setInterval(() => { if (!hov && !document.hidden) go((i + 1) % stars.length); }, 6000);
    return () => clearInterval(t);
  });

  // gallery mosaic parallax
  useSection(`sngl-${T}gallery`, (r, signal) => {
    const m = r.querySelector<HTMLElement>('[data-sngl-mosaic]');
    if (!m || reduced()) return;
    const cols = Array.from(m.children) as HTMLElement[];
    onScroll(() => {
      const b = m.getBoundingClientRect(), c = Math.max(-innerHeight, Math.min(innerHeight, b.top + b.height / 2 - innerHeight / 2));
      cols.forEach((e) => (e.style.transform = `translateY(${(c * parseFloat(e.getAttribute('data-speed') || '0')).toFixed(1)}px)`));
    }, signal);
  });

  // press: testimonial tabs (only when the logo/quote layout is used)
  useSection(`snlg-${T}press`, (r, signal) => {
    const p = r.querySelector<HTMLElement>('[data-snlg]');
    if (!p) return;
    const ts = Array.from(p.querySelectorAll<HTMLElement>('[data-snlg-t]'));
    let i = 0, t: ReturnType<typeof setTimeout> | undefined;
    const go = (n: number) => {
      i = (n + ts.length) % ts.length;
      ts.forEach((b, k) => b.classList.toggle('is-on', k === i));
      p.querySelectorAll('[data-snlg-q]').forEach((q) => q.classList.toggle('is-on', +q.getAttribute('data-snlg-q')! === i));
      clearTimeout(t);
      t = setTimeout(() => go(i + 1), 6000);
    };
    ts.forEach((b, k) => b.addEventListener('click', () => go(k), { signal }));
    go(0);
    return () => clearTimeout(t);
  });

  return null;
}
