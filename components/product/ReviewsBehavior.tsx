'use client';

import { useSection } from '@/components/theme/useSection';

/** Port of the reviews "sky" script: star constellation cycles the quotes. */
export default function ReviewsBehavior({ id }: { id: string }) {
  useSection(id, (r) => {
    const stars = r.querySelectorAll<HTMLElement>('[data-snrv-star]'), qs = r.querySelectorAll('[data-snrv-q]');
    if (!stars.length) return;
    let i = 0, hov = false;
    const go = (k: number) => {
      i = k;
      stars.forEach((s, j) => s.classList.toggle('is-on', j === k));
      qs.forEach((q, j) => q.classList.toggle('is-on', j === k));
    };
    stars.forEach((s, j) => {
      s.addEventListener('click', () => go(j));
      s.addEventListener('mouseenter', () => go(j));
    });
    r.addEventListener('mouseenter', () => (hov = true));
    r.addEventListener('mouseleave', () => (hov = false));
    const t = setInterval(() => { if (!hov && !document.hidden) go((i + 1) % stars.length); }, 6000);
    return () => clearInterval(t);
  });
  return null;
}
