'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useTransition } from 'react';

/**
 * Port of the theme's sn-facets.js: facet form / sort changes update the URL
 * (router.replace keeps it a soft navigation); the server re-renders the
 * filtered grid. Also drives the dual price-range slider.
 */
export default function FacetsBehavior({ hostId }: { hostId: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const [pending, start] = useTransition();

  useEffect(() => {
    document.getElementById(hostId)?.classList.toggle('is-loading', pending);
  }, [pending, hostId]);

  useEffect(() => {
    const h = document.getElementById(hostId);
    if (!h) return;
    const ac = new AbortController();
    const { signal } = ac;
    const params = () => {
      const p = new URLSearchParams();
      const f = h.querySelector<HTMLFormElement>('[data-sn-facets]');
      if (f) new FormData(f).forEach((v, k) => { if (v !== '' && v != null) p.append(k, String(v)); });
      const so = h.querySelector<HTMLSelectElement>('[data-sn-sort]');
      if (so) p.set('sort_by', so.value);
      return p;
    };
    const go = () => {
      const qs = params().toString();
      start(() => router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false }));
    };
    let t: ReturnType<typeof setTimeout> | undefined;
    h.addEventListener('change', (e) => {
      const el = e.target as HTMLElement;
      if (!(el.closest('[data-sn-facets]') || el.matches('[data-sn-sort]')) || el.matches('[data-sn-pr]')) return;
      clearTimeout(t);
      t = setTimeout(go, (el as HTMLInputElement).type === 'number' ? 600 : 120);
    }, { signal });
    h.addEventListener('submit', (e) => {
      if (!(e.target as HTMLElement).matches('[data-sn-facets]')) return;
      e.preventDefault();
      go();
    }, { signal });

    /* dual range slider (re-bound when the form remounts) */
    const bindPrices = () => {
      h.querySelectorAll<HTMLElement>('[data-sn-price]:not([data-on])').forEach((w) => {
        w.setAttribute('data-on', '');
        const rmin = w.querySelector<HTMLInputElement>('[data-sn-pr="min"]')!, rmax = w.querySelector<HTMLInputElement>('[data-sn-pr="max"]')!;
        const nmin = w.querySelector<HTMLInputElement>('[data-sn-pn="min"]')!, nmax = w.querySelector<HTMLInputElement>('[data-sn-pn="max"]')!;
        const max = +rmax.max || 1;
        const paint = () => { w.style.setProperty('--a', (+rmin.value / max) * 100 + '%'); w.style.setProperty('--b', (+rmax.value / max) * 100 + '%'); };
        const fromRange = (e: Event) => {
          if (+rmin.value > +rmax.value - 1) {
            if (e.target === rmin) rmin.value = String(+rmax.value - 1); else rmax.value = String(+rmin.value + 1);
          }
          nmin.value = +rmin.value > 0 ? rmin.value : '';
          nmax.value = +rmax.value < max ? rmax.value : '';
          paint();
        };
        rmin.addEventListener('input', fromRange);
        rmax.addEventListener('input', fromRange);
        [rmin, rmax].forEach((r) => r.addEventListener('change', () => nmin.dispatchEvent(new Event('change', { bubbles: true }))));
        [nmin, nmax].forEach((n) => n.addEventListener('input', () => { rmin.value = nmin.value || '0'; rmax.value = nmax.value || String(max); paint(); }));
        paint();
      });
    };
    bindPrices();
    const mo = new MutationObserver(() => {
      bindPrices();
      // cards re-rendered by a filter change need the reveal / wishlist pass
      window.SN?.reveal?.(h);
      window.SN?.wish?.paint?.();
    });
    mo.observe(h, { childList: true, subtree: true });
    const side = h.querySelector<HTMLDetailsElement>('.snms__side');
    if (side && innerWidth < 990) side.open = false;
    // CSS keeps the panel collapsed on mobile until this point (no layout shift)
    h.classList.add('is-fac-ready');
    return () => { ac.abort(); mo.disconnect(); clearTimeout(t); };
  }, [hostId, pathname, router]);

  return null;
}
