'use client';

import { useSection } from '@/components/theme/useSection';

/** Port of the categories hover-float script (desktop + hover devices only). */
export default function CategoriesBehavior({ id }: { id: string }) {
  useSection(id, (r, signal) => {
    const fl = r.querySelector<HTMLElement>('[data-sncat-float]');
    if (!fl || !matchMedia('(hover: hover) and (min-width: 990px)').matches) return;
    const fin = r.querySelector<HTMLElement>('[data-sncat-fin]')!;
    let x = 0, y = 0, tx = 0, ty = 0, vx = 0, raf: number | null = null, last: Element | null = null;
    const loop = () => {
      raf = null;
      const px = x;
      x += (tx - x) * 0.14;
      y += (ty - y) * 0.14;
      vx = x - px;
      fl.style.setProperty('--fx', x + 'px');
      fl.style.setProperty('--fy', y + 'px');
      fl.style.setProperty('--fr', Math.max(-12, Math.min(12, vx * 0.6)) + 'deg');
      if (Math.abs(tx - x) > 0.5 || Math.abs(ty - y) > 0.5) raf = requestAnimationFrame(loop);
    };
    r.querySelectorAll('[data-sncat-a]').forEach((a) => {
      a.addEventListener(
        'mouseenter',
        () => {
          const m = a.parentNode!.querySelector<HTMLElement>('[data-sncat-media]');
          if (m && last !== a) {
            const im = document.createElement('img');
            im.src = m.getAttribute('data-src')!;
            im.alt = '';
            im.width = 400;
            im.height = 500;
            fin.replaceChildren(im);
            last = a;
          }
          fl.classList.add('is-on');
        },
        { signal },
      );
      a.addEventListener('mouseleave', () => fl.classList.remove('is-on'), { signal });
    });
    r.addEventListener(
      'pointermove',
      (e) => {
        const w = fl.offsetWidth, h = fl.offsetHeight;
        tx = e.clientX + 30;
        ty = e.clientY - h / 2;
        if (tx + w > innerWidth - 20) tx = e.clientX - w - 30;
        if (!raf) raf = requestAnimationFrame(loop);
      },
      { signal },
    );
    return () => {
      if (raf) cancelAnimationFrame(raf);
      fin.replaceChildren();
    };
  });
  return null;
}
