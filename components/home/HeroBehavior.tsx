'use client';

import { useSection } from '@/components/theme/useSection';

/** Port of the hero section script: slide switching, auto-advance, swipe, parallax. */
export default function HeroBehavior({ id = 'snhero-template--23876058939495__hero' }: { id?: string }) {
  useSection(id, (r, signal) => {
    const bgs = r.querySelectorAll<HTMLElement>('[data-snhero-bg]'), txts = r.querySelectorAll<HTMLElement>('[data-snhero-txt]'), dots = r.querySelectorAll<HTMLElement>('[data-snhero-dot]');
    const cur = r.querySelector('[data-snhero-cur]'), vis = r.querySelector<HTMLElement>('[data-snhero-vis]');
    const n = txts.length, secs = parseFloat(r.getAttribute('data-auto') || '') || 0;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches || document.body.getAttribute('data-motion') === 'off';
    let i = 0, timer: ReturnType<typeof setTimeout> | undefined, tiltRaf = 0;
    r.style.setProperty('--dur', (secs || 7) + 's');
    const restart = () => {
      clearTimeout(timer);
      dots.forEach((d) => { const p = d.querySelector<SVGGraphicsElement>('.p'); if (p) { p.style.animation = 'none'; void p.getBBox(); p.style.animation = ''; } });
      if (secs > 0 && n > 1) timer = setTimeout(() => go(i + 1), secs * 1000);
    };
    const go = (k: number) => {
      if (n < 2) return;
      k = (k + n) % n;
      if (k === i) return;
      const prev = i;
      i = k;
      // the CSS-only entrance (hero.css) plays once; later slides use the transitions
      r.classList.remove('snhero--intro');
      bgs.forEach((b, j) => b.classList.toggle('is-on', j === k));
      txts[prev].classList.add('is-out');
      setTimeout(() => txts.forEach((t, j) => { t.classList.remove('is-out'); t.classList.toggle('is-on', j === k); t.setAttribute('aria-hidden', j === k ? 'false' : 'true'); }), 520);
      dots.forEach((d, j) => d.classList.toggle('is-on', j === k));
      if (cur) cur.textContent = (k < 9 ? '0' : '') + (k + 1);
      restart();
    };
    dots.forEach((d) => d.addEventListener('click', () => go(+d.getAttribute('data-snhero-dot')!), { signal }));
    r.addEventListener('mouseenter', () => { if (secs) { clearTimeout(timer); r.classList.add('is-paused'); } }, { signal });
    r.addEventListener('mouseleave', () => { if (secs && armed) { r.classList.remove('is-paused'); restart(); } }, { signal });
    let x0: number | null = null;
    r.addEventListener('touchstart', (e) => (x0 = e.touches[0].clientX), { passive: true, signal });
    r.addEventListener('touchend', (e) => {
      if (x0 == null) return;
      const dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 50) go(i + (dx < 0 ? 1 : -1));
      x0 = null;
    }, { signal });
    if (vis && !reduce && matchMedia('(hover: hover)').matches) {
      let tiltX = 0, tiltY = 0;
      r.addEventListener('pointermove', (e) => {
        tiltX = e.clientX; tiltY = e.clientY;
        if (tiltRaf) return;
        tiltRaf = requestAnimationFrame(() => {
          tiltRaf = 0;
          const b = r.getBoundingClientRect();
          vis.style.setProperty('--mx', ((tiltX - b.left) / b.width - 0.5).toFixed(3));
          vis.style.setProperty('--my', ((tiltY - b.top) / b.height - 0.5).toFixed(3));
        });
      }, { passive: true, signal });
    }
    // Auto-advance waits for the visitor's first tap, scroll or key press. Chrome
    // stops recording LCP at that moment; rotating earlier lets slide 2's large
    // artwork become a late LCP (~7s+) for anyone idle on the first screen.
    // The countdown ring is held with the existing paused state until then.
    let armed = false;
    const arm = () => {
      if (armed) return;
      armed = true;
      r.classList.remove('is-paused');
      restart();
    };
    if (secs > 0 && n > 1) {
      r.classList.add('is-paused');
      ['pointerdown', 'keydown', 'scroll', 'wheel', 'touchstart'].forEach((ev) => window.addEventListener(ev, arm, { once: true, passive: true, signal }));
    }
    return () => { clearTimeout(timer); if (tiltRaf) cancelAnimationFrame(tiltRaf); };
  });
  return null;
}
